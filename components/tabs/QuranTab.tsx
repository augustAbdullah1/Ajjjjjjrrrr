

import React, { useState, useEffect, useMemo } from 'react';
import { getSurahList, getReciterList } from '../../services/quranService';
import type { SurahSummary, QuranUserData, Settings, QuranReciter } from '../../types';
import Spinner from '../ui/Spinner';
import Modal from '../ui/Modal';
import { BookmarkIcon, ChevronLeftIcon, TrashIcon, SearchIcon } from '../icons/TabIcons';

interface QuranTabProps {
    settings: Settings;
    setReciterName: (name: string) => void;
    selectedReciterId: string;
    setSelectedReciterId: (id: string) => void;
    onOpenReader: (surahNumber: number, startAtAyah: number | null) => void;
    userData: QuranUserData;
    setUserData: React.Dispatch<React.SetStateAction<QuranUserData>>;
}

const QuranTab: React.FC<QuranTabProps> = ({ 
    settings, setReciterName, selectedReciterId, setSelectedReciterId, onOpenReader, userData, setUserData
}) => {
    const [surahList, setSurahList] = useState<SurahSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isKhatmahModalOpen, setIsKhatmahModalOpen] = useState(false);
    const [khatmahTargetDays, setKhatmahTargetDays] = useState(30);

    const safeKhatmah = userData.khatmah || { active: false, startDate: null, lastRead: null, targetDays: 30, history: [] };

    useEffect(() => {
        const initializeData = async () => {
            setIsLoading(true);
            const sList = await getSurahList();
            setSurahList(sList);
            setIsLoading(false);
        };
        initializeData();
    }, []);

    const { progress } = useMemo(() => {
        if (!safeKhatmah.active || surahList.length === 0) {
            return { progress: 0 };
        }
        
        const totalAyahsInQuran = 6236;
        let progress = 0;

        if (safeKhatmah.lastRead) {
             const cumulativeAyahs = surahList.slice(0, safeKhatmah.lastRead.surah - 1).reduce((sum, s) => sum + s.numberOfAyahs, 0);
             const totalAyahsRead = cumulativeAyahs + safeKhatmah.lastRead.ayah;
             progress = (totalAyahsRead / totalAyahsInQuran) * 100;
        }
        return { progress };
    }, [safeKhatmah, surahList]);

    const handleSearch = () => {
        const query = searchQuery.trim().replace(/[\u0660-\u0669]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x0660 + 0x0030));
        const ayahRegex = /^(\d{1,3})[:\s]+(\d{1,3})$/;
        const match = query.match(ayahRegex);

        if (match) {
            const surahNum = parseInt(match[1], 10);
            const ayahNum = parseInt(match[2], 10);

            if (surahNum > 0 && surahNum <= 114 && ayahNum > 0) {
                const surahInfo = surahList.find(s => s.number === surahNum);
                if (surahInfo && ayahNum <= surahInfo.numberOfAyahs) {
                    onOpenReader(surahNum, ayahNum);
                    setSearchQuery('');
                } else {
                    alert('رقم الآية أو السورة غير صحيح.');
                }
            } else {
                alert('رقم الآية أو السورة غير صحيح.');
            }
        }
    };

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
            setUserData(prev => ({ 
                ...prev, 
                khatmah: { active: false, startDate: null, lastRead: null, targetDays: 30, history: [] }
            }));
        }
    };
    
    const filteredSurahs = useMemo(() => {
        const query = searchQuery.trim();
        if (!query) {
            return surahList;
        }
        return surahList.filter(surah => 
            surah.name.includes(query) ||
            (surah.nameSimple && surah.nameSimple.toLowerCase().includes(query.toLowerCase())) ||
            surah.englishName.toLowerCase().includes(query.toLowerCase()) ||
            surah.englishNameTranslation.toLowerCase().includes(query.toLowerCase())
        );
    }, [surahList, searchQuery]);

    return (
        <>
            <div className="flex flex-col gap-4 animate-in fade-in-0">
                <div className="sticky top-0 bg-theme-primary z-10 py-2 -mx-4 px-4">
                    <div className="flex flex-col gap-3">
                        {isLoading ? (
                            <div className="h-[40px] flex justify-center items-center"><Spinner /></div>
                        ) : safeKhatmah.active ? (
                            <div className="p-2 container-luminous rounded-theme-card flex items-center justify-between text-sm">
                                <button onClick={safeKhatmah.lastRead ? handleContinueReading : () => onOpenReader(1, null)} className="px-3 py-1 button-luminous bg-theme-accent-primary text-white rounded-theme-full font-bold text-xs">
                                    {safeKhatmah.lastRead ? 'أكمل القراءة' : 'ابدأ القراءة'}
                                </button>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-theme-accent-primary">{progress.toFixed(0)}%</span>
                                    <div className="w-24 bg-black/20 rounded-theme-full h-1.5 p-0.5">
                                        <div className="bg-theme-accent-primary h-full rounded-theme-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                                    </div>
                                    <button onClick={handleEndKhatmah} title="إنهاء الختمة" className="p-1.5 text-red-400/70 hover:text-red-400 hover:bg-red-500/20 rounded-full transition-colors">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-2 container-luminous rounded-theme-card flex items-center justify-between text-sm">
                                <button onClick={handleStartKhatmah} className="px-3 py-1 button-luminous bg-theme-accent-primary text-white rounded-theme-full font-bold text-xs">
                                    ابدأ ختمة
                                </button>
                                <p className="font-semibold text-theme-secondary">تتبع ختمتك للقرآن</p>
                            </div>
                        )}
                        <div className="p-1 container-luminous rounded-theme-card flex items-center gap-1">
                            <button onClick={handleSearch} className="p-2 button-luminous rounded-lg flex-shrink-0">
                                <SearchIcon className="w-5 h-5 stroke-theme-accent"/>
                            </button>
                            <input 
                                type="search"
                                value={searchQuery} 
                                onChange={e => setSearchQuery(e.target.value)} 
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                                placeholder="ابحث عن سورة أو رقم آية (مثال: 2:255)" 
                                className="flex-grow p-2 bg-transparent text-theme-primary rounded-lg text-right outline-none" 
                            />
                        </div>
                    </div>
                </div>
                
                {isLoading ? (
                    <div className="flex justify-center items-center h-48"><Spinner /></div>
                ) : (
                    <div className="space-y-2 pr-2">
                        {filteredSurahs.length > 0 ? filteredSurahs.map((surah, index) => (
                             <button
                                key={surah.number}
                                onClick={() => onOpenReader(surah.number, null)}
                                className="w-full p-3 container-luminous rounded-theme-card flex justify-between items-center text-right transition-all duration-200 stagger-item gap-4"
                                style={{ animationDelay: `${index * 30}ms` }}
                            >
                                <div className="flex items-center gap-4 flex-shrink-0">
                                    <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center text-xl font-bold rounded-xl container-luminous surah-number-bg">
                                        {surah.number}
                                    </div>
                                    <p className="font-bold text-lg text-theme-primary truncate">{surah.nameSimple}</p>
                                </div>
                                <div className="flex items-center justify-end gap-3 text-left flex-1 min-w-0">
                                    {safeKhatmah.lastRead?.surah === surah.number && (
                                        <div className="flex items-center gap-1 text-yellow-400 flex-shrink-0" title={`آخر آية مقروءة: ${safeKhatmah.lastRead.ayah}`}>
                                            <BookmarkIcon className="w-4 h-4" fill="currentColor" />
                                            <span className="text-xs font-bold">{safeKhatmah.lastRead.ayah}</span>
                                        </div>
                                    )}
                                    <p className="text-sm text-theme-secondary truncate">{surah.englishNameTranslation}</p>
                                </div>
                            </button>
                        )) : (
                            <div className="text-center p-8 text-theme-secondary">
                                <p>لم يتم العثور على السورة.</p>
                            </div>
                        )}
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
            </div>
        </>
    );
};

export default QuranTab;