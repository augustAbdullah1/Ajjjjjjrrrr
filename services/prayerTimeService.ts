import type { PrayerTimes, PrayerMethod } from '../types';

const PRAYER_API_BASE = 'https://api.aladhan.com/v1';

export const getPrayerTimes = async (latitude: number, longitude: number, method: PrayerMethod): Promise<PrayerTimes | null> => {
    try {
        const today = new Date();
        const dateString = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
        
        const response = await fetch(`${PRAYER_API_BASE}/timings/${dateString}?latitude=${latitude}&longitude=${longitude}&method=${method}`);
        if (!response.ok) {
            throw new Error('Failed to fetch prayer times');
        }
        
        const data = await response.json();
        if (data.code === 200) {
            return data.data.timings as PrayerTimes;
        }
        return null;
    } catch (error) {
        console.error('Error fetching prayer times:', error);
        return null;
    }
};
