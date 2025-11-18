



import React, { useState } from 'react';
import SunnahGuideTab from './SunnahSearchTab';
import Spinner from '../ui/Spinner';
import AsmaulHusnaTab from './AsmaulHusnaTab';
import type { Profile } from '../../types';
import { 
    StarIcon, ListIcon, SearchIcon, MapPinIcon, 
    ChevronLeftIcon, WorshipIcon
} from '../icons/TabIcons';


const Card: React.FC<{ title: string; subtitle: string; icon: React.ReactNode; onClick: () => void; style?: React.CSSProperties }> = ({ title, subtitle, icon, onClick, style }) => (
    <button
        onClick={onClick}
        className="container-luminous rounded-theme-card p-4 text-right flex flex-col justify-between items-start gap-2 min-h-[150px] transition-all duration-300 stagger-item hover:-translate-y-1"
        style={style}
    >
        <div className="w-12 h-12 flex items-center justify-center container-luminous rounded-2xl text-theme-accent-primary">
            {icon}
        </div>
        <div>
            <h3 className="font-bold text-lg text-theme-primary">{title}</h3>
            <p className="text-xs text-theme-secondary/80">{subtitle}</p>
        </div>
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
        <div className="flex flex-col gap-4 min-h-full p-4 pb-28 animate-in fade-in-0" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}>
             <button onClick={onBack} className="self-start flex items-center gap-2 font-semibold text-theme-secondary">
                <ChevronLeftIcon className="w-5 h-5 text-theme-secondary" />
                رجوع
            </button>
             <div className="text-center w-full flex-grow flex flex-col items-center justify-center">
                <div className="w-16 h-16 container-luminous rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <SearchIcon className="w-8 h-8 text-theme-accent-primary"/>
                </div>
                <h2 className="text-2xl font-bold mb-2 heading-amiri">البحث في الحديث</h2>
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
                    <button onClick={handleSearch} className="w-full p-3 button-luminous bg-theme-accent-primary text-white rounded-theme-full font-bold">
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
    const duaText = "اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلاَ أَقْدِرُ، وَتَعْلَمُ وَلاَ أَعْلَمُ، وَأَنْتَ عَلاَّمُ الْغُيُوبِ. اللَّهُمَّ إِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الأَمْرَ - ويسمي حاجته - خَيْرٌ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاقْدُرْهُ لِي وَيَسِّرْهُ لِي، ثُمَّ بَارِكْ لِي فِي Fيهِ، وَإِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الأَمْرَ شَرٌّ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاصْرِفْهُ عَنِّي وَاصْرِفْنِي عَنْهُ، وَاقْدُرْ لِي الْخَيْرَ حَيْثُ كَانَ، ثُمَّ أَرْضِنِي بِهِ.";

    return (
        <div className="flex flex-col gap-4 p-4 pb-28 animate-in fade-in-0" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}>
            <button onClick={onBack} className="self-start flex items-center gap-2 font-semibold text-theme-secondary">
                 <ChevronLeftIcon className="w-5 h-5 text-theme-secondary" />
                رجوع
            </button>
            <div className="text-center w-full flex flex-col items-center">
                <div className="w-16 h-16 container-luminous rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <WorshipIcon className="w-8 h-8 text-theme-accent-primary" />
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

type View = 'menu' | 'sunnahGuide' | 'sunnahSearch' | 'asmaulHusna' | 'istikharah';

interface OtherTabProps {
    onViewSet: (view: View | 'menu') => void;
    profile: Profile;
}

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

    const menuItems = [
        { view: 'asmaulHusna', title: "أسماء الله الحسنى", subtitle: "تعرف على أسماء الله ومعانيها.", icon: <StarIcon className="w-6 h-6"/> },
        { view: 'sunnahGuide', title: "دليل السنن", subtitle: "اكتشف السنن النبوية.", icon: <ListIcon className="w-6 h-6"/> },
        { view: 'istikharah', title: "صلاة الاستخارة", subtitle: "دليل و دعاء صلاة طلب الخيرة.", icon: <WorshipIcon className="w-6 h-6"/> },
        { view: 'sunnahSearch', title: "البحث في الحديث", subtitle: "ابحث في موسوعة الدرر السنية.", icon: <SearchIcon className="w-6 h-6"/> },
    ];
    
    const MainMenuView = () => (
        <div className="flex flex-col gap-6 p-4 pb-28" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}>
            <h2 className="text-3xl font-bold text-center heading-amiri">أدوات إسلامية</h2>
            <div className="grid grid-cols-2 gap-4">
                {menuItems.map((item, index) => (
                    <Card 
                        key={item.view}
                        title={item.title}
                        subtitle={item.subtitle}
                        icon={item.icon}
                        onClick={() => changeView(item.view as View)} 
                        style={{ animationDelay: `${index * 50}ms` }}
                    />
                ))}
                <button
                    onClick={findNearestMosque}
                    disabled={isFindingMosque}
                    className="container-luminous rounded-theme-card p-4 text-right flex flex-col justify-between items-start gap-2 min-h-[150px] transition-all duration-300 stagger-item hover:-translate-y-1 disabled:opacity-50"
                    style={{ animationDelay: `${menuItems.length * 50}ms` }}
                >
                    <div className="w-12 h-12 flex items-center justify-center container-luminous rounded-2xl text-theme-accent-primary">
                        {isFindingMosque ? <Spinner/> : <MapPinIcon className="w-7 h-7"/>}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-theme-primary">{isFindingMosque ? 'جاري البحث...' : 'أقرب مسجد'}</h3>
                        <p className="text-xs text-theme-secondary/80">اعثر على المساجد القريبة منك.</p>
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