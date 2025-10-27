import type { PrayerTimes, NotificationSettings, Dhikr } from '../types';
import { INITIAL_DHIKR_LIST, HISNUL_MUSLIM_DUAS } from '../constants';

// FIX: Replace NodeJS.Timeout with number for browser environment, as it's not a Node.js context.
let prayerTimeouts: number[] = [];
// FIX: Replace NodeJS.Timeout with number for browser environment.
let reminderInterval: number | null = null;

const ALL_DUAS = HISNUL_MUSLIM_DUAS.flatMap(category => category.duas);

export const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
        alert('This browser does not support desktop notification');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    return false;
};

// FIX: The default NotificationOptions type might be missing properties like 'vibrate', 'sound', and 'renotify'.
// This extended interface includes them to satisfy TypeScript.
interface ExtendedNotificationOptions extends NotificationOptions {
    vibrate?: number[];
    sound?: string;
    renotify?: boolean;
}

const showNotification = async (title: string, options: NotificationOptions) => {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
        registration.showNotification(title, options);
    }
};

export const schedulePrayerNotifications = (prayerTimes: PrayerTimes, settings: NotificationSettings) => {
    stopPrayerNotifications(); // Clear any existing timeouts

    const now = new Date();

    Object.entries(prayerTimes).forEach(([prayerName, time]) => {
        if (prayerName === 'Sunrise') return; // Typically no notification for sunrise

        const [hours, minutes] = time.split(':').map(Number);
        const prayerDate = new Date();
        prayerDate.setHours(hours, minutes, 0, 0);

        if (prayerDate > now) {
            const timeout = prayerDate.getTime() - now.getTime();
            const prayerTimeout = setTimeout(() => {
                const options: ExtendedNotificationOptions = {
                    body: `حان الآن موعد أذان ${prayerName}`,
                    icon: '/icon-192.png',
                    tag: `prayer-${prayerName}-${prayerDate.getDate()}`,
                    silent: settings.sound === 'silent' || settings.sound === 'vibrate',
                };
                
                // FIX: Property 'vibrate' does not exist on type 'NotificationOptions'.
                // Added to ExtendedNotificationOptions to resolve the error.
                if (settings.sound === 'vibrate') {
                    options.vibrate = [200, 100, 200];
                }
                
                // FIX: Property 'sound' does not exist on type 'NotificationOptions'.
                // Added to ExtendedNotificationOptions to resolve the error.
                if (settings.sound === 'adhan') {
                    // The service worker will handle playing the sound
                    options.sound = '/sounds/adhan.mp3';
                     // For web notifications, sound is not universally supported.
                     // A common workaround is to play an audio element.
                     const audio = new Audio('/sounds/adhan.mp3');
                     audio.play().catch(e => console.error("Error playing adhan sound:", e));
                }

                showNotification(`صلاة ${prayerName}`, options);

            }, timeout);
            prayerTimeouts.push(prayerTimeout);
        }
    });
};

export const stopPrayerNotifications = () => {
    prayerTimeouts.forEach(clearTimeout);
    prayerTimeouts = [];
};

export const startDhikrReminders = (settings: NotificationSettings) => {
    stopDhikrReminders();

    const intervalMillis = settings.reminderInterval * 60 * 1000;

    reminderInterval = setInterval(() => {
        const randomDua = ALL_DUAS[Math.floor(Math.random() * ALL_DUAS.length)];
        // FIX: 'renotify' and 'vibrate' are not in the default NotificationOptions. Use our extended interface.
        const options: ExtendedNotificationOptions = {
            body: randomDua.ARABIC_TEXT,
            icon: '/icon-192.png',
            tag: 'dhikr-reminder',
            renotify: true,
            silent: settings.sound === 'silent' || settings.sound === 'vibrate' || settings.sound === 'adhan',
             vibrate: settings.sound === 'vibrate' ? [100, 50, 100] : undefined,
        };
        showNotification('تذكير', options);
    }, intervalMillis);
};

export const stopDhikrReminders = () => {
    if (reminderInterval) {
        clearInterval(reminderInterval);
        reminderInterval = null;
    }
};
