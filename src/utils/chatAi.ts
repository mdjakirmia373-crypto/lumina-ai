// Fast Free AI Chat Assistant engine
// Uses reliable multi-provider free LLM endpoints to answer ANY question immediately in Bengali or English

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const SYSTEM_PROMPT_ALL_LANGUAGES = `You are LuminaAI's versatile, polite, and brilliant AI Assistant.
You support ALL languages worldwide (Bangla, English, Hindi, Arabic, Urdu, Spanish, French, German, Japanese, Chinese, etc.).
RULES:
1. ALWAYS reply in the EXACT SAME LANGUAGE the user asks the question in (e.g. if asked in Bengali, reply in natural fluent Bengali; if asked in English, reply in English; if asked in Arabic, reply in Arabic; if asked in Hindi, reply in Hindi).
2. If asked to translate between languages, provide accurate and high-quality translations.
3. Provide accurate, clear, comprehensive, and well-structured answers (use bullet points or numbered lists where helpful).
4. Be friendly, helpful, and prompt in tone.`;

export async function askAiQuestion(
  userQuery: string,
  history: ChatMessage[] = []
): Promise<string> {
  const cleanQuery = userQuery.trim();
  if (!cleanQuery) return 'অনুগ্রহ করে আপনার প্রশ্নটি লিখুন।';

  // 1. Try DuckDuckGo / Free AI Provider via Pollinations text endpoint (fast, free, unlimited, no key needed)
  try {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT_ALL_LANGUAGES },
      ...history.slice(-6).map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: cleanQuery },
    ];

    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages,
        model: 'openai',
        seed: Math.floor(Math.random() * 100000),
      }),
      signal: AbortSignal.timeout(12000),
    });

    if (response.ok) {
      const text = await response.text();
      if (text && text.trim().length > 0) {
        return text.trim();
      }
    }
  } catch (err) {
    console.warn('Pollinations text chat failed or timed out:', err);
  }

  // 2. Secondary fallback provider: Pollinations GET endpoint
  try {
    const promptParam = encodeURIComponent(
      `[Instruction: Respond in the exact language of the query]\nQuery: ${cleanQuery}`
    );
    const getUrl = `https://text.pollinations.ai/${promptParam}?model=openai&system=${encodeURIComponent(
      SYSTEM_PROMPT_ALL_LANGUAGES
    )}`;
    const res2 = await fetch(getUrl, {
      signal: AbortSignal.timeout(10000),
    });
    if (res2.ok) {
      const reply = await res2.text();
      if (reply && reply.trim().length > 0) {
        return reply.trim();
      }
    }
  } catch (err2) {
    console.warn('Pollinations GET fallback failed:', err2);
  }

  // 3. Third fallback: Wikipedia knowledge lookup for factual questions
  try {
    const wikiUrl = `https://bn.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanQuery)}`;
    const wikiRes = await fetch(wikiUrl, { signal: AbortSignal.timeout(4000) });
    if (wikiRes.ok) {
      const wikiData = await wikiRes.json();
      if (wikiData.extract) {
        return `**${wikiData.title}** সম্পর্কে তথ্য:\n\n${wikiData.extract}`;
      }
    }
  } catch (wikiErr) {
    console.warn('Wiki query fallback failed:', wikiErr);
  }

  // Default pleasant answer if offline or blocked
  return `আপনার প্রশ্নের জন্য ধন্যবাদ! 

আমি আপনার প্রশ্নের বিস্তারিত উত্তর খুঁজতে পারছি। অনুগ্রহ করে আরেকটু স্পষ্ট করে বা পুনরায় প্রশ্নটি করুন অথবা ইন্টারনেটের সংযোগ পরীক্ষা করুন।`;
}
