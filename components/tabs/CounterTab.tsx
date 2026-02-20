import React, { useState, useRef } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import type { Dhikr, Profile, Settings } from '../../types';
import { INITIAL_DHIKR_LIST } from '../../constants';
import Modal from '../ui/Modal';
import { ReplayIcon as ResetIcon, ListIcon, SoundOnIcon, SoundOffIcon } from '../icons/TabIcons';

interface CounterTabProps {
    settings: Settings;
    profile: Profile;
    setProfile: React.Dispatch<React.SetStateAction<Profile>>;
}

const CounterTab: React.FC<CounterTabProps> = ({ settings, profile, setProfile }) => {
    const [count, setCount] = useLocalStorage('counter', 0);
    const [dhikrList] = useLocalStorage<Dhikr[]>('dhikrList', INITIAL_DHIKR_LIST);
    const [currentDhikr, setCurrentDhikr] = useLocalStorage<Dhikr>('currentDhikr', INITIAL_DHIKR_LIST[0]);
    const [isSoundEnabled, setIsSoundEnabled] = useLocalStorage('counterSound', true);
    const [isDhikrModalOpen, setIsDhikrModalOpen] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const handleIncrement = () => {
        setCount(count + 1);
        if (settings.vibration && navigator.vibrate) navigator.vibrate(12);
        if (isSoundEnabled && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
        }
        setProfile(prev => ({ ...prev, totalCount: prev.totalCount + 1 }));
    };

    return (
        <div className="fixed inset-0 bg-[#111827] flex flex-col" onClick={handleIncrement}>
            <audio ref={audioRef} src="data:audio/wav;base64,UklGRjQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAYAAAA/w//+v/5//r/9v/z//H/8P/v/+z/7P/s/+v/6//r/+v/6//q/+r/6v/q/+r/6g=="></audio>

            {/* Header */}
            <div className="flex items-center justify-between p-4 pt-[calc(env(safe-area-inset-top)+1rem)] z-10" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setIsDhikrModalOpen(true)} className="p-3 bg-[#1F2937] rounded-full text-white shadow-md active:scale-95 transition-transform">
                    <ListIcon className="w-6 h-6" />
                </button>
                <button onClick={() => setIsSoundEnabled(!isSoundEnabled)} className="p-3 bg-[#1F2937] rounded-full text-gray-400 shadow-md active:scale-95 transition-transform">
                    {isSoundEnabled ? <SoundOnIcon className="w-6 h-6" /> : <SoundOffIcon className="w-6 h-6" />}
                </button>
            </div>

            {/* Main Counter Area */}
            <div className="flex-grow flex flex-col items-center justify-center gap-12">
                <div className="text-center px-6">
                    <h2 className="text-[#D4AF37] font-amiri text-3xl font-bold mb-2">{currentDhikr.name}</h2>
                    {currentDhikr.virtue && <p className="text-gray-500 text-xs max-w-xs mx-auto leading-relaxed">{currentDhikr.virtue}</p>}
                </div>

                <div className="relative">
                    <div className="w-64 h-64 rounded-full border-8 border-[#1F2937] bg-[#1F2937] shadow-xl flex items-center justify-center active:scale-95 transition-transform duration-100 cursor-pointer">
                        <span className="text-7xl font-bold text-white font-mono select-none">{count}</span>
                    </div>
                </div>

                <button 
                    onClick={(e) => { e.stopPropagation(); if(confirm('تصفير العداد؟')) setCount(0); }} 
                    className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#1F2937] text-gray-400 hover:text-white transition-colors"
                >
                    <ResetIcon className="w-4 h-4" />
                    <span className="text-sm font-bold">تصفير</span>
                </button>
            </div>

            <Modal isOpen={isDhikrModalOpen} onClose={() => setIsDhikrModalOpen(false)} title="الأوراد">
                <div className="max-h-[60vh] overflow-y-auto space-y-2 p-1">
                    {dhikrList.map(d => (
                        <button 
                            key={d.id} 
                            onClick={() => { setCurrentDhikr(d); setCount(0); setIsDhikrModalOpen(false); }}
                            className={`w-full p-4 rounded-xl text-right transition-colors ${currentDhikr.id === d.id ? 'bg-[#D4AF37] text-black font-bold' : 'bg-[#1F2937] text-white hover:bg-gray-700'}`}
                        >
                            <span className="font-amiri text-lg">{d.name}</span>
                        </button>
                    ))}
                </div>
            </Modal>
        </div>
    );
};

export default CounterTab;