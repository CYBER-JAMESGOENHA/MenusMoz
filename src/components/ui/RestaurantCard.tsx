import React, { useCallback, memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, ArrowRight } from 'lucide-react';
import { calculateDistance } from '../../hooks/useUserLocation';
import { translations } from '../../translations';

interface RestaurantCardProps {
    restaurant: any;
    isFavorite: boolean;
    toggleFavorite: (id: any) => Promise<void>;
    lang: string;
    userLatitude?: number | null;
    userLongitude?: number | null;
    userCity?: string | null;
    mode?: 'discovery' | 'delivery';
}

export const RestaurantCard = memo(({
    restaurant,
    isFavorite,
    toggleFavorite,
    lang,
    userLatitude,
    userLongitude,
    userCity,
    mode = 'delivery'
}: RestaurantCardProps) => {
    const t = translations[lang as 'pt' | 'en'] || translations.pt;
    
    const handleToggleFavorite = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(restaurant.id);
    }, [restaurant.id, toggleFavorite]);

    const distanceInfo = useMemo(() => {
        if (!userLatitude || !userLongitude || !restaurant.latitude || !restaurant.longitude) return null;
        const distance = calculateDistance(userLatitude, userLongitude, restaurant.latitude, restaurant.longitude);
        if (distance < 1) return '< 1 km';
        return `${distance.toFixed(1)} km`;
    }, [userLatitude, userLongitude, restaurant.latitude, restaurant.longitude]);

    const locationDisplay = useMemo(() => {
        const city = restaurant.city || restaurant.location?.split(',')[0] || 'Maputo';
        if (distanceInfo) return `${city} • ${distanceInfo}`;
        return city;
    }, [distanceInfo, restaurant.city, restaurant.location]);

    const imageUrl = restaurant.image || restaurant.hero_image_url || restaurant.cover_url;
    const logoUrl = restaurant.logo_url || restaurant.logo;
    const hasImage = !!imageUrl;
    const initial = restaurant.name?.[0]?.toUpperCase() || 'R';
    const rating = typeof restaurant.rating === 'number' ? restaurant.rating.toFixed(1) : restaurant.rating || '4.5';

    return (
        <Link
            to={`/restaurante/${restaurant.slug || restaurant.id}`}
            className="group flex flex-col bg-white dark:bg-neutral-900/60 rounded-[32px] p-3 border border-neutral-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-premium hover:-translate-y-1.5 transition-all duration-500 ease-out"
        >
            {/* IMAGE CONTAINER — Clean Airbnb Style */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] bg-neutral-100 dark:bg-neutral-800">
                {hasImage ? (
                    <img
                        src={imageUrl}
                        alt={restaurant.name}
                        className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.1]"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-50 dark:bg-neutral-800">
                        <span className="text-5xl font-sans font-bold text-neutral-200 dark:text-neutral-700">
                            {initial}
                        </span>
                    </div>
                )}

                {/* Top Overlay: Favorite Heart */}
                <button
                    onClick={handleToggleFavorite}
                    className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full bg-white/90 dark:bg-black/40 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-md border border-white/20"
                >
                    <Heart 
                        size={18} 
                        className={`transition-colors duration-300 ${isFavorite ? 'fill-[#FF385C] text-[#FF385C]' : 'text-neutral-600 dark:text-white'}`}
                        strokeWidth={2.5}
                    />
                </button>

                {/* Subtle bottom gradient */}
                <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>

            {/* CONTENT AREA */}
            <div className="mt-4 px-1 pb-1 flex flex-col h-full">
                {/* Header Row: Logo, Name, Rating */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden min-w-0">
                        <div className="w-10 h-10 rounded-full border-2 border-white dark:border-neutral-800 shadow-sm overflow-hidden flex-shrink-0 bg-white">
                            {logoUrl ? (
                                <img src={logoUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-400 font-bold text-xs">
                                    {initial}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <h3 className="font-display text-lg font-black italic uppercase tracking-tighter truncate leading-tight group-hover:text-primary transition-colors duration-300">
                                {restaurant.name}
                            </h3>
                            <p className="text-neutral-500 dark:text-neutral-400 text-[12px] font-medium truncate mt-0.5">
                                {restaurant.cuisine || 'Restaurante'}
                            </p>
                        </div>
                    </div>
                    <div className="bg-[#FEF3C7] dark:bg-amber-900/30 px-2.5 py-1 rounded-lg flex items-center gap-1 flex-shrink-0 border border-amber-200/50 dark:border-amber-700/30">
                        <Star size={12} className="fill-amber-500 text-amber-500" />
                        <span className="text-[12px] font-black text-amber-800 dark:text-amber-400 tracking-tighter">{rating}</span>
                    </div>
                </div>

                {/* Location Row — Now below the name */}
                <div className="mt-4 flex items-center gap-1.5 text-neutral-400 dark:text-neutral-500 font-bold text-[10px] uppercase tracking-widest pl-1">
                    <MapPin size={11} className="opacity-50" />
                    <span>{locationDisplay}</span>
                </div>

                {/* CTA Button — Premium touchpoint */}
                <div className="mt-6">
                    <div className="w-full py-3 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-100 dark:border-white/5 flex items-center justify-between px-5 group-hover:bg-primary group-hover:border-primary transition-all duration-500 shadow-sm">
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-600 dark:text-neutral-300 group-hover:text-white transition-colors duration-500">
                            {t.home.view_restaurant}
                        </span>
                        <ArrowRight size={14} className="text-neutral-400 dark:text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-500" />
                    </div>
                </div>
            </div>
        </Link>
    );
});

RestaurantCard.displayName = 'RestaurantCard';