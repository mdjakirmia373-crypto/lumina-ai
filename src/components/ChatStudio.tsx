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
  Globe
} from 'lucide-react';
import { Language, GeneratedImage, AppTab } from '../types';
import { askAiQuestion } from '../utils/chatAi';
import { trackChatMessage } from '../utils/analyticsTracker';

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

const WELCOME_STARTER_PROMPTS = [
  {
    icon: '✨',
    bn: 'লেখা লিখুন (প্রবন্ধ, গল্প বা পোস্ট)',
    en: 'Write an article, story or post',
    promptBn: 'অনলাইন কাজের সফলতা ও ফ্রিল্যান্সিং নিয়ে একটি সুন্দর ও প্রেরণাদায়ী লেখা লিখে দাও।',
    promptEn: 'Write an engaging and inspiring article about freelance success.',
  },
  {
    icon: '📖',
    bn: 'পবিত্র কুরআনের আয়াত ও অর্থ',
    en: 'Quran Ayah & Meaning',
    promptBn: 'পবিত্র কুরআনের আয়াতুল কুরসীর বাংলা অর্থ ও ফজিলত কি?',
    promptEn: 'What is the meaning and virtue of Ayatul Kursi?',
  },
  {
    icon: '💻',
    bn: 'প্রোগ্রামিং ও কোডিং সমাধান',
    en: 'Coding & Bug Fix',
    promptBn: 'জাভাস্ক্রিপ্ট এবং পাইথন সহজে শেখার একটি সুন্দর গাইডলাইন দাও।',
    promptEn: 'Give me a beginner-friendly roadmap to learn Python and JavaScript.',
  },
  {
    icon: '🌌',
    bn: 'মহাবিশ্ব ও বিজ্ঞানের রহস্য',
    en: 'Universe & Science Secrets',
    promptBn: 'মহাবিশ্ব কীভাবে সৃষ্টি হয়েছে? বিজ্ঞান ও সৃষ্টিতত্ত্ব কী বলে?',
    promptEn: 'How was the universe created according to modern astrophysics?',
  },
];

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
  const [isListening, setIsListening] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);

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

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation.messages, isLoading]);

  // Voice speech-to-text listener
  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(lang === 'bn' ? 'আপনার ব্রাউজারে ভয়েস টাইপিং সাপোর্ট করে না।' : 'Voice recognition not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
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

    const updatedMessages = [...activeConversation.messages, userMsg];

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? {
              ...c,
              title: updatedTitle,
              updatedAt: Date.now(),
              messages: updatedMessages,
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
        const historyContext = updatedMessages.slice(-6).map((m) => ({
          role: m.role,
          content: m.content,
        }));
        replyText = await askAiQuestion(userText, historyContext);
      }

      const aiMsg: ChatMessageItem = {
        id: 'ai_' + Date.now(),
        role: 'assistant',
        content: replyText,
        timestamp: Date.now(),
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversation.id
            ? {
                ...c,
                updatedAt: Date.now(),
                messages: [...c.messages, aiMsg],
              }
            : c
        )
      );
    } catch (err) {
      console.error('Chat response error:', err);
      const errorMsg: ChatMessageItem = {
        id: 'ai_err_' + Date.now(),
        role: 'assistant',
        content: lang === 'bn'
          ? 'দুঃখিত, উত্তরটি প্রস্তুত করতে সমস্যা হয়েছে। দয়া করে আবার প্রশ্ন করুন।'
          : 'Could not generate answer. Please try again.',
        timestamp: Date.now(),
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversation.id
            ? { ...c, messages: [...c.messages, errorMsg] }
            : c
        )
      );
    } finally {
      setIsLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col h-[75vh] sm:h-[82vh] shadow-2xl">
      {/* Hidden file input for uploading images */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Top Floating App Bar */}
      <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-2.5">
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

          <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block"></div>

          <div className="text-xs font-semibold text-slate-300 truncate max-w-[150px] sm:max-w-[260px]">
            {activeConversation.title}
          </div>
        </div>

        <div className="flex items-center gap-2">
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
          <aside className="absolute inset-y-0 left-0 w-72 sm:w-80 bg-slate-900/98 border-r border-slate-800/90 z-20 flex flex-col backdrop-blur-xl animate-fade-in shadow-2xl">
            {/* Sidebar Top: New Chat button */}
            <div className="p-3 border-b border-slate-800 flex items-center justify-between">
              <button
                onClick={handleNewChat}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 hover:brightness-110 transition"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'bn' ? '+ নতুন চ্যাট তৈরি করুন' : '+ New Chat Thread'}</span>
              </button>
            </div>

            {/* Conversation Threads List */}
            <div className="flex-grow overflow-y-auto p-2 space-y-1 scrollbar-none">
              <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                {lang === 'bn' ? 'আগের চ্যাটসমূহ' : 'Recent Conversations'}
              </div>

              {conversations.map((thread) => {
                const isActive = thread.id === activeChatId;
                return (
                  <div
                    key={thread.id}
                    onClick={() => handleSelectChat(thread.id)}
                    className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs cursor-pointer transition ${
                      isActive
                        ? 'bg-indigo-600/20 text-white border border-indigo-500/40 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                      <span className="truncate">{thread.title || (lang === 'bn' ? 'নতুন আলাপন' : 'New Chat')}</span>
                    </div>

                    <button
                      onClick={(e) => handleDeleteChat(e, thread.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 transition"
                      title="Delete Thread"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Sidebar Bottom Footer */}
            <div className="p-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
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
          <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* If NO messages in this conversation: Show the clean Welcome Screen */}
            {activeConversation.messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto py-8 space-y-6 animate-fade-in">
                {/* Logo & Greeting */}
                <div className="space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
                    <Sparkles className="w-7 h-7 animate-pulse" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {lang === 'bn' ? 'কীভাবে সাহায্য করতে পারি?' : 'How can Lumiqra AI help you?'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                    {lang === 'bn'
                      ? 'নিচে যেকোনো বিষয়ে প্রশ্ন লিখুন, অথবা রেডিমেড বাটন চাপুন। ছবি আপলোড করে এডিটও করতে পারেন!'
                      : 'Ask anything, upload images to edit, or choose a starter below.'}
                  </p>
                </div>

                {/* Starter Prompts - 4 clean click-to-start cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
                  {WELCOME_STARTER_PROMPTS.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(lang === 'bn' ? item.promptBn : item.promptEn)}
                      className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-indigo-600/15 border border-slate-800 hover:border-indigo-500/40 text-left transition flex items-start gap-3 group cursor-pointer"
                    >
                      <span className="text-lg">{item.icon}</span>
                      <div className="space-y-0.5">
                        <div className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition">
                          {lang === 'bn' ? item.bn : item.en}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">
                          {lang === 'bn' ? item.promptBn : item.promptEn}
                        </div>
                      </div>
                    </button>
                  ))}
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
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                        isUser
                          ? 'bg-gradient-to-tr from-purple-600 to-pink-600 text-white'
                          : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white ring-2 ring-indigo-500/30'
                      }`}
                    >
                      {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    {/* Bubble Content */}
                    <div className="space-y-1.5 group">
                      <div
                        className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words shadow-md ${
                          isUser
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none'
                            : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none font-normal'
                        }`}
                      >
                        {/* Attached Image if user sent image */}
                        {msg.imageUrl && (
                          <div className="mb-3 rounded-xl overflow-hidden border border-white/20 max-w-xs">
                            <img src={msg.imageUrl} alt="Uploaded attachment" className="w-full h-auto object-cover max-h-56" />
                          </div>
                        )}
                        {msg.content}
                      </div>

                      {/* Timestamp & Copy Button */}
                      <div
                        className={`flex items-center gap-2 text-[10px] text-slate-500 ${
                          isUser ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <span>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {!isUser && (
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="opacity-70 hover:opacity-100 transition p-1 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                            title="Copy answer"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">{lang === 'bn' ? 'কপি হয়েছে' : 'Copied'}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>{lang === 'bn' ? 'কপি' : 'Copy'}</span>
                              </>
                            )}
                          </button>
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
                    ? 'যেকোনো প্রশ্ন লিখুন বা ছবি যুক্ত করুন...'
                    : 'Ask anything or attach image...'
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
    </div>
  );
};
