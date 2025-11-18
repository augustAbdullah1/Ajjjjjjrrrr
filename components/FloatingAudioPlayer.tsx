
import React from 'react';
import type { AudioPlayerState } from '../types';
import { PlayFilledIcon, PauseFilledIcon, NextTrackIcon, PrevTrackIcon, ReciterIcon } from './icons/TabIcons';
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

const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const FloatingAudioPlayer: React.FC<FloatingAudioPlayerProps> = ({ 
    playerState, onClose, onTogglePlay, onSeek, onNext, onPrev
}) => {
    const isLoading = playerState.isLoadingNextPrev || (playerState.duration === 0 && playerState.isPlaying);
    const progressPercent = playerState.duration > 0 ? (playerState.currentTime / playerState.duration) * 100 : 0;
    
    // Position: Below header (4.5rem) + safe area + some margin
    const topPosition = `calc(4.5rem + env(safe-area-inset-top) + 0.75rem)`;

    return (
        <div 
            className="fixed inset-x-4 z-30 flex justify-center animate-slide-in-from-top pointer-events-none"
            style={{ top: topPosition }}
        >
            <div className="w-full max-w-md pointer-events-auto bg-theme-tab-bar/90 backdrop-blur-xl border border-theme-border-color shadow-xl rounded-2xl p-2 pr-3 flex items-center gap-3 relative overflow-hidden">
                
                {/* Play/Pause Button */}
                <button 
                    onClick={onTogglePlay} 
                    className="w-11 h-11 bg-theme-accent-primary text-theme-accent-primary-text rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 hover:scale-105 active:scale-95 transition-all"
                >
                    {isLoading ? <Spinner /> : (playerState.isPlaying ? <PauseFilledIcon className="w-5 h-5" /> : <PlayFilledIcon className="w-5 h-5 pl-0.5" />)}
                </button>

                {/* Info & Controls */}
                <div className="flex-1 min-w-0 flex flex-col justify-center text-right gap-0.5">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm text-theme-primary truncate leading-tight pl-2">
                            {playerState.surah?.name} <span className="text-xs font-normal text-theme-secondary opacity-80">({playerState.surah?.number})</span>
                        </h3>
                         <span className="text-[10px] font-mono text-theme-secondary/80 tabular-nums flex-shrink-0" dir="ltr">
                             {formatTime(playerState.currentTime)}
                        </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                         <p className="text-xs text-theme-secondary truncate max-w-[140px] flex items-center gap-1">
                            <span className="opacity-70"><ReciterIcon className="w-3 h-3"/></span>
                            <span className="truncate">{playerState.reciterName}</span>
                        </p>

                        <div className="flex items-center gap-3 pl-1">
                            <button onClick={onNext} disabled={!playerState.surah || playerState.surah.number >= 114} className="text-theme-primary hover:text-theme-accent-primary disabled:opacity-30 transition-colors"><NextTrackIcon className="w-4 h-4"/></button>
                            <button onClick={onPrev} disabled={!playerState.surah || playerState.surah.number <= 1} className="text-theme-primary hover:text-theme-accent-primary disabled:opacity-30 transition-colors"><PrevTrackIcon className="w-4 h-4"/></button>
                        </div>
                    </div>
                </div>

                 {/* Separator & Close */}
                 <div className="h-8 w-px bg-theme-border-color/40 mx-1"></div>
                 <button 
                    onClick={onClose} 
                    className="w-8 h-8 flex items-center justify-center text-theme-secondary hover:text-theme-danger hover:bg-theme-danger/10 rounded-lg transition-colors flex-shrink-0"
                >
                    <span className="text-xl font-light leading-none">&times;</span>
                </button>

                {/* Progress Bar (Bottom Line) */}
                <div 
                    className="absolute bottom-0 left-0 right-0 h-1 bg-theme-border-color/20 cursor-pointer group"
                    onClick={(e) => {
                         const rect = e.currentTarget.getBoundingClientRect();
                         // Force LTR calculation for progress bar logic
                         const x = e.clientX - rect.left; 
                         const ratio = x / rect.width;
                         onSeek(playerState.duration * ratio);
                    }}
                >
                    <div 
                        className="h-full bg-theme-accent-primary transition-all duration-100 ease-linear origin-left group-hover:h-1.5"
                        style={{ width: `${progressPercent}%` }}
                    />
                    {/* Hit area extension */}
                    <div className="absolute bottom-0 left-0 right-0 h-3 -mb-1"></div>
                </div>

            </div>
        </div>
    );
};

export default FloatingAudioPlayer;
