import React, { useState, useEffect, useRef } from 'react';
import type { Surah, Ayah, Settings, QuranUserData, AyahWithTimestamps, QuranReciter, SurahSummary, AudioPlayerState } from '../../types';
import { getSurahContent, getReciterList, getSurahList } from '../../services/quranService';
import { fetchTafsir, TAFSIR_SOURCES } from '../../services/tafsirService';
import useLocalStorage from '../../hooks/useLocalStorage';
import Spinner from '../ui/Spinner';
import Modal from '../ui/Modal';
import { PlayFilledIcon, CopyIcon, ShareIcon, BookmarkIcon, ReciterIcon } from '../icons/TabIcons';
import FloatingAudioPlayer from '../FloatingAudioPlayer';

interface QuranReaderProps {
    surahNumber: number;
    startAtAyah?: number | null;
    onClose: () => void;
    onPlay: (surah: Surah) => void;
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
    reciterId: string | number;
    setSelectedReciterId: (id: string | number) => void;
    onSwitchSurah: (newSurahNumber: number) => void;

    // Player Props
    playerState: AudioPlayerState;
    onClosePlayer: () => void;
    onTogglePlay: () => void;
    onSeek: (time: number) => void;
    onNext: () => void;
    onPrev: () => void;
    onReplay: () => void;
    onToggleRepeat: () => void;
}

const QuranReader: React.FC<QuranReaderProps> = ({ 
    surahNumber, startAtAyah, onClose, onPlay, settings, setSettings, reciterId, setSelectedReciterId, onSwitchSurah,
    playerState, onClosePlayer, onTogglePlay, onSeek, onNext, onPrev, onReplay, onToggleRepeat
}) => {
    const [surah, setSurah] = useState<Surah | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAyah, setSelectedAyah] = useState<Ayah | null>(null);
    const [tafsir, setTafsir] = useState<string | null>(null);
    const [isTafsirLoading, setIsTafsirLoading] = useState(false);
    const [selectedTafsirId, setSelectedTafsirId] = useLocalStorage<string>('selectedTafsirId', TAFSIR_SOURCES[0].id);
    const [highlightedAyah, setHighlightedAyah] = useState<number | null>(null);
    const highlightedAyahRef = useRef<number | null>(null);
    
    const [userData, setUserData] = useLocalStorage<QuranUserData>('quranUserData', {
        khatmah: { active: false, startDate: null, lastRead: null, targetDays: 30, history: [] },
        highlights: {},
    });
    const readerContentRef = useRef<HTMLDivElement>(null);
    
    // Reciter Modal State
    const [isReciterModalOpen, setIsReciterModalOpen] = useState(false);
    const [reciterList, setReciterList] = useState<QuranReciter[]>([]);
    const [isReciterListLoading, setIsReciterListLoading] = useState(false);
    const [reciterSearchQuery, setReciterSearchQuery] = useState('');

    // Surah Switcher Modal State
    const [isSurahModalOpen, setIsSurahModalOpen] = useState(false);
    const [surahList, setSurahList] = useState<SurahSummary[]>([]);
    const [surahSearchQuery, setSurahSearchQuery] = useState('');

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        getSurahContent(surahNumber, reciterId, false)
            .then(content => {
                if (content && 'ayahs' in content) {
                    setSurah(content as Surah);
                } else {
                    setError('تعذر تحميل محتوى السورة.');
                }
            })
            .catch(() => setError('حدث خطأ في الشبكة.'))
            .finally(() => setIsLoading(false));
    }, [surahNumber, reciterId]);

    // Effect to scroll to last read ayah
    useEffect(() => {
        if (surah && startAtAyah) {
            setTimeout(() => {
                const element = document.getElementById(`ayah-${startAtAyah}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.classList.add('bg-yellow-400/20');
                    setTimeout(() => element.classList.remove('bg-yellow-400/20'), 2000);
                }
            }, 300);
        }
    }, [surah, startAtAyah]);

     // Effect for auto-scrolling with audio
    useEffect(() => {
        if (
            !settings.autoScrollAudio || !playerState.isPlaying || !surah ||
            surah.number !== playerState.surah?.number || !surah.ayahs.some(a => a.timestamps)
        ) {
            if (highlightedAyah !== null) {
                setHighlightedAyah(null);
            }
            return;
        }

        const ayahsWithTimestamps = surah.ayahs as AyahWithTimestamps[];
        const currentTimeMs = playerState.currentTime * 1000;

        const currentAyah = ayahsWithTimestamps.find(ayah => 
            ayah.timestamps &&
            currentTimeMs >= ayah.timestamps.start &&
            currentTimeMs < ayah.timestamps.end
        );
        
        const currentAyahNum = currentAyah ? currentAyah.numberInSurah : null;

        if (highlightedAyah !== currentAyahNum) {
            setHighlightedAyah(currentAyahNum);
        }

        if (currentAyah && highlightedAyahRef.current !== currentAyahNum) {
            const element = document.getElementById(`ayah-${currentAyahNum}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            highlightedAyahRef.current = currentAyahNum;
        }
    }, [playerState.currentTime, playerState.isPlaying, playerState.surah?.number, surah, settings.autoScrollAudio, highlightedAyah]);

    const handleAyahClick = async (ayah: Ayah) => {
        setSelectedAyah(ayah);
        setIsTafsirLoading(true);
        setTafsir(null);
        const tafsirText = await fetchTafsir(surahNumber, ayah.numberInSurah, selectedTafsirId);
        setTafsir(tafsirText);
        setIsTafsirLoading(false);
    };

    const handleTafsirSourceChange = async (newTafsirId: string) => {
        setSelectedTafsirId(newTafsirId);
        if (selectedAyah) {
            setIsTafsirLoading(true);
            setTafsir(null);
            const tafsirText = await fetchTafsir(surahNumber, selectedAyah.numberInSurah, newTafsirId);
            setTafsir(tafsirText);
            setIsTafsirLoading(false);
        }
    };

    const handleMarkAsRead = () => {
        if (!selectedAyah || !userData.khatmah.active) return;
        setUserData(prev => ({
            ...prev,
            khatmah: {
                ...prev.khatmah,
                lastRead: { surah: surahNumber, ayah: selectedAyah.numberInSurah },
                history: [...(prev.khatmah.history || []), { date: new Date().toISOString(), surah: surahNumber, ayah: selectedAyah.numberInSurah }]
            }
        }));
        setSelectedAyah(null);
    };
    
    const handleOpenReciterModal = () => {
        setIsReciterModalOpen(true);
        setIsReciterListLoading(true);
        getReciterList().then(list => {
            setReciterList(list);
            setIsReciterListLoading(false);
        });
    };

    const handleSelectReciter = async (reciter: QuranReciter) => {
        setIsReciterModalOpen(false);
        setReciterSearchQuery('');
        setIsLoading(true);
        
        setSelectedReciterId(reciter.id);

        const newSurahContent = await getSurahContent(surahNumber, reciter.id, false);
        if (newSurahContent && 'ayahs' in newSurahContent) {
            const fullNewSurah = newSurahContent as Surah;
            setSurah(fullNewSurah);
            onPlay(fullNewSurah);
        } else {
            setError('تعذر تحميل صوت القارئ الجديد.');
        }
        setIsLoading(false);
    };

    const handleOpenSurahModal = () => {
        setIsSurahModalOpen(true);
        if (surahList.length === 0) {
            getSurahList().then(setSurahList);
        }
    };
    
    const handleSelectSurah = async (newSurahNumber: number) => {
        setIsSurahModalOpen(false);
        setSurahSearchQuery('');
        const wasPlaying = playerState.isPlaying && playerState.surah?.number === surahNumber;
    
        // Immediately switch the reader's view to the new surah.
        onSwitchSurah(newSurahNumber);
    
        // If audio was playing, fetch the new surah's content and play it.
        if (wasPlaying) {
            const newSurahContent = await getSurahContent(newSurahNumber, reciterId, false);
            if (newSurahContent && 'ayahs' in newSurahContent) {
                onPlay(newSurahContent as Surah);
            }
        }
    };
    
    const handlePlayCurrentSurah = () => {
        if(surah) {
            onPlay(surah);
        }
    }

    const AyahMenu = () => {
        if (!selectedAyah || !surah) return null;
        return (
             <div className="fixed bottom-0 inset-x-0 z-[110] p-2 animate-in fade-in-0 slide-in-from-bottom-5 pointer-events-none">
                <div className="w-full max-w-md mx-auto bg-theme-tab-bar backdrop-blur-xl p-4 rounded-theme-container shadow-2xl border-2 border-theme flex flex-col gap-3 pointer-events-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center text-base font-bold text-theme-accent">
                        <h3 className="flex-1 text-center">سورة {surah.name} - آية {selectedAyah.numberInSurah}</h3>
                        <button onClick={() => setSelectedAyah(null)} className="w-8 h-8 flex items-center justify-center bg-black/20 rounded-theme-full text-xl hover:bg-black/40 transition-colors">&times;</button>
                    </div>

                    {/* Tafsir Section */}
                    <div className="p-3 bg-black/20 rounded-theme-card text-right">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-theme-accent">التفسير:</span>
                            <select 
                                value={selectedTafsirId} 
                                onChange={(e) => handleTafsirSourceChange(e.target.value)}
                                className="bg-black/30 text-theme-accent border-0 p-1 rounded-md text-xs focus:ring-1 focus:ring-theme-accent-primary text-right"
                            >
                                {TAFSIR_SOURCES.map(source => <option key={source.id} value={source.id} className="bg-theme-secondary text-theme-primary">{source.name}</option>)}
                            </select>
                        </div>
                        <div className="max-h-28 overflow-y-auto pr-1">
                            {isTafsirLoading 
                                ? <div className="flex justify-center p-4"><Spinner /></div> 
                                : <p className="text-sm leading-relaxed text-theme-primary/90">{tafsir}</p>
                            }
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-2 text-center text-sm pt-1">
                        <button onClick={() => { navigator.clipboard.writeText(selectedAyah.text); alert('تم النسخ!'); }} className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-theme-card hover:bg-white/10 transition-colors">
                            <CopyIcon className="w-6 h-6"/>
                            <span>نسخ</span>
                        </button>
                        <button onClick={() => navigator.share && navigator.share({ title: `آية من سورة ${surah.name}`, text: `"${selectedAyah.text}" [${surah.name}:${selectedAyah.numberInSurah}]` })} className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-theme-card hover:bg-white/10 transition-colors">
                            <ShareIcon className="w-6 h-6"/>
                            <span>مشاركة</span>
                        </button>
                        {userData.khatmah.active && (
                            <button onClick={handleMarkAsRead} className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-theme-card hover:bg-white/10 transition-colors">
                                <BookmarkIcon className="w-6 h-6"/>
                                <span>علامة</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };
    
    const filteredReciters = reciterList.filter(reciter => 
        reciter.translated_name.name.includes(reciterSearchQuery)
    );
    const filteredSurahs = surahList.filter(s => 
        s.name.includes(surahSearchQuery) || 
        s.englishName.toLowerCase().includes(surahSearchQuery.toLowerCase())
    );

    const isPlayerActiveForThisSurah = playerState.isVisible && playerState.surah?.number === surahNumber;

    return (
        <>
        <div className="fixed inset-0 bg-theme-primary z-[100] flex flex-col animate-in fade-in-0 quran-reader-theme-override">
            <header className="flex-shrink-0 w-full max-w-4xl mx-auto flex items-center justify-between p-4 bg-theme-primary/80 backdrop-blur-md sticky top-0">
                 <div className="w-24"></div>
                <div className="text-center flex-grow">
                    <button onClick={handleOpenSurahModal} className="hover:bg-white/10 p-1 rounded-md transition-colors">
                        <h2 className="text-xl font-bold">{surah?.name || '...'}</h2>
                        <p className="text-xs text-theme-secondary/70">اضغط لتغيير السورة</p>
                    </button>
                </div>
                <button onClick={onClose} className="text-2xl font-bold p-2 w-24 text-left">&times;</button>
            </header>
             <div className="flex-shrink-0 w-full max-w-4xl mx-auto flex items-center justify-center pt-1 pb-3">
                <button 
                    onClick={handleOpenReciterModal}
                    className="px-4 py-2 bg-white/10 rounded-theme-full flex items-center justify-center gap-2 text-sm text-theme-accent hover:bg-white/20 transition-colors"
                >
                    <ReciterIcon className="w-5 h-5 stroke-current" />
                    <span className="font-semibold">{playerState.reciterName || 'اختر القارئ'}</span>
                </button>
            </div>
            
            <main ref={readerContentRef} className="flex-grow overflow-y-auto px-4 py-2 pb-32">
                {isLoading && <div className="absolute inset-0 z-10 bg-theme-primary/50 flex justify-center items-center"><Spinner /></div>}
                {error && <div className="text-center p-8 text-theme-danger">{error}</div>}
                {surah && (
                    <div className="max-w-4xl mx-auto">
                         <div className="surah-title-banner my-6">
                            <h3 className="font-amiri text-4xl text-theme-accent-primary">{surah.name}</h3>
                        </div>
                        <p className="quran-reader-font" style={{ fontSize: `${settings.quranReaderFontSize}rem` }}>
                            {surah.ayahs.map(ayah => (
                                <span 
                                    key={ayah.number}
                                    id={`ayah-${ayah.numberInSurah}`}
                                    onClick={() => handleAyahClick(ayah)} 
                                    className={`p-1 rounded-md cursor-pointer hover:bg-theme-accent-primary/20 transition-colors duration-300 ${selectedAyah?.number === ayah.number ? 'bg-theme-accent-primary/30' : ''} ${highlightedAyah === ayah.numberInSurah ? 'ayah-highlighted' : ''}`}>
                                    {ayah.text}
                                    <span className="ayah-marker">{ayah.numberInSurah}</span>
                                </span>
                            ))}
                        </p>
                    </div>
                )}
            </main>
            
            <footer className="fixed bottom-0 inset-x-0 z-[105]">
                {isPlayerActiveForThisSurah ? (
                    <FloatingAudioPlayer
                        playerState={playerState}
                        onClose={onClosePlayer}
                        onTogglePlay={onTogglePlay}
                        onSeek={onSeek}
                        onNext={onNext}
                        onPrev={onPrev}
                        onReplay={onReplay}
                        onToggleRepeat={onToggleRepeat}
                     />
                ) : (
                    <div className="p-4 flex justify-center">
                         <button onClick={handlePlayCurrentSurah} className="w-full max-w-sm p-4 bg-theme-accent-primary text-theme-accent-primary-text rounded-theme-full font-bold text-lg flex items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-100">
                             <PlayFilledIcon className="w-6 h-6" />
                             <span>استماع للسورة</span>
                         </button>
                    </div>
                )}
            </footer>


            <AyahMenu />
        </div>

        {/* Reciter Modal */}
        <Modal isOpen={isReciterModalOpen} onClose={() => setIsReciterModalOpen(false)} title="اختر القارئ">
            <div className="flex flex-col gap-3">
                <input 
                    type="text" 
                    value={reciterSearchQuery} 
                    onChange={e => setReciterSearchQuery(e.target.value)} 
                    placeholder="ابحث عن قارئ..." 
                    className="w-full p-2 bg-theme-card text-theme-primary rounded-md text-right border-2 border-transparent focus:border-theme-accent-faded outline-none" 
                />
                <div className="max-h-64 overflow-y-auto space-y-2">
                    {isReciterListLoading ? (
                        <div className="flex justify-center items-center h-24"><Spinner /></div>
                    ) : (
                        filteredReciters.map(reciter => (
                            <button 
                                key={reciter.id} 
                                onClick={() => handleSelectReciter(reciter)} 
                                className={`w-full p-3 text-right font-semibold rounded-lg transition-colors ${String(reciterId) === String(reciter.id) ? 'bg-theme-accent-primary text-theme-accent-primary-text' : 'bg-theme-card hover:bg-theme-border-color'}`}
                            >
                                {reciter.translated_name.name}
                            </button>
                        ))
                    )}
                </div>
            </div>
        </Modal>

        {/* Surah Switcher Modal */}
        <Modal isOpen={isSurahModalOpen} onClose={() => setIsSurahModalOpen(false)} title="اختر السورة">
            <div className="flex flex-col gap-3">
                <input 
                    type="text" 
                    value={surahSearchQuery} 
                    onChange={e => setSurahSearchQuery(e.target.value)} 
                    placeholder="ابحث عن سورة..." 
                    className="w-full p-2 bg-theme-card text-theme-primary rounded-md text-right border-2 border-transparent focus:border-theme-accent-faded outline-none" 
                />
                 <div className="max-h-64 overflow-y-auto space-y-2">
                    {surahList.length === 0 ? <div className="flex justify-center h-24 items-center"><Spinner /></div> :
                        filteredSurahs.map(s => (
                            <button key={s.number} onClick={() => handleSelectSurah(s.number)} className="w-full p-3 text-right font-semibold rounded-lg bg-theme-card hover:bg-theme-border-color flex justify-between">
                               <span>{s.number}. {s.englishName}</span>
                               <span className="font-amiri text-xl">{s.name}</span>
                            </button>
                        ))
                    }
                 </div>
            </div>
        </Modal>
        </>
    );
};

export default QuranReader;