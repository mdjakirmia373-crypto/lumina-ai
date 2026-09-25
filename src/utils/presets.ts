import { StylePreset, AspectRatioOption } from '../types';

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'none',
    nameBn: 'ন্যাচারাল / ডিফল্ট',
    nameEn: 'Natural / Default',
    promptSuffix: ', clean crisp image, no watermark, no text, no logo',
    icon: 'Sparkles',
  },
  {
    id: 'photorealistic',
    nameBn: 'ফটোরিয়ালিস্টিক (8K)',
    nameEn: 'Photorealistic (8K)',
    promptSuffix: ', highly detailed, 8k resolution, photorealistic, cinematic lighting, sharp focus, professional photography, Hasselblad camera, clean composition, no watermark, no text, no logo',
    icon: 'Camera',
  },
  {
    id: 'anime',
    nameBn: 'অ্যানিমে / মাঙ্গা',
    nameEn: 'Anime / Manga',
    promptSuffix: ', vibrant anime style, studio ghibli and makoto shinkai aesthetic, gorgeous line art, colorful aesthetic, high quality illustration, clean render, no watermark, no text, no logo',
    icon: 'Palette',
  },
  {
    id: '3d-render',
    nameBn: 'থ্রিডি পিক্সার স্টাইল',
    nameEn: '3D Pixar Style',
    promptSuffix: ', cute 3D Pixar Disney animated movie character render, unreal engine 5, octane render, smooth volumetric lighting, adorable detailing, clean, no watermark, no signature, no logo',
    icon: 'Box',
  },
  {
    id: 'cyberpunk',
    nameBn: 'সাইবারপাঙ্ক নিয়ন',
    nameEn: 'Cyberpunk Neon',
    promptSuffix: ', cyberpunk aesthetic, glowing neon lights, rain reflections, futuristic tech, synthwave vibes, dark atmospheric cinematic, clean, no watermark, no text, no logo',
    icon: 'Zap',
  },
  {
    id: 'digital-art',
    nameBn: 'ডিজিটাল কনসেপ্ট আর্ট',
    nameEn: 'Digital Concept Art',
    promptSuffix: ', epic digital concept art, trending on artstation, masterpiece, intricate details, vivid atmospheric colors, breathtaking composition, clean, no watermark, no text, no signature',
    icon: 'Brush',
  },
  {
    id: 'oil-painting',
    nameBn: 'ভিন্টেজ অয়েল পেইন্টিং',
    nameEn: 'Vintage Oil Painting',
    promptSuffix: ', classical oil on canvas painting, visible textured brushstrokes, fine art masterpiece, dramatic chiaroscuro lighting, clean canvas, no watermark, no text, no signature',
    icon: 'Feather',
  },
  {
    id: 'cinematic',
    nameBn: 'সিনেমাটিক ফিল্ম',
    nameEn: 'Cinematic Film',
    promptSuffix: ', 35mm film still, Kodak Portra 400 color grading, cinematic depth of field, anamorphic lens flare, movie shot, pristine, no watermark, no text, no logo',
    icon: 'Film',
  },
];

export const ASPECT_RATIOS: AspectRatioOption[] = [
  {
    id: '1:1',
    label: '1:1',
    ratio: 'Square',
    width: 1024,
    height: 1024,
    iconName: 'Square',
    descriptionBn: 'স্কয়ার (ইনস্টাগ্রাম, ফেসবুক ও প্রোফাইল)',
    descriptionEn: 'Square (Instagram, FB & Avatars)',
  },
  {
    id: '16:9',
    label: '16:9',
    ratio: 'Landscape',
    width: 1280,
    height: 720,
    iconName: 'RectangleHorizontal',
    descriptionBn: 'ল্যান্ডস্কেপ (ইউটিউব থাম্বনেইল ও ডেস্কটপ)',
    descriptionEn: 'Landscape (YouTube & Desktop)',
  },
  {
    id: '9:16',
    label: '9:16',
    ratio: 'Portrait',
    width: 720,
    height: 1280,
    iconName: 'RectangleVertical',
    descriptionBn: 'পোর্ট্রেট (রিলস, শর্টস ও টিকটক)',
    descriptionEn: 'Portrait (Reels, Shorts & TikTok)',
  },
  {
    id: '4:3',
    label: '4:3',
    ratio: 'Classic',
    width: 1024,
    height: 768,
    iconName: 'Layout',
    descriptionBn: 'ক্লাসিক ফটো (ব্লগ ও ব্যানার)',
    descriptionEn: 'Classic Photo (Blog & Presentations)',
  },
];

export const SAMPLE_PROMPTS = [
  {
    bn: 'সোনালী সূর্যাস্তে সুন্দরবনের গভীর অরণ্যে রাজকীয় রয়েল বেঙ্গল টাইগার, সিনেমাটিক লাইটিং, 8K',
    en: 'Royal Bengal Tiger walking gracefully in the golden sunset mist of Sundarbans mangrove forest, 8k cinematic lighting',
    category: 'Nature',
  },
  {
    bn: 'ভবিষ্যতের সাইবারপাঙ্ক ঢাকা শহর, উড়ন্ত রিকশা ও হাতিরঝিলে রঙিন নিয়ন আলোর প্রতিবিম্ব',
    en: 'Futuristic cyberpunk Dhaka metropolis in 2085, flying high-tech rickshaws, glowing neon reflections on the lake',
    category: 'Sci-Fi',
  },
  {
    bn: 'ঐতিহ্যবাহী লাল বেনারসি শাড়ি পরিহিত হাসিমুখ বাঙালি কনে, রাজকীয় প্রতিকৃতি, সফট ড্রামাটিক আলো',
    en: 'A gorgeous Bengali bride wearing traditional red and gold Benarasi sari, royal wedding portrait, warm ambient lighting',
    category: 'Portrait',
  },
  {
    bn: 'একটি চশমা পরা কিউট তুলতুলে বিড়াল আরামদায়ক বইয়ের ক্যাফেতে কফি খাচ্ছে, 3D অ্যানিমেশন স্টাইল',
    en: 'A cute fluffy cat wearing spectacles sipping hot coffee in a cozy book cafe, cute 3D Pixar character style',
    category: '3D Art',
  },
  {
    bn: 'মেঘের ওপরে ভাসমান প্রাচীন দুর্গের ওপর রামধনু ও ড্রাগন, রূপকথার জাদুকরী ল্যান্ডস্কেপ',
    en: 'Mythical fantasy castle floating above pink and purple clouds with a friendly dragon, sunset dreamscape',
    category: 'Fantasy',
  },
];

export const SAMPLE_VOICE_SCRIPTS = [
  {
    titleBn: 'চ্যানেল ইন্ট্রো (বাংলা)',
    titleEn: 'Channel Intro (Bengali)',
    text: 'স্বাগতম আমাদের চ্যানেলে! প্রতিদিন নতুন সব রোমাঞ্চকর তথ্য ও এআই প্রযুক্তির আপডেট পেতে এখনই সাবস্ক্রাইব করে বেল বাটনটি বাজিয়ে রাখুন।',
    lang: 'bn',
  },
  {
    titleBn: 'অনুপ্রেরণামূলক কথা (Motivational)',
    titleEn: 'Motivational Quote',
    text: 'সাফল্য কোনো আকস্মিক ঘটনা নয়। এটি প্রতিদিনের কঠোর পরিশ্রম, ত্যাগ এবং নিজের স্বপ্নের ওপর অবিচল বিশ্বাসের সম্মিলিত ফল।',
    lang: 'bn',
  },
  {
    titleBn: 'গল্পের সূচনা (Storytelling)',
    titleEn: 'Story Narration',
    text: 'অনেক অনেক বছর আগের কথা, এক রূপকথার রাজ্যে ছিল এক মায়াবী নদী। যার পানি রাতে চাঁদের আলোতে মুক্তোর মতো জ্বলজ্বল করতো...',
    lang: 'bn',
  },
  {
    titleBn: 'YouTube Tech Intro (English)',
    titleEn: 'YouTube Tech Intro (English)',
    text: 'Hey everyone, welcome back to the channel! Today, we are exploring the top futuristic AI tools that will completely transform your workflow.',
    lang: 'en',
  },
  {
    titleBn: 'Product Promo (English)',
    titleEn: 'Product Promo (English)',
    text: 'Experience the future of creation today. Effortlessly generate stunning visuals and lifelike voiceovers in seconds with zero fees.',
    lang: 'en',
  },
];
