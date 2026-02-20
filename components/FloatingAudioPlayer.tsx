
import React from 'react';
import type { AudioPlayerState } from '../types';
import { PlayFilledIcon, PauseFilledIcon } from './icons/TabIcons';
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
    onPlayerClick: () => void;
}

const FloatingAudioPlayer: React.FC<FloatingAudioPlayerProps> = ({ 
    playerState, onTogglePlay, onPlayerClick
}) => {
    const isLoading = playerState.isLoadingNextPrev || (playerState.duration === 0 && playerState.isPlaying);

    return (
        <>
            {/* --- MINI PLAYER (Dynamic Top Capsule) --- */}
            {/* Replaces the Logo area when active */}
            <div 
                className="fixed z-[60] top-[calc(env(safe-area-inset-top)+1.2rem)] left-1/2 -translate-x-1/2 transition-all duration-500"
                style={{ width: 'auto', maxWidth: 'calc(100% - 130px)' }} 
            >
                <div 
                    className="bg-[#121212] border border-[#D4AF37]/30 rounded-full pl-1 pr-4 py-1 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center justify-between cursor-pointer group relative overflow-hidden mx-auto h-12 min-w-[180px]"
                    onClick={onPlayerClick}
                >
                    {/* Animated Glow Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>

                    {/* Left: Spinning Vinyl (Small) */}
                    <div className="flex items-center gap-3 flex-grow overflow-hidden">
                        <div className={`relative w-9 h-9 rounded-full bg-black border border-white/10 flex-shrink-0 flex items-center justify-center shadow-lg overflow-hidden ${playerState.isPlaying ? 'animate-spin-slow' : ''}`} style={{ animationDuration: '4s' }}>
                            <div className="absolute inset-0 bg-[#1a1a1a]"></div>
                            {/* Tiny Art */}
                            <div className="w-3 h-3 bg-[#D4AF37] rounded-full border border-black z-10"></div>
                        </div>

                        {/* Text Info */}
                        <div className="flex flex-col min-w-0 justify-center text-right pr-1">
                            <div className="flex items-center gap-1">
                                {/* Equalizer Bars Animation */}
                                {playerState.isPlaying && (
                                    <div className="flex items-end gap-[1px] h-3 ml-1">
                                        <div className="w-[2px] bg-[#D4AF37] animate-[pulse_0.6s_ease-in-out_infinite] h-[40%]"></div>
                                        <div className="w-[2px] bg-[#D4AF37] animate-[pulse_0.8s_ease-in-out_infinite] h-[80%]"></div>
                                        <div className="w-[2px] bg-[#D4AF37] animate-[pulse_0.5s_ease-in-out_infinite] h-[50%]"></div>
                                    </div>
                                )}
                                <h3 className="text-xs font-bold text-[#D4AF37] truncate leading-tight font-amiri max-w-[100px]">
                                    {playerState.surah?.nameSimple || '...'}
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Right: Mini Controls */}
                    <div className="flex items-center gap-2 flex-shrink-0 border-r border-white/10 pr-2 mr-1 h-full">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onTogglePlay(); }}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:text-[#D4AF37] transition-colors"
                        >
                            {isLoading ? (
                                <div className="scale-50"><Spinner /></div>
                            ) : playerState.isPlaying ? (
                                <PauseFilledIcon className="w-4 h-4" />
                            ) : (
                                <PlayFilledIcon className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FloatingAudioPlayer;
