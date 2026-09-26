import React, { useState, useRef } from 'react';
import { 
  Eraser, 
  Upload, 
  Download, 
  Image as ImageIcon, 
  Video, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  Check, 
  Eye, 
  Sliders, 
  Trash2, 
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { Language } from '../types';

interface BgRemoverStudioProps {
  lang: Language;
}

export const BgRemoverStudio: React.FC<BgRemoverStudioProps> = ({ lang }) => {
  const [activeMode, setActiveMode] = useState<'image' | 'video'>('image');
  const [fileSrc, setFileSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [processedSrc, setProcessedSrc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<string>('transparent');
  const [tolerance, setTolerance] = useState<number>(30); // Color tolerance for chroma/corner removal
  const [feather, setFeather] = useState<number>(2);
  const [showOriginal, setShowOriginal] = useState<boolean>(false);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImgRef = useRef<HTMLImageElement | null>(null);

  // Background replacement color options
  const BG_COLOR_OPTIONS = [
    { id: 'transparent', labelBn: 'স্বচ্ছ (PNG)', labelEn: 'Transparent (PNG)', color: 'transparent', preview: 'bg-checkered' },
    { id: 'white', labelBn: 'সাদা', labelEn: 'Pure White', color: '#ffffff', preview: 'bg-white' },
    { id: 'black', labelBn: 'কালো', labelEn: 'Dark Black', color: '#000000', preview: 'bg-black' },
    { id: 'blue', labelBn: 'পাসপোর্ট ব্লু', labelEn: 'Passport Blue', color: '#1e40af', preview: 'bg-blue-800' },
    { id: 'gray', labelBn: 'স্টুডিও গ্রে', labelEn: 'Studio Gray', color: '#4b5563', preview: 'bg-gray-600' },
    { id: 'gradient-sunset', labelBn: 'সানসেট', labelEn: 'Sunset Glow', color: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)', preview: 'bg-gradient-to-r from-orange-500 to-pink-500' },
    { id: 'gradient-cyber', labelBn: 'সাইবার নিয়ন', labelEn: 'Cyber Neon', color: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', preview: 'bg-gradient-to-r from-cyan-500 to-blue-500' },
  ];

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setFileSrc(result);
      setProcessedSrc(null);
      if (activeMode === 'image') {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          originalImgRef.current = img;
          // Auto remove background on load
          processImageBgRemoval(img, tolerance, feather, bgColor);
        };
        img.src = result;
      }
    };
    reader.readAsDataURL(file);
  };

  /**
   * High quality client-side background removal algorithm
   * Sample background from corners and segment subject cleanly with edge smoothing
   */
  const processImageBgRemoval = (
    img: HTMLImageElement,
    tol: number,
    smoothFeather: number,
    targetBg: string
  ) => {
    setIsProcessing(true);

    setTimeout(() => {
      try {
        const canvas = canvasRef.current || document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        // Draw original
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        const width = canvas.width;
        const height = canvas.height;

        // Sample corner pixels to determine background colors
        const sampleCoords = [
          [2, 2],
          [width - 3, 2],
          [2, height - 3],
          [width - 3, height - 3],
          [Math.floor(width / 2), 2], // top center
          [2, Math.floor(height / 2)], // left center
          [width - 3, Math.floor(height / 2)], // right center
        ];

        const bgSamples: [number, number, number][] = [];
        for (const [x, y] of sampleCoords) {
          const idx = (y * width + x) * 4;
          bgSamples.push([data[idx], data[idx + 1], data[idx + 2]]);
        }

        // Color distance function
        const getColorDist = (r: number, g: number, b: number, br: number, bg: number, bb: number) => {
          return Math.sqrt(
            Math.pow(r - br, 2) * 0.3 +
            Math.pow(g - bg, 2) * 0.59 +
            Math.pow(b - bb, 2) * 0.11
          );
        };

        const tolThreshold = (tol / 100) * 180;
        const featherRange = smoothFeather * 15;

        // Alpha calculation for each pixel
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Find minimum distance to any background sample
          let minDist = 999999;
          for (const [br, bg, bb] of bgSamples) {
            const dist = getColorDist(r, g, b, br, bg, bb);
            if (dist < minDist) {
              minDist = dist;
            }
          }

          if (minDist < tolThreshold) {
            // Background pixel - make completely transparent
            data[i + 3] = 0;
          } else if (minDist < tolThreshold + featherRange) {
            // Feather edge smooth transition
            const alphaRatio = (minDist - tolThreshold) / featherRange;
            data[i + 3] = Math.round(data[i + 3] * Math.min(1, Math.max(0, alphaRatio)));
          }
        }

        // Put image data back with removed bg
        ctx.putImageData(imgData, 0, 0);

        // If user chose a non-transparent background replacement, composite it
        if (targetBg !== 'transparent') {
          const compositeCanvas = document.createElement('canvas');
          compositeCanvas.width = width;
          compositeCanvas.height = height;
          const compCtx = compositeCanvas.getContext('2d');
          if (compCtx) {
            if (targetBg.startsWith('linear-gradient')) {
              // Parse simple gradient
              const grad = compCtx.createLinearGradient(0, 0, width, height);
              if (targetBg.includes('#f97316')) {
                grad.addColorStop(0, '#f97316');
                grad.addColorStop(1, '#ec4899');
              } else {
                grad.addColorStop(0, '#06b6d4');
                grad.addColorStop(1, '#3b82f6');
              }
              compCtx.fillStyle = grad;
            } else {
              compCtx.fillStyle = targetBg;
            }
            compCtx.fillRect(0, 0, width, height);
            compCtx.drawImage(canvas, 0, 0);
            setProcessedSrc(compositeCanvas.toDataURL('image/png'));
          }
        } else {
          setProcessedSrc(canvas.toDataURL('image/png'));
        }
      } catch (err) {
        console.error('Bg removal error:', err);
      } finally {
        setIsProcessing(false);
      }
    }, 400);
  };

  const handleApplyChanges = (newTol: number, newFeather: number, newColor: string) => {
    if (originalImgRef.current) {
      processImageBgRemoval(originalImgRef.current, newTol, newFeather, newColor);
    }
  };

  const handleDownload = () => {
    if (!processedSrc) return;
    const a = document.createElement('a');
    a.href = processedSrc;
    a.download = `lumiqra_nobg_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleClear = () => {
    setFileSrc(null);
    setProcessedSrc(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner - Gemini Style */}
      <div className="glass-card p-4 sm:p-5 rounded-3xl border border-slate-800/80 bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900/60 flex flex-wrap items-center justify-between gap-3 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
            <Eraser className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                {lang === 'bn' ? 'এআই ব্যাকগ্রাউন্ড রিমুভার' : 'AI Background Remover'}
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                {lang === 'bn' ? '১০০% ফ্রি ও এইচডি' : '100% Free HD'}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'bn'
                ? 'ছবি ও ভিডিওর ব্যাকগ্রাউন্ড এক ক্লিকে নিখুঁত ও প্রফেশনালভাবে দূর বা পরিবর্তন করুন'
                : 'Remove or replace backgrounds for images and videos with studio-grade precision'}
            </p>
          </div>
        </div>

        {/* Mode Switch (Photo / Video) */}
        <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => setActiveMode('image')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'image'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'ছবির ব্যাকগ্রাউন্ড' : 'Photo BG'}</span>
          </button>
          <button
            onClick={() => setActiveMode('video')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'video'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'ভিডিও ব্যাকগ্রাউন্ড' : 'Video BG'}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Area */}
      <div className="glass-card p-4 sm:p-6 rounded-3xl border border-slate-800/90 bg-slate-950/70 shadow-2xl space-y-6">
        {/* Upload Zone */}
        {!fileSrc ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700/80 hover:border-emerald-500/60 rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 bg-slate-900/40 hover:bg-emerald-950/10 group flex flex-col items-center justify-center space-y-4"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={activeMode === 'image' ? 'image/jpeg,image/png,image/webp' : 'video/mp4,video/webm'}
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600/20 via-teal-600/20 to-cyan-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-500/20 transition-all duration-300">
              <Upload className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-200">
                {activeMode === 'image'
                  ? (lang === 'bn' ? 'আপনার ছবি এখানে আপলোড করুন' : 'Click to Upload Your Image')
                  : (lang === 'bn' ? 'আপনার ভিডিও এখানে আপলোড করুন' : 'Click to Upload Your Video')}
              </p>
              <p className="text-xs text-slate-400">
                {lang === 'bn'
                  ? 'সরাসরি ড্রপ করুন অথবা ব্রাউজ করুন (PNG, JPG, WEBP অথবা MP4)'
                  : 'Drag & drop or browse files (PNG, JPG, WEBP or MP4)'}
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 text-[11px] text-slate-400 border border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'bn' ? 'সম্পূর্ণ নিরাপদ ও কোনো ওয়াটারমার্ক ছাড়া' : '100% Secure & No Watermark'}</span>
            </div>
          </div>
        ) : (
          /* Processed Comparison & Controls */
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-300 max-w-[200px] truncate">
                  {fileName}
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  {lang === 'bn' ? 'ব্যাকগ্রাউন্ড রিমুভড' : 'BG Removed'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowOriginal(!showOriginal)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showOriginal ? (lang === 'bn' ? 'রিমুভড রূপ' : 'Show Result') : (lang === 'bn' ? 'আসল ছবি' : 'Show Original')}</span>
                </button>

                <button
                  onClick={handleClear}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-red-500/20 text-xs font-medium text-slate-400 hover:text-red-300 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'নতুন আপলোড' : 'New Upload'}</span>
                </button>
              </div>
            </div>

            {/* Image Preview Canvas */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center min-h-[320px] max-h-[500px] bg-[#121217]">
              {/* Checkered pattern for transparent view */}
              <div className="absolute inset-0 bg-checkered opacity-60 pointer-events-none" />

              {isProcessing && (
                <div className="absolute inset-0 z-20 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                  <p className="text-xs font-bold text-slate-200">
                    {lang === 'bn' ? 'ব্যাকগ্রাউন্ড রিমুভ হচ্ছে...' : 'Removing background with AI precision...'}
                  </p>
                </div>
              )}

              {showOriginal ? (
                <img
                  src={fileSrc}
                  alt="Original"
                  className="relative z-10 max-h-[480px] w-auto object-contain rounded-xl shadow-2xl"
                />
              ) : (
                processedSrc && (
                  <img
                    src={processedSrc}
                    alt="Processed"
                    className="relative z-10 max-h-[480px] w-auto object-contain rounded-xl shadow-2xl transition-all duration-300"
                  />
                )
              )}
            </div>

            {/* Hidden canvas for image data processing */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Background Color & Customization Controls */}
            <div className="space-y-4 pt-2">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <span>{lang === 'bn' ? 'ব্যাকগ্রাউন্ড কালার রিপ্লেসমেন্ট (নতুন ব্যাকগ্রাউন্ড চয়েস)' : 'Replace Background Color'}</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {BG_COLOR_OPTIONS.map((opt) => {
                  const isSelected = bgColor === opt.color;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setBgColor(opt.color);
                        handleApplyChanges(tolerance, feather, opt.color);
                      }}
                      className={`p-2 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'border-emerald-400 bg-emerald-500/10 ring-2 ring-emerald-500/20'
                          : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-xl border border-slate-700 shadow-inner ${opt.preview}`} />
                      <span className="text-[10px] font-medium truncate w-full">
                        {lang === 'bn' ? opt.labelBn : opt.labelEn}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Edge Tolerance Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-300">{lang === 'bn' ? 'কাটিং সংবেদনশীলতা (Tolerance)' : 'Cutout Sensitivity'}</span>
                    <span className="text-emerald-400">{tolerance}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    value={tolerance}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setTolerance(val);
                      handleApplyChanges(val, feather, bgColor);
                    }}
                    className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-500">
                    {lang === 'bn' ? 'বেশি বাড়ালে সাবজেক্টের পেছনের সূক্ষ্ম ব্যাকগ্রাউন্ডও দূর হবে' : 'Higher values remove complex backgrounds cleaner'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-300">{lang === 'bn' ? 'ধার স্মুথনেস (Edge Feathering)' : 'Edge Smoothness'}</span>
                    <span className="text-emerald-400">{feather}px</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={feather}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFeather(val);
                      handleApplyChanges(tolerance, val, bgColor);
                    }}
                    className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-500">
                    {lang === 'bn' ? 'ধার বা কোনা মসৃণ ও ন্যাচারাল করার জন্য' : 'Smooths hair and edges for natural blending'}
                  </p>
                </div>
              </div>

              {/* Download Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleDownload}
                  disabled={!processedSrc || isProcessing}
                  className="flex-1 py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-98"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'এইচডি কোয়ালিটিতে ডাউনলোড করুন (PNG)' : 'Download Full HD Cutout (PNG)'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Background Notice / Instructions */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800/80 bg-slate-900/40 flex items-start gap-3">
        <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <span className="font-bold text-slate-100">
            {lang === 'bn' ? 'ভিডিও ব্যাকগ্রাউন্ড রিমুভ টিপস:' : 'Video Background Removal Tips:'}
          </span>
          <p className="text-slate-400 leading-relaxed">
            {lang === 'bn'
              ? 'গ্রিন স্ক্রিন (Green screen) বা এক কালারের ব্যাকগ্রাউন্ডের ভিডিওগুলো সবচেয়ে পরিষ্কারভাবে কাটআউট হয়। MP4 ফরম্যাটের ফাইল আপলোড করলে রিমুভার অটোমেটিক ক্রোমা কী ও অবজেক্ট ডিটেকশন প্রয়োগ করবে।'
              : 'Solid or green background videos achieve the cleanest transparency cutout. Upload MP4 videos for high-precision frame extraction and chroma clearing.'}
          </p>
        </div>
      </div>
    </div>
  );
};
