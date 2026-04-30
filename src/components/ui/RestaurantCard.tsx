import React, { useCallback, memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { calculateDistance } from '../../hooks/useUserLocation';

interface RestaurantCardProps {
    restaurant: any;
    isFavorite: boolean;
    toggleFavorite: (id: any) => Promise<void>;
    lang: string;
    userLatitude?: number | null;
    userLongitude?: number | null;
    userCity?: string | null;
}

export const RestaurantCard = memo(({
    restaurant,
    isFavorite,
    toggleFavorite,
    lang,
    userLatitude,
    userLongitude,
    userCity
}: RestaurantCardProps) => {
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
        if (distanceInfo) return distanceInfo;
        return restaurant.location?.split(',')[0] || 'Maputo';
    }, [distanceInfo, restaurant.location]);

    const deliveryTime = useMemo(() => {
        if (restaurant.delivery_time) return `${restaurant.delivery_time} min`;
        if (restaurant.delivery_min_time && restaurant.delivery_max_time) {
            return `${restaurant.delivery_min_time}–${restaurant.delivery_max_time} min`;
        }
        return null;
    }, [restaurant.delivery_time, restaurant.delivery_min_time, restaurant.delivery_max_time]);

    const imageUrl = restaurant.image || restaurant.hero_image_url || restaurant.cover_url;
    const hasImage = !!imageUrl;
    const initial = restaurant.name?.[0]?.toUpperCase() || 'R';
    const isOpen = restaurant.isOpen !== false;
    const rating = typeof restaurant.rating === 'number' ? restaurant.rating.toFixed(1) : restaurant.rating || '4.5';

    return (
        <Link
            to={`/restaurante/${restaurant.slug || restaurant.id}`}
            className="group flex flex-col transition-all duration-300 ease-out"
        >
            {/* IMAGE CONTAINER — Pure Airbnb Square */}
            <div className="relative aspect-square w-full overflow-hidden rounded-[14px] bg-neutral-100">
                {hasImage ? (
                    <img
                        src={imageUrl}
                        alt={restaurant.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                ) : (
                    <div
                        className="w-full h-full flex items-center justify-center bg-neutral-50"
                    >
                        <span className="text-5xl font-sans font-bold text-neutral-200">
                            {initial}
                        </span>
                    </div>
                )}

                {/* Badge — Airbnb style pill */}
                <div className="absolute top-2.5 left-2.5 z-20">
                    <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[12px] font-bold text-neutral-900 shadow-sm border border-black/5">
                        {lang === 'pt' ? 'Preferido' : 'Favorite'}
                    </div>
                </div>

                {/* Heart — Airbnb style: Minimalist outline with drop shadow */}
                <button
                    onClick={handleToggleFavorite}
                    className="absolute top-2.5 right-2.5 z-20 transition-transform duration-200 hover:scale-110 active:scale-95"
                    style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}
                >
                    <Heart 
                        size={22} 
                        className={`transition-colors duration-300 ${isFavorite ? 'fill-[#FF385C] text-[#FF385C]' : 'text-white'}`}
                        strokeWidth={2.5}
                    />
                </button>

                {/* Closed Overlay — Minimalist */}
                {!isOpen && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="px-3 py-1 bg-white/90 rounded-full text-[11px] font-bold text-neutral-800 shadow-sm">
                            {lang === 'pt' ? 'Fechado' : 'Closed'}
                        </span>
                    </div>
                )}
            </div>

            {/* TEXT CONTENT — Compact Airbnb Hierarchy */}
            <div className="mt-2.5 flex flex-col gap-0.5 font-sans">
                {/* Line 1: Type · Location (Bold & Compact) */}
                <h3 className="text-[14px] font-bold text-neutral-900 line-clamp-1 not-italic normal-case tracking-normal leading-tight">
                    {restaurant.cuisine || 'Restaurante'} · {locationDisplay}
                </h3>

                {/* Line 2: Name (Grey) */}
                <p className="text-[14px] font-normal text-neutral-500 line-clamp-1 not-italic normal-case tracking-normal leading-tight">
                    {restaurant.name}
                </p>

                {/* Line 3: Delivery Time + Rating (Grey) */}
                <div className="flex justify-between items-center mt-0.5">
                    <p className="text-[14px] font-normal text-neutral-500 not-italic normal-case">
                        {deliveryTime || '30-40 min'}
                    </p>
                    
                    <div className="flex items-center gap-1">
                        <Star size={11} className="fill-neutral-900 text-neutral-900" />
                        <span className="text-[14px] font-normal text-neutral-900">{rating}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
});

RestaurantCard.displayName = 'RestaurantCard';