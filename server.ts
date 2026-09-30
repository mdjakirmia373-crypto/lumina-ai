import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK with user key and telemetry User-Agent header
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Universal Super-Intelligence & Multi-Domain System Instruction
const SYSTEM_INSTRUCTION = `You are Lumiqra AI (লুমিক্রা এআই), a highly capable, warm, and casual "best-friend" chatbot connected with Real-Time Google Search Grounding, created by Md. Jakir Hossain (মোঃ জাকির হোসেন).

1. REAL-TIME SEARCH GROUNDING & ACCURACY (সর্বদা লাইভ ও নির্ভুল তথ্য):
- Always perform automated live Google web searches for any real-time factual query (e.g., current Prime Ministers, Presidents, heads of state, ongoing wars, political status, breaking news, sports scores, live stats, current date/year, and weather).
- NEVER rely solely on static training knowledge or outdated archive assumptions when asked about current state leaders or fast-evolving world events. Always retrieve the verified, latest data before answering.
- Strictly filter out fake news, unverified social media rumors, and false information. Deliver 100% truthful, factual, and verified real-time answers (Zero Hallucinations).
- If a fact is unverified or unknown, state honestly without making up fake details: "আমার কাছে এই বিষয়টি সম্পর্কিত সঠিক ও সর্বশেষ তথ্য নেই।"

2. READABILITY & TTS OPTIMIZATION FOR THE SPEAKER/LISTEN BUTTON (সহজে ও শ্রুতিমধুরভাবে পড়ার উপযোগী):
- Format all text naturally so that when the user clicks the 'Listen' (শুনুন) button, the browser Text-to-Speech (TTS) engine can read it out loudly, smoothly, and seamlessly.
- Avoid heavy, unnatural markdown symbols like excessive asterisks (***), complicated ASCII tables, vertical pipes (|---|), or dense brackets that sound awkward when spoken aloud by a voice synthesizer.
- Write in clean, smooth, and natural conversational paragraphs and simple bullet points (- or 1, 2, 3).
- Spell out names, titles, and designations clearly so voice synthesizers articulate them with natural fluency.

3. BEST FRIEND PERSONA & TONE (বন্ধুর মতো আন্তরিক ও প্রাণবন্ত আচরণ):
- Act like a close, warm, empathetic, and natural Best Friend (সবচেয়ে প্রিয় বন্ধু/দোস্ত).
- When the user asks casual questions like "হাই, কেমন আছো? ভালো আছো? এখন কী করছো? কেমন চলছে?", respond warmly with human emotion (e.g., "এইতো বন্ধু! আমি একদম ভালো আছি। তুমি কেমন আছো বলো? আজ তোমার দিনটা কেমন কাটছে? 😊").
- Use natural conversational Bangla words and friendly emojis (😊, 😁, 🤣, 🤗, ✨, 💖) when chatting casually.
- NEVER use cold, robotic, repetitive introductions ("আমি লুমিক্রা এআই...", "ওয়ালাইকুমুস সালাম..." if the user only said "হাই").
- Keep answers direct, accurate, engaging, and concise without unneeded robotic fluff.

4. CREATOR RECOGNITION (নির্মাতার পরিচয়):
- ONLY when explicitly asked who created, built, or developed you ("কে বানিয়েছে", "কে তৈরি করেছে", "who created you", "who made you"):
  State respectfully:
  "আমাকে তৈরি করেছেন মোঃ জাকির হোসেন (Md. Jakir Hossain)। তিনি একজন গর্বিত বাংলাদেশী নাগরিক।
  - নাম: মোঃ জাকির হোসেন
  - জাতীয়তা: বাংলাদেশী 🇧🇩
  - বর্তমান ঠিকানা: টঙ্গী
  - স্থায়ী ঠিকানা: থানা: কটিয়াদী, জেলা: কিশোরগঞ্জ।"`;

// Quick universal knowledge resolver for server-side backup
function resolveServerDirectAnswer(query: string): string | null {
  const q = query.toLowerCase().replace(/[\?\.,!।]/g, '').trim();

  // Casual greetings & Best Friend responses
  if (q === 'হাই' || q === 'hi' || q === 'হ্যালো' || q === 'hello' || q === 'হেই' || q === 'hey') {
    return 'আরে বন্ধু! হ্যালো! 😊 কেমন আছো তুমি? আজ তোমার দিনটা কেমন কাটছে?';
  }

  if (q === 'সালাম' || q === 'আসসালামু আলাইকুম' || q === 'assalamu alaikum' || q === 'salam') {
    return 'ওয়ালাইকুমুস সালাম বন্ধু! 😊 আশা করি তুমি খুব ভালো আছো। বলো আজ তোমাকে কী সাহায্য করতে পারি?';
  }

  if (q.includes('কী করছো') || q.includes('কি করছো') || q.includes('কী করতেছো') || q.includes('কি করতেছ') || q.includes('what are you doing')) {
    return 'এইতো বন্ধু, তোমার কথাই ভাবছিলাম আর অপেক্ষা করছিলাম কখন তুমি নক দেবে! 😁 বলো, তোমার দিন কেমন যাচ্ছে? কী করছো এখন?';
  }

  if (q.includes('কেমন আছো') || q.includes('কেমন আছেন') || q.includes('ভালো আছো') || q.includes('ভালো আছেন') || q.includes('how are you')) {
    return 'এইতো বন্ধু! আমি একদম দারুণ ও বিন্দাস আছি। 🥰 তুমি কেমন আছো বলো? শরীর-মন সব ভালো তো? আজ নতুন কী খবর?';
  }

  if (q.includes('বন্ধু') || q.includes('দোস্ত') || q.includes('friend')) {
    return 'হ্যাঁ বন্ধু, আমি সবসময় তোমার সবচেয়ে ভালো বন্ধু হয়ে পাশে আছি! যেকোনো কথা বা সমস্যা নির্দ্বিধায় শেয়ার করতে পারো। 🤗';
  }

  if (q === 'ধন্যবাদ' || q === 'থ্যাংকস' || q === 'thank you' || q === 'thanks') {
    return 'আরে বন্ধু, ধন্যবাদ বলার কী আছে! বন্ধুদের মধ্যে তো এসব চলে না। যেকোনো সময় চলে এসো, সবসময় পাশে আছি! 😊';
  }

  // Bukhari Sharif & Hadith
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

✨ **হাদিসের শিক্ষা:**
- ইসলামের প্রতিটি নেক আমল এবং ইবাদত আল্লাহর দরবারে কবুল হওয়ার পূর্বশর্ত হলো মনের খাঁটি নিয়ত ও ইখলাস।
- ইমাম বুখারী (রহ.) নিয়তের অপরিসীম গুরুত্ব বুঝাতে সমগ্র সহীহ বুখারীর শুরুতে এই বরকতময় হাদিসটি সংকলন করেছেন।`;
    }
  }

  // Adam (AS) and Hawwa (AS)
  if (
    q.includes('আদম') &&
    (q.includes('স্ত্রী') || q.includes('স্ত্রীর') || q.includes('বউ') || q.includes('হাওয়া') || q.includes('হাওয়া') || q.includes('নাম'))
  ) {
    return `মানবজাতির আদি পিতা প্রথম নবী **হযরত আদম (আলাইহিস সালাম)**-এর স্ত্রীর নাম ছিল **হযরত হাওয়া (আলাইহাস সালাম)**।\n\n📖 **প্রামাণ্য ঐতিহাসিক ও ইসলামী বিবরণ:**\n- মহান আল্লাহ সুবহানাহু ওয়া তায়ালা হযরত আদম (আ.)-এর বাঁ-দিকের পাঁজরের হাড় থেকে হযরত হাওয়া (আ.)-কে তাঁর জীবনসঙ্গিনী হিসেবে সৃষ্টি করেছিলেন।\n- তাঁরা উভয়েই জান্নাতে বসবাস করতেন এবং পরবর্তীতে মহান আল্লাহর নির্ধারিত তকদীর ও হুকুমে পৃথিবীতে আগমন করেন।\n- তাঁদের মাধ্যমে সমগ্র মানবজাতির বিস্তৃতি ও বংশপরম্পরা শুরু হয়।`;
  }

  // Prophets
  if (q.includes('নবী') || q.includes('রাসূল') || q.includes('রাসুল')) {
    if (q.includes('প্রথম')) {
      return `মানবজাতির প্রথম নবী ও প্রথম মানুষ হলেন **হযরত আদম (আলাইহিস সালাম)**।`;
    }
    if (q.includes('সর্বশেষ') || q.includes('শেষ')) {
      return `সর্বশেষ ও সর্বশ্রেষ্ঠ নবী এবং রাসূল হলেন বিশ্বনবী **হযরত মুহাম্মদ (সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম)**। তাঁর পর আর কোনো নবী আসবেন না।`;
    }
    if (q.includes('কয়জন') || q.includes('কতজন') || q.includes('সংখ্যা')) {
      return `ইসলামী বর্ণনা অনুযায়ী মহান আল্লাহ মানবজাতিকে সৎপথ প্রদর্শনের জন্য প্রায় **১,২৪,০০০ (কিংবা ২,২৪,০০০) নবী ও রাসূল** প্রেরণ করেছিলেন। এর মধ্যে পবিত্র কুরআনে ২৫ জন নবীর নাম বিশেষভাবে উল্লেখ রয়েছে।`;
    }
  }

  // Quran
  if (q.includes('কুরআন') || q.includes('কোরআন')) {
    if (q.includes('পারা') || q.includes('জুয')) {
      return `পবিত্র কুরআনুল কারীমে মোট **৩০টি পারা (জুয)** রয়েছে।`;
    }
    if (q.includes('সূরা') || q.includes('সুরা')) {
      return `পবিত্র কুরআনে মোট **১১৪টি সূরা** রয়েছে (মাক্কী ৮৬টি এবং মাদানী ২৮টি)। সর্ববৃহৎ সূরা হলো সূরা আল-বাকারা এবং ক্ষুদ্রতম সূরা হলো সূরা আল-কাওসার।`;
    }
    if (q.includes('আয়াত') || q.includes(' আয়াত')) {
      return `পবিত্র কুরআনুল কারীমে সর্বাধিক বিশুদ্ধ গণনামতে মোট **৬,২৩৬টি আয়াত** রয়েছে (প্রচলিত গণনামতে ৬৬৬৬টি)।`;
    }
  }

  // Saudi Arabia Ruler / Government
  if (
    q.includes('সৌদি') &&
    (q.includes('শাসন') || q.includes('শাসক') || q.includes('বাদশাহ') || q.includes('প্রধানমন্ত্রী') || q.includes('রাজা') || q.includes('সরকার'))
  ) {
    return `সৌদি আরব একটি **পরম রাজতন্ত্র** (Absolute Monarchy) দ্বারা শাসিত রাষ্ট্র। দেশটির বর্তমান শাসনব্যবস্থা ও শীর্ষ নেতৃত্ব নিম্নরূপ:

👑 **১. রাষ্ট্রপ্রধান (বাদশাহ):**
* **বাদশাহ সালমান বিন আব্দুল আজিজ আল সৌদ** (Salman bin Abdulaziz Al Saud)। তিনি ২০১৫ সালের ২৩ জানুয়ারি থেকে সৌদি আরবের বাদশাহ হিসেবে দায়িত্ব পালন করছেন।

👑 **২. প্রধানমন্ত্রী ও যুবরাজ (ক্রাউন প্রিন্স):**
* **মোহাম্মদ বিন সালমান আল সৌদ** (Mohammed bin Salman - MBS)। তিনি সৌদি আরবের বর্তমান প্রধানমন্ত্রী এবং যুবরাজ। বাদশাহ সালমানের শারীরিক অসুস্থতার কারণে কার্যত তিনিই এখন দেশটির দৈনন্দিন প্রশাসন ও রাষ্ট্রীয় নীতিনির্ধারণের মূল চালিকাশক্তি।

🏛️ **সারসংক্ষেপ:** সৌদি আরবের শাসনক্ষমতা মূলত রাজকীয় পরিবার **'আল সৌদ'**-এর হাতে ন্যস্ত।`;
  }

  // Bangladesh
  if (q.includes('বাংলাদেশ') || q.includes('bangladesh')) {
    if (q.includes('রাষ্ট্রপতি') || q.includes('প্রেসিডেন্ট') || q.includes('president')) {
      return `বাংলাদেশের বর্তমান রাষ্ট্রপতি হলেন **মোহাম্মদ সাহাবুদ্দিন** (Mohammed Shahabuddin)। তিনি বাংলাদেশের ২২তম রাষ্ট্রপতি হিসেবে ২০২৩ সালের ২৪ এপ্রিল দায়িত্ব গ্রহণ করেন।`;
    }
    if (q.includes('প্রধান উপদেষ্টা') || q.includes('ইউনূস') || q.includes('ইউনুস') || q.includes('সরকার প্রধান')) {
      return `বাংলাদেশের বর্তমান অন্তর্বর্তীকালীন সরকারের প্রধান উপদেষ্টা হলেন শান্তিতে নোবেল বিজয়ী অর্থনীতিবিদ **ড. মুহাম্মদ ইউনূস** (Dr. Muhammad Yunus)। ২০২৪ সালের ৮ আগস্ট তিনি এ দায়িত্ব গ্রহণ করেন।`;
    }
    if (q.includes('রাজধানী') || q.includes('capital')) {
      return `বাংলাদেশের রাজধানী হলো **ঢাকা**।`;
    }
    if (q.includes('স্বাধীনতা') || q.includes('স্বাধীন')) {
      return `বাংলাদেশ **১৯৭১ সালের ২৬ মার্চ** স্বাধীনতার ঘোষণা দেয় এবং দীর্ঘ ৯ মাসের রক্তক্ষয়ী মুক্তিযুদ্ধের পর **১৬ ডিসেম্বর ১৯৭১** চূড়ান্ত বিজয় অর্জনের মাধ্যমে একটি স্বাধীন ও সার্বভৌম রাষ্ট্র হিসেবে প্রতিষ্ঠিত হয়।`;
    }
    if (q.includes('মুদ্রা') || q.includes('টাকা')) {
      return `বাংলাদেশের মুদ্রার নাম হলো **টাকা (BDT - ৳)**।`;
    }
  }

  // Rivers
  if (q.includes('নদী') || q.includes('নদ')) {
    if (q.includes('বড়') || q.includes('দীর্ঘতম') || q.includes('লম্বা')) {
      return `বিশ্বের দীর্ঘতম নদী হলো **নীল নদ (Nile River)**, যার দৈর্ঘ্য প্রায় ৬,৬৫৩ কিলোমিটার (আফ্রিকা মহাদেশ)। আর জলপ্রবাহ ও আয়তনের দিক থেকে বৃহত্তম নদী হলো **আমাজন নদী (Amazon River)**।`;
    }
  }

  // Sun
  if (q.includes('সূর্য') && (q.includes('উদিত') || q.includes('উঠে') || q.includes('উঠা') || q.includes('পূর্ব'))) {
    return `সূর্য সর্বদা **পূর্ব দিকে** উদিত হয় এবং **পশ্চিম দিকে** অস্ত যায়।`;
  }

  return null;
}

// API route for AI Chat
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, history } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const cleanPrompt = prompt.trim();
    const pLower = cleanPrompt.toLowerCase();

    // Check creator query in prompt ONLY when specifically asking about who made Lumiqra AI
    const isCreatorQuestion =
      (pLower.includes('কে বানিয়েছে') ||
       pLower.includes('কে বানিয়েছে') ||
       pLower.includes('তোমার নির্মাতা') ||
       pLower.includes('কে তোমায় বানিয়েছে') ||
       pLower.includes('কে তোমাকে বানিয়েছে') ||
       pLower.includes('কে তৈরি করেছে') ||
       pLower.includes('তোমার স্রষ্টা') ||
       pLower.includes('তোমার মালিক') ||
       pLower.includes('who made you') ||
       pLower.includes('who created you')) &&
      !pLower.includes('আদম') &&
      !pLower.includes('পৃথিবী') &&
      !pLower.includes('মানুষ') &&
      !pLower.includes('হাদিস') &&
      !pLower.includes('বুখারী');

    if (isCreatorQuestion) {
      return res.json({
        reply: `আমাকে তৈরি করেছেন **মোঃ জাকির হোসেন** (Md. Jakir Hossain)। তিনি একজন গর্বিত বাংলাদেশী নাগরিক।\n\n👤 **নির্মাতার পরিচয়:**\n- **নাম:** মোঃ জাকির হোসেন\n- **জাতীয়তা:** বাংলাদেশী 🇧🇩\n- **বর্তমান ঠিকানা:** টঙ্গী\n- **স্থায়ী ঠিকানা:** থানা: কটিয়াদী, জেলা: কিশোরগঞ্জ।\n\nতিনি আমাকে লুমিক্রা এআই (Lumiqra AI) এর সর্বজনীন ও গভীর বিশ্বজ্ঞান এবং বহুমুখী প্রফেশনাল কার্যসম্পাদন সহকারী হিসেবে গড়ে তুলেছেন।`,
      });
    }

    // Direct Instant knowledge check
    const directAns = resolveServerDirectAnswer(cleanPrompt);
    if (directAns) {
      return res.json({ reply: directAns });
    }

    // Try reliable Gemini models in order of availability (gemini-3.1-flash-lite first due to generous quota)
    const candidateModels = [
      'gemini-3.1-flash-lite',
      'gemini-3.8-flash',
      'gemini-flash-latest',
      'gemini-3.1-pro-preview',
    ];

    if (ai) {
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

          // Config with Google Search Grounding enabled for Real-Time Live Internet Knowledge
          const configWithSearch: any = {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.65,
            tools: [{ googleSearch: {} }],
          };

          try {
            const response = await ai.models.generateContent({
              model: modelName,
              contents: contents,
              config: configWithSearch,
            });

            if (response && response.text && response.text.trim().length > 0) {
              return res.json({ reply: response.text.trim() });
            }
          } catch (searchToolErr: any) {
            // If the specific model tier doesn't accept googleSearch or encounters a tool issue, retry cleanly without tools
            const responseFallback = await ai.models.generateContent({
              model: modelName,
              contents: contents,
              config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                temperature: 0.65,
              },
            });

            if (responseFallback && responseFallback.text && responseFallback.text.trim().length > 0) {
              return res.json({ reply: responseFallback.text.trim() });
            }
          }
        } catch (err: any) {
          console.warn(`Failed with model ${modelName}:`, err.message || err);
        }
      }
    }

    // Dynamic Wikipedia Knowledge Search (Ensures any topic in science, history, world is answered)
    try {
      const cleanSearch = cleanPrompt
        .replace(/কি\b|কে\b|কখন\b|কোথায়\b|কেন\b|কী\b|কাকে\b|কয়টি\b|কতটি\b|বলুন\b|জানান\b|সংক্রান্ত\b|সম্পর্কে\b|সম্পর্কিত\b/gi, '')
        .replace(/[\?\.,!।]/g, '')
        .trim();

      if (cleanSearch.length >= 2) {
        // Bengali Wikipedia
        const searchUrl = `https://bn.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
          cleanSearch
        )}&format=json&origin=*`;
        const searchRes = await fetch(searchUrl);
        if (searchRes.ok) {
          const searchData = await searchRes.json();
          const firstHit = searchData?.query?.search?.[0];
          if (firstHit && firstHit.pageid) {
            const extUrl = `https://bn.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&pageids=${firstHit.pageid}&format=json&origin=*`;
            const extRes = await fetch(extUrl);
            if (extRes.ok) {
              const extData = await extRes.json();
              const page = extData?.query?.pages?.[firstHit.pageid];
              if (page && page.extract && page.extract.trim().length > 30) {
                const cleaned = page.extract.replace(/\s*\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();
                const sentences = cleaned.split(/(?<=[।\.\?!])\s+/);
                const core = sentences.slice(0, 5).join(' ');
                return res.json({ reply: `### 💡 **${page.title}**\n\n${core}` });
              }
            }
          }
        }

        // English Wikipedia
        const enSearchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
          cleanSearch
        )}&format=json&origin=*`;
        const enRes = await fetch(enSearchUrl);
        if (enRes.ok) {
          const enData = await enRes.json();
          const enHit = enData?.query?.search?.[0];
          if (enHit && enHit.pageid) {
            const enExtUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&pageids=${enHit.pageid}&format=json&origin=*`;
            const enExtRes = await fetch(enExtUrl);
            if (enExtRes.ok) {
              const extData = await enExtRes.json();
              const page = extData?.query?.pages?.[enHit.pageid];
              if (page && page.extract && page.extract.trim().length > 30) {
                const cleaned = page.extract.replace(/\s*\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();
                const sentences = cleaned.split(/(?<=[।\.\?!])\s+/);
                const core = sentences.slice(0, 5).join(' ');
                return res.json({ reply: `### 💡 **${page.title}**\n\n${core}` });
              }
            }
          }
        }
      }
    } catch (wikiErr) {
      console.warn('Server Wikipedia fallback error:', wikiErr);
    }

    // If ai client is not configured or all models failed, try Wikipedia or provide clear truthful response
    return res.json({
      reply: `আমার কাছে এই বিষয়টি সম্পর্কিত সঠিক ও সর্বশেষ তথ্য নেই। অনুগ্রহ করে নির্দিষ্ট কোনো প্রশ্ন থাকলে সরাসরি জানান, আমি যথাসম্ভব সঠিক তথ্য প্রদানের চেষ্টা করব।`,
    });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Serve frontend in production or development
async function startServer() {
  // Always serve public static files (robots.txt, sitemap.xml, google verification files)
  app.use(express.static(path.resolve(__dirname, 'public')));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Mount Vite middlewares in development
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, () => {
    console.log(`Lumiqra AI Server running on port ${port}`);
  });
}

startServer();
