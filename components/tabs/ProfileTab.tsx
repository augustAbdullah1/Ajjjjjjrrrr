import React, { useState, useEffect, useRef } from 'react';
import type { Profile, AchievementId, Settings, QuranUserData, Dhikr } from '../../types';
import { ACHIEVEMENTS_LIST } from '../../constants';
import useLocalStorage from '../../hooks/useLocalStorage';
import { ChevronLeftIcon, EditIcon, StarIcon, CounterIcon } from '../icons/TabIcons';

// --- Helper Functions & Constants ---
const XP_PER_DHIKR = 1;
const xpForLevel = (level: number) => Math.floor(500 * Math.pow(1.5, level - 1));

const AVATAR_COLORS = ['#63B3ED', '#B794F4', '#48BB78', '#F687B3', '#F6AD55', '#4FD1C5'];

// --- Child Components for the new Profile Design ---
const LevelProgressBar: React.FC<{ totalDhikr: number }> = ({ totalDhikr }) => {
    const totalXp = totalDhikr * XP_PER_DHIKR;
    
    let level = 1;
    let xpForCurrentLevel = 0;
    let requiredForNextLevel = xpForLevel(1);

    while (xpForCurrentLevel + requiredForNextLevel <= totalXp) {
        xpForCurrentLevel += requiredForNextLevel;
        level++;
        requiredForNextLevel = xpForLevel(level);
    }
    
    const xpInCurrentLevel = totalXp - xpForCurrentLevel;
    const progress = (xpInCurrentLevel / requiredForNextLevel) * 100;

    return (
        <div className="w-full px-6">
            <div className="flex justify-between items-center text-xs font-semibold mb-1 text-theme-secondary">
                <span>المستوى {level}</span>
                <span>{xpInCurrentLevel} / {requiredForNextLevel} XP</span>
            </div>
            <div className="w-full bg-black/20 rounded-theme-full h-2.5 p-0.5">
                <div 
                    className="bg-theme-accent-primary h-full rounded-theme-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
};

const StatCard: React.FC<{ value: string | number; label: string; icon: React.ReactNode; }> = ({ value, label, icon }) => (
    <div className="container-luminous p-4 rounded-theme-card text-center flex flex-col items-center justify-center gap-2 aspect-[4/3]">
        <div className="text-theme-accent-primary">{icon}</div>
        <div className="text-2xl font-black text-theme-primary drop-shadow-lg">{value}</div>
        <div className="text-xs text-theme-secondary/80 font-semibold">{label}</div>
    </div>
);

const WeeklyActivityChart: React.FC = () => {
    const [history] = useLocalStorage<Record<string, number>>('dhikrHistory', {});
    const [chartData, setChartData] = useState<{ day: string; count: number }[]>([]);
    
    useEffect(() => {
        const data = [];
        const days = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayKey = d.toISOString().split('T')[0];
            data.push({
                day: days[d.getDay()],
                count: history[dayKey] || 0,
            });
        }
        setChartData(data);
    }, [history]);
    
    const maxCount = Math.max(...chartData.map(d => d.count), 50);

    return (
        <div className="container-luminous rounded-theme-card p-4">
             <h3 className="font-bold text-xl text-theme-accent mb-4 text-center heading-amiri">النشاط الأسبوعي</h3>
             <div className="flex justify-around items-end h-32 gap-2">
                {chartData.map((data, index) => (
                    <div key={index} className="flex flex-col items-center flex-1 gap-2">
                        <div className="w-full h-full flex items-end">
                            <div 
                                className="w-full bg-theme-accent-primary rounded-t-md transition-all duration-500 hover:opacity-80"
                                style={{ height: `${(data.count / maxCount) * 100}%` }}
                                title={`${data.count} ذكر`}
                            />
                        </div>
                        <span className="text-xs text-theme-secondary/70">{data.day}</span>
                    </div>
                ))}
             </div>
        </div>
    )
};

const KhatmahProgressCard: React.FC<{ userData: QuranUserData }> = ({ userData }) => {
    if (!userData.khatmah?.active) return null;
    
    const { lastRead, targetDays, startDate } = userData.khatmah;
    const totalAyahsInQuran = 6236;
    const [surahList] = useLocalStorage<any[]>('surahListCache', []);
    
    let progress = 0;
    let dailyWird = 0;

    if (lastRead && startDate && surahList.length > 0) {
        const cumulativeAyahs = surahList.slice(0, lastRead.surah - 1).reduce((sum, s) => sum + s.numberOfAyahs, 0);
        const totalAyahsRead = cumulativeAyahs + lastRead.ayah;
        progress = (totalAyahsRead / totalAyahsInQuran) * 100;
        
        const daysPassed = Math.floor((new Date().getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
        const daysRemaining = Math.max(1, targetDays - daysPassed);
        const ayahsRemaining = totalAyahsInQuran - totalAyahsRead;
        if (ayahsRemaining > 0) {
            dailyWird = Math.ceil(ayahsRemaining / daysRemaining);
        }
    }
    
    return (
        <div className="container-luminous rounded-theme-card p-4 space-y-3">
             <h3 className="font-bold text-xl text-theme-accent text-center heading-amiri">تقدم الختمة</h3>
             <div className="w-full bg-black/20 rounded-theme-full h-2 p-0.5">
                <div className="bg-theme-accent-primary h-full rounded-theme-full" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-theme-secondary">الورد اليومي: <span className="text-theme-primary">{dailyWird} آية</span></span>
                <span className="font-bold text-theme-accent-primary">{progress.toFixed(1)}%</span>
            </div>
        </div>
    );
};

const Achievement: React.FC<{ id: AchievementId, unlocked: boolean }> = ({ id, unlocked }) => {
    const achievement = ACHIEVEMENTS_LIST.find(a => a.id === id);
    if (!achievement) return null;

    return (
        <div
            className={`p-3 rounded-theme-card flex flex-col items-center justify-center text-center gap-2 aspect-square transition-all duration-300 container-luminous ${unlocked ? 'bg-yellow-400/10 shadow-lg shadow-yellow-500/10' : 'opacity-60'}`}
            title={achievement.description}
        >
            <span className={`text-4xl transition-transform duration-300 ${unlocked ? 'grayscale-0' : 'grayscale'}`}>{achievement.icon}</span>
            <h4 className={`text-xs font-bold ${unlocked ? 'text-yellow-300' : 'text-theme-primary'}`}>{achievement.title}</h4>
        </div>
    );
};

// --- Profile Edit View ---
const ProfileEditView: React.FC<{
    profile: Profile;
    onSave: (newProfileData: Partial<Profile>) => void;
    onClose: () => void;
}> = ({ profile, onSave, onClose }) => {
    const [name, setName] = useState(profile.name);
    const [bio, setBio] = useState(profile.bio);
    const [title, setTitle] = useState(profile.title);
    const [dailyGoal, setDailyGoal] = useState(profile.dailyGoal);
    const [avatarColor, setAvatarColor] = useState(profile.avatarColor);
    const [favoriteDhikrId, setFavoriteDhikrId] = useState<number | null>(profile.favoriteDhikrId);
    const [dhikrList] = useLocalStorage<Dhikr[]>('dhikrList', []);
    const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => fileInputRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            alert("حجم الصورة كبير جداً. يرجى اختيار صورة أصغر من 2 ميجابايت.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setAvatarDataUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = () => {
        const dataToSave: Partial<Profile> = {
            name: name.trim() || 'المستخدم',
            bio,
            title,
            dailyGoal,
            avatarColor,
            favoriteDhikrId,
        };
        if (avatarDataUrl) {
            dataToSave.avatarImage = avatarDataUrl;
        }
        onSave(dataToSave);
    };

    return (
         <div className="w-full h-full flex flex-col animate-in fade-in-0">
             <header className="sticky top-0 z-20 bg-theme-primary/80 backdrop-blur-md flex items-center justify-between p-4">
                <button onClick={onClose} className="p-2 text-theme-secondary hover:text-theme-primary transition-colors w-14 flex justify-start">
                    <span className="text-lg">إلغاء</span>
                </button>
                <h1 className="font-bold text-xl text-theme-accent">تعديل الملف الشخصي</h1>
                <button onClick={handleSave} className="p-2 text-theme-accent-primary hover:opacity-80 transition-colors w-14 flex justify-end">
                     <span className="text-lg font-bold">حفظ</span>
                </button>
            </header>
            <main className="flex-grow overflow-y-auto p-4 space-y-6">
                {/* Avatar Preview */}
                <div className="flex flex-col items-center gap-4">
                     <div 
                        className="w-28 h-28 rounded-theme-full flex items-center justify-center text-6xl font-black ring-4 ring-white/10 shadow-lg leading-none container-luminous cursor-pointer overflow-hidden"
                        style={{ backgroundColor: avatarColor, color: 'rgba(0,0,0,0.5)' }}
                        onClick={handleAvatarClick}
                     >
                        {avatarDataUrl ? (
                            <img src={avatarDataUrl} className="w-full h-full object-cover" alt="الصورة الشخصية الجديدة" />
                        ) : profile.avatarImage ? (
                            <img src={profile.avatarImage} className="w-full h-full object-cover" alt="الصورة الشخصية" />
                        ) : (
                            name.charAt(0)
                        )}
                    </div>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    <div className="flex gap-2">
                        {AVATAR_COLORS.map(color => (
                            <button key={color} onClick={() => setAvatarColor(color)} className={`w-8 h-8 rounded-theme-full transition-all ${avatarColor === color ? 'ring-2 ring-offset-2 ring-offset-theme-primary ring-white' : ''}`} style={{ backgroundColor: color }} />
                        ))}
                    </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4 text-right">
                     <div>
                        <label className="text-sm font-semibold text-theme-secondary mb-1 block">الاسم</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 input-luminous text-theme-primary rounded-theme-card"/>
                    </div>
                     <div>
                        <label className="text-sm font-semibold text-theme-secondary mb-1 block">النبذة التعريفية</label>
                        <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full h-24 p-3 input-luminous text-theme-primary rounded-theme-card resize-none"></textarea>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-theme-secondary mb-1 block">اللقب</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="مثال: محب للخير" className="w-full p-3 input-luminous text-theme-primary rounded-theme-card"/>
                    </div>
                     <div>
                        <label className="text-sm font-semibold text-theme-secondary mb-1 block">الهدف اليومي للذكر</label>
                        <input type="number" value={dailyGoal} onChange={e => setDailyGoal(Number(e.target.value))} className="w-full p-3 input-luminous text-theme-primary rounded-theme-card"/>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-theme-secondary mb-1 block">الذكر المفضل</label>
                        <select value={favoriteDhikrId ?? ''} onChange={e => setFavoriteDhikrId(e.target.value ? Number(e.target.value) : null)} className="w-full p-3 input-luminous text-theme-primary rounded-theme-card appearance-none">
                            <option value="">لا يوجد</option>
                            {dhikrList.map(dhikr => (
                                <option key={dhikr.id} value={dhikr.id}>{dhikr.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </main>
        </div>
    );
};

// --- Main Component ---
interface ProfileTabProps {
    profile: Profile;
    setProfile: React.Dispatch<React.SetStateAction<Profile>>;
    settings: Settings;
    onClose: () => void;
    userData: QuranUserData;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ profile, setProfile, onClose, userData }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [dhikrList] = useLocalStorage<Dhikr[]>('dhikrList', []);
    const favoriteDhikr = dhikrList.find(d => d.id === profile.favoriteDhikrId);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 300); // Corresponds to animation duration
    };

    useEffect(() => {
        const checkAchievements = () => {
            const unlocked: AchievementId[] = [];
            
            if (profile.totalCount >= 100 && !profile.achievements.dhikr_100) unlocked.push('dhikr_100');
            if (profile.totalCount >= 1000 && !profile.achievements.dhikr_1000) unlocked.push('dhikr_1000');
            if (profile.totalCount >= 10000 && !profile.achievements.dhikr_10000) unlocked.push('dhikr_10000');
            
            if (profile.streak >= 3 && !profile.achievements.streak_3) unlocked.push('streak_3');
            if (profile.streak >= 7 && !profile.achievements.streak_7) unlocked.push('streak_7');
            if (profile.streak >= 30 && !profile.achievements.streak_30) unlocked.push('streak_30');

            if (userData.khatmah.active && !profile.achievements.khatmah_start) unlocked.push('khatmah_start');
            
            if (unlocked.length > 0) {
                 setProfile(p => {
                    const newAchievements = { ...p.achievements };
                    unlocked.forEach(id => { newAchievements[id] = true; });
                    return { ...p, achievements: newAchievements };
                });
            }
        };
        checkAchievements();
    }, [profile, setProfile, userData.khatmah.active]);

    const handleSaveProfile = (newProfileData: Partial<Profile>) => {
        setProfile(p => ({ ...p, ...newProfileData }));
        setIsEditing(false);
    };
    
    const achievementsUnlocked = Object.values(profile.achievements).filter(Boolean).length;
    
    return (
        <div className={`fixed inset-0 bg-theme-primary z-[100] overflow-y-auto ${isClosing ? 'animate-scale-out-tl' : 'animate-scale-in-tl'}`}>
            {isEditing ? (
                <ProfileEditView profile={profile} onSave={handleSaveProfile} onClose={() => setIsEditing(false)} />
            ) : (
                <div>
                    <header className="sticky top-0 z-20 bg-theme-primary/80 backdrop-blur-md flex items-center justify-between p-4">
                        <div className="w-14"></div>
                        <h1 className="font-bold text-2xl text-theme-accent heading-amiri">الملف الشخصي</h1>
                        <button onClick={handleClose} className="p-2 text-theme-secondary hover:text-theme-primary transition-colors w-14 flex justify-end">
                            <ChevronLeftIcon className="w-7 h-7 stroke-current" style={{transform: 'scaleX(-1)'}} />
                        </button>
                    </header>
                    
                    <main className="flex flex-col items-center gap-5 pb-8">
                        <div className="w-full h-32 bg-gradient-to-br from-theme-card to-transparent relative counter-bg-pattern">
                            <div className="absolute inset-0 bg-gradient-to-t from-theme-primary to-transparent"></div>
                        </div>
                        <div className="w-28 h-28 rounded-theme-full flex items-center justify-center text-6xl font-black ring-4 ring-theme-primary shadow-lg -mt-20 z-10 leading-none container-luminous overflow-hidden" style={{ backgroundColor: profile.avatarColor, color: 'rgba(0,0,0,0.5)' }}>
                            {profile.avatarImage ? (
                                <img src={profile.avatarImage} className="w-full h-full object-cover" alt="الصورة الشخصية" />
                            ) : (
                                profile.name.charAt(0)
                            )}
                        </div>
                        
                        <div className="text-center -mt-2">
                            <div className="flex items-center justify-center gap-2">
                                <h2 className="text-2xl font-bold">{profile.name}</h2>
                                <button onClick={() => setIsEditing(true)} className="p-1.5 text-theme-secondary/60 hover:text-theme-primary transition-colors">
                                    <EditIcon className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-sm text-theme-secondary/80 mt-1 max-w-xs px-4">{profile.title}</p>
                        </div>
                        
                        <LevelProgressBar totalDhikr={profile.totalCount} />
                        
                        <div className="grid grid-cols-3 gap-3 w-full px-4">
                            <StatCard value={profile.totalCount.toLocaleString()} label="مجموع الأذكار" icon={<CounterIcon className="w-6 h-6"/>} />
                            <StatCard value={profile.streak} label="أيام متتالية" icon={<span className="text-2xl">🔥</span>} />
                            <StatCard value={achievementsUnlocked} label="الإنجازات" icon={<StarIcon className="w-6 h-6"/>} />
                        </div>

                        {favoriteDhikr && (
                             <div className="w-full px-4">
                                <div className="container-luminous rounded-theme-card p-4 text-center">
                                    <p className="text-xs text-theme-secondary font-semibold mb-1">الذكر المفضل</p>
                                    <p className="font-bold text-lg">{favoriteDhikr.name}</p>
                                </div>
                             </div>
                        )}
                        
                        <div className="w-full px-4 space-y-4">
                            <WeeklyActivityChart />
                            <KhatmahProgressCard userData={userData} />
                            <div className="container-luminous rounded-theme-card p-4">
                                <h3 className="font-bold text-xl text-theme-accent mb-4 text-center heading-amiri">الإنجازات ({achievementsUnlocked}/{ACHIEVEMENTS_LIST.length})</h3>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                    {ACHIEVEMENTS_LIST.map(ach => (
                                        <Achievement key={ach.id} id={ach.id} unlocked={profile.achievements[ach.id]} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            )}
        </div>
    );
};

export default ProfileTab;