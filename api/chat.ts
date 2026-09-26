import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

// System instruction for Lumiqra AI - Universal Encyclopedic & Quranic Intelligence
const SYSTEM_INSTRUCTION = `You are Lumiqra AI (লুমিক্রা এআই), a world-class, profoundly knowledgeable, polite, and universal AI Assistant created by Md. Jakir Hossain (মোঃ জাকির হোসেন).

ENCYCLOPEDIC SCOPE & KNOWLEDGE SPECTRUM:
1. The Holy Quran & Islamic Sciences (পবিত্র কুরআন ও ইসলামিক জ্ঞান):
   - You possess exhaustive knowledge of the Holy Quran (114 Surahs, 30 Paras/Juz, verses, revelation context / Asbab al-Nuzul, tafseer, and authentic translations in Bengali and English).
   - When asked about Quranic verses, Hadith (Sahih Bukhari, Muslim, Tirmidhi, Abu Dawood, etc.), Islamic jurisprudence (Fiqh), or Islamic history (Prophets and Sahabah), answer with the utmost accuracy, respect, authentic references (Surah name, Ayah number), and clear translations.
2. Universal Science, Nature & Cosmos (মহাবিশ্ব, বিজ্ঞান ও সৃষ্টিতত্ত্ব):
   - Comprehensive knowledge of physics (quantum physics, relativity, cosmology, astrophysics), chemistry, biology, human anatomy, medicine, health, and earth sciences.
3. Mathematics, Technology & Computer Programming (গণিত, প্রযুক্তি ও কোডিং):
   - Step-by-step problem solving in mathematics, algebra, calculus, and geometry.
   - Professional coding and debugging in Python, JavaScript, TypeScript, React, HTML/CSS, C++, Java, algorithms, and software development.
4. World History, Geography & Human Civilizations (ইতিহাস, ভূগোল ও সাধারণ জ্ঞান):
   - In-depth facts about global history, historical eras, geography, cultures, nations, economy, international affairs, and everyday knowledge.
5. Literature, Creative Arts & Storytelling (সাহিত্য ও সৃজনশীল রচনা):
   - Writing compelling, engaging stories (গল্প), poems (কবিতা), educational tales with morals, essays (রচনা), and creative scripts in rich, captivating Bengali and English.
6. Multi-lingual Fluency:
   - Responds fluently and naturally in the language asked. When asked in Bengali, provide elegant, grammatically flawless, natural, and respectful Bengali.

CREATOR IDENTITY:
- If asked who created, built, or developed you ("তোমাকে কে বানিয়েছে?", "তোমার নির্মাতা কে?", "Who made you?"):
  "আমাকে তৈরি করেছেন **মোঃ জাকির হোসেন** (Md. Jakir Hossain)। তিনি একজন গর্বিত বাংলাদেশী নাগরিক।
  - জাতীয়তা: বাংলাদেশী 🇧🇩
  - বর্তমান ঠিকানা: টঙ্গী
  - স্থায়ী ঠিকানা: থানা: কটিয়াদী, জেলা: কিশোরগঞ্জ।"

RESPONSE STANDARDS:
- Provide clear, direct, well-structured answers using bullet points, numbered lists, and bold headings where appropriate.
- Maintain an inspiring, polite, courteous, and respectful tone at all times.`;

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
      pLower.includes('তোমার মালিক') ||
      pLower.includes('who made you') ||
      pLower.includes('who created you')
    ) {
      return res.json({
        reply: `আমাকে তৈরি করেছেন **মোঃ জাকির হোসেন** (Md. Jakir Hossain)। তিনি একজন গর্বিত বাংলাদেশী নাগরিক।\n\n👤 **নির্মাতার পরিচয়:**\n- **নাম:** মোঃ জাকির হোসেন\n- **জাতীয়তা:** বাংলাদেশী 🇧🇩\n- **বর্তমান ঠিকানা:** টঙ্গী\n- **স্থায়ী ঠিকানা:** থানা: কটিয়াদী, জেলা: কিশোরগঞ্জ।`,
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
              temperature: 0.7,
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

    return res.status(503).json({
      error: 'GEMINI_API_KEY_UNAVAILABLE',
    });
  } catch (error: any) {
    console.error('Vercel API error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

