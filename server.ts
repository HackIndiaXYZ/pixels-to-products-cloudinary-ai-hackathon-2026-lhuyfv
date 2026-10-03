import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import {
  initCloudinary,
  getConfigStatus,
  setRuntimeCredentials,
  testCloudinaryCredentials,
  uploadToCloudinary,
  createProcessedAssetRecord,
} from './server/cloudinary-service.js';
import { analyzeMediaWithAI, isGroqAvailable } from './server/groq-service.js';
import { INITIAL_PROCESSED_ASSETS, SAMPLE_PRESETS } from './server/sample-catalog.js';
import type { ProcessedAsset } from './src/types/pipeline.js';

dotenv.config();

// Load AI Studio platform secrets if present in /app/.dev.env.json
try {
  const devEnvPath = '/app/.dev.env.json';
  if (fs.existsSync(devEnvPath)) {
    const raw = fs.readFileSync(devEnvPath, 'utf8');
    const parsed = JSON.parse(raw);
    for (const [key, val] of Object.entries(parsed)) {
      if (typeof val === 'string' && val.trim()) {
        process.env[key] = val.trim();
      }
    }
  }
} catch {
  // Ignore if not present
}

initCloudinary();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Increase body limit for image payloads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// In-memory registry for assets processed during the current runtime
let processedAssets: ProcessedAsset[] = [...INITIAL_PROCESSED_ASSETS];

// In-memory store for uploaded media buffers so images are always servable locally
const mediaBufferStore = new Map<string, { buffer: Buffer; mimeType: string }>();

// --- API Endpoints ---

// 0. Dedicated raw media server for uploaded / processed assets
app.get('/api/media/:id', (req, res) => {
  const item = mediaBufferStore.get(req.params.id);
  if (item) {
    res.setHeader('Content-Type', item.mimeType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(item.buffer);
    return;
  }
  res.status(404).send('Image not found');
});

// 1. Health check & configuration status
app.get('/api/status', (req, res) => {
  const status = getConfigStatus();
  res.json({
    ...status,
    geminiConfigured: isGroqAvailable(),
    totalAssets: processedAssets.length,
  });
});

// 2. Update runtime Cloudinary credentials
app.post('/api/configure', (req, res) => {
  const { cloudName, apiKey, apiSecret } = req.body;
  if (!cloudName) {
    res.status(400).json({ error: 'Cloud name is required' });
    return;
  }
  setRuntimeCredentials(cloudName, apiKey || '', apiSecret || '');
  res.json({
    success: true,
    status: getConfigStatus(),
  });
});

// 2b. Test Cloudinary credentials before saving
app.post('/api/test-credentials', async (req, res) => {
  try {
    const { cloudName, apiKey, apiSecret } = req.body;
    const result = await testCloudinaryCredentials(cloudName || '', apiKey || '', apiSecret || '');
    res.json(result);
  } catch (err: any) {
    res.json({ success: false, message: err?.message || 'Verification failed' });
  }
});

// 3. Get pre-indexed sample media items
app.get('/api/samples', (req, res) => {
  res.json({ samples: SAMPLE_PRESETS });
});

// 4. Asset library list with search and tag filtering
app.get('/api/assets', (req, res) => {
  const { search, tag } = req.query;
  let results = [...processedAssets];

  if (typeof search === 'string' && search.trim()) {
    const query = search.trim().toLowerCase();
    results = results.filter(
      (a) =>
        a.publicId.toLowerCase().includes(query) ||
        a.intelligence.detectedSubject.toLowerCase().includes(query) ||
        a.intelligence.category.toLowerCase().includes(query) ||
        a.intelligence.tags.some((t) => t.toLowerCase().includes(query))
    );
  }

  if (typeof tag === 'string' && tag.trim()) {
    const tagQuery = tag.trim().toLowerCase();
    results = results.filter((a) =>
      a.intelligence.tags.some((t) => t.toLowerCase() === tagQuery)
    );
  }

  res.json({ assets: results, total: results.length });
});

// 5. Get single asset by ID
app.get('/api/assets/:id', (req, res) => {
  const asset = processedAssets.find(
    (a) => a.id === req.params.id || a.publicId === req.params.id
  );
  if (!asset) {
    res.status(404).json({ error: 'Asset not found' });
    return;
  }
  res.json({ asset });
});

// 6. Primary Pipeline Upload & Processing
app.post('/api/upload', async (req, res) => {
  try {
    const { imageBase64, sampleId, fileName, mimeType } = req.body;

    let fileToProcess = '';
    let resolvedFileName = fileName || 'asset';
    let localMediaUrl = '';

    if (sampleId) {
      const sample = SAMPLE_PRESETS.find((s) => s.id === sampleId);
      if (sample) {
        resolvedFileName = sample.id;
        localMediaUrl = sample.thumbnailUrl;
        // Check if sample image exists on disk
        const localPath = path.resolve('.' + sample.thumbnailUrl);
        if (fs.existsSync(localPath)) {
          const buffer = fs.readFileSync(localPath);
          fileToProcess = `data:image/jpeg;base64,${buffer.toString('base64')}`;
        } else {
          fileToProcess = sample.thumbnailUrl;
        }
      }
    } else if (imageBase64) {
      fileToProcess = imageBase64;
      const mediaId = `upload_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      try {
        const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
        const buffer = Buffer.from(base64Data, 'base64');
        mediaBufferStore.set(mediaId, {
          buffer,
          mimeType: mimeType || 'image/jpeg',
        });
        localMediaUrl = `/api/media/${mediaId}`;
      } catch {
        localMediaUrl = imageBase64;
      }
    }

    if (!fileToProcess) {
      res.status(400).json({ error: 'No image source provided for processing' });
      return;
    }

    // Step 1: Upload to Cloudinary (using localMediaUrl for reliable fallback in demo mode)
    console.log(`[RE:FRAME Pipeline] Ingesting to Cloudinary: ${resolvedFileName}`);
    const uploadRes = await uploadToCloudinary(fileToProcess, resolvedFileName, localMediaUrl, sampleId || resolvedFileName);

    // Step 2: Understand & Analyze with AI
    console.log(`[RE:FRAME Pipeline] AI Understanding for ${uploadRes.public_id}`);
    const intelligence = await analyzeMediaWithAI(
      fileToProcess,
      mimeType || 'image/jpeg',
      {
        tags: uploadRes.tags,
        colors: uploadRes.colors,
        predominant: uploadRes.predominant,
        width: uploadRes.width,
        height: uploadRes.height,
      }
    );

    // Step 3: Build destination transformations and readiness scorecard
    const config = getConfigStatus();
    const processedAsset = createProcessedAssetRecord(
      uploadRes,
      config.cloudName,
      intelligence,
      localMediaUrl || uploadRes.secure_url
    );

    // Add to current registry
    processedAssets.unshift(processedAsset);

    console.log(`[RE:FRAME Pipeline] Successfully processed asset ${processedAsset.id}`);
    res.json({
      success: true,
      asset: processedAsset,
    });
  } catch (err: any) {
    console.log('[RE:FRAME Pipeline] Processing notice:', err?.message || err);
    res.status(500).json({
      error: err.message || "We couldn't process this asset. Please try again.",
    });
  }
});

// Ensure API errors always return structured JSON instead of default Express HTML error pages
app.use('/api', (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err?.type === 'entity.too.large' || err?.status === 413) {
    res.status(413).json({
      error: 'The uploaded file payload is too large. Please select an image under 15MB.',
    });
    return;
  }
  res.status(err?.status || 500).json({
    error: err?.message || 'An unexpected server error occurred.',
  });
});

// --- Server Lifecycle: Dev vs Prod ---
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Development mode: Vite middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve built static files
    const distPath = path.resolve(path.dirname(new URL(import.meta.url).pathname), '.');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[RE:FRAME AI] Server listening on port ${PORT} in ${isProd ? 'production' : 'development'} mode.`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
