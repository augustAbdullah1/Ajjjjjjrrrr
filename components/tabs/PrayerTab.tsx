import React, { useState, useEffect, useCallback } from 'react';
import { getPrayerTimes } from '../../services/prayerTimeService';
import type { PrayerTimesData, Settings, Profile } from '../../types';
import Spinner from '../ui/Spinner';
import { MapPinIcon } from '../icons/TabIcons';

const formatTime = (time: string): string => {
    if (!time) return '--:--';
    const [h, m] = time.split(':').map(Number);
    const ampm = h >= 12 ? 'م' : 'ص';
    const hour12 = h % 12 || 12;
    return `${hour12}:${m.toString().padStart(2, '0')} ${ampm}`;
};

const PrayerTab: React.FC<{
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
    onPrayerTimesLoaded: (data: PrayerTimesData) => void;
    profile: Profile;
}> = ({ settings, onPrayerTimesLoaded }) => {
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTimes = useCallback(async () => {
        setIsLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (pos) => {
                const data = await getPrayerTimes(pos.coords.latitude, pos.coords.longitude, settings.prayerMethod);
                if (data) { setPrayerTimes(data); onPrayerTimesLoaded(data); }
                setIsLoading(false);
            }, () => { setIsLoading(false); });
        }
    }, [settings.prayerMethod, onPrayerTimesLoaded]);

    useEffect(() => { fetchTimes(); }, [fetchTimes]);

    if (isLoading) return <div className="h-full flex items-center justify-center"><Spinner /></div>;

    const timings = prayerTimes?.timings;
    const prayers = [
        { name: 'الفجر', time: timings?.Fajr },
        { name: 'الشروق', time: timings?.Sunrise },
        { name: 'الظهر', time: timings?.Dhuhr },
        { name: 'العصر', time: timings?.Asr },
        { name: 'المغرب', time: timings?.Maghrib },
        { name: 'العشاء', time: timings?.Isha },
    ];

    return (
        <div className="px-4 py-6 space-y-6">
            {/* Header / Date */}
            <div className="app-card p-6 text-center bg-gradient-to-br from-[#1F2937] to-[#111827]">
                <h2 className="text-[#D4AF37] font-amiri text-2xl font-bold mb-1">
                    {prayerTimes?.date.hijri.weekday.ar}
                </h2>
                <p className="text-gray-400 text-sm">
                    {prayerTimes?.date.hijri.day} {prayerTimes?.date.hijri.month.ar} {prayerTimes?.date.hijri.year}
                </p>
                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
                    <MapPinIcon className="w-3 h-3" />
                    <span>حسب موقعك الحالي</span>
                </div>
            </div>

            {/* Prayer List */}
            <div className="space-y-3">
                {prayers.map((p) => (
                    <div key={p.name} className="app-card p-4 flex items-center justify-between active-scale transition-transform">
                        <span className="font-bold text-gray-300">{p.name}</span>
                        <div className="flex items-center gap-3">
                            <span className="font-mono text-xl text-white font-semibold">
                                {formatTime(p.time || '')}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PrayerTab;