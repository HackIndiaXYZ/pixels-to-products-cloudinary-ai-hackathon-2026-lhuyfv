import React, { useState } from 'react';
import { Search, Tag, Eye, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';
import type { ProcessedAsset } from '../types/pipeline.js';

interface AssetLibraryProps {
  assets: ProcessedAsset[];
  onSelectAsset: (asset: ProcessedAsset) => void;
  onSearchChange: (query: string) => void;
  onTagClick: (tag: string) => void;
  selectedTag: string | null;
  searchQuery: string;
}

export const AssetLibrary: React.FC<AssetLibraryProps> = ({
  assets,
  onSelectAsset,
  onSearchChange,
  onTagClick,
  selectedTag,
  searchQuery,
}) => {
  // Extract all unique tags across all assets for quick filtering
  const allTags = Array.from(
    new Set(assets.flatMap((a) => a.intelligence.tags))
  ).slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Header and Search Controls */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
          <div>
            <h3 className="text-xl font-bold text-neutral-900 tracking-tight">
              Asset Library
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Search and manage your destination-ready media assets indexed in Cloudinary.
            </p>
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tags, e.g. shoe, portrait..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
            />
          </div>
        </div>

        {/* Quick Filter Tags (Zero-Pill discipline: segmented tabs / buttons with click handlers) */}
        {allTags.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-neutral-500 mr-1">
              Filter by Tag:
            </span>
            <button
              onClick={() => onTagClick('')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                !selectedTag
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
              }`}
            >
              All Assets ({assets.length})
            </button>
            {allTags.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => onTagClick(tag)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    isSelected
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Asset Cards Grid */}
      {assets.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
          <p className="text-sm font-semibold text-neutral-900">No assets match your search criteria.</p>
          <p className="text-xs text-neutral-500 mt-1">Try searching for "shoe", "portrait", or clear the active filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => {
            const heroVariant = asset.variants.find((v) => v.id === 'website-16-9') || asset.variants[0];
            return (
              <div
                key={asset.id}
                className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail Banner */}
                  <div className="aspect-16/9 bg-neutral-100 overflow-hidden relative border-b border-neutral-100">
                    <img
                      src={heroVariant?.url || asset.originalUrl}
                      alt={asset.intelligence.detectedSubject}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        if (img.src !== asset.originalUrl && asset.originalUrl) {
                          img.src = asset.originalUrl;
                        }
                      }}
                    />
                    <div className="absolute top-2.5 right-2.5 bg-neutral-900/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded">
                      {asset.readiness.overallScore}% Ready
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                      <span>{asset.intelligence.category}</span>
                      <span className="font-mono text-[11px]">{asset.format.toUpperCase()}</span>
                    </div>

                    <h4 className="text-sm font-bold text-neutral-900 line-clamp-1">
                      {asset.intelligence.detectedSubject}
                    </h4>

                    {/* Unboxed Metadata (Zero-Pill discipline) */}
                    <div className="mt-2 text-xs text-neutral-500 flex flex-wrap items-center gap-1.5 line-clamp-1">
                      {asset.intelligence.tags.slice(0, 4).map((t, idx) => (
                        <React.Fragment key={t}>
                          <span>#{t}</span>
                          {idx < Math.min(3, asset.intelligence.tags.length - 1) && (
                            <span className="text-neutral-300">·</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Passport status line */}
                    <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 font-mono">
                      <span>{asset.variants.length} Ready Variants</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Ready
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-5 py-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-neutral-400 truncate max-w-[140px]">
                    {asset.publicId}
                  </span>

                  <button
                    onClick={() => onSelectAsset(asset)}
                    className="text-xs font-semibold text-neutral-900 hover:text-black flex items-center gap-1 group/btn"
                  >
                    <span>Inspect Pipeline</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
