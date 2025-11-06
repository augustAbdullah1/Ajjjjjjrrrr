
import React, { useState, useEffect, useCallback } from 'react';
import { getHijriCalendar } from '../../services/prayerTimeService';
import Spinner from '../ui/Spinner';
import { ChevronLeftIcon } from '../icons/TabIcons';
import type { Settings } from '../../types';
import { DEFAULT_SETTINGS } from '../../constants';

interface IslamicCalendarTabProps {
    onBack?: () => void;
}

const HOLIDAY_TRANSLATIONS: { [key: string]: string } = {
    "Ashura": "عاشوراء",
    "Arafat Day": "يوم عرفة",
    "Eid al-Fitr": "عيد الفطر",
    "Eid al-Adha": "عيد الأضحى",
    "Laylat al-Qadr": "ليلة القدر (تقريبي)",
    "Islamic New Year": "رأس السنة الهجرية",
    "Milad un Nabi": "المولد النبوي الشريف",
    "Isra and Mi'raj": "الإسراء والمعراج",
    // This will handle cases like "1st of Ramadan"
    "Ramadan": "رمضان",
};

const translateHoliday = (holiday: string) => {
    for (const key in HOLIDAY_TRANSLATIONS) {
        if (holiday.includes(key)) {
            return holiday.replace(key, HOLIDAY_TRANSLATIONS[key]);
        }
    }
    return holiday;
};


const IslamicCalendarTab: React.FC<IslamicCalendarTabProps> = ({ onBack }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarData, setCalendarData] = useState<any[]>([]);
    const [holidays, setHolidays] = useState<{ day: string; name: string }[]>([]);
    const [hijriMonth, setHijriMonth] = useState('');
    const [hijriYear, setHijriYear] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCalendar = useCallback(async (date: Date) => {
        setIsLoading(true);
        setError(null);
        setHolidays([]);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                
                let settings: Settings = DEFAULT_SETTINGS;
                try {
                    const storedSettings = localStorage.getItem('settings');
                    if (storedSettings) {
                        settings = JSON.parse(storedSettings);
                    }
                } catch (e) {
                    console.error("Could not parse settings from localStorage", e);
                }

                const calendarResponse = await getHijriCalendar(
                    date.getMonth() + 1,
                    date.getFullYear(),
                    latitude,
                    longitude,
                    settings.prayerMethod
                );
                
                if (calendarResponse && calendarResponse.length > 0) {
                    const firstDayData = calendarResponse[0];
                    setHijriMonth(firstDayData.date.hijri.month.ar);
                    setHijriYear(firstDayData.date.hijri.year);
                    
                    const monthHolidays = calendarResponse
                        .filter((day: any) => day.date.hijri.holidays.length > 0)
                        .map((day: any) => ({
                            day: day.date.hijri.day,
                            name: translateHoliday(day.date.hijri.holidays[0])
                        }));
                    setHolidays(monthHolidays);

                    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
                    const blanks = Array(firstDayOfMonth).fill(null);
                    setCalendarData([...blanks, ...calendarResponse]);
                } else {
                    setError('فشل تحميل بيانات التقويم. يرجى التحقق من اتصالك بالإنترنت.');
                }
                setIsLoading(false);
            },
            (geoError) => {
                setError("يرجى تفعيل خدمة الموقع لعرض التقويم.");
                setIsLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
        );
    }, []);

    useEffect(() => {
        fetchCalendar(currentDate);
    }, [currentDate, fetchCalendar]);

    const changeMonth = (delta: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + delta, 1);
            return newDate;
        });
    };

    const weekDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format

    return (
        <div className="flex flex-col gap-4 min-h-[450px] relative animate-in fade-in-0">
            {onBack && (
                <button onClick={onBack} className="absolute top-0 right-0 flex items-center gap-2 font-semibold text-theme-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    رجوع
                </button>
            )}
            <div className="text-center w-full pt-8 pb-12">
                <h2 className="text-2xl font-bold mb-4">التقويم الإسلامي</h2>
                {error && <p className="text-theme-danger mb-4">{error}</p>}
                <div className="flex justify-between items-center p-2 bg-theme-card rounded-theme-full mb-4">
                    <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white/10 rounded-theme-full"><ChevronLeftIcon className="w-6 h-6" /></button>
                    {isLoading ? <Spinner /> : <span className="font-bold text-lg text-theme-accent">{hijriMonth} {hijriYear} هـ</span>}
                    <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white/10 rounded-theme-full"><ChevronLeftIcon className="w-6 h-6" style={{transform: 'scaleX(-1)'}} /></button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center font-semibold text-sm text-theme-secondary mb-2">
                    {weekDays.map(day => <div key={day}>{day.charAt(0)}</div>)}
                </div>
                
                {isLoading ? <div className="flex justify-center items-center h-48"><Spinner /></div> : !error &&
                    <div className="grid grid-cols-7 gap-1">
                        {calendarData.map((dayData, index) => {
                            if (!dayData) return <div key={`blank-${index}`} className="w-full aspect-square"></div>;
                            
                            const isToday = dayData.date.gregorian.date.split('-').reverse().join('-') === today;
                            const hasHoliday = dayData.date.hijri.holidays.length > 0;
                            const holidayName = hasHoliday ? translateHoliday(dayData.date.hijri.holidays[0]) : '';

                            return (
                                <div key={dayData.date.gregorian.day}
                                    className={`w-full aspect-square flex flex-col justify-center items-center rounded-theme-card border transition-colors
                                    ${isToday ? 'bg-theme-accent-primary text-theme-accent-primary-text border-theme-accent-primary' : 'bg-theme-card border-theme'}
                                    ${hasHoliday ? 'bg-yellow-400/10 border-yellow-400/40' : ''}`}
                                    title={holidayName}
                                >
                                    <span className="text-xl font-bold">{dayData.date.hijri.day}</span>
                                    <span className="text-xs opacity-70">{dayData.date.gregorian.day}</span>
                                </div>
                            );
                        })}
                    </div>
                }
                
                {holidays.length > 0 && !isLoading && (
                    <div className="mt-6 text-right animate-in fade-in-0">
                        <h3 className="font-bold text-lg text-theme-accent mb-2">مناسبات هذا الشهر</h3>
                        <div className="space-y-2">
                            {holidays.map(holiday => (
                                <div key={holiday.name} className="p-3 bg-theme-card rounded-lg flex items-center gap-3 border-r-4 border-theme-accent-primary">
                                    <div className="font-bold text-2xl text-theme-accent-primary">{holiday.day}</div>
                                    <div>
                                        <p className="font-semibold text-theme-primary">{holiday.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                 <div className="text-right text-xs text-theme-secondary/60 mt-4">
                    <p>ملاحظة: التواريخ الهجرية قد تختلف بيوم واحد حسب رؤية الهلال.</p>
                </div>
            </div>
        </div>
    );
};

export default IslamicCalendarTab;
