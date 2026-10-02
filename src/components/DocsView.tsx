import React from 'react';
import { Layers, Shield, Zap, Globe, Cpu, CheckCircle2, Code2, ArrowRight } from 'lucide-react';

export const DocsView: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
            Hackathon Track: Cloudinary AI Media Pipelines (PS-01)
          </div>
          <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            RE:FRAME AI System Architecture & Cloudinary Spec
          </h2>
          <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
            RE:FRAME AI is an end-to-end media readiness pipeline that replaces tedious manual resizing, background erasing, and format tuning with a single automated Cloudinary-powered execution graph.
          </p>
        </div>
      </div>

      {/* Core Flow Diagram */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 sm:p-8 shadow-sm">
        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-6">
          Pipeline Execution Graph
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200/80">
            <span className="font-mono text-xs text-neutral-400 font-bold">STAGE 01</span>
            <h4 className="text-xs font-bold text-neutral-900 mt-1">Upload</h4>
            <p className="text-[11px] text-neutral-500 mt-1">
              Raw image ingested via Cloudinary Upload API with color and metadata extraction.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200/80">
            <span className="font-mono text-xs text-neutral-400 font-bold">STAGE 02</span>
            <h4 className="text-xs font-bold text-neutral-900 mt-1">Understand</h4>
            <p className="text-[11px] text-neutral-500 mt-1">
              Multimodal scene understanding detects focal subject, category, and background complexity.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200/80">
            <span className="font-mono text-xs text-neutral-400 font-bold">STAGE 03</span>
            <h4 className="text-xs font-bold text-neutral-900 mt-1">Analyze</h4>
            <p className="text-[11px] text-neutral-500 mt-1">
              5-point readiness scorecard evaluates compliance, contrast, and moderation.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200/80">
            <span className="font-mono text-xs text-neutral-400 font-bold">STAGE 04</span>
            <h4 className="text-xs font-bold text-neutral-900 mt-1">Transform</h4>
            <p className="text-[11px] text-neutral-500 mt-1">
              Cloudinary dynamic URLs synthesize 16:9, 4:5, 1:1, and transparent cutouts.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200/80">
            <span className="font-mono text-xs text-neutral-400 font-bold">STAGE 05</span>
            <h4 className="text-xs font-bold text-neutral-900 mt-1">Optimize</h4>
            <p className="text-[11px] text-neutral-500 mt-1">
              f_auto delivers AVIF/WebP while q_auto compresses via perceptual SSIM.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
            <span className="font-mono text-xs text-emerald-700 font-bold">STAGE 06</span>
            <h4 className="text-xs font-bold text-emerald-950 mt-1">Ready</h4>
            <p className="text-[11px] text-emerald-800 mt-1">
              Media Passport issued with CDN edge endpoint and verification checksum.
            </p>
          </div>
        </div>
      </div>

      {/* Cloudinary Capabilities Deep Dive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-neutral-800" />
            <h4 className="text-sm font-bold text-neutral-900">
              Cloudinary Capabilities Leveraged
            </h4>
          </div>

          <ul className="space-y-3 text-xs text-neutral-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-900">Upload API & Metadata Enrichment:</strong> Signed server-side ingestion retrieving raw dimensions, color palette vectors, and EXIF attributes.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-900">Content-Aware Cropping (g_auto):</strong> Prevents awkward cropping by prioritizing detected objects (<code className="font-mono text-[11px]">g_auto:subject</code>) and faces (<code className="font-mono text-[11px]">g_auto:face</code>).
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-900">AI Background Removal:</strong> Integrates Cloudinary's <code className="font-mono text-[11px]">e_background_removal</code> transformation to isolate products and avatars without green screens.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-900">Automatic Format & Quality (f_auto, q_auto):</strong> Global Fastly/Cloudflare edge delivery saving 75%+ payload size per request.
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-neutral-800" />
            <h4 className="text-sm font-bold text-neutral-900">
              Security & Environment Isolation
            </h4>
          </div>

          <p className="text-xs text-neutral-600 leading-relaxed">
            Per hackathon guidelines, <code className="font-mono text-neutral-800">CLOUDINARY_API_SECRET</code> is restricted strictly to the Node.js Express backend. Client browsers communicate solely through proxy endpoints (<code className="font-mono text-[11px]">/api/upload</code>, <code className="font-mono text-[11px]">/api/status</code>).
          </p>

          <div className="p-3 bg-neutral-900 text-neutral-200 rounded-lg font-mono text-[11px] leading-relaxed">
            <div className="text-neutral-400"># .env configuration</div>
            <div>CLOUDINARY_CLOUD_NAME="your_cloud_name"</div>
            <div>CLOUDINARY_API_KEY="your_api_key"</div>
            <div>CLOUDINARY_API_SECRET="your_api_secret"</div>
          </div>

          <div className="text-xs text-neutral-500">
            If no environment variables are present, the app smoothly operates with verified demo assets and public demo cloud transformations so evaluators never encounter crashes.
          </div>
        </div>
      </div>
    </div>
  );
};
