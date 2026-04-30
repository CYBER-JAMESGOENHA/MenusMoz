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

    const imageUrl = restaurant.image || restaurant.hero_image_url || restaurant.cover_url;
    const hasImage = !!imageUrl;
    const initial = restaurant.name?.[0]?.toUpperCase() || 'R';
    const isOpen = restaurant.isOpen !== false;

    return (
        <Link
            to={`/restaurante/${restaurant.slug || restaurant.id}`}
            className="group relative flex flex-col hover:-translate-1 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
        >
            {/* IMAGE CONTAINER */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[18px]">
                {hasImage ? (
                    <img
                        src={imageUrl}
                        alt={restaurant.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                ) : (
                    <div
                        className="w-full h-full flex items-center justify-center bg-surface"
                        style={{  
                            background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary), transparent 80%), color-mix(in srgb, var(--color-accent), transparent 90%))'  
                        }}
                    >
                        <span className="text-7xl font-display font-bold text-text-main opacity-20">
                            {initial}
                        </span>
                    </div>
                )}

                {/* Heart Favorite - Top Right */}
                <button
                    onClick={handleToggleFavorite}
                    className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 z-20
                        ${isFavorite
                            ? 'text-[var(--color-primary)] drop-shadow-md scale-125'
                            : 'text-white drop-shadow-md hover:scale-110'}`}
                    style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.4))' }}
                >
                    <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
                </button>
            </div>

            {/* CONTENT AREA */}
            <div className="mt-3 flex flex-col">
                {/* Line 1: Name | Rating */}
                <div className="flex items-center justify-between">
                    <h3 className="text-[15px] font-bold text-[var(--color-text-main)] line-clamp-1 normal-case">
                        {restaurant.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[14px] font-light text-[var(--color-text-main)]">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <span>{typeof restaurant.rating === 'number' ? restaurant.rating.toFixed(1) : restaurant.rating || '4.5'}</span>
                    </div>
                </div>

                {/* Line 2: Cuisine · Location */}
                <p className="text-[14px] font-light text-[var(--color-text-dim)] mt-0.5">
                    {restaurant.cuisine || 'Restaurante'} · {locationDisplay}
                </p>

                {/* Line 3: Price Range */}
                {restaurant.price_range && (
                    <p className="text-[14px] font-light text-[var(--color-text-dim)] mt-0.5">
                        {restaurant.price_range}
                    </p>
                )}

                {/* Line 4: Status */}
                <p 
                    className="text-[14px] font-bold mt-0.5"
                    style={{ color: isOpen ? 'var(--color-moz-green)' : 'var(--color-primary)' }}
                >
                    {isOpen ? (lang === 'pt' ? 'Aberto agora' : 'Open now') : (lang === 'pt' ? 'Fechado' : 'Closed')}
                </p>
            </div>
        </Link>
    );
});

RestaurantCard.displayName = 'RestaurantCard';