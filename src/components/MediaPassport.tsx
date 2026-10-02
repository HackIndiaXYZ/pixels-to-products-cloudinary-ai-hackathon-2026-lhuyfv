import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, FileCode, CheckCircle2, QrCode } from 'lucide-react';
import type { ProcessedAsset } from '../types/pipeline.js';

interface MediaPassportProps {
  asset: ProcessedAsset;
}

export const MediaPassport: React.FC<MediaPassportProps> = ({ asset }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const passport = asset.mediaPassport;

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-neutral-900 tracking-tight">
                Media Passport
              </h3>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                {passport.status}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Cryptographically verified media passport and delivery manifest.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopy('json', JSON.stringify(passport, null, 2))}
            className="px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors border border-neutral-200 flex items-center gap-1.5"
          >
            {copiedField === 'json' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied Manifest</span>
              </>
            ) : (
              <>
                <FileCode className="w-3.5 h-3.5 text-neutral-500" />
                <span>Export Manifest JSON</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Passport Identity Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Asset ID & Public ID */}
        <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
          <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
            Asset Identifier
          </div>
          <div className="text-sm font-mono font-bold text-neutral-900 mt-1 flex items-center justify-between">
            <span className="truncate">{passport.assetId}</span>
            <button
              onClick={() => handleCopy('id', passport.assetId)}
              className="p-1 hover:text-neutral-900 text-neutral-400"
              title="Copy ID"
            >
              {copiedField === 'id' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="text-[11px] text-neutral-500 mt-2 font-mono truncate" title={passport.publicId}>
            Public ID: <span className="text-neutral-800">{passport.publicId}</span>
          </div>
        </div>

        {/* Media Type & Cloudinary Registry */}
        <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
          <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
            Cloud & MIME Type
          </div>
          <div className="text-sm font-bold text-neutral-900 mt-1">
            {passport.type.toUpperCase()} · <span className="font-mono text-xs">{passport.cloudName}</span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-2 font-mono">
            Origin: <span className="text-emerald-700 font-semibold">Cloudinary Programmable Media</span>
          </div>
        </div>

        {/* Edge CDN Protocol */}
        <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
          <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
            Delivery Edge Network
          </div>
          <div className="text-sm font-semibold text-neutral-900 mt-1">
            Fastly & Cloudflare HTTP/3
          </div>
          <div className="text-[11px] text-neutral-500 mt-2 font-mono">
            Optimized: <span className="text-emerald-700 font-semibold">f_auto, q_auto</span>
          </div>
        </div>
      </div>

      {/* Structured Passport Table */}
      <div className="mt-6 border border-neutral-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-neutral-200 text-left text-xs">
          <tbody className="divide-y divide-neutral-100 bg-white">
            <tr>
              <td className="px-4 py-3 font-semibold text-neutral-500 bg-neutral-50 w-44">
                AI Semantic Tags
              </td>
              <td className="px-4 py-3 font-medium text-neutral-800">
                {passport.tags.join(' · ')}
              </td>
            </tr>

            <tr>
              <td className="px-4 py-3 font-semibold text-neutral-500 bg-neutral-50">
                Pipeline Processing
              </td>
              <td className="px-4 py-3 font-mono text-[11px] text-neutral-700">
                Background removal · Content-aware crop (g_auto) · Perceptual quality (q_auto) · Dynamic format (f_auto)
              </td>
            </tr>

            <tr>
              <td className="px-4 py-3 font-semibold text-neutral-500 bg-neutral-50">
                Ready Destinations
              </td>
              <td className="px-4 py-3 text-neutral-800 font-medium">
                {passport.destinations.join(' / ')}
              </td>
            </tr>

            <tr>
              <td className="px-4 py-3 font-semibold text-neutral-500 bg-neutral-50">
                SHA-1 Checksum
              </td>
              <td className="px-4 py-3 font-mono text-[11px] text-neutral-600 truncate max-w-md">
                {passport.shaChecksum}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
