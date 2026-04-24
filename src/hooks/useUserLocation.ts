import { useState, useEffect, useCallback } from 'react';

interface UserLocation {
    latitude: number | null;
    longitude: number | null;
    city: string | null;
    isLoading: boolean;
    permissionStatus: 'granted' | 'denied' | 'prompt' | 'unknown';
}

export const useUserLocation = () => {
    const [location, setLocation] = useState<UserLocation>({
        latitude: null,
        longitude: null,
        city: null,
        isLoading: false,
        permissionStatus: typeof navigator !== 'undefined' && 'permissions' in navigator ? 'prompt' : 'unknown'
    });

    const requestLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setLocation(prev => ({ ...prev, permissionStatus: 'denied' }));
            return;
        }

        setLocation(prev => ({ ...prev, isLoading: true }));

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                
                const reverseGeocode = async () => {
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
                        );
                        const data = await response.json();
                        const city = data.address?.city || 
                                    data.address?.town || 
                                    data.address?.village || 
                                    data.address?.suburb ||
                                    data.address?.city_district ||
                                    null;
                        setLocation({
                            latitude,
                            longitude,
                            city,
                            isLoading: false,
                            permissionStatus: 'granted'
                        });
                    } catch {
                        setLocation({
                            latitude,
                            longitude,
                            city: null,
                            isLoading: false,
                            permissionStatus: 'granted'
                        });
                    }
                };

                reverseGeocode();
            },
            (error) => {
                let status: UserLocation['permissionStatus'] = 'denied';
                if (error.code === error.PERMISSION_DENIED) {
                    status = 'denied';
                }
                setLocation(prev => ({ 
                    ...prev, 
                    isLoading: false, 
                    permissionStatus: status 
                }));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }
        );
    }, []);

    useEffect(() => {
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then((result) => {
                if (result.state === 'granted') {
                    requestLocation();
                } else if (result.state === 'denied') {
                    setLocation(prev => ({ ...prev, permissionStatus: 'denied' }));
                }
            });
        }
    }, [requestLocation]);

    return { ...location, requestLocation };
};

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
};