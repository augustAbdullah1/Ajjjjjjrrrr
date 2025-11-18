import React, { useRef } from 'react';
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
    const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

    return (
        <nav 
            className="fixed inset-x-0 bottom-0 z-50 h-[calc(4rem+env(safe-area-inset-bottom))] bg-theme-tab-bar border-t border-theme"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
            <div className="relative w-full h-full flex justify-around items-center">
                {TABS.map((tab, index) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            // Fix: The ref callback should not return a value. Added curly braces to ensure a void return type.
                            ref={el => { tabsRef.current[index] = el; }}
                            onClick={() => setActiveTab(tab.id)}
                            className={`tab-button relative z-10 flex-1 h-full flex flex-col items-center justify-center focus:outline-none group ${isActive ? 'active' : ''}`}
                            aria-label={tab.label}
                        >
                             <div className={`w-14 h-14 flex items-center justify-center rounded-full transition-colors duration-300 ${isActive ? 'bg-theme-accent-primary shadow-theme-accent' : ''}`}>
                                <Icon
                                    className={`w-7 h-7 stroke-current transition-colors duration-300 ${tab.id === 'home' ? 'prayer-icon' : ''}
                                        ${isActive 
                                            ? 'text-theme-accent-primary-text' 
                                            : 'text-theme-secondary group-hover:text-theme-primary'}`
                                    }
                                    strokeWidth={2}
                                />
                            </div>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default TabBar;