import React, { useState, useEffect, useRef } from 'react';
import type { Tab } from '../types';
import { CounterIcon, DuaIcon, QuranIcon, PrayerIcon, OtherIcon } from './icons/TabIcons';

interface TabBarProps {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
}

const TABS: { id: Tab; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { id: 'home', label: 'الرئيسية', icon: PrayerIcon },
    { id: 'duas', label: 'أدعية', icon: DuaIcon },
    { id: 'quran', label: 'القرآن', icon: QuranIcon },
    { id: 'counter', label: 'السبحة', icon: CounterIcon },
    { id: 'other', label: 'أخرى', icon: OtherIcon },
];

const TabBar: React.FC<TabBarProps> = ({ activeTab, setActiveTab }) => {
    const navRef = useRef<HTMLElement>(null);
    const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

    useEffect(() => {
        const calculateIndicator = () => {
            const activeIndex = TABS.findIndex(tab => tab.id === activeTab);
            const activeTabElem = tabsRef.current[activeIndex];
            if (activeTabElem) {
                setIndicatorStyle({
                    left: activeTabElem.offsetLeft,
                    width: activeTabElem.clientWidth,
                    opacity: 1,
                });
            }
        };

        calculateIndicator();

        // Recalculate on resize to handle orientation changes
        const resizeObserver = new ResizeObserver(calculateIndicator);
        if (navRef.current) {
            resizeObserver.observe(navRef.current);
        }
        return () => resizeObserver.disconnect();

    }, [activeTab]);

    return (
        <nav ref={navRef} className="fixed bottom-4 inset-x-0 h-20 z-50 flex justify-center pointer-events-none">
            <div className="relative w-[95%] max-w-sm tab-bar-luminous rounded-theme-container pointer-events-auto flex justify-around items-center px-2">
                
                <div 
                    className="absolute h-14 tab-indicator-luminous rounded-theme-full transition-all duration-300 ease-in-out"
                    style={{
                        left: `${indicatorStyle.left}px`,
                        width: `${indicatorStyle.width}px`,
                        opacity: indicatorStyle.opacity,
                    }}
                />

                {TABS.map((tab, index) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            ref={el => tabsRef.current[index] = el}
                            onClick={() => setActiveTab(tab.id)}
                            className="relative z-10 flex-1 h-16 flex flex-col items-center justify-center transition-colors duration-300 ease-out focus:outline-none"
                            aria-label={tab.label}
                        >
                            <Icon
                                className={`w-7 h-7 stroke-current transition-all duration-300
                                    ${isActive ? 'text-theme-accent-primary-text scale-110' : 'text-theme-secondary group-hover:text-theme-primary'}`
                                }
                                strokeWidth={2.5}
                            />
                            <span 
                                className={`absolute bottom-1.5 text-xs font-bold transition-all duration-300
                                ${isActive ? 'opacity-100 translate-y-0 text-theme-accent-primary-text' : 'opacity-0 translate-y-2 text-theme-secondary'}`
                                }
                            >
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default TabBar;