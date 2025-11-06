import React, { useState, useEffect } from 'react';
import type { DuaCategory, Dua } from '../../types';
import useLocalStorage from '../../hooks/useLocalStorage';

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
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleCount = () => {
        const currentCount = progress.counts[currentDua.ID] || 0;
        const newCount = currentCount + 1;

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
    
    if (progress.completed) {
        return (
            <div className="flex flex-col items-center justify-center text-center py-4 flex-grow min-h-[450px] animate-in fade-in-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 text-green-400 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <h2 className="text-2xl font-bold text-theme-accent">أحسنت!</h2>
                <p className="text-theme-text/80 mb-6">لقد أتممت {category.TITLE}.</p>
                <button onClick={onClose} className="px-6 py-2 bg-white/10 rounded-full font-semibold">العودة إلى القائمة</button>
            </div>
        );
    }
    
    const total = category.duas.length;
    const progressPercentage = ((currentIndex + 1) / total) * 100;
    const currentCount = progress.counts[currentDua.ID] || 0;
    const targetCount = currentDua.count || 1;
    const counterProgress = (currentCount / targetCount) * 100;

    return (
        <div className="flex flex-col py-4 flex-grow min-h-[450px]">
            <div className="flex items-center gap-4 mb-4">
                <button onClick={onClose} className="text-2xl font-light text-theme-accent/70 hover:text-theme-accent transition-colors">&times;</button>
                <div className="w-full bg-black/20 rounded-full h-2">
                    <div className="bg-theme-counter h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                 <span className="text-sm font-bold text-theme-accent">{currentIndex + 1}/{total}</span>
            </div>
            
            <div className="flex-grow flex flex-col justify-center items-center text-center p-4 bg-white/5 rounded-2xl my-4">
                 <p className="text-2xl font-amiri leading-loose text-theme-accent mb-4">{currentDua.ARABIC_TEXT}</p>
                 <p className="text-sm text-theme-text/70">{currentDua.TRANSLATED_TEXT}</p>
            </div>
            
            {targetCount > 1 ? (
                 <div className="flex flex-col items-center justify-center gap-4">
                    <button onClick={handleCount} className="w-32 h-32 rounded-full bg-theme-secondary/50 border-4 border-theme flex flex-col items-center justify-center shadow-lg transition-transform active:scale-95">
                        <span className="text-4xl font-black text-theme-counter">{currentCount}</span>
                        <span className="text-lg font-bold text-theme-accent opacity-95">/ {targetCount}</span>
                    </button>
                    <p className="text-sm text-theme-accent">اضغط للعد</p>
                </div>
            ) : (
                 <button onClick={handleNext} className="w-full p-4 bg-theme-add text-white rounded-full font-bold text-lg">
                    {currentIndex === total - 1 ? 'إتمام' : 'التالي'}
                 </button>
            )}

            <div className="flex justify-between items-center mt-6">
                <button onClick={handlePrev} disabled={currentIndex === 0} className="px-6 py-2 bg-white/10 rounded-full font-semibold disabled:opacity-50">السابق</button>
                <button onClick={handleNext} className="px-6 py-2 bg-white/10 rounded-full font-semibold">
                    {currentIndex === total - 1 ? 'إنهاء' : 'تخطي'}
                </button>
            </div>
        </div>
    );
};

export default DuaSequence;