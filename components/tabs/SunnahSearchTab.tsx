
import React, { useState } from 'react';
import { SUNNAH_GUIDE_DATA } from '../../constants';
import type { SunnahCategory } from '../../types';
import { ChevronLeftIcon, StarIcon } from '../icons/TabIcons';

interface SunnahGuideTabProps {
    onBack?: () => void;
}

const SunnahGuideTab: React.FC<SunnahGuideTabProps> = ({ onBack }) => {
    const [selectedCategory, setSelectedCategory] = useState<SunnahCategory | null>(null);

    if (selectedCategory) {
        return (
            <div className="flex flex-col h-full bg-theme-primary relative overflow-hidden">
                
                {/* Background Decoration */}
                <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[50%] bg-theme-accent-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
                
                {/* Floating Back Button */}
                <button 
                    onClick={() => setSelectedCategory(null)} 
                    className="fixed top-[calc(env(safe-area-inset-top)+1rem)] left-4 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-theme-card/50 text-theme-secondary hover:text-theme-primary transition-colors border border-white/10 active:scale-95 backdrop-blur-md shadow-lg"
                >
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                
                {/* Content */}
                <div className="flex-grow overflow-y-auto px-4 pb-48 space-y-6 custom-scrollbar pt-20">
                    
                    {/* Hero Title (Replaces Header) */}
                    <div className="text-center mb-4 animate-slide-in-from-right">
                        <h2 className="text-3xl font-bold heading-amiri text-theme-primary">{selectedCategory.title}</h2>
                    </div>

                    {/* Hero Icon */}
                    <div className="flex flex-col items-center justify-center py-2 animate-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-theme-card to-theme-accent-primary/10 border border-white/10 flex items-center justify-center text-6xl shadow-2xl shadow-theme-accent-primary/10 mb-4 relative overflow-hidden">
                             <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity"></div>
                            {selectedCategory.icon}
                        </div>
                        <p className="text-theme-secondary text-sm font-medium bg-theme-card/50 px-4 py-1 rounded-full border border-white/5">
                            {selectedCategory.sunnahs.length} سنن مؤكدة
                        </p>
                    </div>

                    {/* Timeline List */}
                    <div className="relative border-r-2 border-theme-border-color/50 mr-4 space-y-8">
                        {selectedCategory.sunnahs.map((sunnah, index) => (
                            <div 
                                key={index} 
                                className="relative pr-8 stagger-item group"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Timeline Dot */}
                                <div className="absolute -right-[9px] top-0 w-4 h-4 rounded-full bg-theme-card border-2 border-theme-accent-primary z-10 group-hover:scale-125 transition-transform duration-300"></div>
                                
                                {/* Content Card */}
                                <div className="container-luminous rounded-[2rem] rounded-tr-none p-6 bg-theme-card/60 border border-white/5 transition-all duration-300 hover:bg-theme-card hover:border-theme-accent-primary/30 hover:translate-x-[-5px]">
                                    <h3 className="font-bold text-lg text-theme-primary mb-2 flex items-center gap-2">
                                        {sunnah.title}
                                    </h3>
                                    
                                    <p className="text-sm text-theme-secondary/90 leading-relaxed mb-4">
                                        {sunnah.description}
                                    </p>
                                    
                                    {sunnah.evidence && (
                                        <div className="relative bg-black/20 rounded-xl p-4 border-r-2 border-theme-accent-primary/50 mt-3">
                                            <span className="absolute -top-2 -right-1 text-2xl text-theme-accent-primary/20">❝</span>
                                            <p className="text-[11px] text-theme-primary/80 italic font-medium leading-relaxed relative z-10">
                                                {sunnah.evidence}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full relative">
            
            {/* Floating Back Button (If provided) */}
            {onBack && (
                <button 
                    onClick={onBack} 
                    className="fixed top-[calc(env(safe-area-inset-top)+1rem)] left-4 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-theme-card/50 text-theme-secondary hover:text-theme-primary transition-colors border border-white/10 active:scale-95 backdrop-blur-md shadow-lg"
                >
                    <ChevronLeftIcon className="w-6 h-6 stroke-current" style={{ transform: 'scaleX(-1)' }} />
                </button>
            )}

            {/* Scrollable Container */}
            <div className="flex-grow overflow-y-auto p-4 pb-40 custom-scrollbar animate-in fade-in-0">
                
                {/* Header Section - Moved inside scrollable area */}
                <div className="relative mb-6 mt-16 text-right px-2">
                    <h2 className="text-3xl font-bold heading-amiri text-theme-primary leading-tight">دليل السنن</h2>
                    <p className="text-xs text-theme-secondary opacity-80 mt-1">إحياء سنة النبي ﷺ في حياتك</p>
                </div>

                {/* Masonry/Grid Layout */}
                <div className="grid grid-cols-1 gap-4">
                    {SUNNAH_GUIDE_DATA.map((category, index) => (
                        <button 
                            key={category.id} 
                            onClick={() => setSelectedCategory(category)}
                            className="relative w-full group perspective-1000 stagger-item"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="absolute inset-0 bg-theme-accent-primary/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                            
                            <div className="relative container-luminous rounded-[2.5rem] p-5 flex items-center gap-5 bg-gradient-to-br from-theme-card to-theme-card/60 border border-white/5 hover:border-theme-accent-primary/30 transition-all duration-300 group-hover:translate-y-[-2px]">
                                
                                {/* Icon Box */}
                                <div className="w-20 h-20 flex-shrink-0 rounded-[2rem] bg-theme-tab-bar/50 flex items-center justify-center text-4xl shadow-inner border border-white/5 group-hover:scale-105 transition-transform duration-300">
                                    {category.icon}
                                </div>
                                
                                {/* Text Content */}
                                <div className="flex-grow text-right">
                                    <h3 className="font-bold text-lg text-theme-primary mb-1 group-hover:text-theme-accent-primary transition-colors">
                                        {category.title}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold bg-theme-accent-primary/10 text-theme-accent-primary px-2 py-0.5 rounded-md border border-theme-accent-primary/20">
                                            {category.sunnahs.length} سنن
                                        </span>
                                        <span className="text-[10px] text-theme-secondary/50">
                                            اضغط للتفاصيل
                                        </span>
                                    </div>
                                </div>

                                {/* Arrow */}
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-theme-secondary group-hover:bg-theme-accent-primary group-hover:text-theme-accent-primary-text transition-all duration-300">
                                    <ChevronLeftIcon className="w-5 h-5 stroke-current" style={{ transform: 'scaleX(-1)' }} />
                                </div>
                            </div>
                        </button>
                    ))}
                    
                    {/* Footer Note */}
                    <div className="text-center mt-8 mb-4 opacity-50">
                        <StarIcon className="w-6 h-6 mx-auto mb-2 text-theme-secondary" />
                        <p className="text-[10px] text-theme-secondary">
                            "مَنْ أَحْيَا سُنَّةً مِنْ سُنَّتِي فَعَمِلَ بِهَا النَّاسُ كَانَ لَهُ مِثْلُ أَجْرِ مَنْ عَمِلَ بِهَا"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SunnahGuideTab;
