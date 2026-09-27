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
        reply: `আমাকে তৈরি করেছেন **মোঃ জাকির হোসেন** (Md. Jakir Hossain)। তিনি একজন গর্বিত বাংলাদেশী নাগরিক।\n\n👤 **নির্মাতার পরিচয়:**\n- **নাম:** মোঃ জাকির হোসেন\n- **জাতীয়তা:** বাংলাদেশী 🇧🇩\n- **বর্তমান ঠিকানা:** টঙ্গী\n- **স্থায়ী ঠিকানা:** থানা: কটিয়াদী, জেলা: কিশোরগঞ্জ।\n\nতিনি আমাকে লুমিক্রা এআই (Lumiqra AI) এর সর্বজনীন ও গভীর বিশ্বজ্ঞান ইঞ্জিন হিসেবে গড়ে তুলেছেন।`,
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
