
import React, { useState } from 'react';
import { ASMAUL_HUSNA_DATA } from '../../constants';
import { ChevronLeftIcon } from '../icons/TabIcons';

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
        <div className="flex flex-col gap-4 min-h-full p-4 pb-28 animate-in fade-in-0" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}>
            {onBack && (
                <button onClick={onBack} className="absolute top-4 right-4 flex items-center gap-2 font-semibold text-theme-secondary" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
                    <ChevronLeftIcon className="w-5 h-5 text-theme-secondary" />
                    رجوع
                </button>
            )}
            <div className="text-center w-full pt-8">
                <h2 className="text-2xl font-bold mb-2 heading-amiri">أسماء الله الحسنى</h2>
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
                <div className="grid grid-cols-2 gap-3 pr-2">
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
