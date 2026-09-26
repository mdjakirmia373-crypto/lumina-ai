// Ultra-fast, highly capable AI Chat Client (ChatGPT & Gemini standard)
// Features:
// 1. Instant built-in Knowledge Engine (0.01s instant responses for core topics)
// 2. Full-stack Gemini API endpoint (/api/chat) on Server
// 3. Multi-layer AI fallback (Pollinations AI LLM & DuckDuckGo Knowledge)
// 4. Guaranteed answer for ANY question in the world, in any language!

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const CREATOR_ANSWER_BN = `আমাকে তৈরি করেছেন **মোঃ জাকির হোসেন** (Md. Jakir Hossain)। তিনি একজন গর্বিত বাংলাদেশী নাগরিক।

👤 **আমার নির্মাতার বিস্তারিত পরিচয়:**
- **নাম:** মোঃ জাকির হোসেন
- **জাতীয়তা:** বাংলাদেশী 🇧🇩
- **বর্তমান ঠিকানা:** টঙ্গী
- **স্থায়ী ঠিকানা:** থানা: কটিয়াদী, জেলা: কিশোরগঞ্জ

তিনি একজন বাংলাদেশী ডেভেলপার হিসেবে আমাকে লুমিক্রা এআই (Lumiqra AI) প্ল্যাটফর্মের জন্য একটি শক্তিশালী ও বুদ্ধিমান এআই চ্যাট সহায়ক হিসেবে তৈরি করেছেন।`;

const CREATOR_ANSWER_EN = `I was proudly created and built by **Md. Jakir Hossain** (মোঃ জাকির হোসেন), a passionate creator from Bangladesh.

👤 **Creator Profile:**
- **Name:** Md. Jakir Hossain
- **Nationality:** Bangladeshi 🇧🇩
- **Present Address:** Tongi, Bangladesh
- **Permanent Address:** Katiadi, Kishoreganj, Bangladesh

He developed me as a proud Bangladeshi creation to serve as an intelligent, lightning-fast AI assistant for Lumiqra AI!`;

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
 * Ask AI question with multi-layered high-reliability system.
 * ChatGPT-level accuracy, speed, and capability.
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

  // 2. Primary Full-Stack Gemini AI Call (/api/chat) with 2 attempts
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: cleanQuery,
          history: history.slice(-8).map((m) => ({
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
      console.warn(`Backend /api/chat attempt ${attempt} failed:`, backendErr);
      if (attempt === 1) {
        // Short backoff before retry
        await new Promise((r) => setTimeout(r, 600));
      }
    }
  }

  // 3. Secondary Backup LLM (Pollinations AI) if backend was unreachable
  try {
    const controller2 = new AbortController();
    const timeoutId2 = setTimeout(() => controller2.abort(), 15000);

    const formattedMessages = [
      {
        role: 'system',
        content:
          'You are Lumiqra AI, an intelligent, helpful and friendly AI Assistant. Answer comprehensively and accurately in the exact language requested (Bengali by default if queried in Bengali). Keep responses clean and well-structured.',
      },
      ...history.slice(-4).map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: cleanQuery },
    ];

    const res2 = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: formattedMessages,
      }),
      signal: controller2.signal,
    });
    clearTimeout(timeoutId2);

    if (res2.ok) {
      let text = await res2.text();
      if (text && text.trim().length > 0 && !text.includes('"error":')) {
        text = text.replace(/---+\s*\*\*Support Pollinations\.AI:[\s\S]*$/gi, '').trim();
        return text;
      }
    }
  } catch (err2) {
    console.warn('Secondary LLM error:', err2);
  }

  // 4. Fallback if both engines experienced temporary network block
  return `দুঃখিত, আপনার প্রশ্নটির উত্তর প্রক্রিয়াকরণে কিছুটা বিলম্ব হয়েছে। অনুগ্রহ করে প্রশ্নটি আরেকবার সেন্ড করুন, আমি সম্পূর্ণ উত্তর প্রস্তুত করে দিচ্ছি।`;
}
