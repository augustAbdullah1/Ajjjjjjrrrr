import React from 'react';
import type { Profile } from '../../types';
import { ACHIEVEMENTS_LIST } from '../../constants';
import { ChevronLeftIcon, StarIcon, TrophyIcon, FireIcon } from '../icons/TabIcons';

interface ProfileTabProps {
    profile: Profile;
    onClose: () => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ profile, onClose }) => {
    const unlockedCount = Object.values(profile.achievements).filter(Boolean).length;

    return (
        <div className="fixed inset-0 bg-[#111827] z-[100] flex flex-col overflow-y-auto">
            <header className="sticky top-0 p-4 flex items-center justify-between bg-[#111827]/95 backdrop-blur border-b border-gray-800 z-10">
                <h1 className="text-xl font-bold text-white font-amiri">الملف الشخصي</h1>
                <button onClick={onClose} className="p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white">
                    <ChevronLeftIcon className="w-6 h-6" style={{ transform: 'scaleX(-1)' }} />
                </button>
            </header>

            <main className="p-4 space-y-6 pb-32">
                {/* User Info Card */}
                <div className="app-card p-6 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#D4AF37] flex items-center justify-center text-black text-2xl font-bold shadow-lg">
                        {profile.name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">{profile.name}</h2>
                        <p className="text-[#D4AF37] text-sm">{profile.title}</p>
                        <p className="text-gray-500 text-xs mt-1">المستوى {profile.level}</p>
                    </div>
                </div>

                {/* Summary Pills */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="app-card p-4 flex flex-col items-center justify-center gap-2">
                        <FireIcon className="w-6 h-6 text-orange-500" />
                        <span className="text-2xl font-bold text-white">{profile.streak}</span>
                        <span className="text-xs text-gray-500">أيام متتالية</span>
                    </div>
                    <div className="app-card p-4 flex flex-col items-center justify-center gap-2">
                        <TrophyIcon className="w-6 h-6 text-[#D4AF37]" />
                        <span className="text-2xl font-bold text-white">{unlockedCount}</span>
                        <span className="text-xs text-gray-500">إنجاز</span>
                    </div>
                </div>

                {/* Achievements List */}
                <div>
                    <h3 className="text-lg font-bold text-white mb-3 px-1">الأوسمة</h3>
                    <div className="space-y-3">
                        {ACHIEVEMENTS_LIST.map((ach) => {
                            const isUnlocked = profile.achievements[ach.id];
                            return (
                                <div 
                                    key={ach.id} 
                                    className={`app-card p-4 flex items-center gap-4 transition-opacity ${isUnlocked ? 'opacity-100 border-[#D4AF37]/30' : 'opacity-50 grayscale'}`}
                                >
                                    <div className="text-2xl">{ach.icon}</div>
                                    <div>
                                        <h4 className="font-bold text-sm text-white">{ach.title}</h4>
                                        <p className="text-xs text-gray-500 mt-1">{ach.description}</p>
                                    </div>
                                    {isUnlocked && <div className="mr-auto text-[#D4AF37]"><StarIcon className="w-4 h-4 fill-current"/></div>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfileTab;