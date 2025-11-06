import React, { useState } from 'react';
import { ASMAUL_HUSNA_DATA } from '../../constants';

interface AsmaulHusnaTabProps {
    onBack?: () => void;
}

const AsmaulHusnaTab: React.FC<AsmaulHusnaTabProps> = ({ onBack }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredNames = ASMAUL_HUSNA_DATA.filter(name =>
        name.name.includes(searchQuery) ||
        name.meaning.includes(searchQuery)
    );

    return (
        <div className="flex flex-col gap-4 min-h-[450px] relative animate-in fade-in-0">
            {onBack && (
                <button onClick={onBack} className="absolute top-0 right-0 flex items-center gap-2 font-semibold text-theme-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6 6-6"/></svg>
                    رجوع
                </button>
            )}
            <div className="text-center w-full pt-8">
                <h2 className="text-2xl font-bold mb-2">أسماء الله الحسنى</h2>
                <p className="text-sm text-theme-secondary/80 mb-6 max-w-xs mx-auto">
                   "وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ فَادْعُوهُ بِهَا"
                </p>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن اسم..."
                    className="w-full p-3 mb-4 bg-theme-card text-theme-primary rounded-theme-card text-right border-2 border-transparent focus:border-theme-accent-faded outline-none"
                />
                <div className="grid grid-cols-2 gap-3 pr-2 pb-4">
                    {filteredNames.map(name => (
                        <div key={name.id} className="p-4 bg-theme-card rounded-theme-card text-center flex flex-col items-center justify-center aspect-square transition-transform hover:scale-105 border border-theme">
                            <h3 className="font-amiri text-3xl text-theme-accent-primary">{name.name}</h3>
                            <p className="mt-2 text-xs text-theme-primary/90">{name.meaning}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AsmaulHusnaTab;