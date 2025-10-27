
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import TabBar from './components/TabBar';
import CounterTab from './components/tabs/CounterTab';
import DuasTab from './components/tabs/DuasTab';
import QuranTab from './components/tabs/QuranTab';
import PrayerTab from './components/tabs/PrayerTab';
import QiblaTab from './components/tabs/QiblaTab';
import ProfileTab from './components/tabs/ProfileTab';
import SettingsTab from './components/tabs/SettingsTab';
import type { Tab, Theme, PrayerTimes } from './types';
import { DEFAULT_PROFILE, DEFAULT_SETTINGS } from './constants';
import useLocalStorage from './hooks/useLocalStorage';
import { schedulePrayerNotifications, stopPrayerNotifications } from './services/notificationService';
import { startDhikrReminders, stopDhikrReminders } from './services/notificationService';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('counter');
    const [theme, setTheme] = useLocalStorage<Theme>('appTheme', 'default');
    const [isDarkMode, setIsDarkMode] = useLocalStorage('isDarkMode', true);
    const [profile, setProfile] = useLocalStorage('profile', DEFAULT_PROFILE);
    const [settings, setSettings] = useLocalStorage('settings', DEFAULT_SETTINGS);
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);

    // Effect for handling service worker registration
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js').then(registration => {
                    console.log('SW registered: ', registration);
                }).catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
            });
        }
    }, []);

    // Effect for handling theme and dark mode
    useEffect(() => {
        document.body.className = 'bg-theme-gradient text-theme-text'; // Reset classes
        if (!isDarkMode) {
            document.body.classList.add('light-mode');
        }
        if (theme !== 'default') {
            document.body.classList.add(`theme-${theme}`);
        }

        const root = document.documentElement;
        const themes: Record<Theme, Record<string, string>> = {
            default: { '--theme-primary': '#1a365d', '--theme-secondary': '#2d3748', '--theme-accent': '#cbd5e0', '--theme-counter': '#90cdf4' },
            purple: { '--theme-primary': '#553c9a', '--theme-secondary': '#6b46c1', '--theme-accent': '#d6bcfa', '--theme-counter': '#d6bcfa' },
            blue: { '--theme-primary': '#2c5282', '--theme-secondary': '#4299e1', '--theme-accent': '#bee3f8', '--theme-counter': '#bee3f8' },
            green: { '--theme-primary': '#276749', '--theme-secondary': '#48bb78', '--theme-accent': '#c6f6d5', '--theme-counter': '#c6f6d5' },
            rose: { '--theme-primary': '#97266d', '--theme-secondary': '#ed64a6', '--theme-accent': '#fed7e2', '--theme-counter': '#fed7e2' },
            ocean: { '--theme-primary': '#234e52', '--theme-secondary': '#38b2ac', '--theme-accent': '#b2f5ea', '--theme-counter': '#b2f5ea' },
        };
        const lightThemes = {
            '--theme-primary': '#f7fafc',
            '--theme-secondary': '#edf2f7',
            '--theme-text': '#2d3748',
            '--theme-accent': '#4a5568',
            '--theme-card-bg': 'rgba(255,255,255,0.9)',
            '--theme-border-color': 'rgba(0,0,0,0.1)',
        };
        const darkThemes = {
            '--theme-text': '#e2e8f0',
            '--theme-card-bg': 'rgba(255, 255, 255, 0.08)',
            '--theme-border-color': 'rgba(255, 255, 255, 0.1)',
        }

        const currentTheme = themes[theme];
        Object.keys(currentTheme).forEach(key => root.style.setProperty(key, currentTheme[key]));

        const modeThemes = isDarkMode ? darkThemes : lightThemes;
        Object.keys(modeThemes).forEach(key => root.style.setProperty(key, modeThemes[key as keyof typeof modeThemes]));
    }, [theme, isDarkMode]);

    // Effect for handling notifications
    useEffect(() => {
        // Prayer time notifications
        if (settings.notifications.prayers && prayerTimes) {
            schedulePrayerNotifications(prayerTimes, settings.notifications);
        } else {
            stopPrayerNotifications();
        }

        // Dhikr reminder notifications
        if (settings.notifications.reminders) {
            startDhikrReminders(settings.notifications);
        } else {
            stopDhikrReminders();
        }

        // Cleanup on effect change
        return () => {
             stopPrayerNotifications();
             stopDhikrReminders();
        }
    }, [settings.notifications, prayerTimes]);
    
    const renderTabContent = () => {
        switch (activeTab) {
            case 'counter':
                return <CounterTab settings={settings} profile={profile} setProfile={setProfile} />;
            case 'duas':
                return <DuasTab />;
            case 'quran':
                return <QuranTab />;
            case 'prayer':
                return <PrayerTab settings={settings} onPrayerTimesLoaded={setPrayerTimes} />;
            case 'qibla':
                return <QiblaTab />;
            case 'profile':
                return <ProfileTab profile={profile} setProfile={setProfile} />;
            case 'settings':
                return <SettingsTab 
                  theme={theme} 
                  setTheme={setTheme} 
                  isDarkMode={isDarkMode} 
                  setIsDarkMode={setIsDarkMode} 
                  settings={settings}
                  setSettings={setSettings}
                />;
            default:
                return <CounterTab settings={settings} profile={profile} setProfile={setProfile} />;
        }
    };
    
    return (
        <div className="min-h-screen p-2.5 pb-28 flex flex-col items-center">
            <Layout>
                {renderTabContent()}
            </Layout>
            <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
};

export default App;
