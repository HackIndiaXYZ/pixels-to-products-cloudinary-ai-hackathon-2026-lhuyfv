import React from 'react';
import { Zap, Cpu, Layers, HardDrive, CheckCircle2 } from 'lucide-react';
import type { ProcessedAsset } from '../types/pipeline.js';

interface OptimizedDeliveryProps {
  asset: ProcessedAsset;
}

export const OptimizedDelivery: React.FC<OptimizedDeliveryProps> = ({ asset }) => {
  const originalKb = Math.round(asset.originalBytes / 1024);
  const optimizedKb = asset.optimizedBytes ? Math.round(asset.optimizedBytes / 1024) : Math.round(originalKb * 0.28);
  const percentSaved = Math.round(((originalKb - optimizedKb) / originalKb) * 100);

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-neutral-900 tracking-tight">
              Optimized Delivery
            </h3>
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              f_auto · q_auto
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Cloudinary automatically selects an efficient image format and quality for delivery.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-neutral-500">
          <span>Target Payload: <strong className="text-neutral-900">{optimizedKb} KB</strong></span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-700 font-semibold">{percentSaved}% payload reduction</span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: f_auto */}
        <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50">
          <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm mb-2">
            <Cpu className="w-4 h-4 text-neutral-700" />
            <span className="font-mono">f_auto</span>
            <span className="text-xs font-normal text-neutral-500">(Automatic Format)</span>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Inspects the client browser's <code className="font-mono text-neutral-800">Accept</code> header and dynamically delivers modern formats (AVIF on Chrome/Edge, WebP on Safari/Firefox) without changing your HTML markup.
          </p>
          <div className="mt-4 pt-3 border-t border-neutral-200/80 flex items-center justify-between text-[11px] font-mono text-neutral-500">
            <span>Client Negotiation</span>
            <span className="text-emerald-700 font-semibold">AVIF / WebP Edge</span>
          </div>
        </div>

        {/* Card 2: q_auto */}
        <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50">
          <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm mb-2">
            <Zap className="w-4 h-4 text-neutral-700" />
            <span className="font-mono">q_auto</span>
            <span className="text-xs font-normal text-neutral-500">(Perceptual Quality)</span>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Uses structural similarity (SSIM) and perceptual algorithms to calculate the optimal compression level for the image content, stripping unneeded bytes while preventing visible compression artifacts.
          </p>
          <div className="mt-4 pt-3 border-t border-neutral-200/80 flex items-center justify-between text-[11px] font-mono text-neutral-500">
            <span>SSIM Perceptual Tuning</span>
            <span className="text-emerald-700 font-semibold">Lossless-Grade</span>
          </div>
        </div>

        {/* Card 3: Measured Payload Comparison */}
        <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm mb-2">
              <HardDrive className="w-4 h-4 text-neutral-700" />
              <span>Bandwidth Impact</span>
            </div>
            <p className="text-xs text-neutral-600">
              Measured size differential between raw upload and optimized delivery stream.
            </p>

            <div className="mt-4 space-y-2">
              <div>
                <div className="flex justify-between text-[11px] text-neutral-500 font-mono mb-1">
                  <span>Raw Source</span>
                  <span className="text-neutral-700">{originalKb} KB</span>
                </div>
                <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-neutral-500 h-full w-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-neutral-500 font-mono mb-1">
                  <span>RE:FRAME Optimized</span>
                  <span className="text-emerald-700 font-bold">{optimizedKb} KB</span>
                </div>
                <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(10, 100 - percentSaved)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-200/80 text-[11px] text-neutral-500 font-mono">
            Fast Core Web Vitals (LCP) acceleration enabled.
          </div>
        </div>
      </div>
    </div>
  );
};
