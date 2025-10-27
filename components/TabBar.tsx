import React from 'react';
import type { Tab } from '../types';
import { CounterIcon, DuaIcon, QuranIcon, PrayerIcon, QiblaIcon, ProfileIcon, SettingsIcon } from './icons/TabIcons';

interface TabBarProps {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
}

const TABS: { id: Tab; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { id: 'counter', label: 'عداد', icon: CounterIcon },
    { id: 'duas', label: 'أدعية', icon: DuaIcon },
    { id: 'quran', label: 'القرآن', icon: QuranIcon },
    { id: 'prayer', label: 'مواقيت', icon: PrayerIcon },
    { id: 'qibla', label: 'القبلة', icon: QiblaIcon },
    { id: 'profile', label: 'ملفي', icon: ProfileIcon },
    { id: 'settings', label: 'إعدادات', icon: SettingsIcon },
];

const TabBar: React.FC<TabBarProps> = ({ activeTab, setActiveTab }) => {
    return (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[95%] max-w-md flex justify-around bg-white/10 backdrop-blur-xl rounded-2xl p-2 border border-theme z-50 transition-all duration-300">
            {TABS.map(({ id, label, icon: Icon }) => (
                <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex flex-col items-center justify-center gap-1.5 flex-1 p-1 rounded-xl transition-all duration-200 ${activeTab === id ? 'bg-white/20 scale-105' : 'opacity-70'}`}
                >
                    <Icon className={`w-5 h-5 transition-colors ${activeTab === id ? 'stroke-theme-counter' : 'stroke-theme-accent'}`} />
                    <span className={`text-[0.6rem] font-semibold ${activeTab === id ? 'text-theme-counter' : 'text-theme-text'}`}>{label}</span>
                </button>
            ))}
        </div>
    );
};

export default TabBar;