
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { HISNUL_MUSLIM_DUAS } from '../../constants';
import type { DuaCategory, Dua } from '../../types';
import useLocalStorage from '../../hooks/useLocalStorage';
import DuaSequence from './DuaSequence';
import Modal from '../ui/Modal';
import { 
    BookmarkIcon, CopyIcon, ChevronLeftIcon, CheckCircleIcon, 
    TrashIcon, SaveIcon, PlusIcon, SearchIcon, ShareIcon 
} from '../icons/TabIcons';

// --- CONSTANTS & TYPES ---
const FEATURED_ADHAKR_IDS = [1001, 1002, 1003, 1004]; // Morning, Evening, Post-Prayer, Sleep
type View = 'main' | 'sequence' | 'my_duas' | 'category_detail';

// --- HOOK FOR COMPLETION STATUS ---
const useCompletionStatus = () => {
    const [status, setStatus] = useState<Record<number, boolean>>({});

    const refreshStatus = () => {
        const newStatus: Record<number, boolean> = {};
        const today = new Date().toDateString();
        FEATURED_ADHAKR_IDS.forEach(id => {
            const progress = localStorage.getItem(`duaSequenceProgress_${id}`);
            if (progress) {
                const { completed, completionDate } = JSON.parse(progress);
                if (completed && new Date(completionDate).toDateString() === today) {
                    newStatus[id] = true;
                }
            }
        });
        setStatus(newStatus);
    };

    useEffect(() => {
        refreshStatus();
    }, []);

    return { completionStatus: status, refreshCompletionStatus: refreshStatus };
};

// --- Main Dua Tab Component ---
const DuasTab: React.FC = () => {
    const [activeView, setActiveView] = useState<View>('main');
    const [previousView, setPreviousView] = useState<View>('main');
    const [activeSequence, setActiveSequence] = useState<DuaCategory | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<DuaCategory | null>(null);
    const [userDuas, setUserDuas] = useLocalStorage<Dua[]>('userDuas', []);
    const { completionStatus, refreshCompletionStatus } = useCompletionStatus();

    const changeView = (newView: View) => {
        setPreviousView(activeView);
        setActiveView(newView);
    };

    const handleStartSequence = (category: DuaCategory) => {
        setActiveSequence(category);
        changeView('sequence');
    };
    
    const handleCloseSequence = () => {
        setActiveSequence(null);
        changeView('main');
        refreshCompletionStatus();
    };
    
    const handleCategoryClick = (category: DuaCategory) => {
        setSelectedCategory(category);
        changeView('category_detail');
    };
    
    const renderViewContent = (view: View) => {
        switch (view) {
            case 'sequence':
                return activeSequence && <DuaSequence category={activeSequence} onClose={handleCloseSequence} />;
            case 'my_duas':
                return <MyDuasView onBack={() => changeView('main')} userDuas={userDuas} setUserDuas={setUserDuas} />;
            case 'category_detail':
                return selectedCategory && <DuaCategoryDetailView category={selectedCategory} onBack={() => changeView('main')} />;
            case 'main':
            default:
                return (
                    <MainDuaView
                        onStartSequence={handleStartSequence}
                        onCategoryClick={handleCategoryClick}
                        onMyDuasClick={() => changeView('my_duas')}
                        completionStatus={completionStatus}
                    />
                );
        }
    }

    return (
       <div className="view-container">
            <div 
                key={activeView} 
                className={`view-content ${activeView !== previousView ? 'view-enter' : ''}`}
            >
                {renderViewContent(activeView)}
            </div>
        </div>
    );
};

// --- Sub-component: Main View ---
const MainDuaView: React.FC<{
    onStartSequence: (category: DuaCategory) => void;
    onCategoryClick: (category: DuaCategory) => void;
    onMyDuasClick: () => void;
    completionStatus: Record<number, boolean>;
}> = ({ onStartSequence, onCategoryClick, onMyDuasClick, completionStatus }) => {
    
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (scrollRef.current) {
            setIsScrolled(scrollRef.current.scrollTop > 50);
        }
    };
    
    const featuredAdhkar = HISNUL_MUSLIM_DUAS.filter(c => FEATURED_ADHAKR_IDS.includes(c.ID));
    
    // Sort featured adhkar based on time of day logic for UX
    const sortedFeatured = useMemo(() => {
        const hour = new Date().getHours();
        const isMorning = hour >= 4 && hour < 12;
        const isEvening = hour >= 12 && hour < 20;
        // Reorder: if morning, put Morning Adhkar first, etc.
        return [...featuredAdhkar].sort((a, b) => {
            if (isMorning && a.ID === 1001) return -1;
            if (isEvening && a.ID === 1002) return -1;
            if (!isMorning && !isEvening && a.ID === 1004) return -1; // Sleep time
            return 0;
        });
    }, [featuredAdhkar]);

    const otherCategories = HISNUL_MUSLIM_DUAS.filter(c => 
        !FEATURED_ADHAKR_IDS.includes(c.ID) &&
        (c.TITLE.toLowerCase().includes(searchQuery.toLowerCase()) || 
         c.duas.some(d => d.ARABIC_TEXT.includes(searchQuery)))
    );

    // Greeting based on time
    const greeting = useMemo(() => {
        const hr = new Date().getHours();
        if (hr >= 5 && hr < 12) return { text: 'صباح الخير', sub: 'بداية مباركة بذكر الله', icon: '☀️' };
        if (hr >= 12 && hr < 17) return { text: 'طاب يومك', sub: 'لا تنس أذكار المساء', icon: '🌤️' };
        if (hr >= 17 && hr < 21) return { text: 'مساء الخير', sub: 'هدوء وسكينة مع الذكر', icon: '🌆' };
        return { text: 'تصبح على خير', sub: 'اختم يومك بذكر الله', icon: '🌙' };
    }, []);

    return (
        <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex flex-col gap-6 p-5 pb-44 h-full overflow-y-auto custom-scrollbar" 
            style={{ paddingTop: 'calc(2rem + env(safe-area-inset-top))' }}
        >
            
            {/* Header Section */}
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h1 className="text-3xl font-bold text-theme-primary heading-amiri mb-1">
                        {greeting.text}
                    </h1>
                    <p className="text-sm text-theme-secondary">{greeting.sub}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-theme-card/50 flex items-center justify-center text-2xl shadow-inner">
                    {greeting.icon}
                </div>
            </div>

            {/* Featured Adhkar (Horizontal Scroll) */}
            <div>
                <h3 className="font-bold text-lg mb-3 text-theme-primary heading-amiri px-1">الأذكار الأساسية</h3>
                <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide snap-x snap-mandatory">
                    {sortedFeatured.map((category, index) => {
                        const isCompleted = completionStatus[category.ID];
                        // Dynamic colors based on ID for visual distinction
                        let bgClass = "from-blue-500/20 to-purple-500/20"; // Default Evening
                        if (category.ID === 1001) bgClass = "from-orange-400/20 to-yellow-400/20"; // Morning
                        if (category.ID === 1004) bgClass = "from-indigo-900/40 to-slate-800/40"; // Sleep
                        if (category.ID === 1003) bgClass = "from-emerald-500/20 to-teal-500/20"; // Post Prayer

                        return (
                            <button 
                                key={category.ID} 
                                onClick={() => onStartSequence(category)}
                                className={`
                                    relative flex-shrink-0 w-36 h-48 rounded-[2rem] snap-center flex flex-col justify-between p-4 text-right overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-95
                                    bg-gradient-to-b ${bgClass} border border-white/5 backdrop-blur-sm group
                                `}
                            >
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative z-10 flex justify-between items-start">
                                    <span className="text-3xl drop-shadow-sm">{category.icon}</span>
                                    {isCompleted && <CheckCircleIcon className="w-5 h-5 text-green-400 drop-shadow-md" />}
                                </div>
                                <div className="relative z-10">
                                    <h4 className="font-bold text-theme-primary leading-tight mb-1">{category.TITLE}</h4>
                                    <p className="text-[10px] text-theme-primary/70">{category.duas.length} ذكر</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Search & Grid */}
            <div>
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={onMyDuasClick} 
                        className="col-span-2 p-4 container-luminous rounded-[1.5rem] flex items-center justify-between group hover:bg-theme-card/80 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-theme-accent-primary/10 flex items-center justify-center text-theme-accent-primary">
                                <BookmarkIcon className="w-5 h-5" />
                            </div>
                            <div className="text-right">
                                <h4 className="font-bold text-theme-primary">أدعيتي المحفوظة</h4>
                                <p className="text-xs text-theme-secondary">أدعيتك الخاصة</p>
                            </div>
                        </div>
                        <ChevronLeftIcon className="w-5 h-5 text-theme-secondary group-hover:-translate-x-1 transition-transform" style={{ transform: 'scaleX(-1)' }}/>
                    </button>

                    {otherCategories.map((category, index) => (
                        <button 
                            key={category.ID} 
                            onClick={() => onCategoryClick(category)} 
                            className="container-luminous p-4 rounded-[1.5rem] text-right flex flex-col items-start justify-between h-32 hover:-translate-y-1 transition-all duration-300 stagger-item"
                            style={{ animationDelay: `${index * 30}ms` }}
                        >
                            <span className="text-3xl mb-2 filter drop-shadow-sm">{category.icon}</span>
                            <div>
                                <h4 className="font-bold text-sm text-theme-primary line-clamp-2">{category.TITLE}</h4>
                                <p className="text-[10px] text-theme-secondary mt-1">{category.duas.length} دعاء</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Floating Search Button (Smart Scroll) */}
            <div 
                className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 z-30 transition-all duration-500 ease-out ${isSearchOpen ? 'w-[90%] max-w-md scale-100' : 'w-auto scale-100'}`}
            >
                <div className={`shadow-2xl shadow-black/40 ${isSearchOpen ? 'rounded-[2rem]' : 'rounded-full'}`}>
                    {isSearchOpen ? (
                        <div className="flex items-center bg-theme-card/95 backdrop-blur-xl border border-theme-accent-primary/20 rounded-[2rem] p-2 animate-in zoom-in-95 duration-300 ring-1 ring-theme-accent-primary/10">
                            <input 
                                type="search"
                                autoFocus
                                value={searchQuery} 
                                onChange={e => setSearchQuery(e.target.value)} 
                                placeholder="ابحث في الأدعية..." 
                                className="flex-grow h-12 px-4 bg-transparent text-theme-primary text-right outline-none placeholder:text-theme-secondary/50 text-base font-medium" 
                            />
                            <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className="w-10 h-10 rounded-full flex items-center justify-center bg-theme-tab-bar text-theme-secondary hover:text-theme-danger transition-colors">
                                ✕
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => setIsSearchOpen(true)} 
                            className={`
                                flex items-center justify-center bg-theme-card/80 backdrop-blur-xl border border-white/10 rounded-full text-theme-primary hover:bg-theme-card hover:border-theme-accent-primary/30 transition-all duration-500 ease-out hover:scale-105
                                ${isScrolled ? 'w-12 h-12' : 'px-6 py-3.5 gap-2'}
                            `}
                        >
                            <SearchIcon className="w-5 h-5" />
                            <span className={`text-sm font-bold whitespace-nowrap overflow-hidden transition-all duration-500 ${isScrolled ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                                بحث في الأدعية
                            </span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Sub-component: Category Detail View ---
const DuaCategoryDetailView: React.FC<{
    category: DuaCategory;
    onBack: () => void;
}> = ({ category, onBack }) => {
    
    const handleShare = (dua: Dua) => {
        if (navigator.share) {
            navigator.share({
                title: 'دعاء من تطبيق آجر',
                text: `${dua.ARABIC_TEXT}\n\n${dua.TRANSLATED_TEXT || ''}\n\nتم النسخ من تطبيق آجر`
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(dua.ARABIC_TEXT);
            alert('تم نسخ الدعاء');
        }
    };

    return (
        <div className="flex flex-col h-full bg-theme-primary">
            {/* Sticky Header */}
            <header className="sticky top-0 z-20 bg-theme-primary/95 backdrop-blur-md border-b border-white/5 pt-[env(safe-area-inset-top)]">
                <div className="flex items-center justify-between px-4 py-4">
                     <div className="w-10"></div> {/* Spacer for centering */}
                    <h2 className="text-xl font-bold heading-amiri flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.TITLE}</span>
                    </h2>
                    <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-theme-card/50 text-theme-secondary hover:text-theme-primary transition-colors">
                        <ChevronLeftIcon className="w-6 h-6 stroke-current" style={{ transform: 'scaleX(-1)' }} />
                    </button>
                </div>
            </header>

            <div className="flex-grow overflow-y-auto p-4 pb-44 space-y-4">
                {category.duas.map((dua, index) => (
                    <div 
                        key={dua.ID} 
                        className="container-luminous rounded-[2rem] p-6 text-right relative group stagger-item"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        {/* Dua Text */}
                        <p className="font-amiri text-2xl leading-[2.2] text-theme-primary mb-4">
                            {dua.ARABIC_TEXT}
                        </p>
                        
                        {/* Translation/Note */}
                        {dua.TRANSLATED_TEXT && (
                            <div className="bg-black/10 rounded-xl p-3 mb-4 border-r-2 border-theme-accent-primary/30">
                                <p className="text-sm text-theme-secondary/90 leading-relaxed">
                                    {dua.TRANSLATED_TEXT}
                                </p>
                            </div>
                        )}

                        {/* Footer Actions */}
                        <div className="flex justify-between items-center pt-2 border-t border-white/5">
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => { navigator.clipboard.writeText(dua.ARABIC_TEXT); }} 
                                    className="p-2 rounded-full hover:bg-white/10 text-theme-secondary hover:text-theme-primary transition-colors"
                                    title="نسخ"
                                >
                                    <CopyIcon className="w-5 h-5"/>
                                </button>
                                <button 
                                    onClick={() => handleShare(dua)}
                                    className="p-2 rounded-full hover:bg-white/10 text-theme-secondary hover:text-theme-primary transition-colors"
                                    title="مشاركة"
                                >
                                    <ShareIcon className="w-5 h-5"/>
                                </button>
                            </div>
                            
                            {dua.count && dua.count > 1 && (
                                <span className="text-xs font-bold bg-theme-accent-primary/10 text-theme-accent-primary px-3 py-1 rounded-full border border-theme-accent-primary/20">
                                    {dua.count} مرات
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Sub-component: My Duas View ---
const MyDuasView: React.FC<{
    onBack: () => void;
    userDuas: Dua[];
    setUserDuas: React.Dispatch<React.SetStateAction<Dua[]>>;
}> = ({ onBack, userDuas, setUserDuas }) => {
    
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newDuaText, setNewDuaText] = useState('');

    const handleDelete = (id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الدعاء؟')) {
            setUserDuas(userDuas.filter(d => d.ID !== id));
        }
    };

    const handleSave = () => {
        if (newDuaText.trim() === '') {
            alert('لا يمكن حفظ دعاء فارغ.');
            return;
        }
        const newDua: Dua = {
            ID: Date.now(),
            ARABIC_TEXT: newDuaText.trim(),
            LANGUAGE_ARABIC_TRANSLATED_TEXT: 'دعاء محفوظ',
        };
        setUserDuas([newDua, ...userDuas]);
        setNewDuaText('');
        setIsAddModalOpen(false);
    };

    return (
        <div className="flex flex-col h-full bg-theme-primary">
             <header className="sticky top-0 z-20 bg-theme-primary/95 backdrop-blur-md border-b border-white/5 pt-[env(safe-area-inset-top)]">
                <div className="flex items-center justify-between px-4 py-4">
                     <div className="w-10"></div>
                    <h2 className="text-xl font-bold heading-amiri">أدعيتي المحفوظة</h2>
                    <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-theme-card/50 text-theme-secondary hover:text-theme-primary transition-colors">
                        <ChevronLeftIcon className="w-6 h-6 stroke-current" style={{ transform: 'scaleX(-1)' }} />
                    </button>
                </div>
            </header>

            <div className="flex-grow overflow-y-auto p-4 pb-44 space-y-4">
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-full p-5 container-luminous rounded-[2rem] border-2 border-dashed border-theme-accent-primary/30 flex flex-col items-center justify-center gap-2 text-theme-accent-primary hover:bg-theme-accent-primary/5 hover:border-theme-accent-primary transition-all group"
                >
                    <div className="w-12 h-12 rounded-full bg-theme-accent-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <PlusIcon className="w-6 h-6"/>
                    </div>
                    <span className="font-bold text-sm">إضافة دعاء جديد</span>
                </button>

                {userDuas.length > 0 ? userDuas.map((dua, index) => (
                     <div key={dua.ID} className="container-luminous rounded-[2rem] p-6 flex flex-col items-end gap-4 text-right stagger-item" style={{ animationDelay: `${index * 50}ms` }}>
                        <p className="font-amiri text-xl leading-loose text-theme-primary">{dua.ARABIC_TEXT}</p>
                        <div className="w-full flex justify-between items-center pt-2 border-t border-white/5">
                             <div className="flex gap-2">
                                <button onClick={() => navigator.clipboard.writeText(dua.ARABIC_TEXT)} className="p-2 text-theme-secondary hover:text-theme-primary transition-colors"><CopyIcon className="w-5 h-5"/></button>
                                <button onClick={() => handleDelete(dua.ID)} className="p-2 text-red-400 hover:text-red-500 transition-colors"><TrashIcon className="w-5 h-5"/></button>
                             </div>
                             <span className="text-[10px] text-theme-secondary/50 font-mono">{new Date(dua.ID).toLocaleDateString('ar-EG')}</span>
                        </div>
                    </div>
                )) : (
                     <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                        <div className="w-20 h-20 bg-theme-card rounded-full flex items-center justify-center mb-4">
                            <BookmarkIcon className="w-8 h-8 text-theme-secondary" />
                        </div>
                        <h3 className="text-lg font-bold text-theme-primary">لا توجد أدعية محفوظة</h3>
                        <p className="text-sm text-theme-secondary mt-1 max-w-[200px]">اكتب أدعيتك الخاصة واحفظها هنا للرجوع إليها لاحقاً.</p>
                    </div>
                )}
            </div>

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="إضافة دعاء جديد">
                <div className="flex flex-col gap-4 my-4">
                    <textarea 
                        value={newDuaText}
                        onChange={(e) => setNewDuaText(e.target.value)}
                        placeholder="اكتب دعاءك هنا..."
                        className="w-full h-40 p-4 input-luminous text-theme-primary rounded-[1.5rem] text-right resize-none text-lg leading-relaxed"
                    />
                    <button onClick={handleSave} className="w-full p-4 button-luminous bg-theme-accent-primary text-theme-accent-primary-text rounded-[1.5rem] font-bold flex items-center justify-center gap-2 shadow-lg shadow-theme-accent-primary/20 hover:scale-[1.02] transition-transform">
                        <SaveIcon className="w-5 h-5" />
                        <span>حفظ الدعاء</span>
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default DuasTab;
