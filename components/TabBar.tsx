import React from 'react';
import type { Tab } from '../types';
import { CounterIcon, DuaIcon, QuranIcon, PrayerIcon, OtherIcon } from './icons/TabIcons';

interface TabBarProps {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
}

const TABS: { id: Tab; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { id: 'home', label: 'الرئيسية', icon: PrayerIcon },
    { id: 'duas', label: 'الأذكار', icon: DuaIcon },
    { id: 'quran', label: 'المصحف', icon: QuranIcon },
    { id: 'counter', label: 'السبحة', icon: CounterIcon },
    { id: 'other', label: 'المزيد', icon: OtherIcon },
];

const TabBar: React.FC<TabBarProps> = ({ activeTab, setActiveTab }) => {
    return (
        <div className="fixed bottom-0 inset-x-0 z-50 classic-tab-bar pb-[env(safe-area-inset-bottom)]">
            <nav className="flex justify-between items-center px-2 h-16 max-w-lg mx-auto w-full">
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive ? 'text-[#D4AF37]' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
                            <span className="text-[10px] font-medium">
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default TabBar;