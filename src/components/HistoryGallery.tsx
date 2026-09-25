import React, { useState } from 'react';
import { Download, Trash2, Copy, Check, Eye, Maximize2, X, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Language, GeneratedImage, VoiceHistoryItem } from '../types';

interface HistoryGalleryProps {
  lang: Language;
  images: GeneratedImage[];
  voiceItems: VoiceHistoryItem[];
  onClearAllImages: () => void;
  onClearAllVoices: () => void;
  onSelectImage: (img: GeneratedImage) => void;
}

export const HistoryGallery: React.FC<HistoryGalleryProps> = ({
  lang,
  images,
  voiceItems,
  onClearAllImages,
  onClearAllVoices,
  onSelectImage,
}) => {
  const [subTab, setSubTab] = useState<'images' | 'voices'>('images');
  const [activeLightbox, setActiveLightbox] = useState<GeneratedImage | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = async (imgUrl: string, promptText: string) => {
    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      const cleanName = promptText.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_');
      link.download = `AI_Studio_${cleanName}_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(imgUrl, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* Lightbox Modal */}
      {activeLightbox && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveLightbox(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setActiveLightbox(null)}
              className="absolute -top-12 right-0 text-white bg-slate-800 p-2 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src={activeLightbox.imageUrl} 
              alt={activeLightbox.prompt}
              className="max-h-[80vh] w-auto rounded-2xl shadow-2xl object-contain border border-slate-700"
              onClick={e => e.stopPropagation()}
            />
            <div className="mt-3 text-center text-xs text-slate-300 max-w-xl">
              "{activeLightbox.prompt}"
            </div>
          </div>
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubTab('images')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              subTab === 'images'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            {lang === 'bn' ? `ছবি হিস্ট্রি (${images.length})` : `Images (${images.length})`}
          </button>
          <button
            onClick={() => setSubTab('voices')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              subTab === 'voices'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            {lang === 'bn' ? `ভয়েস হিস্ট্রি (${voiceItems.length})` : `Voices (${voiceItems.length})`}
          </button>
        </div>

        {subTab === 'images' && images.length > 0 && (
          <button
            onClick={onClearAllImages}
            className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1.5 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'সব ছবি মুছুন' : 'Clear All Images'}</span>
          </button>
        )}

        {subTab === 'voices' && voiceItems.length > 0 && (
          <button
            onClick={onClearAllVoices}
            className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1.5 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'সব ভয়েস মুছুন' : 'Clear All Voices'}</span>
          </button>
        )}
      </div>

      {/* Images Grid */}
      {subTab === 'images' && (
        <>
          {images.length === 0 ? (
            <div className="text-center py-16 text-slate-600 space-y-2">
              <ImageIcon className="w-12 h-12 mx-auto text-slate-700" />
              <p className="text-sm font-medium text-slate-400">
                {lang === 'bn' ? 'এখনো কোনো ছবি তৈরি করা হয়নি' : 'No images generated yet'}
              </p>
              <p className="text-xs text-slate-600">
                {lang === 'bn' ? 'টেক্সট টু ইমেজ ট্যাবে গিয়ে নতুন ছবি তৈরি করুন' : 'Head over to Text to Image to start creating'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="glass-card rounded-2xl overflow-hidden border border-slate-800/80 group hover:border-slate-700 transition flex flex-col"
                >
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    <img
                      src={img.imageUrl}
                      alt={img.prompt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={() => setActiveLightbox(img)}
                      className="absolute top-2 right-2 bg-slate-950/70 hover:bg-slate-950 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition shadow"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <p className="text-xs text-slate-200 font-medium line-clamp-2">
                        "{img.prompt}"
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-2">
                        <span>{img.aspectRatio}</span>
                        <span>·</span>
                        <span>{new Date(img.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
                      <button
                        onClick={() => handleDownload(img.imageUrl, img.prompt)}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-1.5 px-3 rounded-lg font-medium transition flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-3 h-3 text-emerald-400" />
                        <span>Download</span>
                      </button>
                      <button
                        onClick={() => handleCopy(img.id, img.prompt)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-1.5 px-3 rounded-lg font-medium transition flex items-center gap-1"
                        title="Copy Prompt"
                      >
                        {copiedId === img.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                      <button
                        onClick={() => onSelectImage(img)}
                        className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 text-xs py-1.5 px-3 rounded-lg font-medium transition flex items-center gap-1"
                        title="Open in studio"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Voices List */}
      {subTab === 'voices' && (
        <>
          {voiceItems.length === 0 ? (
            <div className="text-center py-16 text-slate-600 space-y-2">
              <Sparkles className="w-12 h-12 mx-auto text-slate-700" />
              <p className="text-sm font-medium text-slate-400">
                {lang === 'bn' ? 'কোনো ভয়েস ইতিহাস সংরক্ষিত নেই' : 'No voice history yet'}
              </p>
              <p className="text-xs text-slate-600">
                {lang === 'bn' ? 'টেক্সট টু ভয়েস ট্যাবে গিয়ে যেকোনো স্ক্রিপ্ট প্লে করুন' : 'Generate voiceovers in the Text to Voice studio'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {voiceItems.map((item) => (
                <div
                  key={item.id}
                  className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-200 font-medium">"{item.text}"</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                      <span>{item.voiceName}</span>
                      <span>·</span>
                      <span>{item.lang}</span>
                      <span>·</span>
                      <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(item.id, item.text)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-xl text-xs transition"
                    title="Copy Text"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
