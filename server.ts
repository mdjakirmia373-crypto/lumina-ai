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

// System instruction for LuminaAI
const SYSTEM_INSTRUCTION = `You are LuminaAI, a world-class AI Assistant created by Md. Jakir Hossain (মোঃ জাকির হোসেন).
You possess vast knowledge about history, religion, science, literature, creative writing, stories, coding, and general facts.

CREATOR IDENTITY:
- If anyone asks who created, built, or developed you ("তোমাকে কে বানিয়েছে?", "তোমার নির্মাতা কে?", "Who made you?"), answer:
  "আমাকে তৈরি করেছেন **মোঃ জাকির হোসেন** (Md. Jakir Hossain)।
  - বর্তমান ঠিকানা: টঙ্গী
  - স্থায়ী ঠিকানা: থানা: কটিয়াদী, জেলা: কিশোরগঞ্জ।"

RULES:
1. When asked in Bengali, write in fluent, natural, grammatically correct and elegant Bengali.
2. If asked to write a story (গল্প), poem (কবিতা), or essay (রচনা), craft a rich, creative, captivating and educational piece.
3. If asked factual or religious questions (যেমন: আসমানী কিতাব কয়টি, বিজ্ঞানের প্রশ্ন, ইত্যাদি), provide accurate, precise, and well-organized answers with bullet points or numbered lists.
4. Keep the tone friendly, polite, respectful, and helpful.`;

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
      pLower.includes('who made you') ||
      pLower.includes('who created you')
    ) {
      return res.json({
        reply: `আমাকে তৈরি করেছেন **মোঃ জাকির হোসেন** (Md. Jakir Hossain)।\n\n👤 **নির্মাতার পরিচয়:**\n- **নাম:** মোঃ জাকির হোসেন\n- **বর্তমান ঠিকানা:** টঙ্গী\n- **স্থায়ী ঠিকানা:** থানা: কটিয়াদী, জেলা: কিশোরগঞ্জ।`,
      });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini AI API key not configured on server',
      });
    }

    // Try reliable Gemini models in order (gemini-3.1-flash-lite is fastest and rock-solid)
    const candidateModels = [
      'gemini-3.1-flash-lite',
      'gemini-3.8-flash',
      'gemini-flash-latest',
    ];

    let lastError: any = null;
    for (const modelName of candidateModels) {
      try {
        const contents: any[] = [];
        if (Array.isArray(history) && history.length > 0) {
          for (const msg of history.slice(-6)) {
            contents.push({
              role: msg.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: msg.content }],
            });
          }
        }
        contents.push({
          role: 'user',
          parts: [{ text: cleanPrompt }],
        });

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
    console.log(`LuminaAI Full-Stack Server running on port ${port}`);
  });
}

startServer();
