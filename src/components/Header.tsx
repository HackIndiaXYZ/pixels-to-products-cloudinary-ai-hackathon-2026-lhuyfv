import React from 'react';
import { Layers, ShieldCheck, Sparkles, Sliders, ExternalLink, Database } from 'lucide-react';
import type { CloudinaryConfigStatus } from '../types/pipeline.js';

interface HeaderProps {
  configStatus: CloudinaryConfigStatus | null;
  activeTab: 'pipeline' | 'destinations' | 'library' | 'docs';
  onSelectTab: (tab: 'pipeline' | 'destinations' | 'library' | 'docs') => void;
  onOpenConfig: () => void;
  onUploadClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  configStatus,
  activeTab,
  onSelectTab,
  onOpenConfig,
  onUploadClick,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('pipeline');
            }}
            className="flex items-center gap-2 group text-neutral-900"
          >
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-sm group-hover:bg-neutral-800 transition-colors">
              RE
            </div>
            <span className="font-extrabold text-lg tracking-tight text-neutral-900 font-sans">
              RE:FRAME <span className="font-light text-neutral-500">AI</span>
            </span>
          </a>
        </div>

        {/* Zone 2: 4-5 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
          <button
            onClick={() => onSelectTab('pipeline')}
            className={`transition-colors relative py-1 ${
              activeTab === 'pipeline'
                ? 'text-neutral-900 font-semibold'
                : 'hover:text-neutral-900 text-neutral-600'
            }`}
          >
            Pipeline
            {activeTab === 'pipeline' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('destinations')}
            className={`transition-colors relative py-1 ${
              activeTab === 'destinations'
                ? 'text-neutral-900 font-semibold'
                : 'hover:text-neutral-900 text-neutral-600'
            }`}
          >
            Destinations
            {activeTab === 'destinations' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('library')}
            className={`transition-colors relative py-1 ${
              activeTab === 'library'
                ? 'text-neutral-900 font-semibold'
                : 'hover:text-neutral-900 text-neutral-600'
            }`}
          >
            Asset Library
            {activeTab === 'library' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('docs')}
            className={`transition-colors relative py-1 ${
              activeTab === 'docs'
                ? 'text-neutral-900 font-semibold'
                : 'hover:text-neutral-900 text-neutral-600'
            }`}
          >
            Cloudinary Spec
            {activeTab === 'docs' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenConfig}
            title="Configure Cloudinary credentials"
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors border border-neutral-200"
          >
            <Database className="w-3.5 h-3.5 text-neutral-600" />
            <span className="hidden sm:inline">
              Cloudinary: <span className="font-mono font-semibold">{configStatus?.cloudName || 'demo'}</span>
            </span>
            <span className={`w-2 h-2 rounded-full ${configStatus?.configured ? 'bg-emerald-500' : 'bg-amber-400'}`} />
          </button>

          <button
            onClick={onUploadClick}
            className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Upload Media</span>
          </button>
        </div>
      </div>
    </header>
  );
};
