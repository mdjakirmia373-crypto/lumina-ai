import React, { useState, useRef, useEffect } from 'react';
import { 
  SendHorizontal, 
  Bot, 
  User, 
  Sparkles, 
  Trash2, 
  Copy, 
  Check, 
  RefreshCw, 
  Plus,
  Mic,
  Volume2,
  VolumeX,
  Image as ImageIcon,
  Paperclip,
  PanelLeftClose,
  PanelLeftOpen,
  MessageSquare,
  Edit3,
  Search,
  ExternalLink,
  ChevronRight,
  Zap,
  Globe,
  SlidersHorizontal,
  ChevronDown,
  X,
  FileText,
  Code2,
  TrendingUp,
  Brain,
  GraduationCap,
  Briefcase,
  Layers,
  Sparkle
} from 'lucide-react';
import { Language, GeneratedImage, AppTab } from '../types';
import { askAiQuestion } from '../utils/chatAi';
import { trackChatMessage } from '../utils/analyticsTracker';
import { CHAT_CAPABILITY_CATEGORIES, CapabilityCategory, PromptOption } from '../data/chatCapabilities';

interface ChatStudioProps {
  lang: Language;
  onNavigateToTab?: (tab: AppTab) => void;
  onSelectImageForStudio?: (img: GeneratedImage) => void;
}

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  imageUrl?: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessageItem[];
}

const STORAGE_CHATS_KEY = 'lumiqra_ai_chat_conversations_v2';
const ACTIVE_CHAT_ID_KEY = 'lumiqra_ai_active_chat_id_v2';

export const ChatStudio: React.FC<ChatStudioProps> = ({ 
  lang,
  onNavigateToTab,
}) => {
  // Load conversation threads from localStorage
  const [conversations, setConversations] = useState<ChatConversation[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_CHATS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load chat history:', e);
    }
    // Default initial thread
    const initialThread: ChatConversation = {
      id: 'thread_' + Date.now(),
      title: lang === 'bn' ? 'নতুন আলাপন' : 'New Chat',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
    };
    return [initialThread];
  });

  const [activeChatId, setActiveChatId] = useState<string>(() => {
    const savedId = localStorage.getItem(ACTIVE_CHAT_ID_KEY);
    return savedId || (conversations[0]?.id ?? 'thread_default');
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);

  // Category navigation state
  const [selectedCategory, setSelectedCategory] = useState<string>('chat_qa');
  const [isCapabilitiesModalOpen, setIsCapabilitiesModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active thread
  const activeConversation = conversations.find((c) => c.id === activeChatId) || conversations[0] || {
    id: 'thread_fallback',
    title: 'Chat',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: [],
  };

  // Save conversations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CHATS_KEY, JSON.stringify(conversations));
    } catch (e) {
      console.warn('Failed to save chats:', e);
    }
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem(ACTIVE_CHAT_ID_KEY, activeChatId);
  }, [activeChatId]);

  // Auto-scroll to bottom when messages or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation.messages, isLoading]);

  // Auto-adjust textarea height on input change
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [input]);

  // Voice speech-to-text listener
  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(lang === 'bn' ? 'আপনার ব্রাউজারে ভয়েস টাইপিং সাপোর্ট করে না।' : 'Voice recognition not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? prev + ' ' + transcript : transcript));
        setIsListening(false);
        textareaRef.current?.focus();
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Create a brand new chat
  const handleNewChat = () => {
    const newThread: ChatConversation = {
      id: 'thread_' + Date.now(),
      title: lang === 'bn' ? 'নতুন আলাপন' : 'New Chat',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
    };
    setConversations((prev) => [newThread, ...prev]);
    setActiveChatId(newThread.id);
    setInput('');
    setAttachedImage(null);
    setIsSidebarOpen(false); // Close drawer on mobile
    setTimeout(() => textareaRef.current?.focus(), 150);
  };

  // Switch chat thread
  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    setInput('');
    setAttachedImage(null);
    setIsSidebarOpen(false);
  };

  // Delete chat thread
  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (conversations.length <= 1) {
      // Just clear current messages
      setConversations([{
        id: 'thread_' + Date.now(),
        title: lang === 'bn' ? 'নতুন আলাপন' : 'New Chat',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: [],
      }]);
      return;
    }
    const filtered = conversations.filter((c) => c.id !== chatId);
    setConversations(filtered);
    if (activeChatId === chatId) {
      setActiveChatId(filtered[0]?.id || '');
    }
  };

  // Handle Image Upload for editing / analyzing
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setAttachedImage(dataUrl);
      };
      reader.readAsDataURL(file);
    }
    // reset input
    e.target.value = '';
  };

  // Send message
  const handleSend = async (customPrompt?: string) => {
    const query = (customPrompt || input).trim();
    if ((!query && !attachedImage) || isLoading) return;

    const userText = query || (lang === 'bn' ? 'এই ছবিটি দেখুন এবং এডিট করার পরামর্শ দিন।' : 'Analyze and help edit this image.');
    const userImg = attachedImage;
    const targetChatId = activeConversation.id;

    const userMsg: ChatMessageItem = {
      id: 'user_' + Date.now(),
      role: 'user',
      content: userText,
      timestamp: Date.now(),
      imageUrl: userImg || undefined,
    };

    // Update conversation title if first message
    const isFirstMessage = activeConversation.messages.length === 0;
    const updatedTitle = isFirstMessage 
      ? (userText.length > 25 ? userText.substring(0, 25) + '...' : userText)
      : activeConversation.title;

    const historyForContext = [...activeConversation.messages, userMsg].slice(-6).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === targetChatId
          ? {
              ...c,
              title: updatedTitle,
              updatedAt: Date.now(),
              messages: [...c.messages, userMsg],
            }
          : c
      )
    );

    trackChatMessage(userText);
    setInput('');
    setAttachedImage(null);
    setIsLoading(true);

    try {
      let replyText = '';
      if (userImg) {
        replyText = lang === 'bn'
          ? `আপনার ছবিটি সফলভাবে গৃহীত হয়েছে! 🎨\n\n**ছবির ওপর যা যা করতে পারেন:**\n1. **ব্যাকগ্রাউন্ড রিমুভ:** আপনি 'Bg Remover' স্টুডিওতে এটি ব্যবহার করে মুহূর্তেই ব্যাকগ্রাউন্ড মুছে ফেলতে পারেন।\n2. **নতুন স্টাইলে এআই রূপান্তর:** এই ছবিকে আরও উন্নত বা ভিন্ন আর্ট স্টাইলে রূপান্তর করতে প্রম্পট লিখুন।\n\nআপনি এই ছবিতে ঠিক কী পরিবর্তন করতে চান? (যেমন: ব্যাকগ্রাউন্ড বদলানো, আলো বাড়ানো, অথবা সাইবারপাঙ্ক স্টাইল দেওয়া)`
          : `Image successfully received! 🎨\n\n**What you can do with this image:**\n1. **Remove Background:** Open 'Bg Remover' studio to remove backdrop instantly.\n2. **AI Style Transfer:** Tell me how you would like to edit or transform this artwork.\n\nWhat specific edits would you like to make to this image?`;
      } else {
        replyText = await askAiQuestion(userText, historyForContext);
      }

      const aiMsg: ChatMessageItem = {
        id: 'ai_' + Date.now(),
        role: 'assistant',
        content: replyText,
        timestamp: Date.now(),
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === targetChatId
            ? {
                ...c,
                updatedAt: Date.now(),
                messages: [...c.messages, aiMsg],
              }
            : c
        )
      );
    } catch {
      const errorMsg: ChatMessageItem = {
        id: 'ai_err_' + Date.now(),
        role: 'assistant',
        content:
          lang === 'bn'
            ? 'দুঃখিত, সংযোগে সাময়িক সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
            : 'Sorry, connection error occurred. Please try again.',
        timestamp: Date.now(),
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === targetChatId
            ? {
                ...c,
                updatedAt: Date.now(),
                messages: [...c.messages, errorMsg],
              }
            : c
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Copy reply text
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Universal Multi-Language Text to Speech (TTS) / Read Aloud
  const handleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      alert(lang === 'bn' ? 'আপনার ব্রাউজারে স্পিচ সিন্থেসিস সাপোর্ট নেই।' : 'Text-to-speech is not supported in this browser.');
      return;
    }

    // Toggle: if already speaking this message, stop it immediately
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    // Cancel any previous speech
    window.speechSynthesis.cancel();

    // Clean markdown, symbols, links, code blocks for crystal-clear natural speech
    const cleanText = text
      .replace(/```[\s\S]*?```/g, '') // remove large code blocks
      .replace(/`[^`]+`/g, '')
      .replace(/[*#_~>\[\]\(\)\{\}\\]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim();

    if (!cleanText) return;

    // Detect language using Unicode ranges and common linguistic patterns
    const detectLanguageCode = (str: string): string => {
      // Bengali
      if (/[\u0980-\u09FF]/.test(str)) return 'bn-BD';
      // Arabic / Urdu
      if (/[\u0600-\u06FF\u0750-\u077F]/.test(str)) {
        if (/[\u0679\u0686\u0698\u0691\u06AF\u06BA\u06BE\u06C1\u06D2]/.test(str)) return 'ur-PK';
        return 'ar-SA';
      }
      // Hindi / Devanagari
      if (/[\u0900-\u097F]/.test(str)) return 'hi-IN';
      // Chinese
      if (/[\u4E00-\u9FFF]/.test(str)) return 'zh-CN';
      // Japanese
      if (/[\u3040-\u309F\u30A0-\u30FF]/.test(str)) return 'ja-JP';
      // Korean
      if (/[\uAC00-\uD7AF]/.test(str)) return 'ko-KR';
      // Russian / Cyrillic
      if (/[\u0400-\u04FF]/.test(str)) return 'ru-RU';
      // French detection
      if (/\b(le|la|les|un|une|des|est|sont|dans|avec|pour|qui|que)\b/i.test(str)) return 'fr-FR';
      // Spanish detection
      if (/\b(el|la|los|las|un|una|es|son|por|para|con|que|cómo)\b/i.test(str)) return 'es-ES';
      // German detection
      if (/\b(der|die|das|und|ist|sind|nicht|mit|für|auf)\b/i.test(str)) return 'de-DE';
      
      // Default to English
      return 'en-US';
    };

    const targetLocale = detectLanguageCode(cleanText);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = targetLocale;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Auto-match the highest quality voice from browser synthesis matching detected locale
    const availableVoices = window.speechSynthesis.getVoices();
    if (availableVoices && availableVoices.length > 0) {
      const langPrefix = targetLocale.split('-')[0].toLowerCase();
      const matchedVoice = availableVoices.find(
        (v) => v.lang.toLowerCase() === targetLocale.toLowerCase()
      ) || availableVoices.find(
        (v) => v.lang.toLowerCase().startsWith(langPrefix)
      );

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
    }

    utterance.onend = () => {
      setSpeakingId(null);
    };

    utterance.onerror = () => {
      setSpeakingId(null);
    };

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Helper to format timestamps
  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Current active capability category
  const activeCategoryObj = CHAT_CAPABILITY_CATEGORIES.find((c) => c.id === selectedCategory) || CHAT_CAPABILITY_CATEGORIES[0];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col h-[75vh] sm:h-[84vh] shadow-2xl">
      {/* Hidden file input for uploading images */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Top Floating App Bar */}
      <div className="px-3.5 sm:px-4 py-2.5 sm:py-3 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs cursor-pointer border border-slate-700/60"
            title={lang === 'bn' ? 'আলাপন ইতিহাস' : 'Chat History'}
          >
            {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            <span className="hidden sm:inline font-medium">
              {lang === 'bn' ? 'ইতিহাস' : 'History'}
            </span>
          </button>

          <button
            onClick={handleNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'New Chat' : '+ New Chat'}</span>
          </button>

          {/* All Capabilities Button */}
          <button
            onClick={() => setIsCapabilitiesModalOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>{lang === 'bn' ? '১২টি বিশেষ ক্ষেত্র ও ক্ষমতা' : '12 Core Capabilities'}</span>
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block"></div>

          <div className="text-xs font-semibold text-slate-300 truncate max-w-[120px] sm:max-w-[200px]">
            {activeConversation.title}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick mobile capabilities trigger */}
          <button
            onClick={() => setIsCapabilitiesModalOpen(true)}
            className="md:hidden p-1.5 rounded-lg bg-indigo-950/60 text-indigo-300 border border-indigo-500/30 text-xs font-medium"
            title={lang === 'bn' ? 'সব ক্ষমতা' : 'Capabilities'}
          >
            <Layers className="w-4 h-4" />
          </button>

          <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium hidden sm:inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Lumiqra AI Pro
          </span>
          {activeConversation.messages.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm(lang === 'bn' ? 'বর্তমান চ্যাটটি পরিষ্কার করতে চান?' : 'Clear this conversation?')) {
                  setConversations((prev) =>
                    prev.map((c) => (c.id === activeConversation.id ? { ...c, messages: [] } : c))
                  );
                }
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition"
              title="Clear current messages"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Container: Sliding Sidebar + Chat Body */}
      <div className="relative flex-grow flex overflow-hidden">
        {/* Left Sliding Sidebar Drawer (Chat History) */}
        {isSidebarOpen && (
          <aside className="absolute inset-y-0 left-0 z-30 w-72 sm:w-80 bg-slate-900 border-r border-slate-800 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>{lang === 'bn' ? 'আগের চ্যাটসমূহ' : 'Chat History'}</span>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            {/* Conversation List */}
            <div className="flex-grow overflow-y-auto p-2 space-y-1">
              {conversations.map((thread) => {
                const isActive = thread.id === activeChatId;
                const msgCount = thread.messages.length;
                return (
                  <div
                    key={thread.id}
                    onClick={() => handleSelectChat(thread.id)}
                    className={`group w-full p-2.5 rounded-xl text-left transition flex items-center justify-between gap-2 cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600/20 border border-indigo-500/40 text-indigo-200'
                        : 'hover:bg-slate-800/70 text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        <MessageSquare className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-medium truncate text-slate-200">
                          {thread.title}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {msgCount} {lang === 'bn' ? 'টি বার্তা' : 'msgs'} • {formatTime(thread.updatedAt)}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDeleteChat(e, thread.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition shrink-0"
                      title={lang === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="p-3 border-t border-slate-800 bg-slate-900/60 text-xs text-slate-500 flex justify-between items-center">
              <span>{conversations.length} {lang === 'bn' ? 'টি চ্যাট সংরক্ষণ আছে' : 'conversations'}</span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </aside>
        )}

        {/* Chat Message Scroll Area */}
        <div className="flex-grow flex flex-col justify-between overflow-hidden">
          <div className="flex-grow overflow-y-auto p-3 sm:p-5 space-y-4">
            {/* If NO messages in this conversation: Show the Professional 12-Category Interactive Hub */}
            {activeConversation.messages.length === 0 ? (
              <div className="h-full flex flex-col justify-between max-w-4xl mx-auto py-2 sm:py-4 space-y-5 animate-fade-in">
                {/* Hero Title & Identity */}
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-pink-600/20 border border-indigo-500/30 text-xs font-semibold text-indigo-300">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                    <span>{lang === 'bn' ? 'লুমিক্রা এআই • সর্বজনীন সুপার চ্যাট' : 'Lumiqra AI • Universal Super Chat'}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {lang === 'bn' ? 'কীভাবে আপনাকে সর্বোচ্চ সাহায্য করতে পারি?' : 'How can Lumiqra AI empower your work today?'}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
                    {lang === 'bn'
                      ? 'চ্যাট ও প্রশ্নোত্তর, লেখা তৈরি, অফিসিয়াল ডকুমেন্ট, কোডিং, ব্যবসা ও মার্কেটিং থেকে শুরু করে ১২টি বিশেষ ক্ষেত্রে তাৎক্ষণিক সমাধান নিন।'
                      : 'Explore our 12 expert modules for deep Q&A, writing, documents, coding, marketing & research.'}
                  </p>
                </div>

                {/* Horizontal Scrolling Pill Categories */}
                <div className="w-full">
                  <div className="flex items-center justify-between pb-2 text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <Sparkle className="w-3 h-3 text-indigo-400" />
                      {lang === 'bn' ? 'বিশেষ ক্ষেত্র নির্বাচন করুন:' : 'Select Domain:'}
                    </span>
                    <button
                      onClick={() => setIsCapabilitiesModalOpen(true)}
                      className="text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>{lang === 'bn' ? 'সবগুলো ১২টি ক্ষেত্র দেখুন' : 'View all 12 modules'}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                    {CHAT_CAPABILITY_CATEGORIES.map((cat) => {
                      const isSelected = cat.id === selectedCategory;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition flex items-center gap-2 border cursor-pointer ${
                            isSelected
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                              : 'bg-slate-900/80 hover:bg-slate-800/90 text-slate-300 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-sm">{cat.icon}</span>
                          <span>{lang === 'bn' ? cat.badgeBn : cat.badgeEn}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Subcategory Grid for the Active Selected Domain */}
                <div className="rounded-2xl border border-slate-800/90 bg-slate-900/50 p-3 sm:p-4 backdrop-blur-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{activeCategoryObj.icon}</span>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-100">
                          {lang === 'bn' ? activeCategoryObj.titleBn : activeCategoryObj.titleEn}
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          {lang === 'bn' ? activeCategoryObj.descBn : activeCategoryObj.descEn}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 hidden sm:inline">
                      {activeCategoryObj.items.length} {lang === 'bn' ? 'রেডিমেড প্রম্পট' : 'Templates'}
                    </span>
                  </div>

                  {/* 4 to 6 Interactive Click-to-Ask Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {activeCategoryObj.items.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(lang === 'bn' ? item.promptBn : item.promptEn)}
                        className="p-2.5 sm:p-3 rounded-xl bg-slate-950/70 hover:bg-indigo-600/15 border border-slate-800/80 hover:border-indigo-500/40 text-left transition flex flex-col justify-between group cursor-pointer"
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition">
                            {lang === 'bn' ? item.titleBn : item.titleEn}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition" />
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {lang === 'bn' ? item.promptBn : item.promptEn}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Superpowers Banner (Small clean footer badge) */}
                <div className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-blue-950/40 border border-indigo-500/20 flex items-center justify-between text-[11px] text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-indigo-600/20 text-indigo-400">
                      <Brain className="w-3.5 h-3.5" />
                    </span>
                    <span>
                      {lang === 'bn'
                        ? '🧠 দীর্ঘ কথোপকথনের স্মৃতি ধরে রাখা, জটিল বিষয় সহজ করা এবং আইডিয়া থেকে সম্পূর্ণ পরিকল্পনা তৈরিতে পারদর্শী।'
                        : '🧠 Equipped with conversational memory, concept breakdown & end-to-end execution plans.'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              // Message History Flow
              activeConversation.messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 max-w-[92%] sm:max-w-[82%] ${
                      isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                    }`}
                  >
                    {/* User / Bot Avatar */}
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                        isUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white'
                      }`}
                    >
                      {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    {/* Chat Bubble Body */}
                    <div className="space-y-1.5 overflow-hidden">
                      <div
                        className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap select-text ${
                          isUser
                            ? 'bg-blue-600 text-white rounded-tr-none shadow-md'
                            : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-lg'
                        }`}
                      >
                        {/* Attached Image inside User Message if exists */}
                        {msg.imageUrl && (
                          <div className="mb-2.5 rounded-xl overflow-hidden border border-white/20 max-w-[200px]">
                            <img
                              src={msg.imageUrl}
                              alt="User uploaded attachment"
                              className="w-full h-auto object-cover max-h-48"
                            />
                          </div>
                        )}

                        {/* Text Content */}
                        <div>{msg.content}</div>
                      </div>

                      {/* Message Footer: Timestamp, Copy button and Read Aloud button */}
                      <div
                        className={`flex items-center gap-3 text-[10px] text-slate-500 px-1 ${
                          isUser ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <span>{formatTime(msg.timestamp)}</span>
                        {!isUser && (
                          <div className="flex items-center gap-2">
                            {/* Copy Button */}
                            <button
                              onClick={() => handleCopy(msg.id, msg.content)}
                              className="flex items-center gap-1 hover:text-slate-200 transition py-0.5 px-1.5 rounded-md hover:bg-slate-800/60 cursor-pointer"
                              title={lang === 'bn' ? 'উত্তর কপি করুন' : 'Copy response'}
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400 font-medium">{lang === 'bn' ? 'কপি হয়েছে' : 'Copied'}</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>{lang === 'bn' ? 'কপি' : 'Copy'}</span>
                                </>
                              )}
                            </button>

                            {/* Text-to-Speech / Read Aloud Button */}
                            <button
                              onClick={() => handleSpeak(msg.id, msg.content)}
                              className={`flex items-center gap-1 transition py-0.5 px-1.5 rounded-md cursor-pointer ${
                                speakingId === msg.id
                                  ? 'text-indigo-400 bg-indigo-500/15 border border-indigo-500/30'
                                  : 'hover:text-slate-200 hover:bg-slate-800/60'
                              }`}
                              title={
                                speakingId === msg.id
                                  ? (lang === 'bn' ? 'পড়া বন্ধ করুন' : 'Stop reading')
                                  : (lang === 'bn' ? 'পড়ে শোনান' : 'Read aloud')
                              }
                            >
                              {speakingId === msg.id ? (
                                <>
                                  <VolumeX className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                                  <span className="text-indigo-400 font-medium">{lang === 'bn' ? 'থামুন' : 'Stop'}</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-3.5 h-3.5" />
                                  <span>{lang === 'bn' ? 'শুনুন' : 'Listen'}</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Thinking / Loading Animation */}
            {isLoading && (
              <div className="flex gap-3 max-w-[80%] mr-auto items-center">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 text-slate-300 font-medium">
                    {lang === 'bn' ? 'উত্তর তৈরি হচ্ছে...' : 'Formulating answer...'}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Floating Rounded Input Box with Plus (+), Voice & Send */}
          <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800/80">
            {/* If an image is selected for upload preview */}
            {attachedImage && (
              <div className="relative inline-block mb-2 rounded-xl overflow-hidden border border-indigo-500/50 bg-slate-900 p-1 animate-fade-in">
                <img src={attachedImage} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
                <button
                  onClick={() => setAttachedImage(null)}
                  className="absolute -top-1 -right-1 bg-rose-600 text-white rounded-full p-1 text-[10px] shadow"
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="relative flex items-center gap-2 bg-slate-900/90 rounded-2xl border border-slate-700/80 px-3 py-2 shadow-2xl focus-within:border-indigo-500/80 focus-within:ring-2 focus-within:ring-indigo-500/20 transition">
              {/* Plus (+) Button for Uploading Image / File to Edit */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer shrink-0"
                title={lang === 'bn' ? 'ছবি আপলোড করুন (এডিট করার জন্য)' : 'Upload image to edit'}
              >
                <Plus className="w-5 h-5 text-indigo-400 hover:rotate-90 transition transform" />
              </button>

              {/* Text Input Area */}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                rows={1}
                placeholder={
                  lang === 'bn'
                    ? 'যেকোনো বিষয়ে প্রশ্ন লিখুন, কোড সমাধান চান বা লেখা তৈরি করতে বলুন...'
                    : 'Ask anything, request code, translation or content...'
                }
                className="w-full bg-transparent border-0 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none py-1.5 max-h-32"
              />

              {/* Voice Microphone Icon */}
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`p-2 rounded-xl transition cursor-pointer shrink-0 ${
                  isListening
                    ? 'bg-rose-500/20 text-rose-400 animate-pulse border border-rose-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={lang === 'bn' ? 'মুখে বলে লিখুন (ভয়েস ইনপুট)' : 'Voice typing'}
              >
                <Mic className="w-4 h-4" />
              </button>

              {/* Send Arrow Button */}
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={isLoading || (!input.trim() && !attachedImage)}
                className={`p-2.5 rounded-xl transition shrink-0 flex items-center justify-center ${
                  isLoading || (!input.trim() && !attachedImage)
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/30 cursor-pointer'
                }`}
                title={lang === 'bn' ? 'সেন্ড করুন' : 'Send'}
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <SendHorizontal className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 px-2 pt-1.5">
              <span>{lang === 'bn' ? 'প্লাস (+) বাটনে চাপ দিয়ে ছবি যোগ করুন' : 'Click (+) to attach image'}</span>
              <span>{lang === 'bn' ? 'Enter চাপুন সেন্ড করার জন্য' : 'Press Enter to send'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Full 12-Pillars Capabilities Explorer */}
      {isCapabilitiesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {lang === 'bn' ? 'লুমিক্রা এআই-এর ১২টি বিশেষ ক্ষেত্র ও ক্ষমতা' : 'Lumiqra AI 12 Core Capabilities'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'bn' ? 'যেকোনো বিষয়ে ক্লিক করে সাথে সাথে চ্যাট শুরু করুন' : 'Click any option to instantly initiate conversation'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCapabilitiesModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: All 12 Categories List */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CHAT_CAPABILITY_CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{cat.icon}</span>
                        <div>
                          <h4 className="text-sm font-bold text-slate-100">
                            {lang === 'bn' ? cat.titleBn : cat.titleEn}
                          </h4>
                          <span className="text-[10px] text-indigo-400 font-medium">
                            {lang === 'bn' ? cat.badgeBn : cat.badgeEn}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {lang === 'bn' ? cat.descBn : cat.descEn}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      {cat.items.slice(0, 3).map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setIsCapabilitiesModalOpen(false);
                            handleSend(lang === 'bn' ? item.promptBn : item.promptEn);
                          }}
                          className="w-full text-left p-2 rounded-xl bg-slate-900/80 hover:bg-indigo-600/20 hover:text-indigo-300 text-xs text-slate-300 transition flex items-center justify-between group cursor-pointer border border-slate-800/80 hover:border-indigo-500/30"
                        >
                          <span className="truncate pr-2">{lang === 'bn' ? item.titleBn : item.titleEn}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
              <span>{lang === 'bn' ? 'যেসব ভাষায় উত্তর প্রদানযোগ্য: বাংলা, ইংরেজি ও বৈশ্বিক ভাষা' : 'Available in Bengali, English & Global Languages'}</span>
              <button
                onClick={() => setIsCapabilitiesModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition cursor-pointer"
              >
                {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
