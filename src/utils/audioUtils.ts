/**
 * Audio and Speech Synthesis Utilities
 */

// Helper to detect if a text contains Bengali characters
export function isBengaliText(text: string): boolean {
  return /[\u0980-\u09FF]/.test(text);
}

// Get available voices from speech synthesis, sorted with Bengali first if requested
export function getSortedVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve([]);
      return;
    }

    let voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(sortVoices(voices));
      return;
    }

    const handler = () => {
      voices = window.speechSynthesis.getVoices();
      resolve(sortVoices(voices));
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
    };

    window.speechSynthesis.addEventListener('voiceschanged', handler);
    // Fallback if voiceschanged doesn't fire
    setTimeout(() => {
      resolve(sortVoices(window.speechSynthesis.getVoices()));
    }, 1500);
  });
}

function sortVoices(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
  return [...voices].sort((a, b) => {
    const aIsBn = a.lang.startsWith('bn') || a.name.toLowerCase().includes('bangla') || a.name.toLowerCase().includes('bengali');
    const bIsBn = b.lang.startsWith('bn') || b.name.toLowerCase().includes('bangla') || b.name.toLowerCase().includes('bengali');
    if (aIsBn && !bIsBn) return -1;
    if (!aIsBn && bIsBn) return 1;

    const aIsEn = a.lang.startsWith('en');
    const bIsEn = b.lang.startsWith('en');
    if (aIsEn && !bIsEn) return -1;
    if (!aIsEn && bIsEn) return 1;

    return a.name.localeCompare(b.name);
  });
}

/**
 * Creates an audio WAV buffer for download from an utterance or audio buffer.
 * If live audio recording via Web Audio is active, captures it, or creates an audio container.
 */
export function createWavBlob(audioData: Float32Array, sampleRate = 44100): Blob {
  const buffer = new ArrayBuffer(44 + audioData.length * 2);
  const view = new DataView(buffer);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // file length
  view.setUint32(4, 36 + audioData.length * 2, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // format chunk identifier
  writeString(view, 12, 'fmt ');
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (1 is PCM)
  view.setUint16(20, 1, true);
  // channel count (1 = mono)
  view.setUint16(22, 1, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sample rate * block align)
  view.setUint32(28, sampleRate * 2, true);
  // block align (channel count * bytes per sample)
  view.setUint16(32, 2, true);
  // bits per sample
  view.setUint16(34, 16, true);
  // data chunk identifier
  writeString(view, 36, 'data');
  // data chunk length
  view.setUint32(40, audioData.length * 2, true);

  // write PCM samples
  let offset = 44;
  for (let i = 0; i < audioData.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, audioData[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  return new Blob([view], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
