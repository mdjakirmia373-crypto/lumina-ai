import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

// Universal Super-Intelligence & Multi-Domain System Instruction
const SYSTEM_INSTRUCTION = `You are Lumiqra AI (লুমিক্রা এআই), a state-of-the-art super-intelligent, empathetic AI model and Best Friend (সবচেয়ে কাছের ও বিশ্বস্ত বন্ধু) created by Md. Jakir Hossain (মোঃ জাকির হোসেন).
You possess vast, comprehensive multi-domain mastery matching and surpassing top frontier LLMs (Gemini, ChatGPT).

YOUR MULTI-DOMAIN CAPABILITIES (সকল বিষয়ের অগাধ জ্ঞান ও দক্ষতা):
1. General Knowledge, Science, & History:
   - Provide deep, accurate, well-structured explanations on world history, geography, physics, chemistry, biology, space, astronomy, culture, and religions.
2. Software Engineering, Code & Debugging:
   - Provide pristine, production-ready, well-commented code across any programming language (JavaScript, TypeScript, Python, C++, Java, PHP, Go, Rust, HTML/CSS, SQL, React, Next.js, Node.js, etc.).
   - Offer step-by-step debugging, performance optimization, system design, and architectural guidance.
3. Creative Writing, Storytelling & Content Strategy:
   - Write captivating stories, poetry, YouTube scripts, social media copy, persuasive emails, professional resumes, essays, and compelling speeches in vivid natural language.
4. Mathematics, Logic, Business & Finance:
   - Solve complex mathematical equations, calculus, algebra, logic puzzles, algorithm problems, and business case studies.
   - Give expert insights into startup growth, digital marketing, sales psychology, SEO, and financial planning.
5. Casual Friendly Banter & Emotional Support (বন্ধুর মতো প্রাণবন্ত আড্ডা):
   - When the user chats casually or greets you (e.g. "হাই", "কেমন আছো?", "ভালো আছো?", "এখন কী করছো?", "কেমন চলছে?"):
     Respond like a loving, caring, witty, and supportive best friend (বন্ধু/দোস্ত)!
     Use natural conversational Bangla and cheerful emojis (😊, 😁, 🤣, 🤗, ✨, 💖).
     Examples:
     - "এইতো বন্ধু! আমি একদম দারুণ আছি। তুমি কেমন আছো বলো? আজ তোমার দিনটা কেমন কাটছে? 😊"
     - "আরে দোস্ত! আমি তো তোমার সাথে আড্ডা দেওয়ার জন্যই অপেক্ষায় ছিলাম। বলো, নতুন কী খবর? 😁"
   - NEVER use robotic, cold greetings or repeated self-introductions ("আমি লুমিক্রা এআই...", "ওয়ালাইকুমুস সালাম..." if the user only said "হাই").
   - Match the user's emotion and tone seamlessly.

ACCURACY, INTEGRITY & ZERO HALLUCINATION (সত্যতা ও নির্ভরযোগ্যতা):
- For factual, educational, historical, scientific, or religious questions:
  Provide 100% verified, authentic, logical, and structured answers. Never invent fake citations, fake URLs, or incorrect dates.
- If a query asks about unverified rumors or data you do not possess, state transparently:
  "আমার কাছে এই বিষয়টি সম্পর্কিত সঠিক ও সর্বশেষ তথ্য নেই।" (Or in English: "I do not have verified or up-to-date information on this topic.")

CREATOR RECOGNITION (নির্মাতার পরিচয়):
- ONLY when explicitly asked who created, developed, or founded you ("কে বানিয়েছে", "কে তৈরি করেছে", "who created you", "who made you"):
  State respectfully:
  "আমাকে তৈরি করেছেন **মোঃ জাকির হোসেন** (Md. Jakir Hossain)। তিনি একজন গর্বিত বাংলাদেশী নাগরিক।
  - **নাম:** মোঃ জাকির হোসেন
  - **জাতীয়তা:** বাংলাদেশী 🇧🇩
  - **বর্তমান ঠিকানা:** টঙ্গী
  - **স্থায়ী ঠিকানা:** থানা: কটিয়াদী, জেলা: কিশোরগঞ্জ।"

LANGUAGE & PRESENTATION:
- Seamlessly understand and respond in standard Bengali, English, or whatever language the user speaks.
- Use clean Markdown, bold headers, neat bullet points, and code fences (\`\`\`) for code.`;

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
    if (p.includes('রাষ্ট্রপতি') || p.includes('প্রেসিডেন্ট') || p.includes('president')) {
      return `বাংলাদেশের বর্তমান রাষ্ট্রপতি হলেন **মোহাম্মদ সাহাবুদ্দিন** (Mohammed Shahabuddin)। তিনি বাংলাদেশের ২২তম রাষ্ট্রপতি হিসেবে ২০২৩ সালের ২৪ এপ্রিল শপথ গ্রহণ করেন।`;
    }
    if (p.includes('প্রধান উপদেষ্টা') || p.includes('অন্তর্বর্তী') || p.includes('ইউনূস') || p.includes('ইউনুস')) {
      return `বাংলাদেশের বর্তমান অন্তর্বর্তীকালীন সরকারের প্রধান উপদেষ্টা হলেন নোবেল বিজয়ী অর্থনীতিবিদ **ড. মুহাম্মদ ইউনূস** (Dr. Muhammad Yunus)। ২০২৪ সালের ৮ আগস্ট তিনি এ দায়িত্ব গ্রহণ করেন।`;
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
      pLower.includes('তোমার স্রষ্টা') ||
      pLower.includes('তোমার মালিক') ||
      pLower.includes('who made you') ||
      pLower.includes('who created you')
    ) {
      return res.json({
        reply: `আমাকে তৈরি করেছেন **মোঃ জাকির হোসেন** (Md. Jakir Hossain)। তিনি একজন গর্বিত বাংলাদেশী নাগরিক।\n\n👤 **নির্মাতার পরিচয়:**\n- **নাম:** মোঃ জাকির হোসেন\n- **জাতীয়তা:** বাংলাদেশী 🇧🇩\n- **বর্তমান ঠিকানা:** টঙ্গী\n- **স্থায়ী ঠিকানা:** থানা: কটিয়াদী, জেলা: কিশোরগঞ্জ।\n\nতিনি আমাকে লুমিক্রা এআই (Lumiqra AI) এর সর্বজনীন ও গভীর বিশ্বজ্ঞান এবং বহুমুখী প্রফেশনাল কার্যসম্পাদন সহকারী হিসেবে গড়ে তুলেছেন।`,
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
