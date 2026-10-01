import React, { useState } from 'react';
import { 
  Video, 
  Sparkles, 
  Download, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Film, 
  Clock, 
  Monitor, 
  Smartphone,
  Copy,
  Zap
} from 'lucide-react';
import { Language } from '../types';

interface TextToVideoProps {
  lang: Language;
}

export const TextToVideo: React.FC<TextToVideoProps> = ({ lang }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [duration, setDuration] = useState<number>(10); // 5s or 10s
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressStep, setProgressStep] = useState<string>('');

  const samplePrompts = [
    {
      bn: 'মেঘলা দিনে সূর্যাস্তের আলোয় সমুদ্রের তীরে হাঁটছে একটি রোবট, সিনেমাটিক লাইটিং, ৮কে',
      en: 'A cinematic shot of a sleek futuristic robot walking along a golden beach at sunset, 4k ultra realistic',
    },
    {
      bn: 'একটি মহাজাগতিক গ্যালাক্সির ভেতর দিয়ে ছুটে চলা আলোর কণা, ফিউচারিস্টিক স্পেস ট্রাভেল',
      en: 'Cosmic voyage through swirling luminous nebulae and star clusters, hyper-detailed motion',
    },
    {
      bn: 'ঢাকা শহরের নিয়ন বাতি ঝলমলে ব্যস্ত রাস্তা, বৃষ্টিভেজা সাইবারপাঙ্ক স্টাইল',
      en: 'Rainy neon cyberpunk street in Dhaka city at night, glowing reflection on asphalt, 8k',
    },
    {
      bn: 'একটি ছোট রঙিন পাখি ফুলের ওপর নেচে বেড়াচ্ছে, স্লো মোশন ভিডিও',
      en: 'Close-up slow motion video of a hummingbird sipping nectar from a vibrant exotic flower',
    },
  ];

  const handleGenerateVideo = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);
    setProgressStep(
      lang === 'bn' ? 'ভিডিও সিন্থেসিস ইঞ্জিন শুরু হচ্ছে...' : 'Initializing video synthesis engine...'
    );

    try {
      // Step feedback updates
      const stepTimer1 = setTimeout(() => {
        setProgressStep(
          lang === 'bn' ? 'ফ্রেম সিকোয়েন্স ও মোশন রেন্ডারিং চলছে...' : 'Generating frame sequences & motion vectors...'
        );
      }, 3000);

      const stepTimer2 = setTimeout(() => {
        setProgressStep(
          lang === 'bn' ? 'ওয়াটারমার্ক-মুক্ত MP4 এনকোডিং সম্পন্ন হচ্ছে...' : 'Encoding 100% watermark-free MP4 stream...'
        );
      }, 7000);

      const response = await fetch('/api/text-to-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          duration,
          aspectRatio,
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      const responseText = await response.text();
      let data: any = null;

      try {
        if (responseText && responseText.trim()) {
          data = JSON.parse(responseText);
        }
      } catch (parseErr) {
        console.error('Failed to parse server response:', responseText, parseErr);
        throw new Error(
          lang === 'bn' 
            ? 'সার্ভার থেকে সঠিক ফরম্যাটে ডেটা পাওয়া যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।' 
            : 'Invalid response from server. Please try again.'
        );
      }

      if (!response.ok || !data || !data.videoUrl) {
        const errorMsg = data?.error || (
          lang === 'bn' 
            ? 'ভিডিও তৈরি করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' 
            : 'Failed to generate video. Please try again.'
        );
        throw new Error(errorMsg);
      }

      setVideoUrl(data.videoUrl);
      setProgressStep('');
    } catch (err: any) {
      console.error('Video generation error:', err);
      setError(
        err.message ||
          (lang === 'bn'
            ? 'ভিডিও তৈরি করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
            : 'Failed to generate video. Please try again.')
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!videoUrl) return;
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `lumiqra-video-${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in select-none">
      {/* Header Info */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold">
          <Film className="w-3.5 h-3.5 text-pink-400" />
          <span>{lang === 'bn' ? 'ওয়াটারমার্ক-মুক্ত এআই ভিডিও স্টুডিও' : 'Watermark-Free AI Video Studio'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
          {lang === 'bn' ? (
            <>
              টেক্সট থেকে তৈরি করুন <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">১০ সেকেন্ডের ফুল এইচডি ভিডিও</span>
            </>
          ) : (
            <>
              Generate Stunning <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">10-Second HD Videos</span>
            </>
          )}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          {lang === 'bn'
            ? 'বাংলা বা ইংরেজিতে আপনার দৃশ্য কল্পনা লিখুন। কোনো লোগো বা ওয়াটারমার্ক ছাড়াই সরাসরি ডাউনলোডযোগ্য MP4 ভিডিও পাবেন।'
            : 'Describe any cinematic scene in Bangla or English. Generate 100% clean, watermark-free MP4 videos instantly.'}
        </p>
      </div>

      {/* Main Studio Controls Card */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 sm:p-7 shadow-2xl backdrop-blur-xl space-y-5">
        {/* Prompt Input */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-bold text-slate-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-pink-400" />
              {lang === 'bn' ? 'ভিডিওর প্রম্পট বা দৃশ্য বর্ণনা' : 'Video Prompt & Scene Description'}
            </span>
            <span className="text-[11px] font-normal text-slate-400">
              {prompt.length} / 500
            </span>
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder={
              lang === 'bn'
                ? 'উদাহরণ: একটি সিনেমাটিক সাইবারপাঙ্ক শহর, বৃষ্টিভেজা নিয়ন আলো, ৪কে কোয়ালিটি...'
                : 'e.g. A majestic eagle soaring over snow-capped mountains during golden hour, cinematic 4k...'
            }
            className="w-full p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 focus:border-pink-500/70 focus:ring-2 focus:ring-pink-500/20 text-slate-100 placeholder-slate-400 text-xs sm:text-sm focus:outline-none resize-none leading-relaxed transition"
          />
        </div>

        {/* Configuration Row: Duration & Aspect Ratio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Duration Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{lang === 'bn' ? 'ভিডিও দৈর্ঘ্য (Duration)' : 'Video Duration'}</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDuration(5)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  duration === 5
                    ? 'bg-pink-600/20 border-pink-500 text-white shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>৫ সেকেন্ড (5s)</span>
              </button>
              <button
                type="button"
                onClick={() => setDuration(10)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  duration === 10
                    ? 'bg-pink-600/20 border-pink-500 text-white shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Zap className="w-3 h-3 text-pink-400" />
                <span>১০ সেকেন্ড (10s Max)</span>
              </button>
            </div>
          </div>

          {/* Aspect Ratio Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5 text-purple-400" />
              <span>{lang === 'bn' ? 'সাইজ / অ্যাস্পেক্ট রেশিও' : 'Aspect Ratio'}</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAspectRatio('16:9')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  aspectRatio === '16:9'
                    ? 'bg-purple-600/20 border-purple-500 text-white shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>১৬:৯ (YouTube)</span>
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio('9:16')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  aspectRatio === '9:16'
                    ? 'bg-purple-600/20 border-purple-500 text-white shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>৯:১৬ (Reels / Shorts)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sample Prompt Shortcuts */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-400">
            {lang === 'bn' ? '💡 দ্রুত টেস্ট করার জন্য তৈরি প্রম্পট:' : '💡 Quick test prompts:'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(lang === 'bn' ? s.bn : s.en)}
                className="py-1 px-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-pink-500/40 text-[11px] text-slate-300 hover:text-white transition text-left cursor-pointer truncate max-w-full sm:max-w-xs"
              >
                {lang === 'bn' ? s.bn : s.en}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="button"
          onClick={handleGenerateVideo}
          disabled={!prompt.trim() || isGenerating}
          className={`w-full py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition shadow-xl cursor-pointer ${
            !prompt.trim() || isGenerating
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white shadow-pink-600/30 transform hover:scale-[1.01] active:scale-[0.99]'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <span>{lang === 'bn' ? 'ভিডিও জেনারেট হচ্ছে...' : 'Generating Video...'}</span>
            </>
          ) : (
            <>
              <Film className="w-4 h-4" />
              <span>{lang === 'bn' ? 'ভিডিও তৈরি করুন (Generate Video)' : 'Generate Video (10s Max)'}</span>
            </>
          )}
        </button>

        {/* Status / Error feedback */}
        {isGenerating && progressStep && (
          <div className="p-3 rounded-xl bg-slate-950/80 border border-indigo-500/30 flex items-center gap-2 text-xs text-indigo-300 animate-pulse">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{progressStep}</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Resulting Video Player */}
      {videoUrl && (
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 sm:p-7 shadow-2xl backdrop-blur-xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 text-xs sm:text-sm font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{lang === 'bn' ? 'ভিডিও তৈরি সম্পন্ন হয়েছে (১০০% ওয়াটারমার্ক মুক্ত)' : 'Video Generated (100% Watermark Free)'}</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              MP4 • {duration}s • {aspectRatio}
            </span>
          </div>

          {/* HTML5 Video Player */}
          <div className={`relative mx-auto rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center min-h-[220px] ${
            aspectRatio === '9:16' ? 'max-w-xs' : 'w-full'
          }`}>
            <video
              key={videoUrl}
              src={videoUrl}
              controls
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onError={() => {
                console.warn('Video failed to render in HTML5 player');
                setError(
                  lang === 'bn' 
                    ? 'ভিডিওটি প্লে করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার তৈরি করুন বা ডাউনলোড করে দেখুন।' 
                    : 'Video playback encountered an error. Please try generating again or download the file.'
                );
              }}
              className="w-full h-auto object-contain max-h-[500px]"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={() => {
                setVideoUrl(null);
                setPrompt('');
              }}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'আরেকটি তৈরি করুন' : 'Generate Another'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-teal-600/30 transition transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{lang === 'bn' ? 'ডাউনলোড MP4 (ওয়াটারমার্ক ছাড়া)' : 'Download MP4 (Clean)'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextToVideo;
