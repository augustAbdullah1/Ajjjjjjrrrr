
import React, { useState, useRef } from 'react';
import { ASMAUL_HUSNA_DATA } from '../../constants';
import { ChevronLeftIcon, SearchIcon } from '../icons/TabIcons';

interface AsmaulHusnaTabProps {
    onBack?: () => void;
}

const AsmaulHusnaTab: React.FC<AsmaulHusnaTabProps> = ({ onBack }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (scrollRef.current) {
            setIsScrolled(scrollRef.current.scrollTop > 50);
        }
    };

    const filteredNames = ASMAUL_HUSNA_DATA.filter(name =>
        name.name.includes(searchQuery) ||
        name.meaning.includes(searchQuery)
    );

    return (
        <div className="flex flex-col h-full bg-theme-primary relative">
            
            {/* Floating Back Button */}
            {onBack && (
                <button 
                    onClick={onBack} 
                    className="fixed top-[calc(env(safe-area-inset-top)+1rem)] left-4 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-theme-card/50 text-theme-secondary hover:text-theme-primary transition-colors border border-white/10 active:scale-95 backdrop-blur-md shadow-lg"
                >
                    <ChevronLeftIcon className="w-6 h-6 stroke-current" style={{ transform: 'scaleX(-1)' }} />
                </button>
            )}

            {/* Content */}
            <div 
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-grow overflow-y-auto p-4 pb-40 custom-scrollbar"
            >
                
                {/* Hero Title */}
                <div className="pt-16 pb-8 text-center animate-in slide-in-from-bottom-5 duration-700">
                    <h1 className="text-4xl font-bold heading-amiri text-theme-primary drop-shadow-md mb-2">أسماء الله الحسنى</h1>
                    <p className="text-theme-secondary text-sm opacity-80">لله الأسماء الحسنى فادعوه بها</p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {filteredNames.map((name, index) => (
                        <div 
                            key={name.id} 
                            className="container-luminous rounded-[2rem] p-4 flex flex-col items-center justify-center text-center min-h-[160px] relative overflow-hidden group hover:border-theme-accent-primary/30 transition-colors stagger-item"
                            style={{ animationDelay: `${index % 10 * 50}ms` }}
                        >
                            {/* Decorative Number */}
                            <span className="absolute top-3 right-4 text-[10px] font-mono text-theme-secondary/30 font-bold">{name.id}</span>
                            
                            {/* Name */}
                            <div className="flex-grow flex items-center justify-center w-full relative z-10">
                                <h3 className="font-amiri text-3xl text-theme-primary group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                                    {name.name}
                                </h3>
                            </div>
                            
                            {/* Meaning */}
                            <div className="relative z-10 w-full pt-2 border-t border-white/5 mt-2">
                                <p className="text-[10px] text-theme-secondary leading-relaxed line-clamp-3 group-hover:text-theme-primary/80 transition-colors">
                                    {name.meaning}
                                </p>
                            </div>

                            {/* Hover Effect bg */}
                            <div className="absolute inset-0 bg-gradient-to-br from-theme-accent-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>
                    ))}
                </div>
                
                {filteredNames.length === 0 && (
                    <div className="text-center py-20 text-theme-secondary">
                        <p>لا توجد نتائج.</p>
                    </div>
                )}
            </div>

            {/* Floating Search Pill */}
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
                                placeholder="ابحث عن اسم..." 
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
                                بحث الأسماء
                            </span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AsmaulHusnaTab;
