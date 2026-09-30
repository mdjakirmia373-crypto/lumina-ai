// Direct Universal Knowledge Base & Real-Time Knowledge Retriever
// Guarantees direct, factual answers across Hadith, Islamic Knowledge, History, Science, and World Facts

export async function getDirectUniversalAnswer(cleanQuery: string): Promise<string | null> {
  const q = cleanQuery.toLowerCase().replace(/[\?\.,!।]/g, '').trim();

  // 1. Bukhari Sharif & Hadith queries
  if (
    q.includes('বুখারী') ||
    q.includes('বুখারি') ||
    q.includes('হাদিস') ||
    q.includes('হাদীস') ||
    q.includes('hadith')
  ) {
    if (q.includes('বুখারী') || q.includes('বুখারি') || q.includes('একটি হাদিস') || q.includes('হাদিস লিখে দেন') || q.includes('হাদিস দেন')) {
      return `সহীহ বুখারী শরীফের প্রথম ও সর্বাপেক্ষা মর্যাদাপূর্ণ হাদিসটি নিচে উল্লেখ করা হলো:

📖 **সহীহুল বুখারী, হাদিস নং: ১**
* **মূল আরবি:** «إنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى»
* **অর্থ:** "নিশ্চয়ই সমস্ত কাজ নিয়ত (সংকল্প)-এর ওপর নির্ভরশীল। আর প্রতিটি মানুষ তাই পাবে যার সে নিয়ত করবে।"

✨ **হাদিসের ব্যাখ্যা ও শিক্ষা:**
- ইসলামের প্রতিটি আমল, ইবাদত এবং সৎকর্ম আল্লাহর দরবারে কবুল হওয়ার পূর্বশর্ত হলো মনের খাঁটি নিয়ত ও ইখলাস।
- মহান ইমাম বুখারী (রহ.) নিয়তের গুরুত্ব বোঝাতে তাঁর সমগ্র কিতাবের শুরুতে এই বরকতময় হাদিসটি স্থাপন করেছেন।`;
    }
  }

  // 2. Hazrat Adam (AS) and Hawwa (AS)
  if (
    q.includes('আদম') &&
    (q.includes('স্ত্রী') || q.includes('স্ত্রীর') || q.includes('বউ') || q.includes('হাওয়া') || q.includes('হাওয়া') || q.includes('সঙ্গী') || q.includes('নাম'))
  ) {
    return `মানবজাতির আদি পিতা প্রথম নবী **হযরত আদম (আলাইহিস সালাম)**-এর স্ত্রীর নাম ছিল **হযরত হাওয়া (আলাইহাস সালাম)**।\n\n📖 **প্রামাণ্য ঐতিহাসিক ও ইসলামী বিবরণ:**\n- মহান আল্লাহ সুবহানাহু ওয়া তায়ালা হযরত আদম (আ.)-এর বাঁ-দিকের পাঁজরের হাড় থেকে হযরত হাওয়া (আ.)-কে তাঁর জীবনসঙ্গিনী হিসেবে সৃষ্টি করেছিলেন।\n- তাঁরা উভয়েই জান্নাতে বসবাস করতেন এবং পরবর্তীতে মহান আল্লাহর নির্ধারিত তকদীর ও হুকুমে পৃথিবীতে আগমন করেন।\n- তাঁদের মাধ্যমে সমগ্র মানবজাতির বিস্তৃতি ও বংশপরম্পরা শুরু হয়।`;
  }

  // 3. Saudi Arabia Ruler / Government
  if (
    q.includes('সৌদি') &&
    (q.includes('শাসন') || q.includes('শাসক') || q.includes('বাদশাহ') || q.includes('প্রধানমন্ত্রী') || q.includes('রাজা') || q.includes('সরকার'))
  ) {
    return `সৌদি আরব একটি **পরম রাজতন্ত্র** (Absolute Monarchy) দ্বারা শাসিত রাষ্ট্র। দেশটির বর্তমান শাসনব্যবস্থা ও শীর্ষ নেতৃত্ব নিম্নরূপ:

👑 **১. রাষ্ট্রপ্রধান (বাদশাহ):**
* **বাদশাহ সালমান বিন আব্দুল আজিজ আল সৌদ** (Salman bin Abdulaziz Al Saud)। তিনি ২০১৫ সালের ২৩ জানুয়ারি থেকে সৌদি আরবের বাদশাহ হিসেবে দায়িত্ব পালন করছেন।

👑 **২. প্রধানমন্ত্রী ও যুবরাজ (ক্রাউন প্রিন্স):**
* **মোহাম্মদ বিন সালমান আল সৌদ** (Mohammed bin Salman - MBS)। তিনি সৌদি আরবের বর্তমান প্রধানমন্ত্রী এবং যুবরাজ। বাদশাহ সালমানের শারীরিক অসুস্থতার কারণে কার্যত তিনিই এখন দেশটির দৈনন্দিন প্রশাসন ও রাষ্ট্রীয় নীতিনির্ধারণের মূল চালিকাশক্তি।

🏛️ **সারসংক্ষেপ:** সৌদি আরবের শাসনক্ষমতা মূলত রাজকীয় পরিবার **'আল সৌদ'**-এর হাতে ন্যস্ত।`;
  }

  // 4. Prophets (নবী-রাসূলগণ)
  if (q.includes('নবী') || q.includes('রাসূল') || q.includes('রাসুল')) {
    if (q.includes('প্রথম')) {
      return `মানবজাতির প্রথম নবী ও প্রথম মানুষ হলেন **হযরত আদম (আলাইহিস সালাম)**।`;
    }
    if (q.includes('সর্বশেষ') || q.includes('শেষ')) {
      return `সর্বশেষ ও সর্বশ্রেষ্ঠ নবী এবং রাসূল হলেন বিশ্বনবী **হযরত মুহাম্মদ (সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম)**। তাঁর পর আর কোনো নবী আসবেন না।`;
    }
    if (q.includes('কয়জন') || q.includes('কতজন') || q.includes('সংখ্যা')) {
      return `ইসলামী বর্ণনা অনুযায়ী মহান আল্লাহ মানবজাতিকে সৎপথ প্রদর্শনের জন্য প্রায় **১,২৪,০০০ (কিংবা ২,২৪,০০০) নবী ও রাসূল** প্রেরণ করেছিলেন। এর মধ্যে পবিত্র কুরআনে ২৫ জন নবীর নাম বিশেষভাবে উল্লেখ রয়েছে।`;
    }
  }

  // 5. Holy Quran (পবিত্র কুরআন)
  if (q.includes('কুরআন') || q.includes('কোরআন')) {
    if (q.includes('পারা') || q.includes('জুয')) {
      return `পবিত্র কুরআনুল কারীমে মোট **৩০টি পারা (জুয)** রয়েছে।`;
    }
    if (q.includes('সূরা') || q.includes('সুরা')) {
      return `পবিত্র কুরআনে মোট **১১৪টি সূরা** রয়েছে (মাক্কী ৮৬টি এবং মাদানী ২৮টি)। সর্ববৃহৎ সূরা হলো সূরা আল-বাকারা এবং ক্ষুদ্রতম সূরা হলো সূরা আল-কাওসার।`;
    }
    if (q.includes('আয়াত') || q.includes(' আয়াত')) {
      return `পবিত্র কুরআনুল কারীমে সর্বাধিক বিশুদ্ধ গণনামতে মোট **৬,২৩৬টি আয়াত** রয়েছে (প্রচলিত গণনামতে ৬৬৬৬টি)।`;
    }
  }

  // 6. Ayatul Kursi
  if (q.includes('আয়াতুল কুরসী') || q.includes('আয়াতুল কুরসি') || q.includes('ayatul kursi')) {
    return `**আয়াতুল কুরসী** হলো পবিত্র কুরআনের দ্বিতীয় সূরা **সূরা আল-বাকারা**-এর **২৫৫ নম্বর আয়াত**। এটিকে কুরআনের সবচেয়ে মর্যাদাপূর্ণ আয়াত বলা হয়।\n\n📖 **বাংলা অর্থ:**\n"আল্লাহ, তিনি ছাড়া অন্য কোনো সত্য উপাস্য নেই; তিনি চিরঞ্জীব, সবকিছুর ধারক। তন্দ্রা বা নিদ্রা তাঁকে স্পর্শ করে না। আসমান ও যমীনে যা কিছু রয়েছে, সবই তাঁর। কে আছে এমন যে তাঁর অনুমতি ছাড়া তাঁর নিকট সুপারিশ করবে? তাদের সম্মুখে ও পেছনে যা কিছু আছে তা তিনি জানেন। আর তাঁর জ্ঞানের কোনো কিছুকেই তারা পরিবেষ্টন করতে পারে না, কেবল যতটুকু তিনি ইচ্ছা করেন তা ছাড়া। তাঁর কুরসী আসমান ও যমীনকে পরিবেষ্টন করে আছে, এবং এ দুটির সংরক্ষণ তাঁর জন্য কোনো ক্লান্তি আনে না। আর তিনিই সর্বোচ্চ, পরম মহান।"`;
  }

  // 7. Rivers & Geography (ভূগোল ও নদী)
  if (q.includes('নদী') || q.includes('নদ')) {
    if (q.includes('বড়') || q.includes('দীর্ঘতম') || q.includes('লম্বা')) {
      return `বিশ্বের দীর্ঘতম নদী হলো **নীল নদ (Nile River)**, যার দৈর্ঘ্য প্রায় ৬,৬৫৩ কিলোমিটার (আফ্রিকা মহাদেশ)।\n\nআর জলপ্রবাহ ও আয়তনের দিক থেকে বিশ্বের বৃহত্তম নদী হলো **আমাজন নদী (Amazon River)** (দক্ষিণ আমেরিকা)।\n\nবাংলাদেশের দীর্ঘতম নদী হলো **মেঘনা** (অথবা সুরমা-মেঘনা নদী ব্যবস্থা)।`;
    }
  }

  // 8. Highest Mountain (সর্বোচ্চ পর্বতশৃঙ্গ)
  if (q.includes('পর্বত') || q.includes('পাহাড়') || q.includes('এভারেস্ট')) {
    if (q.includes('উঁচু') || q.includes('বড়') || q.includes('সর্বোচ্চ')) {
      return `পৃথিবীর সর্বোচ্চ পর্বতশৃঙ্গ হলো **মাউন্ট এভারেস্ট (Mount Everest)**। এর উচ্চতা সমুদ্রপৃষ্ঠ থেকে প্রায় **৮,৮৪৮.৮৬ মিটার (২৯,০৩১.৭ ফুট)**, যা হিমালয় পর্বতমালায় নেপাল ও চীনের সীমান্তে অবস্থিত।`;
    }
  }

  // 9. Bangladesh (বাংলাদেশ সংক্রান্ত প্রশ্ন)
  if (q.includes('বাংলাদেশ') || q.includes('bangladesh')) {
    if (q.includes('রাষ্ট্রপতি') || q.includes('প্রেসিডেন্ট') || q.includes('president')) {
      return `বাংলাদেশের বর্তমান রাষ্ট্রপতি হলেন **মোহাম্মদ সাহাবুদ্দিন** (Mohammed Shahabuddin)। তিনি বাংলাদেশের ২২তম রাষ্ট্রপতি হিসেবে ২০২৩ সালের ২৪ এপ্রিল দায়িত্ব গ্রহণ করেন।`;
    }
    if (q.includes('প্রধান উপদেষ্টা') || q.includes('ইউনূস') || q.includes('ইউনুস') || q.includes('অন্তর্বর্তী')) {
      return `বাংলাদেশের বর্তমান অন্তর্বর্তীকালীন সরকারের প্রধান উপদেষ্টা হলেন শান্তিতে নোবেল বিজয়ী অর্থনীতিবিদ **ড. মুহাম্মদ ইউনূস** (Dr. Muhammad Yunus)। ২০২৪ সালের ৮ আগস্ট তিনি এ দায়িত্ব গ্রহণ করেন।`;
    }
    if (q.includes('স্বাধীনতা') || q.includes('স্বাধীন')) {
      return `বাংলাদেশ **১৯৭১ সালের ২৬ মার্চ** স্বাধীনতার ঘোষণা দেয় এবং দীর্ঘ ৯ মাসের রক্তক্ষয়ী মুক্তিযুদ্ধের পর **১৬ ডিসেম্বর ১৯৭১** চূড়ান্ত বিজয় অর্জন করে একটি সার্বভৌম রাষ্ট্র হিসেবে আত্মপ্রকাশ করে।`;
    }
    if (q.includes('রাজধানী') || q.includes('capital')) {
      return `বাংলাদেশের রাজধানী হলো **ঢাকা**।`;
    }
    if (q.includes('মুদ্রা') || q.includes('টাকা')) {
      return `বাংলাদেশের জাতীয় মুদ্রার নাম হলো **টাকা (BDT - ৳)**।`;
    }
  }

  // 10. Sun
  if (q.includes('সূর্য') && (q.includes('উদিত') || q.includes('উঠে') || q.includes('উঠা') || q.includes('পূর্ব'))) {
    return `সূর্য সর্বদা **পূর্ব দিকে** উদিত হয় এবং **পশ্চিম দিকে** অস্ত যায়।`;
  }

  // 11. Dynamic Wikipedia Search Fallback
  try {
    const cleanSearch = cleanQuery
      .replace(/কি\b|কে\b|কখন\b|কোথায়\b|কেন\b|কী\b|কাকে\b|কয়টি\b|কতটি\b|বলুন\b|জানান\b|সংক্রান্ত\b|সম্পর্কে\b|সম্পর্কিত\b/gi, '')
      .replace(/[\?\.,!।]/g, '')
      .trim();

    if (cleanSearch.length >= 2) {
      // Search Bengali Wikipedia
      const searchUrl = `https://bn.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
        cleanSearch
      )}&format=json&origin=*`;
      const searchRes = await fetch(searchUrl);
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        const firstHit = searchData?.query?.search?.[0];
        if (firstHit && firstHit.pageid) {
          const extUrl = `https://bn.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&pageids=${firstHit.pageid}&format=json&origin=*`;
          const extRes = await fetch(extUrl);
          if (extRes.ok) {
            const extData = await extRes.json();
            const page = extData?.query?.pages?.[firstHit.pageid];
            if (page && page.extract && page.extract.trim().length > 30) {
              const cleaned = page.extract.replace(/\s*\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();
              const sentences = cleaned.split(/(?<=[।\.\?!])\s+/);
              const core = sentences.slice(0, 6).join(' ');
              return `### 💡 **${page.title}**\n\n${core}`;
            }
          }
        }
      }

      // Search English Wikipedia
      const enSearchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
        cleanSearch
      )}&format=json&origin=*`;
      const enRes = await fetch(enSearchUrl);
      if (enRes.ok) {
        const enData = await enRes.json();
        const enHit = enData?.query?.search?.[0];
        if (enHit && enHit.pageid) {
          const enExtUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&pageids=${enHit.pageid}&format=json&origin=*`;
          const enExtRes = await fetch(enExtUrl);
          if (enExtRes.ok) {
            const extData = await enExtRes.json();
            const page = extData?.query?.pages?.[enHit.pageid];
            if (page && page.extract && page.extract.trim().length > 30) {
              const cleaned = page.extract.replace(/\s*\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();
              const sentences = cleaned.split(/(?<=[।\.\?!])\s+/);
              const core = sentences.slice(0, 6).join(' ');
              return `### 💡 **${page.title}**\n\n${core}`;
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn('Knowledge search error:', err);
  }

  return null;
}
