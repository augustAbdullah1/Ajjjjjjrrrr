import React, { useState, useEffect } from 'react';

interface ZakatCalculatorTabProps {
    onBack?: () => void;
}

const NISAB_USD_APPROX = 6000; // Nisab is the value of 85g of Gold. This is an approximation.
const ZAKAT_RATE = 0.025;

const ZakatCalculatorTab: React.FC<ZakatCalculatorTabProps> = ({ onBack }) => {
    const [cash, setCash] = useState(0);
    const [goldValue, setGoldValue] = useState(0);
    const [investments, setInvestments] = useState(0);
    const [businessAssets, setBusinessAssets] = useState(0);
    const [rentalIncome, setRentalIncome] = useState(0);
    const [otherAssets, setOtherAssets] = useState(0);

    const [totalWealth, setTotalWealth] = useState(0);
    const [zakatDue, setZakatDue] = useState(0);
    const [isAboveNisab, setIsAboveNisab] = useState(false);

    useEffect(() => {
        const total = cash + goldValue + investments + businessAssets + rentalIncome + otherAssets;
        setTotalWealth(total);
        if (total >= NISAB_USD_APPROX) {
            setIsAboveNisab(true);
            setZakatDue(total * ZAKAT_RATE);
        } else {
            setIsAboveNisab(false);
            setZakatDue(0);
        }
    }, [cash, goldValue, investments, businessAssets, rentalIncome, otherAssets]);
    
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 2 }).format(value);
    };

    const InputRow: React.FC<{ label: string; value: number; onChange: (value: number) => void }> = ({ label, value, onChange }) => (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-theme-secondary">{label}</label>
            <input
                type="number"
                value={value || ''}
                onChange={e => onChange(parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-full p-3 bg-theme-card text-theme-primary rounded-theme-card text-right border-2 border-transparent focus:border-theme-accent-faded outline-none text-lg font-bold"
            />
        </div>
    );

    return (
        <div className="flex flex-col gap-4 min-h-[450px] relative animate-in fade-in-0">
             {onBack && (
                <button onClick={onBack} className="absolute top-0 right-0 flex items-center gap-2 font-semibold text-theme-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    رجوع
                </button>
            )}
             <div className="text-center w-full pt-8">
                <h2 className="text-2xl font-bold mb-2">حاسبة الزكاة</h2>
                <p className="text-sm text-theme-secondary/80 mb-6 max-w-xs mx-auto">
                   أدخل قيمة ممتلكاتك التي حال عليها الحول لحساب زكاتك.
                </p>
                
                <div className="p-4 bg-theme-accent-card rounded-theme-card text-center mb-4 border-2 border-theme-accent-faded">
                    <p className="text-sm">قيمة النصاب التقريبية (ما يعادل 85 جرام ذهب):</p>
                    <p className="font-bold text-lg text-theme-accent-primary">{formatCurrency(NISAB_USD_APPROX)}</p>
                    <p className="text-xs text-theme-secondary/70 mt-1">يرجى التحقق من القيمة الحالية من المصادر الموثوقة.</p>
                </div>
                
                <div className="text-right space-y-3">
                    <InputRow label="النقد (في اليد والبنك)" value={cash} onChange={setCash} />
                    <InputRow label="قيمة الذهب والفضة" value={goldValue} onChange={setGoldValue} />
                    <InputRow label="الأسهم والاستثمارات" value={investments} onChange={setInvestments} />
                    <InputRow label="قيمة البضائع التجارية" value={businessAssets} onChange={setBusinessAssets} />
                    <InputRow label="الدخل من الإيجارات" value={rentalIncome} onChange={setRentalIncome} />
                    <InputRow label="أصول أخرى" value={otherAssets} onChange={setOtherAssets} />
                </div>
                
                 <div className="mt-6 p-4 bg-theme-card rounded-theme-container space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">إجمالي المبلغ الخاضع للزكاة:</span>
                        <span className="font-bold text-lg">{formatCurrency(totalWealth)}</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="font-semibold">هل تجاوز النصاب؟</span>
                        <span className={`font-bold text-lg ${isAboveNisab ? 'text-green-400' : 'text-red-400'}`}>{isAboveNisab ? 'نعم' : 'لا'}</span>
                    </div>
                     <div className="border-t border-theme my-2"></div>
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-lg text-theme-accent-primary">مبلغ الزكاة المستحق:</span>
                        <span className="font-black text-2xl text-theme-accent-primary">{formatCurrency(zakatDue)}</span>
                    </div>
                </div>
                
                 <p className="text-xs text-theme-secondary/60 mt-4">
                    هذه الحاسبة أداة مساعدة. استشر عالمًا أو جهة موثوقة لمسائل الزكاة المعقدة.
                </p>

            </div>
        </div>
    );
};

export default ZakatCalculatorTab;
