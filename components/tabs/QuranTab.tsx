import React, { useState, useEffect, useRef } from 'react';
import { getSurahList, getSurahContent } from '../../services/quranService';
import useLocalStorage from '../../hooks/useLocalStorage';
import type { SurahSummary, Surah, QuranUserData, Ayah } from '../../types';
import Spinner from '../ui/Spinner';
import Modal from '../ui/Modal';

// --- Helper Functions ---
const getAyahKey = (surah: number, ayah: number) => `${surah}-${ayah}`;

// --- Ayah Action Menu Component ---
const AyahActionMenu: React.FC<{
    ayah: { surah: number, numberInSurah: number, text: string };
    onClose: () => void;
    onAction: (action: 'highlight' | 'note' | 'share') => void;
}> = ({ ayah, onClose, onAction }) => {
    
    const handleShare = async () => {
        const shareText = `${ayah.text} (القرآن ${ayah.surah}:${ayah.numberInSurah})`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `آية من القرآن الكريم`,
                    text: shareText,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            navigator.clipboard.writeText(shareText);
            alert('تم نسخ الآية إلى الحافظة');
        }
        onClose();
    };

    return (
         <div className="fixed bottom-0 left-0 right-0 bg-theme-secondary p-4 rounded-t-2xl shadow-lg z-[150] animate-in slide-in-from-bottom-5">
            <div className="flex justify-around">
                <button onClick={() => onAction('highlight')} className="flex flex-col items-center gap-1 text-theme-accent"><div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center">🎨</div><span>تمييز</span></button>
                <button onClick={() => onAction('note')} className="flex flex-col items-center gap-1 text-theme-accent"><div className="w-12 h-12 bg-blue-400/20 rounded-full flex items-center justify-center">📝</div><span>ملاحظة</span></button>
                <button onClick={handleShare} className="flex flex-col items-center gap-1 text-theme-accent"><div className="w-12 h-12 bg-green-400/20 rounded-full flex items-center justify-center">🔗</div><span>مشاركة</span></button>
            </div>
         </div>
    );
};


// --- Quran Reader Component ---
const QuranReader: React.FC<{
    surah: Surah;
    onClose: () => void;
    userData: QuranUserData;
    onUserDataChange: (data: QuranUserData) => void;
}> = ({ surah, onClose, userData, onUserDataChange }) => {
    const [selectedAyah, setSelectedAyah] = useState<Ayah | null>(null);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [noteText, setNoteText] = useState('');
    
    // Audio Player State
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPlayingAyah, setCurrentPlayingAyah] = useState<number | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);


    const handleAyahClick = (ayah: Ayah) => {
        setSelectedAyah(ayah);
        // FIX: Used surah.number instead of ayah.number for the surah number.
        onUserDataChange({
            ...userData,
            khatmah: { ...userData.khatmah, lastRead: { surah: surah.number, ayah: ayah.numberInSurah } }
        });
    };
    
    const handleAction = (action: 'highlight' | 'note' | 'share') => {
        if (!selectedAyah) return;
        // FIX: Used surah.number instead of selectedAyah.number for the surah number.
        const ayahKey = getAyahKey(surah.number, selectedAyah.numberInSurah);
        
        if (action === 'highlight') {
            const newHighlights = { ...userData.highlights };
            if (newHighlights[ayahKey]) {
                delete newHighlights[ayahKey]; // Un-highlight
            } else {
                // FIX: Used surah.number instead of selectedAyah.number for the surah number.
                newHighlights[ayahKey] = { surah: surah.number, ayah: selectedAyah.numberInSurah, color: 'yellow' };
            }
            onUserDataChange({ ...userData, highlights: newHighlights });
            setSelectedAyah(null);
        }
        
        if (action === 'note') {
            setNoteText(userData.notes[ayahKey]?.text || '');
            setIsNoteModalOpen(true);
        }
    };
    
    const saveNote = () => {
        if (!selectedAyah) return;
        // FIX: Used surah.number instead of selectedAyah.number for the surah number.
        const ayahKey = getAyahKey(surah.number, selectedAyah.numberInSurah);
        const newNotes = { ...userData.notes };
        if (noteText.trim()) {
            // FIX: Used surah.number instead of selectedAyah.number for the surah number.
            newNotes[ayahKey] = { surah: surah.number, ayah: selectedAyah.numberInSurah, text: noteText, date: new Date().toISOString() };
        } else {
            delete newNotes[ayahKey];
        }
        onUserDataChange({ ...userData, notes: newNotes });
        setIsNoteModalOpen(false);
        setSelectedAyah(null);
    };

    // --- Audio Logic ---
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onEnded = () => {
            if (currentPlayingAyah !== null) {
                const nextAyahIndex = surah.ayahs.findIndex(a => a.numberInSurah === currentPlayingAyah);
                if (nextAyahIndex > -1 && nextAyahIndex < surah.ayahs.length - 1) {
                    playAyah(surah.ayahs[nextAyahIndex + 1]);
                } else {
                    setCurrentPlayingAyah(null);
                    setIsPlaying(false);
                }
            }
        };
        const onTimeUpdate = () => setCurrentTime(audio.currentTime);
        const onLoadedData = () => setDuration(audio.duration);
        
        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);
        audio.addEventListener('ended', onEnded);
        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('loadedmetadata', onLoadedData);

        return () => {
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
            audio.removeEventListener('ended', onEnded);
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('loadedmetadata', onLoadedData);
        };
    }, [currentPlayingAyah, surah.ayahs]);
    
    useEffect(() => {
        if (currentPlayingAyah && contentRef.current) {
            const element = contentRef.current.querySelector(`[data-ayah-num="${currentPlayingAyah}"]`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [currentPlayingAyah]);

    const playAyah = (ayah: Ayah) => {
        if (audioRef.current) {
            audioRef.current.src = ayah.audio;
            audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            setCurrentPlayingAyah(ayah.numberInSurah);
        }
    };

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current?.pause();
        } else {
            if (currentPlayingAyah === null) {
                playAyah(surah.ayahs[0]);
            } else {
                audioRef.current?.play();
            }
        }
    };
    
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <>
            <div className="fixed inset-0 bg-theme-gradient p-4 flex flex-col z-[100] text-theme-text animate-in fade-in-0">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{surah.name}</h2>
                    <button onClick={onClose} className="text-2xl font-bold w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">&times;</button>
                </div>
                <div ref={contentRef} className="flex-1 overflow-y-auto font-amiri text-2xl leading-loose text-right space-y-2 p-4 bg-black/10 rounded-lg mb-24">
                    {surah.ayahs.map(ayah => {
                        const ayahKey = getAyahKey(surah.number, ayah.numberInSurah);
                        const isHighlighted = !!userData.highlights[ayahKey];
                        const hasNote = !!userData.notes[ayahKey];
                        const isPlaying = currentPlayingAyah === ayah.numberInSurah;
                        return (
                            <span key={ayah.number} data-ayah-num={ayah.numberInSurah} onClick={() => handleAyahClick(ayah)} 
                                className={`cursor-pointer rounded-md p-1 transition-colors ${isPlaying ? 'bg-theme-counter/30 text-theme-counter' : isHighlighted ? 'bg-yellow-400/30' : 'hover:bg-white/10'}`}>
                                {ayah.text} 
                                <span className={`text-sm border rounded-full px-1.5 py-0.5 mx-1 ${hasNote ? 'border-blue-400 text-blue-400' : 'border-gray-500'}`}>{ayah.numberInSurah}</span>
                            </span>
                        );
                    })}
                </div>
                {/* Audio Player Controls */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-theme-secondary/80 backdrop-blur-md z-[110] rounded-t-2xl">
                    <audio ref={audioRef} />
                    <div className="flex items-center gap-4">
                        <button onClick={togglePlayPause} className="w-12 h-12 bg-theme-counter text-theme-primary rounded-full flex items-center justify-center text-2xl">
                           {isPlaying ? '❚❚' : '▶'}
                        </button>
                        <div className="flex-1 flex flex-col gap-1">
                             <input 
                                type="range" 
                                value={currentTime}
                                max={duration || 0}
                                onChange={(e) => { if(audioRef.current) audioRef.current.currentTime = Number(e.target.value) }}
                                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs font-mono">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {selectedAyah && <div className="fixed inset-0 bg-black/50 z-[140]" onClick={() => setSelectedAyah(null)}></div>}
            {/* FIX: Pass the surah number to AyahActionMenu as it's required by its prop type. */}
            {selectedAyah && <AyahActionMenu ayah={{...selectedAyah, surah: surah.number}} onClose={() => setSelectedAyah(null)} onAction={handleAction} />}
            <Modal isOpen={isNoteModalOpen} onClose={() => setIsNoteModalOpen(false)} title="إضافة ملاحظة">
                 <textarea value={noteText} onChange={e => setNoteText(e.target.value)} className="w-full h-32 p-3 my-4 bg-black/20 text-white rounded-lg text-right resize-none"></textarea>
                 <button onClick={saveNote} className="w-full p-3 bg-green-500 text-white rounded-full font-bold">حفظ الملاحظة</button>
            </Modal>
        </>
    );
};

// --- Khatmah Tracker Component ---
const KhatmahTracker: React.FC<{ 
    userData: QuranUserData; 
    onUpdate: (data: QuranUserData) => void; 
    surahList: SurahSummary[];
}> = ({ userData, onUpdate, surahList }) => {
    const totalAyahs = 6236;
    const [currentAyahCount, setCurrentAyahCount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [targetDaysInput, setTargetDaysInput] = useState(userData.khatmah.targetDays || 30);

    useEffect(() => {
        const calculateProgress = () => {
            if (!userData.khatmah.active || !userData.khatmah.lastRead || surahList.length === 0) {
                setCurrentAyahCount(0);
                return;
            }
            let count = 0;
            for(let i=0; i < userData.khatmah.lastRead.surah - 1; i++) {
                count += surahList[i].numberOfAyahs;
            }
            count += userData.khatmah.lastRead.ayah;
            setCurrentAyahCount(count);
        };
        calculateProgress();
    }, [userData.khatmah, surahList]);

    const progressPercentage = totalAyahs > 0 ? (currentAyahCount / totalAyahs) * 100 : 0;
    const dailyTarget = userData.khatmah.targetDays > 0 ? Math.ceil(totalAyahs / userData.khatmah.targetDays) : 0;

    const startKhatmah = () => {
        onUpdate({
            ...userData,
            khatmah: {
                active: true,
                startDate: new Date().toISOString(),
                lastRead: null,
                targetDays: targetDaysInput,
                history: [],
            }
        });
        setIsModalOpen(false);
    };

    const resetKhatmah = () => {
        if(window.confirm("هل أنت متأكد من إعادة تعيين الختمة؟ سيتم حذف التقدم الحالي.")) {
            onUpdate({ ...userData, khatmah: { active: false, startDate: null, lastRead: null, targetDays: 30, history: [] } });
        }
    };

    if (!userData.khatmah.active) {
        return (
            <>
                <div className="p-4 bg-theme-add/20 rounded-xl text-center">
                    <h3 className="font-bold text-lg mb-2">ابدأ ختمة جديدة</h3>
                    <p className="text-sm mb-4">تتبع تقدمك في قراءة القرآن الكريم.</p>
                    <button onClick={() => setIsModalOpen(true)} className="px-6 py-2 bg-theme-add text-white rounded-full font-bold">ابدأ الآن</button>
                </div>
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="بدء ختمة جديدة">
                    <label className="block text-right mb-2">حدد هدفك (عدد الأيام للختم):</label>
                    <input type="number" value={targetDaysInput} onChange={e => setTargetDaysInput(Number(e.target.value))} className="w-full p-3 my-2 bg-black/20 text-white rounded-lg text-center"/>
                    <button onClick={startKhatmah} className="w-full mt-4 p-3 bg-green-500 text-white rounded-full font-bold">تأكيد وبدء</button>
                </Modal>
            </>
        );
    }
    
    return (
        <div className="p-4 bg-white/5 rounded-xl">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg text-theme-accent">تقدم الختمة</h3>
                <button onClick={resetKhatmah} className="text-xs text-red-400">إعادة تعيين</button>
            </div>
            <div className="w-full bg-black/20 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <div className="text-xs text-theme-accent/80 mt-1 text-center">{progressPercentage.toFixed(2)}% مكتمل</div>
             <div className="text-center text-sm mt-2">
                الهدف اليومي: ~{dailyTarget} آيات
            </div>
             {userData.khatmah.lastRead && surahList.length > 0 && (
                <div className="text-center text-sm mt-1">
                    آخر ما قرأت: سورة {surahList.find(s => s.number === userData.khatmah.lastRead?.surah)?.name}، آية {userData.khatmah.lastRead.ayah}
                </div>
            )}
        </div>
    );
};

// --- Main QuranTab Component ---
const QuranTab: React.FC = () => {
    const [surahList, setSurahList] = useState<SurahSummary[]>([]);
    const [activeSurahContent, setActiveSurahContent] = useState<Surah | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [userData, setUserData] = useLocalStorage<QuranUserData>('quranUserData_v2', {
        khatmah: { active: false, startDate: null, lastRead: null, targetDays: 30, history: [] },
        highlights: {},
        notes: {}
    });

    useEffect(() => {
        getSurahList().then(data => {
            setSurahList(data);
            setIsLoading(false);
        });
    }, []);

    const openSurah = async (surahNumber: number) => {
        setIsLoading(true);
        setActiveSurahContent(null);
        const content = await getSurahContent(surahNumber);
        setActiveSurahContent(content);
        setIsLoading(false);
    };
    
    if (isLoading && surahList.length === 0) {
        return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    }
    
    const filteredSurahs = surahList.filter(s =>
        s.name.includes(searchQuery) ||
        s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.number.toString() === searchQuery
    );

    return (
        <>
            {activeSurahContent && (
                <QuranReader 
                    surah={activeSurahContent} 
                    onClose={() => setActiveSurahContent(null)} 
                    userData={userData}
                    onUserDataChange={setUserData}
                />
            )}
            <div className="flex flex-col gap-4">
                <KhatmahTracker userData={userData} onUpdate={setUserData} surahList={surahList}/>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن سورة بالاسم أو الرقم"
                    className="w-full p-3 bg-black/20 text-white rounded-lg text-right border-2 border-transparent focus:border-theme-accent outline-none"
                />
                {isLoading && !activeSurahContent ? (
                     <div className="flex justify-center items-center h-32"><Spinner /></div>
                ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                        {filteredSurahs.map(surah => (
                            <button key={surah.number} onClick={() => openSurah(surah.number)} className="w-full flex justify-between items-center p-3 bg-white/5 hover:bg-white/10 rounded-lg text-right transition-colors">
                                <div>
                                    <p className="font-bold">{surah.number}. {surah.name}</p>
                                    <p className="text-xs text-theme-accent/70">{surah.englishName}</p>
                                </div>
                                <span className="text-sm font-semibold">{surah.numberOfAyahs} آيات</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default QuranTab;