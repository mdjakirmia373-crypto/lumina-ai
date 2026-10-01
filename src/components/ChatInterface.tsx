import React, { useState, useRef, useEffect } from 'react';
import { 
  SendHorizontal, 
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
  Download,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
  Sparkles,
  Zap,
  Globe,
  SlidersHorizontal,
  ChevronDown,
  X,
  Video,
  ArrowLeft
} from 'lucide-react';
import { Language, GeneratedImage, AppTab } from '../types';
import { askAiQuestion } from '../utils/chatAi';
import { trackChatMessage } from '../utils/analyticsTracker';
import { CHAT_CAPABILITY_CATEGORIES, CapabilityCategory, PromptOption } from '../data/chatCapabilities';

interface ChatInterfaceProps {
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
  generatedImageUrl?: string;
  isImageEdit?: boolean;
}

export interface ChatConversation {
  id: string;
  title: string;
  updatedAt: number;
  messages: ChatMessageItem[];
}

const STORAGE_CONVERSATIONS_KEY = 'lumiqra_chat_conversations_v3';

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  lang,
  onNavigateToTab,
  onSelectImageForStudio,
}) => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>('');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('study');
  const [isCapabilitiesExpanded, setIsCapabilitiesExpanded] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize or load conversations from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_CONVERSATIONS_KEY);
      if (stored) {
        const parsed: ChatConversation[] = JSON.parse(stored);
        if (parsed.length > 0) {
          setConversations(parsed);
          setActiveConversationId(parsed[0].id);
          return;
        }
      }
    } catch (e) {
      console.error('Failed to load conversations from storage:', e);
    }

    // Default first conversation
    const defaultConv: ChatConversation = {
      id: 'default-conv-1',
      title: lang === 'bn' ? 'নতুন কথোপকথন' : 'New Chat',
      updatedAt: Date.now(),
      messages: [
        {
          id: 'welcome-msg',
          role: 'assistant',
          content:
            lang === 'bn'
              ? '👋 স্বাগতম! আমি **Lumiqra AI** — আপনার সার্বক্ষণিক ইন্টেলিজেন্ট চ্যাট সহকারী।\n\nআপনি যেকোনো প্রশ্ন, বিষয় ব্যাখ্যা, কোডিং সমস্যা, রচনা বা আইডিয়া নিয়ে আলোচনা করতে পারেন। নিচে ছবি বা ভয়েস ইনপুট দিয়েও প্রশ্ন করতে পারবেন!'
              : "👋 Welcome! I'm **Lumiqra AI** — your real-time universal intelligent assistant.\n\nAsk me anything, solve coding problems, brainstorm ideas, or analyze attached images with live internet updates.",
          timestamp: Date.now(),
        },
      ],
    };
    setConversations([defaultConv]);
    setActiveConversationId(defaultConv.id);
  }, []);

  // Save to localStorage whenever conversations change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem(STORAGE_CONVERSATIONS_KEY, JSON.stringify(conversations));
    }
  }, [conversations]);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, activeConversationId, isProcessing]);

  // Adjust textarea height dynamically
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputMessage]);

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) || conversations[0];

  // Speech Recognition Setup (Bangla & English)
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = lang === 'bn' ? 'bn-BD' : 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [lang]);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert(
        lang === 'bn'
          ? 'আপনার ব্রাউজারে স্পিচ রিকগনিশন সমর্থিত নয়।'
          : 'Speech recognition is not supported in your browser.'
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Speech recognition start failed:', err);
        setIsListening(false);
      }
    }
  };

  // Text-To-Speech (TTS) Speaker Playback
  const handleToggleSpeak = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      alert(
        lang === 'bn'
          ? 'আপনার ব্রাউজারে ভয়েস স্পিকার সমর্থিত নয়।'
          : 'Text-to-speech is not supported in this browser.'
      );
      return;
    }

    if (isSpeakingId === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown before speaking
    const cleanText = text
      .replace(/[*_#`~\[\]\(\)\>]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const hasBanglaCharacters = /[\u0980-\u09FF]/.test(cleanText);

    if (hasBanglaCharacters) {
      const bnVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().includes('bn') ||
          v.name.toLowerCase().includes('bangla') ||
          v.name.toLowerCase().includes('bengali')
      );
      if (bnVoice) utterance.voice = bnVoice;
      utterance.lang = 'bn-BD';
    } else {
      const enVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith('en') &&
          (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Neural'))
      );
      if (enVoice) utterance.voice = enVoice;
      utterance.lang = 'en-US';
    }

    utterance.onend = () => setIsSpeakingId(null);
    utterance.onerror = () => setIsSpeakingId(null);

    setIsSpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleCreateNewChat = () => {
    const newConv: ChatConversation = {
      id: `conv-${Date.now()}`,
      title: lang === 'bn' ? 'নতুন কথোপকথন' : 'New Chat',
      updatedAt: Date.now(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content:
            lang === 'bn'
              ? '👋 নতুন চ্যাট শুরু হয়েছে! বলুন আপনাকে কীভাবে সাহায্য করতে পারি?'
              : "👋 Fresh chat started! What's on your mind today?",
          timestamp: Date.now(),
        },
      ],
    };

    setConversations([newConv, ...conversations]);
    setActiveConversationId(newConv.id);
  };

  const handleDeleteConversation = (idToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (conversations.length <= 1) {
      handleCreateNewChat();
      return;
    }

    const filtered = conversations.filter((c) => c.id !== idToDelete);
    setConversations(filtered);
    if (activeConversationId === idToDelete) {
      setActiveConversationId(filtered[0].id);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(lang === 'bn' ? 'অনুগ্রহ করে শুধু ছবি নির্বাচন করুন।' : 'Please select an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      setSelectedImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputMessage).trim();
    if ((!textToSend && !selectedImage) || isProcessing) return;

    const currentImg = selectedImage;
    setInputMessage('');
    setSelectedImage(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // 1. Append User Message
    const userMsg: ChatMessageItem = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend || (lang === 'bn' ? 'সংযুক্ত ছবি বিশ্লেষণ করুন' : 'Analyze this image'),
      timestamp: Date.now(),
      imageUrl: currentImg || undefined,
    };

    // Update conversation state with user message
    let updatedConvs = conversations.map((c) => {
      if (c.id === activeConversationId) {
        const isFirstUserMessage = c.messages.filter((m) => m.role === 'user').length === 0;
        const newTitle = isFirstUserMessage
          ? textToSend.slice(0, 32) || (lang === 'bn' ? 'ছবি বিশ্লেষণ' : 'Image Chat')
          : c.title;

        return {
          ...c,
          title: newTitle,
          updatedAt: Date.now(),
          messages: [...c.messages, userMsg],
        };
      }
      return c;
    });

    setConversations(updatedConvs);
    setIsProcessing(true);

    try {
      trackChatMessage(textToSend);

      // 2. Call AI Backend Engine
      const historyContext = (activeConversation?.messages || []).slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await askAiQuestion(textToSend, historyContext, currentImg || undefined);
      const textReply = typeof response === 'string' ? response : response.reply;
      const genImg = typeof response === 'object' && response.generatedImage ? response.generatedImage : undefined;

      // 3. Append Assistant Response
      const botMsg: ChatMessageItem = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: textReply,
        generatedImageUrl: genImg,
        timestamp: Date.now(),
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConversationId) {
            return {
              ...c,
              updatedAt: Date.now(),
              messages: [...c.messages, botMsg],
            };
          }
          return c;
        })
      );
    } catch (err: any) {
      const errorMsg: ChatMessageItem = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content:
          lang === 'bn'
            ? 'দুঃখিত, কোনো একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
            : 'Sorry, an error occurred while connecting. Please try again.',
        timestamp: Date.now(),
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConversationId) {
            return {
              ...c,
              updatedAt: Date.now(),
              messages: [...c.messages, errorMsg],
            };
          }
          return c;
        })
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeCategoryObj =
    CHAT_CAPABILITY_CATEGORIES.find((cat) => cat.id === activeCategory) ||
    CHAT_CAPABILITY_CATEGORIES[0];

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="relative flex w-full h-[100dvh] bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* ======================================================== */}
      {/* 1. COLLAPSIBLE CONVERSATION & MODE SIDEBAR               */}
      {/* ======================================================== */}
      <aside
        className={`${
          isSidebarOpen ? 'w-72 sm:w-80' : 'w-0'
        } transition-all duration-300 ease-in-out border-r border-slate-800/80 bg-slate-950/90 backdrop-blur-xl flex flex-col shrink-0 overflow-hidden z-20`}
      >
        {/* Sidebar Header: Brand & New Chat */}
        <div className="p-3.5 border-b border-slate-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/icon-192.png" alt="Lumiqra" className="w-6 h-6 object-contain rounded-md" />
              <span className="font-bold text-sm text-slate-100 tracking-tight">Lumiqra Chat</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Close Sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          {/* Studio Mode Switch: Chat AI <-> Text to Video */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800/80 text-xs">
            <button
              className="py-1.5 px-2 rounded-lg bg-indigo-600 text-white font-semibold flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'চ্যাট এআই' : 'Chat AI'}</span>
            </button>
            <button
              onClick={() => onNavigateToTab?.('video')}
              className="py-1.5 px-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition font-medium flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Video className="w-3.5 h-3.5 text-pink-400" />
              <span>{lang === 'bn' ? 'টেক্সট টু ভিডিও' : 'Text to Video'}</span>
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleCreateNewChat}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/25 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'bn' ? 'নতুন কথোপকথন' : 'New Conversation'}</span>
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
          <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {lang === 'bn' ? 'পূর্ববর্তী চ্যাট হিস্ট্রি' : 'Recent Chats'}
          </div>

          {filteredConversations.map((conv) => {
            const isActive = conv.id === activeConversationId;
            return (
              <div
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className={`group relative flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600/20 text-white border border-indigo-500/40'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden pr-6">
                  <Sparkles
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span className="truncate">{conv.title}</span>
                </div>

                <button
                  onClick={(e) => handleDeleteConversation(conv.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 transition shrink-0"
                  title="Delete chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer Link to Other Studios */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950 text-[11px] text-slate-400 flex items-center justify-between">
          <span>{lang === 'bn' ? 'লুমিক্রা মাল্টিভার্স এআই' : 'Lumiqra AI Suite'}</span>
          <button
            onClick={() => onNavigateToTab?.('image')}
            className="hover:text-indigo-400 text-slate-300 transition cursor-pointer"
          >
            {lang === 'bn' ? 'ছবি তৈরি' : 'Images'} →
          </button>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 2. MAIN CHAT VIEWPORT (NO AVATARS / NO EMAIL BADGES)     */}
      {/* ======================================================== */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-slate-950">
        {/* Top Header Bar inside Chat */}
        <div className="h-12 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition mr-1"
                title="Open Sidebar"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onNavigateToTab?.('image')}
              className="flex items-center gap-1.5 py-1 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer"
              title="Back to Studio Home"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'bn' ? 'স্টুডিও হোম' : 'Studio Home'}</span>
            </button>
            <h2 className="text-xs sm:text-sm font-bold text-slate-200 truncate max-w-[150px] sm:max-w-xs ml-1">
              {activeConversation?.title || 'Lumiqra Chat'}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => onNavigateToTab?.('video')}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 transition cursor-pointer font-medium"
            >
              <Video className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'টেক্সট টু ভিডিও' : 'Text to Video'}</span>
            </button>
            <button
              onClick={handleCreateNewChat}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="New Chat"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Messages Stream */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-5 space-y-4 scrollbar-thin">
          <div className="max-w-3xl mx-auto space-y-4">
            {activeConversation?.messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} w-full`}
                >
                  {/* Clean Message Bubble - NO AVATARS, NO EMAIL BADGES */}
                  <div
                    className={`relative max-w-[90%] sm:max-w-[80%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap select-text transition shadow-sm ${
                      isUser
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-xs shadow-indigo-600/20 font-medium'
                        : 'bg-slate-900/90 border border-slate-800/90 text-slate-100 rounded-bl-xs shadow-md'
                    }`}
                  >
                    {/* Attached Image if user sent one */}
                    {msg.imageUrl && (
                      <div className="mb-2.5 rounded-xl overflow-hidden border border-white/20 max-w-[260px]">
                        <img
                          src={msg.imageUrl}
                          alt="Attachment"
                          className="w-full h-auto object-cover max-h-60"
                        />
                      </div>
                    )}

                    {/* Message Body Content */}
                    <div className="break-words">{msg.content}</div>

                    {/* Action Toolbar on Assistant Messages (Copy, Listen) */}
                    {!isUser && (
                      <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 select-none">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopyText(msg.id, msg.content)}
                            className="p-1 rounded hover:bg-slate-800 hover:text-white transition flex items-center gap-1 cursor-pointer"
                            title="Copy text"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span className="hidden sm:inline">
                              {copiedId === msg.id ? (lang === 'bn' ? 'কপি হয়েছে' : 'Copied') : (lang === 'bn' ? 'কপি' : 'Copy')}
                            </span>
                          </button>

                          <button
                            onClick={() => handleToggleSpeak(msg.id, msg.content)}
                            className={`p-1 rounded hover:bg-slate-800 transition flex items-center gap-1 cursor-pointer ${
                              isSpeakingId === msg.id ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-white'
                            }`}
                            title="Listen"
                          >
                            {isSpeakingId === msg.id ? (
                              <VolumeX className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                            <span className="hidden sm:inline">
                              {isSpeakingId === msg.id ? (lang === 'bn' ? 'থামুন' : 'Stop') : (lang === 'bn' ? 'শুনুন' : 'Listen')}
                            </span>
                          </button>
                        </div>

                        <span className="text-[10px] text-slate-400">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* AI Thinking Indicator */}
            {isProcessing && (
              <div className="flex flex-col items-start w-full animate-fade-in">
                <div className="rounded-2xl rounded-bl-xs p-3.5 bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs text-slate-400 shadow-md">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span>{lang === 'bn' ? 'লুমিক্রা এআই চিন্তা করছে...' : 'Lumiqra AI is typing...'}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. PINNED BOTTOM INPUT BAR (AUTO-EXPANDING TEXTAREA)     */}
        {/* ======================================================== */}
        <div className="p-3 sm:p-4 bg-slate-950/95 border-t border-slate-800/90 backdrop-blur-xl shrink-0">
          <div className="max-w-3xl mx-auto space-y-2">
            {/* Image Preview Thumbnail if attached */}
            {selectedImage && (
              <div className="relative inline-block rounded-xl border border-indigo-500/50 overflow-hidden bg-slate-900 p-1 shadow-lg animate-fade-in">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="h-16 w-auto object-cover rounded-lg"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-1 right-1 p-0.5 rounded-full bg-slate-950/90 text-slate-300 hover:text-white hover:bg-rose-600 transition"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Input Box Container */}
            <div className="relative flex items-end gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-2xl bg-slate-900/90 border border-slate-800 focus-within:border-indigo-500/70 focus-within:ring-2 focus-within:ring-indigo-500/20 shadow-xl transition">
              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Upload Image Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 sm:p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer shrink-0"
                title={lang === 'bn' ? 'ছবি সংযুক্ত করুন' : 'Attach image'}
              >
                <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Voice Speech-to-Text Button */}
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`p-2 sm:p-2.5 rounded-xl transition cursor-pointer shrink-0 ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={lang === 'bn' ? 'ভয়েস ইনপুট' : 'Voice input'}
              >
                <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Auto-expanding Textarea */}
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder={
                  lang === 'bn'
                    ? 'লুমিক্রা এআই-কে যেকোনো প্রশ্ন বা নির্দেশনা লিখুন... (Enter চাপুন)'
                    : 'Message Lumiqra AI... (Press Enter to send)'
                }
                className="flex-1 max-h-44 min-h-[38px] py-1.5 px-2 bg-transparent text-slate-100 placeholder-slate-400 text-xs sm:text-sm focus:outline-none resize-none leading-relaxed"
              />

              {/* Send Button */}
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={(!inputMessage.trim() && !selectedImage) || isProcessing}
                className={`p-2 sm:p-2.5 rounded-xl font-semibold transition shrink-0 cursor-pointer shadow-md ${
                  (!inputMessage.trim() && !selectedImage) || isProcessing
                    ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-indigo-600/30'
                }`}
                title="Send"
              >
                <SendHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Quick Helper Subtext */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>
                {lang === 'bn'
                  ? '⚡ লাইভ ইন্টারনেট সার্চ ও নির্ভুল জ্ঞানের সাথে সংযুক্ত।'
                  : '⚡ Connected to live internet knowledge & multimodal vision.'}
              </span>
              <span>Lumiqra Chat v3</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatInterface;
