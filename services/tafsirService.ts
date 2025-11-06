
export const TAFSIR_SOURCES = [
    { id: 'ar.muyassar', name: 'التفسير الميسر' },
    { id: 'ar.ibnkathir', name: 'تفسير ابن كثير' },
    { id: 'ar.qurtubi', name: 'تفسير القرطبي' },
    { id: 'ar.tabari', name: 'تفسير الطبري' },
    { id: 'ar.jalalayn', name: 'تفسير الجلالين' },
];

export const fetchTafsir = async (surahNumber: number, ayahNumberInSurah: number, tafsirId: string): Promise<string> => {
    try {
        const response = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumberInSurah}/${tafsirId}`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('Tafsir API response error:', response.status, errorData);
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.code === 200 && data.data && data.data.text && data.data.text.trim() !== '') {
            return data.data.text;
        } else if (data.code === 200) {
             return "لا يتوفر تفسير لهذه الآية في المصدر المحدد حاليًا.";
        } else {
            console.error('Invalid data format from Tafsir API:', data);
            throw new Error(data.data || 'Invalid data format from Tafsir API');
        }
    } catch (error) {
        console.error("Error fetching Tafsir:", error);
        return "عفوًا، حدث خطأ أثناء جلب التفسير من المصدر المحدد. يرجى التحقق من اتصالك بالإنترنت أو محاولة اختيار مصدر آخر.";
    }
};
