import React, { useState, useCallback } from 'react';
import TabBar from './components/TabBar';
import CounterTab from './components/tabs/CounterTab';
import DuasTab from './components/tabs/DuasTab';
import QuranTab from './components/tabs/QuranTab';
import HomeTab from './components/tabs/PrayerTab';
import ProfileTab from './components/tabs/ProfileTab';
import SettingsTab from './components/tabs/SettingsTab';
import OtherTab from './components/tabs/OtherTab';
import QuranReader from './components/tabs/QuranReader';
import type { Tab, Theme, Profile, Settings, Surah, AudioPlayerState, QuranUserData } from './types';
import { DEFAULT_PROFILE, DEFAULT_SETTINGS } from './constants';
import useLocalStorage from './hooks/useLocalStorage';
import FloatingAudioPlayer from './components/FloatingAudioPlayer';
import { ProfileIconFilled, SettingsIconFilled } from './components/icons/TabIcons';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('home');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [theme, setTheme] = useLocalStorage<Theme>('appTheme', 'dark');
    const [profile, setProfile] = useLocalStorage<Profile>('profile', DEFAULT_PROFILE);
    const [settings, setSettings] = useLocalStorage<Settings>('settings', DEFAULT_SETTINGS);
    const [quranUserData, setQuranUserData] = useLocalStorage<QuranUserData>('quranUserData', {
        khatmah: { active: false, startDate: null, lastRead: null, targetDays: 30, history: [] },
        highlights: {},
    });

    const [audioPlayerState, setAudioPlayerState] = useState<AudioPlayerState>({
        isVisible: false, surah: null, reciterName: '', isPlaying: false, currentTime: 0, duration: 0, isRepeatOn: false
    });

    const [isReaderOpen, setIsReaderOpen] = useState(false);
    const [readerSurahInfo, setReaderSurahInfo] = useState<{ number: number; startAtAyah: number | null } | null>(null);

    const handleOpenReader = useCallback((surahNumber: number, startAtAyah: number | null) => {
        setReaderSurahInfo({ number: surahNumber, startAtAyah });
        setIsReaderOpen(true);
    }, []);

    return (
        <div className={`min-h-screen bg-[#111827] flex flex-col relative ${theme}`}>
            {/* Standard Header */}
            {activeTab !== 'counter' && !isReaderOpen && (
                <header className="fixed top-0 inset-x-0 h-16 flex items-center justify-between px-4 z-40 bg-[#111827]/95 backdrop-blur border-b border-gray-800">
                    <button onClick={() => setIsSettingsOpen(true)} className="p-2 text-gray-400 hover:text-white">
                        <SettingsIconFilled className="w-6 h-6" />
                    </button>
                    <h1 className="font-amiri text-2xl font-bold text-[#D4AF37]">آجر</h1>
                    <button onClick={() => setIsProfileOpen(true)} className="p-2 text-gray-400 hover:text-white">
                        <ProfileIconFilled className="w-6 h-6" />
                    </button>
                </header>
            )}

            {/* Main Viewport */}
            <main className={`flex-grow overflow-y-auto ${activeTab === 'counter' ? '' : 'pt-16'} pb-24`}>
                {activeTab === 'home' && <HomeTab settings={settings} setSettings={setSettings} onPrayerTimesLoaded={() => {}} profile={profile} />}
                {activeTab === 'duas' && <DuasTab />}
                {activeTab === 'quran' && <QuranTab settings={settings} setReciterName={() => {}} selectedReciterId="7" setSelectedReciterId={() => {}} onOpenReader={handleOpenReader} userData={quranUserData} setUserData={setQuranUserData} />}
                {activeTab === 'counter' && <CounterTab settings={settings} profile={profile} setProfile={setProfile} />}
                {activeTab === 'other' && <OtherTab onViewSet={() => {}} profile={profile} />}
            </main>

            {!isReaderOpen && <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />}

            {/* Overlays */}
            {audioPlayerState.isVisible && (
                <FloatingAudioPlayer playerState={audioPlayerState} onClose={() => {}} onTogglePlay={() => {}} onSeek={() => {}} onNext={() => {}} onPrev={() => {}} onReplay={() => {}} onToggleRepeat={() => {}} onPlayerClick={() => {}} />
            )}

            {isReaderOpen && readerSurahInfo && (
                <QuranReader
                    surahNumber={readerSurahInfo.number} startAtAyah={readerSurahInfo.startAtAyah}
                    onClose={() => setIsReaderOpen(false)} settings={settings} reciterId="https://server7.mp3quran.net/basit/Almusshaf-Al-Mojawwad/"
                    playerState={audioPlayerState} userData={quranUserData} setUserData={setQuranUserData}
                    onPlay={(s) => setAudioPlayerState(p => ({ ...p, surah: s, isVisible: true, isPlaying: true }))}
                    setSelectedReciterId={() => {}} setReciterName={() => {}}
                />
            )}

            {isProfileOpen && <ProfileTab onClose={() => setIsProfileOpen(false)} profile={profile} />}
            {isSettingsOpen && <SettingsTab onClose={() => setIsSettingsOpen(false)} theme={theme} setTheme={setTheme} settings={settings} setSettings={setSettings} profile={profile} setProfile={setProfile} />}
        </div>
    );
};

export default App;