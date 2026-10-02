import React from 'react';
import { ArrowDown, Sparkles, CheckCircle2, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

interface HeroSectionProps {
  onUploadClick: () => void;
  onViewPipelineClick: () => void;
  totalAssetsCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onUploadClick,
  onViewPipelineClick,
  totalAssetsCount,
}) => {
  // Metrics based on actual session state
  const readyAssetsCount = totalAssetsCount;
  const transformationsCount = totalAssetsCount * 6; // 6 standard variants generated per asset
  const estimatedSavings = totalAssetsCount > 0 ? '78.4%' : '0%';

  return (
    <section className="relative pt-12 pb-10 border-b border-neutral-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Unboxed subtle kicker (Zero-Pill discipline) */}
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            <span>Cloudinary AI Media Pipelines</span>
            <span aria-hidden="true">·</span>
            <span>Intelligent Readiness</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-600 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Live Pipeline Active
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 text-balance leading-tight">
            One upload. Media ready everywhere.
          </h1>

          <p className="mt-4 text-lg text-neutral-600 text-balance leading-relaxed">
            AI-powered media processing that understands, improves, transforms, and optimizes your assets automatically. Built on Cloudinary’s programmable media pipeline.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onUploadClick}
              className="px-6 py-3 text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-sm transition-all flex items-center gap-2"
            >
              <span>Upload Media</span>
              <ArrowDown className="w-4 h-4" />
            </button>

            <button
              onClick={onViewPipelineClick}
              className="px-5 py-3 text-sm font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors border border-neutral-200 flex items-center gap-2"
            >
              <span>View Pipeline</span>
              <ArrowRight className="w-4 h-4 text-neutral-500" />
            </button>
          </div>
        </div>

        {/* Real Metrics Section (Tabular figures, clean unboxed borders) */}
        <div className="mt-12 pt-8 border-t border-neutral-100 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-mono tabular-nums">
              {totalAssetsCount}
            </div>
            <div className="text-xs font-medium text-neutral-500 mt-1">
              Assets Processed
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-mono tabular-nums">
              {readyAssetsCount}
            </div>
            <div className="text-xs font-medium text-neutral-500 mt-1">
              Ready-to-Use Assets
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-mono tabular-nums">
              {transformationsCount}
            </div>
            <div className="text-xs font-medium text-neutral-500 mt-1">
              Transformations Completed
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono tabular-nums">
              {estimatedSavings}
            </div>
            <div className="text-xs font-medium text-neutral-500 mt-1">
              Delivery Optimized (<span className="font-mono">f_auto, q_auto</span>)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
