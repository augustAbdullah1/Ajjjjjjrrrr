import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getPrayerTimes } from '../../services/prayerTimeService';
import type { PrayerTimesData, Settings, Profile } from '../../types';
import useLocalStorage from '../../hooks/useLocalStorage';
import Spinner from '../ui/Spinner';
import { DAILY_HADITH_DATA } from '../../constants';
import { CounterIcon } from '../icons/TabIcons';


// --- HELPER FUNCTIONS ---

const parseTimeToDate = (time: string, baseDate: Date = new Date()): Date => {
    const [h, m] = time.split(':').map(Number);
    const date = new Date(baseDate);
    date.setHours(h, m, 0, 0);
    return date;
};

const formatCountdown = (ms: number): string => {
    if (ms < 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
};

const formatTime = (time: string, format: '12h' | '24h'): string => {
    if (!time || !time.includes(':')) return '--:--';
    const [h, m] = time.split(':').map(Number);
    if (format === '24h') {
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }
    const ampm = h >= 12 ? 'م' : 'ص';
    const hour12 = h % 12 || 12;
    return `${hour12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
};


// --- INTERNAL COMPONENTS ---

const Greeting: React.FC<{ name: string; prayerData: PrayerTimesData | null }> = ({ name, prayerData }) => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'صباح الخير';
        if (hour < 18) return 'مساء الخير';
        return 'ليلة سعيدة';
    };
    return (
        <div className="text-center stagger-item">
            <h2 className="text-2xl font-bold">{getGreeting()}، {name}</h2>
            {prayerData && (
                <p className="text-sm text-theme-secondary">
                    {prayerData.date.hijri.weekday.ar}, {prayerData.date.hijri.day} {prayerData.date.hijri.month.ar} {prayerData.date.hijri.year} هـ
                </p>
            )}
        </div>
    );
};

const NextPrayerCard: React.FC<{ nextPrayer: { name: string; time: string } | null; countdown: string; timeFormat: '12h' | '24h' }> = ({ nextPrayer, countdown, timeFormat }) => {
    if (!nextPrayer) return null;
    return (
        <div className="container-luminous rounded-theme-container p-6 flex flex-col items-center justify-center text-center stagger-item" style={{ animationDelay: '100ms' }}>
            <p className="text-lg font-semibold text-theme-secondary">الصلاة القادمة</p>
            <h3 className="text-4xl font-bold text-theme-accent my-1">{nextPrayer.name}</h3>
            <p className="text-xl font-semibold text-theme-secondary mb-3">({formatTime(nextPrayer.time, timeFormat)})</p>
            <p className="text-6xl font-black text-theme-accent tracking-tighter" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>{countdown}</p>
        </div>
    );
};

const PrayerTimesCard: React.FC<{
    prayerData: PrayerTimesData;
    nextPrayerName: string | null;
    timeFormat: '12h' | '24h';
    onFormatChange: (format: '12h' | '24h') => void;
}> = ({ prayerData, nextPrayerName, timeFormat, onFormatChange }) => {
    const prayerSchedule = [
        { name: 'الفجر', time: prayerData.timings.Fajr },
        { name: 'الشروق', time: prayerData.timings.Sunrise },
        { name: 'الظهر', time: prayerData.timings.Dhuhr },
        { name: 'العصر', time: prayerData.timings.Asr },
        { name: 'المغرب', time: prayerData.timings.Maghrib },
        { name: 'العشاء', time: prayerData.timings.Isha },
    ];
    return (
        <div className="container-luminous rounded-theme-container p-4 stagger-item" style={{ animationDelay: '200ms' }}>
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg text-theme-accent">مواقيت الصلاة</h3>
                <div className="flex items-center text-xs font-bold p-1 bg-black/20 rounded-theme-full">
                    <button onClick={() => onFormatChange('12h')} className={`px-3 py-1 rounded-theme-full ${timeFormat === '12h' ? 'bg-theme-accent-primary text-white' : 'text-theme-secondary'}`}>12 ساعة</button>
                    <button onClick={() => onFormatChange('24h')} className={`px-3 py-1 rounded-theme-full ${timeFormat === '24h' ? 'bg-theme-accent-primary text-white' : 'text-theme-secondary'}`}>24 ساعة</button>
                </div>
            </div>
            <div className="space-y-2">
                {prayerSchedule.map(p => (
                    <div key={p.name} className={`flex justify-between items-center p-2 rounded-lg transition-colors ${p.name === nextPrayerName ? 'bg-theme-accent-card' : ''}`}>
                        <span className={`font-semibold ${p.name === nextPrayerName ? 'text-theme-accent-primary' : 'text-theme-primary'}`}>{p.name}</span>
                        <span className={`font-bold text-lg ${p.name === nextPrayerName ? 'text-theme-accent-primary' : 'text-theme-secondary'}`}>{formatTime(p.time, timeFormat)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DailyInspirationCard: React.FC = () => {
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const hadith = DAILY_HADITH_DATA[(dayOfYear - 1) % DAILY_HADITH_DATA.length];
    return (
        <div className="container-luminous rounded-theme-container p-4 text-center stagger-item" style={{ animationDelay: '300ms' }}>
            <h3 className="font-bold text-lg text-theme-accent mb-2">حديث اليوم</h3>
            <p className="font-amiri text-xl leading-relaxed">"{hadith.arabic}"</p>
            <p className="text-xs text-theme-secondary/70 mt-2">{hadith.narrator}</p>
        </div>
    );
};

const DailyDhikrCard: React.FC<{ dailyCount: number; dailyGoal: number }> = ({ dailyCount, dailyGoal }) => {
    const progress = dailyGoal > 0 ? (dailyCount / dailyGoal) * 100 : 0;
    return (
        <div className="container-luminous rounded-theme-container p-4 flex items-center gap-4 stagger-item" style={{ animationDelay: '400ms' }}>
            <div className="p-3 bg-theme-accent-card rounded-theme-full text-theme-accent-primary"><CounterIcon className="w-6 h-6"/></div>
            <div className="flex-grow">
                <div className="flex justify-between items-baseline text-sm mb-1">
                    <span className="font-bold">الهدف اليومي للذكر</span>
                    <span className="text-theme-secondary">{dailyCount} / {dailyGoal}</span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-1.5 p-0.5"><div className="bg-theme-accent-primary h-full rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div></div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

interface HomeTabProps {
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
    onPrayerTimesLoaded: (data: PrayerTimesData) => void;
    profile: Profile;
}

const HomeTab: React.FC<HomeTabProps> = ({ settings, setSettings, onPrayerTimesLoaded, profile }) => {
    const [prayerData, setPrayerData] = useState<PrayerTimesData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [countdown, setCountdown] = useState("00:00:00");
    const [dailyCount] = useLocalStorage('dailyCount', 0);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPrayerData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 600000,
                });
            });
            const { latitude, longitude } = position.coords;
            const data = await getPrayerTimes(latitude, longitude, settings.prayerMethod);
            
            if (data) {
                setPrayerData(data);
                onPrayerTimesLoaded(data);
            } else {
                setError('فشل تحميل مواقيت الصلاة للموقع الحالي.');
                setPrayerData(null);
            }
        } catch (err: any) {
            let fetchError = 'تعذر الحصول على الموقع الحالي.';
            if (err.code === 1) { // PERMISSION_DENIED
                fetchError = 'يرجى تفعيل خدمة الموقع لعرض مواقيت الصلاة.';
            }
            setError(fetchError);
            setPrayerData(null);
        }
        setIsLoading(false);
    }, [settings.prayerMethod, onPrayerTimesLoaded]);


    useEffect(() => {
        fetchPrayerData();
    }, [fetchPrayerData]);

    const nextPrayer = useMemo(() => {
        if (!prayerData) return null;
        const now = new Date();
        const prayerSchedule = [
            { name: 'الفجر', time: parseTimeToDate(prayerData.timings.Fajr) },
            { name: 'الشروق', time: parseTimeToDate(prayerData.timings.Sunrise) },
            { name: 'الظهر', time: parseTimeToDate(prayerData.timings.Dhuhr) },
            { name: 'العصر', time: parseTimeToDate(prayerData.timings.Asr) },
            { name: 'المغرب', time: parseTimeToDate(prayerData.timings.Maghrib) },
            { name: 'العشاء', time: parseTimeToDate(prayerData.timings.Isha) },
        ];
        const upcoming = prayerSchedule.find(p => p.time > now);
        if (upcoming) {
            return { name: upcoming.name, time: upcoming.time.toTimeString().slice(0, 5) };
        }
        return { name: 'الفجر', time: prayerData.timings.Fajr };
    }, [prayerData]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (nextPrayer) {
                const now = new Date();
                let nextPrayerTime = parseTimeToDate(nextPrayer.time);
                if (nextPrayerTime < now) {
                    nextPrayerTime.setDate(nextPrayerTime.getDate() + 1);
                }
                setCountdown(formatCountdown(nextPrayerTime.getTime() - now.getTime()));
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [nextPrayer]);

    if (isLoading) return <div className="flex-grow flex justify-center items-center"><Spinner /></div>;
    
    return (
        <div className="flex flex-col gap-5 pb-8">
            <Greeting name={profile.name} prayerData={prayerData} />

            {error && !prayerData && (
                <div className="text-center p-4 container-luminous rounded-theme-card">
                    <p className="text-theme-danger mb-4">{error}</p>
                    <button onClick={fetchPrayerData} className="px-5 py-2 button-luminous bg-theme-accent-primary text-white rounded-theme-full text-sm font-bold">
                        إعادة المحاولة
                    </button>
                </div>
            )}
            
            {prayerData && (
                <>
                    <NextPrayerCard nextPrayer={nextPrayer} countdown={countdown} timeFormat={settings.timeFormat} />
                    <PrayerTimesCard 
                        prayerData={prayerData}
                        nextPrayerName={nextPrayer?.name || null}
                        timeFormat={settings.timeFormat}
                        onFormatChange={(newFormat) => setSettings(s => ({ ...s, timeFormat: newFormat }))}
                    />
                    <DailyInspirationCard />
                    <DailyDhikrCard dailyCount={dailyCount} dailyGoal={profile.dailyGoal} />
                </>
            )}
        </div>
    );
};

export default HomeTab;