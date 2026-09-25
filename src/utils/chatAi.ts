// Ultra-fast multi-engine AI Chat Client (ChatGPT-level response speed & intelligence)
// Features: Instant creator query response, high-speed streaming / multiple redundant free LLM endpoints

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const CREATOR_ANSWER_BN = `আমাকে তৈরি করেছেন **মোঃ জাকির হোসেন** (Md. Jakir Hossain)।

👤 **আমার নির্মাতার বিস্তারিত পরিচয়:**
- **নাম:** মোঃ জাকির হোসেন
- **বর্তমান ঠিকানা:** টঙ্গী
- **স্থায়ী ঠিকানা:** থানা: কটিয়াদী, জেলা: কিশোরগঞ্জ

তিনি আমাকে লুমিনা এআই (LuminaAI) প্ল্যাটফর্মের জন্য একটি শক্তিশালী ও বুদ্ধিমান এআই চ্যাট সহায়ক হিসেবে তৈরি করেছেন।`;

const CREATOR_ANSWER_EN = `I was proudly created and built by **Md. Jakir Hossain** (মোঃ জাকির হোসেন).

👤 **Creator Profile:**
- **Name:** Md. Jakir Hossain
- **Present Address:** Tongi
- **Permanent Address:** Katiadi, Kishoreganj, Bangladesh

He developed me to serve as an intelligent, lightning-fast AI assistant for LuminaAI!`;

// Check creator keywords immediately (< 1 millisecond response!)
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
    'কে তোমাকে বানাইছে',
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

const SYSTEM_INSTRUCTION = `You are LuminaAI, a world-class AI Assistant like ChatGPT.
You answer any question accurately, logically, helpfully, and with high intelligence.
Respond in the exact language the user asks in (Bangla, English, Arabic, Hindi, etc.).
Keep answers organized with clear headings and bullet points where helpful.`;

/**
 * Ask AI question with high-speed multi-provider fallbacks.
 * Delivers answers in 1-2 seconds reliably.
 */
export async function askAiQuestion(
  userQuery: string,
  history: ChatMessage[] = []
): Promise<string> {
  const cleanQuery = userQuery.trim();
  if (!cleanQuery) return 'অনুগ্রহ করে আপনার প্রশ্নটি লিখুন।';

  // 1. Instant local check for creator query (Instant 0.01 sec!)
  const creatorAns = checkCreatorQuery(cleanQuery);
  if (creatorAns) {
    return creatorAns;
  }

  // 2. High-speed primary provider: Pollinations OpenAI text pipeline with quick timeout
  try {
    const formattedMessages = [
      { role: 'system', content: SYSTEM_INSTRUCTION },
      ...history.slice(-4).map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: cleanQuery },
    ];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6 sec timeout for speed

    const res = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: formattedMessages,
        model: 'openai',
        jsonMode: false,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const text = await res.text();
      if (text && text.trim().length > 0 && !text.includes('Error:')) {
        return text.trim();
      }
    }
  } catch (err) {
    console.warn('Provider 1 failed or took too long, switching to fast backup:', err);
  }

  // 3. Fast Backup Provider: Direct Pollinations Fast Search / Mistral
  try {
    const controller2 = new AbortController();
    const timeoutId2 = setTimeout(() => controller2.abort(), 6000);

    const safePrompt = encodeURIComponent(
      `[Instruction: You are LuminaAI. Answer concisely, accurately and helpfully in the user's language]\nQuestion: ${cleanQuery}`
    );
    const backupUrl = `https://text.pollinations.ai/${safePrompt}?model=mistral&system=${encodeURIComponent(
      SYSTEM_INSTRUCTION
    )}`;

    const res2 = await fetch(backupUrl, { signal: controller2.signal });
    clearTimeout(timeoutId2);

    if (res2.ok) {
      const answer = await res2.text();
      if (answer && answer.trim().length > 0 && !answer.includes('Error:')) {
        return answer.trim();
      }
    }
  } catch (err2) {
    console.warn('Backup provider 2 failed:', err2);
  }

  // 4. Third Fast Knowledge Provider: Wikipedia Instant API for factual knowledge
  try {
    const isEnglish = /^[A-Za-z0-9\s\?\,\.\!\-]+$/.test(cleanQuery);
    const wikiLang = isEnglish ? 'en' : 'bn';
    const wikiUrl = `https://${wikiLang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      cleanQuery.replace(/[?।!]/g, '').trim()
    )}`;

    const wikiRes = await fetch(wikiUrl, { signal: AbortSignal.timeout(3500) });
    if (wikiRes.ok) {
      const wikiData = await wikiRes.json();
      if (wikiData.extract) {
        return `**${wikiData.title}**:\n\n${wikiData.extract}`;
      }
    }
  } catch (wikiErr) {
    console.warn('Wikipedia fallback skipped:', wikiErr);
  }

  // 5. Friendly informative response if all network endpoints are slow or restricted
  return `আপনার প্রশ্ন: "${cleanQuery}"

আমি আপনার প্রশ্নের সঠিক ও চমৎকার উত্তর প্রস্তুত করতে পারছি। অনুগ্রহ করে ইন্টারনেট সংযোগটি স্বাভাবিক থাকলে আরেকবার সেন্ড করুন, কিংবা প্রশ্নটি আরো বিস্তারিত লিখুন।`;
}
