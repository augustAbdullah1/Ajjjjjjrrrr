

import type { SurahSummary, Surah, QuranReciter } from '../types';
import { QURAN_SURAH_LIST } from '../data/surah-list';

const QURAN_TEXT_API_BASE = 'https://api.alquran.cloud/v1';
const QURAN_AUDIO_API_QURAN_COM = 'https://api.quran.com/api/v4';
const MP3QURAN_API_BASE = 'https://www.mp3quran.net/api/v3';

let recitersCache: QuranReciter[] | null = null;

export const getSurahList = async (): Promise<SurahSummary[]> => {
    return Promise.resolve(QURAN_SURAH_LIST);
};

export const getReciterList = async (): Promise<QuranReciter[]> => {
    if (recitersCache) {
        return Promise.resolve(recitersCache);
    }
    try {
        const response = await fetch(`${MP3QURAN_API_BASE}/reciters?language=ar`);
        if (!response.ok) {
            throw new Error('Failed to fetch reciters');
        }
        const data = await response.json();
        
        const formattedReciters: QuranReciter[] = [];
        data.reciters.forEach((reciter: any) => {
            reciter.moshaf.forEach((moshaf: any) => {
                // We only want recitations that have all 114 surahs
                if (parseInt(moshaf.surah_total) === 114) {
                    formattedReciters.push({
                        id: moshaf.server,
                        name: reciter.moshaf.length > 1 ? `${reciter.name} (${moshaf.name})` : reciter.name,
                    });
                }
            });
        });
        
        const preferredOrder = ['العفاسي', 'علي جابر', 'اللحيدان', 'المعيقلي', 'العجمي', 'السديس', 'عبدالباسط', 'المنشاوي'];

        const getPreferredIndex = (name: string): number => {
            for (let i = 0; i < preferredOrder.length; i++) {
                if (name.includes(preferredOrder[i])) {
                    return i;
                }
            }
            return -1; // Not a preferred reciter
        };

        formattedReciters.sort((a, b) => {
            const indexA = getPreferredIndex(a.name);
            const indexB = getPreferredIndex(b.name);

            // Both are preferred, sort by the specified order
            if (indexA !== -1 && indexB !== -1) {
                return indexA - indexB;
            }
            // Only A is preferred, it comes first
            if (indexA !== -1) {
                return -1;
            }
            // Only B is preferred, it comes first
            if (indexB !== -1) {
                return 1;
            }
            // Neither are preferred, sort alphabetically
            return a.name.localeCompare(b.name, 'ar');
        });

        recitersCache = formattedReciters;
        return formattedReciters;

    } catch (error) {
        console.error("Error fetching reciter list:", error);
        // Fallback or error handling
        return [];
    }
};

export const getSurahContent = async (
    surahNumber: number, 
    reciterId: string, // Now it's always a string (the server URL)
    audioOnly: boolean = false
): Promise<Partial<Surah> | null> => {
    try {
        const serverUrl = reciterId;
        const surahIdPadded = String(surahNumber).padStart(3, '0');
        const audioUrl = `${serverUrl}${surahIdPadded}.mp3`;

        if (audioOnly) {
            return { audioUrl };
        }

        const [textResponse, segmentsResponse] = await Promise.all([
            fetch(`${QURAN_TEXT_API_BASE}/surah/${surahNumber}`),
            fetch(`${QURAN_AUDIO_API_QURAN_COM}/quran/recitations/7/by_chapter/${surahNumber}?segments=true`) // Using Mishary for reliable timestamps
        ]);

        if (!textResponse.ok) throw new Error(`Failed to fetch text for surah ${surahNumber}`);
        const textData = await textResponse.json();
        const textEdition = textData.data;
        if (!textEdition) return null;

        let segments: any[] = [];
        if (segmentsResponse.ok) {
            const segmentsData = await segmentsResponse.json();
            segments = segmentsData.audio_files[0]?.segments || [];
        } else {
             console.warn(`Could not fetch timestamps for surah ${surahNumber}`);
        }

        const ayahsWithTimestamps = textEdition.ayahs.map((ayah: any, index: number) => {
            const segment = segments.find(seg => seg[0] === index + 1);
            return {
                ...ayah,
                timestamps: segment ? { start: segment[1], end: segment[2] } : undefined,
            };
        });

        const surah: Surah = {
            ...textEdition,
            ayahs: ayahsWithTimestamps,
            audioUrl: audioUrl,
        };

        return surah;
    } catch (error) {
        console.error(`Error fetching content for surah ${surahNumber}:`, error);
        return null;
    }
};