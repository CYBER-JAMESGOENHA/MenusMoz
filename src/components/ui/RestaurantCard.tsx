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
            className="group flex flex-col bg-white dark:bg-neutral-900/50 rounded-2xl p-2.5 border border-neutral-100 dark:border-white/5 shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.12),0_8px_20px_-10px_rgba(220,38,38,0.08)] hover:-translate-y-1 transition-all duration-400 ease-out"
        >
            {/* IMAGE CONTAINER — Clean Airbnb Style */}
            <div className="relative aspect-[16/11] w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
                {hasImage ? (
                    <img
                        src={imageUrl}
                        alt={restaurant.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-50 dark:bg-neutral-800">
                        <span className="text-4xl font-sans font-bold text-neutral-200 dark:text-neutral-700">
                            {initial}
                        </span>
                    </div>
                )}

                {/* Top Overlay: Favorite Heart */}
                <button
                    onClick={handleToggleFavorite}
                    className="absolute top-2.5 right-2.5 z-20 w-9 h-9 rounded-full bg-white/95 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg border border-white/30"
                >
                    <Heart 
                        size={16} 
                        className={`transition-colors duration-300 ${isFavorite ? 'fill-primary text-primary' : 'text-neutral-600 dark:text-white/90'}`}
                        strokeWidth={2.5}
                    />
                </button>

                {/* Subtle bottom gradient */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
            </div>

            {/* CONTENT AREA */}
            <div className="mt-3 px-1 pb-1 flex flex-col h-full">
                {/* Header Row: Logo, Name, Rating */}
                <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
                        <div className="w-9 h-9 rounded-full border border-neutral-200 dark:border-white/10 shadow-sm overflow-hidden flex-shrink-0 bg-white">
                            {logoUrl ? (
                                <img src={logoUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-400 font-bold text-[10px]">
                                    {initial}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <h3 className="font-display text-base font-black italic uppercase tracking-tight truncate leading-[1.1] group-hover:text-primary transition-colors duration-300">
                                {restaurant.name}
                            </h3>
                            <p className="text-neutral-400 dark:text-neutral-500 text-[11px] font-medium truncate mt-0.5">
                                {restaurant.cuisine || 'Restaurante'}
                            </p>
                        </div>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-md flex items-center gap-1 flex-shrink-0 border border-amber-100/50 dark:border-amber-800/30">
                        <Star size={11} className="fill-amber-500 text-amber-500" />
                        <span className="text-[11px] font-black text-amber-700 dark:text-amber-400 tracking-tight">{rating}</span>
                    </div>
                </div>

                {/* Location Row — Now below the name */}
                <div className="mt-3 flex items-center gap-1 text-neutral-400 dark:text-neutral-500 font-medium text-[9px] uppercase tracking-wider pl-0.5">
                    <MapPin size={10} className="opacity-40" />
                    <span>{locationDisplay}</span>
                </div>

                {/* CTA Button — Premium touchpoint */}
                <div className="mt-4">
                    <div className="w-full py-2.5 rounded-xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-100 dark:border-white/5 flex items-center justify-between px-4 group-hover:bg-primary group-hover:border-primary transition-all duration-400 shadow-sm">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400 group-hover:text-white transition-colors duration-400">
                            {t.home.view_restaurant}
                        </span>
                        <ArrowRight size={12} className="text-neutral-400 dark:text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-400" />
                    </div>
                </div>
            </div>
        </Link>
    );
});

RestaurantCard.displayName = 'RestaurantCard';