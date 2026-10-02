import { GoogleGenAI } from '@google/genai';
import type { MediaIntelligence } from '../src/types/pipeline.js';

let aiInstance: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export function isGeminiAvailable(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

export async function analyzeMediaWithAI(
  imageBase64OrUrl: string,
  mimeType: string = 'image/jpeg',
  cloudinaryMeta?: {
    tags?: string[];
    colors?: [string, number][];
    predominant?: Record<string, [string, number][]>;
    width?: number;
    height?: number;
  }
): Promise<MediaIntelligence> {
  const ai = getAIClient();

  if (ai) {
    try {
      // Prepare content parts
      const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

      // Check if imageBase64OrUrl is a data URL or base64
      let base64Data = '';
      if (imageBase64OrUrl.startsWith('data:')) {
        base64Data = imageBase64OrUrl.split(',')[1] || '';
      } else if (!imageBase64OrUrl.startsWith('http://') && !imageBase64OrUrl.startsWith('https://')) {
        base64Data = imageBase64OrUrl;
      }

      if (base64Data) {
        parts.push({
          inlineData: {
            mimeType,
            data: base64Data,
          },
        });
      }

      const prompt = `You are the AI engine of RE:FRAME AI, an intelligent media readiness pipeline.
Analyze this media asset thoroughly and return a valid JSON object matching this schema:
{
  "detectedSubject": "e.g. Athletic Running Sneaker / Executive Portrait / Luxury Smartwatch",
  "category": "e.g. Footwear / E-Commerce / Consumer Tech / Portrait",
  "subcategory": "e.g. Running Shoes / Studio Portrait / Wearables",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"],
  "contentSafety": "Safe", // "Safe" | "Warning" | "Flagged"
  "safetyDetails": {
    "adult": "Very Unlikely",
    "violence": "Very Unlikely",
    "medical": "Very Unlikely",
    "racy": "Very Unlikely"
  },
  "composition": {
    "subjectPlacement": "Centered" | "Rule of Thirds" | "Asymmetric",
    "backgroundComplexity": "Simple" | "Moderate" | "Distracting",
    "recommendedCrop": "e.g. 1:1 Square with subject pad / 16:9 Landscape / 4:5 Portrait",
    "aspectRatio": "e.g. 4:3 or 16:9",
    "contrast": "High" | "Medium" | "Soft",
    "lighting": "Studio diffuse" | "Natural morning" | "High key" | "Low key"
  },
  "dominantColors": [
    { "hex": "#...", "name": "Color Name", "percentage": 40 }
  ]
}

Ensure tags are practical for e-commerce, social, and search discovery.
Output ONLY raw JSON.`;

      parts.push({ text: prompt });

      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: parts,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const responseText = result.text?.trim() || '';
      if (responseText) {
        const parsed = JSON.parse(responseText);
        return {
          detectedSubject: parsed.detectedSubject || 'Commercial Product',
          category: parsed.category || 'Product Photography',
          subcategory: parsed.subcategory || 'Commercial Asset',
          tags: Array.isArray(parsed.tags) ? parsed.tags : ['media', 'asset', 'photography'],
          contentSafety: parsed.contentSafety || 'Safe',
          safetyDetails: parsed.safetyDetails || {
            adult: 'Very Unlikely',
            violence: 'Very Unlikely',
            medical: 'Very Unlikely',
            racy: 'Very Unlikely',
          },
          composition: parsed.composition || {
            subjectPlacement: 'Centered',
            backgroundComplexity: 'Moderate',
            recommendedCrop: '1:1 Square Pad / 16:9 Hero',
            aspectRatio: '4:3',
            contrast: 'Medium',
            lighting: 'Natural diffused',
          },
          dominantColors: Array.isArray(parsed.dominantColors) && parsed.dominantColors.length > 0
            ? parsed.dominantColors
            : [
                { hex: '#1E293B', name: 'Slate Gray', percentage: 45 },
                { hex: '#F1F5F9', name: 'Off White', percentage: 35 },
                { hex: '#0EA5E9', name: 'Ocean Accent', percentage: 20 },
              ],
        };
      }
    } catch (err) {
      console.warn('Gemini multimodal analysis error, falling back to heuristic engine:', err);
    }
  }

  // Graceful heuristic engine (using Cloudinary metadata when provided)
  const existingTags = cloudinaryMeta?.tags || ['commercial', 'studio', 'product', 'ready-to-use'];
  const dominantColors = cloudinaryMeta?.colors?.slice(0, 4).map(([hex, pct]) => ({
    hex,
    name: getColorName(hex),
    percentage: Math.round(pct),
  })) || [
    { hex: '#0F172A', name: 'Deep Slate', percentage: 42 },
    { hex: '#F8FAFC', name: 'Pure Neutral', percentage: 38 },
    { hex: '#3B82F6', name: 'Cobalt Blue', percentage: 20 },
  ];

  return {
    detectedSubject: 'Commercial Product Asset',
    category: 'Commercial Media',
    subcategory: 'Studio Showcase',
    tags: existingTags.length > 0 ? existingTags : ['commercial', 'product', 'studio', 'clean', 'asset'],
    contentSafety: 'Safe',
    safetyDetails: {
      adult: 'Very Unlikely',
      violence: 'Very Unlikely',
      medical: 'Very Unlikely',
      racy: 'Very Unlikely',
    },
    composition: {
      subjectPlacement: 'Centered',
      backgroundComplexity: 'Moderate',
      recommendedCrop: '1:1 Marketplace / 16:9 Banner',
      aspectRatio: cloudinaryMeta?.width && cloudinaryMeta?.height
        ? `${cloudinaryMeta.width}:${cloudinaryMeta.height}`
        : '4:3',
      contrast: 'High',
      lighting: 'Studio Diffused',
    },
    dominantColors,
  };
}

function getColorName(hex: string): string {
  const clean = hex.replace('#', '').toLowerCase();
  if (clean.startsWith('f') || clean.startsWith('e')) return 'Light Neutral';
  if (clean.startsWith('0') || clean.startsWith('1')) return 'Deep Onyx';
  if (clean.startsWith('3') || clean.startsWith('4')) return 'Slate Tone';
  if (clean.startsWith('d') || clean.startsWith('c')) return 'Warm Amber';
  return 'Primary Tone';
}
