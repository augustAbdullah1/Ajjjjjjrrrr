
import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="w-full max-w-md bg-theme-card backdrop-blur-2xl border-2 border-theme rounded-3xl p-5 shadow-2xl flex flex-col gap-4 my-auto relative">
            <div className="header flex justify-between items-center mb-1">
                <h1 className="font-black text-3xl text-theme-accent">آجر</h1>
            </div>
            {children}
        </div>
    );
};

export default Layout;
