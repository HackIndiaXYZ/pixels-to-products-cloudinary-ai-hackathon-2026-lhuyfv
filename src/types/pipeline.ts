export type PipelineStageKey = 'UPLOAD' | 'UNDERSTAND' | 'ANALYZE' | 'TRANSFORM' | 'OPTIMIZE' | 'READY';

export type StageStatus = 'waiting' | 'processing' | 'completed' | 'failed';

export interface StageState {
  key: PipelineStageKey;
  label: string;
  description: string;
  status: StageStatus;
  startedAt?: number;
  completedAt?: number;
  details?: string;
}

export interface MediaIntelligence {
  detectedSubject: string;
  category: string;
  subcategory: string;
  tags: string[];
  contentSafety: 'Safe' | 'Warning' | 'Flagged';
  safetyDetails: {
    adult: string;
    violence: string;
    medical: string;
    racy: string;
  };
  composition: {
    subjectPlacement: string;
    backgroundComplexity: 'Simple' | 'Moderate' | 'Distracting';
    recommendedCrop: string;
    aspectRatio: string;
    contrast: string;
    lighting: string;
  };
  dominantColors: {
    hex: string;
    name: string;
    percentage?: number;
  }[];
}

export interface ReadinessCheck {
  id: string;
  label: string;
  passed: boolean;
  score: number;
  details: string;
}

export interface ReadinessScore {
  overallScore: number;
  checks: ReadinessCheck[];
  recommendations: string[];
}

export interface DestinationVariant {
  id: string;
  name: string;
  target: 'Website' | 'Social' | 'Marketplace' | 'Mobile' | 'Cutout' | 'Enhanced';
  aspectRatio: string;
  aspectRatioLabel: string;
  width: number;
  height: number;
  transformationString: string;
  url: string;
  description: string;
  gravity: string;
  format: string;
  quality: string;
  estimatedBytes?: number;
}

export interface ProcessedAsset {
  id: string;
  publicId: string;
  cloudName: string;
  originalUrl: string;
  format: string;
  originalWidth: number;
  originalHeight: number;
  originalBytes: number;
  optimizedBytes?: number;
  createdAt: string;
  intelligence: MediaIntelligence;
  readiness: ReadinessScore;
  variants: DestinationVariant[];
  changesApplied: {
    title: string;
    description: string;
    active: boolean;
  }[];
  mediaPassport: {
    assetId: string;
    publicId: string;
    type: string;
    cloudName: string;
    cdnProtocol: string;
    shaChecksum: string;
    tags: string[];
    processingPipeline: string[];
    destinations: string[];
    status: 'Ready' | 'Processing' | 'Failed';
  };
  fallbackNotice?: string;
}

export interface CloudinaryConfigStatus {
  configured: boolean;
  cloudName: string;
  hasApiKey: boolean;
  hasApiSecret: boolean;
  mode: 'custom' | 'demo';
  geminiConfigured: boolean;
  isCloudNameValid?: boolean;
  cloudNameError?: string;
}

export interface SampleMediaItem {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnailUrl: string;
  aspectRatio: string;
  suggestedTags: string[];
}
