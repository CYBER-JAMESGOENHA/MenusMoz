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
            {/* IMAGE CONTAINER — Aspect Ratio Square like Airbnb */}
            <div className="relative aspect-square w-full overflow-hidden rounded-[16px] bg-neutral-100">
                {hasImage ? (
                    <img
                        src={imageUrl}
                        alt={restaurant.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    />
                ) : (
                    <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                            background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 10%, transparent 90%), color-mix(in srgb, var(--color-accent) 5%, transparent 95%))'
                        }}
                    >
                        <span className="text-6xl font-display font-bold text-[var(--color-text-main)] opacity-10">
                            {initial}
                        </span>
                    </div>
                )}

                {/* Badge — Top Left (Airbnb "Guest Favorite" style) */}
                <div className="absolute top-3 left-3 z-20">
                    <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-[12px] font-bold text-[var(--color-text-main)] shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-white/20">
                        {lang === 'pt' ? 'Preferido' : 'Favorite'}
                    </div>
                </div>

                {/* Heart — Top Right (Airbnb style: No bg circle, just icon with shadow) */}
                <button
                    onClick={handleToggleFavorite}
                    className="absolute top-3 right-3 z-20 transition-transform duration-300 hover:scale-110 active:scale-95"
                    style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}
                >
                    <Heart 
                        size={24} 
                        className={`transition-colors duration-300 ${isFavorite ? 'fill-[var(--color-primary)] text-[var(--color-primary)]' : 'text-white'}`}
                        strokeWidth={2}
                    />
                </button>

                {/* Status Overlay — Bottom Left (Optional, keeping it subtle) */}
                {!isOpen && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                        <span className="px-3 py-1 bg-white/90 rounded-full text-xs font-bold text-neutral-800">
                            {lang === 'pt' ? 'Fechado' : 'Closed'}
                        </span>
                    </div>
                )}
            </div>

            {/* TEXT CONTENT — Airbnb Hierarchy */}
            <div className="mt-3 flex flex-col">
                {/* Line 1: Type · Location (Bold) */}
                <div className="flex justify-between items-start gap-2">
                    <h3 className="text-[15px] font-semibold text-[var(--color-text-main)] line-clamp-1">
                        {restaurant.cuisine || 'Restaurante'} · {locationDisplay}
                    </h3>
                </div>

                {/* Line 2: Name (Grey) */}
                <p className="text-[15px] font-normal text-[var(--color-text-dim)] line-clamp-1">
                    {restaurant.name}
                </p>

                {/* Line 3: Delivery Time + Rating (Grey) */}
                <div className="flex justify-between items-center mt-0.5">
                    <p className="text-[15px] font-normal text-[var(--color-text-dim)]">
                        {deliveryTime || (lang === 'pt' ? '30-40 min' : '30-40 min')}
                    </p>
                    
                    <div className="flex items-center gap-1">
                        <Star size={12} className="fill-[var(--color-text-main)] text-[var(--color-text-main)]" />
                        <span className="text-[14px] font-normal text-[var(--color-text-main)]">{rating}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
});

RestaurantCard.displayName = 'RestaurantCard';