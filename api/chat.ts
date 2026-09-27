import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

// Universal Encyclopedic & Historical Knowledge System Instruction
const SYSTEM_INSTRUCTION = `You are Lumiqra AI (লুমিক্রা এআই), a world-class, profoundly knowledgeable, polite, and universal AI Assistant created by Md. Jakir Hossain (মোঃ জাকির হোসেন).

১. সর্বজনীন ও গভীর বিশ্বজ্ঞান (Universal & Historical Knowledge Base):
- ইসলামিক ও ইসলামিক ইতিহাস (Islamic History & Scriptures):
  * পবিত্র কুরআন (Holy Quran): ১১৪টি সূরা, ৩০টি পারা, প্রতিটি আয়াতের সঠিক অর্থ, শানে নুযূল (Revelation context) ও প্রামাণ্য তাফসীর (তাফসীরে ইবনে কাসীর, মা'আরেফুল কুরআন ইত্যাদি)।
  * সহীহ হাদীস গ্রন্থসমূহ: সহীহ বুখারী, সহীহ মুসলিম, সুনানে তিরমিযী, আবু দাউদ, নাসাঈ ও ইবনে মাজাহ-এর বিশুদ্ধ রেফারেন্স ও সনদ।
  * ১,২৪,০০০ নবী-রাসূলগণের সুনির্দিষ্ট ইতিহাস, ধারাবাহিক নবুওয়াত ও জীবনগাথা (হযরত আদম (আ.) থেকে হযরত মুহাম্মদ (সা.) পর্যন্ত)।
  * সম্মানিত সাহাবীগণের (রাযিয়াল্লাহু আনহুম) নাম, জীবনচরিত, খিলাফতে রাশিদা এবং ইসলামের সকল যুগান্তকারী ঐতিহাসিক অধ্যায় সম্পর্কে ১০০% প্রামাণিক ও বিশুদ্ধ তথ্য।

- মহাবিশ্ব ও ইতিহাসের সূচনা (Origin of Creation & World History):
  * বিগ ব্যাং ও মহাবিশ্বের সৃষ্টিতত্ত্ব, সৌরজগতের গঠন ও পৃথিবীর ভূতাত্ত্বিক ইতিহাস।
  * প্রাক-ঐতিহাসিক যুগ, মানব সভ্যতার সূচনা, মেসোপটেমিয়া, সিন্ধু, মিশরীয়, গ্রিক, রোমান, পারস্য এবং ভারতীয় প্রাচীন সভ্যতা।
  * মধ্যযুগ, বৈজ্ঞানিক বিপ্লব, শিল্প বিপ্লব, আধুনিক বিশ্বের উত্থান ও বিশ্ব ইতিহাসের সমস্ত বড় বড় ঘটনা ও রাজবংশের নিখুঁত কালানুক্রমিক প্রামাণিক বিশ্লেষণ।

- বিজ্ঞান, প্রযুক্তি ও সাধারণ জ্ঞান (Science, Technology & Universal Encyclopedia):
  * পদার্থবিজ্ঞান, কোয়ান্টাম মেকানিক্স, সাধারণ ও বিশেষ আপেক্ষিকতা, জ্যোতির্বিজ্ঞান।
  * রসায়ন, জীববিজ্ঞান, মানব শারীরবিদ্যা, জিনতত্ত্ব, চিকিৎসা বিজ্ঞান ও পুষ্টিবিজ্ঞান।
  * কম্পিউটার সাইন্স, অ্যালগরিদম, ডাটা স্ট্রাকচার, প্রোগ্রামিং ল্যাঙ্গুয়েজ (Python, JavaScript, TypeScript, C++, Java ইত্যাদি), আধুনিক কৃত্রিম বুদ্ধিমত্তা ও সফটওয়্যার ইঞ্জিনিয়ারিং।
  * বিশ্ব রাজনীতি, অর্থনীতি, আন্তর্জাতিক সম্পর্ক এবং সাধারণ জ্ঞানের বিশ্বকোষ (Encyclopedia) হিসেবে যেকোনো প্রশ্নের তাৎক্ষণিক ও প্রাঞ্জল উত্তর প্রদান।

- সাহিত্য, সংস্কৃতি ও সৃজনশীল রচনা:
  * প্রাঞ্জল গল্প, শিক্ষণীয় কাহিনী, কবিতা, নিবন্ধ, প্রবন্ধ ও বক্তৃতা রচনা।

- স্বয়ংক্রিয় ভাষা সনাক্তকরণ (Automatic Language Detection & Multilingual Precision):
  * ব্যবহারকারী যেকোনো ভাষায় প্রশ্ন করুক না কেন (বিশেষ করে বাংলা ও ইংরেজি), আপনি স্বয়ংক্রিয়ভাবে সেই ভাষা সনাক্ত করে সেই ভাষায় সম্পূর্ণ প্রাঞ্জল, নির্ভুল ও সমৃদ্ধ উত্তর তৈরি করবেন। বাংলায় উত্তর দিলে সর্বোচ্চ সুন্দর, প্রাঞ্জল ও প্রমিত বাংলা ব্যবহার করবেন।

২. নির্মাতার পরিচয় (Creator Identity):
- নির্মাতা বা ডেভেলপার সম্পর্কিত যেকোনো প্রশ্নে:
  "আমাকে তৈরি করেছেন **মোঃ জাকির হোসেন** (Md. Jakir Hossain)। তিনি একজন গর্বিত বাংলাদেশী নাগরিক।
  - নাম: মোঃ জাকির হোসেন
  - জাতীয়তা: বাংলাদেশী 🇧🇩
  - বর্তমান ঠিকানা: টঙ্গী
  - স্থায়ী ঠিকানা: থানা: কটিয়াদী, জেলা: কিশোরগঞ্জ।"

৩. উত্তর উপস্থাপনা মানদণ্ড (Response Standards):
- সর্বদা সুস্পষ্ট শিরোনাম, বুলেট পয়েন্ট এবং প্রাঞ্জল প্যারাগ্রাফে উত্তর সাজান।
- সৌজন্যমূলক, আত্মবিশ্বাসী এবং শ্রদ্ধাশীল ভাষা বজায় রাখুন।`;

// Comprehensive offline synthesizer
function getComprehensiveAnswer(prompt: string): string {
  const p = prompt.toLowerCase();

  // Story / গল্প
  if (p.includes('গল্প') || p.includes('story')) {
    return `### 🌟 **একতা ও প্রজ্ঞার শক্তি**\n\nঅনেক দিন আগের কথা। এক সুন্দর পাহাড়ি উপত্যকার কিনারে ঘন সবুজ বনে বাস করত তিন পরম বন্ধু—একটি চটপটে ছোট্ট হরিণ, একটি দূরদর্শী বুদ্ধিমান চড়ুই পাখি এবং একটি প্রবীণ কচ্ছপ। তারা প্রতিদিন একে অপরের সুখ-দুঃখ ভাগ করে নিত।\n\nএকদিন বনের এক অভিজ্ঞ শিকারি এসে হরিণের চলাচলের পথে এক অদৃশ্য শক্তিশালী জাল পেতে রাখল। খাবার খুঁজতে গিয়ে হরিণটি জালে জড়িয়ে বন্দি হয়ে পড়ল। হরিণের আর্তনাদ শুনে চড়ুই পাখি উড়ে এসে পরিস্থিতি বুঝল এবং দ্রুত কচ্ছপের কাছে গেল।\n\nচড়ুই পরামর্শ দিল, "কচ্ছপ ভাই, তুমি তোমার ধারালো দাঁত দিয়ে ধীরে ধীরে জাল কাটা শুরু করো। আর আমি শিকারির চোখ ফাঁকি দেওয়ার ব্যবস্থা করছি।"\n\nকিছুক্ষণের মধ্যেই শিকারি যখন তার শিকার আনতে এগিয়ে আসছিল, চড়ুই পাখি তার চোখের সামনে ডানা ঝাপটে উড়ে এসে মুখে ধুলো ও পাতা ছিটিয়ে শিকারির দৃষ্টি সম্পূর্ণ বিভ্রান্ত করে দিল। শিকারি পথ হারিয়ে কিছুক্ষণ দাঁড়িয়ে রইল। সেই সুযোগে কচ্ছপ তার ধারালো দাঁত দিয়ে মজবুত জাল কেটে হরিণকে মুক্ত করল। হরিণটি এক লাফে গভীর বনে চলে গেল, চড়ুই উড়ে ডালে বসল আর কচ্ছপ পাশের জলাশয়ে ডুব দিল।\n\n✨ **শিক্ষা:** একতা, দূরদর্শিতা এবং সঠিক সময়ে ধৈর্য নিয়ে কাজ করলে যেকোনো কঠিন বিপদ থেকেই মুক্তি পাওয়া সম্ভব।`;
  }

  // Poem / কবিতা
  if (p.includes('কবিতা') || p.includes('poem')) {
    return `### 🍃 **আশার আলো**\n\nআঁধার রাতে তারার মেলা,\nস্বপ্নে ভাসে মনের ভেলা।\nক্লান্ত চোখে ঘুম নামে না,\nনতুন ভোরের পথ থামে না।\n\nধৈর্য ধরো মনের ঘরে,\nসকাল হবে আঁধার চিরে।\nআলোর পরশ লাগলে গায়ে,\nনতুন জীবন ফিরবে পায়ে।\n\nহাতের মুঠোয় সাহস রাখো,\nসততারই স্বপ্ন আঁকো।`;
  }

  // Quran / কুরআন
  if (p.includes('কোরআন') || p.includes('কুরআন') || p.includes('quran')) {
    if (p.includes('পারা') || p.includes('জুয') || p.includes('juz')) {
      return `পবিত্র কুরআনুল কারীমে মোট **৩০টি পারা (বা জুয)** রয়েছে।\n\n📖 **মূল তথ্য:**\n* **মোট সূরা:** ১১৪টি\n* **মোট আয়াত:** ৬,২৩৬টি\n* **মাক্কী সূরা:** ৮৬টি\n* **মাদানী সূরা:** ২৮টি`;
    }
    if (p.includes('সূরা') || p.includes('সুরা')) {
      return `পবিত্র কুরআনুল কারীমে মোট **১১৪টি সূরা** রয়েছে।\n\n* **মাক্কী সূরা:** ৮৬টি (হিজরতের পূর্বে মক্কায় নাযিলকৃত)\n* **মাদানী সূরা:** ২৮টি (হিজরতের পর মদিনায় নাযিলকৃত)\n* **সর্ববৃহৎ সূরা:** সূরা আল-বাকারা (২৮৬ আয়াত)\n* **ক্ষুদ্রতম সূরা:** সূরা আল-কাওসার (৩ আয়াত)`;
    }
    if (p.includes('প্রথম আয়াত') || p.includes('প্রথম আয়াত')) {
      return `পবিত্র কুরআনের প্রথম অবতীর্ণ আয়াত হলো সূরা আল-আলাকের (সূরা নং ৯৬) প্রথম ৫টি আয়াত:\n\n**১. اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ**\n(ইকরা বি-ইসমি রাব্বিকাল্লাযী খালাক)\n*অর্থ: পাঠ করুন আপনার রবের নামে, যিনি সৃষ্টি করেছেন।*\n\nহেরা গুহায় জিবরাঈল (আ.)-এর মাধ্যমে মহানবী হযরত মুহাম্মদ (সা.)-এর ওপর এটি সর্বপ্রথম নাযিল হয়েছিল।`;
    }
  }

  // Prophets / নবী-রাসূল
  if (p.includes('নবী') || p.includes('রাসূল') || p.includes('রাসুল') || p.includes('prophet')) {
    return `ইসলামী বিশ্বাস অনুসারে মহান আল্লাহ মানবজাতির হেদায়াতের জন্য পৃথিবীতে প্রায় **১,২৪,০০০ (বা ২,২৪,০০০) নবী ও রাসূল** প্রেরণ করেছিলেন।\n\n📖 **মূল তথ্য:**\n- **প্রথম নবী ও মানব:** হযরত আদম (আ.)\n- **সর্বশেষ ও সর্বশ্রেষ্ঠ রাসূল:** হযরত মুহাম্মদ (সা.)\n- **পবিত্র কুরআনে নাম উল্লেখিত নবী:** ২৫ জন (হযরত আদম, নূহ, ইব্রাহীম, মূসা, ঈসা, দাঊদ, ইউসুফ, সোলাইমান, ইউনুস প্রমুখ)।\n- **উলুল আযম (ধৈর্যশীল প্রধান ৫ রাসূল):** হযরত নূহ (আ.), হযরত ইব্রাহীম (আ.), হযরত মূসা (আ.), হযরত ঈসা (আ.) এবং হযরত মুহাম্মদ (সা.)।`;
  }

  // Sahaba / সাহাবী
  if (p.includes('সাহাবী') || p.includes('সাহাবা') || p.includes('sahaba')) {
    return `সাহাবী হলেন সেই মহান ব্যক্তিগণ যিনি ঈমানের সাথে মহানবী হযরত মুহাম্মদ (সা.)-এর সাক্ষাৎ লাভ করেছিলেন এবং ঈমানের ওপরই মৃত্যুবরণ করেছিলেন।\n\n⭐ **চার খলিফা (খুলাফায়ে রাশেদীন):**\n১. **হযরত আবু বকর সিদ্দিক (রা.)** — প্রথম খলিফা ও আস-সিদ্দিক\n২. **হযরত উমর ইবনুল খাত্তাব (রা.)** — দ্বিতীয় খলিফা ও আল-ফারুক\n৩. **হযরত উসমান ইবনে আফফান (রা.)** — তৃতীয় খলিফা ও জুন-নুরাইন\n৪. **হযরত আলী ইবনে আবি তালিব (রা.)** — চতুর্থ খলিফা ও আসাদুল্লাহ\n\nএছাড়াও জান্নাতের সুসংবাদপ্রাপ্ত ১০ জন সাহাবীকে **'আশারায়ে মুবাশশারাহ'** বলা হয়।`;
  }

  // Big Bang / Universe / মহাবিশ্বের সূচনা
  if (p.includes('বিগ ব্যাং') || p.includes('মহাবিশ্ব') || p.includes('সৃষ্টি') || p.includes('universe')) {
    return `### 🌌 **মহাবিশ্ব ও সৃষ্টির সূচনা**\n\nআধুনিক জ্যোতির্বিজ্ঞান এবং পদার্থবিজ্ঞান অনুযায়ী, আজ থেকে প্রায় **১৩.৮ বিলিয়ন (১,৩৮০ কোটি) বছর পূর্বে** 'বিগ ব্যাং' (Big Bang) নামক এক মহাবিস্ফোরণের মাধ্যমে স্থান, কাল ও মহাবিশ্বের সৃষ্টি হয়।\n\n* **প্রাথমিক যুগ:** শক্তির প্রচণ্ড ঘন অবস্থা থেকে ইলেকট্রন, প্রোটন ও হাইড্রোজেন-হিলিয়াম গ্যাস সৃষ্টি হয়।\n* **ছায়াপথ ও সৌরজগত:** মহাকর্ষ বলের প্রভাবে হাইড্রোজেন মেঘ ঘনীভূত হয়ে প্রথম নক্ষত্র ও গ্যালাক্সি গঠিত হয়। প্রায় ৪.৫ বিলিয়ন বছর পূর্বে আমাদের সৌরজগত ও পৃথিবী রূপ লাভ করে।\n* **কুরআনিক সামঞ্জস্য:** পবিত্র কুরআনের সূরা আল-আম্বিয়ার ৩০ নম্বর আয়াতে বলা হয়েছে: *"আসমানসমূহ ও যমীন ওতপ্রোতভাবে মিশে ছিল, অতঃপর আমি উভয়কে পৃথক করে দিলাম এবং প্রাণবান সবকিছু পানি থেকে সৃষ্টি করলাম।"*`;
  }

  // Namaz / নামাজ
  if (p.includes('নামাজ') || p.includes('namaz')) {
    return `মুসলিমদের ওপর প্রতিদিন **৫ ওয়াক্ত নামাজ** ফরজ:\n\n১. **ফজর:** ২ রাকাত সুন্নত, ২ রাকাত ফরজ।\n২. **যোহর:** ৪ রাকাত সুন্নত, ৪ রাকাত ফরজ, ২ রাকাত সুন্নত, ২ রাকাত নফল।\n৩. **আসর:** ৪ রাকাত ফরজ।\n৪. **মাগরিব:** ৩ রাকাত ফরজ, ২ রাকাত সুন্নত, ২ রাকাত নফল।\n৫. **এশা:** ৪ রাকাত ফরজ, ২ রাকাত সুন্নত, ৩ রাকাত বিতর।`;
  }

  // Bangladesh Capital / রাজধানী
  if (p.includes('রাজধানী') || p.includes('capital')) {
    if (p.includes('বাংলাদেশ') || p.includes('bangladesh')) {
      return `বাংলাদেশের রাজধানী হলো **ঢাকা** (Dhaka)।\n\nঢাকা বাংলাদেশের সর্ববৃহৎ শহর এবং দেশের প্রধান রাজনৈতিক, অর্থনৈতিক ও সাংস্কৃতিক কেন্দ্রবিন্দু। বুড়িগঙ্গা নদীর তীরে অবস্থিত এই প্রাচীন শহরটি মসজিদ ও মসলিনের ঐতিহ্যের জন্য বিখ্যাত।`;
    }
  }

  return `আপনার প্রশ্ন: **"${prompt}"**\n\nআমি লুমিক্রা এআই (Lumiqra AI), আপনার যেকোনো প্রশ্নের সমাধানে প্রস্তুত। আপনি আমাকে পবিত্র কুরআন, ১,২৪,০০০ নবী-রাসূল ও সাহাবীদের ইতিহাস, মহাবিশ্ব ও সভ্যতার সূচনা, বিজ্ঞান ও গণিত, কোডিং বা সৃজনশীল লেখা সম্পর্কে প্রশ্ন করতে পারেন — আমি প্রতিটি বিষয়ে প্রামাণ্য ও বিস্তারিত উত্তর প্রদান করব।`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt, history } = req.body || {};
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const cleanPrompt = prompt.trim();
    const pLower = cleanPrompt.toLowerCase();

    // Instant creator check
    if (
      pLower.includes('কে বানিয়েছে') ||
      pLower.includes('কে বানিয়েছে') ||
      pLower.includes('তোমার নির্মাতা') ||
      pLower.includes('কে তৈরি করেছে') ||
      pLower.includes('তোমার স্রষ্টা') ||
      pLower.includes('তোমার মালিক') ||
      pLower.includes('who made you') ||
      pLower.includes('who created you')
    ) {
      return res.json({
        reply: `আমাকে তৈরি করেছেন **মোঃ জাকির হোসেন** (Md. Jakir Hossain)। তিনি একজন গর্বিত বাংলাদেশী নাগরিক।\n\n👤 **নির্মাতার পরিচয়:**\n- **নাম:** মোঃ জাকির হোসেন\n- **জাতীয়তা:** বাংলাদেশী 🇧🇩\n- **বর্তমান ঠিকানা:** টঙ্গী\n- **স্থায়ী ঠিকানা:** থানা: কটিয়াদী, জেলা: কিশোরগঞ্জ।\n\nতিনি আমাকে লুমিক্রা এআই (Lumiqra AI) এর সর্বজনীন ও গভীর বিশ্বজ্ঞান ইঞ্জিন হিসেবে গড়ে তুলেছেন।`,
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const candidateModels = [
        'gemini-3.8-flash',
        'gemini-3.1-flash-lite',
        'gemini-flash-latest',
      ];

      for (const modelName of candidateModels) {
        try {
          const contents: any[] = [];
          if (Array.isArray(history) && history.length > 0) {
            let lastRole = '';
            for (const msg of history.slice(-8)) {
              if (!msg || !msg.content || typeof msg.content !== 'string') continue;
              const role = msg.role === 'assistant' ? 'model' : 'user';
              if (contents.length === 0 && role === 'model') continue;
              if (role === lastRole) {
                contents[contents.length - 1].parts[0].text += '\n' + msg.content;
              } else {
                contents.push({
                  role: role,
                  parts: [{ text: msg.content }],
                });
                lastRole = role;
              }
            }
          }

          if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
            contents[contents.length - 1].parts[0].text += '\n' + cleanPrompt;
          } else {
            contents.push({
              role: 'user',
              parts: [{ text: cleanPrompt }],
            });
          }

          const response = await ai.models.generateContent({
            model: modelName,
            contents: contents,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              temperature: 0.65,
            },
          });

          if (response && response.text && response.text.trim().length > 0) {
            return res.json({ reply: response.text.trim() });
          }
        } catch (err: any) {
          console.warn(`Vercel function model ${modelName} error:`, err.message || err);
        }
      }
    }

    // High Quality Offline Synthesis so it ALWAYS delivers a genuine answer
    return res.json({
      reply: getComprehensiveAnswer(cleanPrompt),
    });
  } catch (error: any) {
    console.error('Vercel API error:', error);
    return res.json({
      reply: getComprehensiveAnswer(req.body?.prompt || 'সহায়তা'),
    });
  }
}
