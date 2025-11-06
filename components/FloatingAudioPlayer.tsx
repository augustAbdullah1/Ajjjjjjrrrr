import React from 'react';
import type { AudioPlayerState } from '../types';
import { PlayFilledIcon, PauseFilledIcon, NextTrackIcon, PrevTrackIcon, ReplayIcon, RepeatIcon } from './icons/TabIcons';
import Spinner from './ui/Spinner';

interface FloatingAudioPlayerProps {
    playerState: AudioPlayerState;
    onClose: () => void;
    onTogglePlay: () => void;
    onSeek: (time: number) => void;
    onNext: () => void;
    onPrev: () => void;
    onReplay: () => void;
    onToggleRepeat: () => void;
}

const FloatingAudioPlayer: React.FC<FloatingAudioPlayerProps> = ({ playerState, onClose, onTogglePlay, onSeek, onNext, onPrev, onReplay, onToggleRepeat }) => {

    const isLoading = playerState.isLoadingNextPrev || (playerState.duration === 0 && playerState.isPlaying);
    const progressPercent = playerState.duration > 0 ? (playerState.currentTime / playerState.duration) * 100 : 0;
    
    return (
        <div className="fixed bottom-4 inset-x-0 z-[105] flex justify-center pointer-events-none animate-in slide-in-from-bottom-5">
            <div className="w-[95%] max-w-sm bg-theme-tab-bar backdrop-blur-2xl rounded-theme-container border border-theme pointer-events-auto shadow-2xl p-3 flex flex-col gap-2">
                <div
                    className="w-full h-4 -my-1 flex items-center cursor-pointer"
                    onClick={(e) => {
                        if (playerState.duration > 0) {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const isRtl = document.documentElement.dir === 'rtl';
                            const clickX = isRtl ? rect.right - e.clientX : e.clientX - rect.left;
                            const width = rect.width;
                            const seekTime = (clickX / width) * playerState.duration;
                            onSeek(seekTime);
                        }
                    }}
                >
                    <div className="w-full bg-black/20 rounded-full h-1.5 relative">
                        <div className="bg-theme-accent-primary h-1.5 rounded-full" style={{ width: `${progressPercent}%` }} />
                        <div
                            className="absolute top-1/2 w-3 h-3 bg-white rounded-full shadow"
                            style={{ left: `${progressPercent}%`, transform: 'translate(-50%, -50%)' }}
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex-1 overflow-hidden">
                        <p className="font-bold text-base text-theme-primary truncate">{playerState.surah?.name || '...'}</p>
                        <p className="text-xs text-theme-secondary truncate">{playerState.reciterName}</p>
                    </div>

                    <div className="flex items-center gap-1 text-theme-primary">
                         <button onClick={onReplay} className="p-2 disabled:opacity-50" disabled={!playerState.surah}>
                            <ReplayIcon className="w-5 h-5" />
                        </button>
                        <button onClick={onPrev} className="p-2 disabled:opacity-50" disabled={!playerState.surah || playerState.surah.number <= 1}>
                            <PrevTrackIcon className="w-6 h-6" />
                        </button>
                        <button onClick={onTogglePlay} className="w-12 h-12 bg-theme-accent-primary rounded-theme-full flex items-center justify-center text-theme-accent-primary-text">
                            {isLoading ? <Spinner /> : (playerState.isPlaying ? <PauseFilledIcon className="w-7 h-7" /> : <PlayFilledIcon className="w-7 h-7 pl-1" />)}
                        </button>
                         <button onClick={onNext} className="p-2 disabled:opacity-50" disabled={!playerState.surah || playerState.surah.number >= 114}>
                            <NextTrackIcon className="w-6 h-6" />
                        </button>
                        <button 
                            onClick={onToggleRepeat} 
                            className={`p-2 transition-colors ${playerState.isRepeatOn ? 'text-theme-accent-primary' : 'text-theme-primary'}`} 
                            disabled={!playerState.surah}
                            title="تكرار السورة"
                        >
                            <RepeatIcon className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="flex-1 flex justify-end">
                        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-xl text-theme-secondary hover:text-theme-primary">&times;</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FloatingAudioPlayer;