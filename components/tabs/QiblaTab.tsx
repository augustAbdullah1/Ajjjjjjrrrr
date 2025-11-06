import React, { useState, useEffect, useCallback } from 'react';
import Spinner from '../ui/Spinner';

const KAABA_LAT = 21.4225;
const KAABA_LON = 39.8262;

const toRadians = (deg: number) => deg * (Math.PI / 180);
const toDegrees = (rad: number) => rad * (180 / Math.PI);

interface QiblaTabProps {
    onBack?: () => void;
}

const QiblaTab: React.FC<QiblaTabProps> = ({ onBack }) => {
    const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
    const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');
    const [isLoading, setIsLoading] = useState(true);

    const calculateQiblaDirection = useCallback((lat: number, lon: number) => {
        const latK = toRadians(KAABA_LAT);
        const lonK = toRadians(KAABA_LON);
        const latU = toRadians(lat);
        const lonU = toRadians(lon);
        const dLon = lonK - lonU;

        const y = Math.sin(dLon) * Math.cos(latK);
        const x = Math.cos(latU) * Math.sin(latK) - Math.sin(latU) * Math.cos(latK) * Math.cos(dLon);
        
        let bearing = toDegrees(Math.atan2(y, x));
        bearing = (bearing + 360) % 360;
        
        setQiblaDirection(bearing);
        setIsLoading(false);
    }, []);
    
    const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
        const heading = (event as any).webkitCompassHeading || event.alpha;
        if (heading !== null) {
            setDeviceHeading(360 - heading);
        }
    }, []);

    const requestPermissionsAndStart = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                });
            });
            calculateQiblaDirection(position.coords.latitude, position.coords.longitude);
        } catch (geoError) {
             setError("يرجى تفعيل خدمة الموقع لتحديد اتجاه القبلة.");
             setIsLoading(false);
             return;
        }
        
        const DO = window.DeviceOrientationEvent as any;
        if (typeof DO.requestPermission === 'function') {
            const permission = await DO.requestPermission();
            if (permission === 'granted') {
                window.addEventListener('deviceorientation', handleOrientation);
                setPermissionState('granted');
            } else {
                setError("يرجى السماح بالوصول إلى حساسات الحركة لعرض البوصلة.");
                setPermissionState('denied');
                 setIsLoading(false);
            }
        } else {
             window.addEventListener('deviceorientation', handleOrientation);
             setPermissionState('granted');
        }
    };
    
    useEffect(() => {
       // Automatically request permissions when component mounts
       requestPermissionsAndStart();
        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, [handleOrientation]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col justify-center items-center h-64 gap-4">
                    <Spinner />
                    <p>جاري طلب الأذونات والمعايرة...</p>
                </div>
            );
        }
        
        if (error) {
             return (
                <div className="text-center p-4">
                    <h2 className="text-xl font-bold mb-2">خطأ</h2>
                    <p className="text-theme-danger mt-4 text-sm mb-6">{error}</p>
                     <button onClick={requestPermissionsAndStart} className="px-6 py-3 bg-theme-accent-primary text-theme-accent-primary-text rounded-theme-full font-bold transition-transform hover:scale-105">
                        حاول مرة أخرى
                    </button>
                </div>
            )
        }

        if (qiblaDirection === null || deviceHeading === null) {
             return (
                <div className="flex flex-col justify-center items-center h-64 gap-4">
                    <Spinner />
                    <p>في انتظار بيانات الحساسات...</p>
                </div>
            );
        }

        const needleRotation = qiblaDirection - deviceHeading;

        return (
            <div className="flex flex-col items-center gap-4">
                 <h2 className="text-xl font-bold">اتجاه القبلة</h2>
                <div className="w-64 h-64 rounded-theme-full bg-black/10 border-4 border-theme flex items-center justify-center relative my-4">
                    <div className="absolute w-full h-full text-theme-secondary/50" style={{ transform: `rotate(${deviceHeading}deg)`}}>
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-lg font-bold">N</div>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-sm">S</div>
                        <div className="absolute -left-1 top-1/2 -translate-y-1/2 text-sm">W</div>
                        <div className="absolute -right-1 top-1/2 -translate-y-1/2 text-sm">E</div>
                    </div>
                    <div className="w-full h-full transition-transform duration-200" style={{ transform: `rotate(${needleRotation}deg)` }}>
                        {/* Kaaba Icon as the needle head */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="var(--theme-primary-accent)" className="absolute top-2 left-1/2 -translate-x-1/2"><path d="M2 3h20v14h-5.992l-4.004 5.994-4.004-5.994h-6v-14zm2 2v10h16v-10h-16zm5 4h6v2h-6v-2z"/></svg>
                        {/* Needle Body */}
                        <div className="w-1.5 h-24 bg-theme-accent-primary absolute top-10 left-1/2 -translate-x-1/2 rounded-theme-full"></div>
                    </div>
                    <div className="absolute w-4 h-4 bg-theme-primary rounded-theme-full border-2 border-theme-accent-primary"></div>
                </div>
                <div className="text-center">
                     <p className="text-lg font-bold text-theme-accent-primary">{qiblaDirection.toFixed(0)}°</p>
                     <p className="text-sm text-theme-secondary/80">ضع هاتفك بشكل مسطح وقم بتدويره حتى يتجه السهم للأعلى</p>
                     <p className="text-xs text-theme-secondary/60 mt-2">لأفضل دقة، قم بمعايرة البوصلة بتحريك الجهاز على شكل الرقم 8.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[450px] relative">
            {onBack && (
                 <button onClick={onBack} className="absolute top-0 right-0 flex items-center gap-2 font-semibold text-theme-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    رجوع
                </button>
            )}
            {renderContent()}
        </div>
    );
};

export default QiblaTab;