
import React, { useState, useEffect } from 'react';
import { getPrayerTimes } from '../../services/prayerTimeService';
import type { PrayerTimes, Settings } from '../../types';
import useLocalStorage from '../../hooks/useLocalStorage';
import Spinner from '../ui/Spinner';

interface PrayerTabProps {
    settings: Settings;
    onPrayerTimesLoaded: (times: PrayerTimes) => void;
}

const PrayerTab: React.FC<PrayerTabProps> = ({ settings, onPrayerTimesLoaded }) => {
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [timeFormat, setTimeFormat] = useLocalStorage<'12' | '24'>('timeFormat', '12');

    useEffect(() => {
        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const times = await getPrayerTimes(latitude, longitude, settings.prayerMethod);
                if (times) {
                    setPrayerTimes(times);
                    onPrayerTimesLoaded(times); // Lift state up
                } else {
                    setError('تعذر تحميل مواقيت الصلاة.');
                }
                setIsLoading(false);
            },
            () => {
                setError('يرجى تفعيل خدمة الموقع لعرض مواقيت الصلاة.');
                setIsLoading(false);
            },
            { enableHighAccuracy: true }
        );
    }, [settings.prayerMethod, onPrayerTimesLoaded]);

    const formatTime = (time: string) => {
        if (timeFormat === '12') {
            const [h, m] = time.split(':');
            const hour = parseInt(h);
            const suffix = hour >= 12 ? 'م' : 'ص';
            const convertedHour = ((hour + 11) % 12 + 1);
            return `${convertedHour}:${m} ${suffix}`;
        }
        return time;
    };

    const prayerSchedule = prayerTimes ? [
        { name: 'الفجر', time: prayerTimes.Fajr },
        { name: 'الشروق', time: prayerTimes.Sunrise },
        { name: 'الظهر', time: prayerTimes.Dhuhr },
        { name: 'العصر', time: prayerTimes.Asr },
        { name: 'المغرب', time: prayerTimes.Maghrib },
        { name: 'العشاء', time: prayerTimes.Isha },
    ] : [];

    return (
        <div className="flex flex-col gap-4">
            <div className="text-center">
                <h2 className="text-xl font-bold">مواقيت الصلاة</h2>
                {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
            </div>
            
            <div className="flex justify-center bg-black/20 p-1 rounded-full">
                <button onClick={() => setTimeFormat('12')} className={`flex-1 py-1 rounded-full text-sm font-semibold transition-colors ${timeFormat === '12' ? 'bg-theme-add text-white' : ''}`}>12 ساعة</button>
                <button onClick={() => setTimeFormat('24')} className={`flex-1 py-1 rounded-full text-sm font-semibold transition-colors ${timeFormat === '24' ? 'bg-theme-add text-white' : ''}`}>24 ساعة</button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-48"><Spinner /></div>
            ) : prayerTimes ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {prayerSchedule.map(prayer => (
                        <div key={prayer.name} className="p-4 bg-white/5 rounded-lg text-center">
                            <p className="font-semibold text-theme-accent">{prayer.name}</p>
                            <p className="text-xl font-bold text-theme-counter">{formatTime(prayer.time)}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center p-8 text-theme-accent/70">
                    لم يتم العثور على مواقيت الصلاة.
                </div>
            )}
             <div className="text-center text-xs text-theme-accent/60 mt-2">
                هذا التطبيق صدقة جارية لصاحبه ووالديه
             </div>
        </div>
    );
};

export default PrayerTab;
