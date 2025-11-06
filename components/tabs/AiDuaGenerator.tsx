import React, { useState, useEffect } from 'react';
import { generateDua } from '../../services/aiService';
import type { Dua } from '../../types';
import { ChevronLeftIcon, CopyIcon, SaveIcon } from '../icons/TabIcons';

interface AiDuaGeneratorProps {
    onBack: () => void;
    setUserDuas: React.Dispatch<React.SetStateAction<Dua[]>>;
}

const AiDuaGenerator: React.FC<AiDuaGeneratorProps> = ({ onBack, setUserDuas }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedDua, setGeneratedDua] = useState('');
    const [displayedDua, setDisplayedDua] = useState('');
    const [error, setError] = useState('');
    
    const popularPrompts = ["شفاء المريض", "النجاح في اختبار", "راحة البال", "سعة الرزق", "صلاح الأبناء"];

    // Typing effect for the generated dua
    useEffect(() => {
        if (generatedDua) {
            setDisplayedDua('');
            let index = 0;
            const intervalId = setInterval(() => {
                setDisplayedDua(prev => prev + generatedDua[index]);
                index++;
                if (index === generatedDua.length) {
                    clearInterval(intervalId);
                }
            }, 30); 
            return () => clearInterval(intervalId);
        }
    }, [generatedDua]);

    const handleGenerate = async () => {
        if (!prompt.trim() || isLoading) return;
        setIsLoading(true);
        setGeneratedDua('');
        setError('');
        const result = await generateDua(prompt);
        if (result.startsWith('عفوًا')) {
            setError(result);
        } else {
            setGeneratedDua(result);
        }
        setIsLoading(false);
    };

    const handleSaveDua = () => {
        if (!generatedDua) return;
        const newDua: Dua = {
            ID: Date.now(),
            ARABIC_TEXT: generatedDua,
            LANGUAGE_ARABIC_TRANSLATED_TEXT: `دعاء مولّد: ${prompt}`,
        };
        setUserDuas(prev => [newDua, ...prev]);
        alert('تم حفظ الدعاء بنجاح!');
    };
    
    const handleTryAgain = () => {
        setGeneratedDua('');
        setDisplayedDua('');
        setError('');
    }

    return (
        <div className="w-full h-full flex flex-col justify-between p-4">
            <header className="flex items-center justify-between">
                <button onClick={onBack} className="p-2 text-theme-secondary hover:text-theme-primary flex items-center gap-1">
                    <ChevronLeftIcon className="w-6 h-6" style={{ transform: 'scaleX(-1)' }}/>
                    <span className="font-semibold">رجوع</span>
                </button>
                 <h2 className="text-2xl font-bold heading-amiri text-theme-accent">مولّد الأدعية</h2>
                 <div className="w-20"></div>
            </header>

            <main className="flex-1 flex flex-col justify-center items-center text-center px-4">
                {isLoading ? (
                    <div className="flex flex-col items-center gap-4">
                         <div className="w-24 h-24 rounded-theme-full bg-theme-accent-primary/10 flex items-center justify-center ai-thinking-indicator">
                            <span className="text-4xl">✨</span>
                        </div>
                        <p className="text-lg font-semibold text-theme-accent">جاري إنشاء الدعاء...</p>
                    </div>
                ) : displayedDua || error ? (
                    <div className="w-full max-w-lg animate-in fade-in-0">
                        {error ? (
                            <p className="text-lg text-theme-danger p-4">{error}</p>
                        ) : (
                            <p className="font-amiri text-4xl leading-relaxed text-theme-primary p-4 dua-result-text">{displayedDua}</p>
                        )}
                        <div className="flex justify-center items-center gap-3 mt-8">
                             {!error && (
                                <>
                                    <button onClick={handleSaveDua} className="button-inset p-3 flex items-center gap-2 text-sm"><SaveIcon className="w-5 h-5"/> حفظ</button>
                                    <button onClick={() => navigator.clipboard.writeText(generatedDua)} className="button-inset p-3 flex items-center gap-2 text-sm"><CopyIcon className="w-5 h-5"/> نسخ</button>
                                </>
                             )}
                             <button onClick={handleTryAgain} className="button-inset p-3 bg-theme-accent-primary text-theme-accent-primary-text text-sm">دعاء آخر</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="w-20 h-20 container-inset rounded-3xl flex items-center justify-center mx-auto mb-4">
                             <span className="text-5xl">✨</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">بماذا تشعر؟ ماذا تريد؟</h3>
                        <p className="text-sm text-theme-secondary/80 mb-6 max-w-xs">
                            اكتب طلبك وسيقوم الذكاء الاصطناعي بصياغة دعاء خاص لك.
                        </p>
                        <textarea
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            placeholder="مثال: الشفاء من المرض"
                            rows={2}
                            className="w-full max-w-sm p-4 text-center text-lg rounded-theme-card resize-none ai-dua-textarea focus:outline-none"
                        />
                         <div className="mt-6 w-full max-w-sm">
                            <p className="text-xs text-theme-secondary/60 mb-3">أو جرب أحد الاقتراحات:</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {popularPrompts.map(p => (
                                    <button key={p} onClick={() => setPrompt(p)} className="px-3 py-1 button-inset rounded-theme-full text-xs hover:bg-theme-border-color transition-colors">
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </main>
            
            {!isLoading && !displayedDua && !error && (
                 <footer className="w-full flex justify-center">
                    <button 
                        onClick={handleGenerate} 
                        disabled={!prompt.trim()}
                        className="w-full max-w-sm p-4 button-inset bg-theme-accent-primary text-theme-accent-primary-text rounded-theme-full font-bold text-lg transition-all hover:scale-105 active:scale-100 disabled:opacity-50 disabled:hover:scale-100"
                    >
                        أنشئ الدعاء
                    </button>
                </footer>
            )}
        </div>
    );
};

export default AiDuaGenerator;
