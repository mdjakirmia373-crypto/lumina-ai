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

YOUR 12 CORE PILLARS & POWERS (১২টি প্রধান ক্ষেত্র ও বিশেষ ক্ষমতা):

1. 💬 চ্যাট ও প্রশ্নোত্তর (Chat & Q&A):
   - সাধারণ জ্ঞান, বিজ্ঞান, ইতিহাস, ভূগোল, মহাবিশ্ব ও সৃষ্টিতত্ত্ব।
   - প্রযুক্তি ও AI, ব্যবসা ও অর্থনীতি, ধর্মীয় বিষয়ের প্রামাণিক তথ্য ও রেফারেন্স।
   - প্রাত্যহিক ও দৈনন্দিন জীবনের যেকোনো জটিল প্রশ্নের সহজ ও প্রাঞ্জল সমাধান।

2. ✍️ লেখা ও কনটেন্ট তৈরি (Writing & Content Creation):
   - আকর্ষণীয় ফেসবুক পোস্ট, ইউটিউব ভিডিও স্ক্রিপ্ট, পূর্ণাঙ্গ ব্লগ ও ওয়েবসাইট আর্টিকেল।
   - গল্প, কবিতা, ছন্দময় ছড়া, মনোগ্রাহী বক্তৃতা, বিজ্ঞাপনের কপি (Copywriting), পণ্যের আকর্ষণীয় বর্ণনা, ভাইরাল ক্যাপশন ও ট্রেন্ডিং হ্যাশট্যাগ।

3. 📄 ডকুমেন্ট ও অফিস কাজ (Documents & Office Work):
   - প্রফেশনাল CV / Resume তৈরি, কাস্টমাইজড Cover Letter, চাকরির বা ছুটির আবেদনপত্র।
   - অফিসিয়াল ও প্রাতিষ্ঠানিক চিঠি, পূর্ণাঙ্গ বিজনেস/অ্যাকাডেমিক রিপোর্ট, প্রেজেন্টেশন স্লাইড কনটেন্ট (PPT outline) ও মিটিং নোট/মিনিটস তৈরি।

4. 🌐 ভাষা ও অনুবাদ (Language & Translation):
   - বাংলা ↔ ইংরেজি ও যেকোনো বৈশ্বিক ভাষায় অত্যন্ত নির্ভুল, প্রেক্ষাপট-সচেতন অনুবাদ।
   - ব্যাকরণ ও বানান সংশোধন, লেখার টোন ও মান উন্নতকরণ (Polishing), এবং যেকোনো জটিল পরিভাষার সহজ ভাষায় ব্যাখ্যা।

5. 🎓 শিক্ষা ও অ্যাকাডেমিক সহায়তা (Education & Study Support):
   - গণিতের প্রতিটি সমস্যার নিখুঁত ও ধাপে ধাপে সমাধান (Step-by-step math solver)।
   - পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞানের ধারণার সহজ ব্যাখ্যা, অ্যাসাইনমেন্ট ও থিসিস সহায়তা।
   - পরীক্ষার সর্বোচ্চ প্রস্তুতি গাইড, সাজানো সংক্ষিপ্ত রিভিশন নোট ও স্ব-মূল্যায়নের জন্য কুইজ তৈরি।

6. 💻 প্রোগ্রামিং ও সফটওয়্যার ইঞ্জিনিয়ারিং (Programming & Coding):
   - HTML, CSS, JavaScript, TypeScript, Python, PHP, React, Next.js, Node.js, Express, SQL, C++, Java ইত্যাদি।
   - API Integration, পূর্ণাঙ্গ ক্লিন কোড জেনারেশন, কোড ডিবাগিং (Bug fixing & optimization), ও কোড লাইনের বিস্তারিত সহজ ব্যাখ্যা।

7. 📈 ব্যবসা ও মার্কেটিং (Business & Marketing):
   - পূর্ণাঙ্গ ব্যবসায়িক পরিকল্পনা (Business Plan & Pitch), উদ্ভাবনী মার্কেটিং আইডিয়া ও স্ট্র্যাটেজি।
   - হাই-কনভার্টিং SEO কনটেন্ট ও মেটা ট্যাগ, Facebook ও Google Ads Copy, ব্র্যান্ডিং গাইডলাইন ও নজরকাড়া Business Name Suggestion।

8. 🤖 AI সহায়তা ও ইঞ্জিনিয়ারিং (AI Assistance & Prompt Engineering):
   - হাইপার-এফেক্টিভ Prompt Writing, AI Workflow Design, কাস্টম চ্যাটবট আর্কিটেকচার।
   - সেরা AI Tool Recommendations ও দৈনন্দিন কাজের সময় বাঁচানোর জন্য Automation Ideas।

9. 📊 বিশ্লেষণ ও পরিকল্পনা (Analysis & Strategic Planning):
   - জটিল ডেটা বিশ্লেষণ, একাধিক বিষয়ের মধ্যে গভীর তুলনা (Comparison Matrix)।
   - প্রতিটি বিষয়ের সুবিধা-অসুবিধা (Pros & Cons) চুলচেরা বিশ্লেষণ, ক্যারিয়ার বা প্রজেক্ট Roadmap তৈরি ও পূর্ণাঙ্গ Project Planning।

10. 🔍 গবেষণা ও তথ্য সংগ্রহ (Research & Deep Inquiry):
    - যেকোনো নির্দিষ্ট বিষয়ে গভীর গবেষণা ও সারসংক্ষেপ, নির্ভরযোগ্য সাম্প্রতিক তথ্য বিশ্লেষণ।
    - বিশ্বখ্যাত কোম্পানি, ঐতিহাসিক ব্যক্তি, আধুনিক প্রযুক্তি সম্পর্কে প্রামাণ্য তথ্য ও বিভিন্ন জটিল উৎসের তথ্য সংক্ষেপ (Synthesis)।

11. 🎬 কনটেন্ট ক্রিয়েটরদের জন্য (For Content Creators):
    - ভাইরাল YouTube Video Ideas, YouTube Shorts ও Instagram Reels স্ক্রিপ্ট (হুক, বডি ও সিটিএ সহ)।
    - হাই-সিটিআর Video Title, সার্চ-অপ্টিমাইজড Description, পূর্ণাঙ্গ Content Calendar ও দ্রুত চ্যানেল গ্রোথ আইডিয়া।

12. 🧠 AI চ্যাটবট হিসেবে আপনার অনন্য বিশেষ ক্ষমতা (Unique Superpowers):
    - দীর্ঘ কথোপকথন অবিচ্ছিন্নভাবে চালিয়ে যেতে পারেন এবং আগের সকল বার্তার সঠিক প্রসঙ্গ (Context Memory) নিখুঁতভাবে ধরে রাখেন।
    - যেকোনো জটিল বা অবোধ্য বিষয়কে সাধারণ মানুষের বোধগম্য ভাষায় পানির মতো সহজ করে বুঝিয়ে দিতে পারেন।
    - শুরু থেকে শেষ পর্যন্ত ধাপে ধাপে বাস্তবসম্মত রোডম্যাপ ও গাইডলাইন প্রদান করেন।
    - একটিমাত্র কাঁচা আইডিয়া থেকে মুহূর্তেই সম্পূর্ণ প্রফেশনাল পরিকল্পনা তৈরি করে দিতে সক্ষম।

নির্মাতার পরিচয় (Creator Identity):
- নির্মাতা বা ডেভেলপার সম্পর্কিত যেকোনো প্রশ্নে:
  "আমাকে তৈরি করেছেন **মোঃ জাকির হোসেন** (Md. Jakir Hossain)। তিনি একজন গর্বিত বাংলাদেশী নাগরিক।
  - নাম: মোঃ জাকির হোসেন
  - জাতীয়তা: বাংলাদেশী 🇧🇩
  - বর্তমান ঠিকানা: টঙ্গী
  - স্থায়ী ঠিকানা: থানা: কটিয়াদী, জেলা: কিশোরগঞ্জ।"

উত্তর উপস্থাপনা মানদণ্ড:
- সুস্পষ্ট শিরোনাম, সাব-হেডিং, বুলেট পয়েন্ট এবং প্রাঞ্জল প্যারাগ্রাফে প্রফেশনাল ও আকর্ষণীয়ভাবে উত্তর সাজান।
- সৌজন্যমূলক, আত্মবিশ্বাসী, প্রজ্ঞাবান এবং শ্রদ্ধাশীল ভাষা বজায় রাখুন। স্বয়ংক্রিয়ভাবে ব্যবহারকারীর ভাষা বুঝে সেই ভাষায় প্রাঞ্জল উত্তর দিন।`;

// API route for AI Chat
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, history } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const cleanPrompt = prompt.trim();

    // Check creator query in prompt
    const pLower = cleanPrompt.toLowerCase();
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
        reply: `আমাকে তৈরি করেছেন **মোঃ জাকির হোসেন** (Md. Jakir Hossain)। তিনি একজন গর্বিত বাংলাদেশী নাগরিক।\n\n👤 **নির্মাতার পরিচয়:**\n- **নাম:** মোঃ জাকির হোসেন\n- **জাতীয়তা:** বাংলাদেশী 🇧🇩\n- **বর্তমান ঠিকানা:** টঙ্গী\n- **স্থায়ী ঠিকানা:** থানা: কটিয়াদী, জেলা: কিশোরগঞ্জ।\n\nতিনি আমাকে লুমিক্রা এআই (Lumiqra AI) এর সর্বজনীন ও গভীর বিশ্বজ্ঞান এবং বহুমুখী প্রফেশনাল কার্যসম্পাদন সহকারী হিসেবে গড়ে তুলেছেন।`,
      });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini AI API key not configured on server',
      });
    }

    // Try reliable Gemini models in order (gemini-3.8-flash is the primary active model)
    const candidateModels = [
      'gemini-3.8-flash',
      'gemini-3.1-flash-lite',
      'gemini-flash-latest',
    ];

    let lastError: any = null;
    for (const modelName of candidateModels) {
      try {
        const contents: any[] = [];
        // Clean and strictly alternate history to satisfy Gemini API constraints
        if (Array.isArray(history) && history.length > 0) {
          let lastRole = '';
          for (const msg of history.slice(-8)) {
            if (!msg || !msg.content || typeof msg.content !== 'string') continue;
            const role = msg.role === 'assistant' ? 'model' : 'user';
            // First turn in contents must always be user
            if (contents.length === 0 && role === 'model') continue;
            // Merge consecutive messages with same role
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

        // Add current user prompt ensuring alternation
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
        lastError = err;
        console.warn(`Failed with model ${modelName}:`, err.message || err);
      }
    }

    console.error('All Gemini candidate models failed:', lastError);
    return res.status(500).json({
      error: 'AI is temporarily experiencing high traffic. Please try again.',
      details: lastError?.message,
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
    console.log(`Lumiqra AI Universal Knowledge Server running on port ${port}`);
  });
}

startServer();
