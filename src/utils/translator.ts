// Translator helper: Translate Bengali prompts to English for AI models (Flux/SD)
// Uses Google Translate / MyMemory free API with offline dictionary fallback for common Bengali terms

const BENGALI_DICTIONARY: Record<string, string> = {
  'বিড়াল': 'cat',
  'বিড়াল': 'cat',
  'কুকুর': 'dog',
  'বাঘ': 'tiger',
  'সিংহ': 'lion',
  'পাখি': 'bird',
  'মানুষ': 'person',
  'মেয়ে': 'girl',
  'মেয়ে': 'girl',
  'ছেলে': 'boy',
  'মহিলা': 'woman',
  'পুরুষ': 'man',
  'কনে': 'bride',
  'বর': 'groom',
  'শাড়ি': 'sari',
  'শাড়ি': 'sari',
  'সুন্দরবন': 'Sundarbans mangrove forest',
  'ঢাকা': 'Dhaka city',
  'বাংলাদেশ': 'Bangladesh',
  'নদী': 'river',
  'সূর্য': 'sun',
  'সূর্যাস্ত': 'sunset',
  'সূর্যোদয়': 'sunrise',
  'চাঁদ': 'moon',
  'মেঘ': 'clouds',
  'বৃষ্টি': 'rain',
  'পাহাড়': 'mountain',
  'পাহাড়': 'mountain',
  'সমুদ্র': 'ocean beach',
  'জঙ্গল': 'jungle forest',
  'গাছ': 'tree',
  'ফুল': 'flower',
  'গোলাপ': 'rose',
  'চা': 'tea',
  'কফি': 'coffee',
  'বই': 'book',
  'চশমা': 'eyeglasses spectacles',
  'গাড়ি': 'car',
  'গাড়ি': 'car',
  'রিকশা': 'rickshaw',
  'বাগান': 'garden',
  'গ্রাম': 'village',
  'শহর': 'city',
  'বাড়ি': 'house',
  'বাড়ি': 'house',
  'মন্দির': 'temple',
  'মসজিদ': 'mosque',
  'দুর্গ': 'castle',
  'ড্রাগন': 'dragon',
  'রোবট': 'robot',
  'সাইবারপাঙ্ক': 'cyberpunk',
  'কিউট': 'cute fluffy',
  'তুলতুলে': 'fluffy adorable',
  'সুন্দর': 'beautiful stunning',
  'লাল': 'red',
  'নীল': 'blue',
  'সবুজ': 'green',
  'হলুদ': 'yellow',
  'সাদা': 'white',
  'কালো': 'black',
  'সোনালী': 'golden',
  'রুপালী': 'silver',
};

// Check if string has Bengali script characters
export function containsBengali(text: string): boolean {
  return /[\u0980-\u09FF]/.test(text);
}

// Translate Bengali prompt to English for the AI image engine
export async function translatePromptToEnglish(prompt: string): Promise<string> {
  const clean = prompt.trim();
  if (!containsBengali(clean)) {
    return clean;
  }

  try {
    // 1. First attempt: Free Google Translate single-shot API
    const gUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=bn&tl=en&dt=t&q=${encodeURIComponent(clean)}`;
    const res = await fetch(gUrl, { signal: AbortSignal.timeout(3500) });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const translatedParts = data[0].map((chunk: any) => chunk[0]).filter(Boolean);
        const translated = translatedParts.join(' ').trim();
        if (translated && !containsBengali(translated)) {
          return translated;
        }
      }
    }
  } catch (e) {
    console.warn('Google Translate API timeout/failed, trying MyMemory...', e);
  }

  try {
    // 2. Second attempt: MyMemory Translate
    const memUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=bn|en`;
    const res2 = await fetch(memUrl, { signal: AbortSignal.timeout(3500) });
    if (res2.ok) {
      const data2 = await res2.json();
      if (data2?.responseData?.translatedText) {
        const trans2 = data2.responseData.translatedText;
        if (trans2 && !containsBengali(trans2)) {
          return trans2;
        }
      }
    }
  } catch (e2) {
    console.warn('MyMemory Translate failed:', e2);
  }

  // 3. Fallback: Dictionary keyword replacement
  let replaced = clean;
  for (const [bnWord, enWord] of Object.entries(BENGALI_DICTIONARY)) {
    if (replaced.includes(bnWord)) {
      replaced = replaced.replaceAll(bnWord, enWord);
    }
  }

  // If still contains heavy Bengali characters that AI can't parse, provide clean high quality prompt
  if (containsBengali(replaced)) {
    return `${clean}, photorealistic, vibrant, cinematic masterpiece, intricate details, 8k`;
  }

  return replaced;
}
