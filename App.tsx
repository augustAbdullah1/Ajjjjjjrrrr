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
import type { Tab, Theme, Profile, Settings, PrayerTimesData, Surah, AudioPlayerState, QuranUserData } from './types';
import { DEFAULT_PROFILE, DEFAULT_SETTINGS } from './constants';
import useLocalStorage from './hooks/useLocalStorage';
import { getSurahContent } from './services/quranService';
import { schedulePrayerNotifications, cancelAllNotifications } from './services/notificationService';
import FloatingAudioPlayer from './components/FloatingAudioPlayer';
import { ProfileIcon, SettingsIcon } from './components/icons/TabIcons';

const THEMES_STYLES: Record<Theme, Record<string, string>> = {
  dark: {
    '--theme-bg-gradient-start': '#1E1E1E',
    '--theme-bg-gradient-end': '#121212',
    '--theme-text-primary': '#E0E0E0',
    '--theme-text-secondary': '#9E9E9E',
    '--theme-text-accent': '#FFFFFF',
    '--theme-primary-accent': '#FFFFFF',
    '--theme-primary-accent-text': '#121212',
    '--theme-card-bg': 'rgba(30, 30, 30, 0.7)',
    '--theme-card-bg-rgb': '30, 30, 30',
    '--theme-tab-bar-bg': '#1A1A1A',
    '--theme-border-color': 'rgba(255, 255, 255, 0.12)',
    '--theme-shadow-color-rgb': '255, 255, 255',
    '--theme-accent-hsl': '0, 0%, 100%',
    '--theme-danger-color': '#E0E0E0',
  },
  light: {
    '--theme-bg-gradient-start': '#FAFAFA',
    '--theme-bg-gradient-end': '#F5F5F5',
    '--theme-text-primary': '#212121',
    '--theme-text-secondary': '#757575',
    '--theme-text-accent': '#000000',
    '--theme-primary-accent': '#212121',
    '--theme-primary-accent-text': '#FFFFFF',
    '--theme-card-bg': 'rgba(255, 255, 255, 0.8)',
    '--theme-card-bg-rgb': '255, 255, 255',
    '--theme-tab-bar-bg': '#FFFFFF',
    '--theme-border-color': 'rgba(0, 0, 0, 0.08)',
    '--theme-shadow-color-rgb': '0, 0, 0',
    '--theme-accent-hsl': '0, 0%, 0%',
    '--theme-danger-color': '#212121',
  },
  amoled: {
    '--theme-bg-gradient-start': '#0A0A0A',
    '--theme-bg-gradient-end': '#000000',
    '--theme-text-primary': '#D1D1D1',
    '--theme-text-secondary': '#8A8A8A',
    '--theme-text-accent': '#FFFFFF',
    '--theme-primary-accent': '#FFFFFF',
    '--theme-primary-accent-text': '#000000',
    '--theme-card-bg': 'rgba(18, 18, 18, 0.75)',
    '--theme-card-bg-rgb': '18, 18, 18',
    '--theme-tab-bar-bg': '#080808',
    '--theme-border-color': 'rgba(255, 255, 255, 0.15)',
    '--theme-shadow-color-rgb': '255, 255, 255',
    '--theme-accent-hsl': '0, 0%, 100%',
    '--theme-danger-color': '#D1D1D1',
  },
};

const MemoizedOtherTab = React.memo(OtherTab);

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('home');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [otherTabView, setOtherTabView] = useState<'menu' | string>('menu');
    
    const [theme, setTheme] = useLocalStorage<Theme>('appTheme', 'dark');
    const [profile, setProfile] = useLocalStorage<Profile>('profile', DEFAULT_PROFILE);
    const [settings, setSettings] = useLocalStorage<Settings>('settings', DEFAULT_SETTINGS);
    const [prayerTimesData, setPrayerTimesData] = useState<PrayerTimesData | null>(null);
    const [quranUserData, setQuranUserData] = useLocalStorage<QuranUserData>('quranUserData', {
        khatmah: { active: false, startDate: null, lastRead: null, targetDays: 30, history: [] },
        highlights: {},
    });

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
    const [selectedReciterId, setSelectedReciterId] = useLocalStorage<string>('selectedReciter', '7');

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
    
    // Effect for handling prayer notifications
    useEffect(() => {
        if (prayerTimesData) {
            schedulePrayerNotifications(prayerTimesData.timings, settings.prayerNotifications);
        }
        
        if (!settings.prayerNotifications.enabled) {
            cancelAllNotifications();
        }
    }, [prayerTimesData, settings.prayerNotifications]);


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
    
        if (audio && surah) {
            const playAudio = async () => {
                let audioSource = surah.audioUrl;
    
                console.log("Playing from network");
                
                if (audio.src !== audioSource) {
                    // Revoke old blob URL if it exists to prevent memory leaks
                    if (audio.src.startsWith('blob:')) {
                        URL.revokeObjectURL(audio.src);
                    }
                    if (audioSource) {
                        audio.src = audioSource;
                        audio.load();
                    }
                }
    
                if (isPlaying && audio.src) {
                    audio.play().catch(e => console.error("Autoplay failed", e));
                } else {
                    audio.pause();
                }
            };
    
            playAudio();
    
        } else if (audio && !isPlaying && !surah) {
            if (audio.src.startsWith('blob:')) {
                URL.revokeObjectURL(audio.src);
            }
            audio.pause();
            audio.src = '';
        }
    }, [audioPlayerState.surah, audioPlayerState.isPlaying]);


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
            if (audioRef.current.src.startsWith('blob:')) {
                URL.revokeObjectURL(audioRef.current.src);
            }
            audioRef.current.pause();
            audioRef.current.src = '';
        }
        setAudioPlayerState({ isVisible: false, surah: null, reciterName: '', isPlaying: false, currentTime: 0, duration: 0, isLoadingNextPrev: false, isRepeatOn: false });
    };
    
    const handleSetReciterName = useCallback((name: string) => {
        setAudioPlayerState(s => ({...s, reciterName: name}));
    }, []);

    const isFullScreenTab = activeTab === 'duas' || activeTab === 'other';
    const isPlayerUiHidden = activeTab === 'other' && otherTabView === 'menu';
    const showPlayer = audioPlayerState.isVisible && !isReaderOpen && !isPlayerUiHidden;

    const headerHeight = '4.5rem';
    const playerHeight = '5.5rem';
    const topOffset = `calc(${headerHeight} + env(safe-area-inset-top) + ${showPlayer ? playerHeight : '0px'})`;

    return (
        <>
            <audio ref={audioRef} />
            
            <header 
                className="fixed top-0 inset-x-0 z-40 h-[4.5rem] flex justify-between items-center p-4 bg-theme-primary/50 backdrop-blur-md border-b border-theme"
                style={{ paddingTop: 'env(safe-area-inset-top)' }}
            >
                <button onClick={() => setIsSettingsOpen(true)} className="button-luminous p-2.5 text-theme-secondary hover:text-theme-primary">
                    <SettingsIcon className="w-6 h-6 stroke-theme-accent" />
                </button>
                <h1 className="logo-main text-4xl">آجر</h1>
                <button onClick={() => setIsProfileOpen(true)} className="button-luminous w-11 h-11 p-0 flex items-center justify-center text-theme-secondary hover:text-theme-primary overflow-hidden">
                    {profile.avatarImage ? (
                        <img src={profile.avatarImage} className="w-full h-full object-cover" alt="Profile" />
                    ) : (
                        <ProfileIcon className="w-6 h-6 stroke-theme-accent" />
                    )}
                </button>
            </header>

            {showPlayer && (
                <FloatingAudioPlayer
                    playerState={audioPlayerState}
                    onClose={handleClosePlayer}
                    onTogglePlay={handleTogglePlay}
                    onSeek={handleSeek}
                    onNext={handleNextSurah}
                    onPrev={handlePrevSurah}
                    onReplay={handleReplay}
                    onToggleRepeat={handleToggleRepeat}
                />
            )}
            
            <div className="w-full h-[100dvh] flex flex-col" style={{ paddingTop: topOffset, transition: 'padding-top 0.4s cubic-bezier(0.25, 1, 0.5, 1)' }}>
                {isFullScreenTab ? (
                    <>
                        {activeTab === 'duas' && <DuasTab />}
                        {activeTab === 'other' && <MemoizedOtherTab 
                            onViewSet={setOtherTabView} 
                            profile={profile}
                        />}
                    </>
                ) : (
                    <Layout>
                        <div style={{ display: activeTab === 'home' ? 'flex' : 'none', flexGrow: 1, flexDirection: 'column' }}>
                            <HomeTab
                                settings={settings}
                                setSettings={setSettings}
                                onPrayerTimesLoaded={setPrayerTimesData}
                                profile={profile}
                            />
                        </div>
                        <div style={{ display: activeTab === 'quran' ? 'flex' : 'none', flexGrow: 1, flexDirection: 'column' }}>
                            <QuranTab 
                                settings={settings} 
                                setReciterName={handleSetReciterName}
                                selectedReciterId={selectedReciterId}
                                setSelectedReciterId={setSelectedReciterId}
                                onOpenReader={handleOpenReader}
                                userData={quranUserData}
                                setUserData={setQuranUserData}
                            />
                        </div>
                        <div style={{ display: activeTab === 'counter' ? 'flex' : 'none', flexGrow: 1, flexDirection: 'column' }}>
                            <CounterTab settings={settings} profile={profile} setProfile={setProfile} />
                        </div>
                    </Layout>
                )}
            </div>
            
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
                    setReciterName={handleSetReciterName}
                    onSwitchSurah={handleSwitchSurah}
                    playerState={audioPlayerState}
                    onClosePlayer={handleClosePlayer}
                    onTogglePlay={handleTogglePlay}
                    onSeek={handleSeek}
                    onNext={handleNextSurah}
                    onPrev={handlePrevSurah}
                    onReplay={handleReplay}
                    onToggleRepeat={handleToggleRepeat}
                    userData={quranUserData}
                    setUserData={setQuranUserData}
                />
            )}
            
            {isProfileOpen && (
                <ProfileTab
                    onClose={() => setIsProfileOpen(false)}
                    profile={profile}
                    setProfile={setProfile}
                    settings={settings}
                    userData={quranUserData}
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