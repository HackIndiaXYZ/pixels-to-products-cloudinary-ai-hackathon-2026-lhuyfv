# RE:FRAME AI — Intelligent Media Readiness Pipeline

> **Core Flow:** Upload → AI Understand → Analyze → Improve → Transform → Optimize → Deliver  

## 1. Project Overview

**RE:FRAME AI** is an intelligent, automated media processing pipeline built directly on top of Cloudinary's Programmable Media infrastructure. Instead of requiring users to manually crop, resize, isolate backgrounds, compress, and re-export product photography and promotional media for every platform, RE:FRAME AI ingests a single raw image and synthesizes destination-ready assets for websites, social channels, e-commerce marketplaces, and mobile applications in seconds.

## 2. Problem

Creators, e-commerce merchants, agencies, and developers lose dozens of hours every week manually adapting media:
- **Disparate Platform Specs:** Amazon demands strict 1:1 white-padded squares; Instagram feeds favor 4:5 portraits; web landing heroes need 16:9 banners; mobile apps require retina DPR scaling.
- **Awkward Blind Cropping:** Generic automated crops decapitate heads or cut off shoe toes because they lack subject or facial awareness.
- **Background Clutter:** Product photos taken on workshop tables or warehouse floors fail marketplace compliance without tedious manual cutout masks.
- **Bandwidth & Core Web Vitals Bloat:** Uploading unoptimized megabyte-sized JPEGs slows down page load times and damages SEO ranking.
- **Storage Sprawl:** Storing 5 to 10 exported files per raw asset leads to massive storage bills and stale asset drift.

## 3. Solution

RE:FRAME AI unifies media intelligence and dynamic image transformations into a single automated pipeline:
1. **Single Raw Upload:** The user uploads one unedited image or chooses a raw commercial sample.
2. **Cloudinary Ingestion:** Media is uploaded securely with server-side signing, extracting EXIF, color vectors, and structural metadata.
3. **Multimodal AI Scene Understanding:** The pipeline detects focal subjects, classifies product categories, identifies background complexity, and checks content safety.
4. **Readiness Scorecard:** An objective 5-point audit evaluates resolution, contrast, compliance, composition, and optimization potential.
5. **Dynamic Destination Transforms:** Cloudinary URL transformations generate tailored variants (Website 16:9, Social 4:5, Marketplace 1:1, Mobile Retina, Isolated PNG Cutout) using content-aware auto-gravity (`g_auto:subject`, `g_auto:face`).
6. **Optimized Edge Delivery:** Cloudinary's `f_auto` and `q_auto` automatically serve lightweight next-gen formats (AVIF/WebP) with perceptual SSIM compression via global CDN edges.
7. **Media Passport:** Issues a verified manifest with public ID, SHA-1 checksum, tags, and production-ready CDN URLs.

## 4. Key Features

- **Drag-and-Drop & File Picker Upload Zone:** Real-time feedback with instant preview and progress states.
- **One-Click Raw Commercial Presets:** Test immediately with high-resolution test assets (Sneaker with textured floor, Founder corporate portrait, Luxury smartwatch, Vintage rangefinder camera).
- **6-Stage Live Execution Graph:** Transparent tracking across `UPLOAD` → `UNDERSTAND` → `ANALYZE` → `TRANSFORM` → `OPTIMIZE` → `READY`.
- **Media Intelligence Panel:** Extracts primary subject, category, semantic tags (zero-pill typography), content moderation status, focal placement, and color palette.
- **Media Readiness Score (0–100%):** Quantitative rubric assessing resolution, metadata completeness, brand compliance, and delivery readiness with actionable recommendations.
- **Destination Ready Transformation Hub:** Live interactive preview of 6 distinct variants with one-click Cloudinary URL copying and transformation parameter inspection.
- **Original vs. RE:FRAME Comparison:** Interactive split-slider and side-by-side comparison illustrating background processing, cropping, and color balancing.
- **Optimized Delivery Benchmarking:** Live payload comparison illustrating byte reductions achieved via `f_auto` and `q_auto`.
- **Searchable Asset Library:** Filter and search previously processed assets by semantic tags, category, or public ID.
- **Runtime Cloudinary Credential Manager:** Seamlessly switch between demo cloud mode and custom signed Cloudinary accounts.

## 5. Architecture

RE:FRAME AI is architected as a full-stack TypeScript application with clean separation between privileged server operations and client presentation:

```
┌──────────────────────────────────────────────────────────────┐
│                    Browser Client (React)                    │
│  - UploadZone & Drag/Drop                                    │
│  - PipelineProgress Execution Tracker                        │
│  - Destination Variant Viewer & Split Slider                 │
│  - Asset Library with Tag Search                             │
└──────────────────────────────┬───────────────────────────────┘
                               │ JSON / Base64 / Multipart
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                  Node.js Express Server                      │
│  - POST /api/upload          - GET /api/assets               │
│  - GET  /api/status          - POST /api/configure           │
│  - GET  /api/samples         - Express static / Vite middleware
└───────────────┬──────────────────────────────┬───────────────┘
                │                              │
                │ Server-side signed upload    │ Multimodal scene
                │                              │ analysis
                ▼                              ▼
┌──────────────────────────────┐ ┌─────────────────────────────┐
│    Cloudinary Programmable   │ │     OpenAI GPT-4o Vision    │
│        Media Service         │ │     Multimodal Analysis     │
│  - Upload API (colors, EXIF) │ │  - Subject detection        │
│  - Dynamic URL Transforms    │ │  - Composition audit        │
│  - AI Background Removal     │ │  - Tag classification       │
│  - Content-Aware Cropping    │ │  - Safety verification      │
│  - f_auto & q_auto Delivery  │ └─────────────────────────────┘
└──────────────────────────────┘
```

## 6. Cloudinary Integration

Cloudinary is not used as a dumb storage bucket; it is the **active execution engine** of the media pipeline:

1. **Zero Storage Duplication:** Instead of rendering and saving 6 separate image files for each variant, RE:FRAME AI generates dynamic Cloudinary transformation URLs. Cloudinary computes and caches them on the fly at edge CDN nodes.
2. **Subject-Preserving Auto Cropping:** Rather than center-cropping (which cuts off off-center objects or heads), Cloudinary's `g_auto:subject` and `g_auto:face` analyze the image geometry and keep the vital content in frame.
3. **AI Background Removal:** Product isolation is handled via Cloudinary's `e_background_removal` transformation, outputting clean alpha PNGs for marketplace white padding or composite banners.
4. **Client-Adaptive Delivery:** `f_auto` inspects browser support (AVIF for Chromium, WebP for Safari/Firefox) and `q_auto` uses structural similarity metrics to minimize byte size without visual degradation.

## 7. Cloudinary APIs & Features Used

| Capability | Cloudinary API / Parameter | Purpose in RE:FRAME AI |
| :--- | :--- | :--- |
| **Media Ingestion** | `cloudinary.uploader.upload(..., { colors: true, image_metadata: true, tags: [...] })` | Secure server-side signed upload extracting color palettes and EXIF. |
| **Content-Aware Cropping** | `c_fill,ar_16:9,g_auto` / `c_fill,ar_4:5,g_auto:subject` | Automatically centers primary subjects across landscape and portrait crops. |
| **Facial Centering** | `c_fill,ar_16:9,g_auto:face` / `c_thumb,g_face` | Aligns corporate portraits and headshots without awkward forehead cropping. |
| **Marketplace Padding** | `c_pad,ar_1:1,b_white` | Formats product shots for Amazon/Google Shopping standards on pure white background. |
| **AI Background Removal** | `e_background_removal` | Isolates subjects onto transparent alpha canvas. |
| **Visual Enhancement** | `e_enhance,e_improve` | Automatically enhances perceptual contrast and color temperature. |
| **Dynamic Next-Gen Format** | `f_auto` | Automatically negotiates AVIF / WebP depending on client browser headers. |
| **Perceptual Compression** | `q_auto` / `q_auto:eco` | SSIM-tuned compression cutting 70%+ bandwidth while preserving fidelity. |
| **DPR Retina Scaling** | `dpr_2.0,c_scale` | Delivers crystal-clear resolution on high-density mobile screens without extra file versions. |

## 8. Environment Variables

Create a `.env` file in the root directory (based on `.env.example`):

```bash
# Cloudinary Credentials (Server-side only — never exposed to client)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# OpenAI API Key for GPT-4o Vision multimodal scene understanding
OPENAI_API_KEY="your_openai_api_key"

# Port (defaults to 3000)
PORT=3000
```

> **Note on Zero-Config Demo Mode:** If `CLOUDINARY_CLOUD_NAME` is not supplied, RE:FRAME AI seamlessly runs in demo mode using Cloudinary's verified demo cloud and pre-indexed commercial assets so evaluators never encounter broken states.

## 9. Local Setup

### Prerequisites
- Node.js 18+ or 20+
- npm

### Installation
```bash
# Clone or open repository
cd reframe-ai

# Install dependencies
npm install
```

## 10. Running the Application

### Development Mode
```bash
# Starts both Express API routes and Vite dev server on port 3000
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Production Build
```bash
# Builds frontend assets
npm run build

# Runs production server
npm start
```

## 11. Deployment

RE:FRAME AI is packaged for single-container cloud deployment (e.g. Cloud Run, Render, Railway, Fly.io, or Heroku):
- Set `NODE_ENV=production`
- Configure `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in your host's environment settings.
- Build command: `npm run build`
- Start command: `npm start`

## 12. Future Improvements

- **Cloudinary Generative AI Fill:** Automatically expand 1:1 square assets into 16:9 banners using `e_gen_fill`.
- **Automated Social Scheduling:** Direct webhooks to Shopify, Amazon Seller Central, and Meta Graph API.
- **Video Readiness Pipeline:** Extend the pipeline to short-form video (TikTok/Reels/Shorts) using Cloudinary's dynamic video cropping (`c_fill,ar_9:16,g_auto`) and audio normalization.
- **Batch Processing Queue:** Bulk folder processing for enterprise catalogs with CSV export.

## License

Apache-2.0. Built for the Cloudinary AI Media Pipelines Hackathon.
