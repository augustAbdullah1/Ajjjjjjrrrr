import React, { useRef, useState } from 'react';
import type { Theme, Settings, PrayerMethod, Profile } from '../../types';
import { PRAYER_METHODS } from '../../constants';
import { requestPermission } from '../../services/notificationService';
import ToggleSwitch from '../ui/ToggleSwitch';
import { 
    ChevronLeftIcon, AppearanceIcon, InfoIcon, FontSizeIcon,
    WorshipIcon, QuranIcon, InstagramIcon, BellIcon, CounterIcon
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

const THEMES_PREVIEW: { id: Theme, name: string, gradient: string, colors: string[] }[] = [
    { id: 'dark', name: 'مظلم', gradient: 'from-[#1E1E1E] to-[#121212]', colors: ['#E0E0E0', '#9E9E9E', '#FFFFFF'] },
    { id: 'light', name: 'فاتح', gradient: 'from-[#FAFAFA] to-[#F5F5F5]', colors: ['#212121', '#757575', '#212121'] },
    { id: 'amoled', name: 'AMOLED', gradient: 'from-[#0A0A0A] to-[#000000]', colors: ['#D1D1D1', '#8A8A8A', '#FFFFFF'] },
];

const SettingHeader: React.FC<{ title: string; onClose: () => void }> = ({ title, onClose }) => (
    <header className="flex-shrink-0 w-full max-w-md mx-auto sticky top-0 bg-theme-primary/80 backdrop-blur-md z-10 flex items-center justify-between p-4">
        <div className="w-8"></div>
        <h1 className="font-black text-xl text-theme-accent">{title}</h1>
        <button onClick={onClose} className="p-2 text-theme-secondary hover:text-theme-primary transition-colors">
            <ChevronLeftIcon className="w-7 h-7 stroke-current" style={{transform: 'scaleX(-1)'}} />
        </button>
    </header>
);

const SettingSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="container-luminous rounded-theme-card">
        <div className="flex items-center gap-3 p-4">
            <div className="text-theme-accent">{icon}</div>
            <h3 className="font-bold text-lg text-theme-accent">{title}</h3>
        </div>
        <div className="px-2 pb-2 space-y-1">{children}</div>
    </div>
);

const SettingRow: React.FC<{ label: string; description?: string; children: React.ReactNode; }> = ({ label, description, children }) => (
    <div className="bg-white/5 p-3 rounded-lg flex justify-between items-center min-h-[56px] text-right">
        <div className="flex-shrink-0">{children}</div>
        <div className="flex-grow pr-4">
            <span className="font-semibold text-sm text-theme-primary">{label}</span>
            {description && <p className="text-xs text-theme-secondary/70">{description}</p>}
        </div>
    </div>
);

const SettingsTab: React.FC<SettingsTabProps> = ({ theme, setTheme, settings, setSettings, profile, setProfile, onClose }) => {
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 300); // Corresponds to animation duration
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
            <main className="flex-grow overflow-y-auto w-full max-w-md mx-auto p-2 space-y-3">
                
                <SettingSection title="المظهر" icon={<AppearanceIcon className="w-6 h-6"/>}>
                    <div className="bg-white/5 p-3 rounded-lg text-right">
                        <div className="grid grid-cols-3 gap-3">
                            {THEMES_PREVIEW.map(t => (
                                <button key={t.id} onClick={() => setTheme(t.id)}
                                    className={`p-3 rounded-theme-card border-2 transition-all ${theme === t.id ? 'border-theme-primary-accent' : 'border-transparent'}`}
                                >
                                    <div className={`w-full h-12 rounded-lg bg-gradient-to-br ${t.gradient} mb-2`}></div>
                                    <h4 className="font-semibold text-sm text-center text-theme-primary">{t.name}</h4>
                                    <div className="flex justify-center gap-1.5 mt-2">
                                        {t.colors.map(color => <div key={color} className="w-4 h-4 rounded-full" style={{ backgroundColor: color }}></div>)}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </SettingSection>

                <SettingSection title="إعدادات السبحة" icon={<CounterIcon className="w-6 h-6"/>}>
                    <SettingRow label="اهتزاز عند التسبيح" description="تفعيل الاهتزاز عند كل تسبيحة">
                        <ToggleSwitch 
                            checked={settings.vibration}
                            onChange={v => handleSettingChange('vibration', v)}
                        />
                    </SettingRow>
                    <SettingRow label="الضغط في أي مكان للتسبيح">
                        <ToggleSwitch checked={settings.tapAnywhere} onChange={v => handleSettingChange('tapAnywhere', v)} />
                    </SettingRow>
                </SettingSection>

                <SettingSection title="القرآن الكريم" icon={<QuranIcon className="w-6 h-6 stroke-current"/>}>
                     <SettingRow label="حجم الخط" description={`${((settings.quranReaderFontSize - 1.75) / 1.25 * 100).toFixed(0)}%`}>
                        <div className="flex items-center gap-2">
                           <FontSizeIcon className="w-4 h-4 text-theme-secondary"/>
                           <input type="range" min="1.75" max="3.0" step="0.125" value={settings.quranReaderFontSize}
                            onChange={e => handleSettingChange('quranReaderFontSize', parseFloat(e.target.value))}
                            className="w-24 accent-theme-accent-primary" />
                           <FontSizeIcon className="w-6 h-6 text-theme-secondary"/>
                        </div>
                    </SettingRow>
                    <SettingRow label="التمرير التلقائي مع الصوت">
                        <ToggleSwitch checked={settings.autoScrollAudio} onChange={v => handleSettingChange('autoScrollAudio', v)} />
                    </SettingRow>
                </SettingSection>

                <SettingSection title="إعدادات العبادة" icon={<WorshipIcon className="w-6 h-6" />}>
                     <SettingRow label="طريقة حساب المواقيت">
                         <select value={settings.prayerMethod} onChange={(e) => handleSettingChange('prayerMethod', parseInt(e.target.value) as PrayerMethod)}
                             className="p-1 input-luminous text-theme-primary rounded text-xs text-right outline-none max-w-[120px]">
                             {PRAYER_METHODS.map(method => (
                                 <option key={method.id} value={method.id}>{method.name}</option>
                             ))}
                         </select>
                     </SettingRow>
                      <SettingRow label="الهدف اليومي للذكر">
                        <input type="number" value={profile.dailyGoal} min="1"
                           onChange={(e) => setProfile(p => ({ ...p, dailyGoal: parseInt(e.target.value) || 100 }))}
                           className="w-20 p-1 input-luminous text-theme-primary rounded text-center font-bold" />
                      </SettingRow>
                    <SettingRow label="تنسيق الوقت">
                        <div className="flex items-center text-xs font-bold p-1 bg-black/20 rounded-theme-full">
                            <button onClick={() => handleSettingChange('timeFormat', '12h')} className={`px-3 py-1 rounded-theme-full ${settings.timeFormat === '12h' ? 'bg-theme-accent-primary text-theme-accent-primary-text' : 'text-theme-secondary'}`}>12 ساعة</button>
                            <button onClick={() => handleSettingChange('timeFormat', '24h')} className={`px-3 py-1 rounded-theme-full ${settings.timeFormat === '24h' ? 'bg-theme-accent-primary text-theme-accent-primary-text' : 'text-theme-secondary'}`}>24 ساعة</button>
                        </div>
                    </SettingRow>
                    <div className="bg-white/5 p-3 rounded-lg flex flex-col gap-3 text-right">
                        <div className="flex justify-between items-center">
                            <ToggleSwitch checked={settings.prayerNotifications.enabled} onChange={handlePrayerNotificationToggle} />
                            <div className="flex items-center gap-2 pr-1">
                                <BellIcon className="w-5 h-5" />
                                <span className="font-semibold text-sm text-theme-primary">تنبيهات الصلاة</span>
                            </div>
                        </div>
                        {settings.prayerNotifications.enabled && (
                            <div className="border-t border-white/10 pt-3 space-y-2 pr-2 animate-in fade-in-0">
                                <div className="flex justify-between items-center">
                                    <ToggleSwitch checked={settings.prayerNotifications.fajr} onChange={v => handlePrayerNotificationChange('fajr', v)} />
                                    <span>الفجر</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <ToggleSwitch checked={settings.prayerNotifications.dhuhr} onChange={v => handlePrayerNotificationChange('dhuhr', v)} />
                                    <span>الظهر</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <ToggleSwitch checked={settings.prayerNotifications.asr} onChange={v => handlePrayerNotificationChange('asr', v)} />
                                    <span>العصر</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <ToggleSwitch checked={settings.prayerNotifications.maghrib} onChange={v => handlePrayerNotificationChange('maghrib', v)} />
                                    <span>المغرب</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <ToggleSwitch checked={settings.prayerNotifications.isha} onChange={v => handlePrayerNotificationChange('isha', v)} />
                                    <span>العشاء</span>
                                </div>
                            </div>
                        )}
                    </div>
                </SettingSection>

                <SettingSection title="عن التطبيق" icon={<InfoIcon className="w-6 h-6"/>}>
                    <div className="bg-white/5 p-4 rounded-lg text-right text-sm space-y-2">
                        <div className="flex justify-between"><span>إصدار التطبيق</span><span className="font-bold">3.00</span></div>
                        <div className="flex justify-between"><span>المطور</span><span className="font-bold">عبدالله أبوشكير</span></div>
                        <p className="text-xs text-theme-secondary/70 pt-2">هذا التطبيق صدقة جارية لصاحبه ووالديه واخوانه ومن يحب.</p>
                    </div>
                </SettingSection>
            </main>
            
            <footer className="w-full max-w-md mx-auto text-center p-4 flex-shrink-0">
                <a 
                    href="https://www.instagram.com/7ir7u/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 button-luminous py-2 px-4 rounded-theme-full"
                >
                    <InstagramIcon className="w-5 h-5"/>
                    <span className="font-semibold text-sm">حساب المطور</span>
                </a>
            </footer>
        </div>
    );
};

export default SettingsTab;