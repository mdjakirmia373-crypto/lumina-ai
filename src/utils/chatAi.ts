// Ultra-fast, highly accurate AI Chat Client powered by Google Gemini API
// Supports in-depth answers, story writing, coding, science, history, religion, and all languages

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

/**
 * Ask AI question with Google Gemini API backend proxy.
 * Capable of writing rich stories, solving questions, religious queries, etc.
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

  // 2. Call Full-Stack Backend Proxy (/api/chat) connected to Google Gemini AI
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 18000); // 18 seconds for deep creative stories

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
    console.warn('Backend /api/chat error or timeout:', backendErr);
  }

  // 3. Fallback to Wikipedia Instant Search for factual queries (e.g. Asmani Kitab, History)
  try {
    const isEnglish = /^[A-Za-z0-9\s\?\,\.\!\-]+$/.test(cleanQuery);
    const wikiLang = isEnglish ? 'en' : 'bn';
    const cleanSearch = cleanQuery.replace(/[?।!]/g, '').trim();
    const wikiUrl = `https://${wikiLang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanSearch)}`;

    const wikiRes = await fetch(wikiUrl, { signal: AbortSignal.timeout(4000) });
    if (wikiRes.ok) {
      const wikiData = await wikiRes.json();
      if (wikiData.extract) {
        return `**${wikiData.title}**:\n\n${wikiData.extract}`;
      }
    }
  } catch (wikiErr) {
    console.warn('Wikipedia fallback skipped:', wikiErr);
  }

  return `আপনার প্রশ্নের জন্য ধন্যবাদ!

আমি বর্তমানে আপনার অনুরোধটি প্রসেস করতে সামান্য অসুবিধায় পড়েছি। অনুগ্রহ করে কয়েক সেকেন্ড অপেক্ষা করে পুনরায় প্রশ্নটি সেন্ড করুন।`;
}
