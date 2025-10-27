
import React from 'react';
import type { Theme, Settings, Profile, PrayerMethod, NotificationSettings } from '../../types';
import { PRAYER_METHODS, REMINDER_INTERVALS } from '../../constants';
import useLocalStorage from '../../hooks/useLocalStorage';
import ToggleSwitch from '../ui/ToggleSwitch';
import { requestPermission } from '../../services/notificationService';

interface SettingsTabProps {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    isDarkMode: boolean;
    setIsDarkMode: (isDark: boolean) => void;
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

const THEMES: { id: Theme, className: string }[] = [
    { id: 'default', className: 'from-[#1a365d] to-[#2d3748]' },
    { id: 'purple', className: 'from-[#553c9a] to-[#6b46c1]' },
    { id: 'blue', className: 'from-[#2c5282] to-[#4299e1]' },
    { id: 'green', className: 'from-[#276749] to-[#48bb78]' },
    { id: 'rose', className: 'from-[#97266d] to-[#ed64a6]' },
    { id: 'ocean', className: 'from-[#234e52] to-[#38b2ac]' },
];

const SettingItem: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => (
    <div className="bg-white/5 p-3 rounded-lg flex justify-between items-center min-h-[56px]">
        <span className="font-semibold">{label}</span>
        {children}
    </div>
);

const SettingsTab: React.FC<SettingsTabProps> = ({ theme, setTheme, isDarkMode, setIsDarkMode, settings, setSettings }) => {
    const [profile, setProfile] = useLocalStorage<Profile>('profile', {} as Profile);

    const handleSettingChange = <K extends keyof Settings,>(key: K, value: Settings[K]) => {
        setSettings(s => ({ ...s, [key]: value }));
    };

    const handleNotificationSettingChange = async <K extends keyof NotificationSettings>(key: K, value: NotificationSettings[K]) => {
        // Request permission if user is enabling a notification feature for the first time
        if (value === true && Notification.permission !== 'granted') {
            const granted = await requestPermission();
            if (!granted) {
                alert('لا يمكن تفعيل الإشعارات بدون إذن منك.');
                return; // Don't update settings if permission is denied
            }
        }
        setSettings(s => ({
            ...s,
            notifications: {
                ...s.notifications,
                [key]: value
            }
        }));
    };

    const handleDailyGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const goal = parseInt(e.target.value) || 100;
        setProfile(p => ({ ...p, dailyGoal: goal }));
    }

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-center">الإعدادات</h2>
            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                <SettingItem label="الوضع الليلي">
                    <ToggleSwitch checked={isDarkMode} onChange={setIsDarkMode} />
                </SettingItem>
                <SettingItem label="الاهتزاز عند العد">
                    <ToggleSwitch checked={settings.vibration} onChange={v => handleSettingChange('vibration', v)} />
                </SettingItem>
                 
                 <div className="bg-white/5 p-3 rounded-lg flex flex-col gap-2">
                    <h3 className="font-bold text-lg text-theme-accent mb-2 text-right">الإشعارات</h3>
                    <div className="border-t border-white/10 pt-2 space-y-2">
                         <SettingItem label="تنبيهات الصلاة">
                             <ToggleSwitch checked={settings.notifications.prayers} onChange={v => handleNotificationSettingChange('prayers', v)} />
                        </SettingItem>
                         <SettingItem label="تذكيرات الأذكار">
                             <ToggleSwitch checked={settings.notifications.reminders} onChange={v => handleNotificationSettingChange('reminders', v)} />
                        </SettingItem>
                        {settings.notifications.prayers && (
                             <div className="bg-black/20 p-3 rounded-lg">
                                <label className="font-semibold block mb-2 text-right">صوت تنبيه الأذان</label>
                                <select
                                    value={settings.notifications.sound}
                                    onChange={(e) => handleNotificationSettingChange('sound', e.target.value as NotificationSettings['sound'])}
                                    className="w-full p-2 bg-black/20 text-white rounded-lg text-right"
                                >
                                    <option value="adhan">صوت الأذان</option>
                                    <option value="default">صوت الإشعار الافتراضي</option>
                                    <option value="vibrate">اهتزاز فقط</option>
                                    <option value="silent">صامت</option>
                                </select>
                            </div>
                        )}
                         {settings.notifications.reminders && (
                             <div className="bg-black/20 p-3 rounded-lg">
                                <label className="font-semibold block mb-2 text-right">الفاصل الزمني للتذكير</label>
                                <select
                                    value={settings.notifications.reminderInterval}
                                    onChange={(e) => handleNotificationSettingChange('reminderInterval', parseInt(e.target.value))}
                                    className="w-full p-2 bg-black/20 text-white rounded-lg text-right"
                                >
                                    {REMINDER_INTERVALS.map(interval => (
                                        <option key={interval.value} value={interval.value}>{interval.label}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                 </div>

                 <div className="bg-white/5 p-3 rounded-lg flex flex-col gap-2">
                    <h3 className="font-bold text-lg text-theme-accent mb-2 text-right">تخصيص الواجهة</h3>
                    <div className="border-t border-white/10 pt-2 space-y-2">
                        <SettingItem label="زر تحديد الهدف">
                             <ToggleSwitch checked={settings.showSetGoal} onChange={v => handleSettingChange('showSetGoal', v)} />
                        </SettingItem>
                         <SettingItem label="زر إضافة ذكر">
                             <ToggleSwitch checked={settings.showAddDhikr} onChange={v => handleSettingChange('showAddDhikr', v)} />
                        </SettingItem>
                    </div>
                 </div>

                <div className="bg-white/5 p-3 rounded-lg">
                    <label className="font-semibold block mb-2 text-right">تحديد الهدف اليومي</label>
                    <input 
                        type="number"
                        value={profile.dailyGoal || 100}
                        onChange={handleDailyGoalChange}
                        className="w-full p-2 bg-black/20 text-white rounded-lg text-center"
                    />
                </div>

                <div className="bg-white/5 p-3 rounded-lg">
                    <label className="font-semibold block mb-2 text-right">طريقة حساب المواقيت</label>
                    <select
                        value={settings.prayerMethod}
                        onChange={(e) => handleSettingChange('prayerMethod', parseInt(e.target.value) as PrayerMethod)}
                        className="w-full p-2 bg-black/20 text-white rounded-lg text-right"
                    >
                        {PRAYER_METHODS.map(method => (
                            <option key={method.id} value={method.id}>{method.name}</option>
                        ))}
                    </select>
                </div>

                <div className="bg-white/5 p-3 rounded-lg">
                    <h3 className="font-semibold mb-3 text-right">اختيار الثيم</h3>
                    <div className="flex justify-center gap-3 flex-wrap">
                        {THEMES.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setTheme(t.id)}
                                className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.className} ring-2 transition-all ${theme === t.id ? 'ring-theme-accent scale-110' : 'ring-transparent'}`}
                            ></button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsTab;
