
import React, { useState, useEffect } from 'react';
import type { DuaCategory } from '../../types';
import useLocalStorage from '../../hooks/useLocalStorage';
import { ChevronLeftIcon, CheckCircleIcon, ReplayIcon } from '../icons/TabIcons';

interface DuaSequenceProps {
    category: DuaCategory;
    onClose: () => void;
}

interface Progress {
    completed: boolean;
    completionDate: string | null;
    counts: Record<number, number>; // { [duaId]: currentCount }
}

const DuaSequence: React.FC<DuaSequenceProps> = ({ category, onClose }) => {
    const [progress, setProgress] = useLocalStorage<Progress>(
        `duaSequenceProgress_${category.ID}`,
        { completed: false, completionDate: null, counts: {} }
    );
    const [currentIndex, setCurrentIndex] = useState(0);

    // Reset progress if the completion date is not today
    useEffect(() => {
        const today = new Date().toDateString();
        if (progress.completionDate && new Date(progress.completionDate).toDateString() !== today) {
            setProgress({ completed: false, completionDate: null, counts: {} });
        }
    }, [progress.completionDate, setProgress]);
    
    const currentDua = category.duas[currentIndex];

    const handleNext = () => {
        if (currentIndex < category.duas.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            // Last dua completed
            setProgress(p => ({ ...p, completed: true, completionDate: new Date().toISOString() }));
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleCount = () => {
        const currentCount = progress.counts[currentDua.ID] || 0;
        const newCount = currentCount + 1;
        
        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(15);

        if (newCount >= (currentDua.count || 1)) {
            // Reset count for this dua and move to next
             setProgress(p => {
                const newCounts = { ...p.counts };
                delete newCounts[currentDua.ID];
                return { ...p, counts: newCounts };
            });
            handleNext();
        } else {
            setProgress(p => ({ ...p, counts: { ...p.counts, [currentDua.ID]: newCount } }));
        }
    };

    const handleRepeat = () => {
        setProgress({ completed: false, completionDate: null, counts: {} });
        setCurrentIndex(0);
    };
    
    if (progress.completed) {
        return (
            <div className="flex flex-col items-center justify-center text-center h-full p-6 pb-44 animate-in fade-in-0 zoom-in-95 duration-300 bg-theme-primary" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}>
                <div className="w-28 h-28 bg-green-500/10 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/5">
                    <CheckCircleIcon className="w-16 h-16 text-green-500 animate-pop" />
                </div>
                <h2 className="text-3xl font-bold text-theme-primary mb-2 heading-amiri">تقبل الله طاعتكم</h2>
                <p className="text-theme-secondary/80 mb-10 text-lg">لقد أتممت {category.TITLE} لهذا اليوم.</p>
                
                <div className="flex flex-col w-full max-w-xs gap-3">
                    <button onClick={onClose} className="w-full p-4 button-luminous bg-theme-accent-primary text-theme-accent-primary-text rounded-[1.5rem] font-bold text-lg shadow-lg">
                        العودة للرئيسية
                    </button>
                    <button onClick={handleRepeat} className="w-full p-4 text-theme-secondary hover:text-theme-primary font-semibold flex items-center justify-center gap-2 transition-colors">
                        <ReplayIcon className="w-5 h-5"/>
                        <span>إعادة القراءة</span>
                    </button>
                </div>
            </div>
        );
    }
    
    const total = category.duas.length;
    const progressPercentage = ((currentIndex + 1) / total) * 100;
    const currentCount = progress.counts[currentDua.ID] || 0;
    const targetCount = currentDua.count || 1;
    const counterProgress = (currentCount / targetCount) * 100;

    return (
        <div className="flex flex-col min-h-full p-5 pb-56 bg-theme-primary" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col items-start">
                     <span className="text-xs text-theme-secondary font-bold mb-1">{category.TITLE}</span>
                     <span className="text-xl font-black text-theme-primary font-mono">{currentIndex + 1} <span className="text-theme-secondary/40 text-base font-normal">/ {total}</span></span>
                </div>
                <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-theme-card hover:bg-theme-border-color transition-colors text-theme-secondary hover:text-theme-primary">
                    &times;
                </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-theme-border-color/30 rounded-full h-1.5 mb-8">
                <div className="bg-theme-accent-primary h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            
            {/* Card */}
            <div className="flex-grow flex flex-col justify-center items-center text-center relative">
                 <div className="w-full p-6 md:p-8 container-luminous rounded-[2.5rem] shadow-2xl relative overflow-hidden min-h-[300px] flex flex-col justify-center items-center">
                     <div className="absolute top-0 left-0 w-full h-1 bg-theme-accent-primary/10"></div>
                     <p className="text-2xl md:text-3xl font-amiri leading-[2.2] text-theme-primary mb-6 select-text">
                        {currentDua.ARABIC_TEXT}
                     </p>
                     {currentDua.TRANSLATED_TEXT && (
                        <div className="bg-black/5 rounded-xl p-3 border border-black/5 w-full">
                             <p className="text-sm text-theme-secondary/90 leading-relaxed">{currentDua.TRANSLATED_TEXT}</p>
                        </div>
                     )}
                 </div>
            </div>
            
            {/* Footer Controls */}
            <div className="mt-8">
                {targetCount > 1 ? (
                     <button 
                        onClick={handleCount} 
                        className="w-full h-24 rounded-[2rem] bg-theme-accent-primary text-theme-accent-primary-text shadow-lg shadow-theme-accent-primary/30 active:scale-[0.98] transition-all flex items-center justify-center relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-black/10" style={{ width: `${counterProgress}%`, transition: 'width 0.2s ease-out' }}></div>
                        <div className="relative z-10 flex flex-col items-center">
                            <span className="text-3xl font-black">{currentCount}</span>
                            <span className="text-xs font-bold opacity-80 uppercase tracking-wider">اضغط للعد ({targetCount})</span>
                        </div>
                    </button>
                ) : (
                     <button 
                        onClick={handleNext} 
                        className="w-full h-20 rounded-[2rem] bg-theme-accent-primary text-theme-accent-primary-text shadow-lg shadow-theme-accent-primary/30 active:scale-[0.98] transition-all flex items-center justify-center text-xl font-bold"
                    >
                        {currentIndex === total - 1 ? 'إتمام' : 'التالي'}
                     </button>
                )}

                <div className="flex justify-center mt-4">
                    <button 
                        onClick={handlePrev} 
                        disabled={currentIndex === 0} 
                        className="text-sm font-bold text-theme-secondary px-4 py-2 rounded-full hover:bg-theme-card transition-colors disabled:opacity-0"
                    >
                        السابق
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DuaSequence;
