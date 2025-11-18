
import React, { useState, useEffect } from 'react';
import { HISNUL_MUSLIM_DUAS } from '../../constants';
import type { DuaCategory, Dua } from '../../types';
import useLocalStorage from '../../hooks/useLocalStorage';
import DuaSequence from './DuaSequence';
import Modal from '../ui/Modal';
import { BookmarkIcon, CopyIcon, ChevronLeftIcon, CheckCircleIcon, TrashIcon, SaveIcon, PlusIcon } from '../icons/TabIcons';

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
    
    const featuredAdhkar = HISNUL_MUSLIM_DUAS.filter(c => FEATURED_ADHAKR_IDS.includes(c.ID));
    const otherCategories = HISNUL_MUSLIM_DUAS.filter(c => 
        !FEATURED_ADHAKR_IDS.includes(c.ID) &&
        (c.TITLE.toLowerCase().includes(searchQuery.toLowerCase()) || 
         c.duas.some(d => d.ARABIC_TEXT.includes(searchQuery)))
    );

    return (
        <div className="flex flex-col gap-6 p-4 pb-28" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}>
            <h2 className="text-3xl font-bold text-center heading-amiri">حصن المسلم</h2>

            {/* Featured Adhkar Carousel */}
            <div>
                <h3 className="font-bold text-xl mb-2 text-theme-accent heading-amiri">الأذكار اليومية</h3>
                <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4">
                    {featuredAdhkar.map((category, index) => (
                        <div key={category.ID} className="container-luminous flex-shrink-0 w-48 h-56 rounded-theme-card p-4 flex flex-col justify-between items-start text-right relative stagger-item" style={{ animationDelay: `${index * 70}ms` }}>
                             {completionStatus[category.ID] && (
                                <div className="absolute top-2 left-2 p-1 bg-green-500/20 rounded-theme-full">
                                    <CheckCircleIcon className="w-5 h-5 text-green-400"/>
                                </div>
                            )}
                            <div>
                                <p className="text-4xl">{category.icon}</p>
                                <h4 className="font-bold mt-2 text-theme-primary">{category.TITLE}</h4>
                            </div>
                            <button onClick={() => onStartSequence(category)} className="w-full text-sm font-semibold p-2 button-luminous bg-theme-accent-card text-theme-accent-primary rounded-lg">
                                ابدأ
                            </button>
                        </div>
                    ))}
                </div>
            </div>

             {/* My Duas Card */}
            <div className="grid grid-cols-1 gap-3">
                <button onClick={onMyDuasClick} className="p-4 container-luminous rounded-theme-card text-right flex items-center gap-4">
                     <div className="w-12 h-12 flex items-center justify-center container-luminous rounded-xl text-theme-accent-primary">
                        <BookmarkIcon className="w-7 h-7"/>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg">أدعيتي المحفوظة</h4>
                        <p className="text-sm text-theme-secondary">أدعيتك الخاصة في مكان واحد.</p>
                    </div>
                </button>
            </div>
            
            {/* All Categories List */}
            <div>
                <h3 className="font-bold text-xl mb-2 text-theme-accent heading-amiri">جميع الفئات</h3>
                 <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث في فئات الأدعية..."
                    className="w-full p-3 mb-3 input-luminous text-theme-primary rounded-theme-card text-right"
                />
                <div className="space-y-2 pr-2">
                    {otherCategories.map((category, index) => (
                        <button key={category.ID} onClick={() => onCategoryClick(category)} className="w-full p-3 container-luminous rounded-lg text-right font-semibold flex justify-between items-center stagger-item" style={{ animationDelay: `${index * 50}ms` }}>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{category.icon}</span>
                                <span>{category.TITLE}</span>
                            </div>
                            <ChevronLeftIcon className="w-5 h-5 text-theme-secondary" style={{ transform: 'scaleX(-1)' }}/>
                        </button>
                    ))}
                </div>
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
        <div className="flex flex-col gap-4 p-4 pb-28" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}>
            <header className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 text-theme-secondary hover:text-theme-primary"><ChevronLeftIcon className="w-7 h-7" style={{ transform: 'scaleX(-1)' }}/></button>
                <h2 className="text-2xl font-bold heading-amiri">أدعيتي المحفوظة</h2>
            </header>
            <div className="space-y-3 pr-2">
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-full p-4 container-luminous rounded-theme-card border-2 border-dashed border-theme-accent-faded flex flex-col items-center justify-center gap-2 text-theme-accent-primary hover:border-theme-accent-primary transition-all"
                >
                    <PlusIcon className="w-8 h-8"/>
                    <span className="font-bold">إضافة دعاء جديد</span>
                </button>

                {userDuas.length > 0 ? userDuas.map((dua, index) => (
                     <div key={dua.ID} className="p-4 container-luminous rounded-theme-card flex flex-col items-end gap-2 text-right stagger-item" style={{ animationDelay: `${index * 50}ms` }}>
                        <p className="font-amiri text-2xl leading-relaxed text-theme-primary">{dua.ARABIC_TEXT}</p>
                        {dua.LANGUAGE_ARABIC_TRANSLATED_TEXT && <p className="text-xs text-theme-secondary/70">{dua.LANGUAGE_ARABIC_TRANSLATED_TEXT}</p>}
                        <div className="self-start flex gap-2 pt-2">
                             <button onClick={() => navigator.clipboard.writeText(dua.ARABIC_TEXT)} className="p-2 button-luminous rounded-lg"><CopyIcon className="w-5 h-5"/></button>
                             <button onClick={() => handleDelete(dua.ID)} className="p-2 button-luminous text-red-400 rounded-lg"><TrashIcon className="w-5 h-5"/></button>
                        </div>
                    </div>
                )) : (
                     <div className="text-center text-theme-secondary/70 pt-8 flex flex-col items-center gap-4">
                        <BookmarkIcon className="w-16 h-16 opacity-30" />
                        <h3 className="text-xl font-bold text-theme-primary">لا توجد أدعية محفوظة</h3>
                        <p className="max-w-xs">انقر على زر الإضافة لبدء حفظ أدعيتك الخاصة والرجوع إليها في أي وقت.</p>
                    </div>
                )}
            </div>

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="إضافة دعاء جديد">
                <div className="flex flex-col gap-4 my-4">
                    <textarea 
                        value={newDuaText}
                        onChange={(e) => setNewDuaText(e.target.value)}
                        placeholder="اكتب دعاءك هنا..."
                        className="w-full h-40 p-3 input-luminous text-theme-primary rounded-theme-card text-right resize-none"
                    />
                    <button onClick={handleSave} className="w-full p-3 button-luminous bg-theme-accent-primary text-theme-accent-primary-text rounded-theme-full font-bold flex items-center justify-center gap-2">
                        <SaveIcon className="w-5 h-5" />
                        <span>حفظ الدعاء</span>
                    </button>
                </div>
            </Modal>
        </div>
    );
};


// --- Sub-component: Category Detail View ---
const DuaCategoryDetailView: React.FC<{
    category: DuaCategory;
    onBack: () => void;
}> = ({ category, onBack }) => (
    <div className="flex flex-col gap-4 p-4 pb-28" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}>
        <header className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 text-theme-secondary hover:text-theme-primary"><ChevronLeftIcon className="w-7 h-7" style={{ transform: 'scaleX(-1)' }} /></button>
            <h2 className="text-2xl font-bold heading-amiri">{category.icon} {category.TITLE}</h2>
        </header>
        <div className="space-y-3 pr-2">
            {category.duas.map((dua, index) => (
                <div key={dua.ID} className="p-4 container-luminous rounded-theme-card flex flex-col items-end gap-2 text-right stagger-item" style={{ animationDelay: `${index * 50}ms` }}>
                    <p className="font-amiri text-2xl leading-relaxed text-theme-primary">{dua.ARABIC_TEXT}</p>
                    {dua.TRANSLATED_TEXT && <p className="text-sm text-theme-secondary/70">{dua.TRANSLATED_TEXT}</p>}
                    <div className="self-start pt-2">
                        <button onClick={() => navigator.clipboard.writeText(dua.ARABIC_TEXT)} className="p-2 button-luminous rounded-lg"><CopyIcon className="w-5 h-5"/></button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);


export default DuasTab;
