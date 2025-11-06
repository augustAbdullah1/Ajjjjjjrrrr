import type { PrayerTimes, NotificationSettings } from '../types';
import { HISNUL_MUSLIM_DUAS } from '../constants';

let prayerTimeouts: number[] = [];
let reminderInterval: number | null = null;
const PERSISTENT_NOTIFICATION_TAG = 'persistent-prayer-times';

const ALL_DUAS = HISNUL_MUSLIM_DUAS.flatMap(category => category.duas);
const nativeBridge = (window as any).Android;

/**
 * Tries to call a function on the native Android bridge if it exists.
 * @param funcName The name of the function to call on the `window.Android` object.
 * @param args The arguments to pass to the native function.
 * @returns `true` if the native function was called successfully, `false` otherwise.
 */
const tryNative = (funcName: string, ...args: any[]): boolean => {
    if (nativeBridge && typeof nativeBridge[funcName] === 'function') {
        try {
            // Native bridges typically expect string arguments.
            const stringArgs = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg)));
            nativeBridge[funcName](...stringArgs);
            console.log(`Called native function: ${funcName}`);
            return true;
        } catch (e) {
            console.error(`Error calling native function ${funcName}:`, e);
            return false;
        }
    }
    return false;
};

const formatTime12h = (time: string): string => {
    if (!time || !time.includes(':')) return '00:00';
    const [h, m] = time.split(':').map(Number);
    const ampm = h >= 12 ? 'م' : 'ص';
    const hour12 = h % 12 || 12;
    return `${hour12}:${m.toString().padStart(2, '0')} ${ampm}`;
};


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

const scheduleWebPrayerNotifications = (prayerTimes: PrayerTimes, settings: NotificationSettings) => {
    stopWebPrayerNotifications(); // Clear any existing timeouts

    const now = new Date();

    Object.entries(prayerTimes).forEach(([prayerName, time]) => {
        if (prayerName === 'Sunrise') return;

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
                
                if (settings.sound === 'vibrate') options.vibrate = [200, 100, 200];
                
                if (settings.sound === 'adhan') {
                     const audio = new Audio('/sounds/adhan.mp3');
                     audio.play().catch(e => console.error("Error playing adhan sound:", e));
                }

                showNotification(`صلاة ${prayerName}`, options);

            }, timeout);
            prayerTimeouts.push(prayerTimeout);
        }
    });
};

const stopWebPrayerNotifications = () => {
    prayerTimeouts.forEach(clearTimeout);
    prayerTimeouts = [];
};

const startWebDhikrReminders = (settings: NotificationSettings) => {
    stopWebDhikrReminders();
    const intervalMillis = settings.reminderInterval * 60 * 1000;

    reminderInterval = setInterval(() => {
        const randomDua = ALL_DUAS[Math.floor(Math.random() * ALL_DUAS.length)];
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

const stopWebDhikrReminders = () => {
    if (reminderInterval) {
        clearInterval(reminderInterval);
        reminderInterval = null;
    }
};

const showWebPersistentPrayerNotification = (prayerTimes: PrayerTimes) => {
    const body = `الفجر: ${formatTime12h(prayerTimes.Fajr)} | الظهر: ${formatTime12h(prayerTimes.Dhuhr)} | العصر: ${formatTime12h(prayerTimes.Asr)} | المغرب: ${formatTime12h(prayerTimes.Maghrib)} | العشاء: ${formatTime12h(prayerTimes.Isha)}`;
    const options: NotificationOptions = {
        body: body,
        icon: '/icon-192.png',
        tag: PERSISTENT_NOTIFICATION_TAG,
        requireInteraction: true, // Keep it until user dismisses it
        silent: true,
    };
    showNotification('مواقيت الصلاة لليوم', options);
};

const hideWebPersistentPrayerNotification = async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
        const notifications = await registration.getNotifications({ tag: PERSISTENT_NOTIFICATION_TAG });
        notifications.forEach(notification => notification.close());
    }
};

// --- Public Hybrid Functions ---

export const schedulePrayerNotifications = (prayerTimes: PrayerTimes, settings: NotificationSettings) => {
    // Try native first, if it fails, fallback to web notifications
    if (!tryNative('schedulePrayerNotifications', prayerTimes, settings)) {
        console.log("Using web fallback for prayer notifications.");
        scheduleWebPrayerNotifications(prayerTimes, settings);
    }
};

export const stopPrayerNotifications = () => {
    if (!tryNative('stopPrayerNotifications')) {
        stopWebPrayerNotifications();
    }
};

export const startDhikrReminders = (settings: NotificationSettings) => {
    if (!tryNative('startDhikrReminders', settings)) {
        console.log("Using web fallback for dhikr reminders.");
        startWebDhikrReminders(settings);
    }
};

export const stopDhikrReminders = () => {
    if (!tryNative('stopDhikrReminders')) {
        stopWebDhikrReminders();
    }
};

export const showPersistentPrayerNotification = (prayerTimes: PrayerTimes) => {
    if (!tryNative('showPersistentPrayerNotification', prayerTimes)) {
        console.log("Using web fallback for persistent prayer notification.");
        showWebPersistentPrayerNotification(prayerTimes);
    }
};

export const hidePersistentPrayerNotification = () => {
    if (!tryNative('hidePersistentPrayerNotification')) {
        hideWebPersistentPrayerNotification();
    }
};