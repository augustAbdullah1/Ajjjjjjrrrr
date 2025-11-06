import React, { useState } from 'react';
import { SUNNAH_GUIDE_DATA } from '../../constants';
import type { SunnahCategory } from '../../types';
import { ChevronLeftIcon } from '../icons/TabIcons';

interface SunnahGuideTabProps {
    onBack?: () => void;
}

const SunnahGuideTab: React.FC<SunnahGuideTabProps> = ({ onBack }) => {
    const [selectedCategory, setSelectedCategory] = useState<SunnahCategory | null>(null);

    if (selectedCategory) {
        return (
            <div className="flex flex-col gap-4 min-h-[450px]">
                <div className="flex items-center gap-2">
                    <button onClick={() => setSelectedCategory(null)} className="flex items-center gap-2 font-semibold text-theme-secondary self-start">
                        <ChevronLeftIcon className="w-5 h-5 text-theme-secondary" />
                        رجوع
                    </button>
                    <h2 className="text-xl font-bold text-center heading-amiri">{selectedCategory.icon} {selectedCategory.title}</h2>
                </div>
                <div className="space-y-3 pr-2">
                    {selectedCategory.sunnahs.map((sunnah, index) => (
                        <div key={index} className="p-4 container-luminous rounded-theme-card text-right stagger-item" style={{ animationDelay: `${index * 50}ms` }}>
                            <h3 className="font-bold text-lg text-theme-accent-primary">{sunnah.title}</h3>
                            <p className="mt-1 text-theme-primary/90">{sunnah.description}</p>
                            {sunnah.evidence && <p className="mt-2 text-xs text-theme-secondary/70 italic">{sunnah.evidence}</p>}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 min-h-[450px] relative">
            {onBack && (
                <button onClick={onBack} className="absolute top-0 right-0 flex items-center gap-2 font-semibold text-theme-secondary">
                    <ChevronLeftIcon className="w-5 h-5 text-theme-secondary" />
                    رجوع
                </button>
            )}
            <div className="text-center w-full pt-8">
                <h2 className="text-2xl font-bold mb-2 heading-amiri">دليل السنن</h2>
                <p className="text-sm text-theme-secondary/80 mb-6">
                   تصفح السنن النبوية حسب الفئات لاتباع هدي النبي ﷺ.
                </p>
                <div className="space-y-3">
                    {SUNNAH_GUIDE_DATA.map((category, index) => (
                        <button 
                            key={category.id} 
                            onClick={() => setSelectedCategory(category)}
                            className="w-full p-4 container-luminous rounded-theme-card text-right font-semibold text-lg flex justify-between items-center stagger-item"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="flex items-center gap-3">
                               <span className="text-2xl">{category.icon}</span>
                               <span>{category.title}</span>
                            </div>
                            <ChevronLeftIcon className="w-5 h-5 text-theme-secondary" style={{ transform: 'scaleX(-1)' }} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SunnahGuideTab;