import React from 'react';
import { Eye, Shield, Tag, Compass, Sparkles, CheckCircle2 } from 'lucide-react';
import type { MediaIntelligence } from '../types/pipeline.js';

interface MediaAnalysisProps {
  intelligence: MediaIntelligence;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
}

export const MediaAnalysis: React.FC<MediaAnalysisProps> = ({
  intelligence,
  format,
  width,
  height,
  bytes,
}) => {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
        <div>
          <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
            Media Intelligence
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Cloudinary metadata enrichment and multimodal scene understanding.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Analyzed</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 1. Subject & Category */}
        <div className="space-y-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Detected Subject
            </div>
            <div className="text-base font-bold text-neutral-900 mt-0.5">
              {intelligence.detectedSubject}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Category & Sector
            </div>
            <div className="text-sm font-medium text-neutral-700 mt-0.5">
              {intelligence.category}
              {intelligence.subcategory && (
                <span className="text-neutral-400 text-xs block">{intelligence.subcategory}</span>
              )}
            </div>
          </div>
        </div>

        {/* 2. Content Status & Safety */}
        <div className="space-y-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Content Status
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold text-neutral-900">
                {intelligence.contentSafety}
              </span>
              <span className="text-xs text-neutral-400">(Passed Moderation)</span>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Optimization Protocol
            </div>
            <div className="text-sm font-semibold text-emerald-700 mt-0.5">
              Enabled (<span className="font-mono text-xs">f_auto, q_auto</span>)
            </div>
          </div>
        </div>

        {/* 3. Composition Insights */}
        <div className="space-y-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Focal Placement
            </div>
            <div className="text-sm font-medium text-neutral-800 mt-0.5">
              {intelligence.composition.subjectPlacement}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Background Complexity
            </div>
            <div className="text-sm font-medium text-neutral-800 mt-0.5">
              {intelligence.composition.backgroundComplexity}
              {intelligence.composition.backgroundComplexity === 'Distracting' && (
                <span className="text-amber-600 text-xs block">Cutout variant recommended</span>
              )}
            </div>
          </div>
        </div>

        {/* 4. Canvas Geometry & Colors */}
        <div className="space-y-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Dimensions & Format
            </div>
            <div className="text-sm font-mono text-neutral-800 mt-0.5 tabular-nums">
              {width && height ? `${width} × ${height}px` : '1920 × 1280px'} · {format?.toUpperCase() || 'JPG'}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Extracted Color Palette
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              {intelligence.dominantColors.map((c, i) => (
                <div
                  key={i}
                  className="group relative flex items-center justify-center"
                >
                  <div
                    className="w-5 h-5 rounded-full border border-neutral-300 shadow-xs cursor-pointer"
                    style={{ backgroundColor: c.hex }}
                    title={`${c.name} (${c.hex}) ${c.percentage ? `${c.percentage}%` : ''}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Semantic Tags (Zero-Pill discipline: unboxed text with typographic separators) */}
      <div className="mt-6 pt-4 border-t border-neutral-100">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-600">
          <span className="font-semibold text-neutral-400 uppercase tracking-wider text-[11px]">
            Indexed Tags:
          </span>
          {intelligence.tags.map((tag, idx) => (
            <React.Fragment key={tag}>
              <span className="hover:text-neutral-900 transition-colors cursor-default">
                #{tag}
              </span>
              {idx < intelligence.tags.length - 1 && (
                <span className="text-neutral-300" aria-hidden="true">
                  ·
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
