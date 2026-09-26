import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  Info, 
  Mail, 
  AlertTriangle, 
  Cookie, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { Language } from '../types';

export type PolicyTab = 'privacy' | 'terms' | 'about' | 'contact' | 'disclaimer';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialTab?: PolicyTab;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  lang,
  initialTab = 'privacy',
}) => {
  const [activeTab, setActiveTab] = useState<PolicyTab>(initialTab);

  // Sync tab when opened
  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {lang === 'bn' ? 'পলিসি ও আইনগত তথ্য' : 'Policies & Legal Information'}
              </h2>
              <p className="text-[11px] text-slate-400">
                Lumiqra AI · Google AdSense & Publisher Compliance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-950/40 border-b border-slate-800/80 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'গোপনীয়তা নীতি (Privacy)' : 'Privacy Policy'}</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'শর্তাবলী (Terms)' : 'Terms of Service'}</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'about'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'আমাদের সম্পর্কে (About)' : 'About Us'}</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'contact'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'যোগাযোগ (Contact)' : 'Contact Us'}</span>
          </button>

          <button
            onClick={() => setActiveTab('disclaimer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'disclaimer'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'ডিসক্লেইমার (Disclaimer)' : 'AI Disclaimer'}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
          {/* TAB 1: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  <span>{lang === 'bn' ? 'লুমিক্রা এআই - গোপনীয়তা নীতি (Privacy Policy)' : 'Lumiqra AI - Privacy Policy'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {lang === 'bn' ? 'সর্বশেষ হালনাগাদ: সেপ্টেম্বর ২০২৬ · কার্যকর ও বাধ্যতামূলক' : 'Last Updated: September 2026 · Effective Immediately'}
                </p>
              </div>

              <section className="space-y-2">
                <h4 className="font-semibold text-slate-100 text-sm">
                  {lang === 'bn' ? '১. আমরা কোন তথ্য সংগ্রহ করি?' : '1. Information We Collect'}
                </h4>
                <p>
                  {lang === 'bn'
                    ? 'Lumiqra AI ব্যবহারকারীর সর্বোচ্চ গোপনীয়তা রক্ষা করতে প্রতিশ্রুতিবদ্ধ। আমাদের ওয়েবসাইট ব্যবহারের সময় আপনার ব্যক্তিগত ব্রাউজিং ডেটা, প্রম্পট হিস্ট্রি বা ছবি আপনার ডিভাইসের ব্রাউজার লোকাল স্টোরেজে (Local Storage) সংরক্ষিত থাকে। আমরা কোনো গোপন ট্র্যাকিং সফটওয়্যার বা অননুমোদিত ডেটা সংগ্রহ করি না।'
                    : 'Lumiqra AI is strictly committed to protecting user privacy. When using our creative studio, your prompt history and generated assets are stored locally on your device via browser LocalStorage. We do not engage in unauthorized tracking or covert data harvesting.'}
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-semibold text-slate-100 text-sm flex items-center gap-2">
                  <Cookie className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'bn' ? '২. গুগল অ্যাডসেন্স ও কুকিজ নীতি (Google AdSense & Cookies)' : '2. Google AdSense & Cookies Disclosure'}</span>
                </h4>
                <p>
                  {lang === 'bn'
                    ? 'আমাদের ওয়েবসাইটে ব্যবহারকারীকে প্রাসঙ্গিক ও মানসম্মত বিজ্ঞাপন প্রদর্শনের জন্য Google AdSense ও অন্যান্য থার্ড-পার্টি বিজ্ঞাপন নেটওয়ার্ক কুকিজ (Cookies) এবং ওয়েব বীকন ব্যবহার করতে পারে। Google-এর ডাবলক্লিক কুকি (DoubleClick Cookie) ব্যবহার করে ব্যবহারকারীর ব্রাউজিং রুচি অনুযায়ী বিজ্ঞাপন পরিবেশন করা হয়।'
                    : 'To provide free access to our AI tools, we partner with Google AdSense and third-party advertising vendors who may utilize cookies, web beacons, and Google DoubleClick cookies to serve relevant advertisements based on user interactions across the web.'}
                </p>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-400 text-xs">
                  {lang === 'bn'
                    ? '💡 ব্যবহারকারী চাইলে Google Ad Settings (https://adssettings.google.com) থেকে পারসোনালাইজড বিজ্ঞাপন বন্ধ (Opt-out) করতে পারেন।'
                    : '💡 Users can customize or opt out of personalized advertising at any time by visiting Google Ad Settings (https://adssettings.google.com).'}
                </div>
              </section>

              <section className="space-y-2">
                <h4 className="font-semibold text-slate-100 text-sm">
                  {lang === 'bn' ? '৩. ব্যবহারকারীর অধিকার ও ডেটা নিরাপত্তা' : '3. User Rights & Data Protection'}
                </h4>
                <p>
                  {lang === 'bn'
                    ? 'আপনি যেকোনো সময় আপনার ব্রাউজারের ক্যাশ বা হিস্ট্রি গ্যালারি থেকে সব তৈরি করা ছবি ও ভয়েস মুছে ফেলতে পারবেন। আপনার পাসওয়ার্ড ও অ্যাকাউন্টের তথ্য আধুনিক ক্রিপ্টোগ্রাফিক অ্যালগরিদমে সংরক্ষিত থাকে।'
                    : 'You have full autonomy over your data. You may delete your generated images and audio history at any time using the in-app history controls or clearing your browser storage.'}
                </p>
              </section>
            </div>
          )}

          {/* TAB 2: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <span>{lang === 'bn' ? 'ব্যবহারের শর্তাবলী (Terms of Service)' : 'Terms of Service'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {lang === 'bn' ? 'Lumiqra AI প্ল্যাটফর্ম ব্যবহারের নিয়মাবলি' : 'Rules and guidelines governing the use of Lumiqra AI'}
                </p>
              </div>

              <section className="space-y-2">
                <h4 className="font-semibold text-slate-100 text-sm">
                  {lang === 'bn' ? '১. গ্রহণযোগ্য ব্যবহার নীতি (Acceptable Use Policy)' : '1. Acceptable Use Policy'}
                </h4>
                <p>
                  {lang === 'bn'
                    ? 'Lumiqra AI একটি সৃজনশীল মাধ্যম। ব্যবহারকারীগণ কোনো প্রকার অবৈধ, সহিংস, মানহানিকর, ধর্মীয় বিদ্বেষমূলক, পর্নোগ্রাফিক বা জাতীয় নিরাপত্তা বিরোধী ছবি বা ভয়েস জেনারেট করতে পারবেন না। এই নিয়মের লঙ্ঘন ঘটলে প্ল্যাটফর্ম ব্যবহারে নিষেধাজ্ঞা আরোপ করা হবে।'
                    : 'Lumiqra AI is designed strictly for creative, educational, and constructive content creation. Users agree not to generate hate speech, explicit sexual content, violence, defamatory material, harassment, or unlawful impersonation. Violations result in termination of service.'}
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-semibold text-slate-100 text-sm">
                  {lang === 'bn' ? '২. বাণিজ্যিক ও ব্যক্তিগত ব্যবহারের অধিকার' : '2. Commercial & Personal Usage Rights'}
                </h4>
                <p>
                  {lang === 'bn'
                    ? 'Lumiqra AI-এর মাধ্যমে আপনার তৈরি করা ছবি ও ভয়েসওভার আপনি ইউটিউব কনটেন্ট, ফেসবুক পেজ, সোশ্যাল মিডিয়া, ওয়েবসাইট ডিজাইন কিংবা ব্যক্তিগত প্রজেক্টে স্বাধীনভাবে ব্যবহার করতে পারেন।'
                    : 'Users retain the freedom to download and utilize their generated visual art and synthesized voiceovers for personal projects, social media creation, YouTube videos, and creative endeavors.'}
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-semibold text-slate-100 text-sm">
                  {lang === 'bn' ? '৩. সেবার নিশ্চয়তা ও দায়মুক্তি' : '3. Limitation of Liability'}
                </h4>
                <p>
                  {lang === 'bn'
                    ? 'কৃত্রিম বুদ্ধিমত্তা সর্বদা অ্যালগরিদম নির্ভর। কোনো অনিচ্ছাকৃত ভুলের জন্য Lumiqra AI দায়ী থাকবে না। আমরা সবসময় ৯৯.৯% নির্ভরযোগ্য ও দ্রুততম সেবা প্রদানে নিয়োজিত।'
                    : 'AI-generated content is probabilistic. While Lumiqra AI strives for the highest factual and artistic fidelity, the platform is provided on an "as is" basis without implied warranties.'}
                </p>
              </section>
            </div>
          )}

          {/* TAB 3: ABOUT US */}
          {activeTab === 'about' && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Info className="w-5 h-5 text-indigo-400" />
                  <span>{lang === 'bn' ? 'আমাদের সম্পর্কে (About Lumiqra AI)' : 'About Lumiqra AI Studio'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {lang === 'bn' ? 'সবার জন্য উন্মুক্ত, ফ্রি ও আধুনিক এআই ক্রিয়েটিভ প্ল্যাটফর্ম' : 'Empowering creators with cutting-edge AI generation technology'}
                </p>
              </div>

              <section className="space-y-2">
                <p>
                  {lang === 'bn'
                    ? 'Lumiqra AI (লুমিক্রা এআই) হলো একটি আধুনিক, বহুভাষী কৃত্রিম বুদ্ধিমত্তা স্টুডিও। আমাদের লক্ষ্য প্রতিটি ক্রিয়েটর, ছাত্র-ছাত্রী, ডিজাইনার ও কনটেন্ট প্রস্তুতকারককে কোনো সাবস্ক্রিপশন ফি বা জটিলতা ছাড়াই ফ্রি এআই ইমেজ, স্বাভাবিক বাংলা ও ইংরেজি ভয়েসওভার, স্মার্ট চ্যাট এবং ব্যাকগ্রাউন্ড রিমুভার সেবা প্রদান করা।'
                    : 'Lumiqra AI is a high-performance creative suite dedicated to democratizing artificial intelligence. We empower digital creators, students, developers, and educators with studio-quality text-to-image synthesis, lifelike voiceovers, instant conversational AI, and precise background removal.'}
                </p>
              </section>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <h4 className="font-semibold text-white text-sm">
                  {lang === 'bn' ? '👤 প্রতিষ্ঠাতা ও কারিগরি দল:' : '👤 Founder & Technical Team:'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400">{lang === 'bn' ? 'নির্মাতা ও প্রতিষ্ঠাতা:' : 'Creator & Founder:'}</span>
                    <p className="font-bold text-slate-100">Md. Jakir Hossain (মোঃ জাকির হোসেন)</p>
                  </div>
                  <div>
                    <span className="text-slate-400">{lang === 'bn' ? 'জাতীয়তা:' : 'Nationality:'}</span>
                    <p className="font-bold text-emerald-400">{lang === 'bn' ? 'বাংলাদেশী 🇧🇩' : 'Bangladeshi 🇧🇩'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">{lang === 'bn' ? 'অফিসিয়াল ইমেইল:' : 'Official Contact:'}</span>
                    <p className="font-bold text-indigo-300">mdjakirmia373@gmail.com</p>
                  </div>
                  <div>
                    <span className="text-slate-400">{lang === 'bn' ? 'বর্তমান অবস্থান:' : 'Present Location:'}</span>
                    <p className="font-medium text-slate-200">Tongi, Gazipur, Bangladesh</p>
                  </div>
                  <div>
                    <span className="text-slate-400">{lang === 'bn' ? 'স্থায়ী ঠিকানা:' : 'Permanent Location:'}</span>
                    <p className="font-medium text-slate-200">Katiadi, Kishoreganj, Bangladesh</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CONTACT US */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-indigo-400" />
                  <span>{lang === 'bn' ? 'যোগাযোগ ও সহায়তা (Contact Us)' : 'Contact Us & Support'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {lang === 'bn' ? 'যেকোনো প্রশ্ন, মতামত বা সহায়তায় আমরা আপনার পাশে আছি' : 'We are here to help with feedback, inquiries, or support'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-950 to-slate-900 border border-indigo-500/20 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      {lang === 'bn' ? 'সরাসরি সহায়তা ইমেইল:' : 'Direct Support Email:'}
                    </h4>
                    <a 
                      href="mailto:mdjakirmia373@gmail.com" 
                      className="text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-4"
                    >
                      mdjakirmia373@gmail.com
                    </a>
                  </div>
                </div>

                <p className="text-xs text-slate-400">
                  {lang === 'bn'
                    ? 'বিজ্ঞাপন নীতিমালা, ব্যবসায়িক অংশীদারিত্ব, কিংবা প্ল্যাটফর্ম সংক্রান্ত যেকোনো জিজ্ঞাসা থাকলে আমাদের ইমেইল করতে পারেন। আমরা সাধারণত ২৪ ঘণ্টার মধ্যে জবাব দিয়ে থাকি।'
                    : 'For advertising inquiries, DMCA notices, feature requests, or technical support, please reach out via our official email. Inquiries are responded to within 24 business hours.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: AI DISCLAIMER */}
          {activeTab === 'disclaimer' && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <span>{lang === 'bn' ? 'এআই কনটেন্ট ও কপিরাইট ডিসক্লেইমার' : 'AI Content & Copyright Disclaimer'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {lang === 'bn' ? 'কৃত্রিম বুদ্ধিমত্তা ব্যবহারের নীতিমালা ও নির্দেশিকা' : 'Ethical Artificial Intelligence Guidelines'}
                </p>
              </div>

              <section className="space-y-2">
                <h4 className="font-semibold text-slate-100 text-sm">
                  {lang === 'bn' ? '১. সিন্থেটিক মিডিয়া ডিসক্লোজার' : '1. Synthetic Media Disclosure'}
                </h4>
                <p>
                  {lang === 'bn'
                    ? 'Lumiqra AI-তে উৎপন্ন সমস্ত ছবি, ভয়েস ও টেক্সট কৃত্রিম বুদ্ধিমত্তা ও নিউরাল নেটওয়ার্কের মাধ্যমে তৈরি। এগুলো কোনো বাস্তব ঘটনার হুবহু প্রমাণ বা চিকিৎসা, আর্থিক কিংবা আইনি পরামর্শ নয়।'
                    : 'All visual artworks, synthetic speech, and textual answers generated through Lumiqra AI are created via generative artificial intelligence models. They should not be considered certified legal, financial, or medical advice.'}
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-semibold text-slate-100 text-sm">
                  {lang === 'bn' ? '২. কপিরাইট ও বুদ্ধিবৃত্তিক সম্পদ' : '2. Intellectual Property & DMCA'}
                </h4>
                <p>
                  {lang === 'bn'
                    ? 'আমরা প্রকৃত শিল্পীদের সৃষ্টিশীলতাকে সম্মান করি। যদি কোনো কনটেন্ট কপিরাইট লঙ্ঘন করে বলে মনে করেন, অনুগ্রহ করে mdjakirmia373@gmail.com-এ যোগাযোগ করুন। আমরা দ্রুত যথাযথ ব্যবস্থা গ্রহণ করব।'
                    : 'We respect intellectual property rights. If you believe any generated material infringes upon protected copyrights, submit a takedown request to mdjakirmia373@gmail.com and prompt remediation will be executed.'}
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Google AdSense Publisher Compliant</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
          >
            {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
