import type { PrayerTimes, Settings } from '../types';

const NOTIFICATION_TAG_PREFIX = 'prayer-time-';

// Helper to parse time string (e.g., "05:30") into a Date object for today or tomorrow
const parseTimeToDate = (time: string): Date => {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);

    // If the time has already passed for today, schedule it for tomorrow
    if (date < now) {
        date.setDate(date.getDate() + 1);
    }
    return date;
};

export const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
        console.error('This browser does not support desktop notification');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    // We can only ask for permission if it's not denied
    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    return false;
};

export const cancelAllNotifications = async () => {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker.ready) return;
    
    try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (!registration || !registration.getNotifications) return;

        const notifications = await registration.getNotifications();
        notifications.forEach(notification => {
            if (notification.tag && notification.tag.startsWith(NOTIFICATION_TAG_PREFIX)) {
                notification.close();
            }
        });
    } catch (e) {
        console.error("Error cancelling notifications:", e);
    }
};


export const schedulePrayerNotifications = async (
    prayerTimes: PrayerTimes,
    notificationSettings: Settings['prayerNotifications']
) => {
    await cancelAllNotifications(); // Clear old notifications first

    if (!notificationSettings.enabled) {
        return;
    }

    // We don't need to ask for permission here again because it's handled in the UI
    if (Notification.permission !== 'granted') {
        console.warn('Cannot schedule notifications, permission not granted.');
        return;
    }
    
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker.ready) {
        console.error('Service worker not ready to schedule notifications.');
        return;
    }

    // Check for TimestampTrigger support
    if (typeof (window as any).TimestampTrigger === 'undefined') {
        console.warn('TimestampTrigger for notifications is not supported in this browser.');
        // Maybe alert the user once
        return;
    }

    try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (!registration) return;

        const prayersToSchedule: { name: string; time: string; key: keyof typeof notificationSettings }[] = [
            { name: 'الفجر', time: prayerTimes.Fajr, key: 'fajr' },
            { name: 'الظهر', time: prayerTimes.Dhuhr, key: 'dhuhr' },
            { name: 'العصر', time: prayerTimes.Asr, key: 'asr' },
            { name: 'المغرب', time: prayerTimes.Maghrib, key: 'maghrib' },
            { name: 'العشاء', time: prayerTimes.Isha, key: 'isha' },
        ];

        console.log("Scheduling notifications for:", prayersToSchedule.filter(p => notificationSettings[p.key]).map(p => p.name).join(', '));

        for (const prayer of prayersToSchedule) {
            if (notificationSettings[prayer.key]) {
                const prayerTime = parseTimeToDate(prayer.time);
                const timestamp = prayerTime.getTime();

                // Fix(line 107): Cast NotificationOptions to 'any' to allow for the experimental 'showTrigger' property.
                await registration.showNotification('حان وقت الصلاة', {
                    body: `حان الآن وقت أذان ${prayer.name}`,
                    icon: '/icon-192.png',
                    tag: `${NOTIFICATION_TAG_PREFIX}${prayer.key}`,
                    showTrigger: new (window as any).TimestampTrigger(timestamp),
                    vibrate: [200, 100, 200],
                } as any);
                 console.log(`Scheduled notification for ${prayer.name} at ${prayerTime.toLocaleString()}`);
            }
        }
    } catch(e) {
        console.error("Failed to schedule notifications", e);
    }
};