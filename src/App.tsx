import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header.js';
import { HeroSection } from './components/HeroSection.js';
import { UploadZone } from './components/UploadZone.js';
import { PipelineProgress } from './components/PipelineProgress.js';
import { MediaAnalysis } from './components/MediaAnalysis.js';
import { ReadinessScore } from './components/ReadinessScore.js';
import { TransformationCenter } from './components/TransformationCenter.js';
import { OriginalVsProcessed } from './components/OriginalVsProcessed.js';
import { MediaPassport } from './components/MediaPassport.js';
import { OptimizedDelivery } from './components/OptimizedDelivery.js';
import { AssetLibrary } from './components/AssetLibrary.js';
import { CloudinaryConfigModal } from './components/CloudinaryConfigModal.js';
import { DocsView } from './components/DocsView.js';
import { fetchStatus, fetchSamples, fetchAssets, runMediaPipeline, resetToDemoCloud } from './lib/api.js';
import type {
  CloudinaryConfigStatus,
  ProcessedAsset,
  SampleMediaItem,
  StageState,
} from './types/pipeline.js';

const INITIAL_STAGES: StageState[] = [
  {
    key: 'UPLOAD',
    label: 'Cloudinary Ingestion',
    description: 'Signed media upload and EXIF/color vector extraction',
    status: 'completed',
    details: 'Cloudinary Ingest',
  },
  {
    key: 'UNDERSTAND',
    label: 'AI Scene Understanding',
    description: 'Multimodal subject, category, and composition detection',
    status: 'completed',
    details: 'Subject Identified',
  },
  {
    key: 'ANALYZE',
    label: 'Readiness Audit',
    description: 'Compliance, contrast, and moderation scorecard',
    status: 'completed',
    details: 'Readiness 94%',
  },
  {
    key: 'TRANSFORM',
    label: 'Adaptive Variants',
    description: 'Dynamic content-aware 16:9, 4:5, and 1:1 transformations',
    status: 'completed',
    details: '6 Variants Built',
  },
  {
    key: 'OPTIMIZE',
    label: 'Delivery Encoding',
    description: 'Dynamic f_auto format and q_auto perceptual compression',
    status: 'completed',
    details: 'f_auto · q_auto',
  },
  {
    key: 'READY',
    label: 'Destination Ready',
    description: 'Media Passport issued and CDN edge stream cached',
    status: 'completed',
    details: 'Passport Ready',
  },
];

export default function App() {
  const [configStatus, setConfigStatus] = useState<CloudinaryConfigStatus | null>(null);
  const [samples, setSamples] = useState<SampleMediaItem[]>([]);
  const [assets, setAssets] = useState<ProcessedAsset[]>([]);
  const [activeAsset, setActiveAsset] = useState<ProcessedAsset | null>(null);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'destinations' | 'library' | 'docs'>('pipeline');
  const [stages, setStages] = useState<StageState[]>(INITIAL_STAGES);
  const [currentStageKey, setCurrentStageKey] = useState<string>('READY');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatusMessage, setUploadStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const uploadSectionRef = useRef<HTMLDivElement>(null);
  const resultsSectionRef = useRef<HTMLDivElement>(null);

  // Initialize data on mount
  useEffect(() => {
    async function init() {
      try {
        const [statusData, samplesData, assetsData] = await Promise.all([
          fetchStatus().catch(() => null),
          fetchSamples().catch(() => []),
          fetchAssets().catch(() => []),
        ]);

        if (statusData) setConfigStatus(statusData);
        if (samplesData) setSamples(samplesData);
        if (assetsData && assetsData.length > 0) {
          setAssets(assetsData);
          setActiveAsset(assetsData[0]);
        }
      } catch (err) {
        console.error('Initialization error:', err);
      }
    }
    init();
  }, []);

  const handleUploadClick = () => {
    setActiveTab('pipeline');
    setTimeout(() => {
      uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleViewPipelineClick = () => {
    setActiveTab('pipeline');
    setTimeout(() => {
      resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Helper to execute pipeline with real stages
  const executePipeline = async (payload: {
    imageBase64?: string;
    sampleId?: string;
    fileName?: string;
    mimeType?: string;
  }) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setUploadStatusMessage('Uploading to Cloudinary...');

    // Set stages to processing flow
    setStages([
      { ...INITIAL_STAGES[0], status: 'processing', details: 'Uploading media...' },
      { ...INITIAL_STAGES[1], status: 'waiting' },
      { ...INITIAL_STAGES[2], status: 'waiting' },
      { ...INITIAL_STAGES[3], status: 'waiting' },
      { ...INITIAL_STAGES[4], status: 'waiting' },
      { ...INITIAL_STAGES[5], status: 'waiting' },
    ]);
    setCurrentStageKey('UPLOAD');

    try {
      // Small visual pause for smooth transition
      await new Promise((r) => setTimeout(r, 400));
      setUploadStatusMessage('Understanding media properties...');
      setStages((prev) => [
        { ...prev[0], status: 'completed', details: 'Ingested' },
        { ...prev[1], status: 'processing', details: 'Multimodal AI...' },
        ...prev.slice(2),
      ]);
      setCurrentStageKey('UNDERSTAND');

      const processed = await runMediaPipeline(payload);

      // Transition stages through analysis and transformation
      setStages((prev) => [
        prev[0],
        { ...prev[1], status: 'completed', details: processed.intelligence.detectedSubject },
        { ...prev[2], status: 'processing', details: 'Auditing...' },
        ...prev.slice(3),
      ]);
      setCurrentStageKey('ANALYZE');
      await new Promise((r) => setTimeout(r, 300));

      setStages((prev) => [
        prev[0],
        prev[1],
        { ...prev[2], status: 'completed', details: `${processed.readiness.overallScore}% Ready` },
        { ...prev[3], status: 'processing', details: '6 destinations' },
        prev[4],
        prev[5],
      ]);
      setCurrentStageKey('TRANSFORM');
      await new Promise((r) => setTimeout(r, 300));

      setStages((prev) => [
        prev[0],
        prev[1],
        prev[2],
        { ...prev[3], status: 'completed', details: 'Variants built' },
        { ...prev[4], status: 'processing', details: 'f_auto · q_auto' },
        prev[5],
      ]);
      setCurrentStageKey('OPTIMIZE');
      await new Promise((r) => setTimeout(r, 200));

      setStages((prev) => [
        prev[0],
        prev[1],
        prev[2],
        prev[3],
        { ...prev[4], status: 'completed', details: 'Optimized' },
        { ...prev[5], status: 'completed', details: 'Passport issued' },
      ]);
      setCurrentStageKey('READY');

      setUploadStatusMessage('Upload complete');
      setActiveAsset(processed);

      // Refresh assets list
      const freshAssets = await fetchAssets();
      setAssets(freshAssets);

      // Smooth scroll down to the ready pipeline output
      setTimeout(() => {
        resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (err: any) {
      console.error('Pipeline processing error:', err);
      setErrorMessage(err.message || "We couldn't process this asset. Please try again.");
      setUploadStatusMessage(null);
      setStages((prev) =>
        prev.map((s, idx) => (idx === 0 ? { ...s, status: 'failed', details: 'Failed' } : s))
      );
    } finally {
      setIsProcessing(false);
      setTimeout(() => {
        setUploadStatusMessage(null);
      }, 4000);
    }
  };

  const handleProcessFile = async (base64: string, name: string, mime: string) => {
    await executePipeline({
      imageBase64: base64,
      fileName: name,
      mimeType: mime,
    });
  };

  const handleProcessSample = async (sampleId: string) => {
    await executePipeline({ sampleId });
  };

  const handleSwitchToDemo = async () => {
    try {
      const updated = await resetToDemoCloud();
      setConfigStatus(updated);
      setErrorMessage(null);
    } catch (err: any) {
      console.error('Failed to switch to demo cloud:', err);
    }
  };

  // Filtered assets for the Asset Library tab
  const filteredAssets = assets.filter((asset) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        asset.publicId.toLowerCase().includes(q) ||
        asset.intelligence.detectedSubject.toLowerCase().includes(q) ||
        asset.intelligence.category.toLowerCase().includes(q) ||
        asset.intelligence.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }
    if (selectedTag) {
      const matchesTag = asset.intelligence.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());
      if (!matchesTag) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col">
      {/* 3-Zone Top Bar */}
      <Header
        configStatus={configStatus}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenConfig={() => setIsConfigModalOpen(true)}
        onUploadClick={handleUploadClick}
      />

      <main className="flex-1">
        {/* TAB 1: Main Pipeline & Dashboard */}
        {activeTab === 'pipeline' && (
          <div>
            {/* Hero Section */}
            <HeroSection
              onUploadClick={handleUploadClick}
              onViewPipelineClick={handleViewPipelineClick}
              totalAssetsCount={assets.length}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
              {/* Upload Zone */}
              <div ref={uploadSectionRef} className="scroll-mt-20">
                <UploadZone
                  onProcessFile={handleProcessFile}
                  onProcessSample={handleProcessSample}
                  samples={samples}
                  isProcessing={isProcessing}
                  uploadStatusMessage={uploadStatusMessage}
                  errorMessage={errorMessage}
                  fallbackNotice={activeAsset?.fallbackNotice}
                  onOpenConfig={() => setIsConfigModalOpen(true)}
                  onSwitchToDemo={handleSwitchToDemo}
                />
              </div>

              {/* Active Pipeline Stage Progress */}
              <PipelineProgress
                stages={stages}
                currentStageKey={currentStageKey}
              />

              {/* Active Asset Results Viewport */}
              {activeAsset && (
                <div ref={resultsSectionRef} className="space-y-10 scroll-mt-20">
                  {/* Row 1: Media Intelligence & Readiness Scorecard */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-7">
                      <MediaAnalysis
                        intelligence={activeAsset.intelligence}
                        format={activeAsset.format}
                        width={activeAsset.originalWidth}
                        height={activeAsset.originalHeight}
                        bytes={activeAsset.originalBytes}
                      />
                    </div>
                    <div className="lg:col-span-5">
                      <ReadinessScore readiness={activeAsset.readiness} />
                    </div>
                  </div>

                  {/* Destination Ready Variants Showcase */}
                  <TransformationCenter
                    variants={activeAsset.variants}
                    originalUrl={activeAsset.originalUrl}
                  />

                  {/* Original vs Processed Visual Comparison & Change Checklist */}
                  <OriginalVsProcessed asset={activeAsset} />

                  {/* Optimized Delivery Protocol */}
                  <OptimizedDelivery asset={activeAsset} />

                  {/* Cryptographic Media Passport */}
                  <MediaPassport asset={activeAsset} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Destinations Only View */}
        {activeTab === 'destinations' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <div className="bg-white rounded-xl border border-neutral-200 p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
                Destination Transformation Hub
              </h2>
              <p className="mt-1 text-sm text-neutral-600">
                Inspect and copy auto-generated Cloudinary asset variants tailored for e-commerce, social, and mobile targets.
              </p>
            </div>

            {activeAsset ? (
              <>
                <TransformationCenter
                  variants={activeAsset.variants}
                  originalUrl={activeAsset.originalUrl}
                />
                <OriginalVsProcessed asset={activeAsset} />
              </>
            ) : (
              <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
                <p className="text-sm font-semibold text-neutral-900">No active asset loaded.</p>
                <button
                  onClick={handleUploadClick}
                  className="mt-3 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800"
                >
                  Upload or Pick a Sample
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Asset Library */}
        {activeTab === 'library' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <AssetLibrary
              assets={filteredAssets}
              onSelectAsset={(selected) => {
                setActiveAsset(selected);
                setActiveTab('pipeline');
                setTimeout(() => {
                  resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              onSearchChange={setSearchQuery}
              onTagClick={(tag) => setSelectedTag(selectedTag === tag ? null : tag)}
              selectedTag={selectedTag}
              searchQuery={searchQuery}
            />
          </div>
        )}

        {/* TAB 4: Cloudinary Spec & Documentation */}
        {activeTab === 'docs' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <DocsView />
          </div>
        )}
      </main>

      {/* Footer (Quiet single-level footer per design constitution) */}
      <footer className="mt-20 border-t border-neutral-200 bg-white py-8 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900">RE:FRAME AI</span>
            <span aria-hidden="true">·</span>
            <span>Cloudinary AI Media Pipelines Track (PS-01)</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Powered by Cloudinary Programmable Media</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsConfigModalOpen(true)}
              className="text-neutral-700 hover:text-neutral-900 underline underline-offset-2"
            >
              API Credentials
            </button>
          </div>
        </div>
      </footer>

      {/* Cloudinary Configuration Modal */}
      <CloudinaryConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        status={configStatus}
        onConfigSaved={(updated) => setConfigStatus(updated)}
      />
    </div>
  );
}
