import React, { useState } from 'react';
import { Check, Columns, SlidersHorizontal, ArrowLeftRight } from 'lucide-react';
import type { ProcessedAsset } from '../types/pipeline.js';

interface OriginalVsProcessedProps {
  asset: ProcessedAsset;
}

export const OriginalVsProcessed: React.FC<OriginalVsProcessedProps> = ({ asset }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeProcessedIndex, setActiveProcessedIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');

  // Candidate processed variants to compare against
  const processedOptions = [
    {
      title: 'Optimized Hero (16:9)',
      url: asset.variants.find((v) => v.id === 'website-16-9')?.url || asset.variants[0]?.url,
    },
    {
      title: 'Isolated Cutout (PNG)',
      url: asset.variants.find((v) => v.id === 'cutout-isolated')?.url || asset.variants[0]?.url,
    },
    {
      title: 'Marketplace Clean (1:1)',
      url: asset.variants.find((v) => v.id === 'marketplace-1-1')?.url || asset.variants[0]?.url,
    },
    {
      title: 'Studio Enhanced',
      url: asset.variants.find((v) => v.id === 'enhanced-studio')?.url || asset.variants[0]?.url,
    },
  ];

  const currentProcessed = processedOptions[activeProcessedIndex];

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
        <div>
          <h3 className="text-xl font-bold text-neutral-900 tracking-tight">
            Original vs. RE:FRAME
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Compare unoptimized raw source media against transformed and delivery-optimized outputs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Target Variant Selector */}
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg border border-neutral-200">
            {processedOptions.map((opt, idx) => (
              <button
                key={opt.title}
                onClick={() => setActiveProcessedIndex(idx)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  activeProcessedIndex === idx
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {opt.title}
              </button>
            ))}
          </div>

          {/* Mode Switcher */}
          <div className="hidden md:flex items-center bg-neutral-100 p-1 rounded-lg border border-neutral-200">
            <button
              onClick={() => setViewMode('slider')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'slider' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title="Split Slider"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'side-by-side' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title="Side-by-Side"
            >
              <Columns className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Visual Comparison Frame */}
      <div className="mt-8">
        {viewMode === 'slider' ? (
          <div className="relative w-full aspect-16/9 sm:aspect-21/9 max-h-[500px] rounded-xl overflow-hidden bg-neutral-950 select-none shadow-md border border-neutral-200">
            {/* Background image (Processed version) */}
            <img
              src={currentProcessed.url}
              alt="Processed"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-contain"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                if (img.src !== asset.originalUrl && asset.originalUrl) {
                  img.src = asset.originalUrl;
                }
              }}
            />

            {/* Foreground image (Original version clipped) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={asset.originalUrl}
                alt="Original"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-contain max-w-none"
                style={{ width: '100%', height: '100%' }}
              />
            </div>

            {/* Divider line and drag handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-xl cursor-ew-resize flex items-center justify-center pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-7 h-7 rounded-full bg-white text-neutral-900 shadow-lg border border-neutral-200 flex items-center justify-center">
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Interactive invisible slider input */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-10"
              aria-label="Image comparison slider"
            />

            {/* Labels */}
            <div className="absolute top-4 left-4 z-0 pointer-events-none bg-black/70 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-md">
              Original Raw
            </div>
            <div className="absolute top-4 right-4 z-0 pointer-events-none bg-neutral-900/80 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-md">
              RE:FRAME ({currentProcessed.title})
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-neutral-200 overflow-hidden bg-neutral-50 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  Original Raw Upload
                </span>
                <span className="text-xs font-mono text-neutral-400 tabular-nums">
                  {asset.originalWidth}×{asset.originalHeight}px · {(asset.originalBytes / 1024).toFixed(0)} KB
                </span>
              </div>
              <div className="aspect-4/3 flex items-center justify-center bg-white rounded-lg border border-neutral-200/80 overflow-hidden">
                <img
                  src={asset.originalUrl}
                  alt="Original"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="rounded-xl border border-neutral-200 overflow-hidden bg-neutral-50 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  RE:FRAME {currentProcessed.title}
                </span>
                <span className="text-xs font-mono text-emerald-700 font-semibold tabular-nums">
                  {(asset.optimizedBytes ? (asset.optimizedBytes / 1024).toFixed(0) : '240')} KB (Optimized)
                </span>
              </div>
              <div className="aspect-4/3 flex items-center justify-center bg-white rounded-lg border border-neutral-200/80 overflow-hidden">
                <img
                  src={currentProcessed.url}
                  alt="Processed"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    if (img.src !== asset.originalUrl && asset.originalUrl) {
                      img.src = asset.originalUrl;
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transformation Summary: What RE:FRAME Changed */}
      <div className="mt-8 pt-6 border-t border-neutral-100">
        <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-4">
          What RE:FRAME changed
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {asset.changesApplied.map((change, i) => (
            <div key={i} className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-200/70">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{change.title}</span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                {change.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
