// Comprehensive Categories and Subcategories for Lumiqra AI Chat

export interface PromptOption {
  titleBn: string;
  titleEn: string;
  promptBn: string;
  promptEn: string;
}

export interface CapabilityCategory {
  id: string;
  icon: string;
  badgeBn: string;
  badgeEn: string;
  titleBn: string;
  titleEn: string;
  descBn: string;
  descEn: string;
  color: string;
  items: PromptOption[];
}

export const CHAT_CAPABILITY_CATEGORIES: CapabilityCategory[] = [
  {
    id: 'image_recognition_editing',
    icon: '📸',
    badgeBn: 'ছবি স্ক্যান ও প্রফেশনাল এডিট',
    badgeEn: 'Vision & Image Editing',
    titleBn: 'মাল্টিমোডাল ছবি বিশ্লেষণ ও প্রফেশনাল এডিটিং',
    titleEn: 'Multimodal Image Scanning & Pro Editing',
    descBn: 'যেকোনো ছবি স্ক্যান করে নির্ভুল বিবরণ, অবজেক্ট শনাক্তকরণ, টেক্সট রিডিং এবং প্রফেশনাল এআই রূপান্তর/এডিটিং',
    descEn: 'Scan images for ultra-accurate description, OCR text reading, object detection & pro AI image transformation',
    color: 'from-fuchsia-600 to-rose-600',
    items: [
      {
        titleBn: 'ছবি স্ক্যান ও বিস্তারিত বিবরণ',
        titleEn: 'Scan & Describe Image Details',
        promptBn: 'এই ছবিটি স্ক্যান করে এর মূল বিষয়বস্তু, চারপাশের পরিবেশ, দৃশ্যমান বস্তু এবং আলোর বিন্যাস বিশ্লেষণ করে দিন।',
        promptEn: 'Scan and analyze this image thoroughly. Describe the objects, background environment, lighting, and composition.',
      },
      {
        titleBn: 'ছবির ব্যাকগ্রাউন্ড প্রফেশনাল পরিবর্তন',
        titleEn: 'Transform Background Environment',
        promptBn: 'এই ছবির ব্যাকগ্রাউন্ড পরিবর্তন করে একটি আধুনিক সাইবারপাঙ্ক নিয়ন সিটি অথবা মনোরম সূর্যাস্তের সমুদ্রসৈকত দিন।',
        promptEn: 'Edit this image by replacing the background with a cinematic golden-hour sunset and dramatic atmospheric lighting.',
      },
      {
        titleBn: 'আর্ট স্টাইল রূপান্তর (Anime / 3D Render)',
        titleEn: 'Art Style Transformation',
        promptBn: 'এই ছবির মূল চরিত্র ঠিক রেখে এটিকে একটি প্রিমিয়াম অ্যানিমে (Anime) বা 3D পিক্সার স্টাইলের মাস্টারপিসে রূপান্তর করুন।',
        promptEn: 'Transform this photo into a high-detail anime digital painting while preserving facial features and emotion.',
      },
      {
        titleBn: 'ছবি থেকে টেক্সট ও উপাদান নিষ্কাশন (OCR)',
        titleEn: 'Extract Text & Document Scan',
        promptBn: 'এই ছবিতে থাকা সমস্ত লেখা ও টেক্সট নির্ভুলভাবে পড়ে টাইপ করে বাংলায় অর্থসহ বুঝিয়ে দিন।',
        promptEn: 'Extract and transcribe all printed or handwritten text visible in this image accurately.',
      },
    ],
  },
  {
    id: 'chat_qa',
    icon: '💬',
    badgeBn: 'চ্যাট ও প্রশ্নোত্তর',
    badgeEn: 'Chat & Q&A',
    titleBn: 'সাধারণ জ্ঞান ও প্রশ্নোত্তর',
    titleEn: 'General Knowledge & Q&A',
    descBn: 'বিজ্ঞান, ইতিহাস, ভূগোল, প্রযুক্তি, অর্থনীতি, ধর্মীয় তথ্য ও প্রাত্যহিক প্রশ্ন',
    descEn: 'Science, history, geography, tech, economy, religion & daily questions',
    color: 'from-blue-600 to-cyan-500',
    items: [
      {
        titleBn: 'সাধারণ জ্ঞান',
        titleEn: 'General Knowledge',
        promptBn: 'বিশ্বের শীর্ষ ৭টি মানবসৃষ্ট আশ্চর্য এবং তাদের ঐতিহাসিক গুরুত্ব সংক্ষেপে আলোচনা করুন।',
        promptEn: 'Discuss the 7 wonders of the world and their historical significance in detail.',
      },
      {
        titleBn: 'বিজ্ঞান, ইতিহাস ও ভূগোল',
        titleEn: 'Science, History & Geo',
        promptBn: 'পৃথিবীর বায়ুমণ্ডলের ৫টি স্তর এবং মানবজাতির অস্তিত্ব রক্ষায় তাদের ভূমিকা বুঝিয়ে বলুন।',
        promptEn: 'Explain the 5 layers of Earth atmosphere and their role in sustaining human life.',
      },
      {
        titleBn: 'প্রযুক্তি ও AI',
        titleEn: 'Tech & Artificial Intelligence',
        promptBn: 'জেনারেটিভ এআই (Generative AI) ও লার্জ ল্যাঙ্গুয়েজ মডেল (LLM) কীভাবে কাজ করে সহজ ভাষায় বুঝিয়ে বলুন।',
        promptEn: 'Explain how Generative AI and Large Language Models work in simple, intuitive terms.',
      },
      {
        titleBn: 'ব্যবসা ও অর্থনীতি',
        titleEn: 'Business & Economy',
        promptBn: 'মুদ্রাস্ফীতি (Inflation) কী এবং সাধারণ মানুষের জীবনে ও ব্যাংকিং সুদের হারে এর প্রভাব কী?',
        promptEn: 'What is inflation and how does it impact common people and banking interest rates?',
      },
      {
        titleBn: 'ধর্মীয় বিষয়ের তথ্য',
        titleEn: 'Religious Scriptures & History',
        promptBn: 'পবিত্র কুরআনের আয়াতুল কুরসী-র সঠিক বাংলা অর্থ, পটভূমি ও ফজিলত বিশদভাবে বর্ণনা করুন।',
        promptEn: 'Explain the authentic meaning, revelation context, and significance of Ayatul Kursi.',
      },
      {
        titleBn: 'দৈনন্দিন জীবনের প্রশ্ন',
        titleEn: 'Daily Life & Productivity',
        promptBn: 'দৈনন্দিন জীবনে কাজের চাপ ও মানসিক ক্লান্তি দূর করে সর্বোচ্চ প্রোডাক্টিভ থাকার ৫টি বৈজ্ঞানিক কৌশল দিন।',
        promptEn: 'Give me 5 scientifically proven habits to stay productive and reduce stress in daily life.',
      },
    ],
  },
  {
    id: 'content_writing',
    icon: '✍️',
    badgeBn: 'লেখা ও কনটেন্ট',
    badgeEn: 'Writing & Content',
    titleBn: 'লেখা ও কনটেন্ট তৈরি',
    titleEn: 'Writing & Content Creation',
    descBn: 'ফেসবুক পোস্ট, ইউটিউব স্ক্রিপ্ট, ব্লগ আর্টিকেল, গল্প, কবিতা, ছড়া, বিজ্ঞাপন ও ক্যাপশন',
    descEn: 'FB posts, YouTube scripts, blogs, stories, poems, speeches & ad copy',
    color: 'from-purple-600 to-pink-500',
    items: [
      {
        titleBn: 'ফেসবুক পোস্ট',
        titleEn: 'Facebook Post',
        promptBn: 'অনলাইন ক্যারিয়ার ও ফ্রিল্যান্সিংয়ে লেগে থাকার গুরুত্ব নিয়ে একটি অত্যন্ত অনুপ্রেরণাদায়ী ফেসবুক পোস্ট লিখুন (আকর্ষণীয় হুক ও ইমোজি সহ)।',
        promptEn: 'Write an inspiring and engaging Facebook post about consistency and freelancing career growth.',
      },
      {
        titleBn: 'ইউটিউব স্ক্রিপ্ট',
        titleEn: 'YouTube Script',
        promptBn: '"নতুনদের জন্য AI দিয়ে ইনকামের সেরা ৩টি উপায়" বিষয়ে একটি ৮ মিনিটের সম্পূর্ণ ইউটিউব ভিডিও স্ক্রিপ্ট তৈরি করুন।',
        promptEn: 'Write a full 8-minute YouTube video script on "Top 3 Ways Beginners Can Make Income Using AI".',
      },
      {
        titleBn: 'ব্লগ আর্টিকেল',
        titleEn: 'Blog Article',
        promptBn: 'স্মার্টফোন ব্যবহারের সঠিক নিয়ম ও ডিজিটাল ডিটক্সের প্রয়োজনীয়তা নিয়ে একটি এসইও-বান্ধব ব্লগ আর্টিকেল লিখে দিন।',
        promptEn: 'Write a comprehensive SEO-friendly blog article on smartphone addiction and the power of digital detox.',
      },
      {
        titleBn: 'গল্প, কবিতা ও ছড়া',
        titleEn: 'Story, Poem & Rhyme',
        promptBn: 'সততা ও সাহসিকতা নিয়ে শিশুদের জন্য একটি হৃদয়গ্রাহী শিক্ষণীয় গল্প লিখে দিন।',
        promptEn: 'Write an inspiring and heartwarming story about honesty and perseverance for young readers.',
      },
      {
        titleBn: 'মনোগ্রাহী বক্তৃতা',
        titleEn: 'Inspiring Speech',
        promptBn: 'বিশ্ববিদ্যালয় বা কলেজের নবীনবরণ অনুষ্ঠানে তরুণদের নেতৃত্ব ও আত্মবিশ্বাস নিয়ে ৩ মিনিটের একটি উদ্দীপনামূলক বক্তব্য দিন।',
        promptEn: 'Deliver a powerful 3-minute motivational speech on youth leadership for a university orientation.',
      },
      {
        titleBn: 'বিজ্ঞাপনের কপি ও ক্যাপশন',
        titleEn: 'Ad Copy & Product Pitch',
        promptBn: 'একটি প্রিমিয়াম অর্গানিক মধু ও পুষ্টিকর খাদ্য ব্র্যান্ডের জন্য হাই-কনভার্টিং সেলস কপি এবং ট্রেন্ডিং হ্যাশট্যাগ তৈরি করুন।',
        promptEn: 'Write a high-converting sales ad copy and trending hashtags for a premium organic food brand.',
      },
    ],
  },
  {
    id: 'docs_office',
    icon: '📄',
    badgeBn: 'ডকুমেন্ট ও অফিস',
    badgeEn: 'Docs & Office',
    titleBn: 'ডকুমেন্ট ও অফিস কাজ',
    titleEn: 'Documents & Office Work',
    descBn: 'CV/Resume, Cover Letter, আবেদনপত্র, প্রাতিষ্ঠানিক চিঠি, রিপোর্ট ও প্রেজেন্টেশন',
    descEn: 'CV/Resume, Cover Letters, job applications, official letters & reports',
    color: 'from-amber-500 to-orange-600',
    items: [
      {
        titleBn: 'CV / Resume তৈরি',
        titleEn: 'CV & Resume Outline',
        promptBn: 'একজন ফুল-স্ট্যাক ওয়েব ডেভেলপারের জন্য আন্তর্জাতিক মানের আধুনিক ও পেশাদার CV / Resume তৈরি করে দিন।',
        promptEn: 'Create a modern, ATS-compliant professional Resume for a Full-Stack Web Developer.',
      },
      {
        titleBn: 'Cover Letter',
        titleEn: 'Job Cover Letter',
        promptBn: 'সফটওয়্যার কোম্পানিতে জুনিয়র প্রজেক্ট ম্যানেজার পদের জন্য একটি চমৎকার ও আকর্ষণীয় Cover Letter লিখে দিন।',
        promptEn: 'Write an impactful and convincing Cover Letter for a Junior Project Manager position.',
      },
      {
        titleBn: 'অফিসিয়াল আবেদনপত্র',
        titleEn: 'Formal Leave / Request Application',
        promptBn: 'অসুস্থতাজনিত কারণে ৩ দিনের ছুটির মঞ্জুরি চেয়ে অফিস প্রধানের কাছে একটি প্রমিত আবেদনপত্র লিখুন।',
        promptEn: 'Write a formal sick leave application letter to the office managing authority.',
      },
      {
        titleBn: 'বিজনেস রিপোর্ট',
        titleEn: 'Business Report',
        promptBn: 'একটি ই-কমার্স স্টার্টআপের ত্রৈমাসিক বিক্রয় ও গ্রাহক সন্তুষ্টির ওপর একটি প্রফেশনাল এক্সিকিউটিভ রিপোর্ট তৈরি করুন।',
        promptEn: 'Draft an executive business report analyzing quarterly sales and customer retention for an e-commerce startup.',
      },
      {
        titleBn: 'প্রেজেন্টেশন স্লাইড কনটেন্ট',
        titleEn: 'Presentation Deck (PPT)',
        promptBn: '"গ্রিন এনার্জি ও সৌরশক্তির ভবিষ্যৎ" নিয়ে ১০ স্লাইডের পাওয়ারপয়েন্ট প্রেজেন্টেশন আউটলাইন ও পয়েন্ট তৈরি করুন।',
        promptEn: 'Generate a 10-slide PowerPoint presentation outline on "The Future of Solar & Green Energy".',
      },
      {
        titleBn: 'মিটিং নোট ও মিনিটস',
        titleEn: 'Meeting Minutes Template',
        promptBn: 'সাপ্তাহিক প্রজেক্ট রিভিউ মিটিংয়ের অ্যাকশন আইটেম ও সিদ্ধান্তের প্রফেশনাল মিটিং মিনিটস তৈরি করুন।',
        promptEn: 'Draft a professional Meeting Minutes template with action items and key decisions.',
      },
    ],
  },
  {
    id: 'language_translate',
    icon: '🌐',
    badgeBn: 'ভাষা ও অনুবাদ',
    badgeEn: 'Language & Translation',
    titleBn: 'ভাষা ও অনুবাদ',
    titleEn: 'Language & Translation Engine',
    descBn: 'বাংলা ↔ ইংরেজি নিখুঁত অনুবাদ, ব্যাকরণ সংশোধন, লেখার মান উন্নতকরণ ও ব্যাখ্যা',
    descEn: 'Bengali ↔ English accurate translation, grammar fix, polishing & explanation',
    color: 'from-emerald-500 to-teal-600',
    items: [
      {
        titleBn: 'বাংলা ↔ ইংরেজি অনুবাদ',
        titleEn: 'Bengali ↔ English Translation',
        promptBn: 'নিম্নলিখিত প্যারাগ্রাফটি প্রাঞ্জল ও আন্তর্জাতিক মানের প্রফেশনাল ইংরেজিতে অনুবাদ করে দিন: "আমরা বিশ্বাস করি প্রযুক্তি মানুষের কাজের গতি ও মেধার সঠিক মূল্যায়ন নিশ্চিত করবে।"',
        promptEn: 'Translate this text into elegant Bengali keeping the natural nuance and idioms intact.',
      },
      {
        titleBn: 'ব্যাকরণ ও বানান সংশোধন',
        titleEn: 'Grammar & Spell Correction',
        promptBn: 'আমি একটি ইংরেজি ইমেইল ড্রাফট করেছি। এর গ্রামার, বানান এবং বাক্য গঠন শতভাগ সঠিক ও প্রফেশনাল করে দিন।',
        promptEn: 'Proofread and correct all grammatical, structural, and punctuation errors in my writing.',
      },
      {
        titleBn: 'লেখার মান উন্নত করা (Polishing)',
        titleEn: 'Tone & Style Polishing',
        promptBn: 'একটি সাধারণ বক্তব্য বা মেসেজকে কীভাবে একজন অভিজ্ঞ এক্সিকিউটিভের মতো মার্জিত ও আত্মবিশ্বাসী ভাষায় রূপান্তর করা যায়?',
        promptEn: 'Polish this informal message into an executive-level, polite, and persuasive communication.',
      },
      {
        titleBn: 'কঠিন বিষয় সহজ ভাষায় ব্যাখ্যা',
        titleEn: 'Explain Like I\'m 5',
        promptBn: 'কোয়ান্টাম কম্পিউটিং (Quantum Computing) বিষয়টি একজন সাধারণ স্কুল পড়ুয়া শিক্ষার্থীর বোধগম্য করে পানির মতো সহজ করে বুঝিয়ে দিন।',
        promptEn: 'Explain Quantum Computing in super simple, layman terms that anyone can instantly grasp.',
      },
    ],
  },
  {
    id: 'education_study',
    icon: '🎓',
    badgeBn: 'শিক্ষা ও সমাধান',
    badgeEn: 'Education & Study',
    titleBn: 'শিক্ষা ও অ্যাকাডেমিক সমাধান',
    titleEn: 'Education & Academic Solver',
    descBn: 'ধাপে ধাপে গণিত সমাধান, বিজ্ঞান ব্যাখ্যা, অ্যাসাইনমেন্ট ও পরীক্ষার রিভিশন কুইজ',
    descEn: 'Step-by-step math solver, science explainers, assignment help & quizzes',
    color: 'from-indigo-600 to-violet-600',
    items: [
      {
        titleBn: 'গণিতের ধাপে ধাপে সমাধান',
        titleEn: 'Step-by-Step Math Solver',
        promptBn: 'দ্বিঘাত সমীকরণ 2x² + 5x - 3 = 0 এর সমাধান সূত্রসহ ধাপে ধাপে বুঝিয়ে দিন।',
        promptEn: 'Solve the quadratic equation 2x² + 5x - 3 = 0 step-by-step with full formula breakdown.',
      },
      {
        titleBn: 'বিজ্ঞানের মূল সূত্র ব্যাখ্যা',
        titleEn: 'Physics & Chemistry Concept',
        promptBn: 'আইনস্টাইনের ভর-শক্তি সমতুল্যতা সূত্র (E = mc²) এর মূল তাৎপর্য এবং পারমাণবিক শক্তির সাথে এর সম্পর্ক বুঝিয়ে বলুন।',
        promptEn: 'Explain Einstein mass-energy equivalence equation E=mc² and its real-world significance.',
      },
      {
        titleBn: 'অ্যাসাইনমেন্ট সহায়তা ও রূপরেখা',
        titleEn: 'Assignment Outline & Research',
        promptBn: '"পরিবেশ দূষণ ও টেকসই উন্নয়ন" শীর্ষক অ্যাসাইনমেন্টের জন্য ভূমিকা থেকে উপসংহার পর্যন্ত পূর্ণাঙ্গ রূপরেখা তৈরি করুন।',
        promptEn: 'Provide an in-depth assignment outline on "Global Climate Change and Sustainable Solutions".',
      },
      {
        titleBn: 'কুইজ ও স্ব-মূল্যায়ন টেস্ট',
        titleEn: 'Quiz & Practice Questions',
        promptBn: 'মাধ্যমিক পদার্থবিজ্ঞান (গতি ও বল অধ্যায়) থেকে ৫টি বহুনির্বাচনী ও সৃজনশীল প্রশ্ন সঠিক উত্তরসহ বানিয়ে দিন।',
        promptEn: 'Create a 5-question multiple choice test with explanations on Classical Mechanics.',
      },
    ],
  },
  {
    id: 'coding_tech',
    icon: '💻',
    badgeBn: 'প্রোগ্রামিং ও কোড',
    badgeEn: 'Programming & Code',
    titleBn: 'প্রোগ্রামিং ও সফটওয়্যার ইঞ্জিনিয়ারিং',
    titleEn: 'Coding & Software Engineering',
    descBn: 'HTML, CSS, JS, Python, PHP, React, Node.js, SQL, API ও কোড ডিবাগিং',
    descEn: 'HTML/CSS/JS, Python, PHP, React, Node, SQL, API integration & debugging',
    color: 'from-blue-700 to-indigo-700',
    items: [
      {
        titleBn: 'HTML, CSS & JavaScript',
        titleEn: 'Frontend Web Development',
        promptBn: 'টেইলউইন্ড সিএসএস (Tailwind CSS) ব্যবহার করে একটি রেসপন্সিভ এবং মডার্ন হিরো সেকশন কোড লিখে দিন।',
        promptEn: 'Code a modern, mobile-responsive hero component using Tailwind CSS and JavaScript.',
      },
      {
        titleBn: 'Python & ডাটা সায়েন্স',
        titleEn: 'Python Programming',
        promptBn: 'পাইথনে কীভাবে একটি CSV ফাইল রিড করে ডাটা ফিল্টার ও বিশ্লেষণ করতে হয় তার কোডসহ ব্যাখ্যা দিন।',
        promptEn: 'Write a clean Python script to parse a CSV file, clean missing values, and calculate summary statistics.',
      },
      {
        titleBn: 'React & Node.js API',
        titleEn: 'React & Node Backend',
        promptBn: 'React এ কাস্টম হুক (Custom Hook) তৈরি করে REST API থেকে ডাটা ফেচিং এবং লোডিং স্টেট হ্যান্ডেল করার সেরা উপায় কোডসহ দেখান।',
        promptEn: 'Write a robust React custom hook with TypeScript to fetch API data with loading and error states.',
      },
      {
        titleBn: 'SQL ডেটাবেস কোয়েরি',
        titleEn: 'SQL Database Queries',
        promptBn: 'গ্রাহকদের মোট কেনাকাটার পরিমাণের ওপর ভিত্তি করে শীর্ষ ৫ গ্রাহক বের করার একটি অপ্টিমাইজড SQL JOIN কোয়েরি লিখে দিন।',
        promptEn: 'Write an optimized SQL JOIN query to find the top 5 customers with the highest total order amount.',
      },
      {
        titleBn: 'কোড ডিবাগিং ও ব্যাখ্যা',
        titleEn: 'Code Debugging & Optimization',
        promptBn: 'একটি কোডে মেমোরি লিক বা স্লো এক্সিকিউশন দূর করে কীভাবে পারফরম্যান্স ৩ গুণ বাড়ানো যায়?',
        promptEn: 'Show common JavaScript performance pitfalls and how to optimize them for high-speed execution.',
      },
    ],
  },
  {
    id: 'business_marketing',
    icon: '📈',
    badgeBn: 'ব্যবসা ও মার্কেটিং',
    badgeEn: 'Business & Marketing',
    titleBn: 'ব্যবসা, মার্কেটিং ও ব্র্যান্ডিং',
    titleEn: 'Business, Marketing & Growth',
    descBn: 'ব্যবসায়িক পরিকল্পনা, মার্কেটিং আইডিয়া, SEO, Facebook Ads ও ব্র্যান্ডিং',
    descEn: 'Business plans, marketing strategies, SEO content, FB Ads & branding',
    color: 'from-rose-600 to-orange-500',
    items: [
      {
        titleBn: 'ব্যবসায়ের পূর্ণাঙ্গ পরিকল্পনা',
        titleEn: 'Complete Business Plan',
        promptBn: 'একটি অনলাইন ক্লোথিং বা ড্রপশিপিং ব্র্যান্ড শুরু করার জন্য এ টু জেড বিজনেস প্ল্যান এবং বাজেট ফ্রেমওয়ার্ক দিন।',
        promptEn: 'Provide a complete step-by-step business plan and budget breakdown for an online clothing brand.',
      },
      {
        titleBn: 'মার্কেটিং স্ট্র্যাটেজি',
        titleEn: 'Go-to-Market Strategy',
        promptBn: 'কোনো পেইড বিজ্ঞাপন ছাড়াই শুধুমাত্র অর্গানিক সোশ্যাল মিডিয়া মার্কেটিং দিয়ে প্রথম ১০০ কাস্টমার পাওয়ার কৌশল বলুন।',
        promptEn: 'Share an organic growth marketing strategy to get the first 100 paying customers with zero ad spend.',
      },
      {
        titleBn: 'SEO কনটেন্ট ও কিওয়ার্ড',
        titleEn: 'SEO Content & Keywords',
        promptBn: 'গুগল সার্চে প্রথম পাতায় র‍্যাঙ্ক করার জন্য অন-পেজ এসইও (On-Page SEO) এর অপরিহার্য চেকলিস্ট বুঝিয়ে দিন।',
        promptEn: 'Provide an actionable On-Page SEO checklist with heading structures, keywords, and meta tags.',
      },
      {
        titleBn: 'Facebook Ads Copy',
        titleEn: 'Facebook Ad Copywriting',
        promptBn: 'একটি স্কিনকেয়ার বা গ্যাজেট পণ্যের জন্য ৩টি ভিন্ন ভিন্ন অ্যাঙ্গেলের হাই-কনভার্টিং ফেসবুক বিজ্ঞাপন কপি লিখুন।',
        promptEn: 'Write 3 high-converting Facebook ad copies with attention hooks, pain points, and strong call-to-actions.',
      },
      {
        titleBn: 'ব্র্যান্ডিং ও আকর্ষণীয় নাম',
        titleEn: 'Brand Name Suggestion',
        promptBn: 'একটি নতুন আইটি ও কৃত্রিম বুদ্ধিমত্তা স্টার্টআপের জন্য ১০টি ক্যাচি, আধুনিক ও গ্লোবাল মানের ব্র্যান্ড নামের আইডিয়া দিন।',
        promptEn: 'Suggest 10 memorable, modern, and punchy brand names for an AI & IT tech startup.',
      },
    ],
  },
  {
    id: 'ai_prompt_engineering',
    icon: '🤖',
    badgeBn: 'AI সহায়তা',
    badgeEn: 'AI & Automation',
    titleBn: 'AI সহায়তা ও অটোমেশন',
    titleEn: 'AI Prompt & Automation Design',
    descBn: 'Prompt Writing, AI Workflow, চ্যাটবট ডিজাইন, AI টুল সুপারিশ ও অটোমেশন',
    descEn: 'Prompt engineering, AI workflows, chatbot design & tool recommendations',
    color: 'from-violet-600 to-fuchsia-600',
    items: [
      {
        titleBn: 'হাইপার-এফেক্টিভ Prompt Writing',
        titleEn: 'Prompt Engineering Mastery',
        promptBn: 'যেকোনো এআই মডেল থেকে সবচেয়ে নির্ভুল উত্তর পাওয়ার জন্য "মাস্টার প্রম্পট স্ট্রাকচার" তৈরি করার নিয়ম শেখান।',
        promptEn: 'Teach the master prompt framework (Role, Context, Task, Constraints, Output) with practical examples.',
      },
      {
        titleBn: 'AI Workflow ও অটোমেশন',
        titleEn: 'AI Workflow Automation',
        promptBn: 'দৈনন্দিন ইমেইল রেসপন্স এবং সোশ্যাল মিডিয়া পোস্ট অটোমেশন করার একটি সহজ AI ওয়ার্কফ্লো ডিজাইন করুন।',
        promptEn: 'Design an automated AI workflow to triage incoming emails and schedule social media posts.',
      },
      {
        titleBn: 'কাস্টম চ্যাটবট ডিজাইন',
        titleEn: 'Custom Chatbot Architecture',
        promptBn: 'একটি ই-কমার্স ওয়েবসাইটের কাস্টমার সার্ভিসের জন্য একটি কাস্টম চ্যাটবটের প্রম্পট ও রেসপন্স রুলস লিখে দিন।',
        promptEn: 'Write system instructions and behavior guidelines for an e-commerce customer support AI bot.',
      },
      {
        titleBn: 'সেরা AI টুল সুপারিশ',
        titleEn: 'Top AI Tools Recommendations',
        promptBn: 'কনটেন্ট তৈরি, ভিডিও এডিটিং, প্রেজেন্টেশন এবং কোডিংয়ের জন্য ২০২৬ সালের সেরা AI টুলগুলোর তালিকা দিন।',
        promptEn: 'Recommend the top AI tools for content creators, video editors, and software developers.',
      },
    ],
  },
  {
    id: 'analysis_planning',
    icon: '📊',
    badgeBn: 'বিশ্লেষণ ও পরিকল্পনা',
    badgeEn: 'Analysis & Planning',
    titleBn: 'বিশ্লেষণ ও স্ট্র্যাটেজিক পরিকল্পনা',
    titleEn: 'Data Analysis & Roadmaps',
    descBn: 'ডেটা বিশ্লেষণ, তুলনা, সুবিধা-অসুবিধা বিচার, Roadmap ও Project Planning',
    descEn: 'Data insights, comparison matrix, pros & cons, roadmap & project plans',
    color: 'from-blue-600 to-indigo-800',
    items: [
      {
        titleBn: 'গভীর তুলনা (Comparison Matrix)',
        titleEn: 'Detailed Comparison',
        promptBn: 'React বনাম Vue বনাম Next.js — এদের পারফরম্যান্স, লার্নিং কার্ভ এবং ব্যবহারের ক্ষেত্র তুলনা করে বিশ্লেষণ করুন।',
        promptEn: 'Compare React vs Vue vs Next.js across performance, scalability, learning curve, and use cases.',
      },
      {
        titleBn: 'সুবিধা-অসুবিধা (Pros & Cons)',
        titleEn: 'Comprehensive Pros & Cons',
        promptBn: 'রিমোট জব (Work from Home) বনাম অন-সাইট অফিস জব—উভয়ের সুবিধা ও অসুবিধাগুলো বিস্তারিত বিশ্লেষণ করুন।',
        promptEn: 'Analyze the pros and cons of remote work versus in-office corporate work for career growth.',
      },
      {
        titleBn: 'ক্যারিয়ার Roadmap তৈরি',
        titleEn: 'Career Roadmap Design',
        promptBn: 'আগামী ৬ মাসে একদম শূন্য থেকে একজন সফল সাইবার সিকিউরিটি স্পেশালিস্ট হওয়ার ধাপে ধাপে রোডম্যাপ তৈরি করুন।',
        promptEn: 'Design a comprehensive 6-month roadmap to become a certified Cyber Security professional from scratch.',
      },
      {
        titleBn: 'প্রজেক্ট ম্যানেজমেন্ট প্ল্যান',
        titleEn: 'Project Execution Plan',
        promptBn: 'একটি মোবাইল অ্যাপ ডেভেলপমেন্টের জন্য এজাইল (Agile/Scrum) পদ্ধতিতে ৪ সপ্তাহের স্প্রিন্ট পরিকল্পনা তৈরি করুন।',
        promptEn: 'Create a 4-week Agile Scrum sprint plan for launching a mobile application MVP.',
      },
    ],
  },
  {
    id: 'research_information',
    icon: '🔍',
    badgeBn: 'গবেষণা ও তথ্য',
    badgeEn: 'Research & Insights',
    titleBn: 'গবেষণা ও গভীর তথ্য সংক্ষেপ',
    titleEn: 'Research & Deep Synthesis',
    descBn: 'নির্দিষ্ট বিষয়ে গবেষণা, সাম্প্রতিক তথ্য, কোম্পানি বা ব্যক্তি সম্পর্কিত সংক্ষেপ',
    descEn: 'Deep research, factual insights, technology summary & multiple-source synthesis',
    color: 'from-teal-600 to-cyan-700',
    items: [
      {
        titleBn: 'নির্দিষ্ট বিষয়ে প্রামাণ্য গবেষণা',
        titleEn: 'Academic & Factual Inquiry',
        promptBn: 'নবায়নযোগ্য জ্বালানি এবং ইলেকট্রিক যানবাহনের (EV) ব্যাটারি প্রযুক্তির ভবিষ্যৎ নিয়ে একটি গবেষণা সারসংক্ষেপ দিন।',
        promptEn: 'Provide a structured research synthesis on the future of Solid-State EV battery technology.',
      },
      {
        titleBn: 'কোম্পানি ও ব্যক্তি সম্পর্কিত তথ্য',
        titleEn: 'Company / Person Profile',
        promptBn: 'ওপেনএআই (OpenAI) এবং গুগল ডিপমাইন্ড (Google DeepMind)-এর প্রযুক্তিগত বিবর্তন ও সাফল্য বিশ্লেষণ করুন।',
        promptEn: 'Analyze the technological evolution and milestones of OpenAI and Google DeepMind in the AI race.',
      },
      {
        titleBn: 'জটিল তথ্যের সংক্ষেপ (Executive Summary)',
        titleEn: 'Executive Summary',
        promptBn: 'বিশ্ব জলবায়ু শীর্ষ সম্মেলন (COP) এর মূল লক্ষ্য ও ফলাফল ৩টি মূল পয়েন্টে সংক্ষেপে তুলে ধরুন।',
        promptEn: 'Summarize the core goals, challenges, and global agreements of World Climate Summits.',
      },
    ],
  },
  {
    id: 'creators_studio',
    icon: '🎬',
    badgeBn: 'কনটেন্ট ক্রিয়েটর',
    badgeEn: 'Creators Studio',
    titleBn: 'কনটেন্ট ক্রিয়েটরদের জন্য বিশেষ হাব',
    titleEn: 'Content Creator Growth Hub',
    descBn: 'YouTube Ideas, Shorts/Reels Script, Video Title, Description & Growth',
    descEn: 'YouTube ideas, Shorts scripts, CTR titles, descriptions & channel growth',
    color: 'from-red-600 to-pink-600',
    items: [
      {
        titleBn: 'YouTube Shorts ও Reels স্ক্রিপ্ট',
        titleEn: 'Viral Shorts / Reels Script',
        promptBn: 'প্রথম ৩ সেকেন্ডের চোখ ধাঁধানো হুকসহ একটি ৬০ সেকেন্ডের ভাইরাল Shorts/Reels স্ক্রিপ্ট লিখে দিন।',
        promptEn: 'Write a high-retention 60-second Reels/Shorts script with a pattern-interrupt hook.',
      },
      {
        titleBn: 'হাই-সিটিআর (CTR) ভিডিও টাইটেল',
        titleEn: 'High-CTR YouTube Titles',
        promptBn: 'প্রোডাক্টিভিটি ও টাইম ম্যানেজমেন্ট ভিডিওর জন্য ১০টি ক্লিকযোগ্য এবং আকর্ষণীয় ইউটিউব টাইটেল দিন।',
        promptEn: 'Give me 10 click-worthy, curiosity-inducing YouTube titles for a productivity video.',
      },
      {
        titleBn: 'SEO ফ্রেন্ডলি ভিডিও ডেসক্রিপশন',
        titleEn: 'Video SEO Description',
        promptBn: 'টাইমস্ট্যাম্প, সামাজিক মাধ্যম লিংক ও প্রাসঙ্গিক কিওয়ার্ডসহ একটি পূর্ণাঙ্গ ইউটিউব ভিডিও ডেসক্রিপশন তৈরি করুন।',
        promptEn: 'Write a comprehensive, SEO-optimized YouTube video description with timestamps and keywords.',
      },
      {
        titleBn: '৩০ দিনের Content Calendar',
        titleEn: '30-Day Content Calendar',
        promptBn: 'একজন কনটেন্ট ক্রিয়েটরের জন্য ৩০ দিনের ধারাবাহিক ভিডিও টপিক এবং পাবলিশিং শিডিউল ক্যালেন্ডার তৈরি করুন।',
        promptEn: 'Create a strategic 30-day YouTube content calendar with topics, hooks, and formats.',
      },
    ],
  },
  {
    id: 'special_superpowers',
    icon: '🧠',
    badgeBn: 'AI বিশেষ ক্ষমতা',
    badgeEn: 'Superpowers',
    titleBn: 'লুমিক্রা এআই-এর অনন্য বিশেষ ক্ষমতা',
    titleEn: 'Lumiqra AI Unique Superpowers',
    descBn: 'দীর্ঘ আলাপন স্মৃতি, জটিল বিষয় সহজীকরণ, ধাপে ধাপে গাইড ও আইডিয়া থেকে পূর্ণাঙ্গ পরিকল্পনা',
    descEn: 'Context memory, simple breakdown, step-by-step guidance & idea to plan',
    color: 'from-amber-600 to-indigo-600',
    items: [
      {
        titleBn: 'আইডিয়া থেকে সম্পূর্ণ পরিকল্পনা',
        titleEn: 'Turn Idea into Full Masterplan',
        promptBn: 'আমার মাথায় একটি শিক্ষামূলক অ্যাপ তৈরির কাঁচা আইডিয়া আছে। এটিকে একটি পূর্ণাঙ্গ প্রজেক্ট প্ল্যানে রূপান্তর করে দিন।',
        promptEn: 'I have a raw concept for an educational web platform. Turn it into a comprehensive master execution plan.',
      },
      {
        titleBn: 'জটিল বিষয় প্রাঞ্জলভাবে বোঝা',
        titleEn: 'Break Down Complex Concepts',
        promptBn: 'ব্লকচেইন টেকনোলজি (Blockchain) কীভাবে কাজ করে বাস্তব জীবনের উদাহরণের সাহায্যে প্রাঞ্জলভাবে বুঝিয়ে দিন।',
        promptEn: 'Break down blockchain technology using relatable real-world analogies and simple flowcharts.',
      },
      {
        titleBn: 'ধাপে ধাপে বাস্তবায়ন গাইড',
        titleEn: 'Step-by-Step Implementation Guide',
        promptBn: 'আমি একজন নতুন ফ্রিল্যান্সার হিসেবে কীভাবে আমার প্রথম ক্লায়েন্ট নিশ্চিত করব? আমাকে ধাপে ধাপে গাইড করুন।',
        promptEn: 'Guide me step-by-step on how to land my first high-paying freelance client with a cold pitch.',
      },
      {
        titleBn: 'প্রসঙ্গ ধরে দীর্ঘ কথোপকথন',
        titleEn: 'Deep Contextual Conversation',
        promptBn: 'আসুন আমরা একটি নতুন ব্যবসায়িক মডেল নিয়ে ধাপে ধাপে বিস্তারিত আলোচনা ও পর্যালোচনা করি।',
        promptEn: 'Let us have an interactive brainstorm session to design and stress-test an innovative startup idea.',
      },
    ],
  },
];
