import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Download, 
  Maximize2, 
  Copy, 
  Check, 
  RotateCw, 
  SlidersHorizontal, 
  Share2, 
  Image as ImageIcon,
  AlertCircle,
  Eye,
  Trash2,
  X
} from 'lucide-react';
import { Language, GeneratedImage } from '../types';
import { STYLE_PRESETS, ASPECT_RATIOS, SAMPLE_PROMPTS } from '../utils/presets';
import { translatePromptToEnglish } from '../utils/translator';

interface ImageStudioProps {
  lang: Language;
  onImageGenerated: (image: GeneratedImage) => void;
  recentImages: GeneratedImage[];
  onClearHistory: () => void;
}

export const ImageStudio: React.FC<ImageStudioProps> = ({
  lang,
  onImageGenerated,
  recentImages,
  onClearHistory,
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('none');
  const [selectedRatio, setSelectedRatio] = useState('1:1');
  const [seed, setSeed] = useState<number>(() => Math.floor(Math.random() * 999999));
  const [negativePrompt, setNegativePrompt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(() => {
    return recentImages.length > 0 ? recentImages[0] : null;
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Pick a random sample prompt
  const handleSurpriseMe = () => {
    const randomIndex = Math.floor(Math.random() * SAMPLE_PROMPTS.length);
    const item = SAMPLE_PROMPTS[randomIndex];
    setPrompt(lang === 'bn' ? item.bn : item.en);
  };

  // Magic prompt enhancer
  const handleEnhancePrompt = () => {
    if (!prompt.trim()) {
      handleSurpriseMe();
      return;
    }
    const enhancers = [
      ', intricate high detail, 8k resolution, cinematic atmosphere, volumetric lighting, photorealistic masterpiece',
      ', octane render 3D, dramatic rim lighting, vibrant color balance, award winning composition',
      ', breathtaking ultra-detailed aesthetics, unreal engine 5, golden hour glow',
    ];
    const chosen = enhancers[Math.floor(Math.random() * enhancers.length)];
    if (!prompt.includes('8k') && !prompt.includes('cinematic')) {
      setPrompt(prev => prev.trim() + chosen);
    }
  };

  // Generate Image
  const handleGenerate = async (forcedSeed?: number) => {
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) {
      setErrorMsg(
        lang === 'bn' 
          ? 'অনুগ্রহ করে প্রম্পট বক্সে কোনো দৃশ্য বা বিষয়ের বর্ণনা লিখুন!' 
          : 'Please enter a prompt to generate an image!'
      );
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    setLoadingStep(1);

    const activeSeed = forcedSeed ?? Math.floor(Math.random() * 999999);
    setSeed(activeSeed);

    const styleObj = STYLE_PRESETS.find(s => s.id === selectedStyle);
    const ratioObj = ASPECT_RATIOS.find(r => r.id === selectedRatio) || ASPECT_RATIOS[0];

    // Automatically translate Bengali prompts to English so the AI image model understands precisely
    const translatedPrompt = await translatePromptToEnglish(cleanPrompt);

    // Combine prompt with style suffix
    let finalPrompt = translatedPrompt;
    if (styleObj && styleObj.promptSuffix) {
      finalPrompt += styleObj.promptSuffix;
    }
    if (negativePrompt.trim()) {
      const translatedNegative = await translatePromptToEnglish(negativePrompt.trim());
      finalPrompt += ` [negative: ${translatedNegative}]`;
    }

    // Step indicators
    const stepTimer1 = setTimeout(() => setLoadingStep(2), 1200);
    const stepTimer2 = setTimeout(() => setLoadingStep(3), 2600);

    const encodedPrompt = encodeURIComponent(finalPrompt);
    const generatedUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${ratioObj.width}&height=${ratioObj.height}&seed=${activeSeed}&nologo=true&model=flux`;

    // Preload image
    const img = new Image();
    img.src = generatedUrl;

    img.onload = () => {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsLoading(false);
      setLoadingStep(0);

      const newImgData: GeneratedImage = {
        id: `img_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        prompt: cleanPrompt,
        enhancedPrompt: finalPrompt,
        style: selectedStyle,
        aspectRatio: selectedRatio,
        width: ratioObj.width,
        height: ratioObj.height,
        imageUrl: generatedUrl,
        timestamp: Date.now(),
        seed: activeSeed,
      };

      setCurrentImage(newImgData);
      onImageGenerated(newImgData);
    };

    img.onerror = () => {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      // Fallback pollinations URL
      const fallbackUrl = `https://pollinations.ai/p/${encodedPrompt}?width=${ratioObj.width}&height=${ratioObj.height}&seed=${activeSeed}&nologo=true`;
      const fallbackImg = new Image();
      fallbackImg.src = fallbackUrl;

      fallbackImg.onload = () => {
        setIsLoading(false);
        setLoadingStep(0);
        const newImgData: GeneratedImage = {
          id: `img_${Date.now()}`,
          prompt: cleanPrompt,
          enhancedPrompt: finalPrompt,
          style: selectedStyle,
          aspectRatio: selectedRatio,
          width: ratioObj.width,
          height: ratioObj.height,
          imageUrl: fallbackUrl,
          timestamp: Date.now(),
          seed: activeSeed,
        };
        setCurrentImage(newImgData);
        onImageGenerated(newImgData);
      };

      fallbackImg.onerror = () => {
        setIsLoading(false);
        setLoadingStep(0);
        setErrorMsg(
          lang === 'bn'
            ? 'ছবি লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
            : 'Failed to generate image. Please try again or modify your prompt.'
        );
      };
    };
  };

  // Download high-resolution image blob
  const handleDownload = async (imgUrl: string, filenamePrompt: string) => {
    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      const cleanName = filenamePrompt.slice(0, 25).replace(/[^a-zA-Z0-9\u0980-\u09FF]/g, '_');
      link.download = `LuminaAI_${cleanName || 'image'}_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch {
      // Fallback direct link download
      const link = document.createElement('a');
      link.href = imgUrl;
      link.target = '_blank';
      link.download = `LuminaAI_image_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCopyPrompt = () => {
    if (currentImage) {
      navigator.clipboard.writeText(currentImage.prompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  const handleCopyLink = () => {
    if (currentImage) {
      navigator.clipboard.writeText(currentImage.imageUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleShare = async () => {
    if (currentImage && navigator.share) {
      try {
        await navigator.share({
          title: 'AI Content Studio Image',
          text: currentImage.prompt,
          url: currentImage.imageUrl,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="space-y-8">
      {/* Lightbox Modal */}
      {lightboxOpen && currentImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-12 right-0 text-white bg-slate-800/80 hover:bg-slate-700 p-2 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={currentImage.imageUrl} 
              alt={currentImage.prompt}
              className="max-h-[80vh] w-auto rounded-2xl shadow-2xl object-contain border border-slate-700"
              onClick={e => e.stopPropagation()}
            />
            <div className="mt-3 text-center text-xs text-slate-300 max-w-2xl px-4 line-clamp-2">
              "{currentImage.prompt}"
            </div>
          </div>
        </div>
      )}

      {/* Generation Panel */}
      <div className="glass-card p-5 sm:p-7 md:p-8 rounded-3xl shadow-2xl space-y-6">
        {/* Prompt Input Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>{lang === 'bn' ? 'আপনার প্রম্পট লিখুন (Prompt)' : 'Enter Your Prompt'}</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSurpriseMe}
                className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 bg-purple-500/10 hover:bg-purple-500/20 px-2.5 py-1 rounded-lg border border-purple-500/20 transition"
              >
                <Wand2 className="w-3 h-3" />
                <span>{lang === 'bn' ? 'সারপ্রাইজ আইডিয়া' : 'Surprise Me'}</span>
              </button>
              <button
                type="button"
                onClick={handleEnhancePrompt}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-indigo-500/10 hover:bg-indigo-500/20 px-2.5 py-1 rounded-lg border border-indigo-500/20 transition"
                title="Enhance prompt with photorealistic tags"
              >
                <Sparkles className="w-3 h-3" />
                <span>{lang === 'bn' ? 'এনহ্যান্স' : 'Enhance'}</span>
              </button>
            </div>
          </div>

          {/* Textarea */}
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="w-full p-4 pr-10 bg-slate-900/90 border border-slate-700/80 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-100 placeholder-slate-500 text-sm transition"
              placeholder={
                lang === 'bn'
                  ? 'উদাহরণ: একটি কিউট বিড়াল চশমা পরে লাইব্রেরিতে বই পড়ছে, সিনেমাটিক লাইটিং, 8K...'
                  : 'Example: A photorealistic cute cat wearing glasses reading an ancient book in a warm library, cinematic lighting, 8k...'
              }
            />
            {prompt && (
              <button
                onClick={() => setPrompt('')}
                className="absolute top-3 right-3 text-slate-500 hover:text-slate-300 p-1"
                title="Clear prompt"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Sample Prompts */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-medium text-slate-400">
            {lang === 'bn' ? '💡 দ্রুত ব্যবহারের জন্য আইডিয়া প্রম্পট:' : '💡 Quick Inspiration Prompts:'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_PROMPTS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(lang === 'bn' ? sample.bn : sample.en)}
                className="text-xs text-left bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-slate-700/50 transition-colors line-clamp-1 max-w-full"
              >
                {lang === 'bn' ? sample.bn.slice(0, 38) + '...' : sample.en.slice(0, 42) + '...'}
              </button>
            ))}
          </div>
        </div>

        {/* Style Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">
            {lang === 'bn' ? 'আর্ট স্টাইল নির্বাচন করুন (Style Presets)' : 'Choose Art Style'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {STYLE_PRESETS.map((preset) => {
              const isSelected = selectedStyle === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedStyle(preset.id)}
                  className={`p-2.5 rounded-xl text-left border text-xs font-medium transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-indigo-600/25 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-indigo-400' : 'bg-slate-600'}`} />
                  <span className="truncate">
                    {lang === 'bn' ? preset.nameBn : preset.nameEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Aspect Ratio Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">
            {lang === 'bn' ? 'ছবির সাইজ ও অনুপাত (Aspect Ratio)' : 'Image Aspect Ratio'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ASPECT_RATIOS.map((ratio) => {
              const isSelected = selectedRatio === ratio.id;
              return (
                <button
                  key={ratio.id}
                  type="button"
                  onClick={() => setSelectedRatio(ratio.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-600/25 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs">{ratio.label}</span>
                    <span className="text-[10px] text-slate-400">{ratio.ratio}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">
                    {lang === 'bn' ? ratio.descriptionBn : ratio.descriptionEn}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Advanced Options Accordion */}
        <div className="border-t border-slate-800/80 pt-4">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            <span>
              {showAdvanced
                ? (lang === 'bn' ? 'অ্যাডভান্সড সেটিংস লুকান' : 'Hide Advanced Settings')
                : (lang === 'bn' ? 'অ্যাডভান্সড সেটিংস (Negative Prompt & Seed)' : 'Advanced Settings (Negative Prompt & Seed)')}
            </span>
          </button>

          {showAdvanced && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  {lang === 'bn' ? 'নেগেটিভ প্রম্পট (যা ছবিতে চান না)' : 'Negative Prompt (Avoid)'}
                </label>
                <input
                  type="text"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="e.g. blurry, low quality, bad anatomy, deformed"
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-medium text-slate-300">
                    {lang === 'bn' ? 'সীড কোড (Seed)' : 'Seed Number'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setSeed(Math.floor(Math.random() * 999999))}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <RotateCw className="w-2.5 h-2.5" />
                    <span>Random</span>
                  </button>
                </div>
                <input
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit Generate Button */}
        <button
          onClick={() => handleGenerate()}
          disabled={isLoading}
          className="w-full relative group overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-600/25 transition duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>
                {loadingStep === 1 && (lang === 'bn' ? 'প্রম্পট বিশ্লেষণ হচ্ছে...' : 'Analyzing prompt...')}
                {loadingStep === 2 && (lang === 'bn' ? 'এআই ছবি আঁকছে...' : 'Generating pixels...')}
                {loadingStep >= 3 && (lang === 'bn' ? 'ছবি সম্পন্ন হচ্ছে...' : 'Finalizing details...')}
              </span>
            </div>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span className="text-base tracking-wide">
                {lang === 'bn' ? 'ছবি তৈরি করুন (Generate Image)' : 'Generate AI Image'}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Image Result Display Box */}
      <div className="border border-slate-800/90 rounded-3xl bg-slate-950/70 p-4 sm:p-6 min-h-[380px] flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center space-y-4 py-12">
            <div className="relative w-16 h-16 mx-auto">
              <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <Sparkles className="w-6 h-6 text-indigo-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-semibold text-indigo-400">
                {lang === 'bn' ? 'এআই আপনার ছবি তৈরি করছে, অপেক্ষা করুন...' : 'AI is creating your masterpiece, please wait...'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {lang === 'bn' ? 'উচ্চ রেজোলিউশন ও ফাইনাল ডিটেইলিং যোগ করা হচ্ছে' : 'Applying high resolution & fine textures'}
              </p>
            </div>
          </div>
        )}

        {/* Empty Placeholder */}
        {!isLoading && !currentImage && (
          <div className="text-center text-slate-600 py-12 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <ImageIcon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">
                {lang === 'bn' ? 'আপনার তৈরি করা ছবি এখানে প্রদর্শিত হবে' : 'Your generated image will appear here'}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                {lang === 'bn' ? 'উপরের বক্সে যেকোনো প্রম্পট লিখে "ছবি তৈরি করুন" বাটনে চাপুন' : 'Enter any prompt above and click "Generate AI Image"'}
              </p>
            </div>
          </div>
        )}

        {/* Render Result Image & Controls */}
        {!isLoading && currentImage && (
          <div className="w-full flex flex-col items-center space-y-4">
            {/* Image Container with Actions overlay */}
            <div className="relative group max-w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/50 shadow-2xl">
              <img
                src={currentImage.imageUrl}
                alt={currentImage.prompt}
                className="max-h-[500px] w-auto object-contain rounded-2xl transition-transform duration-300"
              />

              {/* Quick Hover Controls */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-xl backdrop-blur-md border border-slate-700/70 transition shadow"
                  title="Expand Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Info Bar inside image container */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent p-3 sm:p-4 text-xs text-slate-200 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <p className="line-clamp-2 font-medium">"{currentImage.prompt}"</p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="w-full max-w-xl flex flex-wrap items-center justify-center gap-2 pt-2">
              {/* Primary Download Button */}
              <button
                onClick={() => handleDownload(currentImage.imageUrl, currentImage.prompt)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 transition flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'bn' ? 'ছবি ডাউনলোড করুন (HD)' : 'Download Image (HD)'}</span>
              </button>

              {/* Regenerate Button */}
              <button
                onClick={() => handleGenerate()}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer"
                title="Regenerate with a new seed"
              >
                <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
                <span>{lang === 'bn' ? 'পুনরায় তৈরি' : 'Regenerate'}</span>
              </button>

              {/* Copy Prompt */}
              <button
                onClick={handleCopyPrompt}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer"
              >
                {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPrompt ? (lang === 'bn' ? 'কপি হয়েছে' : 'Copied!') : (lang === 'bn' ? 'প্রম্পট কপি' : 'Copy Prompt')}</span>
              </button>

              {/* Share / Copy Link */}
              <button
                onClick={handleShare}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                title="Share or copy image link"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-pink-400" />}
                <span>{copiedLink ? 'Link Copied' : (lang === 'bn' ? 'শেয়ার' : 'Share')}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recent Generations Carousel / Grid */}
      {recentImages.length > 0 && (
        <div className="glass-card p-5 sm:p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-200">
                {lang === 'bn' ? 'সাম্প্রতিক তৈরি করা ছবিসমূহ' : 'Recent Creations'}
              </h3>
              <span className="text-xs text-slate-500 font-mono">({recentImages.length})</span>
            </div>
            <button
              onClick={onClearHistory}
              className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1 transition"
            >
              <Trash2 className="w-3 h-3" />
              <span>{lang === 'bn' ? 'হিস্ট্রি মুছুন' : 'Clear'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {recentImages.slice(0, 6).map((img) => (
              <div
                key={img.id}
                onClick={() => {
                  setCurrentImage(img);
                  setPrompt(img.prompt);
                }}
                className={`group relative rounded-xl overflow-hidden aspect-square border cursor-pointer transition-all duration-200 ${
                  currentImage?.id === img.id
                    ? 'border-indigo-500 ring-2 ring-indigo-500/40'
                    : 'border-slate-800 hover:border-slate-600'
                }`}
              >
                <img
                  src={img.imageUrl}
                  alt={img.prompt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end text-[10px] text-white">
                  <p className="line-clamp-2">{img.prompt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
