import React, { useState, useEffect, useRef } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import type { Dhikr, Profile, Settings } from '../../types';
import { INITIAL_DHIKR_LIST } from '../../constants';
import Modal from '../ui/Modal';
// Fix: The 'ResetIcon' was not found. Using the existing 'ReplayIcon' as an alias because it is visually appropriate for a reset action.
import { InfoIcon, ReplayIcon as ResetIcon, PlusIcon, LoopIcon, ListIcon, SoundOnIcon, SoundOffIcon } from '../icons/TabIcons';

interface CounterTabProps {
    settings: Settings;
    profile: Profile;
    setProfile: React.Dispatch<React.SetStateAction<Profile>>;
}

type TasbihSequence = {
  name: string;
  dhikrs: Dhikr[];
  target: number;
  currentIndex: number;
};

const CounterTab: React.FC<CounterTabProps> = ({ settings, profile, setProfile }) => {
    const [count, setCount] = useLocalStorage('counter', 0);
    const [dhikrList, setDhikrList] = useLocalStorage<Dhikr[]>('dhikrList', INITIAL_DHIKR_LIST);
    const [currentDhikr, setCurrentDhikr] = useLocalStorage<Dhikr>(
        'currentDhikr', 
        dhikrList.find(d => d.arabic === 'استغفر الله') || dhikrList[0]
    );
    
    const [dailyCount, setDailyCount] = useLocalStorage('dailyCount', 0);
    const [dhikrHistory, setDhikrHistory] = useLocalStorage<Record<string, number>>('dhikrHistory', {});
    const [isDhikrModalOpen, setIsDhikrModalOpen] = useState(false);
    const [isAddDhikrModalOpen, setIsAddDhikrModalOpen] = useState(false);
    const [isVirtueModalOpen, setIsVirtueModalOpen] = useState(false);
    const [newDhikrName, setNewDhikrName] = useState('');
    const [isPopping, setIsPopping] = useState(false);
    const [activeSequence, setActiveSequence] = useState<TasbihSequence | null>(null);
    const [isSoundEnabled, setIsSoundEnabled] = useLocalStorage('counterSound', true);

    const audioRef = useRef<HTMLAudioElement>(null);

    const getTodayDateString = () => new Date().toISOString().split('T')[0];

    useEffect(() => {
        const todayString = getTodayDateString();
        const lastLogin = localStorage.getItem('lastLoginDate');

        if (lastLogin !== todayString) {
            setDailyCount(0);
            
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayString = yesterday.toISOString().split('T')[0];
            
            if (lastLogin !== yesterdayString) {
                setProfile(p => ({ ...p, streak: 0 }));
            }
            localStorage.setItem('lastLoginDate', todayString);
        }
    }, [setProfile, setDailyCount]);

    const postPrayerSequence: TasbihSequence = {
      name: 'تسبيح بعد الصلاة',
      dhikrs: [
        dhikrList.find(d => d.arabic === 'سبحان الله')!,
        dhikrList.find(d => d.arabic === 'الحمد لله')!,
        dhikrList.find(d => d.arabic === 'الله أكبر')!,
      ].filter(Boolean),
      target: 33,
      currentIndex: 0,
    };

    const handleIncrement = () => {
        const newCount = count + 1;
        const todayString = getTodayDateString();

        if (settings.vibration && navigator.vibrate) {
            const isMilestone = newCount === 33 || newCount === 99 || newCount === 100 || (activeSequence && newCount === activeSequence.target);
            navigator.vibrate(isMilestone ? [80, 40, 80] : 40);
        }
        
        if (isSoundEnabled && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => console.error("Sound play failed", e));
        }

        if (activeSequence && newCount >= activeSequence.target) {
            const nextIndex = activeSequence.currentIndex + 1;
            if (nextIndex < activeSequence.dhikrs.length) {
                const newSequenceState = { ...activeSequence, currentIndex: nextIndex };
                setActiveSequence(newSequenceState);
                setCurrentDhikr(newSequenceState.dhikrs[nextIndex]);
                setCount(0);
            } else {
                setActiveSequence(null);
                setCurrentDhikr(dhikrList[0]);
                setCount(0);
            }
        } else {
            setCount(newCount);
        }

        setProfile(p => ({ ...p, totalCount: p.totalCount + 1 }));
        const newDailyCount = dailyCount + 1;
        setDailyCount(newDailyCount);

        // Update dhikr history for the new profile chart
        const newHistory = { ...dhikrHistory, [todayString]: (dhikrHistory[todayString] || 0) + 1 };
        setDhikrHistory(newHistory);


        if (newDailyCount >= profile.dailyGoal && localStorage.getItem('goalMetDate') !== new Date().toDateString()) {
             setProfile(p => ({ ...p, streak: p.streak + 1 }));
             localStorage.setItem('goalMetDate', new Date().toDateString());
        }
        
        setIsPopping(true);
    };

    const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (settings.tapAnywhere) {
            const target = e.target as HTMLElement;
            if (target.closest('button, a, input, select')) return;
            handleIncrement();
        }
    };

    const handleReset = () => {
        setCount(0);
        if (activeSequence) {
            setActiveSequence({ ...activeSequence, currentIndex: 0 });
            setCurrentDhikr(activeSequence.dhikrs[0]);
        }
    };

    const selectDhikr = (dhikr: Dhikr) => {
        setActiveSequence(null);
        setCurrentDhikr(dhikr);
        setCount(0);
        setIsDhikrModalOpen(false);
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
    
    const toggleSequence = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (activeSequence) {
            setActiveSequence(null);
            setCount(0);
            setCurrentDhikr(dhikrList.find(d => d.id === 1) || dhikrList[0]);
        } else {
            const seq = { ...postPrayerSequence, currentIndex: 0, dhikrs: postPrayerSequence.dhikrs.filter(d => d) };
            if (seq.dhikrs.length < 3) {
                alert("لم يتم العثور على أذكار التسبيح الأساسية (سبحان الله, الحمد لله, الله أكبر) في قائمتك.");
                return;
            }
            setActiveSequence(seq);
            setCurrentDhikr(seq.dhikrs[0]);
            setCount(0);
        }
    };

    const goalProgress = profile.dailyGoal > 0 ? (dailyCount / profile.dailyGoal) * 100 : 0;

    return (
        <>
            <audio ref={audioRef} src="data:audio/wav;base64,UklGRjQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAYAAAA/w//+v/5//r/9v/z//H/8P/v/+z/7P/s/+v/6//r/+v/6//q/+r/6v/q/+r/6g=="></audio>
            <div 
                onClick={handleContainerClick}
                className="flex flex-col h-full items-center text-center counter-bg-pattern justify-between pt-2"
            >
                <div> {/* Wrapper for top and middle content */}
                    {/* Top Section */}
                    <div className="w-full px-4 space-y-2 flex-shrink-0">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-theme-secondary">الهدف اليومي: {dailyCount}/{profile.dailyGoal}</span>
                            {currentDhikr.virtue && (
                                <button onClick={(e) => { e.stopPropagation(); setIsVirtueModalOpen(true); }} className="p-2 text-theme-secondary/70 hover:text-theme-secondary">
                                    <InfoIcon className="w-5 h-5"/>
                                </button>
                            )}
                        </div>
                        <div className="w-full bg-black/20 rounded-theme-full h-1.5 overflow-hidden p-0.5">
                            <div className="bg-theme-accent-primary h-full rounded-theme-full" style={{ width: `${Math.min(goalProgress, 100)}%`, transition: 'width 0.5s' }}></div>
                        </div>
                    </div>

                    {/* Middle Section: Counter */}
                    <div className="flex flex-col items-center justify-center min-h-0 py-2">
                        <div className="text-center mb-6">
                            <h2 className="font-amiri text-5xl text-theme-primary drop-shadow-lg">{currentDhikr.arabic}</h2>
                        </div>
                        {activeSequence && (
                            <div className="flex gap-2 mb-4">
                                {activeSequence.dhikrs.map((d, index) => (
                                    <div key={d.id} className={`w-2 h-2 rounded-theme-full transition-all ${index === activeSequence.currentIndex ? 'bg-theme-accent-primary scale-125' : 'bg-white/20'}`}></div>
                                ))}
                            </div>
                        )}
                        <button 
                            onClick={handleIncrement}
                            onAnimationEnd={() => setIsPopping(false)}
                            className={`container-luminous w-44 h-44 sm:w-48 sm:h-48 rounded-theme-full flex flex-col items-center justify-center transition-transform duration-150 active:scale-95 ${isPopping ? 'animate-pop' : ''}`}
                        >
                            <span className="text-6xl sm:text-7xl font-black text-white" style={{textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>{count}</span>
                        </button>
                    </div>
                </div>
                
                {/* Bottom Toolbar */}
                <div className="w-full max-w-sm flex justify-around items-center p-1.5 container-luminous rounded-theme-full flex-shrink-0 mb-2">
                    <button onClick={(e) => { e.stopPropagation(); handleReset(); }} className="button-luminous flex flex-col items-center text-theme-danger/80 hover:text-theme-danger p-1.5 w-14" title="إعادة">
                        <ResetIcon className="w-5 h-5" />
                        <span className="text-[10px] font-semibold mt-0.5">إعادة</span>
                    </button>
                    {settings.showDhikrSelection && (
                        <button onClick={(e) => { e.stopPropagation(); setIsDhikrModalOpen(true); }} className="button-luminous flex flex-col items-center text-theme-secondary hover:text-theme-primary p-1.5 w-14" title="اختر ذكر">
                            <ListIcon className="w-5 h-5" />
                            <span className="text-[10px] font-semibold mt-0.5">الأذكار</span>
                        </button>
                    )}
                    <button 
                        onClick={(e) => { e.stopPropagation(); setIsSoundEnabled(!isSoundEnabled); }}
                        className={`button-luminous flex flex-col items-center p-1.5 w-14 ${isSoundEnabled ? 'text-theme-accent-primary' : 'text-theme-secondary hover:text-theme-primary'}`}
                        title={isSoundEnabled ? 'كتم الصوت' : 'تفعيل الصوت'}
                    >
                        {isSoundEnabled ? <SoundOnIcon className="w-5 h-5" /> : <SoundOffIcon className="w-5 h-5" />}
                        <span className="text-[10px] font-semibold mt-0.5">الصوت</span>
                    </button>
                    <button onClick={toggleSequence} className={`button-luminous flex flex-col items-center p-1.5 w-14 ${activeSequence ? 'text-theme-accent-primary' : 'text-theme-secondary hover:text-theme-primary'}`} title="وضع التسبيح">
                        <LoopIcon className="w-5 h-5" />
                        <span className="text-[10px] font-semibold mt-0.5">تسبيح</span>
                    </button>
                </div>
            </div>

            <Modal isOpen={isDhikrModalOpen} onClose={() => setIsDhikrModalOpen(false)} title="اختر ذكرًا">
                <div className="max-h-64 overflow-y-auto space-y-2">
                    {dhikrList.map(dhikr => (
                        <button key={dhikr.id} onClick={() => selectDhikr(dhikr)} className="w-full p-3 container-luminous rounded-theme-card text-right font-semibold">
                            {dhikr.name}
                        </button>
                    ))}
                </div>
                 {settings.showAddDhikr && (
                    <button
                        onClick={() => {
                            setIsDhikrModalOpen(false);
                            setIsAddDhikrModalOpen(true);
                        }}
                        className="w-full p-3 mt-3 button-luminous bg-theme-accent-card rounded-theme-full text-center font-semibold flex items-center justify-center gap-2"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>إضافة ذكر جديد</span>
                    </button>
                )}
            </Modal>

            <Modal isOpen={isAddDhikrModalOpen} onClose={() => setIsAddDhikrModalOpen(false)} title="إضافة ذكر جديد">
                 {settings.showAddDhikr && (
                    <>
                        <input type="text" value={newDhikrName} onChange={e => setNewDhikrName(e.target.value)} className="w-full p-3 my-4 input-luminous text-theme-primary rounded-theme-card text-right" placeholder="اسم الذكر" />
                        <button onClick={handleAddDhikr} className="w-full px-6 py-2 button-luminous bg-theme-accent-primary text-theme-accent-primary-text rounded-theme-full font-bold">إضافة</button>
                    </>
                )}
            </Modal>
            
            <Modal isOpen={isVirtueModalOpen} onClose={() => setIsVirtueModalOpen(false)} title="فضل الذكر">
                <p className="text-lg text-center font-amiri leading-relaxed p-4">{currentDhikr.virtue || "لا يوجد وصف حالياً."}</p>
            </Modal>
        </>
    );
};

export default CounterTab;