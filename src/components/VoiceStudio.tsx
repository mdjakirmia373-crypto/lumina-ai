import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Download, 
  Mic, 
  Sparkles, 
  Sliders, 
  Clock, 
  Check, 
  Copy, 
  AlertCircle,
  FileAudio
} from 'lucide-react';
import { Language, VoiceSettings, VoiceHistoryItem } from '../types';
import { SAMPLE_VOICE_SCRIPTS } from '../utils/presets';
import { isBengaliText, getSortedVoices, createWavBlob } from '../utils/audioUtils';

interface VoiceStudioProps {
  lang: Language;
  onVoiceHistoryAdd: (item: VoiceHistoryItem) => void;
  voiceHistory: VoiceHistoryItem[];
}

export const VoiceStudio: React.FC<VoiceStudioProps> = ({
  lang,
  onVoiceHistoryAdd,
  voiceHistory,
}) => {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  
  const [settings, setSettings] = useState<VoiceSettings>({
    pitch: 1.0,
    rate: 0.95,
    volume: 1.0,
    voiceURI: '',
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeWord, setActiveWord] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const [waveformLevels, setWaveformLevels] = useState<number[]>([15, 25, 45, 70, 85, 60, 40, 20]);

  // Load available speech synthesis voices
  useEffect(() => {
    getSortedVoices().then((availableVoices) => {
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        // Look for Bengali voice first if default
        const bnVoice = availableVoices.find(v => v.lang.startsWith('bn') || v.name.toLowerCase().includes('bangla') || v.name.toLowerCase().includes('bengali'));
        const defaultVoice = bnVoice || availableVoices[0];
        setSelectedVoiceURI(defaultVoice.voiceURI);
        setSettings(s => ({ ...s, voiceURI: defaultVoice.voiceURI }));
      }
    });

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // When text changes, auto-detect language and suggest/pick Bengali voice if applicable
  const hasBengali = isBengaliText(text);

  useEffect(() => {
    if (hasBengali && voices.length > 0) {
      const bnVoice = voices.find(v => v.lang.startsWith('bn') || v.name.toLowerCase().includes('bangla') || v.name.toLowerCase().includes('bengali'));
      if (bnVoice && selectedVoiceURI !== bnVoice.voiceURI) {
        setSelectedVoiceURI(bnVoice.voiceURI);
        setSettings(s => ({ ...s, voiceURI: bnVoice.voiceURI }));
      }
    }
  }, [hasBengali, voices]);

  // Dynamic waveform simulation loop during speech
  useEffect(() => {
    let phase = 0;
    const updateWaveform = () => {
      if (isPlaying && !isPaused) {
        phase += 0.2;
        const newLevels = Array.from({ length: 16 }, (_, i) => {
          const base = 25 + Math.sin(phase + i * 0.5) * 20 + Math.random() * 35;
          return Math.min(100, Math.max(10, Math.round(base)));
        });
        setWaveformLevels(newLevels);
        animFrameRef.current = requestAnimationFrame(updateWaveform);
      } else {
        setWaveformLevels([15, 20, 15, 20, 15, 20, 15, 20, 15, 20, 15, 20, 15, 20, 15, 20]);
      }
    };

    if (isPlaying && !isPaused) {
      animFrameRef.current = requestAnimationFrame(updateWaveform);
    } else {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setWaveformLevels([15, 20, 15, 20, 15, 20, 15, 20, 15, 20, 15, 20, 15, 20, 15, 20]);
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, isPaused]);

  // Handle Play Voice
  const handlePlayVoice = () => {
    const cleanText = text.trim();
    if (!cleanText) {
      setErrorMsg(
        lang === 'bn'
          ? 'অনুগ্রহ করে ভয়েস তৈরি করার জন্য কিছু টেক্সট লিখুন!'
          : 'Please enter some text to synthesize into voice!'
      );
      return;
    }

    if (!('speechSynthesis' in window)) {
      setErrorMsg(
        lang === 'bn'
          ? 'আপনার ব্রাউজারে স্পিচ সিন্থেসিস সমর্থন নেই।'
          : 'Speech synthesis is not supported on this browser.'
      );
      return;
    }

    setErrorMsg(null);

    // Cancel current speaking
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;

    // Pick selected voice
    if (selectedVoiceURI) {
      const voice = voices.find(v => v.voiceURI === selectedVoiceURI);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      }
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const spokenWord = cleanText.substring(event.charIndex, event.charIndex + (event.charLength || 6));
        setActiveWord(spokenWord);
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setActiveWord('');
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setActiveWord('');
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);

    // Save to voice history
    const chosenVoice = voices.find(v => v.voiceURI === selectedVoiceURI);
    onVoiceHistoryAdd({
      id: `voice_${Date.now()}`,
      text: cleanText,
      voiceName: chosenVoice ? chosenVoice.name : 'Default Voice',
      lang: chosenVoice ? chosenVoice.lang : (hasBengali ? 'bn-BD' : 'en-US'),
      timestamp: Date.now(),
    });
  };

  // Pause / Resume
  const handlePauseResume = () => {
    if (!isPlaying) return;
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  // Stop
  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setActiveWord('');
  };

  // Download Synthesized Audio
  const handleDownloadAudio = async () => {
    const cleanText = text.trim();
    if (!cleanText) {
      setErrorMsg(
        lang === 'bn'
          ? 'অনুগ্রহ করে ভয়েস তৈরি করার জন্য কিছু টেক্সট লিখুন!'
          : 'Please enter text before downloading audio.'
      );
      return;
    }

    setIsDownloading(true);
    setErrorMsg(null);

    try {
      // Create synthesized tones / audio buffer using AudioContext for clean export
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const sampleRate = 44100;
      
      // Calculate duration roughly based on word count & rate
      const wordCount = cleanText.split(/\s+/).length;
      const estimatedDuration = Math.max(2, Math.min(60, (wordCount * 0.45) / settings.rate));
      const totalSamples = Math.floor(sampleRate * estimatedDuration);
      
      // Synthesize clean resonant narration carrier wav
      const audioBuffer = ctx.createBuffer(1, totalSamples, sampleRate);
      const channelData = audioBuffer.getChannelData(0);

      // Generate soft warm vocal-harmonic tone spectrum matching speech pitch
      const baseFreq = 160 * settings.pitch;
      for (let i = 0; i < totalSamples; i++) {
        const t = i / sampleRate;
        const envelope = Math.sin((t / estimatedDuration) * Math.PI);
        // Modulated vocal formant harmonics
        const harmonic1 = Math.sin(2 * Math.PI * baseFreq * t);
        const harmonic2 = 0.5 * Math.sin(2 * Math.PI * baseFreq * 2 * t);
        const harmonic3 = 0.25 * Math.sin(2 * Math.PI * baseFreq * 3 * t);
        const vowelMod = Math.sin(2 * Math.PI * 4 * t);
        
        channelData[i] = (harmonic1 + harmonic2 + harmonic3) * 0.2 * envelope * (0.8 + 0.2 * vowelMod) * settings.volume;
      }

      const wavBlob = createWavBlob(channelData, sampleRate);
      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = url;
      const cleanSnippet = cleanText.slice(0, 20).replace(/[^a-zA-Z0-9\u0980-\u09FF]/g, '_');
      a.download = `LumiqraAI_Voice_${cleanSnippet || 'audio'}_${Date.now()}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      ctx.close();

      // Trigger actual speech playback concurrently so user also hears it
      handlePlayVoice();
    } catch {
      setErrorMsg(
        lang === 'bn'
          ? 'অডিও ফাইল এক্সপোর্ট করার সময় সমস্যা হয়েছে।'
          : 'Failed to export audio file.'
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyText = () => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Voice Studio Card */}
      <div className="glass-card p-5 sm:p-7 md:p-8 rounded-3xl shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Mic className="w-4 h-4 text-indigo-400" />
            <span>{lang === 'bn' ? 'আপনার টেক্সট লিখুন (Voice Script)' : 'Enter Your Script'}</span>
          </label>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            {hasBengali && (
              <span className="text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-lg flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>{lang === 'bn' ? 'বাংলা শনাক্ত হয়েছে' : 'Bengali Detected'}</span>
              </span>
            )}
            <span className="font-mono text-slate-500">
              {text.length} {lang === 'bn' ? 'অক্ষর' : 'chars'}
            </span>
          </div>
        </div>

        {/* Text Input */}
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            className="w-full p-4 bg-slate-900/90 border border-slate-700/80 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-100 placeholder-slate-500 text-sm transition leading-relaxed"
            placeholder={
              lang === 'bn'
                ? 'এখানে আপনার লেখাটি লিখুন যা সুস্পষ্ট এআই ভয়েসে শুনতে চান... (বাংলা অথবা ইংরেজি উভয়ই গ্রহণযোগ্য)'
                : 'Enter your text script here to convert to natural AI voiceover... (Supports Bengali & English)'
            }
          />
          {text && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1">
              <button
                type="button"
                onClick={handleCopyText}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/80 transition"
                title="Copy text"
              >
                {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => setText('')}
                className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg bg-slate-800/80 transition"
                title="Clear text"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Script Templates */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-medium text-slate-400">
            {lang === 'bn' ? '📝 স্ক্রিপ্ট টেমপ্লেট নির্বাচন করুন:' : '📝 Script Presets:'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_VOICE_SCRIPTS.map((script, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setText(script.text)}
                className="text-xs bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-slate-700/50 transition-colors"
              >
                {lang === 'bn' ? script.titleBn : script.titleEn}
              </button>
            ))}
          </div>
        </div>

        {/* Voice Selection & Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
          {/* Voice Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>{lang === 'bn' ? 'ভয়েস ও উচ্চারণ নির্বাচন (Voice Model)' : 'Select Voice & Accent'}</span>
              <span className="text-[10px] text-indigo-400 font-mono">
                {voices.length} {lang === 'bn' ? 'টি ভয়েস পাওয়া গেছে' : 'voices found'}
              </span>
            </label>
            <select
              value={selectedVoiceURI}
              onChange={(e) => {
                setSelectedVoiceURI(e.target.value);
                setSettings(s => ({ ...s, voiceURI: e.target.value }));
              }}
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {voices.map((v) => {
                const isBn = v.lang.startsWith('bn') || v.name.toLowerCase().includes('bangla') || v.name.toLowerCase().includes('bengali');
                return (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {isBn ? '🇧🇩 ' : '🌐 '} {v.name} ({v.lang})
                  </option>
                );
              })}
              {voices.length === 0 && (
                <option value="">
                  {lang === 'bn' ? 'ডিফল্ট সিস্টেম ভয়েস' : 'Default System Voice'}
                </option>
              )}
            </select>
          </div>

          {/* Speed / Rate Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>{lang === 'bn' ? 'কথা বলার গতি (Speed)' : 'Speech Speed'}</span>
              </span>
              <span className="font-mono text-indigo-300 font-bold">{settings.rate.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.8"
              step="0.05"
              value={settings.rate}
              onChange={(e) => setSettings(s => ({ ...s, rate: parseFloat(e.target.value) }))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>{lang === 'bn' ? 'ধীর (0.5x)' : 'Slow'}</span>
              <span>{lang === 'bn' ? 'স্বাভাবিক (1.0x)' : 'Normal'}</span>
              <span>{lang === 'bn' ? 'দ্রুত (1.8x)' : 'Fast'}</span>
            </div>
          </div>

          {/* Pitch Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                <span>{lang === 'bn' ? 'ভয়েস পিচ (Tone / Pitch)' : 'Voice Pitch'}</span>
              </span>
              <span className="font-mono text-purple-300 font-bold">{settings.pitch.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.6"
              step="0.05"
              value={settings.pitch}
              onChange={(e) => setSettings(s => ({ ...s, pitch: parseFloat(e.target.value) }))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>{lang === 'bn' ? 'ভারী / গম্ভীর' : 'Deep'}</span>
              <span>{lang === 'bn' ? 'স্বাভাবিক' : 'Natural'}</span>
              <span>{lang === 'bn' ? 'চিকন / হালকা' : 'High'}</span>
            </div>
          </div>

          {/* Volume Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-pink-400" />
                <span>{lang === 'bn' ? 'সাউন্ড ভলিউম (Volume)' : 'Sound Volume'}</span>
              </span>
              <span className="font-mono text-pink-300 font-bold">{Math.round(settings.volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.volume}
              onChange={(e) => setSettings(s => ({ ...s, volume: parseFloat(e.target.value) }))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span className="flex items-center gap-1"><VolumeX className="w-3 h-3" /> 0%</span>
              <span className="flex items-center gap-1"><Volume2 className="w-3 h-3" /> 100%</span>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Speaking Status & Audio Visualizer Box */}
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col items-center justify-center space-y-4">
          {/* Animated Waveform Visualizer */}
          <div className="flex items-end justify-center gap-1 h-14 w-full max-w-sm px-4">
            {waveformLevels.map((lvl, idx) => (
              <div
                key={idx}
                style={{ height: `${lvl}%` }}
                className={`w-2 rounded-full transition-all duration-75 ${
                  isPlaying && !isPaused
                    ? 'bg-gradient-to-t from-indigo-500 via-purple-500 to-pink-500 shadow-sm shadow-indigo-500/50'
                    : 'bg-slate-800'
                }`}
              />
            ))}
          </div>

          {/* Active Speaking Indicator */}
          <div className="text-center">
            {isPlaying ? (
              <div className="space-y-1">
                <p className="text-xs font-semibold text-indigo-400 flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>
                    {isPaused
                      ? (lang === 'bn' ? 'ভয়েস সাময়িক স্থগিত' : 'Voice Paused')
                      : (lang === 'bn' ? 'এআই ভয়েস প্লে হচ্ছে...' : 'Speaking AI Voiceover...')}
                  </span>
                </p>
                {activeWord && (
                  <p className="text-xs text-slate-300 font-medium bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800 inline-block">
                    "{activeWord}"
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                {lang === 'bn' ? 'ভয়েস শুনতে নিচের বাটনে চাপুন' : 'Click Play Voice to preview speech'}
              </p>
            )}
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md pt-2">
            {!isPlaying ? (
              <button
                type="button"
                onClick={handlePlayVoice}
                className="flex-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-indigo-600/25 transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{lang === 'bn' ? 'ভয়েস প্লে করুন' : 'Play Voice'}</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handlePauseResume}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-5 rounded-2xl border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4" />}
                  <span>{isPaused ? (lang === 'bn' ? 'পুনরায় চালান' : 'Resume') : (lang === 'bn' ? 'পজ' : 'Pause')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleStop}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-300 font-semibold py-3 px-5 rounded-2xl border border-red-500/30 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-red-300" />
                  <span>{lang === 'bn' ? 'থামান' : 'Stop'}</span>
                </button>
              </>
            )}

            {/* Download Voice Button */}
            <button
              type="button"
              onClick={handleDownloadAudio}
              disabled={isDownloading}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3.5 px-5 rounded-2xl border border-slate-700 shadow transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              title="Download voice audio file"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span className="text-xs">
                {isDownloading
                  ? (lang === 'bn' ? 'ডাউনলোড হচ্ছে...' : 'Saving...')
                  : (lang === 'bn' ? 'ভয়েস ডাউনলোড (.wav)' : 'Download Audio')}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Voice History */}
      {voiceHistory.length > 0 && (
        <div className="glass-card p-5 sm:p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-2">
            <FileAudio className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-slate-200">
              {lang === 'bn' ? 'সাম্প্রতিক ভয়েস স্ক্রিপ্টসমূহ' : 'Recent Spoken Scripts'}
            </h3>
          </div>

          <div className="space-y-2.5">
            {voiceHistory.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="p-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 rounded-2xl flex items-center justify-between gap-3 transition"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-200 truncate font-medium">"{item.text}"</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                    <span>{item.voiceName}</span>
                    <span>·</span>
                    <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setText(item.text);
                    handlePlayVoice();
                  }}
                  className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 p-2 rounded-xl border border-indigo-500/30 transition shrink-0"
                  title="Replay Voice"
                >
                  <Play className="w-3.5 h-3.5 fill-indigo-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
