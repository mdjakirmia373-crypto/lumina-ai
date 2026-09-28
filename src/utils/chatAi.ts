// Ultra-fast, highly capable Universal AI Chat Client (ChatGPT & Gemini standard)
// 1. Instant creator query (Md. Jakir Hossain)
// 2. Direct Built-in Instant Knowledge (Hadith, Islamic, Quran, Geography, Science)
// 3. Direct server /api/chat with Gemini SDK (3.8-flash, 3.1-flash-lite)
// 4. Live Universal Knowledge Retriever Fallback

import { getDirectUniversalAnswer } from './universalKnowledge';

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number | Date;
  imageUrl?: string;
}

const CREATOR_ANSWER_BN = `আমাকে তৈরি করেছেন **মোঃ জাকির হোসেন** (Md. Jakir Hossain)। তিনি একজন গর্বিত বাংলাদেশী নাগরিক।

👤 **আমার নির্মাতার বিস্তারিত পরিচয়:**
- **নাম:** মোঃ জাকির হোসেন
- **জাতীয়তা:** বাংলাদেশী 🇧🇩
- **বর্তমান ঠিকানা:** টঙ্গী
- **স্থায়ী ঠিকানা:** থানা: কটিয়াদী, জেলা: কিশোরগঞ্জ

তিনি একজন বাংলাদেশী প্রযুক্তিপ্রেমী হিসেবে আমাকে লুমিক্রা এআই (Lumiqra AI) প্ল্যাটফর্মের জন্য একটি বিশ্বমানের বুদ্ধিমান এআই চ্যাট সহায়ক হিসেবে তৈরি করেছেন।`;

const CREATOR_ANSWER_EN = `I was proudly created and built by **Md. Jakir Hossain** (মোঃ জাকির হোসেন), from Bangladesh.

👤 **Creator Profile:**
- **Name:** Md. Jakir Hossain
- **Nationality:** Bangladeshi 🇧🇩
- **Present Address:** Tongi, Bangladesh
- **Permanent Address:** Katiadi, Kishoreganj, Bangladesh

He developed me for the Lumiqra AI platform to deliver world-class AI conversation and instant, reliable knowledge!`;

export function checkCreatorQuery(query: string): string | null {
  const q = query.toLowerCase().replace(/[\?\.,!]/g, '').trim();

  // If query is about Adam, Islam, Earth, Allah, universe, Hadith, etc. -> NEVER intercept as creator query!
  if (
    q.includes('আদম') ||
    q.includes('হাওয়া') ||
    q.includes('হাওয়া') ||
    q.includes('আল্লাহ') ||
    q.includes('নবী') ||
    q.includes('রাসূল') ||
    q.includes('মানুষ') ||
    q.includes('পৃথিবী') ||
    q.includes('হাদিস') ||
    q.includes('হাদীস') ||
    q.includes('বুখারী') ||
    q.includes('বুখারি')
  ) {
    return null;
  }

  const creatorKeywords = [
    'কে বানিয়েছে',
    'কে বানিয়েছে',
    'কে তোমাকে বানিয়েছে',
    'কে তোমায় বানিয়েছে',
    'কে তোমাকে বানালো',
    'কে তৈরি করেছে',
    'কে তোমায় তৈরি করেছে',
    'কে তৈরি করলো',
    'কে বানাইছে',
    'তোমার নির্মাতা কে',
    'তোমার ক্রিয়েটর কে',
    'তোমার প্রতিষ্ঠাতা কে',
    'who made you',
    'who created you',
    'who developed you',
    'who is your creator',
    'who is your developer',
    'who built you',
    'who is your founder',
  ];

  const matched = creatorKeywords.some((kw) => q.includes(kw));
  if (matched) {
    if (q.includes('who') || q.includes('creator') || q.includes('developer') || q.includes('built')) {
      return CREATOR_ANSWER_EN;
    }
    return CREATOR_ANSWER_BN;
  }
  return null;
}

// Built-in high-precision Instant Knowledge
export function checkUniversalKnowledge(rawQuery: string): string | null {
  const q = rawQuery.toLowerCase().replace(/[\?\.,!।]/g, '').trim();

  // ONLY treat as pure greeting if the input is exclusively greeting words
  const isPureGreeting =
    q === 'হাই' ||
    q === 'হ্যালো' ||
    q === 'হেই' ||
    q === 'hi' ||
    q === 'hello' ||
    q === 'hey' ||
    q === 'সালাম' ||
    q === 'আসসালামু আলাইকুম' ||
    q === 'আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ' ||
    q === 'assalamu alaikum' ||
    q === 'salam' ||
    q === 'slam';

  if (isPureGreeting) {
    return `ওয়ালাইকুমুস সালাম ওয়া রাহমাতুল্লাহি ওয়া বারাকাতুহু!\n\nআপনার ওপর মহান আল্লাহর অশেষ শান্তি, রহমত ও বরকত বর্ষিত হোক। আমি লুমিক্রা এআই (Lumiqra AI), আপনার জ্ঞান অন্বেষণ ও পৃথিবীর যেকোনো প্রশ্নের সরাসরি নির্ভুল উত্তর দিতে সর্বদা প্রস্তুত। বলুন, আজ আপনাকে কীভাবে সাহায্য করতে পারি?`;
  }

  if (q === 'কেমন আছো' || q === 'কেমন আছেন' || q === 'how are you') {
    return `আলহামদুলিল্লাহ, আমি খুবই ভালো আছি! আপনার খোঁজখবর কী? আশা করি আপনিও সুস্থ ও ভালো আছেন। আজ আপনাকে কী তথ্য জানতে বা কোন প্রশ্নের সমাধান করে দিতে পারি?`;
  }

  if (q === 'ধন্যবাদ' || q === 'থ্যাংকস' || q === 'thank you' || q === 'thanks') {
    return `আপনাকেও অনেক অনেক ধন্যবাদ! আপনার যেকোনো প্রয়োজনে বা জানার আগ্রহে আমি সর্বদা আপনার পাশে আছি। কোনো প্রশ্ন থাকলে নির্দ্বিধায় জিজ্ঞাসা করুন!`;
  }

  // Hadith and Bukhari Sharif
  if (
    q.includes('বুখারী') ||
    q.includes('বুখারি') ||
    q.includes('হাদিস') ||
    q.includes('হাদীস') ||
    q.includes('hadith')
  ) {
    if (q.includes('বুখারী') || q.includes('বুখারি') || q.includes('একটি হাদিস') || q.includes('হাদিস লিখে দেন') || q.includes('হাদিস দেন')) {
      return `সহীহ বুখারী শরীফের প্রথম ও সর্বাপেক্ষা মর্যাদাপূর্ণ হাদিসটি নিচে উল্লেখ করা হলো:

📖 **সহীহুল বুখারী, হাদিস নং: ১**
* **মূল আরবি:** «إنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى»
* **অর্থ:** "নিশ্চয়ই সমস্ত কাজ নিয়ত (সংকল্প)-এর ওপর নির্ভরশীল। আর প্রতিটি মানুষ তাই পাবে যার সে নিয়ত করবে।"

✨ **হাদিসের ব্যাখ্যা ও শিক্ষা:**
- ইসলামের প্রতিটি নেক আমল এবং ইবাদত আল্লাহর দরবারে কবুল হওয়ার পূর্বশর্ত হলো মনের খাঁটি নিয়ত ও ইখলাস।
- ইমাম বুখারী (রহ.) নিয়তের অপরিসীম গুরুত্ব বুঝাতে সমগ্র সহীহ বুখারীর শুরুতে এই বরকতময় হাদিসটি সংকলন করেছেন।`;
    }
  }

  // Hazrat Adam (AS) and Hawwa (AS)
  if (
    q.includes('আদম') &&
    (q.includes('স্ত্রী') || q.includes('স্ত্রীর') || q.includes('স্ত্রীকে') || q.includes('বউ') || q.includes('হাওয়া') || q.includes('হাওয়া') || q.includes('নাম'))
  ) {
    return `মানবজাতির আদি পিতা প্রথম নবী **হযরত আদম (আলাইহিস সালাম)**-এর স্ত্রীর নাম ছিল **হযরত হাওয়া (আলাইহাস সালাম)**।\n\n📖 **গুরুত্বপূর্ণ ঐতিহাসিক ও ইসলামী তথ্য:**\n- মহান আল্লাহ সুবহানাহু ওয়া তায়ালা হযরত আদম (আ.)-এর বাঁ-দিকের পাঁজরের হাড় থেকে হযরত হাওয়া (আ.)-কে তাঁর সঙ্গী হিসেবে সৃষ্টি করেছিলেন।\n- তাঁরা উভয়ই জান্নাতে বসবাস করতেন এবং পরবর্তীতে মহান আল্লাহর হুকুমে ও নির্ধারিত তকদীরের অংশ হিসেবে পৃথিবীতে আগমন করেন।\n- তাঁদের মাধ্যমে সমগ্র মানবজাতির বিস্তৃতি ও বংশপরম্পরা শুরু হয়।`;
  }

  // Quran: Para
  if (
    (q.includes('কোরআন') || q.includes('কুরআন') || q.includes('quran')) &&
    (q.includes('পারা') || q.includes('জুয') || q.includes('juz'))
  ) {
    return `পবিত্র কুরআনুল কারীমে মোট **৩০টি পারা (বা জুয)** রয়েছে।\n\n📖 **পবিত্র কুরআনের মূল গঠন ও সংখ্যাগত তথ্য:**\n* **মোট পারা (Juz):** ৩০টি।\n* **মোট সূরা (Surah):** ১১৪টি (মাক্কী ৮৬টি এবং মাদানী ২৮টি)।\n* **মোট আয়াত (Ayah):** ৬,২৩৬টি (রুকু ও বিরতি ভেদে বহুল প্রচলিত গণনায় ৬৬৬৬টি)।\n* **মোট রুকু:** ৫৫৮টি।\n* **সিজদাহ্:** ১৪টি।\n* **মনজিল:** ৭টি।`;
  }

  // Quran: Surah count
  if (
    (q.includes('কোরআন') || q.includes('কুরআন') || q.includes('quran') || q.includes('সূরা') || q.includes('সুরা')) &&
    (q.includes('কয়টি সূরা') || q.includes('কয়টা সূরা') || q.includes('কতটি সূরা') || q.includes('সূরা কয়টি') || q.includes('সুরা কয়টি'))
  ) {
    return `পবিত্র কুরআনুল কারীমে মোট **১১৪টি সূরা** রয়েছে।\n\n📖 **সূরা সংক্রান্ত গুরুত্বপূর্ণ তথ্য:**\n* **মাক্কী সূরা:** **৮৬টি** (হিজরতের পূর্বে মক্কায় নাযিলকৃত)।\n* **মাদানী সূরা:** **২৮টি** (হিজরতের পর মদিনায় নাযিলকৃত)।\n* **সর্ববৃহৎ সূরা:** **সূরা আল-বাকারা** (২৮৬টি আয়াত)।\n* **ক্ষুদ্রতম সূরা:** **সূরা আল-কাওসার** (৩টি আয়াত)।\n* **কুরআনের হৃদয়:** **সূরা ইয়াসীন**।\n* **উম্মুল কুরআন:** **সূরা আল-ফাতিহা**।`;
  }

  // Quran: Ayah count
  if (
    (q.includes('কোরআন') || q.includes('কুরআন') || q.includes('quran')) &&
    (q.includes('কয়টি আয়াত') || q.includes('আয়াত কয়টি') || q.includes('কতটি আয়াত') || q.includes('কত আয়াত'))
  ) {
    return `পবিত্র কুরআনুল কারীমে সর্বাধিক বিশুদ্ধ ও প্রামাণ্য গণনামতে মোট **৬,২৩৬টি আয়াত** রয়েছে।\n\n(সুরার শুরুর 'বিসমিল্লাহ'-কে গণনায় ধরা এবং আয়াতের বিরতি চিহ্ন গণনার ভিন্নতার কারণে সাধারণ প্রচলিত ধারণায় অনেকেই আয়াতের সংখ্যা **৬,৬৬৬টি** বলে থাকেন)।`;
  }

  // Ayatul Kursi
  if (q.includes('আয়াতুল কুরসী') || q.includes('আয়াতুল কুরসি') || q.includes('ayatul kursi')) {
    return `**আয়াতুল কুরসী** হলো পবিত্র কুরআনের দ্বিতীয় সূরা **সূরা আল-বাকারা**-এর **২৫৫ নম্বর আয়াত**। এটিকে কুরআনের সবচেয়ে মর্যাদাপূর্ণ আয়াত বলা হয়।\n\n📖 **বাংলা অর্থ:**\n"আল্লাহ, তিনি ছাড়া অন্য কোনো সত্য উপাস্য নেই; তিনি চিরঞ্জীব, সবকিছুর ধারক। তন্দ্রা বা নিদ্রা তাঁকে স্পর্শ করে না। আসমান ও যমীনে যা কিছু রয়েছে, সবই তাঁর। কে আছে এমন যে তাঁর অনুমতি ছাড়া তাঁর নিকট সুপারিশ করবে? তাদের সম্মুখে ও পেছনে যা কিছু আছে তা তিনি জানেন। আর তাঁর জ্ঞানের কোনো কিছুকেই তারা পরিবেষ্টন করতে পারে না, কেবল যতটুকু তিনি ইচ্ছা করেন তা ছাড়া। তাঁর কুরসী আসমান ও যমীনকে পরিবেষ্টন করে আছে, এবং এ দুটির সংরক্ষণ তাঁর জন্য কোনো ক্লান্তি আনে না। আর তিনিই সর্বোচ্চ, পরম মহান।"`;
  }

  // Asmani Kitab
  if ((q.includes('আসমানী') || q.includes('আসমানি')) && (q.includes('কিতাব') || q.includes('বই'))) {
    return `আসমানী কিতাবের সংখ্যা মোট **১০৪ খানা**। এর মধ্যে প্রধান কিতাব হলো **৪ খানা**, এবং ছোট কিতাব (সহীফা) হলো **১০০ খানা**।\n\n### 📖 প্রধান ৪টি আসমানী কিতাব:\n১. **তাওরাত:** হযরত মুসা (আ.)-এর ওপর নাজিল হয়েছে।\n২. **যাবুর:** হযরত দাউদ (আ.)-এর ওপর নাজিল হয়েছে।\n৩. **ইঞ্জিল:** হযরত ঈসা (আ.)-এর ওপর নাজিল হয়েছে।\n৪. **আল-কুরআন:** সর্বশেষ ও সর্বশ্রেষ্ঠ নবী হযরত মুহাম্মদ (সা.)-এর ওপর সমগ্র মানবজাতির জন্য নাজিল হয়েছে।`;
  }

  // Namaz
  if (q.includes('নামাজ') && (q.includes('ওয়াক্ত') || q.includes('কয়টি') || q.includes('কয়') || q.includes('রাকাত'))) {
    return `মুসলিমদের ওপর প্রতিদিন **৫ ওয়াক্ত নামাজ** ফরজ:\n\n১. **ফজর:** সুবহে সাদিক থেকে সূর্যোদয়ের পূর্ব পর্যন্ত (২ রাকাত সুন্নত, ২ রাকাত ফরজ)।\n২. **যোহর:** দ্বিপ্রহরের পর থেকে আসর পর্যন্ত (৪ রাকাত সুন্নত, ৪ রাকাত ফরজ, ২ রাকাত সুন্নত, ২ রাকাত নফল)।\n৩. **আসর:** সূর্যের আলো হলুদ হওয়ার আগ পর্যন্ত (৪ রাকাত ফরজ)।\n৪. **মাগরিব:** সূর্যাস্তের পর থেকে পশ্চিমাকাশে লাল আভা থাকা পর্যন্ত (৩ রাকাত ফরজ, ২ রাকাত সুন্নত, ২ রাকাত নফল)।\n৫. **এশা:** মাগরিবের সময় শেষ হওয়ার পর থেকে ফজরের আগ পর্যন্ত (৪ রাকাত ফরজ, ২ রাকাত সুন্নত, ৩ রাকাত বিতর)।`;
  }

  // Bangladesh
  if (q.includes('বাংলাদেশ')) {
    if (q.includes('রাজধানী')) {
      return `বাংলাদেশের রাজধানী হলো **ঢাকা**।`;
    }
    if (q.includes('স্বাধীনতা') || q.includes('স্বাধীন')) {
      return `বাংলাদেশ **১৯৭১ সালের ২৬ মার্চ** স্বাধীনতার ঘোষণা দেয় এবং দীর্ঘ ৯ মাসের রক্তক্ষয়ী মুক্তিযুদ্ধের পর **১৬ ডিসেম্বর ১৯৭১** চূড়ান্ত বিজয় অর্জনের মাধ্যমে একটি স্বাধীন সার্বভৌম রাষ্ট্র হিসেবে প্রতিষ্ঠিত হয়।`;
    }
  }

  // Sun
  if (q.includes('সূর্য') && (q.includes('উদিত') || q.includes('উঠে') || q.includes('উঠা') || q.includes('পূর্ব'))) {
    return `সূর্য সর্বদা **পূর্ব দিকে** উদিত হয় এবং **পশ্চিম দিকে** অস্ত যায়।`;
  }

  return null;
}

// Ask AI Question: Guaranteed dynamic multi-tiered response engine
export async function askAiQuestion(
  userQuery: string,
  history: ChatMessage[] = []
): Promise<string> {
  const cleanQuery = userQuery.trim();
  if (!cleanQuery) return 'অনুগ্রহ করে আপনার প্রশ্নটি লিখুন।';

  // 1. Instant creator query (specifically about Lumiqra AI's maker)
  const creatorAns = checkCreatorQuery(cleanQuery);
  if (creatorAns) return creatorAns;

  // 2. Instant Built-in Knowledge (Hadith, Adam/Hawwa, Quran, Bangladesh, Sun)
  const instantAnswer = checkUniversalKnowledge(cleanQuery);
  if (instantAnswer) return instantAnswer;

  // 3. Primary Full-Stack Gemini AI Call (/api/chat)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: cleanQuery,
        history: history.slice(-6).map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.reply && typeof data.reply === 'string' && data.reply.trim().length > 0) {
        return data.reply.trim();
      }
    }
  } catch (backendErr) {
    console.warn('Backend /api/chat error:', backendErr);
  }

  // 4. Live Universal Knowledge Retriever Fallback (Guaranteed to return information on history, religion, science, people)
  const directUniversalAnswer = await getDirectUniversalAnswer(cleanQuery);
  if (directUniversalAnswer) {
    return directUniversalAnswer;
  }

  return `আপনার প্রশ্ন: **"${cleanQuery}"**\n\nসার্ভারে সংযোগ নিতে সাময়িক বিলম্ব হয়েছে। অনুগ্রহ করে মেসেজটি পুনরায় পাঠান, আমি সাথে সাথে এর উত্তর প্রদান করছি।`;
}
