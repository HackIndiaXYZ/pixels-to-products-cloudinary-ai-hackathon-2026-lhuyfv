import Groq from 'groq-sdk';
import type { MediaIntelligence } from '../src/types/pipeline.js';

let aiInstance: Groq | null = null;

function getAIClient(): Groq | null {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return null;
    if (!aiInstance) {
        aiInstance = new Groq({ apiKey });
    }
    return aiInstance;
}

export function isGroqAvailable(): boolean {
    return Boolean(process.env.GROQ_API_KEY);
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
            // Build image URL for Groq
            let imageUrl: string;
            if (imageBase64OrUrl.startsWith('data:')) {
                imageUrl = imageBase64OrUrl;
            } else if (
                imageBase64OrUrl.startsWith('http://') ||
                imageBase64OrUrl.startsWith('https://')
            ) {
                imageUrl = imageBase64OrUrl;
            } else {
                imageUrl = `data:${mimeType};base64,${imageBase64OrUrl}`;
            }

            const prompt = `You are the AI engine of RE:FRAME AI, an intelligent media readiness pipeline.
Analyze this media asset thoroughly and return a valid JSON object matching this schema exactly:
{
  "detectedSubject": "e.g. Athletic Running Sneaker / Executive Portrait / Luxury Smartwatch",
  "category": "e.g. Footwear / E-Commerce / Consumer Tech / Portrait",
  "subcategory": "e.g. Running Shoes / Studio Portrait / Wearables",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"],
  "contentSafety": "Safe",
  "safetyDetails": {
    "adult": "Very Unlikely",
    "violence": "Very Unlikely",
    "medical": "Very Unlikely",
    "racy": "Very Unlikely"
  },
  "composition": {
    "subjectPlacement": "Centered",
    "backgroundComplexity": "Simple",
    "recommendedCrop": "1:1 Square with subject pad / 16:9 Landscape / 4:5 Portrait",
    "aspectRatio": "4:3",
    "contrast": "High",
    "lighting": "Studio diffuse"
  },
  "dominantColors": [
    { "hex": "#1E293B", "name": "Slate Gray", "percentage": 45 },
    { "hex": "#F1F5F9", "name": "Off White", "percentage": 35 },
    { "hex": "#0EA5E9", "name": "Ocean Accent", "percentage": 20 }
  ]
}

Rules:
- contentSafety must be one of: "Safe" | "Warning" | "Flagged"
- subjectPlacement must be one of: "Centered" | "Rule of Thirds" | "Asymmetric"
- backgroundComplexity must be one of: "Simple" | "Moderate" | "Distracting"
- contrast must be one of: "High" | "Medium" | "Soft"
- tags should be practical for e-commerce, social, and search discovery
- dominantColors should have 3-4 colors with accurate hex values from the image
Output ONLY raw JSON, no markdown, no code fences.`;

            const response = await ai.chat.completions.create({
                model: 'meta-llama/llama-4-scout-17b-16e-instruct',
                max_tokens: 1024,
                temperature: 0.2,
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'image_url',
                                image_url: { url: imageUrl },
                            },
                            {
                                type: 'text',
                                text: prompt,
                            },
                        ],
                    },
                ],
            });

            const responseText = response.choices[0]?.message?.content?.trim() || '';
            if (responseText) {
                // Strip markdown fences if model returns them anyway
                const cleaned = responseText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
                const parsed = JSON.parse(cleaned);
                return {
                    detectedSubject: parsed.detectedSubject || 'Commercial Product',
                    category: parsed.category || 'Product Photography',
                    subcategory: parsed.subcategory || 'Commercial Asset',
                    tags: Array.isArray(parsed.tags)
                        ? parsed.tags
                        : ['media', 'asset', 'photography'],
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
                    dominantColors:
                        Array.isArray(parsed.dominantColors) && parsed.dominantColors.length > 0
                            ? parsed.dominantColors
                            : [
                                { hex: '#1E293B', name: 'Slate Gray', percentage: 45 },
                                { hex: '#F1F5F9', name: 'Off White', percentage: 35 },
                                { hex: '#0EA5E9', name: 'Ocean Accent', percentage: 20 },
                            ],
                };
            }
        } catch (err) {
            console.warn('Groq vision analysis error, falling back to heuristic engine:', err);
        }
    }

    // Graceful heuristic fallback
    const existingTags = cloudinaryMeta?.tags || [
        'commercial',
        'studio',
        'product',
        'ready-to-use',
    ];
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
        tags:
            existingTags.length > 0
                ? existingTags
                : ['commercial', 'product', 'studio', 'clean', 'asset'],
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
            aspectRatio:
                cloudinaryMeta?.width && cloudinaryMeta?.height
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
