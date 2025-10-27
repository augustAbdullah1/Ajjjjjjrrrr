import React, { useState } from 'react';
import { HISNUL_MUSLIM_DUAS } from '../../constants';
import type { DuaCategory, Dua } from '../../types';
import { generateDua } from '../../services/geminiService';
import Modal from '../ui/Modal';
import Spinner from '../ui/Spinner';

const AIDuaGenerator: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [generatedDua, setGeneratedDua] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setGeneratedDua('');
        const dua = await generateDua(prompt);
        setGeneratedDua(dua);
        setIsLoading(false);
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="w-full p-4 bg-theme-add text-white rounded-xl text-center font-bold transition-transform hover:scale-105 active:scale-95"
            >
                أنشئ دعاء بالذكاء الاصطناعي
            </button>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="مولد الدعاء الذكي">
                <p className="text-sm text-theme-accent mb-4">اكتب طلبك، وسيقوم الذكاء الاصطناعي بإنشاء دعاء مناسب لك.</p>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="مثال: لأمي بالشفاء العاجل"
                    className="w-full h-24 p-2 bg-black/20 text-white rounded-lg text-right resize-none mb-4"
                />
                <button onClick={handleGenerate} disabled={isLoading} className="w-full p-3 bg-green-500 text-white rounded-full font-bold disabled:opacity-50 flex justify-center items-center h-12">
                    {isLoading ? <Spinner /> : 'إنشاء الدعاء'}
                </button>
                {generatedDua && (
                    <div className="mt-4 p-4 bg-black/20 rounded-lg text-right">
                        <p className="text-lg font-semibold">{generatedDua}</p>
                    </div>
                )}
            </Modal>
        </>
    );
}

const DuasTab: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<DuaCategory | null>(null);

    const filteredCategories = HISNUL_MUSLIM_DUAS.filter(category => 
        category.TITLE.toLowerCase().includes(searchQuery.toLowerCase()) || 
        category.duas.some(dua => dua.ARABIC_TEXT.includes(searchQuery))
    );

    const renderDua = (dua: Dua) => (
        <div key={dua.ID} className="p-4 bg-white/5 rounded-lg flex flex-col items-end gap-2 text-right">
            <p className="text-lg font-semibold text-theme-accent">{dua.ARABIC_TEXT}</p>
            <p className="text-xs text-theme-text/70">{dua.TRANSLATED_TEXT}</p>
            <button onClick={() => { navigator.clipboard.writeText(dua.ARABIC_TEXT) }} className="self-start text-xs mt-2 px-3 py-1 bg-white/10 rounded-full">نسخ</button>
        </div>
    );

    if (selectedCategory) {
        return (
            <div className="flex flex-col gap-4">
                <button onClick={() => setSelectedCategory(null)} className="flex items-center gap-2 font-semibold text-theme-accent self-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    رجوع
                </button>
                <h2 className="text-xl font-bold text-center">{selectedCategory.TITLE}</h2>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {selectedCategory.duas.map(renderDua)}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في الأدعية..."
                className="w-full p-3 bg-black/20 text-white rounded-lg text-right border-2 border-transparent focus:border-theme-accent outline-none"
            />
             <AIDuaGenerator />
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                {filteredCategories.map(category => (
                    <button key={category.ID} onClick={() => setSelectedCategory(category)} className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-lg text-right font-semibold text-lg transition-colors">
                        {category.TITLE}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DuasTab;
