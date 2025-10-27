export type Tab = 'counter' | 'duas' | 'quran' | 'prayer' | 'qibla' | 'profile' | 'settings';

export type Theme = 'default' | 'purple' | 'blue' | 'green' | 'rose' | 'ocean';

export interface Dhikr {
  id: number;
  name: string;
  arabic: string;
}

export interface Dua {
  ID: number;
  ARABIC_TEXT: string;
  LANGUAGE_ARABIC_TRANSLATED_TEXT: string;
  [key: string]: any; // Allow other properties
}

export interface DuaCategory {
  ID: number;
  TITLE: string;
  duas: Dua[];
}

export interface SurahSummary {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
}

export interface Ayah {
    number: number;
    text: string;
    audio: string; // URL for the audio file of the ayah
    numberInSurah: number;
    juz: number;
    manzil: number;
    page: number;
    ruku: number;
    hizbQuarter: number;
    sajda: boolean;
}

export interface Surah extends SurahSummary {
    ayahs: Ayah[];
}

export interface PrayerTimes {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
}

export interface Khatmah {
    active: boolean;
    startDate: string | null;
    lastRead: { surah: number; ayah: number } | null;
    targetDays: number;
    history: { date: string, surah: number, ayah: number }[];
}

export interface Profile {
  name: string;
  bio: string;
  totalCount: number;
  streak: number;
  level: number;
  rank: number | '-';
  dailyGoal: number;
}

export interface AyahNote {
    surah: number;
    ayah: number;
    text: string;
    date: string;
}

export interface AyahHighlight {
    surah: number;
    ayah: number;
    color: string;
}

export type PrayerMethod = 2 | 3 | 4 | 5 | 8 | 15;

export interface NotificationSettings {
    prayers: boolean;
    reminders: boolean;
    reminderInterval: number; // in minutes
    sound: 'adhan' | 'default' | 'vibrate' | 'silent';
}

export interface Settings {
    vibration: boolean;
    showSetGoal: boolean;
    showAddDhikr: boolean;
    prayerMethod: PrayerMethod;
    notifications: NotificationSettings;
}

export interface QuranUserData {
    khatmah: Khatmah;
    highlights: Record<string, AyahHighlight>;
    notes: Record<string, AyahNote>;
}