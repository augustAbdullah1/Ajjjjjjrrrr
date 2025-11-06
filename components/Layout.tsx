import React from 'react';
import { SettingsIcon, ProfileIcon } from './icons/TabIcons';

interface LayoutProps {
    children: React.ReactNode;
    onOpenProfile: () => void;
    onOpenSettings: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onOpenProfile, onOpenSettings }) => {
    return (
        <div className="w-full h-[100dvh] flex flex-col flex-grow">
            <header className="flex-shrink-0 flex justify-between items-center p-4">
                 <button onClick={onOpenSettings} className="button-luminous p-2.5 text-theme-secondary hover:text-theme-primary">
                    <SettingsIcon className="w-6 h-6 stroke-theme-accent" />
                </button>
                <div className="flex items-center justify-center">
                    <h1 className="logo-main">آجر</h1>
                </div>
                <button onClick={onOpenProfile} className="button-luminous p-2.5 text-theme-secondary hover:text-theme-primary">
                    <ProfileIcon className="w-6 h-6 stroke-theme-accent" />
                </button>
            </header>
            <main className="flex-grow overflow-y-auto px-4 pb-40 flex flex-col">
                 {children}
            </main>
        </div>
    );
};

export default Layout;