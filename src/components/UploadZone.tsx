import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import type { SampleMediaItem } from '../types/pipeline.js';

interface UploadZoneProps {
  onProcessFile: (fileBase64: string, fileName: string, mimeType: string) => Promise<void>;
  onProcessSample: (sampleId: string) => Promise<void>;
  samples: SampleMediaItem[];
  isProcessing: boolean;
  uploadStatusMessage: string | null;
  errorMessage: string | null;
  fallbackNotice?: string | null;
  onOpenConfig?: () => void;
  onSwitchToDemo?: () => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onProcessFile,
  onProcessSample,
  samples,
  isProcessing,
  uploadStatusMessage,
  errorMessage,
  fallbackNotice,
  onOpenConfig,
  onSwitchToDemo,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const processSelectedFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const rawDataUrl = reader.result as string;

      // Optimize oversized images client-side before transport
      const img = new Image();
      img.onload = () => {
        const maxDim = 2560;
        let width = img.width;
        let height = img.height;
        const needsOptimization = width > maxDim || height > maxDim || file.size > 2 * 1024 * 1024;

        if (needsOptimization) {
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimizedMime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
            const optimizedDataUrl = canvas.toDataURL(optimizedMime, 0.90);
            setSelectedPreview(optimizedDataUrl);
            setSelectedFileName(file.name);
            onProcessFile(optimizedDataUrl, file.name, optimizedMime);
            return;
          }
        }

        setSelectedPreview(rawDataUrl);
        setSelectedFileName(file.name);
        onProcessFile(rawDataUrl, file.name, file.type);
      };

      img.onerror = () => {
        setSelectedPreview(rawDataUrl);
        setSelectedFileName(file.name);
        onProcessFile(rawDataUrl, file.name, file.type);
      };

      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        processSelectedFile(files[0]);
      }
    },
    [onProcessFile]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processSelectedFile(files[0]);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 sm:p-8 shadow-sm">
      {/* Upload Drop Container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
          isDragOver
            ? 'border-neutral-900 bg-neutral-50 scale-[0.99]'
            : 'border-neutral-300 hover:border-neutral-400 bg-neutral-50/50'
        } ${isProcessing ? 'pointer-events-none opacity-80' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white border border-neutral-200 flex items-center justify-center mb-4 shadow-sm text-neutral-700">
            {isProcessing ? (
              <Loader2 className="w-7 h-7 animate-spin text-neutral-900" />
            ) : (
              <UploadCloud className="w-7 h-7" />
            )}
          </div>

          <h3 className="text-xl font-bold text-neutral-900 mb-1">
            {isProcessing && uploadStatusMessage ? uploadStatusMessage : 'Drop your media here'}
          </h3>

          <p className="text-sm text-neutral-500 max-w-sm mb-4">
            {isProcessing
              ? 'Executing Cloudinary media ingestion & AI understanding...'
              : 'Upload an image to start the AI media pipeline'}
          </p>

          {!isProcessing && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="px-4 py-2 text-xs font-semibold text-neutral-800 bg-white border border-neutral-300 hover:bg-neutral-50 rounded-lg shadow-xs transition-colors"
              >
                Browse Files
              </button>
              <span className="text-xs text-neutral-400">JPG, PNG, WebP up to 25MB</span>
            </div>
          )}

          {/* Upload Status Feedback */}
          {uploadStatusMessage && (
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-neutral-800 bg-neutral-100 px-3 py-1.5 rounded-md">
              {uploadStatusMessage.includes('complete') ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Loader2 className="w-4 h-4 animate-spin text-neutral-600" />
              )}
              <span>{uploadStatusMessage}</span>
            </div>
          )}
        </div>
      </div>

      {/* Fallback Notice Banner */}
      {fallbackNotice && (
        <div className="mt-4 p-4 rounded-lg bg-amber-50 border border-amber-200 flex items-start justify-between gap-3 text-amber-900 text-xs">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <div>
              <span className="font-bold">Cloudinary Pipeline Active (Demo Cloud Mode)</span>
              <p className="mt-0.5 text-amber-800 leading-relaxed">{fallbackNotice}</p>
            </div>
          </div>
          {onOpenConfig && (
            <button
              onClick={onOpenConfig}
              className="px-3 py-1 bg-amber-200/70 hover:bg-amber-200 rounded font-semibold text-amber-900 shrink-0 text-xs transition-colors"
            >
              Update Cloud Name
            </button>
          )}
        </div>
      )}

      {/* Error Message banner */}
      {errorMessage && (
        <div className="mt-4 p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-2">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div>
              <div className="font-bold text-sm">Processing Notice</div>
              <div className="text-xs mt-0.5 text-rose-700 leading-relaxed">{errorMessage}</div>
            </div>
          </div>

          {(errorMessage.includes('cloud_name') || errorMessage.includes('credentials')) && (
            <div className="pl-6 pt-1 flex flex-wrap items-center gap-2">
              {onSwitchToDemo && (
                <button
                  onClick={onSwitchToDemo}
                  className="px-3 py-1.5 bg-neutral-900 text-white rounded-md font-semibold text-xs hover:bg-neutral-800 transition-colors shadow-xs"
                >
                  Switch to Cloudinary Demo Cloud
                </button>
              )}
              {onOpenConfig && (
                <button
                  onClick={onOpenConfig}
                  className="px-3 py-1.5 bg-white border border-rose-300 text-rose-900 rounded-md font-semibold text-xs hover:bg-rose-100/60 transition-colors"
                >
                  Edit Cloudinary Credentials
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* One-click Sample Presets */}
      <div className="mt-8 pt-6 border-t border-neutral-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Or test with raw commercial samples
            </h4>
            <p className="text-xs text-neutral-500 mt-0.5">
              Click any sample to execute the live Cloudinary AI pipeline immediately.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {samples.map((sample) => (
            <button
              key={sample.id}
              disabled={isProcessing}
              onClick={() => {
                setSelectedFileName(sample.name);
                setSelectedPreview(sample.thumbnailUrl);
                onProcessSample(sample.id);
              }}
              className="text-left group p-3 rounded-lg border border-neutral-200 hover:border-neutral-900 bg-white hover:bg-neutral-50/60 transition-all flex flex-col justify-between disabled:opacity-50"
            >
              <div className="aspect-4/3 w-full rounded-md overflow-hidden bg-neutral-100 mb-2.5 relative border border-neutral-100">
                <img
                  src={sample.thumbnailUrl}
                  alt={sample.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div>
                <div className="text-xs font-semibold text-neutral-900 group-hover:text-black line-clamp-1">
                  {sample.name}
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5 line-clamp-1">
                  {sample.category}
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-600 font-medium">
                <span>Run Pipeline</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform text-neutral-400 group-hover:text-neutral-900" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
