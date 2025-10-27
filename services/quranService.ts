import type { SurahSummary, Surah, Ayah } from '../types';

const QURAN_API_BASE = 'https://api.alquran.cloud/v1';

let surahListCache: SurahSummary[] | null = null;

export const getSurahList = async (): Promise<SurahSummary[]> => {
    if (surahListCache) {
        return surahListCache;
    }
    try {
        const response = await fetch(`${QURAN_API_BASE}/surah`);
        if (!response.ok) throw new Error('Failed to fetch surah list');
        const data = await response.json();
        if (data.code === 200 && data.data) {
            surahListCache = data.data;
            return data.data;
        }
        return [];
    } catch (error) {
        console.error('Error fetching surah list:', error);
        return [];
    }
};

export const getSurahContent = async (surahNumber: number): Promise<Surah | null> => {
    try {
        // Fetch both text and audio in one call
        const response = await fetch(`${QURAN_API_BASE}/surah/${surahNumber}/editions/quran-simple,ar.alafasy`);
        if (!response.ok) throw new Error(`Failed to fetch content for surah ${surahNumber}`);
        const data = await response.json();
        if (data.code === 200 && data.data && data.data.length === 2) {
            const textEdition = data.data[0];
            const audioEdition = data.data[1];

            // Combine text and audio into a single Surah object
            const combinedSurah: Surah = {
                ...textEdition,
                ayahs: textEdition.ayahs.map((textAyah: Ayah, index: number) => ({
                    ...textAyah,
                    audio: audioEdition.ayahs[index].audio, // Add audio URL from the second edition
                }))
            };
            return combinedSurah;
        }
        return null;
    } catch (error) {
        console.error(`Error fetching content for surah ${surahNumber}:`, error);
        return null;
    }
};