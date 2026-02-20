
import React, { useState } from 'react';
import SunnahGuideTab from './SunnahSearchTab';
import Spinner from '../ui/Spinner';
import AsmaulHusnaTab from './AsmaulHusnaTab';
import PrayerTrackerTab from './PrayerTrackerTab';
import type { Profile } from '../../types';
import { 
    StarIcon, ListIcon, SearchIcon, MapPinIcon, 
    ChevronLeftIcon, WorshipIcon, CopyIcon, TrophyIcon
} from '../icons/TabIcons';

type View = 'menu' | 'sunnahGuide' | 'sunnahSearch' | 'asmaulHusna' | 'istikharah' | 'prayerTracker';

interface OtherTabProps {
    onViewSet: (view: View | 'menu') => void;
    profile: Profile;
}

// --- SUB-COMPONENTS ---

const SunnahSearch: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [query, setQuery] = useState('');
    const handleSearch = () => {
        if (query.trim()) {
            const url = `https://www.dorar.net/hadith/search?q=${encodeURIComponent(query)}`;
            window.open(url, '_blank');
        }
    };
    
    return (
        <div className="flex flex-col h-full p-4 pb-48 animate-in slide-in-from-bottom-5 fade-in duration-500 relative">
             {/* Floating Back Button */}
             <button 
                onClick={onBack} 
                className="fixed top-[calc(env(safe-area-inset-top)+1rem)] left-4 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-theme-card/50 text-theme-secondary hover:text-theme-primary transition-colors border border-white/10 active:scale-95 backdrop-blur-md shadow-lg"
            >
                <ChevronLeftIcon className="w-6 h-6 stroke-current" style={{ transform: 'scaleX(-1)' }} />
            </button>

            <header className="mb-8 mt-20 px-2 text-center">
                <h2 className="text-3xl font-bold heading-amiri text-theme-primary">البحث في الحديث</h2>
                <p className="text-sm text-theme-secondary mt-2">تأكد من صحة الأحاديث عبر الدرر السنية</p>
            </header>

             <div className="flex-grow flex flex-col items-center justify-start pt-10">
                <div className="w-24 h-24 bg-theme-accent-primary/10 rounded-[2rem] flex items-center justify-center mb-8 shadow-[0_0_40px_-10px_rgba(var(--theme-shadow-color-rgb),0.3)]">
                    <SearchIcon className="w-12 h-12 text-theme-accent-primary"/>
                </div>
                
                <div className="w-full max-w-sm flex flex-col gap-4 mb-8">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-theme-accent-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <input
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="اكتب جزءاً من الحديث..."
                            className="relative z-10 w-full p-4 pr-12 input-luminous text-theme-primary rounded-[1.5rem] text-right shadow-lg focus:ring-2 focus:ring-theme-accent-primary/50 transition-all"
                            autoFocus
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-theme-secondary">
                            <SearchIcon className="w-5 h-5" />
                        </div>
                    </div>
                    <button onClick={handleSearch} className="w-full py-4 button-luminous bg-theme-accent-primary text-theme-accent-primary-text rounded-[1.5rem] font-bold shadow-lg hover:scale-[1.02] transition-transform">
                        بحث في الدرر السنية
                    </button>
                </div>
            </div>
        </div>
    );
};

const IstikharahGuideTab: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const duaText = "اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلاَ أَقْدِرُ، وَتَعْلَمُ وَلاَ أَعْلَمُ، وَأَنْتَ عَلاَّمُ الْغُيُوبِ. اللَّهُمَّ إِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الأَمْرَ - ويسمي حاجته - خَيْرٌ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاقْدُرْهُ لِي وَيَسِّرْهُ لِي، ثُمَّ بَارِكْ لِي فِيهِ، وَإِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الأَمْرَ شَرٌّ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاصْرِفْهُ عَنِّي وَاصْرِفْنِي عَنْهُ، وَاقْدُرْ لِي الْخَيْرَ حَيْثُ كَانَ، ثُمَّ أَرْضِنِي بِهِ.";

    const copyDua = () => {
        navigator.clipboard.writeText(duaText);
        alert('تم نسخ الدعاء');
    };

    return (
        <div className="flex flex-col h-full bg-theme-primary relative">
             {/* Floating Back Button */}
             <button 
                onClick={onBack} 
                className="fixed top-[calc(env(safe-area-inset-top)+1rem)] left-4 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-theme-card/50 text-theme-secondary hover:text-theme-primary transition-colors border border-white/10 active:scale-95 backdrop-blur-md shadow-lg"
            >
                <ChevronLeftIcon className="w-6 h-6 stroke-current" style={{ transform: 'scaleX(-1)' }} />
            </button>

            <div className="flex-grow overflow-y-auto p-4 pb-48 space-y-6 custom-scrollbar pt-20">
                
                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold heading-amiri text-theme-primary">صلاة الاستخارة</h2>
                    <p className="text-sm text-theme-secondary mt-1">طلب الخيرة من الله</p>
                </div>

                {/* Intro Card */}
                <div className="container-luminous p-6 rounded-[2rem] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-theme-accent-primary/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="flex items-start gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-theme-accent-primary/10 flex items-center justify-center text-2xl">
                            🤔
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-theme-primary mb-1">ما هي الاستخارة؟</h3>
                            <p className="text-sm text-theme-secondary/90 leading-relaxed">
                                طلب الخِيَرَة من الله عز وجل في أمر متردد فيه، ليلهمك الله الخير وييسره لك.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Steps */}
                <div className="space-y-4">
                    <h3 className="font-bold text-lg text-theme-primary px-2">كيفية الصلاة</h3>
                    {[
                        { title: "النية والوضوء", desc: "انوِ صلاة الاستخارة وتوضأ كوضوء الصلاة." },
                        { title: "ركعتين", desc: "صلِّ ركعتين من غير الفريضة. يُستحب قراءة (الكافرون) في الأولى و(الإخلاص) في الثانية." },
                        { title: "الدعاء", desc: "بعد التسليم، ارفع يديك واثنِ على الله وصلِّ على النبي ﷺ، ثم ادعُ بدعاء الاستخارة." },
                        { title: "تسمية الحاجة", desc: "عند قولك 'هذا الأمر' في الدعاء، اذكر حاجتك بعينها." },
                        { title: "التوكل", desc: "امضِ في أمرك متوكلاً على الله، فما تيسر فهو الخير." }
                    ].map((step, idx) => (
                        <div key={idx} className="flex items-start gap-4 stagger-item" style={{ animationDelay: `${idx * 100}ms` }}>
                            <div className="flex flex-col items-center gap-1">
                                <div className="w-8 h-8 rounded-full bg-theme-card border border-white/10 flex items-center justify-center text-sm font-bold text-theme-accent-primary shadow-sm">
                                    {idx + 1}
                                </div>
                                {idx < 4 && <div className="w-0.5 h-12 bg-white/10 rounded-full"></div>}
                            </div>
                            <div className="pt-1 pb-4">
                                <h4 className="font-bold text-theme-primary text-sm mb-1">{step.title}</h4>
                                <p className="text-xs text-theme-secondary leading-relaxed">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Dua Card */}
                <div className="container-luminous rounded-[2rem] p-6 bg-gradient-to-br from-theme-card to-theme-accent-primary/5 border-2 border-theme-accent-primary/10">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-theme-accent-primary flex items-center gap-2">
                            <WorshipIcon className="w-5 h-5"/>
                            دعاء الاستخارة
                        </h3>
                        <button onClick={copyDua} className="p-2 rounded-full hover:bg-white/5 text-theme-secondary hover:text-theme-primary transition-colors" title="نسخ">
                            <CopyIcon className="w-5 h-5"/>
                        </button>
                    </div>
                    <p className="font-amiri text-xl leading-[2.2] text-theme-primary text-justify" style={{ textAlignLast: 'center' }}>
                        {duaText}
                    </p>
                </div>
            </div>
        </div>
    );
};


// --- MAIN COMPONENT ---

const OtherTab: React.FC<OtherTabProps> = ({ onViewSet, profile }) => {
    const [activeView, setActiveView] = useState<View>('menu');
    const [previousView, setPreviousView] = useState<View>('menu');
    const [isFindingMosque, setIsFindingMosque] = useState(false);

    const changeView = (newView: View) => {
        setPreviousView(activeView);
        setActiveView(newView);
        onViewSet(newView);
    };

    const findNearestMosque = () => {
        setIsFindingMosque(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                const url = `https://www.google.com/maps/search/?api=1&query=mosque&ll=${latitude},${longitude}`;
                window.open(url, '_blank');
                setIsFindingMosque(false);
            }, (geoError) => {
                 let message = 'حدث خطأ أثناء تحديد الموقع.';
                 if (geoError.code === geoError.PERMISSION_DENIED) {
                      message = 'يرجى تفعيل خدمة الموقع للعثور على أقرب مسجد.';
                 }
                 alert(message);
                 setIsFindingMosque(false);
            }, { timeout: 10000, enableHighAccuracy: true });
        } else {
            alert('خدمة تحديد الموقع غير مدعومة في هذا المتصفح.');
            setIsFindingMosque(false);
        }
    };

    const MainMenuView = () => (
        <div className="flex flex-col px-5 pb-48 w-full max-w-lg mx-auto pt-4">
            
            {/* Header */}
            <div className="mb-8 px-1 text-center sm:text-right">
                <h1 className="text-4xl font-bold text-theme-primary heading-amiri mb-1">اكتشف</h1>
                <p className="text-theme-secondary text-sm">أدوات إسلامية تعينك على طاعتك</p>
            </div>

            {/* Grid Layout - Fixed 2 Columns */}
            <div className="grid grid-cols-2 gap-3 w-full">
                
                {/* 1. Prayer Commitment Tracker (Replacement for Qada) */}
                <button 
                    onClick={() => changeView('prayerTracker')}
                    className="col-span-2 container-luminous rounded-[2rem] p-5 relative overflow-hidden group flex flex-col justify-between items-start text-right bg-gradient-to-r from-theme-card to-theme-accent-primary/5 border-theme-accent-primary/10"
                >
                    <div className="absolute inset-0 bg-theme-accent-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                     <div className="w-full flex justify-between items-start mb-2">
                         <div className="bg-theme-accent-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center text-theme-accent-primary z-10 shadow-sm group-hover:scale-110 transition-transform">
                            <TrophyIcon className="w-6 h-6" />
                        </div>
                        <span className="bg-theme-accent-primary text-theme-accent-primary-text text-[10px] font-bold px-2 py-1 rounded-full">تحفيز</span>
                    </div>
                    <div className="relative z-10 w-full">
                         <h3 className="text-xl font-bold text-theme-primary heading-amiri mb-0.5">رفيق الالتزام</h3>
                         <p className="text-xs text-theme-secondary font-medium opacity-80">تابع صلواتك وحافظ على سلسلتك</p>
                    </div>
                </button>

                {/* 2. Asmaul Husna */}
                <button 
                    onClick={() => changeView('asmaulHusna')}
                    className="col-span-1 aspect-square container-luminous rounded-[2rem] p-5 relative overflow-hidden group flex flex-col justify-between items-start text-right"
                >
                    <div className="bg-purple-500/10 w-10 h-10 rounded-2xl flex items-center justify-center text-purple-400 z-10 group-hover:scale-110 transition-transform">
                        <StarIcon className="w-5 h-5" />
                    </div>
                    <div className="relative z-10 w-full">
                         <h3 className="text-lg font-bold text-theme-primary heading-amiri mb-0.5">الأسماء الحسنى</h3>
                         <p className="text-[10px] text-theme-secondary font-medium opacity-80">99 اسمًا</p>
                    </div>
                </button>

                {/* 3. Sunnah Guide */}
                <button 
                    onClick={() => changeView('sunnahGuide')}
                    className="col-span-1 aspect-square container-luminous rounded-[2rem] p-5 flex flex-col justify-between items-start relative overflow-hidden group hover:bg-theme-card/80 transition-colors"
                >
                     <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                        <ListIcon className="w-5 h-5" />
                    </div>
                    <div className="w-full text-right">
                        <h3 className="text-lg font-bold text-theme-primary heading-amiri leading-tight">دليل السنن</h3>
                        <p className="text-[10px] text-theme-secondary mt-1 opacity-80">سنن مهجورة</p>
                    </div>
                </button>

                {/* 4. Istikharah */}
                <button 
                    onClick={() => changeView('istikharah')}
                    className="col-span-1 aspect-square container-luminous rounded-[2rem] p-5 flex flex-col justify-between items-start relative overflow-hidden group hover:bg-theme-card/80 transition-colors"
                >
                     <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                        <WorshipIcon className="w-5 h-5" />
                    </div>
                    <div className="w-full text-right">
                        <h3 className="text-lg font-bold text-theme-primary heading-amiri leading-tight">الاستخارة</h3>
                        <p className="text-[10px] text-theme-secondary mt-1 opacity-80">كيفية الصلاة</p>
                    </div>
                </button>

                {/* 5. Hadith Search */}
                <button 
                    onClick={() => changeView('sunnahSearch')}
                    className="col-span-1 aspect-square container-luminous rounded-[2rem] p-5 flex flex-col justify-between items-start relative overflow-hidden group hover:bg-theme-card/80 transition-colors"
                >
                     <div className="w-10 h-10 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
                        <SearchIcon className="w-5 h-5" />
                    </div>
                    <div className="w-full text-right">
                        <h3 className="text-lg font-bold text-theme-primary heading-amiri leading-tight">بحث الحديث</h3>
                        <p className="text-[10px] text-theme-secondary mt-1 opacity-80">الدرر السنية</p>
                    </div>
                </button>

                 {/* 6. Mosque Finder (Full width) */}
                <button 
                    onClick={findNearestMosque}
                    disabled={isFindingMosque}
                    className="col-span-2 p-1 rounded-[2.5rem] bg-theme-card border border-white/5 relative overflow-hidden group active:scale-[0.98] transition-all mt-2"
                >
                    {/* Map-like background pattern */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    
                    <div className="bg-theme-primary/40 backdrop-blur-sm p-5 rounded-[2rem] flex items-center justify-between relative z-10 h-full">
                        <div className="flex items-center gap-4">
                             <div className={`w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 ${isFindingMosque ? 'animate-pulse' : ''}`}>
                                {isFindingMosque ? <Spinner /> : <MapPinIcon className="w-6 h-6" />}
                            </div>
                            <div className="text-right">
                                <h3 className="text-base font-bold text-theme-primary">{isFindingMosque ? 'جاري البحث...' : 'أقرب مسجد'}</h3>
                                <p className="text-[10px] text-theme-secondary mt-0.5 opacity-80">استخدم الخرائط للوصول لأقرب مسجد</p>
                            </div>
                        </div>
                        <div className="bg-theme-card text-theme-primary px-4 py-2 rounded-full text-xs font-bold border border-white/10 group-hover:bg-theme-accent-primary group-hover:text-theme-accent-primary-text transition-colors">
                            اذهب
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );

    const renderViewContent = (view: View) => {
        switch(view) {
            case 'sunnahGuide': return <SunnahGuideTab onBack={() => changeView('menu')} />;
            case 'sunnahSearch': return <SunnahSearch onBack={() => changeView('menu')} />;
            case 'asmaulHusna': return <AsmaulHusnaTab onBack={() => changeView('menu')} />;
            case 'istikharah': return <IstikharahGuideTab onBack={() => changeView('menu')} />;
            case 'prayerTracker': return <PrayerTrackerTab onBack={() => changeView('menu')} />;
            case 'menu': default: return <MainMenuView />;
        }
    };

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

export default OtherTab;
