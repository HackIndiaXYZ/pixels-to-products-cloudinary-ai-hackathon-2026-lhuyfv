import type {
  CloudinaryConfigStatus,
  ProcessedAsset,
  SampleMediaItem,
} from '../types/pipeline.js';

async function safelyParseResponse(res: Response): Promise<any> {
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      return await res.json();
    } catch {
      // Fall through to text handling if JSON syntax fails
    }
  }

  const rawText = await res.text();

  if (res.status === 413 || rawText.includes('413 Request Entity Too Large') || rawText.includes('PayloadTooLargeError')) {
    return {
      error: 'The uploaded file exceeds the gateway payload limit. Please select an image under 15MB.',
    };
  }

  if (
    res.status === 502 ||
    res.status === 503 ||
    res.status === 504 ||
    rawText.includes('warmup.html') ||
    rawText.includes('Gateway Time-out') ||
    rawText.includes('Bad Gateway')
  ) {
    return {
      error: 'The media processing service is temporarily warming up. Please try again in a few seconds.',
    };
  }

  if (rawText.trim().startsWith('<')) {
    return {
      error: `Server gateway returned status ${res.status}. Please try again shortly.`,
    };
  }

  return { error: rawText || `Request failed with status ${res.status}` };
}

export async function fetchStatus(): Promise<CloudinaryConfigStatus & { totalAssets: number }> {
  const res = await fetch('/api/status');
  const data = await safelyParseResponse(res);
  if (!res.ok || data.error) {
    throw new Error(data.error || 'Failed to retrieve status');
  }
  return data;
}

export async function fetchSamples(): Promise<SampleMediaItem[]> {
  const res = await fetch('/api/samples');
  const data = await safelyParseResponse(res);
  if (!res.ok || !data.samples) {
    throw new Error(data.error || 'Failed to fetch sample media');
  }
  return data.samples;
}

export async function fetchAssets(query?: { search?: string; tag?: string }): Promise<ProcessedAsset[]> {
  const params = new URLSearchParams();
  if (query?.search) params.append('search', query.search);
  if (query?.tag) params.append('tag', query.tag);

  const res = await fetch(`/api/assets?${params.toString()}`);
  const data = await safelyParseResponse(res);
  if (!res.ok || !data.assets) {
    throw new Error(data.error || 'Failed to load asset catalog');
  }
  return data.assets;
}

export async function saveCloudinaryConfig(credentials: {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}): Promise<CloudinaryConfigStatus> {
  const res = await fetch('/api/configure', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const data = await safelyParseResponse(res);
  if (!res.ok || !data.status) {
    throw new Error(data.error || 'Failed to update credentials');
  }
  return data.status;
}

export async function testCredentials(credentials: {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch('/api/test-credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await safelyParseResponse(res);
    return data;
  } catch (err: any) {
    return { success: false, message: err?.message || 'Verification check failed' };
  }
}

export async function resetToDemoCloud(): Promise<CloudinaryConfigStatus> {
  return saveCloudinaryConfig({
    cloudName: 'demo',
    apiKey: '',
    apiSecret: '',
  });
}

export async function runMediaPipeline(payload: {
  imageBase64?: string;
  sampleId?: string;
  fileName?: string;
  mimeType?: string;
}): Promise<ProcessedAsset> {
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await safelyParseResponse(res);

  if (!res.ok || !data?.asset) {
    throw new Error(data?.error || "We couldn't process this asset. Please try again.");
  }

  return data.asset;
}
