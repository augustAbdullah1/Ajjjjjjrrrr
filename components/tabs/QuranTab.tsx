import React, { useState, useEffect } from 'react';
import { getSurahList, getReciterList } from '../../services/quranService';
import useLocalStorage from '../../hooks/useLocalStorage';
import type { SurahSummary, QuranUserData, Settings, Surah, AudioPlayerState, QuranReciter } from '../../types';
import Spinner from '../ui/Spinner';
import Modal from '../ui/Modal';
import { BookmarkIcon, ReciterIcon } from '../icons/TabIcons';

interface QuranTabProps {
    settings: Settings;
    setReciterName: (name: string) => void;
    selectedReciterId: string | number;
    setSelectedReciterId: (id: string | number) => void;
    onOpenReader: (surahNumber: number, startAtAyah: number | null) => void;
}

const QuranTab: React.FC<QuranTabProps> = ({ 
    settings, setReciterName, selectedReciterId, setSelectedReciterId, onOpenReader
}) => {
    const [surahList, setSurahList] = useState<SurahSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [userData, setUserData] = useLocalStorage<QuranUserData>('quranUserData', {
        khatmah: { active: false, startDate: null, lastRead: null, targetDays: 30, history: [] },
        highlights: {},
    });
    const [isKhatmahModalOpen, setIsKhatmahModalOpen] = useState(false);
    const [khatmahTargetDays, setKhatmahTargetDays] = useState(30);
    const [currentReciterName, setCurrentReciterName] = useState('');

    // Reciter Modal State
    const [isReciterModalOpen, setIsReciterModalOpen] = useState(false);
    const [reciterList, setReciterList] = useState<QuranReciter[]>([]);
    const [isReciterListLoading, setIsReciterListLoading] = useState(false);
    const [reciterSearchQuery, setReciterSearchQuery] = useState('');

    const safeKhatmah = userData.khatmah || { active: false, startDate: null, lastRead: null, targetDays: 30, history: [] };

    useEffect(() => {
        getSurahList().then(list => {
          setSurahList(list);
          setIsLoading(false);
        });
    }, []);

    useEffect(() => {
        getReciterList().then(reciters => {
            const currentReciter = reciters.find(r => String(r.id) === String(selectedReciterId));
            if(currentReciter) {
                const name = currentReciter.translated_name.name;
                setReciterName(name);
                setCurrentReciterName(name);
            } else {
                 const defaultReciterId = 7; // Default to Mishary Rashid Alafasy from quran.com
                 const newReciter = reciters.find(r => String(r.id) === String(defaultReciterId));
                 if(newReciter) {
                    const name = newReciter.translated_name.name;
                    setReciterName(name);
                    setCurrentReciterName(name);
                    setSelectedReciterId(defaultReciterId);
                 }
            }
        });
    }, [selectedReciterId, setReciterName, setSelectedReciterId]);

    const handleContinueReading = () => {
        if (safeKhatmah.lastRead) {
            onOpenReader(safeKhatmah.lastRead.surah, safeKhatmah.lastRead.ayah);
        }
    };

    const handleStartKhatmah = () => {
        setIsKhatmahModalOpen(true);
    };
    
    const handleConfirmStartKhatmah = () => {
        const newKhatmah = {
            active: true,
            startDate: new Date().toISOString(),
            lastRead: null,
            targetDays: khatmahTargetDays > 0 ? khatmahTargetDays : 30,
            history: []
        };
        setUserData(prev => ({ ...prev, khatmah: newKhatmah }));
        setIsKhatmahModalOpen(false);
    };

    const handleEndKhatmah = () => {
        if (window.confirm('هل أنت متأكد من رغبتك في إنهاء الختمة الحالية؟')) {
            const updatedUserData: QuranUserData = {
                ...userData,
                khatmah: { 
                    active: false, 
                    startDate: null, 
                    lastRead: null, 
                    targetDays: 30, 
                    history: [] 
                }
            };
            setUserData(updatedUserData);
        }
    };
    
    const handleOpenReciterModal = () => {
        setIsReciterModalOpen(true);
        setIsReciterListLoading(true);
        getReciterList().then(list => {
            setReciterList(list);
            setIsReciterListLoading(false);
        });
    };

    const handleSelectReciter = (reciter: QuranReciter) => {
        setSelectedReciterId(reciter.id);
        setIsReciterModalOpen(false);
        setReciterSearchQuery('');
    };

    const KhatmahCard = () => {
        if (isLoading || surahList.length === 0) return null;

        if (!safeKhatmah.active) {
            return (
                <div className="p-4 container-luminous bg-theme-accent-card rounded-theme-card text-center flex flex-col items-center gap-3">
                    <h3 className="font-bold text-lg heading-amiri">تتبع ختمتك للقرآن</h3>
                    <p className="text-sm text-theme-secondary">ابدأ ختمة جديدة، تابع تقدمك، وحافظ على وردك اليومي.</p>
                    <button onClick={handleStartKhatmah} className="px-6 py-2 button-luminous bg-theme-accent-primary text-theme-accent-primary-text rounded-theme-full font-bold">
                        ابدأ ختمة جديدة
                    </button>
                </div>
            );
        }
        
        const totalAyahsInQuran = 6236;
        let progress = 0;
        let lastReadSurahName = '';
        let dailyWird = 0;

        if (safeKhatmah.lastRead && safeKhatmah.startDate) {
             const cumulativeAyahs = surahList.slice(0, safeKhatmah.lastRead.surah - 1).reduce((sum, s) => sum + s.numberOfAyahs, 0);
             const totalAyahsRead = cumulativeAyahs + safeKhatmah.lastRead.ayah;
             progress = (totalAyahsRead / totalAyahsInQuran) * 100;
             lastReadSurahName = surahList.find(s => s.number === safeKhatmah.lastRead!.surah)?.name || '';

             const daysPassed = Math.max(0, Math.floor((new Date().getTime() - new Date(safeKhatmah.startDate).getTime()) / (1000 * 60 * 60 * 24)));
             const daysRemaining = Math.max(1, safeKhatmah.targetDays - daysPassed);
             const ayahsRemaining = totalAyahsInQuran - totalAyahsRead;
             if (ayahsRemaining > 0) {
                 dailyWird = Math.ceil(ayahsRemaining / daysRemaining);
             }
        }
        
        const circumference = 54 * 2 * Math.PI; // 2 * pi * r

        return (
             <div className="p-4 container-luminous rounded-theme-card relative space-y-3 flex flex-col items-center">
                <button onClick={handleEndKhatmah} className="absolute top-2 left-2 text-xs text-theme-danger hover:opacity-80">إنهاء</button>
                <h3 className="font-bold text-xl text-theme-accent heading-amiri">ختمتي الحالية</h3>
                 
                <div className="relative w-32 h-32 flex items-center justify-center my-2">
                    <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8" className="opacity-10 text-theme-accent" />
                        <circle cx="60" cy="60" r="54" fill="none" stroke="var(--theme-primary-accent)" strokeWidth="8" strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={circumference - (progress / 100) * circumference}
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-4xl font-black text-white" style={{textShadow: '0 1px 5px rgba(0,0,0,0.4)'}}>{progress.toFixed(0)}%</span>
                        <span className="text-xs text-theme-secondary font-semibold">مكتمل</span>
                    </div>
                </div>

                <div className="text-center w-full">
                     {safeKhatmah.lastRead ? (
                        <p className="text-xs text-theme-secondary/80">
                            آخر قراءة: سورة {lastReadSurahName}، آية {safeKhatmah.lastRead.ayah}
                        </p>
                     ) : (
                        <p className="text-sm text-theme-secondary/80">لم تبدأ القراءة بعد.</p>
                     )}
                     {dailyWird > 0 && (
                        <p className="text-sm font-semibold mt-1"> وردك اليومي: <span className="text-theme-accent-primary">{dailyWird}</span> آية</p>
                     )}
                </div>

                {safeKhatmah.lastRead ? (
                     <button onClick={handleContinueReading} className="w-full mt-2 px-5 py-2 button-luminous bg-theme-accent-primary text-theme-accent-primary-text rounded-theme-full text-sm font-bold">
                        أكمل القراءة
                    </button>
                ) : (
                     <button onClick={() => onOpenReader(1, null)} className="w-full mt-2 px-5 py-2 button-luminous bg-theme-accent-primary text-theme-accent-primary-text rounded-theme-full text-sm font-bold">
                        ابدأ القراءة
                    </button>
                )}
            </div>
        );
    };

    const filteredSurahs = surahList.filter(surah => 
        surah.name.includes(searchQuery) ||
        surah.englishName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredReciters = reciterList.filter(reciter => 
        reciter.translated_name.name.includes(reciterSearchQuery)
    );

    return (
        <>
            <div className="flex flex-col gap-4 animate-in fade-in-0">
                <KhatmahCard />

                <div className="flex items-center gap-2">
                    <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="ابحث عن سورة..." className="w-full p-3 input-luminous text-theme-primary rounded-theme-card text-right" />
                    <button onClick={handleOpenReciterModal} className="p-3 button-luminous text-theme-primary rounded-theme-card flex-shrink-0 flex items-center gap-2">
                        <ReciterIcon className="w-5 h-5 stroke-theme-accent"/>
                        <span className="text-sm font-semibold whitespace-nowrap">{currentReciterName || 'اختر القارئ'}</span>
                    </button>
                </div>
                
                {isLoading ? (
                    <div className="flex justify-center items-center h-48"><Spinner /></div>
                ) : (
                    <div className="space-y-2 pr-2">
                        {filteredSurahs.map((surah, index) => (
                            <button 
                                key={surah.number} 
                                onClick={() => onOpenReader(surah.number, null)}
                                className="w-full p-4 container-luminous rounded-theme-card flex justify-between items-center text-right transition-all duration-200 stagger-item"
                                style={{ animationDelay: `${index * 30}ms` }}
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-lg font-bold text-theme-secondary">{surah.number}</span>
                                    <div>
                                        <p className="font-bold text-lg">{surah.englishName}</p>
                                        <p className="text-xs text-theme-secondary/70">{surah.englishNameTranslation}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {safeKhatmah.lastRead?.surah === surah.number && (
                                        <div className="flex items-center gap-1 text-yellow-400" title={`آخر آية مقروءة: ${safeKhatmah.lastRead.ayah}`}>
                                            <BookmarkIcon className="w-4 h-4" fill="currentColor" />
                                            <span className="text-xs font-bold">{safeKhatmah.lastRead.ayah}</span>
                                        </div>
                                    )}
                                    <span className="font-amiri text-3xl text-theme-accent-primary">{surah.name}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
                 <Modal isOpen={isKhatmahModalOpen} onClose={() => setIsKhatmahModalOpen(false)} title="بدء ختمة جديدة">
                    <div className="text-right my-4 space-y-2">
                        <label htmlFor="khatmah-days" className="font-semibold">المدة المستهدفة (بالأيام):</label>
                        <input 
                            id="khatmah-days"
                            type="number"
                            min="1"
                            value={khatmahTargetDays}
                            onChange={e => setKhatmahTargetDays(parseInt(e.target.value))}
                            className="w-full p-3 input-luminous text-theme-primary rounded-theme-card text-center"
                        />
                    </div>
                    <button onClick={handleConfirmStartKhatmah} className="w-full p-3 button-luminous bg-green-500 text-white rounded-theme-full font-bold">
                        ابدأ الختمة
                    </button>
                </Modal>

                 <Modal isOpen={isReciterModalOpen} onClose={() => setIsReciterModalOpen(false)} title="اختر القارئ">
                    <div className="flex flex-col gap-3">
                        <input 
                            type="text" 
                            value={reciterSearchQuery} 
                            onChange={e => setReciterSearchQuery(e.target.value)} 
                            placeholder="ابحث عن قارئ..." 
                            className="w-full p-2 input-luminous text-theme-primary rounded-md text-right" 
                        />
                        <div className="max-h-64 overflow-y-auto space-y-2">
                            {isReciterListLoading ? (
                                <div className="flex justify-center items-center h-24"><Spinner /></div>
                            ) : (
                                filteredReciters.map(reciter => (
                                    <button 
                                        key={reciter.id} 
                                        onClick={() => handleSelectReciter(reciter)} 
                                        className={`w-full p-3 text-right font-semibold rounded-lg transition-colors ${String(selectedReciterId) === String(reciter.id) ? 'bg-theme-accent-primary text-theme-accent-primary-text' : 'container-luminous'}`}
                                    >
                                        {reciter.translated_name.name}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default QuranTab;