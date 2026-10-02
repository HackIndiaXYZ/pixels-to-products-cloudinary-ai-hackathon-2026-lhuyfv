import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Globe, Smartphone, ShoppingBag, Share2, Scissors, Wand2, Info } from 'lucide-react';
import type { DestinationVariant } from '../types/pipeline.js';

interface TransformationCenterProps {
  variants: DestinationVariant[];
  originalUrl: string;
}

export const TransformationCenter: React.FC<TransformationCenterProps> = ({
  variants,
  originalUrl,
}) => {
  const [selectedVariantId, setSelectedVariantId] = useState<string>(variants[0]?.id || 'website-16-9');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const selectedVariant = variants.find((v) => v.id === selectedVariantId) || variants[0];

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const getTargetIcon = (target: string) => {
    switch (target) {
      case 'Website':
        return <Globe className="w-4 h-4" />;
      case 'Social':
        return <Share2 className="w-4 h-4" />;
      case 'Marketplace':
        return <ShoppingBag className="w-4 h-4" />;
      case 'Mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'Cutout':
        return <Scissors className="w-4 h-4" />;
      case 'Enhanced':
        return <Wand2 className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-neutral-900 tracking-tight">
              Destination Ready
            </h3>
            <span className="text-xs font-semibold text-neutral-500 font-mono">
              ({variants.length} Auto-Generated Variants)
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Dynamic Cloudinary URL transformations generated on-the-fly. Content-aware cropping preserves the subject without client-side canvas re-encoding.
          </p>
        </div>

        {/* Action button to copy active URL */}
        {selectedVariant && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopyUrl(selectedVariant.url)}
              className="px-3.5 py-1.5 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors border border-neutral-200 flex items-center gap-1.5"
            >
              {copiedUrl === selectedVariant.url ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied Cloudinary URL</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Copy Variant URL</span>
                </>
              )}
            </button>
            <a
              href={selectedVariant.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
              title="Open full size in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>

      {/* Destination Variant Tabs */}
      <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {variants.map((variant) => {
          const isSelected = variant.id === selectedVariantId;
          return (
            <button
              key={variant.id}
              onClick={() => setSelectedVariantId(variant.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                isSelected
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700'
              }`}
            >
              {getTargetIcon(variant.target)}
              <span>{variant.name}</span>
              <span className={`text-[10px] font-mono ${isSelected ? 'text-neutral-400' : 'text-neutral-500'}`}>
                {variant.aspectRatio}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Variant Preview & Inspection Grid */}
      {selectedVariant && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Visual Canvas Display */}
          <div className="lg:col-span-8 bg-neutral-950/5 rounded-xl border border-neutral-200/80 p-4 flex items-center justify-center min-h-[380px] overflow-hidden relative group">
            {/* Checkerboard backdrop for transparent PNG cutouts */}
            {selectedVariant.target === 'Cutout' && (
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
                  backgroundSize: '16px 16px',
                }}
              />
            )}

            <img
              src={selectedVariant.url}
              alt={selectedVariant.name}
              referrerPolicy="no-referrer"
              className="max-h-[460px] max-w-full object-contain rounded-lg shadow-md transition-transform duration-300 group-hover:scale-[1.01]"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                if (img.src !== originalUrl && originalUrl) {
                  img.src = originalUrl;
                }
              }}
            />

            <div className="absolute bottom-3 left-3 bg-neutral-900/85 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-1 rounded-md">
              {selectedVariant.aspectRatioLabel} · {selectedVariant.width}×{selectedVariant.height}px
            </div>
          </div>

          {/* Transformation Metadata & Specs */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Target Destination
              </div>
              <div className="text-lg font-bold text-neutral-900 mt-0.5">
                {selectedVariant.name}
              </div>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                {selectedVariant.description}
              </p>
            </div>

            {/* Transformation Parameters Breakdown */}
            <div className="space-y-3 pt-4 border-t border-neutral-100">
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Cloudinary Transformation Parameters
              </div>

              <div className="bg-neutral-900 text-neutral-200 p-3 rounded-lg font-mono text-xs break-all leading-relaxed select-all">
                <span className="text-emerald-400 font-semibold">/image/upload/</span>
                <span className="text-amber-300 font-semibold">{selectedVariant.transformationString}</span>
                <span className="text-neutral-400">/...</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-100">
                  <div className="text-neutral-400 text-[10px] uppercase font-semibold">Aspect Ratio</div>
                  <div className="font-mono font-bold text-neutral-900 mt-0.5">{selectedVariant.aspectRatio}</div>
                </div>

                <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-100">
                  <div className="text-neutral-400 text-[10px] uppercase font-semibold">Gravity Focus</div>
                  <div className="font-mono font-bold text-neutral-900 mt-0.5">{selectedVariant.gravity}</div>
                </div>

                <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-100">
                  <div className="text-neutral-400 text-[10px] uppercase font-semibold">Format Stream</div>
                  <div className="font-mono font-bold text-neutral-900 mt-0.5">{selectedVariant.format}</div>
                </div>

                <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-100">
                  <div className="text-neutral-400 text-[10px] uppercase font-semibold">Perceptual Quality</div>
                  <div className="font-mono font-bold text-neutral-900 mt-0.5">{selectedVariant.quality}</div>
                </div>
              </div>
            </div>

            {/* Why Cloudinary note */}
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex items-start gap-2 text-xs text-neutral-600">
              <Info className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
              <div>
                <strong>Zero storage bloat:</strong> Cloudinary transforms and caches assets at edge nodes on first request. No duplicate files stored.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
