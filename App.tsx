import React, { useState, useEffect, useRef, useCallback } from 'react';
import Layout from './components/Layout';
import TabBar from './components/TabBar';
import CounterTab from './components/tabs/CounterTab';
import DuasTab from './components/tabs/DuasTab';
import QuranTab from './components/tabs/QuranTab';
import HomeTab from './components/tabs/PrayerTab';
import ProfileTab from './components/tabs/ProfileTab';
import SettingsTab from './components/tabs/SettingsTab';
import OtherTab from './components/tabs/OtherTab';
import QuranReader from './components/tabs/QuranReader';
import type { Tab, Theme, Profile, Settings, PrayerTimesData, Surah, AudioPlayerState } from './types';
import { DEFAULT_PROFILE, DEFAULT_SETTINGS } from './constants';
import useLocalStorage from './hooks/useLocalStorage';
import { getSurahContent } from './services/quranService';
import { 
    schedulePrayerNotifications, 
    stopPrayerNotifications,
    startDhikrReminders, 
    stopDhikrReminders,
    showPersistentPrayerNotification,
    hidePersistentPrayerNotification
} from './services/notificationService';

const THEMES_STYLES: Record<Theme, Record<string, string>> = {
  midnight: {
    '--theme-bg-gradient-start': '#0D1A2E',
    '--theme-bg-gradient-end': '#151E29',
    '--theme-text-primary': '#F0F4F8',
    '--theme-text-secondary': '#A0AEC0',
    '--theme-text-accent': '#CBD5E1',
    '--theme-primary-accent': '#38BDF8',
    '--theme-primary-accent-text': '#0D1A2E',
    '--theme-card-bg': 'rgba(29, 41, 58, 0.7)',
    '--theme-card-bg-rgb': '29, 41, 58',
    '--theme-tab-bar-bg': 'rgba(29, 41, 58, 0.6)',
    '--theme-border-color': 'rgba(127, 212, 253, 0.15)',
    '--theme-shadow-color-rgb': '56, 189, 248',
    '--theme-accent-hsl': '204, 94%, 61%',
    '--theme-danger-color': '#E53E3E',
    '--theme-border-radius-card': '1rem',
    '--theme-border-radius-container': '1.25rem',
    '--theme-border-radius-full': '9999px',
  },
  serenity: {
    '--theme-bg-gradient-start': '#1A2A27',
    '--theme-bg-gradient-end': '#1F2D2B',
    '--theme-text-primary': '#D8E2DC',
    '--theme-text-secondary': '#8A9B97',
    '--theme-text-accent': '#A3B5B0',
    '--theme-primary-accent': '#6A998B',
    '--theme-primary-accent-text': '#1A2A27',
    '--theme-card-bg': 'rgba(45, 66, 60, 0.7)',
    '--theme-card-bg-rgb': '45, 66, 60',
    '--theme-tab-bar-bg': 'rgba(45, 66, 60, 0.6)',
    '--theme-border-color': 'rgba(106, 153, 139, 0.15)',
    '--theme-shadow-color-rgb': '106, 153, 139',
    '--theme-accent-hsl': '161, 18%, 51%',
    '--theme-danger-color': '#E57373',
    '--theme-border-radius-card': '1.5rem',
    '--theme-border-radius-container': '1.75rem',
    '--theme-border-radius-full': '9999px',
  },
  dusk: {
    '--theme-bg-gradient-start': '#2C2A4A',
    '--theme-bg-gradient-end': '#4F3A65',
    '--theme-text-primary': '#E2DDF0',
    '--theme-text-secondary': '#9D8DB0',
    '--theme-text-accent': '#BEA6D8',
    '--theme-primary-accent': '#F5C3AF',
    '--theme-primary-accent-text': '#2C2A4A',
    '--theme-card-bg': 'rgba(59, 46, 79, 0.7)',
    '--theme-card-bg-rgb': '59, 46, 79',
    '--theme-tab-bar-bg': 'rgba(59, 46, 79, 0.6)',
    '--theme-border-color': 'rgba(245, 195, 175, 0.15)',
    '--theme-shadow-color-rgb': '245, 195, 175',
    '--theme-accent-hsl': '21, 82%, 82%',
    '--theme-danger-color': '#F472B6',
    '--theme-border-radius-card': '0.75rem',
    '--theme-border-radius-container': '1rem',
    '--theme-border-radius-full': '9999px',
  },
  daylight: {
    '--theme-bg-gradient-start': '#F9FAFB',
    '--theme-bg-gradient-end': '#F3F4F6',
    '--theme-text-primary': '#1F2937',
    '--theme-text-secondary': '#6B7280',
    '--theme-text-accent': '#4B5563',
    '--theme-primary-accent': '#3B82F6',
    '--theme-primary-accent-text': '#FFFFFF',
    '--theme-card-bg': 'rgba(255, 255, 255, 0.9)',
    '--theme-card-bg-rgb': '245, 245, 245',
    '--theme-tab-bar-bg': 'rgba(249, 250, 251, 0.7)',
    '--theme-border-color': 'rgba(0, 0, 0, 0.1)',
    '--theme-shadow-color-rgb': '59, 130, 246',
    '--theme-accent-hsl': '217, 91%, 60%',
    '--theme-danger-color': '#EF4444',
    '--theme-border-radius-card': '1rem',
    '--theme-border-radius-container': '1.25rem',
    '--theme-border-radius-full': '9999px',
  },
};

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('home');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    
    const [theme, setTheme] = useLocalStorage<Theme>('appTheme', 'midnight');
    const [profile, setProfile] = useLocalStorage<Profile>('profile', DEFAULT_PROFILE);
    const [settings, setSettings] = useLocalStorage<Settings>('settings', DEFAULT_SETTINGS);
    const [prayerTimesData, setPrayerTimesData] = useState<PrayerTimesData | null>(null);
    
    // Quran Player State
    const [audioPlayerState, setAudioPlayerState] = useState<AudioPlayerState>({
        isVisible: false,
        surah: null,
        reciterName: '',
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        isLoadingNextPrev: false,
        isRepeatOn: false,
    });
    const audioRef = useRef<HTMLAudioElement>(null);
    const [selectedReciterId, setSelectedReciterId] = useLocalStorage<string | number>('selectedReciter', '7');

    // Quran Reader State
    const [isReaderOpen, setIsReaderOpen] = useState(false);
    const [readerSurahInfo, setReaderSurahInfo] = useState<{ number: number; startAtAyah: number | null } | null>(null);


    // Effect for handling service worker registration
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                // Use a relative path to register the service worker to avoid origin mismatches in sandboxed environments.
                navigator.serviceWorker.register('/service-worker.js', { scope: '/' }).then(registration => {
                    console.log('SW registered: ', registration);
                }).catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
            });
        }
    }, []);

    // Effect for handling themes
    useEffect(() => {
        const currentThemeStyles = THEMES_STYLES[theme];
        const root = document.documentElement;
        Object.entries(currentThemeStyles).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', currentThemeStyles['--theme-bg-gradient-end']);
    }, [theme]);

    // Effect for handling notifications
    useEffect(() => {
        if (settings.notifications.prayers && prayerTimesData) {
            schedulePrayerNotifications(prayerTimesData.timings, settings.notifications);
        } else {
            stopPrayerNotifications();
        }
        if (settings.notifications.reminders) {
            startDhikrReminders(settings.notifications);
        } else {
            stopDhikrReminders();
        }
        if (settings.notifications.persistentPrayerTimes && prayerTimesData) {
            showPersistentPrayerNotification(prayerTimesData.timings);
        } else {
            hidePersistentPrayerNotification();
        }
        return () => {
             stopPrayerNotifications();
             stopDhikrReminders();
             hidePersistentPrayerNotification();
        }
    }, [settings.notifications, prayerTimesData]);
    

    // --- Quran Reader Logic ---
    const handleOpenReader = useCallback((surahNumber: number, startAtAyah: number | null) => {
        setReaderSurahInfo({ number: surahNumber, startAtAyah });
        setIsReaderOpen(true);
    }, []);

    const handleCloseReader = useCallback(() => {
        setIsReaderOpen(false);
        setReaderSurahInfo(null);
    }, []);

    const handleSwitchSurah = useCallback((newSurahNumber: number) => {
        setReaderSurahInfo({ number: newSurahNumber, startAtAyah: null });
    }, []);


    // --- Global Audio Player Logic ---
    const handlePlaySurah = useCallback(async (surah: Surah) => {
        setAudioPlayerState(s => ({
            ...s,
            isVisible: true,
            isPlaying: true,
            surah: surah,
            duration: 0,
            currentTime: 0,
        }));
    }, []);
    
    const handleSeek = useCallback((time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setAudioPlayerState(s => ({ ...s, currentTime: time }));
        }
    }, []);

    const handleReplay = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            // The 'play' event listener will correctly update the isPlaying state.
            // This prevents potential race conditions.
            audioRef.current.play().catch(e => console.error("Replay failed", e));
        }
    }, []);

    const handleNextSurah = useCallback(async () => {
        if (audioPlayerState.surah && audioPlayerState.surah.number < 114) {
            const nextSurahNumber = audioPlayerState.surah.number + 1;
            
            // If reader is open, update its content to the next surah
            if (isReaderOpen) {
                handleSwitchSurah(nextSurahNumber);
            }

            setAudioPlayerState(s => ({ ...s, isPlaying: false, isLoadingNextPrev: true, duration: 0, currentTime: 0 }));
            const surahContent = await getSurahContent(nextSurahNumber, selectedReciterId, false);
            if (surahContent && 'ayahs' in surahContent) {
                 setAudioPlayerState(s => ({
                    ...s,
                    surah: surahContent as Surah,
                    isPlaying: true,
                    isLoadingNextPrev: false,
                }));
            } else {
                alert('تعذر تحميل السورة التالية.');
                setAudioPlayerState(s => ({ ...s, isPlaying: false, isLoadingNextPrev: false }));
            }
        }
    }, [audioPlayerState.surah, selectedReciterId, isReaderOpen, handleSwitchSurah]);
    
    const handlePrevSurah = useCallback(async () => {
        if (audioPlayerState.surah && audioPlayerState.surah.number > 1) {
            const prevSurahNumber = audioPlayerState.surah.number - 1;
             
             if (isReaderOpen) {
                handleSwitchSurah(prevSurahNumber);
            }

             setAudioPlayerState(s => ({ ...s, isPlaying: false, isLoadingNextPrev: true, duration: 0, currentTime: 0 }));
            const surahContent = await getSurahContent(prevSurahNumber, selectedReciterId, false);
            if (surahContent && 'ayahs' in surahContent) {
                 setAudioPlayerState(s => ({
                    ...s,
                    surah: surahContent as Surah,
                    isPlaying: true,
                    isLoadingNextPrev: false,
                }));
            } else {
                alert('تعذر تحميل السورة السابقة.');
                setAudioPlayerState(s => ({ ...s, isPlaying: false, isLoadingNextPrev: false }));
            }
        }
    }, [audioPlayerState.surah, selectedReciterId, isReaderOpen, handleSwitchSurah]);

    const audioPlayerStateRef = useRef(audioPlayerState);
    useEffect(() => {
        audioPlayerStateRef.current = audioPlayerState;
    }, [audioPlayerState]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => setAudioPlayerState(s => s.isVisible ? { ...s, currentTime: audio.currentTime } : s);
        const handleLoadedData = () => setAudioPlayerState(s => s.isVisible ? { ...s, duration: audio.duration } : s);
        const handlePlay = () => setAudioPlayerState(s => s.isVisible ? { ...s, isPlaying: true } : s);
        const handlePause = () => setAudioPlayerState(s => s.isVisible ? { ...s, isPlaying: false } : s);
        
        const handleEnded = () => {
            if (audioPlayerStateRef.current.isRepeatOn) {
                handleReplay();
            } else {
                handleNextSurah();
            }
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadeddata', handleLoadedData);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadeddata', handleLoadedData);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [audioPlayerState.isVisible, handleNextSurah, handleReplay]);

    useEffect(() => {
        const audio = audioRef.current;
        const { surah, isPlaying } = audioPlayerState;
        if (audio && surah?.audioUrl) {
            if (audio.src !== surah.audioUrl) {
                audio.src = surah.audioUrl;
                audio.load();
            }
            if (isPlaying) {
                audio.play().catch(e => console.error("Autoplay failed", e));
            } else {
                audio.pause();
            }
        } else if (audio && !isPlaying && !surah) {
            audio.pause();
            audio.src = '';
        }
    }, [audioPlayerState.surah?.audioUrl, audioPlayerState.isPlaying, audioPlayerState.surah]);


    const handleTogglePlay = () => {
        if (audioPlayerState.surah) {
            setAudioPlayerState(s => ({ ...s, isPlaying: !s.isPlaying }));
        }
    };

    const handleToggleRepeat = () => {
        setAudioPlayerState(s => ({...s, isRepeatOn: !s.isRepeatOn }));
    };
    
    const handleClosePlayer = () => {
         if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
        }
        setAudioPlayerState({ isVisible: false, surah: null, reciterName: '', isPlaying: false, currentTime: 0, duration: 0, isLoadingNextPrev: false, isRepeatOn: false });
    };
    
    const handleSetReciterName = useCallback((name: string) => {
        setAudioPlayerState(s => ({...s, reciterName: name}));
    }, []);

    const renderMainContent = () => {
        if (activeTab === 'duas') {
            return <DuasTab onOpenProfile={() => setIsProfileOpen(true)} onOpenSettings={() => setIsSettingsOpen(true)} />;
        }
        if (activeTab === 'other') {
            return <OtherTab onOpenProfile={() => setIsProfileOpen(true)} onOpenSettings={() => setIsSettingsOpen(true)} />;
        }
        return (
            <Layout onOpenProfile={() => setIsProfileOpen(true)} onOpenSettings={() => setIsSettingsOpen(true)}>
                <div style={{ display: activeTab === 'home' ? 'flex' : 'none', flexGrow: 1, flexDirection: 'column' }}>
                    <HomeTab
                        settings={settings}
                        setSettings={setSettings}
                        onPrayerTimesLoaded={setPrayerTimesData}
                        profile={profile}
                        playerState={audioPlayerState}
                        onTogglePlay={handleTogglePlay}
                        onNext={handleNextSurah}
                        onPrev={handlePrevSurah}
                    />
                </div>
                <div style={{ display: activeTab === 'quran' ? 'flex' : 'none', flexGrow: 1, flexDirection: 'column' }}>
                    <QuranTab 
                        settings={settings} 
                        setReciterName={handleSetReciterName}
                        selectedReciterId={selectedReciterId}
                        setSelectedReciterId={setSelectedReciterId}
                        onOpenReader={handleOpenReader}
                    />
                </div>
                <div style={{ display: activeTab === 'counter' ? 'flex' : 'none', flexGrow: 1, flexDirection: 'column' }}>
                    <CounterTab settings={settings} profile={profile} setProfile={setProfile} />
                </div>
            </Layout>
        );
    };

    return (
        <>
            <audio ref={audioRef} />

            {renderMainContent()}
            
            <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />

            {isReaderOpen && readerSurahInfo && (
                <QuranReader
                    surahNumber={readerSurahInfo.number}
                    startAtAyah={readerSurahInfo.startAtAyah}
                    onClose={handleCloseReader}
                    onPlay={handlePlaySurah}
                    settings={settings}
                    setSettings={setSettings}
                    reciterId={selectedReciterId}
                    setSelectedReciterId={setSelectedReciterId}
                    onSwitchSurah={handleSwitchSurah}
                    playerState={audioPlayerState}
                    onClosePlayer={handleClosePlayer}
                    onTogglePlay={handleTogglePlay}
                    onSeek={handleSeek}
                    onNext={handleNextSurah}
                    onPrev={handlePrevSurah}
                    onReplay={handleReplay}
                    onToggleRepeat={handleToggleRepeat}
                />
            )}
            
            {isProfileOpen && (
                <ProfileTab
                    onClose={() => setIsProfileOpen(false)}
                    profile={profile}
                    setProfile={setProfile}
                    settings={settings}
                />
            )}

            {isSettingsOpen && (
                <SettingsTab 
                    onClose={() => setIsSettingsOpen(false)}
                    theme={theme} 
                    setTheme={setTheme} 
                    settings={settings}
                    setSettings={setSettings}
                    profile={profile}
                    setProfile={setProfile}
                />
            )}
        </>
    );
};

export default App;