
import React, { useState, useEffect, useMemo } from 'react';
import { getSurahList } from '../../services/quranService';
import type { SurahSummary, QuranUserData, Settings } from '../../types';
import Spinner from '../ui/Spinner';
import Modal from '../ui/Modal';
import { BookmarkIcon, TrashIcon, SearchIcon, QuranIcon } from '../icons/TabIcons';
import { ChevronLeftIcon } from '../icons/TabIcons';

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
    settings, onOpenReader, userData, setUserData
}) => {
    const [surahList, setSurahList] = useState<SurahSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isKhatmahModalOpen, setIsKhatmahModalOpen] = useState(false);
    const [khatmahTargetDays, setKhatmahTargetDays] = useState(30);
    const [isScrolled, setIsScrolled] = useState(false);

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

    // Add scroll listener to the main layout container
    useEffect(() => {
        const mainContainer = document.querySelector('main');
        if (!mainContainer) return;

        const handleScroll = () => {
            setIsScrolled(mainContainer.scrollTop > 100);
        };

        mainContainer.addEventListener('scroll', handleScroll);
        return () => mainContainer.removeEventListener('scroll', handleScroll);
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
        // Check for Ayah search pattern (e.g., 2:255)
        const queryNormalized = query.replace(/[\u0660-\u0669]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x0660 + 0x0030));
        const ayahMatch = queryNormalized.match(/^(\d{1,3})[:\s]+(\d{1,3})$/);
        
        if (ayahMatch) {
             const surahNum = parseInt(ayahMatch[1]);
             return surahList.filter(s => s.number === surahNum);
        }

        return surahList.filter(surah => 
            surah.name.includes(query) ||
            (surah.nameSimple && surah.nameSimple.toLowerCase().includes(query.toLowerCase())) ||
            surah.englishName.toLowerCase().includes(query.toLowerCase()) ||
            surah.englishNameTranslation.toLowerCase().includes(query.toLowerCase())
        );
    }, [surahList, searchQuery]);

    const handleAyahJump = () => {
        const queryNormalized = searchQuery.trim().replace(/[\u0660-\u0669]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x0660 + 0x0030));
        const match = queryNormalized.match(/^(\d{1,3})[:\s]+(\d{1,3})$/);
        if (match) {
            const surahNum = parseInt(match[1]);
            const ayahNum = parseInt(match[2]);
            const surah = surahList.find(s => s.number === surahNum);
            if (surah && ayahNum > 0 && ayahNum <= surah.numberOfAyahs) {
                onOpenReader(surahNum, ayahNum);
                setIsSearchOpen(false);
                setSearchQuery('');
            } else {
                alert("رقم الآية غير صحيح");
            }
        }
    }

    return (
        <>
            <div className="flex flex-col gap-6 animate-in fade-in-0 pb-32 relative min-h-full px-4">
                
                {/* Header Section */}
                <div className="pt-6 pb-2 text-center relative">
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                        <QuranIcon className="w-64 h-64" />
                    </div>
                    <h1 className="font-amiri font-bold text-4xl text-theme-primary relative z-10 drop-shadow-lg">
                        القرآن الكريم
                    </h1>
                    <p className="text-sm text-theme-secondary mt-2 font-medium relative z-10">كتاب الله وسنة نبيه</p>
                </div>

                {/* Khatmah Hero Capsule */}
                <div>
                    {safeKhatmah.active ? (
                        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white shadow-2xl shadow-emerald-900/20 border border-white/10 group">
                             {/* Decorative Patterns */}
                             <div className="absolute top-[-20%] right-[-10%] w-48 h-48 border-[20px] border-white/5 rounded-full blur-xl"></div>
                             <div className="absolute bottom-[-20%] left-[-10%] w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl"></div>
                             
                             <div className="p-6 flex flex-col gap-5 relative z-10">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                                            <QuranIcon className="w-5 h-5 text-emerald-100" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl text-white tracking-wide font-amiri">ختمتك الحالية</h3>
                                            <p className="text-[10px] text-emerald-200/80 font-bold tracking-wider uppercase mt-0.5">استمر في القراءة</p>
                                        </div>
                                    </div>
                                    <button onClick={handleEndKhatmah} className="bg-black/20 hover:bg-red-500/40 p-2 rounded-full transition-colors text-white/80 backdrop-blur-sm">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                                
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-4xl font-black text-white font-sans">{Math.round(progress)}%</span>
                                        {safeKhatmah.lastRead && (
                                            <div className="text-left">
                                                <span className="text-[10px] block text-emerald-200/70 mb-0.5">آخر موضع</span>
                                                <span className="font-bold text-sm text-white font-amiri">
                                                    سورة {surahList[safeKhatmah.lastRead.surah - 1]?.nameSimple} <span className="mx-1 opacity-50">|</span> الآية {safeKhatmah.lastRead.ayah}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    {/* Progress Bar */}
                                    <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)] rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>

                                <button 
                                    onClick={safeKhatmah.lastRead ? handleContinueReading : () => onOpenReader(1, null)} 
                                    className="w-full bg-white text-emerald-900 py-3.5 rounded-2xl font-bold text-base hover:bg-emerald-50 active:scale-[0.98] transition-all shadow-lg mt-1 flex items-center justify-center gap-2 group-hover:shadow-emerald-500/10"
                                >
                                    <span>{safeKhatmah.lastRead ? 'أكمل القراءة' : 'ابدأ القراءة'}</span>
                                    <ChevronLeftIcon className="w-4 h-4 stroke-[3] transition-transform group-hover:-translate-x-1" style={{ transform: 'scaleX(-1)' }} />
                                </button>
                             </div>
                        </div>
                    ) : (
                        <button onClick={handleStartKhatmah} className="w-full p-1 rounded-[2.5rem] bg-gradient-to-r from-theme-card to-theme-card/50 border border-white/5 group transition-all active:scale-[0.99] hover:border-theme-accent-primary/30">
                             <div className="bg-theme-primary/40 backdrop-blur-sm p-6 rounded-[2.3rem] flex items-center justify-between relative overflow-hidden">
                                 <div className="absolute inset-0 bg-theme-accent-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                 <div className="relative z-10 text-right flex items-center gap-4">
                                     <div className="w-14 h-14 rounded-2xl bg-theme-accent-primary/10 flex items-center justify-center text-theme-accent-primary group-hover:scale-110 transition-transform duration-300">
                                         <QuranIcon className="w-7 h-7" />
                                     </div>
                                     <div>
                                        <h3 className="font-bold text-xl text-theme-primary font-amiri">ابدأ ختمة جديدة</h3>
                                        <p className="text-xs text-theme-secondary mt-1">تتبع تقدمك واختم القرآن</p>
                                     </div>
                                 </div>
                                 <div className="w-10 h-10 rounded-full bg-theme-card border border-white/5 flex items-center justify-center shadow-lg group-hover:bg-theme-accent-primary group-hover:text-theme-accent-primary-text transition-colors">
                                     <span className="text-xl font-bold">+</span>
                                 </div>
                             </div>
                        </button>
                    )}
                </div>
                
                {/* Surah List */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-48"><Spinner /></div>
                ) : (
                    <div className="space-y-3 mt-2">
                        {filteredSurahs.length > 0 ? filteredSurahs.map((surah, index) => (
                             <button
                                key={surah.number}
                                onClick={() => onOpenReader(surah.number, null)}
                                className="w-full group relative overflow-hidden rounded-[1.5rem] bg-theme-card/40 hover:bg-theme-card border border-white/5 hover:border-theme-accent-primary/20 transition-all duration-300 text-right stagger-item"
                                style={{ animationDelay: `${index * 20}ms` }}
                            >
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {/* Stylized Number */}
                                        <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center">
                                            <div className="absolute inset-0 rotate-45 border-2 border-theme-border-color rounded-[10px] group-hover:border-theme-accent-primary/50 group-hover:rotate-90 transition-all duration-500"></div>
                                            <span className="font-bold text-sm text-theme-primary relative z-10 font-mono">{surah.number}</span>
                                        </div>

                                        <div className="flex flex-col items-start">
                                            <p className="font-amiri font-bold text-xl text-theme-primary group-hover:text-theme-accent-primary transition-colors">
                                                {surah.nameSimple}
                                            </p>
                                            <p className="text-[10px] uppercase font-bold tracking-wider text-theme-secondary/60 group-hover:text-theme-secondary transition-colors">
                                                {surah.englishName}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col items-end text-[10px] font-bold text-theme-secondary/70 gap-1">
                                            <span className={`px-2 py-0.5 rounded-md bg-black/10 border border-white/5`}>
                                                {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                                            </span>
                                            <span>{surah.numberOfAyahs} آية</span>
                                        </div>
                                        
                                        {safeKhatmah.lastRead?.surah === surah.number && (
                                            <div className="w-8 h-8 rounded-full bg-theme-accent-primary/10 flex items-center justify-center text-theme-accent-primary animate-pulse">
                                                <BookmarkIcon className="w-4 h-4" fill="currentColor" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </button>
                        )) : (
                            <div className="text-center p-12 text-theme-secondary flex flex-col items-center gap-4">
                                <SearchIcon className="w-12 h-12 opacity-20" />
                                <p>لم يتم العثور على السورة.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Floating Search Button (Smart Scroll) */}
                <div 
                    className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 z-30 transition-all duration-500 ease-out ${isSearchOpen ? 'w-[90%] max-w-md scale-100' : 'w-auto scale-100'}`}
                >
                    <div className={`shadow-2xl shadow-black/40 ${isSearchOpen ? 'rounded-[2rem]' : 'rounded-full'}`}>
                        {isSearchOpen ? (
                            <div className="flex items-center bg-theme-card/95 backdrop-blur-xl border border-theme-accent-primary/20 rounded-[2rem] p-2 animate-in zoom-in-95 duration-300 ring-1 ring-theme-accent-primary/10">
                                <input 
                                    type="search"
                                    autoFocus
                                    value={searchQuery} 
                                    onChange={e => setSearchQuery(e.target.value)} 
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleAyahJump(); }}
                                    placeholder="ابحث عن سورة (الكهف) أو آية (2:255)" 
                                    className="flex-grow h-12 px-4 bg-transparent text-theme-primary text-right outline-none placeholder:text-theme-secondary/50 text-base font-medium" 
                                />
                                <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className="w-10 h-10 rounded-full flex items-center justify-center bg-theme-tab-bar text-theme-secondary hover:text-theme-danger transition-colors">
                                   ✕
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setIsSearchOpen(true)} 
                                className={`
                                    flex items-center justify-center bg-theme-card/80 backdrop-blur-xl border border-white/10 rounded-full text-theme-primary hover:bg-theme-card hover:border-theme-accent-primary/30 transition-all duration-500 ease-out hover:scale-105
                                    ${isScrolled ? 'w-12 h-12' : 'px-6 py-3.5 gap-2'}
                                `}
                            >
                                <SearchIcon className="w-5 h-5" />
                                <span className={`text-sm font-bold whitespace-nowrap overflow-hidden transition-all duration-500 ${isScrolled ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                                    بحث في السور
                                </span>
                            </button>
                        )}
                    </div>
                </div>

                 <Modal isOpen={isKhatmahModalOpen} onClose={() => setIsKhatmahModalOpen(false)} title="بدء ختمة جديدة">
                    <div className="text-right my-6 space-y-3">
                        <label htmlFor="khatmah-days" className="font-bold text-theme-primary block text-center mb-2">المدة المستهدفة (بالأيام)</label>
                        <input 
                            id="khatmah-days"
                            type="number"
                            min="1"
                            value={khatmahTargetDays}
                            onChange={e => setKhatmahTargetDays(parseInt(e.target.value))}
                            className="w-full p-4 input-luminous text-theme-primary rounded-[1.5rem] text-center text-2xl font-bold"
                        />
                    </div>
                    <button onClick={handleConfirmStartKhatmah} className="w-full p-4 button-luminous bg-emerald-600 text-white rounded-[1.5rem] font-bold shadow-lg shadow-emerald-900/20 hover:bg-emerald-500 transition-colors">
                        تأكيد البدء
                    </button>
                </Modal>
            </div>
        </>
    );
};

export default QuranTab;
