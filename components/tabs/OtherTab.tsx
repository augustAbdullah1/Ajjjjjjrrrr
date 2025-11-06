import React, { useState } from 'react';
import QiblaTab from './QiblaTab';
import SunnahGuideTab from './SunnahSearchTab';
import Spinner from '../ui/Spinner';
import AsmaulHusnaTab from './AsmaulHusnaTab';
import { IstikharahIcon, StarIcon, ListIcon, SearchIcon, QiblaIcon, MapPinIcon, ChevronLeftIcon, SettingsIcon, ProfileIcon } from '../icons/TabIcons';

const MenuItem: React.FC<{ label: string; icon: React.ReactNode; onClick: () => void; disabled?: boolean; style?: React.CSSProperties, className?: string }> = ({ label, icon, onClick, disabled, style, className }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full p-4 container-luminous rounded-theme-card text-right font-semibold text-lg flex justify-between items-center disabled:opacity-50 ${className}`}
        style={style}
    >
        <div className="flex items-center gap-4">
            <div className="w-8 h-8 flex items-center justify-center text-theme-accent-primary">{icon}</div>
            <span>{label}</span>
        </div>
        <ChevronLeftIcon className="w-5 h-5 text-theme-secondary" style={{ transform: 'scaleX(-1)' }} />
    </button>
);


const SunnahSearch: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [query, setQuery] = useState('');
    const handleSearch = () => {
        if (query.trim()) {
            const url = `https://www.dorar.net/hadith/search?q=${encodeURIComponent(query)}`;
            window.open(url, '_blank');
        }
    };
    
    const searchSuggestions = ["فضل الصلاة", "بر الوالدين", "أذكار النوم", "فضل الصدقة"];

    return (
        <div className="flex flex-col gap-4 min-h-[450px] relative">
             <button onClick={onBack} className="absolute top-0 right-0 flex items-center gap-2 font-semibold text-theme-secondary">
                <ChevronLeftIcon className="w-5 h-5 text-theme-secondary" />
                رجوع
            </button>
             <div className="text-center w-full pt-8 flex flex-col items-center">
                <div className="w-16 h-16 container-luminous rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <SearchIcon className="w-8 h-8 text-theme-accent-primary"/>
                </div>
                <h2 className="text-2xl font-bold mb-2 heading-amiri">البحث في السنة</h2>
                <p className="text-sm text-theme-secondary/80 mb-6 max-w-xs">
                   ابحث في موسوعة الحديث الشاملة في موقع الدرر السنية.
                </p>
                <div className="w-full max-w-sm flex flex-col gap-4">
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="اكتب كلمة أو جملة للبحث..."
                        className="w-full p-3 input-luminous text-theme-primary rounded-theme-card text-right"
                    />
                    <button onClick={handleSearch} className="w-full p-3 button-luminous bg-theme-accent-primary text-theme-accent-primary-text rounded-theme-full font-bold">
                        بحث
                    </button>
                </div>
                 <div className="mt-6 w-full max-w-sm">
                    <p className="text-xs text-theme-secondary/60 mb-3">أو جرب أحد الاقتراحات:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {searchSuggestions.map(suggestion => (
                            <button key={suggestion} onClick={() => setQuery(suggestion)} className="px-3 py-1 button-luminous rounded-theme-full text-xs">
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const IstikharahGuideTab: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const duaText = "اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلاَ أَقْدِرُ، وَتَعْلَمُ وَلاَ أَعْلَمُ، وَأَنْتَ عَلاَّمُ الْغُيُوبِ، اللَّهُمَّ إِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الأَمْرَ - وَيُسَمِّي حَاجَتَهُ - خَيْرٌ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاقْدُرْهُ لِي وَيَسِّرْهُ لِي، ثُمَّ بَارِكْ لِي فِيهِ، وَإِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الأَمْرَ شَرٌّ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاصْرِفْهُ عَنِّي وَاصْرِفْنِي عَنْهُ، وَاقْدُرْ لِي الْخَيْرَ حَيْثُ كَانَ، ثُمَّ أَرْضِنِي بِهِ.";

    return (
        <div className="flex flex-col gap-4 min-h-[450px] relative">
            <button onClick={onBack} className="absolute top-0 right-0 flex items-center gap-2 font-semibold text-theme-secondary">
                 <ChevronLeftIcon className="w-5 h-5 text-theme-secondary" />
                رجوع
            </button>
            <div className="text-center w-full pt-8 flex flex-col items-center">
                <div className="w-16 h-16 container-luminous rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <IstikharahIcon className="w-8 h-8 text-theme-accent-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2 heading-amiri">دليل صلاة الاستخارة</h2>
                <p className="text-sm text-theme-secondary/80 mb-6 max-w-xs">
                   كيفية أداء صلاة الاستخارة ودعاؤها.
                </p>

                <div className="w-full max-w-md text-right space-y-4 pb-8">
                    <div className="p-4 container-luminous rounded-theme-card">
                        <h3 className="font-bold text-lg text-theme-accent mb-2">ما هي صلاة الاستخارة؟</h3>
                        <p className="text-sm text-theme-primary/90 leading-relaxed">
                            هي طلب الخِيَرَة من الله عز وجل، ومعناها أن يطلب المسلم من ربه سبحانه وتعالى أن يختار له ما فيه الخير له في دينه ودنياه، وذلك عندما يتردد بين أمرين مباحين.
                        </p>
                    </div>
                    <div className="p-4 container-luminous rounded-theme-card">
                        <h3 className="font-bold text-lg text-theme-accent mb-2">كيفية أداء الصلاة</h3>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-theme-primary/90 pr-4">
                            <li>تتوضأ وضوءك للصلاة.</li>
                            <li>تَنوي أداء صلاة الاستخارة.</li>
                            <li>تُصلي ركعتين من غير الفريضة، يُستحب أن تقرأ في الركعة الأولى بعد الفاتحة سورة (الكافرون)، وفي الثانية (الإخلاص).</li>
                            <li>بعد السلام من الصلاة، ترفع يديك وتدعو بدعاء الاستخارة الوارد عن النبي ﷺ.</li>
                        </ol>
                    </div>
                     <div className="p-4 container-luminous rounded-theme-card">
                        <h3 className="font-bold text-lg text-theme-accent mb-2">دعاء الاستخارة</h3>
                        <p className="font-amiri text-2xl leading-loose text-theme-primary my-4">
                           {duaText}
                        </p>
                         <p className="text-xs text-theme-secondary/80">
                           * عند قول "هذا الأمر"، تسمي حاجتك أو تفكر فيها.
                        </p>
                    </div>
                    <div className="p-4 container-luminous rounded-theme-card">
                        <h3 className="font-bold text-lg text-theme-accent mb-2">ماذا بعد الصلاة؟</h3>
                        <p className="text-sm text-theme-primary/90 leading-relaxed">
                            بعد الدعاء، تمضي في الأمر الذي استخرت الله فيه، فإن كان خيراً يسره الله لك، وإن كان شراً صرفه الله عنك. ليس بالضرورة أن ترى رؤيا، بل علامة القبول هي تيسير الأمر أو انشراح الصدر له.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};


type View = 'menu' | 'qibla' | 'sunnahGuide' | 'sunnahSearch' | 'asmaulHusna' | 'istikharah';

interface OtherTabProps {
    onOpenProfile: () => void;
    onOpenSettings: () => void;
}

const OtherTab: React.FC<OtherTabProps> = ({ onOpenProfile, onOpenSettings }) => {
    const [activeView, setActiveView] = useState<View>('menu');
    const [previousView, setPreviousView] = useState<View>('menu');
    const [isFindingMosque, setIsFindingMosque] = useState(false);

    const changeView = (newView: View) => {
        setPreviousView(activeView);
        setActiveView(newView);
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

    const menuItems = [
        { label: "أسماء الله الحسنى", onClick: () => changeView('asmaulHusna'), icon: <StarIcon className="w-6 h-6"/> },
        { label: "دليل السنن", onClick: () => changeView('sunnahGuide'), icon: <ListIcon className="w-6 h-6"/> },
        { label: "دليل صلاة الاستخارة", onClick: () => changeView('istikharah'), icon: <IstikharahIcon className="w-6 h-6"/> },
        { label: "البحث في الدرر السنية", onClick: () => changeView('sunnahSearch'), icon: <SearchIcon className="w-6 h-6"/> },
        { label: "بوصلة القبلة", onClick: () => changeView('qibla'), icon: <QiblaIcon className="w-6 h-6"/> },
    ];
    
    const MainMenuView = () => (
        <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold text-center heading-amiri">أدوات إسلامية</h2>
            <div className="space-y-3">
                {menuItems.map((item, index) => <MenuItem key={item.label} {...item} style={{ animationDelay: `${index * 50}ms` }} className="stagger-item" />)}
                <button
                    onClick={findNearestMosque}
                    disabled={isFindingMosque}
                    className="w-full p-4 container-luminous rounded-theme-card text-right font-semibold text-lg flex justify-between items-center disabled:opacity-50 disabled:cursor-not-allowed stagger-item"
                    style={{ animationDelay: `${menuItems.length * 50}ms` }}
                >
                    <div className="flex items-center gap-4">
                         <div className="w-8 h-8 flex items-center justify-center text-theme-accent-primary">
                            {isFindingMosque ? <Spinner /> : <MapPinIcon className="w-6 h-6"/>}
                        </div>
                        <span>{isFindingMosque ? 'جاري تحديد موقعك...' : 'البحث عن أقرب مسجد'}</span>
                    </div>
                    {!isFindingMosque && <ChevronLeftIcon className="w-5 h-5 text-theme-secondary" style={{ transform: 'scaleX(-1)' }} />}
                </button>
            </div>
        </div>
    );

    const renderViewContent = (view: View) => {
        switch(view) {
            case 'qibla': return <QiblaTab onBack={() => changeView('menu')} />;
            case 'sunnahGuide': return <SunnahGuideTab onBack={() => changeView('menu')} />;
            case 'sunnahSearch': return <SunnahSearch onBack={() => changeView('menu')} />;
            case 'asmaulHusna': return <AsmaulHusnaTab onBack={() => changeView('menu')} />;
            case 'istikharah': return <IstikharahGuideTab onBack={() => changeView('menu')} />;
            case 'menu': default: return <MainMenuView />;
        }
    };

    return (
        <div className="w-full h-[100dvh] flex flex-col">
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
            <main className="flex-grow px-4 pb-40 overflow-y-auto flex flex-col">
                <div className="view-container">
                    <div 
                        key={activeView} 
                        className={`view-content ${activeView !== previousView ? 'view-enter' : ''}`}
                    >
                        {renderViewContent(activeView)}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OtherTab;