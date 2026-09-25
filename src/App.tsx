import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AdBanner } from './components/AdBanner';
import { ImageStudio } from './components/ImageStudio';
import { VoiceStudio } from './components/VoiceStudio';
import { ChatStudio } from './components/ChatStudio';
import { BgRemoverStudio } from './components/BgRemoverStudio';
import { HistoryGallery } from './components/HistoryGallery';
import { Footer } from './components/Footer';
import { Language, GeneratedImage, VoiceHistoryItem } from './types';
import { 
  Image as ImageIcon, 
  Mic, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Palette, 
  Sliders, 
  CheckCircle2, 
  Layers,
  MessageSquare,
  Eraser
} from 'lucide-react';

const STORAGE_KEY_IMAGES = 'ai_studio_images_v1';
const STORAGE_KEY_VOICES = 'ai_studio_voices_v1';
const STORAGE_KEY_LANG = 'ai_studio_lang_v1';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LANG);
    return saved === 'en' ? 'en' : 'bn';
  });

  const [activeTab, setActiveTab] = useState<'image' | 'voice' | 'chat' | 'bg-remover' | 'history'>('image');

  const [recentImages, setRecentImages] = useState<GeneratedImage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_IMAGES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [voiceHistory, setVoiceHistory] = useState<VoiceHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VOICES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_IMAGES, JSON.stringify(recentImages));
    } catch (e) {
      console.warn('Failed to save images to local storage:', e);
    }
  }, [recentImages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VOICES, JSON.stringify(voiceHistory));
    } catch (e) {
      console.warn('Failed to save voice history to local storage:', e);
    }
  }, [voiceHistory]);

  const handleToggleLang = () => {
    const newLang = lang === 'bn' ? 'en' : 'bn';
    setLang(newLang);
    localStorage.setItem(STORAGE_KEY_LANG, newLang);
  };

  const handleImageGenerated = (newImg: GeneratedImage) => {
    setRecentImages((prev) => [newImg, ...prev.filter(i => i.id !== newImg.id)].slice(0, 30));
  };

  const handleVoiceHistoryAdd = (newItem: VoiceHistoryItem) => {
    setVoiceHistory((prev) => [newItem, ...prev].slice(0, 20));
  };

  const handleClearImages = () => {
    if (window.confirm(lang === 'bn' ? 'আপনি কি সব সংরক্ষিত ছবি মুছতে চান?' : 'Clear all saved images?')) {
      setRecentImages([]);
      localStorage.removeItem(STORAGE_KEY_IMAGES);
    }
  };

  const handleClearVoices = () => {
    if (window.confirm(lang === 'bn' ? 'আপনি কি সব ভয়েস ইতিহাস মুছতে চান?' : 'Clear all voice history?')) {
      setVoiceHistory([]);
      localStorage.removeItem(STORAGE_KEY_VOICES);
    }
  };

  const handleSelectImageFromHistory = (img: GeneratedImage) => {
    setActiveTab('image');
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header
        lang={lang}
        onToggleLang={handleToggleLang}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        historyCount={recentImages.length + voiceHistory.length}
      />

      {/* Top AdSense Banner */}
      <AdBanner placement="top" format="leaderboard" />

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto w-full px-4 py-4 sm:py-6 flex-grow">
        {/* Hero Section */}
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{lang === 'bn' ? '১০০% ফ্রি আনলিমিটেড এআই ক্রিয়েটর' : '100% Free Unlimited AI Creator'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight">
            {lang === 'bn' ? (
              <>
                সহজেই তৈরি করুন <span className="gradient-text">এআই ইমেজ ও ভয়েস</span>
              </>
            ) : (
              <>
                Effortlessly Generate <span className="gradient-text">AI Images & Voiceovers</span>
              </>
            )}
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            {lang === 'bn'
              ? 'যেকোনো প্রম্পট লিখুন এবং কয়েক সেকেন্ডে পেয়ে যান আল্ট্রা হাই-কোয়ালিটি ছবি ও বাস্তবসম্মত মনকাড়া ভয়েসওভার।'
              : 'Type any text prompt or script and get ultra high-resolution artwork and studio-quality speech in seconds.'}
          </p>
        </div>

        {/* Navigation Tabs (Image / Voice / BG Remover / Chat / History) - Gemini inspired sleek navigation */}
        <div className="flex justify-center p-1.5 bg-slate-900/90 border border-slate-800/80 rounded-2xl max-w-3xl mx-auto mb-8 shadow-xl backdrop-blur-xl gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 min-w-[110px] py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'image'
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-white/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ImageIcon className="w-4 h-4 shrink-0 text-indigo-300" />
            <span className="truncate">{lang === 'bn' ? 'টেক্সট টু ইমেজ' : 'Text to Image'}</span>
          </button>

          <button
            onClick={() => setActiveTab('voice')}
            className={`flex-1 min-w-[110px] py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'voice'
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-white/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Mic className="w-4 h-4 shrink-0 text-purple-300" />
            <span className="truncate">{lang === 'bn' ? 'টেক্সট টু ভয়েস' : 'Text to Voice'}</span>
          </button>

          <button
            onClick={() => setActiveTab('bg-remover')}
            className={`flex-1 min-w-[130px] py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'bg-remover'
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-lg shadow-emerald-600/30 ring-1 ring-white/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Eraser className="w-4 h-4 shrink-0 text-emerald-400" />
            <span className="truncate">{lang === 'bn' ? 'ব্যাকগ্রাউন্ড রিমুভার' : 'BG Remover'}</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 min-w-[110px] py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30 ring-1 ring-white/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0 text-pink-300 animate-pulse" />
            <span className="truncate">{lang === 'bn' ? 'এআই চ্যাট' : 'AI Chat'}</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-white/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
            title="View History / গ্যালারি"
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === 'bn' ? 'গ্যালারি' : 'History'}</span>
          </button>
        </div>

        {/* Tab 1: Text to Image */}
        {activeTab === 'image' && (
          <ImageStudio
            lang={lang}
            onImageGenerated={handleImageGenerated}
            recentImages={recentImages}
            onClearHistory={handleClearImages}
          />
        )}

        {/* Tab 2: Text to Voice */}
        {activeTab === 'voice' && (
          <VoiceStudio
            lang={lang}
            onVoiceHistoryAdd={handleVoiceHistoryAdd}
            voiceHistory={voiceHistory}
          />
        )}

        {/* Tab 3: Background Remover Studio */}
        {activeTab === 'bg-remover' && (
          <BgRemoverStudio lang={lang} />
        )}

        {/* Tab 4: AI Chat Q&A Studio */}
        {activeTab === 'chat' && (
          <ChatStudio lang={lang} />
        )}

        {/* Tab 5: History Gallery */}
        {activeTab === 'history' && (
          <HistoryGallery
            lang={lang}
            images={recentImages}
            voiceItems={voiceHistory}
            onClearAllImages={handleClearImages}
            onClearAllVoices={handleClearVoices}
            onSelectImage={handleSelectImageFromHistory}
          />
        )}

        {/* Middle AdSense Banner */}
        <div className="my-8">
          <AdBanner placement="middle" format="responsive" />
        </div>

        {/* Features Showcase Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-200">
              {lang === 'bn' ? '১০০% ফ্রি ও আনলিমিটেড' : '100% Free & Unlimited'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'bn'
                ? 'কোনো ক্রেডিট কার্ড বা মাসিক ফি নেই। যত খুশি ছবি, ভয়েস ও চ্যাট ব্যবহার করুন।'
                : 'No credit card or recurring fees required. Unlimited images, voices and chats.'}
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-200">
              {lang === 'bn' ? '৮K রেজোলিউশন ও স্টাইল' : '8K Styles & Ratios'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'bn'
                ? 'অ্যানিমে, ফটোরিয়ালিস্টিক, থ্রিডি পিক্সার, সাইবারপাঙ্ক ও রিলস/শর্টস ফরম্যাট।'
                : 'Multiple artistic styles including 3D Pixar, Anime, Photorealistic and 9:16 portrait.'}
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <Mic className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-200">
              {lang === 'bn' ? 'বাংলা ও বহুভাষী ভয়েস' : 'Bangla & Multi-lingual'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'bn'
                ? 'সুস্পষ্ট বাংলা উচ্চারণ, গতি ও পিচ নিয়ন্ত্রণ এবং সরাসরি অডিও ডাউনলোড সুবিধা।'
                : 'Natural Bangla and English accents with speed, pitch controls and audio file download.'}
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-200">
              {lang === 'bn' ? 'তাৎক্ষণিক সঠিক উত্তর' : 'Instant AI Q&A'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'bn'
                ? 'যেকোনো সাধারণ জ্ঞান, পড়াশোনা, টেকনোলজি বা জীবনযাত্রার সঠিক উত্তর এক সেকেন্ডে।'
                : 'Ask any question on science, study, tech or life and get accurate instant replies.'}
            </p>
          </div>
        </div>
      </main>

      {/* Bottom AdSense Banner */}
      <AdBanner placement="bottom" format="leaderboard" />

      {/* Footer */}
      <Footer lang={lang} />
    </div>
  );
}
