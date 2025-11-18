

export type Tab = 'counter' | 'duas' | 'quran' | 'home' | 'other';

export type Theme = 'dark' | 'light' | 'amoled';

export interface Dhikr {
  id: number;
  name: string;
  arabic: string;
  virtue?: string;
}

export interface Dua {
  ID: number;
  ARABIC_TEXT: string;
  LANGUAGE_ARABIC_TRANSLATED_TEXT: string;
  TRANSLATED_TEXT?: string;
  count?: number;
  [key: string]: any;
}

export interface DuaCategory {
  ID: number;
  TITLE: string;
  icon: string;
  duas: Dua[];
}

export interface SurahSummary {
  number: number;
  name: string;
  nameSimple?: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
}

export interface Ayah {
    number: number;
    text: string;
    numberInSurah: number;
    juz: number;
    manzil: number;
    page: number;
    ruku: number;
    hizbQuarter: number;
    sajda: boolean;
    timestamps?: {
        start: number;
        end: number;
    };
}
export interface AyahWithTimestamps extends Ayah {
    timestamps: {
        start: number;
        end: number;
    };
}


export interface Surah extends SurahSummary {
    ayahs: (Ayah | AyahWithTimestamps)[];
    audioUrl?: string; // URL for the full surah audio stream
}

export interface PrayerTimes {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;

    Maghrib: string;
    Isha: string;
}

export interface PrayerTimesData {
    timings: PrayerTimes;
    date: {
        readable: string;
        gregorian: {
            date: string;
            day: string;
            weekday: { en: string };
            month: { number: number; en: string };
            year: string;
        };
        hijri: {
            date: string;
            day: string;
            weekday: { en: string; ar: string };
            month: { number: number; en: string; ar: string };
            year: string;
        };
    };
}


export interface Khatmah {
    active: boolean;
    startDate: string | null;
    lastRead: { surah: number; ayah: number } | null;
    targetDays: number;
    history: { date: string, surah: number, ayah: number }[];
}

export type AchievementId = 'dhikr_100' | 'dhikr_1000' | 'dhikr_10000' | 'streak_3' | 'streak_7' | 'streak_30' | 'khatmah_start' | 'morning_adhkar_7' | 'evening_adhkar_7';

export interface Profile {
  name: string;
  bio: string;
  title: string;
  avatarColor: string;
  avatarImage?: string | null;
  favoriteDhikrId: number | null;
  totalCount: number;
  streak: number;
  level: number;
  dailyGoal: number;
  achievements: Record<AchievementId, boolean>;
}

export interface AyahHighlight {
    surah: number;
    ayah: number;
    color: string;
}

export type PrayerMethod = 2 | 3 | 4 | 5 | 8 | 15;

export interface Settings {
    vibration: boolean;
    showAddDhikr: boolean;
    showDhikrSelection: boolean;
    prayerMethod: PrayerMethod;
    quranReaderFontSize: number;
    autoScrollAudio: boolean;
    tapAnywhere: boolean;
    timeFormat: '12h' | '24h';
    prayerNotifications: {
        enabled: boolean;
        fajr: boolean;
        dhuhr: boolean;
        asr: boolean;
        maghrib: boolean;
        isha: boolean;
    };
}

export interface QuranUserData {
    khatmah: Khatmah;
    highlights: Record<string, AyahHighlight>;
}

export interface QuranReciter {
    id: string; // The server URL from mp3quran API
    name: string; // The combined name e.g., "Mishary Alafasy - Murattal"
}

// FIX: Add DownloadedSurah interface for audio library
export interface DownloadedSurah {
    id: string; // Unique ID, e.g., yt-{videoId} or mp3quran-{reciterId}-{surahNumber}
    reciterId: string; // Identifier for the reciter (YouTube query or mp3quran ID)
    surahNumber: number;
    reciterName: string;
    surahName: string;
    audioBlob: Blob;
}

// FIX: Add PopularReciter interface for YouTube download feature
export interface PopularReciter {
    name: string;
    style: string;
    youtubeQuery: string;
    imageUrl: string;
}

export interface Sunnah {
    title: string;
    description: string;
    evidence?: string;
}

export interface SunnahCategory {
    id: number;
    title: string;
    icon: string;
    sunnahs: Sunnah[];
}

export interface AudioPlayerState {
    isVisible: boolean;
    surah: Surah | null;
    reciterName: string;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    isLoadingNextPrev?: boolean;
    isRepeatOn?: boolean;
}

export interface ChallengeParticipant {
  id: string; // 'user' or a timestamp for friends
  name: string;
  count: number;
  isUser: boolean;
  startCount?: number; // For the user, to track progress since challenge start
}

export interface Challenge {
  id: string;
  name: string;
  goal: number;
  participants: ChallengeParticipant[];
  createdAt: string;
}