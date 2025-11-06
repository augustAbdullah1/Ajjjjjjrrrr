import React, { useRef } from 'react';
import type { Theme, Settings, PrayerMethod, NotificationSettings, Profile } from '../../types';
import { PRAYER_METHODS, REMINDER_INTERVALS } from '../../constants';
import ToggleSwitch from '../ui/ToggleSwitch';
import { requestPermission } from '../../services/notificationService';
import { 
    ChevronLeftIcon, AppearanceIcon, BellIcon, DataIcon, InfoIcon, FontSizeIcon,
    BackupIcon, RestoreIcon, ResetIcon, ShareIcon, StarIcon, FeedbackIcon, WorshipIcon, QuranIcon
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
    { id: 'midnight', name: 'منتصف الليل', gradient: 'from-[#0D1A2E] to-[#151E29]', colors: ['#F0F4F8', '#A0AEC0', '#38BDF8'] },
    { id: 'serenity', name: 'سكينة', gradient: 'from-[#1A2A27] to-[#1F2D2B]', colors: ['#D8E2DC', '#8A9B97', '#6A998B'] },
    { id: 'dusk', name: 'شفق', gradient: 'from-[#2C2A4A] to-[#4F3A65]', colors: ['#E2DDF0', '#9D8DB0', '#F5C3AF'] },
    { id: 'daylight', name: 'ضياء النهار', gradient: 'from-[#F9FAFB] to-[#F3F4F6]', colors: ['#1F2937', '#6B7280', '#3B82F6'] },
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
    const restoreInputRef = useRef<HTMLInputElement>(null);

    const handleSettingChange = <K extends keyof Settings>(key: K, value: Settings[K]) => {
        setSettings(s => ({ ...s, [key]: value }));
    };

    const handleNotificationToggleChange = async (key: 'prayers' | 'reminders' | 'persistentPrayerTimes', value: boolean) => {
        const originalNotifications = settings.notifications;
        setSettings(s => ({ ...s, notifications: { ...s.notifications, [key]: value } }));
        if (value && Notification.permission !== 'granted') {
            const granted = await requestPermission();
            if (!granted) {
                alert('لا يمكن تفعيل الإشعارات بدون إذن منك.');
                setSettings(s => ({ ...s, notifications: originalNotifications }));
            }
        }
    };
    
    const handleNotificationValueChange = (key: keyof Omit<NotificationSettings, 'prayers' | 'reminders' | 'persistentPrayerTimes'>, value: any) => {
        setSettings(s => ({ ...s, notifications: { ...s.notifications, [key]: value } }));
    };

    const handleBackup = () => {
        try {
            const dataToBackup: Record<string, any> = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key) {
                    dataToBackup[key] = localStorage.getItem(key);
                }
            }
            const jsonString = JSON.stringify(dataToBackup, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ajr_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            alert('تم إنشاء ملف النسخة الاحتياطية بنجاح.');
        } catch (error) {
            alert('فشل إنشاء النسخة الاحتياطية.');
            console.error(error);
        }
    };

    const handleRestoreClick = () => {
        restoreInputRef.current?.click();
    };

    const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!window.confirm('سيتم استبدال جميع بياناتك الحالية بالبيانات الموجودة في ملف النسخ الاحتياطي. هل أنت متأكد؟')) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const result = e.target?.result as string;
                const data = JSON.parse(result);
                Object.keys(data).forEach(key => {
                    localStorage.setItem(key, data[key]);
                });
                alert('تم استعادة البيانات بنجاح. سيتم إعادة تحميل التطبيق الآن.');
                window.location.reload();
            } catch (error) {
                alert('ملف النسخ الاحتياطي غير صالح.');
                console.error(error);
            }
        };
        reader.readAsText(file);
    };
    
    const handleReset = () => {
        if (window.confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات؟ لن يتم حذف بياناتك الشخصية (مثل عدد الأذكار).')) {
            localStorage.removeItem('settings');
            localStorage.removeItem('appTheme');
            alert('تمت إعادة تعيين الإعدادات. سيتم إعادة تحميل التطبيق.');
            window.location.reload();
        }
    };
    
    const handleShare = () => {
        if(navigator.share) {
            navigator.share({
                title: 'تطبيق آجر',
                text: 'اكتشف تطبيق آجر للذكر والدعاء والقرآن الكريم. حمله الآن!',
                url: window.location.href
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-theme-primary z-[100] flex flex-col items-center animate-in fade-in-0 slide-in-from-bottom-5">
            <SettingHeader title="الإعدادات" onClose={onClose} />
            <main className="flex-grow overflow-y-auto w-full max-w-md p-2 space-y-3">
                
                <SettingSection title="المظهر" icon={<AppearanceIcon className="w-6 h-6"/>}>
                    <div className="bg-white/5 p-3 rounded-lg text-right">
                        <div className="grid grid-cols-2 gap-3">
                            {THEMES_PREVIEW.map(t => (
                                <button key={t.id} onClick={() => setTheme(t.id)}
                                    className={`p-3 rounded-theme-card border-2 transition-all ${theme === t.id ? 'border-theme-accent-primary' : 'border-transparent'}`}
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
                       <SettingRow label="الضغط في أي مكان للتسبيح">
                        <ToggleSwitch checked={settings.tapAnywhere} onChange={v => handleSettingChange('tapAnywhere', v)} />
                    </SettingRow>
                    <SettingRow label="تنسيق الوقت">
                        <div className="flex items-center text-xs font-bold p-1 bg-black/20 rounded-theme-full">
                            <button onClick={() => handleSettingChange('timeFormat', '12h')} className={`px-3 py-1 rounded-theme-full ${settings.timeFormat === '12h' ? 'bg-theme-accent-primary text-theme-accent-primary-text' : 'text-theme-secondary'}`}>12 ساعة</button>
                            <button onClick={() => handleSettingChange('timeFormat', '24h')} className={`px-3 py-1 rounded-theme-full ${settings.timeFormat === '24h' ? 'bg-theme-accent-primary text-theme-accent-primary-text' : 'text-theme-secondary'}`}>24 ساعة</button>
                        </div>
                    </SettingRow>
                </SettingSection>

                <SettingSection title="الإشعارات" icon={<BellIcon className="w-6 h-6"/>}>
                    <SettingRow label="تنبيهات الصلاة"><ToggleSwitch checked={settings.notifications.prayers} onChange={v => handleNotificationToggleChange('prayers', v)} /></SettingRow>
                    <SettingRow label="إشعار المواقيت الدائم"><ToggleSwitch checked={settings.notifications.persistentPrayerTimes} onChange={v => handleNotificationToggleChange('persistentPrayerTimes', v)} /></SettingRow>
                    <SettingRow label="تذكيرات الأذكار"><ToggleSwitch checked={settings.notifications.reminders} onChange={v => handleNotificationToggleChange('reminders', v)} /></SettingRow>
                    {settings.notifications.reminders && (
                         <SettingRow label="الفاصل الزمني للتذكير">
                           <select value={settings.notifications.reminderInterval} onChange={(e) => handleNotificationValueChange('reminderInterval', parseInt(e.target.value))}
                                className="p-1 input-luminous text-theme-primary rounded text-xs text-right outline-none">
                                {REMINDER_INTERVALS.map(interval => (<option key={interval.value} value={interval.value}>{interval.label}</option>))}
                           </select>
                         </SettingRow>
                    )}
                </SettingSection>

                 <SettingSection title="البيانات" icon={<DataIcon className="w-6 h-6"/>}>
                    <SettingRow label="نسخ احتياطي للبيانات" description="احفظ جميع بياناتك في ملف.">
                        <button onClick={handleBackup} className="p-2 button-luminous rounded-md"><BackupIcon className="w-5 h-5"/></button>
                    </SettingRow>
                    <SettingRow label="استعادة البيانات" description="استورد بياناتك من ملف.">
                        <button onClick={handleRestoreClick} className="p-2 button-luminous rounded-md"><RestoreIcon className="w-5 h-5"/></button>
                        <input type="file" accept=".json" ref={restoreInputRef} onChange={handleRestore} className="hidden" />
                    </SettingRow>
                     <SettingRow label="إعادة تعيين الإعدادات" description="العودة إلى الإعدادات الافتراضية.">
                        <button onClick={handleReset} className="p-2 button-luminous bg-red-500/20 text-red-400 rounded-md"><ResetIcon className="w-5 h-5"/></button>
                    </SettingRow>
                 </SettingSection>
                 
                 <SettingSection title="عن التطبيق" icon={<InfoIcon className="w-6 h-6"/>}>
                    <SettingRow label="الإصدار">
                         <span className="font-semibold text-sm text-theme-secondary">2.0.1</span>
                    </SettingRow>
                     <SettingRow label="شارك التطبيق">
                        <button onClick={handleShare} className="p-2 button-luminous rounded-md"><ShareIcon className="w-5 h-5"/></button>
                    </SettingRow>
                     <SettingRow label="أرسل ملاحظاتك">
                        <a href="mailto:feedback@example.com" className="p-2 button-luminous rounded-md inline-block"><FeedbackIcon className="w-5 h-5"/></a>
                    </SettingRow>
                 </SettingSection>

                 <div className="text-center text-xs text-theme-secondary/70 p-4 space-y-2">
                    <p>هذا التطبيق صدقة جارية له ولوالديه واخوانه واخواته ومن يحب.</p>
                    <p className="font-semibold">
                        &copy; {new Date().getFullYear()} عبدالله أبوشكير. جميع الحقوق محفوظة.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default SettingsTab;