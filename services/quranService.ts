
import type { SurahSummary, Surah, QuranReciter, Ayah } from '../types';
import { QURAN_SURAH_LIST } from '../data/surah-list';
import { LOCAL_QURAN_TEXT } from '../data/quran_text';

const QURAN_TEXT_API = 'https://api.alquran.cloud/v1/surah';
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
            return -1;
        };

        formattedReciters.sort((a, b) => {
            const indexA = getPreferredIndex(a.name);
            const indexB = getPreferredIndex(b.name);

            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return a.name.localeCompare(b.name, 'ar');
        });

        recitersCache = formattedReciters;
        return formattedReciters;

    } catch (error) {
        console.error("Error fetching reciter list:", error);
        return [];
    }
};

export const getSurahContent = async (
    surahNumber: number, 
    reciterId: string,
    audioOnly: boolean = false
): Promise<Partial<Surah> | null> => {
    try {
        const serverUrl = reciterId;
        const surahIdPadded = String(surahNumber).padStart(3, '0');
        const audioUrl = `${serverUrl}${surahIdPadded}.mp3`;

        if (audioOnly) {
            return { audioUrl };
        }

        // 1. Get Metadata
        const surahMeta = QURAN_SURAH_LIST.find(s => s.number === surahNumber);
        if (!surahMeta) throw new Error(`Surah ${surahNumber} not found in metadata.`);

        // 2. Fetch Audio Timestamps (Segments) - Hybrid Approach
        // We fetch timestamps for Mishary Rashid (reciter ID 7 on quran.com) as a standard reference.
        let segments: any[] = [];
        try {
            const segmentsResponse = await fetch(`${QURAN_AUDIO_API_QURAN_COM}/quran/recitations/7/by_chapter/${surahNumber}?segments=true`);
            if (segmentsResponse.ok) {
                const segmentsData = await segmentsResponse.json();
                // audio_files[0].segments is array of [ayah_number, start_ms, end_ms]
                segments = segmentsData.audio_files[0]?.segments || [];
            }
        } catch (e) {
            console.log("Timestamps fetch failed (offline mode or API error)", e);
        }

        // 3. Try Fetching Text from API (Primary Source)
        try {
            const response = await fetch(`${QURAN_TEXT_API}/${surahNumber}/quran-uthmani`);
            
            if (response.ok) {
                const data = await response.json();
                const apiAyahs: any[] = data.data.ayahs;

                const ayahs: Ayah[] = apiAyahs.map((apiAyah) => {
                    const segment = segments.find(seg => seg[0] === apiAyah.numberInSurah);
                    return {
                        number: apiAyah.number,
                        text: apiAyah.text,
                        numberInSurah: apiAyah.numberInSurah,
                        juz: apiAyah.juz,
                        manzil: apiAyah.manzil,
                        page: apiAyah.page,
                        ruku: apiAyah.ruku,
                        hizbQuarter: apiAyah.hizbQuarter,
                        sajda: apiAyah.sajda,
                        timestamps: segment ? { start: segment[1], end: segment[2] } : undefined,
                    };
                });

                return {
                    ...surahMeta,
                    ayahs: ayahs,
                    audioUrl: audioUrl,
                };
            } else {
                throw new Error("API Response not OK");
            }
        } catch (apiError) {
            console.warn(`API failed for Surah ${surahNumber}, falling back to local data.`);
            
            // 4. Fallback to Local Data (Offline Mode)
            const localAyahsText = LOCAL_QURAN_TEXT[surahNumber];
            
            if (!localAyahsText) {
                // If we don't have local text for this surah
                throw new Error(`No text found for Surah ${surahNumber} (Online or Offline).`);
            }

            const ayahs = localAyahsText.map((text, index) => {
                const numberInSurah = index + 1;
                const segment = segments.find(seg => seg[0] === numberInSurah);
                
                return {
                    number: 0, // Global number unavailable in simple local data
                    text: text,
                    numberInSurah: numberInSurah,
                    juz: 0, // Metadata unavailable locally without bloating file
                    manzil: 0, 
                    page: 0, 
                    ruku: 0, 
                    hizbQuarter: 0, 
                    sajda: false,
                    timestamps: segment ? { start: segment[1], end: segment[2] } : undefined,
                };
            });

            return {
                ...surahMeta,
                ayahs: ayahs,
                audioUrl: audioUrl,
            };
        }

    } catch (error) {
        console.error(`Error constructing content for surah ${surahNumber}:`, error);
        return null;
    }
};
