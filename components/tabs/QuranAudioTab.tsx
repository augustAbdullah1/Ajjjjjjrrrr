
import React, { useState, useEffect } from 'react';
import type { Surah, SurahSummary, QuranReciter, Settings, AudioPlayerState } from '../../types';
import { getSurahList, getReciterList, getSurahContent } from '../../services/quranService';
import useLocalStorage from '../../hooks/useLocalStorage';
import Spinner from '../ui/Spinner';

interface QuranAudioTabProps {
    onBack: () => void;
    settings: Settings;
    updateAudioPlayer: (newState: Partial<AudioPlayerState>) => void;
}

const QuranAudioTab: React.FC<QuranAudioTabProps> = ({ onBack, settings, updateAudioPlayer }) => {
    const [view, setView] = useState<'reciters' | 'surahs'>('reciters');
    const [surahList, setSurahList] = useState<SurahSummary[]>([]);
    const [reciterList, setReciterList] = useState<QuranReciter[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedReciterId, setSelectedReciterId] = useLocalStorage<string | number>('selectedReciter', 7);
    const [reciterSearch, setReciterSearch] = useState('');

    useEffect(() => {
        if (view === 'reciters') {
            setIsLoading(true);
            // Fix: getReciterList does not accept any arguments.
            getReciterList().then(list => {
                setReciterList(list);
                setIsLoading(false);
            }).catch(() => setIsLoading(false));
        }
        if (view === 'surahs' && surahList.length === 0) {
            setIsLoading(true);
            getSurahList().then(list => {
                setSurahList(list);
                setIsLoading(false);
            }).catch(() => setIsLoading(false));
        }
    }, [view, surahList]);

    const handleReciterSelect = (reciterId: number | string) => {
        setSelectedReciterId(reciterId);
        setView('surahs');
    };
    
    const handleSurahSelect = async (surahSummary: SurahSummary) => {
        setIsLoading(true);
        updateAudioPlayer({ duration: 0, currentTime: 0 }); // Indicate loading
        const reciterName = reciterList.find(r => r.id === selectedReciterId)?.translated_name.name || '';
        // Fix: getSurahContent's third argument is a boolean `audioOnly`, not `audioApiSource`. Omitting it defaults to `false` which is correct here.
        const surahContent = await getSurahContent(surahSummary.number, selectedReciterId);
        
        if (surahContent) {
             updateAudioPlayer({
                isVisible: true,
                surah: surahContent as Surah,
                reciterName: reciterName,
                audioUrl: surahContent.audioUrl,
                isPlaying: true,
                currentTime: 0,
            });
        } else {
            alert("Failed to load surah content.");
            updateAudioPlayer({ isPlaying: false });
        }
        setIsLoading(false);
    };

    const reciterName = reciterList.find(r => r.id === selectedReciterId)?.translated_name.name || '';
    
    const filteredReciters = reciterList.filter(reciter =>
        reciter.translated_name.name.toLowerCase().includes(reciterSearch.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-4 min-h-[450px] relative">
            {isLoading && <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center"><Spinner /></div>}
            <button onClick={view === 'reciters' ? onBack : () => setView('reciters')} className="absolute top-0 right-0 flex items-center gap-2 font-semibold text-theme-accent">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                رجوع
            </button>
            <h2 className="text-xl font-bold text-center pt-8">
                {view === 'reciters' ? 'اختر القارئ' : `القارئ: ${reciterName}`}
            </h2>
            
            {view === 'reciters' && (
                <input
                    type="text"
                    value={reciterSearch}
                    onChange={(e) => setReciterSearch(e.target.value)}
                    placeholder="ابحث عن قارئ..."
                    className="w-full p-3 bg-black/20 text-white rounded-lg text-right border-2 border-transparent focus:border-theme-accent outline-none"
                />
            )}

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {view === 'reciters' ? (
                    isLoading ? <div className="flex justify-center h-64 items-center"><Spinner /></div> :
                    filteredReciters.map(reciter => (
                        <button key={reciter.id} onClick={() => handleReciterSelect(reciter.id)} className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-lg text-right font-semibold text-lg transition-colors flex items-center gap-4">
                           <span>{reciter.translated_name.name}</span>
                        </button>
                    ))
                ) : (
                    isLoading ? <div className="flex justify-center h-64 items-center"><Spinner /></div> :
                    surahList.map(surah => (
                        <button key={surah.number} onClick={() => handleSurahSelect(surah)} className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-lg text-right font-semibold transition-colors flex justify-between">
                           <span>{surah.number}. {surah.englishName}</span>
                           <span className="font-amiri text-2xl">{surah.name}</span>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
};

export default QuranAudioTab;