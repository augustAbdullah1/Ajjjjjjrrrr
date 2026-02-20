
import React, { useState } from 'react';
import type { Theme, Settings, PrayerMethod, Profile } from '../../types';
import { PRAYER_METHODS } from '../../constants';
import { requestPermission } from '../../services/notificationService';
import ToggleSwitch from '../ui/ToggleSwitch';
import { 
    ChevronLeftIcon, AppearanceIcon, InfoIcon, FontSizeIcon,
    WorshipIcon, QuranIcon, InstagramIcon, BellIcon, CounterIcon,
    CheckCircleIcon
} from '../icons/TabIcons';

interface SettingsTabProps {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
    profile: Profile;
    setProfile: React.Dispatch<React.SetStateAction<Profile>>;
    onClose: () => void;
}

const THEMES_PREVIEW: { id: Theme, name: string, gradient: string, ringColor: string }[] = [
    { id: 'dark', name: 'ليلي', gradient: 'bg-[#1E1E1E]', ringColor: 'ring-gray-500' },
    { id: 'light', name: 'نهاري', gradient: 'bg-[#F5F5F5]', ringColor: 'ring-yellow-500' },
    { id: 'amoled', name: 'داكن', gradient: 'bg-[#000000]', ringColor: 'ring-white' },
];

const SettingHeader: React.FC<{ title: string; onClose: () => void }> = ({ title, onClose }) => (
    <header className="flex-shrink-0 w-full max-w-md mx-auto sticky top-0 bg-theme-primary/95 backdrop-blur-md z-20 flex items-center justify-between p-4 border-b border-white/5">
        <div className="w-10"></div>
        <h1 className="font-bold text-xl text-theme-accent heading-amiri tracking-wide">{title}</h1>
        <button onClick={onClose} className="p-2 w-10 h-10 flex items-center justify-center rounded-full bg-theme-card/50 text-theme-secondary hover:text-theme-primary hover:bg-theme-card transition-all">
            <ChevronLeftIcon className="w-6 h-6 stroke-current" style={{transform: 'scaleX(-1)'}} />
        </button>
    </header>
);

const SectionTitle: React.FC<{ title: string; icon?: React.ReactNode }> = ({ title, icon }) => (
    <div className="flex items-center gap-2 px-2 mb-3 mt-2">
        {icon && <span className="text-theme-accent-primary">{icon}</span>}
        <h3 className="font-bold text-base text-theme-secondary">{title}</h3>
    </div>
);

const SettingCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
    <div className={`container-luminous rounded-[1.5rem] p-1 overflow-hidden ${className}`}>
        {children}
    </div>
);

const SettingItem: React.FC<{ 
    label: string; 
    description?: string; 
    icon?: React.ReactNode;
    action: React.ReactNode; 
    isLast?: boolean;
}> = ({ label, description, icon, action, isLast = false }) => (
    <div className={`flex items-center justify-between p-4 ${!isLast ? 'border-b border-white/5' : ''}`}>
        <div className="flex items-center gap-3 overflow-hidden">
            {icon && <div className="text-theme-secondary/80">{icon}</div>}
            <div className="flex flex-col text-right">
                <span className="font-semibold text-theme-primary text-sm">{label}</span>
                {description && <span className="text-xs text-theme-secondary/70 truncate max-w-[200px]">{description}</span>}
            </div>
        </div>
        <div className="flex-shrink-0 mr-3">
            {action}
        </div>
    </div>
);

const SettingsTab: React.FC<SettingsTabProps> = ({ theme, setTheme, settings, setSettings, profile, setProfile, onClose }) => {
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 300);
    };

    const handleSettingChange = <K extends keyof Settings>(key: K, value: Settings[K]) => {
        setSettings(s => ({ ...s, [key]: value }));
    };

    const handlePrayerNotificationToggle = async (enabled: boolean) => {
        if (enabled) {
            const hasPermission = await requestPermission();
            if (hasPermission) {
                handleSettingChange('prayerNotifications', { ...settings.prayerNotifications, enabled: true });
            } else {
                alert('يرجى منح إذن الإشعارات من إعدادات المتصفح لتفعيل هذه الميزة.');
            }
        } else {
            handleSettingChange('prayerNotifications', { ...settings.prayerNotifications, enabled: false });
        }
    };

    const handlePrayerNotificationChange = (prayer: keyof Omit<Settings['prayerNotifications'], 'enabled'>, value: boolean) => {
        handleSettingChange('prayerNotifications', {
            ...settings.prayerNotifications,
            [prayer]: value,
        });
    };

    return (
        <div className={`fixed inset-0 bg-theme-primary z-[100] flex flex-col ${isClosing ? 'animate-scale-out-tr' : 'animate-scale-in-tr'}`}>
            <SettingHeader title="الإعدادات" onClose={handleClose} />
            
            <main className="flex-grow overflow-y-auto w-full max-w-md mx-auto p-4 space-y-6 pb-48 custom-scrollbar">
                
                {/* Theme Section */}
                <section>
                    <SectionTitle title="المظهر" icon={<AppearanceIcon className="w-5 h-5"/>} />
                    <div className="grid grid-cols-3 gap-3">
                        {THEMES_PREVIEW.map(t => {
                            const isActive = theme === t.id;
                            return (
                                <button 
                                    key={t.id} 
                                    onClick={() => setTheme(t.id)}
                                    className={`
                                        relative h-24 rounded-[1.5rem] border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 overflow-hidden group
                                        ${isActive ? `border-theme-accent-primary shadow-lg shadow-theme-accent-primary/10` : 'border-transparent bg-theme-card opacity-70 hover:opacity-100'}
                                    `}
                                >
                                    <div className={`absolute inset-0 ${t.gradient} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                                    <div className={`w-8 h-8 rounded-full ${t.gradient} shadow-inner border border-white/10 flex items-center justify-center`}>
                                        {isActive && <CheckCircleIcon className="w-5 h-5 text-theme-primary" />}
                                    </div>
                                    <span className={`text-sm font-bold ${isActive ? 'text-theme-accent-primary' : 'text-theme-secondary'}`}>
                                        {t.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Quran Settings */}
                <section>
                    <SectionTitle title="القرآن الكريم" icon={<QuranIcon className="w-5 h-5"/>} />
                    <SettingCard>
                         <div className="p-4">
                             <div className="flex justify-between items-center mb-2">
                                 <span className="font-semibold text-theme-primary text-sm flex items-center gap-2">
                                     <FontSizeIcon className="w-4 h-4"/>
                                     حجم الخط
                                 </span>
                                 <span className="text-xs text-theme-secondary font-mono">{settings.quranReaderFontSize}x</span>
                             </div>
                             <input 
                                type="range" 
                                min="1.5" 
                                max="4" 
                                step="0.1" 
                                value={settings.quranReaderFontSize}
                                onChange={(e) => handleSettingChange('quranReaderFontSize', parseFloat(e.target.value))}
                                className="w-full h-2 bg-theme-card rounded-lg appearance-none cursor-pointer accent-theme-accent-primary"
                             />
                             <p className="text-center mt-3 font-amiri text-theme-primary/80" style={{ fontSize: `${Math.min(settings.quranReaderFontSize, 2.5)}rem` }}>
                                 بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                             </p>
                         </div>
                    </SettingCard>
                </section>

                {/* Prayer Notifications */}
                <section>
                    <SectionTitle title="التنبيهات" icon={<BellIcon className="w-5 h-5"/>} />
                    <SettingCard>
                        <SettingItem 
                            label="تنبيهات الصلاة" 
                            description="تفعيل الإشعارات عند دخول وقت الصلاة"
                            action={
                                <ToggleSwitch 
                                    checked={settings.prayerNotifications.enabled} 
                                    onChange={handlePrayerNotificationToggle}
                                />
                            }
                        />
                        {settings.prayerNotifications.enabled && (
                            <div className="grid grid-cols-5 gap-2 p-4 pt-0 border-t border-white/5 bg-black/10">
                                {[
                                    { k: 'fajr', l: 'الفجر' }, { k: 'dhuhr', l: 'الظهر' }, { k: 'asr', l: 'العصر' }, 
                                    { k: 'maghrib', l: 'المغرب' }, { k: 'isha', l: 'العشاء' }
                                ].map((p) => (
                                    <button 
                                        key={p.k}
                                        onClick={() => handlePrayerNotificationChange(p.k as any, !settings.prayerNotifications[p.k as keyof typeof settings.prayerNotifications])}
                                        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${settings.prayerNotifications[p.k as keyof typeof settings.prayerNotifications] ? 'bg-theme-accent-primary text-theme-accent-primary-text' : 'text-theme-secondary hover:bg-white/5'}`}
                                    >
                                        <span className="text-[10px] font-bold">{p.l}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </SettingCard>
                </section>

                {/* General Settings */}
                <section>
                    <SectionTitle title="عام" icon={<InfoIcon className="w-5 h-5"/>} />
                    <SettingCard>
                         <SettingItem 
                            label="طريقة الحساب"
                            description="طريقة حساب مواقيت الصلاة"
                            icon={<WorshipIcon className="w-4 h-4"/>}
                            action={
                                <select 
                                    value={settings.prayerMethod} 
                                    onChange={(e) => handleSettingChange('prayerMethod', parseInt(e.target.value) as PrayerMethod)}
                                    className="bg-theme-tab-bar text-theme-primary text-xs p-2 rounded-lg border border-white/10 outline-none focus:border-theme-accent-primary max-w-[120px]"
                                >
                                    {PRAYER_METHODS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                </select>
                            }
                        />
                         <SettingItem 
                            label="الاهتزاز"
                            description="عند التسبيح أو النقر"
                            icon={<CounterIcon className="w-4 h-4"/>}
                            action={
                                <ToggleSwitch 
                                    checked={settings.vibration} 
                                    onChange={(c) => handleSettingChange('vibration', c)} 
                                />
                            }
                        />
                        <SettingItem 
                            label="النقر في أي مكان"
                            description="للتسبيح في صفحة السبحة"
                            action={
                                <ToggleSwitch 
                                    checked={settings.tapAnywhere} 
                                    onChange={(c) => handleSettingChange('tapAnywhere', c)} 
                                />
                            }
                        />
                    </SettingCard>
                </section>

                {/* About */}
                <section className="text-center pt-8 pb-12 px-6">
                    
                    {/* Charity Dedication */}
                    <div className="mb-6 p-4 rounded-[1.5rem] bg-theme-card/30 border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-10 h-10 bg-theme-accent-primary/5 rounded-bl-full"></div>
                        <p className="text-sm text-theme-secondary leading-relaxed font-amiri opacity-90 relative z-10">
                            "التطبيق صدقة لصاحبه واهله واخوانه واخواته ومن يحب"
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                        <p className="text-[10px] text-theme-secondary/50 uppercase tracking-widest">تواصل مع المطور</p>
                        <a 
                            href="https://www.instagram.com/7ir7u/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-theme-card border border-white/10 text-theme-secondary hover:text-[#E1306C] hover:border-[#E1306C]/30 hover:bg-[#E1306C]/5 transition-all duration-300 group active:scale-95"
                        >
                            <InstagramIcon className="w-5 h-5 group-hover:scale-110 transition-transform"/>
                            <span className="text-xs font-bold dir-ltr font-mono">@7ir7u</span>
                        </a>
                    </div>

                    <p className="text-[10px] text-theme-secondary/30 font-mono mt-8">الإصدار 1.0.0</p>
                </section>

            </main>
        </div>
    );
};

export default SettingsTab;
