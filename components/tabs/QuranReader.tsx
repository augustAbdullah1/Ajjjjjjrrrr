import React, { useState, useEffect, useRef } from 'react';
import type { Surah, Ayah, Settings, QuranUserData, AyahWithTimestamps, QuranReciter, SurahSummary, AudioPlayerState } from '../../types';
import { getSurahContent, getReciterList, getSurahList } from '../../services/quranService';
import { fetchTafsir, TAFSIR_SOURCES } from '../../services/tafsirService';
import useLocalStorage from '../../hooks/useLocalStorage';
import Spinner from '../ui/Spinner';
import Modal from '../ui/Modal';
import { 
    PlayFilledIcon, PauseFilledIcon, NextTrackIcon, PrevTrackIcon, ReplayIcon, RepeatIcon, 
    CopyIcon, ShareIcon, BookmarkIcon, ReciterIcon, CheckCircleIcon 
} from '../icons/TabIcons';

// Alafasy Image Base64 Constant
const ALAFASY_IMG = 'data:image/jpeg;base64,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';

interface QuranReaderProps {
    surahNumber: number;
    startAtAyah?: number | null;
    onClose: () => void;
    onPlay: (surah: Surah) => void;
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
    reciterId: string;
    setSelectedReciterId: (id: string) => void;
    setReciterName: (name: string) => void;
    onSwitchSurah: (newSurahNumber: number) => void;
    userData: QuranUserData;
    setUserData: React.Dispatch<React.SetStateAction<QuranUserData>>;

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

const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const QuranReader: React.FC<QuranReaderProps> = ({ 
    surahNumber, startAtAyah, onClose, onPlay, settings, setSettings, reciterId, setSelectedReciterId, setReciterName, onSwitchSurah,
    playerState, onClosePlayer, onTogglePlay, onSeek, onNext, onPrev, onReplay, onToggleRepeat,
    userData, setUserData
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

    // Pre-load reciter list
    useEffect(() => {
        getReciterList().then(setReciterList);
    }, []);

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
        if (reciterList.length === 0) {
            setIsReciterListLoading(true);
            getReciterList().then(list => {
                setReciterList(list);
                setIsReciterListLoading(false);
            });
        }
    };

    const handleSelectReciter = async (reciter: QuranReciter) => {
        setIsReciterModalOpen(false);
        setReciterSearchQuery('');
        
        if (!surah) return;

        // If the reciter is different, update it and fetch new content
        if (reciter.id !== reciterId) {
            setReciterName(reciter.name);
            setSelectedReciterId(reciter.id);
            // The main useEffect will refetch and update the surah object.
            // Then we play it.
             const newSurahContent = await getSurahContent(surah.number, reciter.id, false);
            if (newSurahContent && 'ayahs' in newSurahContent) {
                const fullNewSurah = newSurahContent as Surah;
                setSurah(fullNewSurah);
                onPlay(fullNewSurah);
            } else {
                setError('تعذر تحميل صوت القارئ الجديد.');
            }
        } else {
            // If same reciter, just play.
            onPlay(surah);
        }
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

    const getReciterImage = (name: string) => {
        if (name.includes('العفاسي') || name.includes('Alafasy')) {
            return ALAFASY_IMG;
        }
        return null;
    };

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
        reciter.name.toLowerCase().includes(reciterSearchQuery.toLowerCase())
    );
    const filteredSurahs = surahList.filter(s => 
        s.name.includes(surahSearchQuery) || 
        (s.nameSimple && s.nameSimple.toLowerCase().includes(surahSearchQuery.toLowerCase())) ||
        s.englishName.toLowerCase().includes(surahSearchQuery.toLowerCase())
    );

    const isPlayerActiveForThisSurah = playerState.isVisible && playerState.surah?.number === surahNumber;
    const isLoadingAudio = playerState.isLoadingNextPrev || (playerState.duration === 0 && playerState.isPlaying);
    const progressPercent = playerState.duration > 0 ? (playerState.currentTime / playerState.duration) * 100 : 0;

    return (
        <>
        <div 
            className="fixed inset-0 bg-theme-primary z-[100] flex flex-col animate-in fade-in-0 bg-cover bg-center"
            style={{ 
                backgroundImage: `
                    linear-gradient(rgba(var(--theme-card-bg-rgb), 0.7), rgba(var(--theme-card-bg-rgb), 0.9)),
                    url('${ALAFASY_IMG}')`
            }}
        >
            <header className="flex-shrink-0 w-full max-w-4xl mx-auto flex items-center justify-between p-4 bg-theme-primary/80 backdrop-blur-md sticky top-0 z-10">
                 <button onClick={onClose} className="text-2xl font-bold p-2 w-24 text-right">&times;</button>
                <div className="text-center flex-grow">
                    <button onClick={handleOpenSurahModal} className="hover:bg-white/10 p-1 rounded-md transition-colors">
                        <h2 className="text-xl font-bold">{surah?.name || '...'}</h2>
                        <p className="text-xs text-theme-secondary/70">اضغط لتغيير السورة</p>
                    </button>
                </div>
                <div className="w-24"></div>
            </header>
            
            {isPlayerActiveForThisSurah && (
                <div className="w-full max-w-4xl mx-auto px-4 pb-4 sticky top-[calc(4.5rem+env(safe-area-inset-top))] z-10 transition-all duration-300">
                    {/* New Player Card Design */}
                    <div className="relative bg-theme-card/85 backdrop-blur-xl border border-theme-border-color/50 shadow-2xl rounded-[1.5rem] p-4 ring-1 ring-white/5 overflow-hidden animate-in fade-in-0 slide-in-from-top-2">
                        
                        {/* Decoration */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-theme-accent-primary/40 to-transparent"></div>

                        <div className="flex flex-col gap-4">
                            {/* Top Section: Info & Primary Controls */}
                            <div className="flex items-center justify-between">
                                 
                                 {/* Controls Group (Left visually in RTL) */}
                                 <div className="flex items-center gap-3 flex-shrink-0">
                                     <button 
                                         onClick={onTogglePlay} 
                                         className="w-12 h-12 bg-theme-accent-primary text-theme-accent-primary-text rounded-full flex items-center justify-center shadow-lg shadow-theme-accent-primary/25 hover:scale-105 active:scale-95 transition-all"
                                     >
                                         {isLoadingAudio ? <Spinner /> : (playerState.isPlaying ? <PauseFilledIcon className="w-5 h-5" /> : <PlayFilledIcon className="w-5 h-5 pl-0.5" />)}
                                     </button>

                                     <div className="hidden sm:flex items-center gap-1">
                                        <button onClick={onNext} disabled={!playerState.surah || playerState.surah.number >= 114} className="p-2 text-theme-primary hover:text-theme-accent-primary disabled:opacity-30 transition-colors rounded-full hover:bg-white/5">
                                            <NextTrackIcon className="w-5 h-5" />
                                        </button>
                                        <button onClick={onPrev} disabled={!playerState.surah || playerState.surah.number <= 1} className="p-2 text-theme-primary hover:text-theme-accent-primary disabled:opacity-30 transition-colors rounded-full hover:bg-white/5">
                                            <PrevTrackIcon className="w-5 h-5" />
                                        </button>
                                     </div>
                                 </div>

                                 {/* Info Section (Right visually in RTL) */}
                                 <div className="flex-1 text-right pl-2 min-w-0">
                                     <div className="flex items-center justify-end gap-2">
                                         <h3 className="font-bold text-theme-primary text-lg font-amiri truncate">
                                             {playerState.surah?.name || '...'}
                                         </h3>
                                         <span className="text-[10px] font-bold bg-theme-border-color/30 px-1.5 py-0.5 rounded text-theme-secondary border border-theme-border-color/50 flex-shrink-0">
                                             {playerState.surah?.number}
                                         </span>
                                     </div>
                                     <button onClick={handleOpenReciterModal} className="text-xs text-theme-secondary/80 font-medium mt-0.5 truncate hover:text-theme-accent-primary transition-colors flex items-center justify-end gap-1 ml-auto">
                                         {playerState.reciterName} <ReciterIcon className="w-3 h-3 inline" />
                                     </button>
                                 </div>
                            </div>

                            {/* Progress Section */}
                            <div className="flex flex-col gap-1.5">
                                <div
                                    className="w-full h-4 flex items-center cursor-pointer group touch-none select-none py-1"
                                    onClick={(e) => {
                                        if (playerState.duration > 0) {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            const isRTL = document.dir === 'rtl' || document.documentElement.dir === 'rtl';
                                            const clickX = e.clientX - rect.left;
                                            const ratio = isRTL ? (rect.width - clickX) / rect.width : clickX / rect.width;
                                            onSeek(Math.max(0, Math.min(1, ratio)) * playerState.duration);
                                        }
                                    }}
                                >
                                    <div className="w-full h-1.5 bg-theme-border-color/40 rounded-full overflow-hidden relative">
                                        <div 
                                            className="absolute top-0 bottom-0 bg-theme-accent-primary rounded-full shadow-[0_0_8px_rgba(var(--theme-accent-rgb),0.4)]"
                                            style={{ width: `${progressPercent}%` }} 
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between px-1 text-[10px] font-medium text-theme-secondary/70 tabular-nums font-mono">
                                    <span>{formatTime(playerState.duration)}</span>
                                    <div className="flex sm:hidden items-center gap-3">
                                         <button onClick={onNext} className="hover:text-theme-primary"><NextTrackIcon className="w-4 h-4" /></button>
                                         <button onClick={onPrev} className="hover:text-theme-primary"><PrevTrackIcon className="w-4 h-4" /></button>
                                    </div>
                                    <span>{formatTime(playerState.currentTime)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            <main ref={readerContentRef} className="flex-grow overflow-y-auto px-4 py-8 pb-32">
                {isLoading && <div className="absolute inset-0 z-10 bg-theme-primary/50 flex justify-center items-center"><Spinner /></div>}
                {error && <div className="text-center p-8 text-theme-danger">{error}</div>}
                {surah && (
                    <div className="max-w-4xl mx-auto">
                        {surah.number !== 1 && surah.number !== 9 && (
                            <div className="text-center font-amiri text-2xl my-8 tracking-wider">
                                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                            </div>
                        )}
                        <div className="quran-reader-font" style={{ fontSize: `${settings.quranReaderFontSize}rem` }}>
                            {surah.ayahs.map(ayah => (
                                <p 
                                    key={ayah.number}
                                    id={`ayah-${ayah.numberInSurah}`}
                                    onClick={() => handleAyahClick(ayah)} 
                                    className={`p-1 rounded-md cursor-pointer hover:bg-theme-accent-primary/20 transition-colors duration-300 ${selectedAyah?.number === ayah.number ? 'bg-theme-accent-primary/30' : ''} ${highlightedAyah === ayah.numberInSurah ? 'ayah-highlighted' : ''}`}>
                                    {ayah.text}
                                    <span className="ayah-marker">{ayah.numberInSurah}</span>
                                </p>
                            ))}
                        </div>
                    </div>
                )}
            </main>
            
            {!isPlayerActiveForThisSurah && !isLoading && surah && (
                 <div className="fixed bottom-8 left-8 z-20">
                    <button
                        onClick={() => setIsReciterModalOpen(true)}
                        className="w-16 h-16 bg-theme-accent-primary text-theme-accent-primary-text rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-100 shadow-lg shadow-theme-accent-primary/30"
                        aria-label="استماع للسورة"
                    >
                        <PlayFilledIcon className="w-8 h-8 ml-1" />
                    </button>
                </div>
            )}

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
                <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                    {isReciterListLoading ? (
                        <div className="flex justify-center items-center h-24"><Spinner /></div>
                    ) : (
                        filteredReciters.map(reciter => {
                            const isSelected = reciterId === reciter.id;
                            const image = getReciterImage(reciter.name);
                            return (
                                <button 
                                    key={reciter.id} 
                                    onClick={() => handleSelectReciter(reciter)} 
                                    className={`w-full p-3 rounded-xl flex items-center gap-4 transition-all duration-200 text-right ${
                                        isSelected 
                                            ? 'bg-theme-accent-primary text-theme-accent-primary-text shadow-lg shadow-theme-accent-primary/20' 
                                            : 'bg-theme-card hover:bg-theme-border-color text-theme-primary'
                                    }`}
                                >
                                     <div className={`w-12 h-12 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center ${isSelected ? 'ring-2 ring-white/50' : 'bg-black/20'}`}>
                                        {image ? (
                                            <img src={image} alt={reciter.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <ReciterIcon className="w-6 h-6 opacity-70" />
                                        )}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <p className="font-bold text-sm truncate">{reciter.name}</p>
                                    </div>
                                    {isSelected && <CheckCircleIcon className="w-6 h-6 flex-shrink-0" />}
                                </button>
                            );
                        })
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
                             <button
                                key={s.number}
                                onClick={() => handleSelectSurah(s.number)}
                                className="w-full p-3 bg-theme-card hover:bg-theme-border-color rounded-lg flex justify-between items-center transition-colors text-right"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center text-lg font-bold rounded-lg container-luminous surah-number-bg">
                                        {s.number}
                                    </div>
                                    <p className="font-bold text-md text-theme-primary">{s.nameSimple}</p>
                                </div>
                                <p className="text-xs text-theme-secondary text-left">{s.englishNameTranslation}</p>
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