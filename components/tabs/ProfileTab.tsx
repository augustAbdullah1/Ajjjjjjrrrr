
import React, { useState, useEffect } from 'react';
import type { Profile } from '../../types';
import Modal from '../ui/Modal';

interface ProfileTabProps {
    profile: Profile;
    setProfile: React.Dispatch<React.SetStateAction<Profile>>;
}

const StatCard: React.FC<{ value: string | number, label: string }> = ({ value, label }) => (
    <div className="bg-white/5 p-4 rounded-xl text-center">
        <div className="text-2xl font-bold text-theme-counter">{value}</div>
        <div className="text-xs text-theme-accent/80">{label}</div>
    </div>
);

const ProfileTab: React.FC<ProfileTabProps> = ({ profile, setProfile }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [nameInput, setNameInput] = useState(profile.name);
    const [bioInput, setBioInput] = useState(profile.bio);

    useEffect(() => {
        setNameInput(profile.name);
        setBioInput(profile.bio);
    }, [profile]);
    
    const handleSaveProfile = () => {
        if (nameInput.trim()) {
            setProfile(p => ({ ...p, name: nameInput.trim(), bio: bioInput.trim() }));
            setIsEditModalOpen(false);
        }
    };

    const dailyCount = parseInt(localStorage.getItem('dailyCount') || '0');
    const goalProgress = profile.dailyGoal > 0 ? (dailyCount / profile.dailyGoal) * 100 : 0;
    
    return (
        <>
            <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-theme-accent flex items-center justify-center text-5xl font-bold text-theme-primary ring-4 ring-white/20">
                    {profile.name.charAt(0)}
                </div>
                <div className="text-center">
                    <h2 className="text-2xl font-bold">{profile.name}</h2>
                    <p className="text-sm text-theme-accent/80 mt-1">{profile.bio}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 w-full">
                    <StatCard value={profile.totalCount} label="مجموع الأذكار" />
                    <StatCard value={profile.streak} label="يوم متتالي" />
                    <StatCard value={profile.level} label="المستوى" />
                    <StatCard value={profile.rank} label="التصنيف" />
                </div>

                <div className="w-full p-4 bg-white/5 rounded-xl">
                    <h3 className="font-bold text-lg text-theme-accent mb-2">الهدف اليومي</h3>
                    <div className="w-full bg-black/20 rounded-full h-2.5">
                        <div className="bg-theme-add h-2.5 rounded-full" style={{ width: `${Math.min(goalProgress, 100)}%` }}></div>
                    </div>
                    <div className="text-xs text-theme-accent/80 mt-1 flex justify-between">
                       <span>{Math.min(goalProgress, 100).toFixed(0)}% مكتمل</span>
                       <span>{dailyCount} / {profile.dailyGoal}</span>
                    </div>
                </div>

                <button onClick={() => setIsEditModalOpen(true)} className="w-full p-3 bg-white/10 border border-theme rounded-full text-sm font-semibold flex items-center justify-center gap-2">
                    تعديل الملف الشخصي
                </button>
            </div>
            
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="تعديل الملف الشخصي">
                <div className="flex flex-col gap-4 text-right">
                    <input type="text" value={nameInput} onChange={e => setNameInput(e.target.value)} placeholder="الاسم" className="w-full p-3 bg-black/20 text-white rounded-lg"/>
                    <textarea value={bioInput} onChange={e => setBioInput(e.target.value)} placeholder="نبذة عنك" className="w-full h-24 p-3 bg-black/20 text-white rounded-lg resize-none"></textarea>
                    <button onClick={handleSaveProfile} className="w-full p-3 bg-green-500 text-white rounded-full font-bold">حفظ</button>
                </div>
            </Modal>
        </>
    );
};

export default ProfileTab;
