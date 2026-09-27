export interface DailyStat {
  date: string; // YYYY-MM-DD
  visits: number;
  uniqueVisitors: number;
  voicesGenerated: number;
  imagesGenerated: number;
  bgRemoved: number;
  chatMessages: number;
}

export interface ActivityLog {
  id: string;
  type: 'visit' | 'voice' | 'image' | 'bg-remover' | 'chat';
  descriptionBn: string;
  descriptionEn: string;
  details?: string;
  timestamp: number;
}

export interface AdminStatsData {
  totalVisits: number;
  totalUniqueVisitors: number;
  totalVoicesGenerated: number;
  totalImagesGenerated: number;
  totalBgRemoved: number;
  totalChatMessages: number;
  dailyStats: Record<string, DailyStat>;
  recentLogs: ActivityLog[];
  topVoices: Record<string, number>;
  topStyles: Record<string, number>;
}

const STATS_STORAGE_KEY = 'lumiqra_ai_admin_analytics_v1';
const VISITOR_ID_KEY = 'lumiqra_ai_visitor_uuid';

function getTodayKey(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

function getVisitorId(): { id: string; isNew: boolean } {
  try {
    let vid = localStorage.getItem(VISITOR_ID_KEY);
    if (!vid) {
      vid = 'v_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now();
      localStorage.setItem(VISITOR_ID_KEY, vid);
      return { id: vid, isNew: true };
    }
    return { id: vid, isNew: false };
  } catch {
    return { id: 'v_guest_' + Date.now(), isNew: false };
  }
}

export function loadAnalytics(): AdminStatsData {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        totalVisits: parsed.totalVisits || 0,
        totalUniqueVisitors: parsed.totalUniqueVisitors || 0,
        totalVoicesGenerated: parsed.totalVoicesGenerated || 0,
        totalImagesGenerated: parsed.totalImagesGenerated || 0,
        totalBgRemoved: parsed.totalBgRemoved || 0,
        totalChatMessages: parsed.totalChatMessages || 0,
        dailyStats: parsed.dailyStats || {},
        recentLogs: Array.isArray(parsed.recentLogs) ? parsed.recentLogs : [],
        topVoices: parsed.topVoices || {},
        topStyles: parsed.topStyles || {},
      };
    }
  } catch (e) {
    console.warn('Could not load analytics:', e);
  }

  // Initial baseline starter
  return {
    totalVisits: 1,
    totalUniqueVisitors: 1,
    totalVoicesGenerated: 0,
    totalImagesGenerated: 0,
    totalBgRemoved: 0,
    totalChatMessages: 0,
    dailyStats: {},
    recentLogs: [],
    topVoices: {},
    topStyles: {},
  };
}

export function saveAnalytics(data: AdminStatsData) {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(data));
    // Trigger custom window event so Admin dashboard updates in real-time
    window.dispatchEvent(new CustomEvent('lumiqra_analytics_updated', { detail: data }));
  } catch (e) {
    console.warn('Could not save analytics:', e);
  }
}

export function trackVisit(): void {
  const sessionVisited = sessionStorage.getItem('lumiqra_session_logged');
  const { isNew } = getVisitorId();
  const data = loadAnalytics();
  const today = getTodayKey();

  if (!data.dailyStats[today]) {
    data.dailyStats[today] = {
      date: today,
      visits: 0,
      uniqueVisitors: 0,
      voicesGenerated: 0,
      imagesGenerated: 0,
      bgRemoved: 0,
      chatMessages: 0,
    };
  }

  data.totalVisits += 1;
  data.dailyStats[today].visits += 1;

  if (isNew) {
    data.totalUniqueVisitors += 1;
    data.dailyStats[today].uniqueVisitors += 1;
  }

  if (!sessionVisited) {
    sessionStorage.setItem('lumiqra_session_logged', '1');
    const log: ActivityLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      type: 'visit',
      descriptionBn: isNew ? 'নতুন ভিজিটর সাইটে প্রবেশ করেছে' : 'ব্যবহারকারী সাইট পরিদর্শন করেছে',
      descriptionEn: isNew ? 'New visitor arrived on site' : 'Returning visitor opened site',
      details: window.location.pathname,
      timestamp: Date.now(),
    };
    data.recentLogs = [log, ...data.recentLogs].slice(0, 50);
  }

  saveAnalytics(data);
}

export function trackVoiceGenerated(voiceName: string, textSnippet: string): void {
  const data = loadAnalytics();
  const today = getTodayKey();

  if (!data.dailyStats[today]) {
    data.dailyStats[today] = {
      date: today,
      visits: 1,
      uniqueVisitors: 1,
      voicesGenerated: 0,
      imagesGenerated: 0,
      bgRemoved: 0,
      chatMessages: 0,
    };
  }

  data.totalVoicesGenerated += 1;
  data.dailyStats[today].voicesGenerated += 1;

  const key = voiceName || 'Standard Voice';
  data.topVoices[key] = (data.topVoices[key] || 0) + 1;

  const shortText = textSnippet.length > 35 ? textSnippet.substring(0, 35) + '...' : textSnippet;
  const log: ActivityLog = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    type: 'voice',
    descriptionBn: `ভয়েসওভার তৈরি করা হয়েছে (${key})`,
    descriptionEn: `Voice generated (${key})`,
    details: `"${shortText}"`,
    timestamp: Date.now(),
  };
  data.recentLogs = [log, ...data.recentLogs].slice(0, 50);

  saveAnalytics(data);
}

export function trackImageGenerated(styleName: string, promptSnippet: string): void {
  const data = loadAnalytics();
  const today = getTodayKey();

  if (!data.dailyStats[today]) {
    data.dailyStats[today] = {
      date: today,
      visits: 1,
      uniqueVisitors: 1,
      voicesGenerated: 0,
      imagesGenerated: 0,
      bgRemoved: 0,
      chatMessages: 0,
    };
  }

  data.totalImagesGenerated += 1;
  data.dailyStats[today].imagesGenerated += 1;

  const styleKey = styleName || 'Default';
  data.topStyles[styleKey] = (data.topStyles[styleKey] || 0) + 1;

  const shortPrompt = promptSnippet.length > 35 ? promptSnippet.substring(0, 35) + '...' : promptSnippet;
  const log: ActivityLog = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    type: 'image',
    descriptionBn: `নতুন এআই ছবি জেনারেট করা হয়েছে`,
    descriptionEn: `AI Image generated`,
    details: `"${shortPrompt}"`,
    timestamp: Date.now(),
  };
  data.recentLogs = [log, ...data.recentLogs].slice(0, 50);

  saveAnalytics(data);
}

export function trackBgRemoved(mode: 'image' | 'video', fileName: string): void {
  const data = loadAnalytics();
  const today = getTodayKey();

  if (!data.dailyStats[today]) {
    data.dailyStats[today] = {
      date: today,
      visits: 1,
      uniqueVisitors: 1,
      voicesGenerated: 0,
      imagesGenerated: 0,
      bgRemoved: 0,
      chatMessages: 0,
    };
  }

  data.totalBgRemoved += 1;
  data.dailyStats[today].bgRemoved += 1;

  const log: ActivityLog = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    type: 'bg-remover',
    descriptionBn: `ব্যাকগ্রাউন্ড রিমুভ সম্পন্ন (${mode === 'video' ? 'ভিডিও' : 'ছবি'})`,
    descriptionEn: `Background removed (${mode === 'video' ? 'Video' : 'Image'})`,
    details: fileName ? `ফাইল: ${fileName}` : undefined,
    timestamp: Date.now(),
  };
  data.recentLogs = [log, ...data.recentLogs].slice(0, 50);

  saveAnalytics(data);
}

export function trackChatMessage(userPrompt: string): void {
  const data = loadAnalytics();
  const today = getTodayKey();

  if (!data.dailyStats[today]) {
    data.dailyStats[today] = {
      date: today,
      visits: 1,
      uniqueVisitors: 1,
      voicesGenerated: 0,
      imagesGenerated: 0,
      bgRemoved: 0,
      chatMessages: 0,
    };
  }

  data.totalChatMessages += 1;
  data.dailyStats[today].chatMessages += 1;

  const shortQ = userPrompt.length > 35 ? userPrompt.substring(0, 35) + '...' : userPrompt;
  const log: ActivityLog = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    type: 'chat',
    descriptionBn: `এআই চ্যাটে বার্তা পাঠানো হয়েছে`,
    descriptionEn: `AI Chat query received`,
    details: `"${shortQ}"`,
    timestamp: Date.now(),
  };
  data.recentLogs = [log, ...data.recentLogs].slice(0, 50);

  saveAnalytics(data);
}
