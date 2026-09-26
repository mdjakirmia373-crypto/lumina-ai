export type Language = 'bn' | 'en';

export interface StylePreset {
  id: string;
  nameBn: string;
  nameEn: string;
  shortBn?: string;
  shortEn?: string;
  tag?: string;
  promptSuffix: string;
  icon: string;
  colorTheme?: string;
}

export interface AspectRatioOption {
  id: string;
  label: string;
  ratio: string;
  width: number;
  height: number;
  iconName: string;
  descriptionBn: string;
  descriptionEn: string;
}

export interface GeneratedImage {
  id: string;
  prompt: string;
  enhancedPrompt?: string;
  style: string;
  aspectRatio: string;
  width: number;
  height: number;
  imageUrl: string;
  timestamp: number;
  seed: number;
}

export interface VoiceSettings {
  pitch: number;
  rate: number;
  volume: number;
  voiceURI: string;
}

export interface VoiceHistoryItem {
  id: string;
  text: string;
  voiceName: string;
  lang: string;
  timestamp: number;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: number;
}
