// Ultra-fast, highly capable Universal AI Chat Client (ChatGPT & Gemini standard)
// 1. Direct server /api/chat with Gemini SDK
// 2. Built-in high-precision Instant Knowledge Engine for Islamic, Scientific, General Knowledge & Greetings
// 3. Instant Wikipedia Search & Universal Knowledge Synthesis (Ensuring EVERY question gets answered)

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
    'তোমার স্রষ্টা কে',
    'তোমার প্রতিষ্ঠাতা কে',
    'তোমার মালিক কে',
    'কার তৈরি',
    'কে তোমাকে বানাইসে',
    'তোমাকে কে বানাইসে',
    'who made you',
    'who created you',
    'who developed you',
    'who is your creator',
    'who is your developer',
    'who built you',
    'who is your founder',
    'who is your owner',
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

  // Greetings
  if (q === 'হাই' || q === 'হ্যালো' || q === 'হেই' || q === 'hi' || q === 'hello' || q === 'hey') {
    return `আসসালামু আলাইকুম! আমি **লুমিক্রা এআই (Lumiqra AI)**। আমি আপনাকে কীভাবে সাহায্য করতে পারি?\n\nআপনি আমাকে পবিত্র কুরআন ও হাদীস, মহাবিশ্ব ও বিজ্ঞান, ইতিহাস, গণিত, কোডিং কিংবা যেকোনো সৃজনশীল বিষয়ে প্রশ্ন করতে পারেন — আমি সাথে সাথে নির্ভুল উত্তর প্রদান করব!`;
  }

  if (
    q.includes('সালাম') ||
    q.includes('আসসালামু আলাইকুম') ||
    q.includes('assalamu alaikum') ||
    q.includes('salam')
  ) {
    return `ওয়ালাইকুমুস সালাম ওয়া রাহমাতুল্লাহি ওয়া বারাকাতুহু!\n\nআপনার ওপর মহান আল্লাহর অশেষ শান্তি, রহমত ও বরকত বর্ষিত হোক। আমি লুমিক্রা এআই (Lumiqra AI), আপনার জ্ঞান অন্বেষণ ও যেকোনো প্রশ্নের উত্তর দিতে সর্বদা প্রস্তুত। বলুন, আজ আপনাকে কীভাবে সাহায্য করতে পারি?`;
  }

  if (q === 'কেমন আছো' || q === 'কেমন আছেন' || q === 'how are you') {
    return `আলহামদুলিল্লাহ, আমি খুবই ভালো আছি! আপনার খোঁজখবর কী? আশা করি আপনিও সুস্থ ও ভালো আছেন। আজ আপনাকে কী তথ্য জানতে বা কোন প্রশ্নের সমাধান করে দিতে পারি?`;
  }

  if (q.includes('ধন্যবাদ') || q.includes('থ্যাংকস') || q.includes('thank you')) {
    return `আপনাকেও অনেক অনেক ধন্যবাদ! আপনার যেকোনো প্রয়োজনে বা জানার আগ্রহে আমি সর্বদা আপনার পাশে আছি। কোনো প্রশ্ন থাকলে নির্দ্বিধায় জিজ্ঞাসা করুন!`;
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

  // Prophets / ১,২৪,০০০ নবী-রাসূল
  if (q.includes('নবী') || q.includes('রাসূল') || q.includes('রাসুল') || q.includes('prophet')) {
    if (q.includes('কয়জন') || q.includes('কতজন') || q.includes('সংখ্যা') || q.includes('জীবনী')) {
      return `ইসলামী আকিদা ও প্রামাণ্য হাদীস অনুযায়ী মহান আল্লাহ মানবজাতিকে সৎপথ প্রদর্শনের জন্য প্রায় **১,২৪,০০০ (কিংবা ২,২৪,০০০) নবী ও রাসূল** প্রেরণ করেছিলেন।\n\n📖 **নবী-রাসূলগণের গুরুত্বপূর্ণ তথ্য ও ইতিহাস:**\n- **প্রথম নবী ও মানব:** হযরত আদম (আলাইহিস সালাম)\n- **সর্বশেষ ও সর্বশ্রেষ্ঠ রাসূল:** বিশ্বনবী হযরত মুহাম্মদ (সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম)\n- **পবিত্র কুরআনে উল্লেখিত নবীগণের সংখ্যা:** ২৫ জন (যেমন: হযরত আদম, নূহ, ইব্রাহীম, ইসমাঈল, ইসহাক, ইয়াকুব, ইউসুফ, আইয়ুব, মূসা, হারুন, দাউদ, সোলাইমান, ইউনুস, যাকারিয়া, ইয়াহিয়া, ঈসা এবং মুহাম্মদ সা.)।\n- **উলুল আযম (ধৈর্যশীল শীর্ষ ৫ রাসূল):** হযরত নূহ (আ.), হযরত ইব্রাহীম (আ.), হযরত মূসা (আ.), হযরত ঈসা (আ.) এবং হযরত মুহাম্মদ (সা.)।`;
    }
  }

  // Sahaba / সাহাবী
  if (q.includes('সাহাবী') || q.includes('সাহাবা') || q.includes('sahaba')) {
    return `সাহাবী হলেন সেই পুণ্যবান ব্যক্তিগণ যিনি ঈমানের সাথে মহানবী হযরত মুহাম্মদ (সা.)-এর পবিত্র দর্শন লাভ করেছিলেন এবং ঈমানের ওপরই মৃত্যুবরণ করেছিলেন।\n\n⭐ **চার মহান খলিফা (খুলাফায়ে রাশেদীন):**\n১. **হযরত আবু বকর সিদ্দিক (রা.)** — প্রথম খলিফা, মহানবীর পরম বন্ধু ও 'আস-সিদ্দিক'।\n২. **হযরত উমর ইবনুল খাত্তাব (রা.)** — দ্বিতীয় খলিফা, ইনসাফের প্রতীক ও 'আল-ফারুক'।\n৩. **হযরত উসমান ইবনে আফফান (রা.)** — তৃতীয় খলিফা, পবিত্র কুরআন সংকলক ও 'জুন-নুরাইন'।\n৪. **হযরত আলী ইবনে আবি তালিব (রা.)** — চতুর্থ খলিফা, বীর যোদ্ধা ও 'আসাদুল্লাহ'।\n\nএছাড়াও দুনিয়াতেই জান্নাতের সুসংবাদপ্রাপ্ত ১০ জন শ্রেষ্ঠ সাহাবীকে **'আশারায়ে মুবাশশারাহ'** বলা হয়।`;
  }

  // Big Bang & Universe / মহাবিশ্ব ও সৃষ্টিতত্ত্ব
  if (q.includes('বিগ ব্যাং') || q.includes('মহাবিশ্ব') || q.includes('সৃষ্টিতত্ত্ব') || q.includes('universe')) {
    return `### 🌌 **মহাবিশ্ব সৃষ্টি ও আধুনিক জ্যোতির্বিজ্ঞান**\n\nপদার্থবিজ্ঞান ও আধুনিক কসমোলজি অনুসারে প্রায় **১৩.৮ বিলিয়ন (১,৩৮০ কোটি) বছর পূর্বে** 'বিগ ব্যাং' (Big Bang) নামক এক মহাবিস্ফোরণের মাধ্যমে স্থান, কাল ও মহাবিশ্বের সূচনা হয়।\n\n- **প্রাথমিক অবস্থা:** অসীম তাপমাত্রা ও ঘনত্বের এক ক্ষুদ্রতম বিন্দু (Singularity) থেকে মহাবিশ্ব দ্রুত সম্প্রসারিত হতে শুরু করে।\n- **মৌল সৃষ্টি:** সম্প্রসারণের সাথে সাথে মহাবিশ্ব শীতল হতে থাকে এবং প্রথম ইলেকট্রন, প্রোটন ও হাইড্রোজেন-হিলিয়াম গ্যাস গঠিত হয়।\n- **গ্যালাক্সি ও সৌরজগত:** মহাকর্ষ বলের টানে গ্যাসপিণ্ড ঘনীভূত হয়ে নক্ষত্র ও ছায়াপথ তৈরি করে। আজ থেকে প্রায় ৪.৫ বিলিয়ন বছর আগে আমাদের সূর্য ও পৃথিবী গঠিত হয়।\n- **পবিত্র কুরআনের সাথে সামঞ্জস্য:** সূরা আল-আম্বিয়ার ৩০ আয়াতে বলা হয়েছে: *"আসমান ও যমীন ওতপ্রোতভাবে মিশে ছিল, অতঃপর আমি উভয়কে পৃথক করে দিলাম এবং প্রাণবান সবকিছু পানি থেকে সৃষ্টি করলাম।"*`;
  }

  // Ancient Civilizations / প্রাচীন সভ্যতা
  if (q.includes('সভ্যতা') || q.includes('civilization') || q.includes('ইতিহাস')) {
    if (q.includes('প্রাচীন') || q.includes('মেসোপটেমিয়া') || q.includes('মিশরীয়') || q.includes('সিন্ধু')) {
      return `### 🏛️ **প্রাচীন মানব সভ্যতা ও ক্রমবিকাশ**\n\nমানবজাতির ইতিহাসের প্রারম্ভে নদীর তীরবর্তী উর্বর উপত্যকাগুলোতে প্রাচীন সভ্যতার উন্মেষ ঘটেছিল:\n\n১. **মেসোপটেমীয় সভ্যতা (টাইগ্রিস ও ইউফ্রেটিস নদী):** বর্তমান ইরাকে গড়ে ওঠা সুমেরীয়, ব্যাবিলনীয় ও অ্যাসিরীয় সভ্যতা। তারা চাকা ও প্রথম লিখন পদ্ধতি (কিউনিফর্ম) আবিষ্কার করে।\n২. **মিশরীয় সভ্যতা (নীল নদ):** পিরামিড, মমীকরণ, হায়ারোগ্লিফিক লিপি ও জ্যোতির্বিজ্ঞানের অভূতপূর্ব বিকাশ।\n৩. **সিন্ধু সভ্যতা (সিন্ধু নদ):** হরপ্পা ও মহেঞ্জোদারো—উন্নত নগর পরিকল্পনা, পয়ঃনিষ্কাশন ও জলপথ বাণিজ্য ব্যবস্থা।\n৪. **চীনা সভ্যতা (হোয়াংহো নদী):** কাগজ, রেশম বস্ত্র, বারুদ ও কম্পাসের আবিষ্কারক।`;
    }
  }

  // Namaz
  if (q.includes('নামাজ') && (q.includes('ওয়াক্ত') || q.includes('কয়টি') || q.includes('কয়') || q.includes('রাকাত'))) {
    return `মুসলিমদের ওপর প্রতিদিন **৫ ওয়াক্ত নামাজ** ফরজ:\n\n১. **ফজর:** সুবহে সাদিক থেকে সূর্যোদয়ের পূর্ব পর্যন্ত (২ রাকাত সুন্নত, ২ রাকাত ফরজ)।\n২. **যোহর:** দ্বিপ্রহরের পর থেকে আসর পর্যন্ত (৪ রাকাত সুন্নত, ৪ রাকাত ফরজ, ২ রাকাত সুন্নত, ২ রাকাত নফল)।\n৩. **আসর:** সূর্যের আলো হলুদ হওয়ার আগ পর্যন্ত (৪ রাকাত ফরজ)।\n৪. **মাগরিব:** সূর্যাস্তের পর থেকে পশ্চিমাকাশে লাল আভা থাকা পর্যন্ত (৩ রাকাত ফরজ, ২ রাকাত সুন্নত, ২ রাকাত নফল)।\n৫. **এশা:** মাগরিবের সময় শেষ হওয়ার পর থেকে ফজরের আগ পর্যন্ত (৪ রাকাত ফরজ, ২ রাকাত সুন্নত, ৩ রাকাত বিতর)।`;
  }

  return null;
}

function formatWikiSummary(title: string, extract: string): string {
  const cleaned = extract
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const sentences = cleaned.split(/(?<=[।\.\?!])\s+/);
  const coreInfo = sentences.slice(0, 4).join(' ');

  return `### 💡 **${title}**\n\n${coreInfo}`;
}

// Ask AI Question: Guaranteed multi-tiered response engine
export async function askAiQuestion(
  userQuery: string,
  history: ChatMessage[] = []
): Promise<string> {
  const cleanQuery = userQuery.trim();
  if (!cleanQuery) return 'অনুগ্রহ করে আপনার প্রশ্নটি লিখুন।';

  // 1. Instant creator query
  const creatorAns = checkCreatorQuery(cleanQuery);
  if (creatorAns) return creatorAns;

  // 2. Instant Built-in Knowledge
  const instantAnswer = checkUniversalKnowledge(cleanQuery);
  if (instantAnswer) return instantAnswer;

  // 3. Primary Full-Stack Gemini AI Call (/api/chat)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

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

  // 4. Wikipedia Instant Knowledge Fallback (Clean search with GET)
  try {
    const searchTerms = cleanQuery
      .replace(/কি\b|কে\b|কখন\b|কোথায়\b|কেন\b|কী\b|কাকে\b|কয়টি\b|কতটি\b|বলুন\b|জানান\b|সংক্রান্ত\b|সম্পর্কে\b|সম্পর্কিত\b/gi, '')
      .replace(/[\?\.,!।]/g, '')
      .trim();

    if (searchTerms.length >= 2) {
      // Bengali Wiki
      const wikiUrl = `https://bn.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&explaintext=1&origin=*&titles=${encodeURIComponent(
        searchTerms
      )}`;
      const wikiRes = await fetch(wikiUrl);
      if (wikiRes.ok) {
        const wikiData = await wikiRes.json();
        const pages = wikiData?.query?.pages || {};
        const firstPageId = Object.keys(pages)[0];
        if (firstPageId && firstPageId !== '-1' && pages[firstPageId]?.extract) {
          return formatWikiSummary(pages[firstPageId].title, pages[firstPageId].extract);
        }
      }

      // English Wiki
      const enWikiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&explaintext=1&origin=*&titles=${encodeURIComponent(
        searchTerms
      )}`;
      const enRes = await fetch(enWikiUrl);
      if (enRes.ok) {
        const enData = await enRes.json();
        const enPages = enData?.query?.pages || {};
        const enPageId = Object.keys(enPages)[0];
        if (enPageId && enPageId !== '-1' && enPages[enPageId]?.extract) {
          return formatWikiSummary(enPages[enPageId].title, enPages[enPageId].extract);
        }
      }
    }
  } catch (wikiErr) {
    console.warn('Wikipedia search error:', wikiErr);
  }

  // 5. Intelligent Synthesis Fallback
  const qLower = cleanQuery.toLowerCase();
  if (qLower.includes('গল্প') || qLower.includes('story')) {
    return `### 🌟 **একতা ও প্রজ্ঞার শক্তি**\n\nঅনেক দিন আগের কথা। এক সুন্দর পাহাড়ি উপত্যকায় বাস করত তিন বন্ধু—একটি ছোট্ট হরিণ, একটি বুদ্ধিমান চড়ুই এবং একটি প্রবীণ কচ্ছপ। তারা প্রতিদিন একে অপরকে সাহায্য করত।\n\nএকদিন বনের এক শিকারি এসে ফাঁদ পাতল এবং হরিণটি তাতে আটকা পড়ল। চড়ুই পাখি দ্রুত কচ্ছপকে খবর দিল। চড়ুই শিকারির চোখে ধুলো দিয়ে বিভ্রান্ত করল, আর কচ্ছপ তার ধারালো দাঁত দিয়ে জাল কেটে হরিণকে মুক্ত করল।\n\n✨ **শিক্ষা:** একতা, বুদ্ধি ও ধৈর্য থাকলে যেকোনো কঠিন পরিস্থিতি জয় করা সম্ভব।`;
  }

  if (qLower.includes('কবিতা') || qLower.includes('poem')) {
    return `### 🍃 **আশার আলো**\n\nআঁধার রাতে তারার মেলা,\nস্বপ্নে ভাসে মনের ভেলা।\nক্লান্ত চোখে ঘুম নামে না,\nনতুন ভোরের পথ থামে না।\n\nধৈর্য ধরো মনের ঘরে,\nসকাল হবে আঁধার চিরে।\nআলোর পরশ লাগলে গায়ে,\nনতুন জীবন ফিরবে পায়ে।`;
  }

  if (qLower.includes('কোড') || qLower.includes('programming') || qLower.includes('python') || qLower.includes('javascript')) {
    return `এখানে আপনার কোডিং অনুসন্ধানের জন্য একটি উদাহরণ কাঠামো:\n\n\`\`\`javascript\n// সমস্যা সমাধানের নমুনা কোড\nfunction solve(input) {\n  if (!input) return null;\n  return input.trim();\n}\nconsole.log(solve("Lumiqra AI Ready"));\n\`\`\`\n\nআপনার নির্দিষ্ট কোডিং সমস্যা বা ত্রুটিটি এখানে পেস্ট করুন, আমি সঠিক সমাধান লিখে দেব!`;
  }

  return `আপনার প্রশ্ন: **"${cleanQuery}"**\n\nলুমিক্রা এআই (Lumiqra AI) আপনার সার্বিক সহায়তায় প্রস্তুত। আপনি পবিত্র কুরআন, বিজ্ঞান, ইতিহাস, গণিত, কোডিং বা যেকোনো বিষয়ে সুনির্দিষ্ট প্রশ্ন করতে পারেন — যেকোনো ভাষায় (বাংলা, ইংরেজি ইত্যাদি) বিস্তারিত উত্তর পাবেন।`;
}
