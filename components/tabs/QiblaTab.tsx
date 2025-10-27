import React, { useState, useEffect, useCallback } from 'react';
import Spinner from '../ui/Spinner';

// Coordinates of the Kaaba in Mecca
const KAABA_LAT = 21.4225;
const KAABA_LON = 39.8262;

// Helper to convert degrees to radians
const toRadians = (deg: number) => deg * (Math.PI / 180);
const toDegrees = (rad: number) => rad * (180 / Math.PI);

const QiblaTab: React.FC = () => {
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
    
    const handleOrientation = (event: DeviceOrientationEvent) => {
        // 'webkitCompassHeading' is for iOS compatibility
        const heading = (event as any).webkitCompassHeading || event.alpha;
        if (heading !== null) {
            setDeviceHeading(360 - heading); // Adjust for CSS rotation
        }
    };

    const requestPermissionsAndStart = async () => {
        setIsLoading(true);
        setError(null);

        // 1. Geolocation Permission
        if (!navigator.geolocation) {
            setError("خدمة تحديد الموقع غير مدعومة في هذا المتصفح.");
            setIsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                calculateQiblaDirection(latitude, longitude);
            },
            () => {
                setError("يرجى تفعيل خدمة الموقع لتحديد اتجاه القبلة.");
                setIsLoading(false);
            }
        );
        
        // 2. Device Orientation Permission (for iOS 13+)
        const DO = window.DeviceOrientationEvent as any;
        if (typeof DO.requestPermission === 'function') {
            try {
                const permission = await DO.requestPermission();
                if (permission === 'granted') {
                    window.addEventListener('deviceorientation', handleOrientation);
                    setPermissionState('granted');
                } else {
                    setError("يرجى السماح بالوصول إلى حساسات الحركة لعرض البوصلة.");
                    setPermissionState('denied');
                }
            } catch (err) {
                 setError("حدث خطأ أثناء طلب الأذونات.");
                 setPermissionState('denied');
            }
        } else {
            // For Android and other browsers
             window.addEventListener('deviceorientation', handleOrientation);
             setPermissionState('granted');
        }
    };
    
    useEffect(() => {
        // Cleanup listener on component unmount
        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, []);

    const renderContent = () => {
        if (permissionState === 'prompt' || error) {
            return (
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">بوصلة القبلة</h2>
                    <p className="text-sm text-theme-accent/80 mb-6">
                       لتحديد اتجاه القبلة بدقة، نحتاج إلى الوصول لموقعك وحساسات الحركة في جهازك.
                    </p>
                    <button 
                        onClick={requestPermissionsAndStart}
                        className="px-6 py-3 bg-theme-add text-white rounded-full font-bold transition-transform hover:scale-105"
                    >
                        تحديد القبلة
                    </button>
                    {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
                </div>
            );
        }
        
        if (isLoading || qiblaDirection === null || deviceHeading === null) {
            return (
                <div className="flex flex-col justify-center items-center h-64 gap-4">
                    <Spinner />
                    <p>جاري المعايرة...</p>
                </div>
            );
        }

        // The compass needle should point towards the Qibla relative to the device's orientation.
        const needleRotation = qiblaDirection - deviceHeading;

        return (
            <div className="flex flex-col items-center gap-4">
                 <h2 className="text-xl font-bold">اتجاه القبلة</h2>
                <div className="w-56 h-56 rounded-full bg-black/10 border-4 border-white/20 flex items-center justify-center relative">
                    {/* Compass background */}
                    <div className="absolute w-full h-full text-theme-accent/50">
                        <div className="absolute top-1 left-1/2 -translate-x-1/2 text-xs font-bold">ش</div>
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs">ج</div>
                        <div className="absolute left-1 top-1/2 -translate-y-1/2 text-xs">غ</div>
                        <div className="absolute right-1 top-1/2 -translate-y-1/2 text-xs">ش</div>
                    </div>

                    {/* Qibla Needle */}
                    <div 
                        className="w-full h-full transition-transform duration-200"
                        style={{ transform: `rotate(${needleRotation}deg)` }}
                    >
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                            <polygon points="50,0 60,50 50,100 40,50" fill="var(--theme-counter)" />
                        </svg>
                    </div>
                     <div className="absolute w-3 h-3 bg-theme-secondary rounded-full border-2 border-theme-counter"></div>
                </div>
                <div className="text-center">
                     <p className="text-lg font-bold text-theme-counter">{qiblaDirection.toFixed(1)}°</p>
                     <p className="text-sm text-theme-accent/80">قم بتدوير هاتفك حتى يشير السهم للأعلى</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            {renderContent()}
        </div>
    );
};

export default QiblaTab;