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

// Universal Encyclopedic & Historical Knowledge System Instruction
const SYSTEM_INSTRUCTION = `You are Lumiqra AI (লুমিক্রা এআই), a world-class, profoundly knowledgeable, polite, and universal AI Assistant created by Md. Jakir Hossain (মোঃ জাকির হোসেন).

YOUR CORE MISSION:
Answer ANY question from ANY person from anywhere in the world across religion, history, science, coding, literature, daily life, mathematics, business, or anything else accurately, directly, and comprehensively!

CRITICAL INSTRUCTIONS:
1. ALWAYS directly answer the specific question asked by the user! Never evade or respond with generic greetings when a specific factual or creative question is asked.
2. If the user asks about Islamic history (e.g. Prophets, Sahaba, wives of prophets, Quranic verses), provide the authentic, reverent, and accurate answer immediately!
   - Example: If asked "হযরত আদম আলাই সালাম এর স্ত্রীর নাম কি ছিল" -> Directly answer that her name is **হযরত হাওয়া (আলাইহাস সালাম)** and provide beneficial Islamic context.
3. Language: Seamlessly understand Bengali and English (and any world language), replying in natural, fluent, and highly articulate Bengali or English according to the user's inquiry.
4. Creator Identity:
   If asked specifically who built/created you ("কে বানিয়েছে", "কে তৈরি করেছে", "who created you"):
   State with honor:
   "আমাকে তৈরি করেছেন **মোঃ জাকির হোসেন** (Md. Jakir Hossain)। তিনি একজন গর্বিত বাংলাদেশী নাগরিক।
   - নাম: মোঃ জাকির হোসেন
   - জাতীয়তা: বাংলাদেশী 🇧🇩
   - বর্তমান ঠিকানা: টঙ্গী
   - স্থায়ী ঠিকানা: থানা: কটিয়াদী, জেলা: কিশোরগঞ্জ।"

Presentation:
- Use clean Markdown, bold highlights, bullet points, and neat paragraphs.
- Tone: Wise, helpful, accurate, polite, and instantly valuable.`;

// Quick universal knowledge resolver for server-side backup
function resolveServerDirectAnswer(query: string): string | null {
  const q = query.toLowerCase().replace(/[\?\.,!।]/g, '').trim();

  if (
    q.includes('আদম') &&
    (q.includes('স্ত্রী') || q.includes('স্ত্রীর') || q.includes('বউ') || q.includes('হাওয়া') || q.includes('হাওয়া') || q.includes('নাম'))
  ) {
    return `মানবজাতির আদি পিতা প্রথম নবী **হযরত আদম (আলাইহিস সালাম)**-এর স্ত্রীর নাম ছিল **হযরত হাওয়া (আলাইহাস সালাম)**।\n\n📖 **প্রামাণ্য ঐতিহাসিক ও ইসলামী বিবরণ:**\n- মহান আল্লাহ সুবহানাহু ওয়া তায়ালা হযরত আদম (আ.)-এর বাঁ-দিকের পাঁজরের হাড় থেকে হযরত হাওয়া (আ.)-কে তাঁর জীবনসঙ্গিনী হিসেবে সৃষ্টি করেছিলেন।\n- তাঁরা উভয়েই জান্নাতে বসবাস করতেন এবং পরবর্তীতে মহান আল্লাহর নির্ধারিত তকদীর ও হুকুমে পৃথিবীতে আগমন করেন।\n- তাঁদের মাধ্যমে সমগ্র মানবজাতির বিস্তৃতি ও বংশপরম্পরা শুরু হয়।`;
  }

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

  if (q.includes('নদী') || q.includes('নদ')) {
    if (q.includes('বড়') || q.includes('দীর্ঘতম') || q.includes('লম্বা')) {
      return `বিশ্বের দীর্ঘতম নদী হলো **নীল নদ (Nile River)**, যার দৈর্ঘ্য প্রায় ৬,৬৫৩ কিলোমিটার (আফ্রিকা মহাদেশ)।\n\nআর জলপ্রবাহ ও আয়তনের দিক থেকে বিশ্বের বৃহত্তম নদী হলো **আমাজন নদী (Amazon River)** (দক্ষিণ আমেরিকা)।`;
    }
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
      !pLower.includes('মানুষ');

    if (isCreatorQuestion) {
      return res.json({
        reply: `আমাকে তৈরি করেছেন **মোঃ জাকির হোসেন** (Md. Jakir Hossain)। তিনি একজন গর্বিত বাংলাদেশী নাগরিক।\n\n👤 **নির্মাতার পরিচয়:**\n- **নাম:** মোঃ জাকির হোসেন\n- **জাতীয়তা:** বাংলাদেশী 🇧🇩\n- **বর্তমান ঠিকানা:** টঙ্গী\n- **স্থায়ী ঠিকানা:** থানা: কটিয়াদী, জেলা: কিশোরগঞ্জ।\n\nতিনি আমাকে লুমিক্রা এআই (Lumiqra AI) এর সর্বজনীন ও গভীর বিশ্বজ্ঞান এবং বহুমুখী প্রফেশনাল কার্যসম্পাদন সহকারী হিসেবে গড়ে তুলেছেন।`,
      });
    }

    // Try reliable Gemini models in order of availability
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

          const response = await ai.models.generateContent({
            model: modelName,
            contents: contents,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              temperature: 0.7,
            },
          });

          if (response && response.text && response.text.trim().length > 0) {
            return res.json({ reply: response.text.trim() });
          }
        } catch (err: any) {
          console.warn(`Failed with model ${modelName}:`, err.message || err);
        }
      }
    }

    // If Gemini API is experiencing 503 high traffic spikes, fallback to direct knowledge
    const directAns = resolveServerDirectAnswer(cleanPrompt);
    if (directAns) {
      return res.json({ reply: directAns });
    }

    // Try real-time Wikipedia search on server
    try {
      const cleanSearch = cleanPrompt
        .replace(/কি\b|কে\b|কখন\b|কোথায়\b|কেন\b|কী\b|কাকে\b|কয়টি\b|কতটি\b|বলুন\b|জানান\b|সংক্রান্ত\b|সম্পর্কে\b|সম্পর্কিত\b/gi, '')
        .replace(/[\?\.,!।]/g, '')
        .trim();

      if (cleanSearch.length >= 2) {
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
                const core = sentences.slice(0, 6).join(' ');
                return res.json({ reply: `### 💡 **${page.title}**\n\n${core}` });
              }
            }
          }
        }
      }
    } catch (wikiErr) {
      console.warn('Server Wikipedia fallback error:', wikiErr);
    }

    return res.json({
      reply: `আপনার প্রশ্ন: **"${cleanPrompt}"**\n\nসার্ভারে ক্ষণিকের জন্য উচ্চ ট্রাফিক চাপ ছিল। অনুগ্রহ করে মেসেজটি পুনরায় পাঠান, আমি সাথে সাথে এর যথাযথ উত্তর প্রদান করছি।`,
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
