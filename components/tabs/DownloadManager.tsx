
import React, { useState, useEffect, useCallback } from 'react';
import { saveAudio, deleteAudio, getDownloadedIds, getAudio } from '../../services/downloadService';
import { searchYouTube, downloadYouTubeAudio, YouTubeSearchResult } from '../../services/youtubeService';
import type { SurahSummary, Surah, DownloadedSurah, PopularReciter } from '../../types';
import { POPULAR_RECITERS_YOUTUBE } from '../../constants';
import { QURAN_SURAH_LIST } from '../../data/surah-list';
import { ChevronLeftIcon, DownloadIcon, TrashIcon, PlayFilledIcon, SaveIcon, PlusIcon, YouTubeIcon } from '../icons/TabIcons';
import Spinner from '../ui/Spinner';

interface AudioLibraryProps {
    onBack?: () => void;
    onPlaySurah: (surah: Surah) => void;
    setReciterName: (name: string) => void;
}

const DownloadManager: React.FC<AudioLibraryProps> = ({ onBack, onPlaySurah, setReciterName }) => {
    const [view, setView] = useState<'main' | 'reciters' | 'surahs' | 'videos'>('main');
    const [downloadedSurahs, setDownloadedSurahs] = useState<DownloadedSurah[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentReciter, setCurrentReciter] = useState<PopularReciter | null>(null);
    const [currentSurah, setCurrentSurah] = useState<SurahSummary | null>(null);
    const [videoResults, setVideoResults] = useState<YouTubeSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);
    const [isPlaybackLoadingId, setIsPlaybackLoadingId] = useState<string | null>(null);

    const refreshDownloads = useCallback(async () => {
        setIsLoading(true);
        const ids = await getDownloadedIds();
        const surahsPromises = ids.map(id => getAudio(id));
        const surahs = (await Promise.all(surahsPromises)).filter(Boolean) as DownloadedSurah[];
        surahs.sort((a, b) => a.surahNumber - b.surahNumber);
        setDownloadedSurahs(surahs);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (view === 'main') {
            refreshDownloads();
        }
    }, [view, refreshDownloads]);
    
    const handlePlay = async (surah: DownloadedSurah) => {
        setIsPlaybackLoadingId(surah.id);
        try {
            const downloadedFile = await getAudio(surah.id);
            if (downloadedFile?.audioBlob) {
                const audioUrl = URL.createObjectURL(downloadedFile.audioBlob);
                const surahInfo = QURAN_SURAH_LIST.find(s => s.number === surah.surahNumber);
                if (surahInfo) {
                    const surahToPlay: Surah = { ...surahInfo, ayahs: [], audioUrl };
                    setReciterName(surah.reciterName);
                    onPlaySurah(surahToPlay);
                }
            } else {
                alert('لم يتم العثور على الملف الصوتي المحمل.');
            }
        } catch (e) {
            console.error("Playback from download failed", e);
            alert('تعذر تشغيل السورة المحملة.');
        } finally {
            setIsPlaybackLoadingId(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الملف الصوتي؟')) {
            await deleteAudio(id);
            refreshDownloads();
        }
    };

    const handleSaveToDevice = async (surah: DownloadedSurah) => {
        const file = await getAudio(surah.id);
        if (file?.audioBlob) {
            const url = URL.createObjectURL(file.audioBlob);
            const a = document.createElement('a');
            a.href = url;
            const fileName = `${surah.reciterName} - ${surah.surahNumber.toString().padStart(3, '0')} ${surah.surahName}.mp3`;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            alert('لم يتم العثور على الملف الصوتي. حاول تحميله مرة أخرى.');
        }
    };

    const handleSelectReciter = (reciter: PopularReciter) => {
        setCurrentReciter(reciter);
        setView('surahs');
    };

    const handleSelectSurah = async (surah: SurahSummary) => {
        if (!currentReciter) return;
        setCurrentSurah(surah);
        setView('videos');
        setIsSearching(true);
        setVideoResults([]);
        const query = `${currentReciter.name} سورة ${surah.nameSimple}`;
        const results = await searchYouTube(query);
        setVideoResults(results);
        setIsSearching(false);
    };

    const handleDownloadVideo = async (video: YouTubeSearchResult) => {
        if (!currentReciter || !currentSurah) return;

        const id = `yt-${video.videoId}`;
        setDownloadingId(id);
        try {
            const audioBlob = await downloadYouTubeAudio(video.videoId);
            await saveAudio({
                id: id,
                reciterId: currentReciter.youtubeQuery,
                surahNumber: currentSurah.number,
                reciterName: video.author,
                surahName: currentSurah.name,
            }, audioBlob);
            alert(`تم تحميل "${video.title}" بنجاح!`);
            refreshDownloads();
        } catch (error) {
            console.error(error);
            alert('فشل التحميل. قد تكون هناك مشكلة في المصدر. يرجى المحاولة مرة أخرى.');
        } finally {
            setDownloadingId(null);
            setView('surahs');
        }
    };

    const handleBack = () => {
        if (view === 'videos') setView('surahs');
        else if (view === 'surahs') setView('reciters');
        else if (view === 'reciters') setView('main');
        else if (onBack) onBack();
    };

    const getTitle = () => {
        switch (view) {
            case 'reciters': return 'اختر القارئ';
            case 'surahs': return currentReciter?.name || 'اختر السورة';
            case 'videos': return `نتائج البحث`;
            case 'main': default: return 'المكتبة الصوتية';
        }
    };

    const renderContent = () => {
        if (isLoading && view === 'main') {
            return <div className="flex-grow flex justify-center items-center"><Spinner /></div>;
        }

        switch (view) {
            case 'reciters':
                return POPULAR_RECITERS_YOUTUBE.map((reciter, index) => (
                    <button key={reciter.youtubeQuery} onClick={() => handleSelectReciter(reciter)} className="w-full p-4 container-luminous rounded-lg text-right font-semibold flex items-center gap-4 stagger-item" style={{ animationDelay: `${index * 30}ms` }}>
                        <img src={reciter.imageUrl} alt={reciter.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div><p>{reciter.name}</p><p className="text-xs text-theme-secondary font-normal">{reciter.style}</p></div>
                    </button>
                ));
            case 'surahs':
                return QURAN_SURAH_LIST.map((surah, index) => (
                    <button key={surah.number} onClick={() => handleSelectSurah(surah)} className="w-full p-3 container-luminous rounded-lg flex justify-between items-center text-right stagger-item" style={{ animationDelay: `${index * 20}ms` }}>
                        <div><p className="font-semibold">{surah.number}. {surah.englishName}</p><p className="font-amiri text-xl text-theme-accent">{surah.name}</p></div>
                        <ChevronLeftIcon className="w-5 h-5 text-theme-secondary" style={{ transform: 'scaleX(-1)' }} />
                    </button>
                ));
            case 'videos':
                if (isSearching) return <div className="flex-grow flex justify-center items-center"><Spinner /></div>;
                return videoResults.map(video => (
                    <div key={video.videoId} className="w-full p-3 container-luminous rounded-lg flex items-center text-right gap-3">
                        <img src={video.videoThumbnails[0].url} alt={video.title} className="w-24 h-16 rounded-md object-cover flex-shrink-0" />
                        <div className="flex-grow overflow-hidden">
                            <p className="font-semibold truncate text-sm">{video.title}</p>
                            <p className="text-xs text-theme-secondary">{video.author}</p>
                        </div>
                        <button onClick={() => handleDownloadVideo(video)} disabled={downloadingId === `yt-${video.videoId}`} className="p-2 button-luminous rounded-lg text-theme-accent-primary disabled:opacity-50">
                            {downloadingId === `yt-${video.videoId}` ? <Spinner /> : <DownloadIcon className="w-6 h-6"/>}
                        </button>
                    </div>
                ));
            case 'main':
            default:
                return (
                    <>
                        <button onClick={() => setView('reciters')} className="w-full p-4 mb-4 container-luminous rounded-theme-card border-2 border-dashed border-theme-accent-faded flex flex-col items-center justify-center gap-2 text-theme-accent-primary hover:border-theme-accent-primary transition-all">
                            <PlusIcon className="w-8 h-8"/><span className="font-bold">تحميل تلاوة جديدة</span>
                        </button>
                        {downloadedSurahs.length > 0 ? downloadedSurahs.map(surah => (
                            <div key={surah.id} className="w-full p-3 container-luminous rounded-lg flex justify-between items-center text-right">
                                <div><p className="font-semibold">{surah.surahNumber}. {surah.surahName}</p><p className="text-xs text-theme-secondary">{surah.reciterName}</p></div>
                                <div className="flex items-center gap-1">
                                    {isPlaybackLoadingId === surah.id ? <Spinner /> : <button onClick={() => handlePlay(surah)} className="p-2 text-green-400 hover:text-green-500"><PlayFilledIcon className="w-6 h-6"/></button>}
                                    <button onClick={() => handleSaveToDevice(surah)} className="p-2 text-theme-secondary hover:text-theme-primary" title="حفظ على الجهاز"><SaveIcon className="w-5 h-5"/></button>
                                    <button onClick={() => handleDelete(surah.id)} className="p-2 text-red-400 hover:text-red-500"><TrashIcon className="w-5 h-5"/></button>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center text-theme-secondary/70 pt-8 flex flex-col items-center gap-4">
                                <DownloadIcon className="w-16 h-16 opacity-30" />
                                <h3 className="text-xl font-bold text-theme-primary">المكتبة الصوتية فارغة</h3>
                                <p className="max-w-xs">ابدأ بتحميل تلاواتك المفضلة للاستماع إليها بدون انترنت.</p>
                            </div>
                        )}
                    </>
                );
        }
    };

    return (
        <div className="flex flex-col gap-4 h-full p-4 pb-28 animate-in fade-in-0" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}>
            <header className="flex items-center gap-4 flex-shrink-0">
                <button onClick={handleBack} className="p-2 text-theme-secondary hover:text-theme-primary"><ChevronLeftIcon className="w-7 h-7" style={{ transform: 'scaleX(-1)' }}/></button>
                <h2 className="text-2xl font-bold heading-amiri">{getTitle()}</h2>
            </header>
            <div className="space-y-2 pr-2 flex-grow overflow-y-auto">
                {renderContent()}
            </div>
        </div>
    );
};

export default DownloadManager;