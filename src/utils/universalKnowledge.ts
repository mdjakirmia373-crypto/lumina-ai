// Direct Universal Knowledge Base & Wikipedia Real-Time Knowledge Retriever
// Ensures EVERY question gets a direct, truthful, intelligent answer even during Google Gemini API 503 high-traffic spikes

export async function getDirectUniversalAnswer(cleanQuery: string): Promise<string | null> {
  const q = cleanQuery.toLowerCase().replace(/[\?\.,!।]/g, '').trim();

  // 1. Hazrat Adam (AS) and Hawwa (AS)
  if (
    q.includes('আদম') &&
    (q.includes('স্ত্রী') || q.includes('স্ত্রীর') || q.includes('বউ') || q.includes('হাওয়া') || q.includes('হাওয়া') || q.includes('সঙ্গী') || q.includes('নাম'))
  ) {
    return `মানবজাতির আদি পিতা প্রথম নবী **হযরত আদম (আলাইহিস সালাম)**-এর স্ত্রীর নাম ছিল **হযরত হাওয়া (আলাইহাস সালাম)**।\n\n📖 **প্রামাণ্য ঐতিহাসিক ও ইসলামী বিবরণ:**\n- মহান আল্লাহ সুবহানাহু ওয়া তায়ালা হযরত আদম (আ.)-এর বাঁ-দিকের পাঁজরের হাড় থেকে হযরত হাওয়া (আ.)-কে তাঁর জীবনসঙ্গিনী হিসেবে সৃষ্টি করেছিলেন।\n- তাঁরা উভয়েই জান্নাতে বসবাস করতেন এবং পরবর্তীতে মহান আল্লাহর নির্ধারিত তকদীর ও হুকুমে পৃথিবীতে আগমন করেন।\n- তাঁদের মাধ্যমে সমগ্র মানবজাতির বিস্তৃতি ও বংশপরম্পরা শুরু হয়।`;
  }

  // 2. Prophets (নবী-রাসূলগণ)
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

  // 3. Holy Quran (পবিত্র কুরআন)
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

  // 4. Rivers & Geography (ভূগোল ও নদী)
  if (q.includes('নদী') || q.includes('নদ')) {
    if (q.includes('বড়') || q.includes('দীর্ঘতম') || q.includes('লম্বা')) {
      return `বিশ্বের দীর্ঘতম নদী হলো **নীল নদ (Nile River)**, যার দৈর্ঘ্য প্রায় ৬,৬৫৩ কিলোমিটার (আফ্রিকা মহাদেশ)।\n\nআর জলপ্রবাহ ও আয়তনের দিক থেকে বিশ্বের বৃহত্তম নদী হলো **আমাজন নদী (Amazon River)** (দক্ষিণ আমেরিকা)।\n\nবাংলাদেশের দীর্ঘতম নদী হলো **মেঘনা** (অথবা সুরমা-মেঘনা নদী ব্যবস্থা)।`;
    }
  }

  // 5. Highest Mountain (সর্বোচ্চ পর্বতশৃঙ্গ)
  if (q.includes('পর্বত') || q.includes('পাহাড়') || q.includes('এভারেস্ট')) {
    if (q.includes('উঁচু') || q.includes('বড়') || q.includes('সর্বোচ্চ')) {
      return `পৃথিবীর সর্বোচ্চ পর্বতশৃঙ্গ হলো **মাউন্ট এভারেস্ট (Mount Everest)**। এর উচ্চতা সমুদ্রপৃষ্ঠ থেকে প্রায় **৮,৮৪৮.৮৬ মিটার (২৯,০৩১.৭ ফুট)**, যা হিমালয় পর্বতমালায় নেপাল ও চীনের সীমান্তে অবস্থিত।`;
    }
  }

  // 6. Bangladesh (বাংলাদেশ সংক্রান্ত প্রশ্ন)
  if (q.includes('বাংলাদেশ')) {
    if (q.includes('স্বাধীনতা') || q.includes('স্বাধীন')) {
      return `বাংলাদেশ **১৯৭১ সালের ২৬ মার্চ** স্বাধীনতার ঘোষণা দেয় এবং দীর্ঘ ৯ মাসের রক্তক্ষয়ী মুক্তিযুদ্ধের পর **১৬ ডিসেম্বর ১৯৭১** চূড়ান্ত বিজয় অর্জন করে একটি সার্বভৌম রাষ্ট্র হিসেবে আত্মপ্রকাশ করে।`;
    }
    if (q.includes('রাজধানী')) {
      return `বাংলাদেশের রাজধানী হলো **ঢাকা**।`;
    }
  }

  // 7. Dynamic Wikipedia Search Fallback (for ANY query from across the world)
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
