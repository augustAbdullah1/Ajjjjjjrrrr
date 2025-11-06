import type { SurahSummary, Surah, AyahWithTimestamps, QuranReciter } from '../types';

const QURAN_TEXT_API_BASE = 'https://api.alquran.cloud/v1';
const QURAN_AUDIO_API_QURAN_COM = 'https://api.quran.com/api/v4';
const QURAN_AUDIO_API_MP3QURAN = 'https://www.mp3quran.net/api/v3';

const recitersToRemove = new Set([
    'مشاري بن راشد العفاسي',
    'ماجد العنزي', 'محمد البراك', 'الحسيني العزازي', 'معمر الاندونيسي', 'أخيل عبدالحي روا',
    'استاذ زامري', 'ناصر العبيد', 'واصل المذن', 'رضية عبدالرحمن', 'رقية سولونق',
    'سابينة مامات', 'سيدين عبدالرحمن', 'عبدالله فهمي', 'مجمد الحافظ', 'محمد حفص علي',
    'محمد خير النور', 'جمال الدين الزيلعي', 'إبراهيم السعدان', 'يوسف الدغوش', 'وشيار حيدر اربيلي',
    'الوليد الشمسان', 'خالد الشريعي', 'عبدالمجيد الاركاني', 'خالد الوهبي', 'محمد رفعت',
    'عبدالله الموسى', 'صلاح مصلي', 'عمر الدريويز', 'أحمد ديبان', 'وشيد بلعانية',
    'احمد عيسى المعصراوي', 'زكريا حمامة', 'هارون بقائي', 'عبدالملك العسكر', 'عبدالله المشعل',
    'عبدالعزيز سحيم', 'سامي الحسن', 'صلاح الهاشم', 'عبدالبارئ محمد', 'عبدالله البريمي',
    'أحمد سعود', 'علي ابو هاشم', 'فهد العتيبي', 'لافي العوني', 'وليد الدليمي'
]);

let surahListCache: SurahSummary[] | null = null;
let reciterListCache: QuranReciter[] | null = null;

export const getSurahList = async (): Promise<SurahSummary[]> => {
    if (surahListCache) {
        return surahListCache;
    }
    try {
        const response = await fetch(`${QURAN_TEXT_API_BASE}/surah`);
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

export const getReciterList = async (): Promise<QuranReciter[]> => {
    if (reciterListCache) {
        return reciterListCache;
    }
    try {
        const [quranComResponse, mp3QuranResponse] = await Promise.all([
            fetch(`${QURAN_AUDIO_API_QURAN_COM}/resources/recitations?language=ar`),
            fetch(`${QURAN_AUDIO_API_MP3QURAN}/reciters?language=ar`)
        ]);

        const recitersMap = new Map<string, QuranReciter>();

        // Process quran.com reciters first (priority for duplicates)
        if (quranComResponse.ok) {
            const data = await quranComResponse.json();
            if (data.recitations) {
                data.recitations.forEach((r: any) => {
                    const name = r.translated_name.name;
                    if (!recitersMap.has(name)) {
                        recitersMap.set(name, r);
                    }
                });
            }
        }

        // Process mp3quran.net reciters, adding only if they don't already exist
        if (mp3QuranResponse.ok) {
            const data = await mp3QuranResponse.json();
            if(data.reciters && Array.isArray(data.reciters)) {
                 data.reciters
                    .filter((r: any) => r.moshaf && r.moshaf.length > 0 && !recitersToRemove.has(r.name))
                    .forEach((r: any) => {
                        const name = r.name;
                        if (!recitersMap.has(name)) {
                            const reciter: QuranReciter = {
                                id: r.moshaf[0].server,
                                name: r.name,
                                recitation_style: r.moshaf[0].name,
                                translated_name: { name: r.name, language_name: 'ar' }
                            };
                            recitersMap.set(name, reciter);
                        }
                    });
            }
        }
        
        const mergedReciters = Array.from(recitersMap.values());
        reciterListCache = mergedReciters;
        return mergedReciters;

    } catch (error) {
        console.error('Error fetching and merging reciter lists:', error);
        return [];
    }
};

export const getSurahContent = async (
    surahNumber: number, 
    reciterId: number | string, 
    audioOnly: boolean = false
): Promise<Partial<Surah> | null> => {
    try {
        // Fetch audio URL based on the type of reciter ID
        let audioUrl: string | undefined;
        if (typeof reciterId === 'number') { // From quran.com
            const audioResponse = await fetch(`${QURAN_AUDIO_API_QURAN_COM}/chapter_recitations/${reciterId}/${surahNumber}`);
            if (audioResponse.ok) {
                const audioData = await audioResponse.json();
                audioUrl = audioData.audio_file?.audio_url;
            } else {
                 console.warn(`Could not fetch audio from quran.com for surah ${surahNumber}, reciter ${reciterId}`);
            }
        } else { // From mp3quran.net
            const serverUrl = reciterId as string;
            const surahIdPadded = String(surahNumber).padStart(3, '0');
            audioUrl = `${serverUrl}/${surahIdPadded}.mp3`;
        }

        if (audioOnly) {
            return { audioUrl };
        }

        // Text and timestamps are always fetched from the same reliable sources
        const [textResponse, segmentsResponse] = await Promise.all([
            fetch(`${QURAN_TEXT_API_BASE}/surah/${surahNumber}`),
            fetch(`${QURAN_AUDIO_API_QURAN_COM}/quran/recitations/7/by_chapter/${surahNumber}?segments=true`) // Using a default reliable reciter for timestamps
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