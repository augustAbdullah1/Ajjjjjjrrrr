import React, { useState, useEffect, useRef } from 'react';
import type { Surah, Ayah, Settings, QuranUserData, AyahWithTimestamps, QuranReciter, AudioPlayerState } from '../../types';
import { getSurahContent, getReciterList } from '../../services/quranService';
import Spinner from '../ui/Spinner';
import { ChevronLeftIcon, ReciterIcon, StarIcon, BookmarkIcon } from '../icons/TabIcons';

interface QuranReaderProps {
    surahNumber: number;
    startAtAyah?: number | null;
    onClose: () => void;
    settings: Settings;
    reciterId: string;
    playerState: AudioPlayerState;
    userData: QuranUserData;
    setUserData: React.Dispatch<React.SetStateAction<QuranUserData>>;
    onPlay: (surah: Surah) => void;
    setSelectedReciterId: (id: string) => void;
    setReciterName: (name: string) => void;
}

const QuranReader: React.FC<QuranReaderProps> = ({ 
    surahNumber, startAtAyah, onClose, settings, reciterId, playerState, userData, setUserData, onPlay, setSelectedReciterId, setReciterName
}) => {
    const [surah, setSurah] = useState<Surah | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [highlightedAyah, setHighlightedAyah] = useState<number | null>(null);

    useEffect(() => {
        setIsLoading(true);
        getSurahContent(surahNumber, reciterId, false).then(content => {
            if (content) setSurah(content as Surah);
            setIsLoading(false);
        });
    }, [surahNumber, reciterId]);

    useEffect(() => {
        if (!playerState.isPlaying || !surah || playerState.surah?.number !== surahNumber) return;
        const currentTimeMs = playerState.currentTime * 1000;
        const currentAyahObj = (surah.ayahs as AyahWithTimestamps[]).find(ayah => 
            ayah.timestamps && currentTimeMs >= ayah.timestamps.start && currentTimeMs < ayah.timestamps.end
        );
        if (currentAyahObj && highlightedAyah !== currentAyahObj.numberInSurah) {
            setHighlightedAyah(currentAyahObj.numberInSurah);
            document.getElementById(`ayah-${currentAyahObj.numberInSurah}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [playerState.currentTime, playerState.isPlaying, playerState.surah, surah, highlightedAyah]);

    return (
        <div className="fixed inset-0 z-[100] bg-[#111827] flex flex-col">
            {/* Header */}
            <header className="p-4 flex items-center justify-between border-b border-gray-800 bg-[#111827] z-10">
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-white">
                    <ChevronLeftIcon className="w-6 h-6" style={{ transform: 'scaleX(-1)' }} />
                </button>
                <div className="text-center">
                    <h2 className="text-xl font-bold font-amiri text-[#D4AF37]">{surah?.name}</h2>
                </div>
                <div className="w-10"></div> {/* Spacer */}
            </header>

            {/* Content */}
            <main className="flex-grow overflow-y-auto px-4 py-8 custom-scrollbar">
                {isLoading ? <div className="flex justify-center py-40"><Spinner /></div> : (
                    <div className="max-w-2xl mx-auto">
                        {surahNumber !== 1 && surahNumber !== 9 && (
                            <div className="text-center font-amiri text-2xl text-gray-400 mb-8 mt-4">
                                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                            </div>
                        )}

                        <div 
                            className="font-amiri text-justify text-white leading-[2.8] text-2xl"
                            style={{ textAlignLast: 'center' }}
                        >
                            {surah?.ayahs.map(ayah => (
                                <React.Fragment key={ayah.number}>
                                    <span 
                                        id={`ayah-${ayah.numberInSurah}`}
                                        className={`cursor-pointer transition-colors ${highlightedAyah === ayah.numberInSurah ? 'text-[#D4AF37]' : ''}`}
                                    >
                                        {ayah.text}
                                    </span>
                                    <span className="ayah-marker">{ayah.numberInSurah.toLocaleString('ar-EG')}</span>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                )}
            </main>
            
            {/* Play FAB */}
            <div className="fixed bottom-24 left-6 z-20">
                 <button onClick={() => surah && onPlay(surah)} className="w-14 h-14 bg-[#D4AF37] rounded-full flex items-center justify-center text-black shadow-lg hover:bg-yellow-500 transition-colors">
                     {playerState.isPlaying ? <BookmarkIcon className="w-6 h-6" /> : <StarIcon className="w-6 h-6" />}
                 </button>
            </div>
        </div>
    );
};

export default QuranReader;