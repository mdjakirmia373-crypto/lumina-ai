import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AuthModal } from './components/AuthModal';
import { PolicyModal, PolicyTab } from './components/PolicyModal';
import { CookieBanner } from './components/CookieBanner';
import { ImageStudio } from './components/ImageStudio';
import { VoiceStudio } from './components/VoiceStudio';
import { ChatStudio } from './components/ChatStudio';
import { BgRemoverStudio } from './components/BgRemoverStudio';
import { HistoryGallery } from './components/HistoryGallery';
import { Footer } from './components/Footer';
import { Language, GeneratedImage, VoiceHistoryItem, UserAccount } from './types';
import { 
  Sparkles, 
  Zap, 
  Palette, 
  Mic, 
  MessageSquare
} from 'lucide-react';

const STORAGE_KEY_IMAGES = 'ai_studio_images_v1';
const STORAGE_KEY_VOICES = 'ai_studio_voices_v1';
const STORAGE_KEY_LANG = 'ai_studio_lang_v1';
const STORAGE_CURRENT_USER_KEY = 'lumiqra_ai_current_user_v1';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LANG);
    return saved === 'en' ? 'en' : 'bn';
  });

  const [activeTab, setActiveTab] = useState<'image' | 'voice' | 'chat' | 'bg-remover' | 'history'>('image');
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);

  // Authentication State (Never force-block visitors or search engine bots)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Policy Modal state for Google AdSense compliance
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [policyTab, setPolicyTab] = useState<PolicyTab>('privacy');

  const handleOpenPolicy = (tab: PolicyTab) => {
    setPolicyTab(tab);
    setIsPolicyModalOpen(true);
  };

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

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    if (window.confirm(lang === 'bn' ? 'আপনি কি নিশ্চিত লগআউট করতে চান?' : 'Are you sure you want to sign out?')) {
      setCurrentUser(null);
      localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
      setIsAuthModalOpen(true);
    }
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

  const handleSelectImageFromHistory = (_img: GeneratedImage) => {
    setActiveTab('image');
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Sign Up / Login Mandatory Modal for First-Time or Returning Users */}
      <AuthModal
        lang={lang}
        isOpen={isAuthModalOpen}
        onLoginSuccess={handleLoginSuccess}
        allowClose={currentUser !== null}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Google AI Studio Style Left Sidebar */}
      <Sidebar
        lang={lang}
        onToggleLang={handleToggleLang}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        isOpenMobile={isSidebarMobileOpen}
        onCloseMobile={() => setIsSidebarMobileOpen(false)}
      />

      {/* Main Content Area (Shifted right on Desktop to make room for Sidebar) */}
      <div className="lg:pl-72 flex flex-col min-h-screen transition-all duration-300">
        {/* Top Header */}
        <Header
          lang={lang}
          onToggleLang={handleToggleLang}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
          onToggleSidebar={() => setIsSidebarMobileOpen(!isSidebarMobileOpen)}
        />

        {/* Main Content Area */}
        <main className="max-w-4xl mx-auto w-full px-4 py-4 sm:py-6 flex-grow">
          {/* Hero Section */}
          <div className="text-center mb-6 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>{lang === 'bn' ? 'গুগল এআই স্টুডিও অনুপ্রাণিত ক্রিয়েটর' : 'Google AI Studio Inspired Suite'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight">
              {lang === 'bn' ? (
                <>
                  সহজেই তৈরি করুন <span className="gradient-text">এআই ইমেজ, ভয়েস ও চ্যাট</span>
                </>
              ) : (
                <>
                  Effortlessly Generate <span className="gradient-text">AI Images, Voice & Chat</span>
                </>
              )}
            </h1>

            <p className="text-slate-400 text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              {lang === 'bn'
                ? 'বাম পাশের মেনু থেকে যেকোনো স্টুডিও ক্যাটাগরি বেছে নিন এবং এক ক্লিকে সেরা কাজ সম্পন্ন করুন।'
                : 'Select any studio category from the left sidebar and unleash studio-grade AI generation.'}
            </p>
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

          {/* Features Showcase Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
            <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-200">
                {lang === 'bn' ? '১০০% ফ্রি ও সুরক্ষিত' : '100% Free & Protected'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'bn'
                  ? 'আপনার ব্যক্তিগত একাউন্টে সবকিছু নিরাপদ থাকবে। আনলিমিটেড ক্রিয়েশন কোনো চার্জ ছাড়াই।'
                  : 'Your account is private and secure. Enjoy unlimited creation without any charge.'}
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-200">
                {lang === 'bn' ? '৮K রেজোলিউশন ও সাইজ' : '8K Styles & Sizes'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'bn'
                  ? 'অ্যানিমে, ৩ডি পিক্সার, ফটোরিয়ালিস্টিক, সাইবারপাঙ্ক ও ১৬:৯, ৯:১৬ ফ্রেম।'
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
                  ? 'গল্প লেখা, পড়াশোনা, টেকনোলজি বা যেকোনো সাধারণ জ্ঞানের সঠিক উত্তর।'
                  : 'Ask any question on science, study, tech or life and get accurate instant replies.'}
              </p>
            </div>
          </div>
        </main>

        {/* Footer with Google AdSense Compliant Links */}
        <Footer 
          lang={lang} 
          onOpenPolicy={handleOpenPolicy} 
        />

        {/* Mandatory Policy & Legal Modal */}
        <PolicyModal
          isOpen={isPolicyModalOpen}
          onClose={() => setIsPolicyModalOpen(false)}
          lang={lang}
          initialTab={policyTab}
        />

        {/* Privacy & Cookie Consent Banner */}
        <CookieBanner
          lang={lang}
          onOpenPrivacy={() => handleOpenPolicy('privacy')}
        />
      </div>
    </div>
  );
}
