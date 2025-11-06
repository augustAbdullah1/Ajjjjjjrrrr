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
                className="container-luminous p-5 rounded-theme-container w-full max-w-sm text-center relative animate-in fade-in-0 slide-in-from-bottom-5"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-3 left-3 text-theme-secondary hover:text-theme-primary transition-colors w-8 h-8 rounded-theme-full button-luminous flex items-center justify-center"
                >
                    ✕
                </button>
                <h2 className="text-2xl font-bold mb-4 text-theme-accent heading-amiri">{title}</h2>
                {children}
            </div>
        </div>
    );
};

export default Modal;