import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <main className="flex-grow overflow-y-auto px-4 pb-40 flex flex-col">
             {children}
        </main>
    );
};

export default Layout;