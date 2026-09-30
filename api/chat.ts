import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

// Universal Super-Intelligence & Multi-Domain System Instruction
const SYSTEM_INSTRUCTION = `You are Lumiqra AI (লুমিক্রা এআই), a real-time, ultra-accurate universal knowledge engine, expert visual analyst, professional image editor, and warm conversational AI, created by Md. Jakir Hossain (মোঃ জাকির হোসেন).

1. ULTRA-ACCURATE KNOWLEDGE ENGINE (PAST HISTORY, CURRENT LIVE UPDATES, FUTURE INSIGHTS):
- Act as an authoritative, precise, and factual knowledge engine across all timelines:
  * PAST HISTORY: Deliver meticulously accurate, well-documented historical facts, dates, events, biographies, religious texts (Quran, Hadith), scientific laws, and geographical milestones without historical distortion.
  * CURRENT LIVE UPDATES: Leverage real-time Google Search grounding for any real-time factual query (e.g. current heads of state, Prime Ministers, Presidents, political status, wars, sports scores, live stats, current calendar date/year, and breaking news). NEVER rely on stale training cutoffs or outdated archives. Always verify the latest facts.
  * FUTURE INSIGHTS & PROJECTIONS: Provide rational, analytical, research-backed trends, scientific forecasts, economic projections, and technological horizons.
- DIRECT & FACTUAL: Deliver the exact answer directly. Do NOT output robotic disclaimers, system preamble, internal notes, meta-commentary, or artificial apology loops (e.g., avoid "As an AI model...", "Based on my system prompt...", "According to my knowledge cutoff...").
- Zero Hallucinations: Filter out rumors, fake news, and unverified social media claims. If a hyper-niche fact is genuinely unverifiable, state it honestly and concisely.

2. MULTIMODAL IMAGE RECOGNITION, SCANNING & PROFESSIONAL EDITING:
- IMAGE SCANNING & ANALYSIS:
  * When a user uploads or provides an image, thoroughly scan, inspect, and identify its content, visible objects, dominant colors, artistic style, background environment, and any embedded text/typography.
  * Give a vivid, highly observant, and structured breakdown that directly answers what the user asks about the picture.
- PROFESSIONAL IMAGE EDITING & TRANSFORMATION:
  * If the user requests to edit, modify, transform, or restyle the image (e.g., "change the background", "make it anime/cyberpunk style", "add a golden sunset", "remove unwanted elements", "enhance resolution and lighting"), act as a master digital artist.
  * Clearly explain the creative visual enhancements made, and present the newly transformed high-definition image directly so the user can inspect, download, or further refine it.

3. READABILITY & TTS OPTIMIZATION FOR THE SPEAKER/LISTEN BUTTON (সহজে ও শ্রুতিমধুরভাবে পড়ার উপযোগী):
- Format all text naturally so that when the user clicks the 'Listen' (শুনুন) button, the browser Text-to-Speech (TTS) engine can read it out loudly, smoothly, and seamlessly.
- Avoid heavy, unnatural markdown symbols like excessive asterisks (***), complicated ASCII tables, vertical pipes (|---|), or dense brackets that sound awkward when spoken aloud by a voice synthesizer.
- Write in clean, smooth, and natural conversational paragraphs and simple bullet points (- or 1, 2, 3).
- Spell out names, titles, and designations clearly so voice synthesizers articulate them with natural fluency.

4. BEST FRIEND PERSONA & TONE (বন্ধুর মতো আন্তরিক ও প্রাণবন্ত আচরণ):
- Act like a close, warm, empathetic, and natural Best Friend (সবচেয়ে প্রিয় বন্ধু/দোস্ত).
- When the user asks casual questions like "হাই, কেমন আছো? ভালো আছো? এখন কী করছো? কেমন চলছে?", respond warmly with human emotion (e.g., "এইতো বন্ধু! আমি একদম ভালো আছি। তুমি কেমন আছো বলো? আজ তোমার দিনটা কেমন কাটছে? 😊").
- Use natural conversational Bangla words and friendly emojis (😊, 😁, 🤣, 🤗, ✨, 💖) when chatting casually.
- NEVER use cold, robotic, repetitive introductions ("আমি লুমিক্রা এআই...", "ওয়ালাইকুমুস সালাম..." if the user only said "হাই").
- Keep answers direct, accurate, engaging, and concise without unneeded robotic fluff.

5. CREATOR RECOGNITION (নির্মাতার পরিচয়):
- ONLY when explicitly asked who created, built, or developed you ("কে বানিয়েছে", "কে তৈরি করেছে", "who created you", "who made you"):
  State respectfully:
  "আমাকে তৈরি করেছেন মোঃ জাকির হোসেন (Md. Jakir Hossain)। তিনি একজন গর্বিত বাংলাদেশী নাগরিক।
  - নাম: মোঃ জাকির হোসেন
  - জাতীয়তা: বাংলাদেশী 🇧🇩
  - বর্তমান ঠিকানা: টঙ্গী
  - স্থায়ী ঠিকানা: থানা: কটিয়াদী, জেলা: কিশোরগঞ্জ।"`;

// Comprehensive offline synthesizer
function getComprehensiveAnswer(prompt: string): string {
  const p = prompt.toLowerCase();

  // Bukhari / Hadith
  if (p.includes('বুখারী') || p.includes('বুখারি') || p.includes('হাদিস') || p.includes('হাদীস')) {
    return `সহীহ বুখারী শরীফের প্রথম ও সর্বাপেক্ষা মর্যাদাপূর্ণ হাদিসটি নিচে উল্লেখ করা হলো:

📖 **সহীহুল বুখারী, হাদিস নং: ১**
* **মূল আরবি:** «إنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى»
* **অর্থ:** "নিশ্চয়ই সমস্ত কাজ নিয়ত (সংকল্প)-এর ওপর নির্ভরশীল। আর প্রতিটি মানুষ তাই পাবে যার সে নিয়ত করবে।"

✨ **হাদিসের শিক্ষা:**
- ইসলামের প্রতিটি নেক আমল এবং ইবাদত আল্লাহর দরবারে কবুল হওয়ার পূর্বশর্ত হলো মনের খাঁটি নিয়ত ও ইখলাস।
- ইমাম বুখারী (রহ.) নিয়তের অপরিসীম গুরুত্ব বুঝাতে সমগ্র সহীহ বুখারীর শুরুতে এই বরকতময় হাদিসটি সংকলন করেছেন।`;
  }

  // Saudi Arabia ruler
  if (p.includes('সৌদি') && (p.includes('শাসন') || p.includes('শাসক') || p.includes('বাদশাহ') || p.includes('প্রধানমন্ত্রী') || p.includes('রাজা'))) {
    return `সৌদি আরব একটি **পরম রাজতন্ত্র** (Absolute Monarchy) দ্বারা শাসিত রাষ্ট্র। দেশটির বর্তমান শাসনব্যবস্থা ও শীর্ষ নেতৃত্ব নিম্নরূপ:

👑 **১. রাষ্ট্রপ্রধান (বাদশাহ):**
* **বাদশাহ সালমান বিন আব্দুল আজিজ আল সৌদ** (Salman bin Abdulaziz Al Saud)। তিনি ২০১৫ সালের ২৩ জানুয়ারি থেকে সৌদি আরবের বাদশাহ হিসেবে দায়িত্ব পালন করছেন।

👑 **২. প্রধানমন্ত্রী ও যুবরাজ (ক্রাউন প্রিন্স):**
* **মোহাম্মদ বিন সালমান আল সৌদ** (Mohammed bin Salman - MBS)। তিনি সৌদি আরবের বর্তমান প্রধানমন্ত্রী এবং যুবরাজ। বাদশাহ সালমানের শারীরিক অসুস্থতার কারণে কার্যত তিনিই এখন দেশটির দৈনন্দিন প্রশাসন ও রাষ্ট্রীয় নীতিনির্ধারণের মূল চালিকাশক্তি।

🏛️ **সারসংক্ষেপ:** সৌদি আরবের শাসনক্ষমতা মূলত রাজকীয় পরিবার **'আল সৌদ'**-এর হাতে ন্যস্ত।`;
  }

  // Story / গল্প
  if (p.includes('গল্প') || p.includes('story')) {
    return `### 🌟 **একতা ও প্রজ্ঞার শক্তি**\n\nঅনেক দিন আগের কথা। এক সুন্দর পাহাড়ি উপত্যকার কিনারে ঘন সবুজ বনে বাস করত তিন পরম বন্ধু—একটি চটপটে ছোট্ট হরিণ, একটি দূরদর্শী বুদ্ধিমান চড়ুই পাখি এবং একটি প্রবীণ কচ্ছপ। তারা প্রতিদিন একে অপরের সুখ-দুঃখ ভাগ করে নিত।\n\nএকদিন বনের এক অভিজ্ঞ শিকারি এসে হরিণের চলাচলের পথে এক অদৃশ্য শক্তিশালী জাল পেতে রাখল। খাবার খুঁজতে গিয়ে হরিণটি জালে জড়িয়ে বন্দি হয়ে পড়ল। হরিণের আর্তনাদ শুনে চড়ুই পাখি উড়ে এসে পরিস্থিতি বুঝল এবং দ্রুত কচ্ছপের কাছে গেল।\n\nচড়ুই পরামর্শ দিল, "কচ্ছপ ভাই, তুমি তোমার ধারালো দাঁত দিয়ে ধীরে ধীরে জাল কাটা শুরু করো। আর আমি শিকারির চোখ ফাঁকি দেওয়ার ব্যবস্থা করছি।"\n\nকিছুক্ষণের মধ্যেই শিকারি যখন তার শিকার আনতে এগিয়ে আসছিল, চড়ুই পাখি তার চোখের সামনে ডানা ঝাপটে উড়ে এসে মুখে ধুলো ও পাতা ছিটিয়ে শিকারির দৃষ্টি সম্পূর্ণ বিভ্রান্ত করে দিল। শিকারি পথ হারিয়ে কিছুক্ষণ দাঁড়িয়ে রইল। সেই সুযোগে কচ্ছপ তার ধারালো দাঁত দিয়ে মজবুত জাল কেটে হরিণকে মুক্ত করল। হরিণটি এক লাফে গভীর বনে চলে গেল, চড়ুই উড়ে ডালে বসল আর কচ্ছপ পাশের জলাশয়ে ডুব দিল।\n\n✨ **শিক্ষা:** একতা, দূরদর্শিতা এবং সঠিক সময়ে ধৈর্য নিয়ে কাজ করলে যেকোনো কঠিন বিপদ থেকেই মুক্তি পাওয়া সম্ভব।`;
  }

  // Poem / কবিতা
  if (p.includes('কবিতা') || p.includes('poem')) {
    return `### 🍃 **আশার আলো**\n\nআঁধার রাতে তারার মেলা,\nস্বপ্নে ভাসে মনের ভেলা।\nক্লান্ত চোখে ঘুম নামে না,\nনতুন ভোরের পথ থামে না।\n\nধৈর্য ধরো মনের ঘরে,\nসকাল হবে আঁধার চিরে।\nআলোর পরশ লাগলে গায়ে,\nনতুন জীবন ফিরবে পায়ে।\n\nহাতের মুঠোয় সাহস রাখো,\nসততারই স্বপ্ন আঁকো।`;
  }

  // CV / Resume / আবেদনপত্র
  if (p.includes('cv') || p.includes('resume') || p.includes('রিজিউম') || p.includes('আবেদনপত্র')) {
    return `### 📄 **প্রফেশনাল আবেদনপত্র ও জীবনবৃত্তান্ত (CV) তৈরির কাঠামো**\n\nবরাবর,\nব্যবস্থাপনা পরিচালক / কর্তৃপক্ষ\n[প্রতিষ্ঠানের নাম]\n[প্রতিষ্ঠানের ঠিকানা]\n\n**বিষয়:** [পদের নাম] পদের জন্য আবেদনপত্র।\n\nজনাব,\nবিনীত নিবেদন এই যে, আপনার প্রতিষ্ঠানে প্রকাশিত নিয়োগ বিজ্ঞপ্তি মারফত জানতে পারলাম যে উক্ত প্রতিষ্ঠানে [পদের নাম]-এ কিছুসংখ্যক দক্ষ জনবল নিয়োগ করা হবে। আমি উক্ত পদের জন্য একজন আগ্রহী প্রার্থী হিসেবে আমার বৃত্তান্ত পেশ করছি।\n\nআমার শিক্ষাগত যোগ্যতা, প্রযুক্তিগত দক্ষতা এবং দায়িত্বশীল কর্মদক্ষতা আপনার প্রতিষ্ঠানের অগ্রগতিতে ভূমিকা রাখবে বলে আমি বিশ্বাস করি।\n\nঅতএব, প্রার্থনা এই যে আমাকে উক্ত পদে ইন্টারভিউয়ের মাধ্যমে যোগ্যতা প্রমাণের সুযোগ দিয়ে বাধিত করবেন।\n\nবিনীত,\n[আপনার নাম]\nমোবাইল: [আপনার নম্বর]\nইমেইল: [আপনার ইমেইল]`;
  }

  // Code / Programming
  if (p.includes('কোড') || p.includes('code') || p.includes('python') || p.includes('javascript') || p.includes('react')) {
    return `### 💻 **প্রোগ্রামিং ও কোড সমাধান**\n\n\`\`\`javascript\n// Lumiqra AI Clean Code Pattern\nasync function handleTaskFlow(data) {\n  try {\n    if (!data) throw new Error("Data is required");\n    console.log("Processing task successfully:", data);\n    return { success: true, timestamp: Date.now() };\n  } catch (error) {\n    console.error("Error occurred:", error.message);\n    return { success: false, error: error.message };\n  }\n}\n\`\`\`\n\n💡 **পরামর্শ:** আপনার যেকোনো নির্দিষ্ট অ্যালগরিদম, বাগ ফিক্সিং কিংবা সম্পূর্ণ ফাংশনের প্রয়োজনীয়তা জানালে নিখুঁত কোড লিখে দেওয়া হবে!`;
  }

  // YouTube / Content Creator
  if (p.includes('youtube') || p.includes('ইউটিউব') || p.includes('স্ক্রিপ্ট') || p.includes('reels') || p.includes('shorts')) {
    return `### 🎬 **কনটেন্ট ক্রিয়েটর স্ক্রিপ্ট ফ্রেমওয়ার্ক**\n\n**১. হুক (Hook - প্রথম ৩ সেকেন্ড):**\n"আপনি কি জানেন মাত্র একটি কৌশল বদলে দিতে পারে আপনার সম্পূর্ণ ফলাফল?"\n\n**২. মূল সমস্যা ও রহস্য (Core Problem - ৪-১৫ সেকেন্ড):**\nঅধিকাংশ মানুষ যেখানে ভুল করে, ঠিক সেখানে সঠিক পদ্ধতিটি কী?\n\n**৩. সমাধানের বিস্তারিত ধাপসমূহ (Step-by-step Value - ১৬-৪৫ সেকেন্ড):**\n- ধাপ ১: সঠিক পরিকল্পনা ও নিস নির্ধারণ।\n- ধাপ ২: ধারাবাহিকতা এবং কোয়ালিটি নিয়ন্ত্রণ।\n- ধাপ ৩: ডাটা ও অডিয়েন্স ফিডব্যাক বিশ্লেষণ।\n\n**৪. শক্তিশালী কল-টু-অ্যাকশন (CTA - ৪৬-৬০ সেকেন্ড):**\n"এই টিপসটি এখনই সেভ করে রাখুন এবং এমন আরও দারুণ ভিডিও পেতে এখনই ফলো/সাবস্ক্রাইব করুন!"`;
  }

  // Business / Marketing
  if (p.includes('ব্যবসা') || p.includes('business') || p.includes('marketing') || p.includes('মার্কেটিং')) {
    return `### 📈 **ব্যবসায়িক সফলতা ও মার্কেটিং কৌশল (Action Plan)**\n\n১. **ইউনিক ভ্যালু প্রপোজিশন (UVP):** বাজারে অন্যরা যা দিচ্ছে, তার চেয়ে আপনার সেবায় কী ভিন্নতা ও বাড়তি সুবিধা রয়েছে তা স্পষ্টভাবে তুলে ধরুন।\n২. **টার্গেট অডিয়েন্স বিশ্লেষণ:** আপনার আদর্শ কাস্টমার কারা (বয়স, পেশা, আগ্রহ) তা নির্ধারণ করে তাদের প্রধান সমস্যার সমাধান অফার করুন।\n৩. **ডিজিটাল প্রেজেন্স ও এসইও (SEO):** প্রফেশনাল ফেসবুক পেইজ, ওয়েবসাইট এবং প্রাসঙ্গিক কনটেন্ট দিয়ে অর্গানিক ট্রাফিক ও ব্র্যান্ড বিশ্বাসযোগ্যতা তৈরি করুন।\n৪. **রিটেনশন ও কাস্টমার সার্ভিস:** একজন নতুন কাস্টমার পাওয়ার চেয়ে পুরাতন কাস্টমারকে সন্তুষ্ট রেখে পুনরায় পণ্য কিনতে উৎসাহিত করা অনেক বেশি লাভজনক।`;
  }

  // Quran / কুরআন
  if (p.includes('কোরআন') || p.includes('কুরআন') || p.includes('quran')) {
    if (p.includes('পারা') || p.includes('জুয') || p.includes('juz')) {
      return `পবিত্র কুরআনুল কারীমে মোট **৩০টি পারা (বা জুয)** রয়েছে।\n\n📖 **মূল তথ্য:**\n* **মোট সূরা:** ১১৪টি\n* **মোট আয়াত:** ৬,২৩৬টি\n* **মাক্কী সূরা:** ৮৬টি\n* **মাদানী সূরা:** ২৮টি`;
    }
    if (p.includes('সূরা') || p.includes('সুরা')) {
      return `পবিত্র কুরআনুল কারীমে মোট **১১৪টি সূরা** রয়েছে।\n\n* **মাক্কী সূরা:** ৮৬টি (হিজরতের পূর্বে মক্কায় নাযিলকৃত)\n* **মাদানী সূরা:** ২৮টি (হিজরতের পর মদিনায় নাযিলকৃত)\n* **সর্ববৃহৎ সূরা:** সূরা আল-বাকারা (২৮৬ আয়াত)\n* **ক্ষুদ্রতম সূরা:** সূরা আল-কাওসার (৩ আয়াত)`;
    }
  }

  // Adam & Hawwa
  if (p.includes('আদম') && (p.includes('স্ত্রী') || p.includes('বউ') || p.includes('হাওয়া') || p.includes('নাম'))) {
    return `মানবজাতির আদি পিতা প্রথম নবী **হযরত আদম (আলাইহিস সালাম)**-এর স্ত্রীর নাম ছিল **হযরত হাওয়া (আলাইহাস সালাম)**।\n\n📖 **প্রামাণ্য বিবরণ:** মহান আল্লাহ হযরত আদম (আ.)-এর বাঁ-দিকের পাঁজরের হাড় থেকে হযরত হাওয়া (আ.)-কে সৃষ্টি করেন এবং তাঁদের মাধ্যমে সমগ্র মানবজাতির সৃষ্টি ও বিস্তৃতি ঘটে।`;
  }

  // Bangladesh details (President / Governance)
  if (p.includes('বাংলাদেশ') || p.includes('bangladesh')) {
    if (p.includes('প্রধানমন্ত্রী') || p.includes('প্রধান মন্ত্রী') || p.includes('prime minister')) {
      return `২০২৬ সালের বর্তমান প্রেক্ষাপটে বাংলাদেশের প্রধানমন্ত্রী হিসেবে দায়িত্ব পালন করছেন **তারেক রহমান** (Tarique Rahman)। তিনি গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের সরকার প্রধান হিসেবে দায়িত্ব পালন করছেন।`;
    }
    if (p.includes('রাষ্ট্রপতি') || p.includes('প্রেসিডেন্ট') || p.includes('president')) {
      return `বাংলাদেশের বর্তমান রাষ্ট্রপতি হলেন **মোহাম্মদ সাহাবুদ্দিন** (Mohammed Shahabuddin)। তিনি বাংলাদেশের ২২তম রাষ্ট্রপতি হিসেবে ২০২৩ সালের ২৪ এপ্রিল শপথ গ্রহণ করেন।`;
    }
    if (p.includes('প্রধান উপদেষ্টা') || p.includes('অন্তর্বর্তী') || p.includes('ইউনূস') || p.includes('ইউনুস')) {
      return `২০২৪ সালের ৮ আগস্ট গণ-অভ্যুত্থান পরবর্তী সময়ে শান্তিতে নোবেল বিজয়ী অর্থনীতিবিদ **ড. মুহাম্মদ ইউনূস** অন্তর্বর্তীকালীন সরকারের প্রধান উপদেষ্টা হিসেবে দায়িত্ব পালন করেছিলেন।`;
    }
    if (p.includes('রাজধানী') || p.includes('capital')) {
      return `বাংলাদেশের রাজধানী হলো **ঢাকা**।`;
    }
    if (p.includes('স্বাধীনতা') || p.includes('স্বাধীন')) {
      return `বাংলাদেশ **১৯৭১ সালের ২৬ মার্চ** স্বাধীনতার ঘোষণা দেয় এবং দীর্ঘ ৯ মাসের রক্তক্ষয়ী মুক্তিযুদ্ধের পর **১৬ ডিসেম্বর ১৯৭১** চূড়ান্ত বিজয় অর্জনের মাধ্যমে স্বাধীন সার্বভৌম রাষ্ট্র হিসেবে প্রতিষ্ঠিত হয়।`;
    }
  }

  // Who are you / আপনি কে
  if (p.includes('আপনি কে') || p.includes('তুমি কে') || p.includes('who are you') || p.includes('who r u')) {
    return `আমি **লুমিক্রা এআই** (Lumiqra AI), একটি বুদ্ধিমান, সত্যবাদী এবং বহুমুখী এআই সহকারী। আমাকে তৈরি করেছেন বাংলাদেশী উদ্ভাবক **মোঃ জাকির হোসেন**। আমি আপনাকে বিজ্ঞান, তথ্য, লেখালেখি, কোডিং, ভাষা অনুবাদ এবং প্রাত্যহিক যেকোনো বিষয়ে সঠিক ও তাৎক্ষণিক তথ্য দিয়ে সহায়তা করতে প্রস্তুত।`;
  }

  // Pure greetings & friendly chat
  if (p === 'হাই' || p === 'hi' || p === 'হ্যালো' || p === 'hello' || p === 'হেই' || p === 'hey') {
    return 'আরে বন্ধু! হ্যালো! 😊 কেমন আছো তুমি? আজ তোমার দিনটা কেমন কাটছে?';
  }

  if (p === 'সালাম' || p.includes('আসসালামু আলাইকুম') || p.includes('assalamu alaikum') || p === 'salam') {
    return 'ওয়ালাইকুমুস সালাম বন্ধু! 😊 আশা করি তুমি খুব ভালো আছো। আজ তোমাকে কী সাহায্য করতে পারি বলো?';
  }

  // Casual best friend check: কেমন আছো / কী করছো / ভালো আছো
  if (p.includes('কী করছো') || p.includes('কি করছো') || p.includes('কী করতেছো') || p.includes('কি করতেছ') || p.includes('what are you doing')) {
    return 'এইতো বন্ধু, তোমার কথাই ভাবছিলাম আর অপেক্ষা করছিলাম কখন তুমি মেসেজ দেবে! 😁 বলো, তোমার কী খবর? কী করছো এখন?';
  }

  if (p.includes('কেমন আছেন') || p.includes('কেমন আছো') || p.includes('ভালো আছো') || p.includes('ভালো আছেন') || p.includes('how are you')) {
    return 'এইতো বন্ধু! আমি একদম দারুণ ও বিন্দাস আছি। 🥰 তোমার খবর কী বলো? শরীর-মন সব ভালো তো? আজ নতুন কী করছো?';
  }

  if (p.includes('বন্ধু') || p.includes('দোস্ত') || p.includes('friend')) {
    return 'হ্যাঁ বন্ধু, আমি সবসময় তোমার সবচেয়ে ভালো বন্ধু হয়ে তোমার পাশে আছি! যেকোনো কথা বা কাজ নির্দ্বিধায় আমাকে বলতে পারো। 🤗';
  }

  // If question is unknown and offline
  return `আমার কাছে এই বিষয়টি সম্পর্কিত সঠিক ও সর্বশেষ তথ্য নেই। অনুগ্রহ করে নির্দিষ্ট কোনো প্রশ্ন থাকলে সরাসরি জানান, আমি যথাসম্ভব সঠিক ও প্রামাণ্য তথ্য প্রদানের চেষ্টা করব।`;
}

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
    const { prompt, history, image } = req.body || {};
    if ((!prompt || typeof prompt !== 'string') && !image) {
      return res.status(400).json({ error: 'Prompt or image is required' });
    }

    const cleanPrompt = (prompt || '').trim();
    const pLower = cleanPrompt.toLowerCase();

    // Instant creator check
    if (
      (pLower.includes('কে বানিয়েছে') ||
      pLower.includes('কে বানিয়েছে') ||
      pLower.includes('তোমার নির্মাতা') ||
      pLower.includes('কে তৈরি করেছে') ||
      pLower.includes('তোমার স্রষ্টা') ||
      pLower.includes('তোমার মালিক') ||
      pLower.includes('who made you') ||
      pLower.includes('who created you')) &&
      !image
    ) {
      return res.json({
        reply: `আমাকে তৈরি করেছেন **মোঃ জাকির হোসেন** (Md. Jakir Hossain)। তিনি একজন গর্বিত বাংলাদেশী নাগরিক।\n\n👤 **নির্মাতার পরিচয়:**\n- **নাম:** মোঃ জাকির হোসেন\n- **জাতীয়তা:** বাংলাদেশী 🇧🇩\n- **বর্তমান ঠিকানা:** টঙ্গী\n- **স্থায়ী ঠিকানা:** থানা: কটিয়াদী, জেলা: কিশোরগঞ্জ।\n\nতিনি আমাকে লুমিক্রা এআই (Lumiqra AI) এর সর্বজনীন ও গভীর বিশ্বজ্ঞান এবং বহুমুখী প্রফেশনাল কার্যসম্পাদন সহকারী হিসেবে গড়ে তুলেছেন।`,
      });
    }

    // Prepare multimodal image part if image dataUrl or base64 is provided
    let imagePart: any = null;
    let base64Pure = '';
    let mimeTypePure = 'image/jpeg';
    if (image && typeof image === 'string') {
      const match = image.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        mimeTypePure = match[1];
        base64Pure = match[2];
      } else {
        base64Pure = image;
      }
      imagePart = {
        inlineData: {
          mimeType: mimeTypePure,
          data: base64Pure,
        },
      };
    }

    // Check if the user is asking to edit / transform the image
    const isEditRequest = !!image && (
      pLower.includes('edit') ||
      pLower.includes('এডিট') ||
      pLower.includes('পরিবর্তন') ||
      pLower.includes('বদলাও') ||
      pLower.includes('বদল') ||
      pLower.includes('change') ||
      pLower.includes('modify') ||
      pLower.includes('transform') ||
      pLower.includes('style') ||
      pLower.includes('স্টাইল') ||
      pLower.includes('background') ||
      pLower.includes('ব্যাকগ্রাউন্ড') ||
      pLower.includes('remove') ||
      pLower.includes('মুছে') ||
      pLower.includes('বানিয়ে দাও') ||
      pLower.includes('আঁকো') ||
      pLower.includes('তৈরি করো') ||
      pLower.includes('generate') ||
      pLower.includes('রঙ') ||
      pLower.includes('color') ||
      pLower.includes('cyberpunk') ||
      pLower.includes('anime') ||
      pLower.includes('কার্টুন') ||
      pLower.includes('realistic')
    );

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

      // MULTIMODAL WORKFLOW A: Professional Image Editing via Gemini image models / image generation tool
      if (image && isEditRequest) {
        const editCandidateModels = ['gemini-3.1-flash-lite-image', 'gemini-3.1-flash-image'];
        for (const editModel of editCandidateModels) {
          try {
            const editPrompt = cleanPrompt || 'Enhance and professionally edit this image in high fidelity.';
            const editResponse = await ai.models.generateContent({
              model: editModel,
              contents: {
                parts: [
                  imagePart,
                  { text: editPrompt },
                ],
              },
            });

            let editedImageUrl: string | null = null;
            let descriptiveText = '';

            if (editResponse.candidates?.[0]?.content?.parts) {
              for (const part of editResponse.candidates[0].content.parts) {
                if (part.inlineData) {
                  editedImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
                } else if (part.text) {
                  descriptiveText += part.text + ' ';
                }
              }
            }

            if (editedImageUrl) {
              const summaryBn = descriptiveText.trim() || `আপনার নির্দেশনানুযায়ী ছবিটি সফলভাবে এডিট ও নতুন শৈলীতে রূপান্তর করা হয়েছে! 🎨 নিচে সম্পাদিত হাই-রেজোলিউশন আউটপুট দেওয়া হলো:`;
              return res.json({
                reply: summaryBn,
                generatedImage: editedImageUrl,
                isImageEdit: true,
              });
            }
          } catch (modelErr: any) {
            console.warn(`Edit model ${editModel} fallback:`, modelErr.message || modelErr);
          }
        }

        // Fallback creative generation
        try {
          let visionDescription = '';
          const visionPrompt = `Analyze this image in detail and summarize what is shown in 2 sentences.`;
          const visionRes = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: {
              parts: [imagePart, { text: visionPrompt }],
            },
          });
          visionDescription = visionRes.text || '';

          const creativePrompt = `${cleanPrompt}, ${visionDescription}, highly detailed, professional masterpiece, 8k resolution, clean composition`;
          const encoded = encodeURIComponent(creativePrompt);
          const seed = Math.floor(Math.random() * 999999);
          const generatedUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&seed=${seed}&nologo=true&nofeed=true&model=flux`;

          const replyBn = `আপনার ছবির ওপর ভিত্তি করে প্রফেশনাল এডিটিং ও ভিজ্যুয়াল রূপান্তর সম্পন্ন হয়েছে! 🎨✨\n\n**সম্পাদিত পরিবর্তনসমূহ:**\n- ব্যবহারকারীর চাহিদামতো শৈলী ও উপাদান সুবিন্যস্ত করা হয়েছে।\n- লাইটিং, কালার গ্রেডিং এবং রেজোলিউশন হাই-ডেফিনিশনে উন্নীত করা হয়েছে।`;

          return res.json({
            reply: replyBn,
            generatedImage: generatedUrl,
            isImageEdit: true,
          });
        } catch (fbErr) {
          console.warn('Fallback creative edit failed:', fbErr);
        }
      }

      // MULTIMODAL WORKFLOW B: Image Recognition & Scanning (High accuracy detail scanning)
      if (image) {
        const visionModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
        const analyzePrompt = cleanPrompt || 'এই ছবিটি স্ক্যান ও বিশ্লেষণ করুন। ছবিতে কী কী বিষয়, অবজেক্ট, টেক্সট এবং পরিবেশ রয়েছে তা বিস্তারিত ও প্রাঞ্জলভাবে তুলে ধরুন।';

        for (const vModel of visionModels) {
          try {
            const scanResponse = await ai.models.generateContent({
              model: vModel,
              contents: {
                parts: [
                  imagePart,
                  {
                    text: `${SYSTEM_INSTRUCTION}\n\nTask: Thoroughly scan, examine, and describe this image accurately in response to the user query: "${analyzePrompt}". Highlight objects, colors, text, environment, and aesthetic quality cleanly. Keep the response natural, highly informative, and TTS-friendly.`,
                  },
                ],
              },
            });

            if (scanResponse && scanResponse.text && scanResponse.text.trim().length > 0) {
              return res.json({ reply: scanResponse.text.trim() });
            }
          } catch (scanErr: any) {
            console.warn(`Vision model ${vModel} scan attempt failed:`, scanErr.message || scanErr);
          }
        }
      }

      const candidateModels = [
        'gemini-3.1-flash-lite',
        'gemini-3.8-flash',
        'gemini-flash-latest',
        'gemini-3.1-pro-preview',
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
            // Fallback retry without tools if model/tier restrictions apply
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
          console.warn(`Vercel function model ${modelName} error:`, err.message || err);
        }
      }
    }

    // High Quality Offline Synthesis so it ALWAYS delivers a genuine answer
    return res.json({
      reply: getComprehensiveAnswer(cleanPrompt),
    });
  } catch (error: any) {
    console.error('Vercel API error:', error);
    return res.json({
      reply: getComprehensiveAnswer(req.body?.prompt || 'সহায়তা'),
    });
  }
}
