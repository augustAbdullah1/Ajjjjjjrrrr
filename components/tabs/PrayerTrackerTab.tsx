import React from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { ChevronLeftIcon, CheckCircleIcon, FireIcon } from '../icons/TabIcons';
import type { PrayerName, PrayerCommitmentData } from '../../types';

const PRAYERS: { id: PrayerName; label: string }[] = [
    { id: 'fajr', label: 'الفجر' },
    { id: 'dhuhr', label: 'الظهر' },
    { id: 'asr', label: 'العصر' },
    { id: 'maghrib', label: 'المغرب' },
    { id: 'isha', label: 'العشاء' },
];

const PrayerTrackerTab: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [data, setData] = useLocalStorage<PrayerCommitmentData>('prayerCommitment', {
        history: {}, streak: 0, totalPrayed: 0
    });

    const today = new Date().toISOString().split('T')[0];
    const todayPrayers = data.history[today] || { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false };

    const togglePrayer = (prayer: PrayerName) => {
        const newState = !todayPrayers[prayer];
        setData(prev => ({
            ...prev,
            history: { ...prev.history, [today]: { ...todayPrayers, [prayer]: newState } },
            totalPrayed: newState ? prev.totalPrayed + 1 : prev.totalPrayed - 1
        }));
    };

    return (
        <div className="fixed inset-0 bg-[#0A0A0A] z-[100] flex flex-col view-transition p-6">
            <header className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white">رفيق الالتزام</h2>
                <button onClick={onBack} className="p-3 bg-white/5 rounded-2xl text-gray-400"><ChevronLeftIcon className="w-6 h-6" style={{ transform: 'scaleX(-1)' }} /></button>
            </header>

            <div className="space-y-6">
                <div className="glass-card p-8 flex flex-col items-center luminous-glow">
                    <FireIcon className="w-12 h-12 text-orange-500 mb-2" />
                    <span className="text-5xl font-black text-white">{data.streak}</span>
                    <span className="text-xs text-gray-500 font-bold uppercase mt-1">يوم متواصل من الصلاة</span>
                </div>

                <div className="space-y-3">
                    <h3 className="text-gray-400 font-bold text-sm px-2">صلوات اليوم</h3>
                    {PRAYERS.map(p => {
                        const active = todayPrayers[p.id];
                        return (
                            <button key={p.id} onClick={() => togglePrayer(p.id)} className={`w-full p-6 rounded-[2rem] border flex justify-between items-center transition-all ${active ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-white' : 'bg-white/5 border-transparent text-gray-500'}`}>
                                <span className="text-lg font-bold">{p.label}</span>
                                {active ? <CheckCircleIcon className="w-6 h-6 text-[#D4AF37]" /> : <div className="w-6 h-6 rounded-full border-2 border-gray-700"></div>}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PrayerTrackerTab;