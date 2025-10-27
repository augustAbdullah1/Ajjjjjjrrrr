import React, { useState, useEffect } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import type { Dhikr, Profile, Settings } from '../../types';
import { INITIAL_DHIKR_LIST } from '../../constants';
import Modal from '../ui/Modal';

interface CounterTabProps {
    settings: Settings;
    profile: Profile;
    setProfile: React.Dispatch<React.SetStateAction<Profile>>;
}

const CounterTab: React.FC<CounterTabProps> = ({ settings, profile, setProfile }) => {
    const [count, setCount] = useLocalStorage('counter', 0);
    const [dhikrList, setDhikrList] = useLocalStorage<Dhikr[]>('dhikrList', INITIAL_DHIKR_LIST);
    const [currentDhikr, setCurrentDhikr] = useLocalStorage<Dhikr>(
        'currentDhikr', 
        dhikrList.find(d => d.name === 'استغفر الله') || dhikrList[0]
    );
    const [target, setTarget] = useLocalStorage('tasbeehTarget', 0);

    const [isDhikrModalOpen, setIsDhikrModalOpen] = useState(false);
    const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
    const [isAddDhikrModalOpen, setIsAddDhikrModalOpen] = useState(false);
    const [newDhikrName, setNewDhikrName] = useState('');
    const [targetInput, setTargetInput] = useState(target > 0 ? target.toString() : '');

    useEffect(() => {
        const today = new Date().toDateString();
        const lastLogin = localStorage.getItem('lastLoginDate');
        if (lastLogin !== today) {
            localStorage.setItem('dailyCount', '0');
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if(lastLogin !== yesterday.toDateString()) {
                setProfile(p => ({ ...p, streak: 0 }));
            }
            localStorage.setItem('lastLoginDate', today);
        }
    }, [setProfile]);

    const handleIncrement = () => {
        const newCount = count + 1;
        setCount(newCount);
        setProfile(p => ({ ...p, totalCount: p.totalCount + 1 }));
        
        const dailyCount = parseInt(localStorage.getItem('dailyCount') || '0') + 1;
        localStorage.setItem('dailyCount', dailyCount.toString());

        if (dailyCount >= profile.dailyGoal && localStorage.getItem('goalMetDate') !== new Date().toDateString()) {
             setProfile(p => ({ ...p, streak: p.streak + 1 }));
             localStorage.setItem('goalMetDate', new Date().toDateString());
        }

        if (settings.vibration && navigator.vibrate) {
            navigator.vibrate(50);
        }
    };

    const handleReset = () => {
        setCount(0);
    };

    const selectDhikr = (dhikr: Dhikr) => {
        setCurrentDhikr(dhikr);
        setCount(0);
        setIsDhikrModalOpen(false);
    };

    const handleSetTarget = () => {
        const newTarget = parseInt(targetInput) || 0;
        setTarget(newTarget);
        setIsTargetModalOpen(false);
    };

    const handleAddDhikr = () => {
        if (newDhikrName.trim() && !dhikrList.some(d => d.name === newDhikrName.trim())) {
            const newDhikr: Dhikr = {
                id: Date.now(),
                name: newDhikrName.trim(),
                arabic: newDhikrName.trim(),
            };
            setDhikrList([...dhikrList, newDhikr]);
            setNewDhikrName('');
            setIsAddDhikrModalOpen(false);
        }
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center text-center py-4 flex-grow min-h-[300px]">
                <div className="text-7xl font-black text-theme-counter mb-2 drop-shadow-lg transition-transform duration-100 active:scale-95">
                    {count}
                </div>
                <div className="text-2xl font-bold mb-1 text-theme-accent opacity-95 min-h-[32px] px-2">
                    {currentDhikr.name}
                </div>
                <div className="text-sm font-semibold text-theme-accent opacity-80 mb-4 min-h-[20px]">
                    {target > 0 ? `الهدف: ${target}` : 'الهدف: لا يوجد'}
                </div>
                <button 
                    onClick={handleIncrement}
                    className="w-40 h-40 rounded-full bg-theme-counter border-4 border-white/30 text-theme-primary text-2xl font-black flex items-center justify-center shadow-lg shadow-theme-counter transition-transform duration-150 active:scale-90"
                >
                    آجر
                </button>
                <button onClick={handleReset} className="mt-4 px-5 py-2 bg-theme-reset text-white rounded-full text-sm font-semibold flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                    إعادة التعيين
                </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
                 <button onClick={() => setIsDhikrModalOpen(true)} className="px-4 py-3 bg-white/10 border border-theme rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95">
                    اختر ذكرًا
                </button>
                {settings.showSetGoal && (
                    <button onClick={() => setIsTargetModalOpen(true)} className="px-4 py-3 bg-white/10 border border-theme rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95">
                        تعيين الهدف
                    </button>
                )}
                {settings.showAddDhikr && (
                    <button onClick={() => setIsAddDhikrModalOpen(true)} className="col-span-2 px-4 py-3 bg-theme-add text-white rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95">
                        أضف ذكر
                    </button>
                )}
            </div>

            <Modal isOpen={isDhikrModalOpen} onClose={() => setIsDhikrModalOpen(false)} title="اختر ذكرًا">
                <div className="max-h-64 overflow-y-auto space-y-2">
                    {dhikrList.map(dhikr => (
                        <button key={dhikr.id} onClick={() => selectDhikr(dhikr)} className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg text-right font-semibold">
                            {dhikr.name}
                        </button>
                    ))}
                </div>
            </Modal>

            <Modal isOpen={isTargetModalOpen} onClose={() => setIsTargetModalOpen(false)} title="تعيين هدف">
                 <input type="number" value={targetInput} onChange={e => setTargetInput(e.target.value)} className="w-full p-3 my-4 bg-black/20 text-white rounded-lg text-center" placeholder="عدد الأذكار المطلوبة" />
                 <div className="flex gap-2 justify-center">
                    <button onClick={handleSetTarget} className="px-6 py-2 bg-green-500 text-white rounded-full font-bold">تأكيد</button>
                    <button onClick={() => setIsTargetModalOpen(false)} className="px-6 py-2 bg-theme-reset text-white rounded-full font-bold">إلغاء</button>
                 </div>
            </Modal>

            <Modal isOpen={isAddDhikrModalOpen} onClose={() => setIsAddDhikrModalOpen(false)} title="إضافة ذكر جديد">
                <input type="text" value={newDhikrName} onChange={e => setNewDhikrName(e.target.value)} className="w-full p-3 my-4 bg-black/20 text-white rounded-lg text-right" placeholder="اسم الذكر" />
                <button onClick={handleAddDhikr} className="w-full px-6 py-2 bg-theme-add text-white rounded-full font-bold">إضافة</button>
            </Modal>
        </>
    );
};

export default CounterTab;
