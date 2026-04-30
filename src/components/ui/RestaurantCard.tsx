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
            className="group flex flex-col hover:-translate-y-0.5 transition-all duration-300 ease-out"
        >
            {/* IMAGE CONTAINER — ~72% of card height */}
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
                {hasImage ? (
                    <img
                        src={imageUrl}
                        alt={restaurant.name}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                ) : (
                    <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                            background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 20%, transparent 80%), color-mix(in srgb, var(--color-accent) 10%, transparent 90%)'
                        }}
                    >
                        <span className="text-8xl font-display font-bold text-[var(--color-text-main)] opacity-15">
                            {initial}
                        </span>
                    </div>
                )}

                {/* Rating — Top Left */}
                <div className="absolute top-3 left-3 z-20">
                    <div className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm">
                        <Star size={10} className="fill-amber-400 text-amber-400" />
                        <span className="text-[var(--color-text-main)]">{rating}</span>
                    </div>
                </div>

                {/* Heart — Top Right */}
                <button
                    onClick={handleToggleFavorite}
                    className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-transform duration-300 hover:scale-110"
                    style={{ color: isFavorite ? 'var(--color-primary)' : 'var(--color-text-main)' }}
                >
                    <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
                </button>

                {/* Status — Bottom Left */}
                {isOpen ? (
                    <div className="absolute bottom-3 left-3 z-20">
                        <span className="text-xs font-medium text-white bg-[var(--color-moz-green)]/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
                            {lang === 'pt' ? 'Aberto agora' : 'Open now'}
                        </span>
                    </div>
                ) : null}
            </div>

            {/* TEXT CONTENT — ~28% of card height */}
            <div className="mt-3 flex flex-col min-h-[88px]">
                {/* Line 1: Name */}
                <h3 className="text-[15px] font-medium text-[var(--color-text-main)] normal-case leading-snug line-clamp-1">
                    {restaurant.name}
                </h3>

                {/* Line 2: Cuisine + Location */}
                <p className="text-[14px] font-normal text-[var(--color-text-dim)] mt-0.5 line-clamp-1">
                    {restaurant.cuisine || 'Restaurante'} · {locationDisplay}
                </p>

                {/* Line 3: Delivery Time */}
                {deliveryTime && (
                    <p className="text-[13px] font-normal text-[var(--color-text-dim)] mt-0.5 opacity-80">
                        {deliveryTime}
                    </p>
                )}
            </div>
        </Link>
    );
});

RestaurantCard.displayName = 'RestaurantCard';