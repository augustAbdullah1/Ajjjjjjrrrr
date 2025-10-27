
import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex justify-center items-center p-4 transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-theme-secondary p-5 rounded-2xl w-full max-w-sm text-center shadow-xl border border-theme relative animate-in fade-in-0 slide-in-from-bottom-5"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-3 left-3 text-theme-text/70 hover:text-theme-text transition-colors w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                >
                    ✕
                </button>
                <h2 className="text-xl font-bold mb-4 text-theme-accent">{title}</h2>
                {children}
            </div>
        </div>
    );
};

export default Modal;
