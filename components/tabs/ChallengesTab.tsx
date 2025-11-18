
import React, { useState, useEffect } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import type { Challenge, ChallengeParticipant, Profile } from '../../types';
import { ChevronLeftIcon, PlusIcon, TrashIcon, UsersIcon } from '../icons/TabIcons';
import Modal from '../ui/Modal';

interface ChallengesTabProps {
    onBack: () => void;
    profile: Profile;
}

const ChallengesTab: React.FC<ChallengesTabProps> = ({ onBack, profile }) => {
    const [challenges, setChallenges] = useLocalStorage<Challenge[]>('challenges', []);
    const [view, setView] = useState<'list' | 'detail'>('list');
    const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
    
    // Modals state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isAddParticipantModalOpen, setIsAddParticipantModalOpen] = useState(false);
    const [isUpdateScoreModalOpen, setIsUpdateScoreModalOpen] = useState(false);
    
    // Form state
    const [newChallengeName, setNewChallengeName] = useState('');
    const [newChallengeGoal, setNewChallengeGoal] = useState(1000);
    const [newParticipantName, setNewParticipantName] = useState('');
    const [participantToUpdate, setParticipantToUpdate] = useState<ChallengeParticipant | null>(null);
    const [newScore, setNewScore] = useState(0);

    const handleViewDetail = (challenge: Challenge) => {
        setSelectedChallenge(challenge);
        setView('detail');
    };

    const handleCreateChallenge = () => {
        if (!newChallengeName.trim() || newChallengeGoal <= 0) {
            alert('يرجى إدخال اسم وهدف صحيحين للتحدي.');
            return;
        }

        const userParticipant: ChallengeParticipant = {
            id: 'user',
            name: profile.name,
            count: 0,
            isUser: true,
            startCount: profile.totalCount, // Track user's count at the start
        };

        const newChallenge: Challenge = {
            id: Date.now().toString(),
            name: newChallengeName,
            goal: newChallengeGoal,
            participants: [userParticipant],
            createdAt: new Date().toISOString(),
        };

        setChallenges([...challenges, newChallenge]);
        setIsCreateModalOpen(false);
        setNewChallengeName('');
        setNewChallengeGoal(1000);
    };
    
    const handleDeleteChallenge = (challengeId: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذا التحدي؟')) {
            setChallenges(challenges.filter(c => c.id !== challengeId));
            setView('list');
            setSelectedChallenge(null);
        }
    };
    
    const handleAddParticipant = () => {
        if (!newParticipantName.trim() || !selectedChallenge) return;
        
        const newParticipant: ChallengeParticipant = {
            id: Date.now().toString(),
            name: newParticipantName,
            count: 0,
            isUser: false,
        };
        
        const updatedChallenges = challenges.map(c => {
            if (c.id === selectedChallenge.id) {
                return { ...c, participants: [...c.participants, newParticipant] };
            }
            return c;
        });
        
        setChallenges(updatedChallenges);
        setSelectedChallenge(updatedChallenges.find(c => c.id === selectedChallenge.id) || null);
        setIsAddParticipantModalOpen(false);
        setNewParticipantName('');
    };

    const handleUpdateScore = () => {
        if (!selectedChallenge || !participantToUpdate || newScore < 0) return;

        const updatedChallenges = challenges.map(c => {
            if (c.id === selectedChallenge.id) {
                const updatedParticipants = c.participants.map(p => 
                    p.id === participantToUpdate.id ? { ...p, count: newScore } : p
                );
                return { ...c, participants: updatedParticipants };
            }
            return c;
        });

        setChallenges(updatedChallenges);
        setSelectedChallenge(updatedChallenges.find(c => c.id === selectedChallenge.id) || null);
        setIsUpdateScoreModalOpen(false);
        setParticipantToUpdate(null);
        setNewScore(0);
    };


    const ChallengeListView = () => (
        <div className="flex flex-col gap-4 p-4 pb-28" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}>
            <header className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 text-theme-secondary hover:text-theme-primary"><ChevronLeftIcon className="w-7 h-7" style={{ transform: 'scaleX(-1)' }}/></button>
                <h2 className="text-2xl font-bold heading-amiri">منافسات الأصدقاء</h2>
            </header>
            
            <div className="space-y-3">
                 <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="w-full p-4 container-luminous rounded-theme-card border-2 border-dashed border-theme-accent-faded flex flex-col items-center justify-center gap-2 text-theme-accent-primary hover:border-theme-accent-primary transition-all"
                >
                    <PlusIcon className="w-8 h-8"/>
                    <span className="font-bold">إنشاء تحدي جديد</span>
                </button>
                {challenges.length > 0 ? challenges.map(challenge => {
                    const totalCount = challenge.participants.reduce((sum, p) => {
                        if (p.isUser) {
                             const userContribution = profile.totalCount - (p.startCount || 0);
                             return sum + userContribution;
                        }
                        return sum + p.count;
                    }, 0);
                    const progress = (totalCount / challenge.goal) * 100;
                    return (
                        <button key={challenge.id} onClick={() => handleViewDetail(challenge)} className="w-full p-4 container-luminous rounded-theme-card text-right space-y-2">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-lg">{challenge.name}</h3>
                                <span className="text-sm font-bold text-theme-accent-primary">{Math.min(100, progress).toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-black/20 rounded-full h-1.5 p-0.5">
                                <div className="bg-theme-accent-primary h-full rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                            </div>
                            <p className="text-xs text-theme-secondary">{totalCount.toLocaleString()} / {challenge.goal.toLocaleString()} ذكر</p>
                        </button>
                    )
                }) : (
                    <div className="text-center text-theme-secondary/70 pt-8 flex flex-col items-center gap-4">
                        <UsersIcon className="w-16 h-16 opacity-30" />
                        <h3 className="text-xl font-bold text-theme-primary">ابدأ تحدياً جديداً</h3>
                        <p className="max-w-xs">تنافس مع أصدقائك في الخير وحافظوا على ذكر الله.</p>
                    </div>
                )}
            </div>
        </div>
    );

    const ChallengeDetailView = () => {
        if (!selectedChallenge) return null;

        const participantsWithUserProgress = selectedChallenge.participants.map(p => {
            if (p.isUser) {
                return { ...p, count: profile.totalCount - (p.startCount || 0) };
            }
            return p;
        }).sort((a, b) => b.count - a.count);

        const totalCount = participantsWithUserProgress.reduce((sum, p) => sum + p.count, 0);
        const progress = (totalCount / selectedChallenge.goal) * 100;

        return (
            <div className="flex flex-col gap-4 p-4 pb-28" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}>
                <header className="flex items-center gap-4">
                    <button onClick={() => setView('list')} className="p-2 text-theme-secondary hover:text-theme-primary"><ChevronLeftIcon className="w-7 h-7" style={{ transform: 'scaleX(-1)' }}/></button>
                    <h2 className="text-2xl font-bold heading-amiri truncate">{selectedChallenge.name}</h2>
                </header>

                <div className="p-4 container-luminous rounded-theme-card text-right space-y-2">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg">التقدم الإجمالي</h3>
                        <span className="text-sm font-bold text-theme-accent-primary">{Math.min(100, progress).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-black/20 rounded-full h-2 p-0.5">
                        <div className="bg-theme-accent-primary h-full rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                    </div>
                    <p className="text-sm text-theme-secondary">{totalCount.toLocaleString()} / {selectedChallenge.goal.toLocaleString()}</p>
                </div>
                
                <div className="p-4 container-luminous rounded-theme-card">
                     <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-lg">لوحة الصدارة</h3>
                        <button onClick={() => setIsAddParticipantModalOpen(true)} className="flex items-center gap-1 text-xs font-semibold button-luminous px-2 py-1">
                            <PlusIcon className="w-4 h-4" /> إضافة صديق
                        </button>
                    </div>
                     <div className="space-y-2">
                        {participantsWithUserProgress.map((p, index) => (
                             <div key={p.id} className={`flex items-center gap-3 p-2 rounded-lg ${p.isUser ? 'bg-theme-accent-card' : 'bg-black/10'}`}>
                                <span className="font-black text-xl w-6 text-center">{index + 1}</span>
                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg container-luminous" style={p.isUser ? {backgroundColor: profile.avatarColor} : {}}>
                                    {p.isUser && profile.avatarImage ? <img src={profile.avatarImage} className="w-full h-full object-cover rounded-full" /> : p.name.charAt(0)}
                                </div>
                                <div className="flex-grow text-right">
                                    <p className="font-bold">{p.name} {p.isUser && "(أنت)"}</p>
                                    <p className="text-sm text-theme-accent-primary font-bold">{p.count.toLocaleString()} ذكر</p>
                                </div>
                                {!p.isUser && (
                                     <button 
                                        onClick={() => {
                                            setParticipantToUpdate(p);
                                            setNewScore(p.count);
                                            setIsUpdateScoreModalOpen(true);
                                        }}
                                        className="text-xs font-semibold button-luminous px-2 py-1"
                                    >
                                        تحديث
                                    </button>
                                )}
                             </div>
                        ))}
                    </div>
                </div>

                <button onClick={() => handleDeleteChallenge(selectedChallenge.id)} className="w-full p-3 button-luminous bg-red-500/20 text-red-400 rounded-theme-full font-bold flex items-center justify-center gap-2 mt-4">
                    <TrashIcon className="w-5 h-5"/>
                    <span>حذف التحدي</span>
                </button>
            </div>
        )
    };
    
    return (
         <>
            <div className="view-container">
                <div 
                    key={view} 
                    className="view-content view-enter"
                >
                    {view === 'list' ? <ChallengeListView /> : <ChallengeDetailView />}
                </div>
            </div>
            
            {/* Modals */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="إنشاء تحدي جديد">
                <div className="text-right space-y-4 my-4">
                    <div>
                        <label className="font-semibold text-sm mb-1 block">اسم التحدي</label>
                        <input type="text" value={newChallengeName} onChange={e => setNewChallengeName(e.target.value)} placeholder="مثال: ختمة تسبيح" className="w-full p-3 input-luminous rounded-lg"/>
                    </div>
                    <div>
                        <label className="font-semibold text-sm mb-1 block">الهدف الإجمالي (عدد الأذكار)</label>
                        <input type="number" value={newChallengeGoal} onChange={e => setNewChallengeGoal(Number(e.target.value))} className="w-full p-3 input-luminous rounded-lg"/>
                    </div>
                </div>
                <button onClick={handleCreateChallenge} className="w-full p-3 button-luminous bg-theme-accent-primary text-theme-accent-primary-text rounded-theme-full font-bold">إنشاء</button>
            </Modal>
            
            <Modal isOpen={isAddParticipantModalOpen} onClose={() => setIsAddParticipantModalOpen(false)} title="إضافة صديق للتحدي">
                 <div className="text-right space-y-4 my-4">
                    <div>
                        <label className="font-semibold text-sm mb-1 block">اسم الصديق</label>
                        <input type="text" value={newParticipantName} onChange={e => setNewParticipantName(e.target.value)} className="w-full p-3 input-luminous rounded-lg"/>
                    </div>
                </div>
                <button onClick={handleAddParticipant} className="w-full p-3 button-luminous bg-theme-accent-primary text-theme-accent-primary-text rounded-theme-full font-bold">إضافة</button>
            </Modal>

            <Modal isOpen={isUpdateScoreModalOpen} onClose={() => setIsUpdateScoreModalOpen(false)} title={`تحديث نقاط ${participantToUpdate?.name}`}>
                 <div className="text-right space-y-4 my-4">
                    <div>
                        <label className="font-semibold text-sm mb-1 block">العدد الجديد للأذكار</label>
                        <input type="number" value={newScore} onChange={e => setNewScore(Number(e.target.value))} className="w-full p-3 input-luminous rounded-lg"/>
                    </div>
                </div>
                <button onClick={handleUpdateScore} className="w-full p-3 button-luminous bg-theme-accent-primary text-theme-accent-primary-text rounded-theme-full font-bold">تحديث</button>
            </Modal>
        </>
    );
};

export default ChallengesTab;
