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
  MessageSquare,
  HelpCircle,
  Code2,
  BookOpen,
  Lightbulb,
  Zap
} from 'lucide-react';
import { Language } from '../types';
import { askAiQuestion } from '../utils/chatAi';

interface ChatStudioProps {
  lang: Language;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SAMPLE_QUESTIONS_BN = [
  'বাংলাদেশের স্বাধীনতা যুদ্ধ কত সালে এবং কীভাবে হয়েছিল?',
  'কৃত্রিম বুদ্ধিমত্তা (AI) কীভাবে কাজ করে সহজ ভাষায় বুঝিয়ে বলো',
  'পড়াশোনায় মন বসানোর ৫টি সেরা বৈজ্ঞানিক উপায় কী কী?',
  'অনলাইন থেকে আয় করার কয়েকটি সেরা ও নির্ভরযোগ্য উপায় বলো',
  'মহাবিশ্ব কত বড় এবং ব্ল্যাকহোল কী?',
  'একটি আকর্ষণীয় ফেসবুক পোস্ট বা ভিডিওর স্ক্রিপ্ট লিখে দাও',
];

const SAMPLE_QUESTIONS_EN = [
  'Explain quantum computing in simple words',
  'How to improve focus and productivity when studying?',
  'Write a professional email asking for a meeting',
  'Top 5 emerging technologies in 2026',
  'Give me healthy daily routine habits',
  'Explain the theory of relativity simply',
];

export const ChatStudio: React.FC<ChatStudioProps> = ({ lang }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        lang === 'bn'
          ? 'আসসালামু আলাইকুম! আমি আপনার লুমিনা এআই (LuminaAI) চ্যাট অ্যাসিস্ট্যান্ট। আপনি বাংলা, ইংরেজি, আরবি, হিন্দি কিংবা পৃথিবীর যেকোনো ভাষায় প্রশ্ন করতে পারেন — আমি সাথে সাথে সেই ভাষাতেই সঠিক ও স্পষ্ট উত্তর দিয়ে দেব!'
          : 'Hello! I am your LuminaAI Chat Assistant. You can ask me in ANY language (English, Bangla, Arabic, Hindi, Spanish, etc.) — I will answer accurately and instantly in that same language!',
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (customQuery?: string) => {
    const queryToSend = customQuery || input;
    if (!queryToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: queryToSend.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const historyContext = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      const replyText = await askAiQuestion(queryToSend.trim(), historyContext);

      const assistantMessage: Message = {
        id: 'ai-' + Date.now(),
        role: 'assistant',
        content: replyText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: 'ai-err-' + Date.now(),
        role: 'assistant',
        content:
          lang === 'bn'
            ? 'দুঃখিত, উত্তরটি আনতে একটু সমস্যা হয়েছে। অনুগ্রহ করে আবার প্রশ্নটি করুন।'
            : 'Sorry, could not fetch answer right now. Please try asking again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    if (window.confirm(lang === 'bn' ? 'সব চ্যাট মেসেজ মুছে ফেলতে চান?' : 'Clear all chat messages?')) {
      setMessages([
        {
          id: 'welcome-' + Date.now(),
          role: 'assistant',
          content:
            lang === 'bn'
              ? 'চ্যাট ক্লিয়ার করা হয়েছে। নতুন কোনো প্রশ্ন থাকলে নিঃসংকোচে লিখুন!'
              : 'Chat cleared. Ask me any question!',
          timestamp: new Date(),
        },
      ]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner Card */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/50 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>{lang === 'bn' ? 'স্মার্ট এআই চ্যাট অ্যাসিস্ট্যান্ট' : 'Smart AI Chat Assistant'}</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold animate-pulse">
                {lang === 'bn' ? 'অনলাইন ও ফ্রি' : 'Live & Free'}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'bn'
                ? 'বাংলা, ইংরেজি, আরবি, হিন্দিসহ যেকোনো ভাষায় প্রশ্ন করুন ও তৎক্ষণাৎ সঠিক উত্তর পান'
                : 'Ask in any language (Bangla, English, Arabic, Hindi, etc.) & get instant answers'}
            </p>
          </div>
        </div>

        {messages.length > 2 && (
          <button
            onClick={handleClearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-300 border border-slate-700/60 text-xs transition"
            title="Clear Chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'মুছে ফেলুন' : 'Clear'}</span>
          </button>
        )}
      </div>

      {/* Suggested Quick Question Chips */}
      {messages.length <= 2 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'bn' ? 'জনপ্রিয় প্রশ্ন (ক্লিক করে উত্তর জানুন):' : 'Popular Questions to Ask:'}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(lang === 'bn' ? SAMPLE_QUESTIONS_BN : SAMPLE_QUESTIONS_EN).map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(q)}
                className="text-left text-xs p-3 rounded-xl bg-slate-900/80 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-white transition group flex items-start gap-2.5 shadow-sm"
              >
                <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="line-clamp-2 leading-relaxed">{q}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages Container */}
      <div className="glass-card rounded-2xl border border-slate-800 bg-slate-950/80 p-3 sm:p-5 h-[460px] sm:h-[500px] overflow-y-auto space-y-4 shadow-inner flex flex-col">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[90%] sm:max-w-[85%] ${
                isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                  isUser
                    ? 'bg-gradient-to-tr from-purple-600 to-pink-600 text-white'
                    : 'bg-gradient-to-tr from-indigo-600 to-blue-600 text-white ring-2 ring-indigo-500/30'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className="space-y-1.5 group">
                <div
                  className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words shadow-md ${
                    isUser
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none font-normal'
                  }`}
                >
                  {msg.content}
                </div>

                {/* Footer details & Copy button */}
                <div
                  className={`flex items-center gap-2 text-[10px] text-slate-500 ${
                    isUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <span>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="opacity-60 hover:opacity-100 transition p-1 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                      title="Copy Answer"
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
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 max-w-[80%] mr-auto items-center">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs text-slate-400">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-slate-300 font-medium">
                {lang === 'bn' ? 'উত্তর তৈরি হচ্ছে...' : 'Thinking & writing answer...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box with Arrow Send Button */}
      <div className="glass-card p-2 sm:p-3 rounded-2xl border-2 border-slate-800 bg-slate-900/90 shadow-xl relative">
        <div className="relative flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={
              lang === 'bn'
                ? 'বাংলা, ইংরেজি, আরবি বা যেকোনো ভাষায় প্রশ্ন লিখুন... (যেমন: মহাবিশ্ব কত বড়?)'
                : 'Ask in any language... (English, Bangla, Arabic, etc. Press Enter to send)'
            }
            rows={2}
            className="w-full p-3 pr-14 bg-transparent border-0 focus:outline-none text-slate-100 placeholder-slate-500 text-xs sm:text-sm resize-none"
          />

          <button
            type="button"
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className={`p-3 rounded-xl transition-all duration-300 shrink-0 flex items-center justify-center shadow-lg ${
              isLoading || !input.trim()
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white hover:scale-105 active:scale-95 shadow-indigo-500/40 cursor-pointer animate-pulse'
            }`}
            title={lang === 'bn' ? 'উত্তর পেতে তীর বাটনে চাপ দিন' : 'Send question (Click arrow)'}
          >
            {isLoading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <SendHorizontal className="w-5 h-5 transform -rotate-12" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between px-3 pt-2 text-[10px] text-slate-500 border-t border-slate-800/80 mt-1">
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            {lang === 'bn' ? 'সরাসরি এআই থেকে সঠিক উত্তর' : 'Direct AI Powered Answers'}
          </span>
          <span>{lang === 'bn' ? 'Enter চাপুন সেন্ড করার জন্য' : 'Press Enter to send'}</span>
        </div>
      </div>
    </div>
  );
};
