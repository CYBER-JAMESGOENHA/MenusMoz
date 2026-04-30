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

    return (
        <Link
            to={`/restaurante/${restaurant.slug || restaurant.id}`}
            className="group relative flex flex-col bg-surface rounded-[28px] overflow-hidden border border-border-subtle h-[340px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
        >
            {/* PHOTO AREA */}
            <div className="relative h-[180px] w-full overflow-hidden rounded-t-[28px]">
                {hasImage ? (
                    <img
                        src={imageUrl}
                        alt={restaurant.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                ) : (
                    <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ 
                            background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary), transparent 80%), color-mix(in srgb, var(--color-accent), transparent 90%))' 
                        }}
                    >
                        <span className="text-7xl font-display font-bold text-text-main opacity-20">
                            {initial}
                        </span>
                    </div>
                )}

                {/* Rating Badge - Top Left */}
                <div className="absolute top-3 left-3 z-20">
                    <div className="bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Star size={10} className="fill-amber-400 text-amber-400 stroke-[3px]" />
                        <span>{typeof restaurant.rating === 'number' ? restaurant.rating.toFixed(1) : restaurant.rating || '4.5'}</span>
                    </div>
                </div>

                {/* Heart Favorite - Top Right */}
                <button
                    onClick={handleToggleFavorite}
                    className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 z-20
                        ${isFavorite
                            ? 'text-primary drop-shadow-lg scale-125'
                            : 'text-white/90 hover:text-primary hover:scale-110'}`}
                >
                    <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
                </button>

                {/* Status Pill - Bottom Right */}
                <div className="absolute bottom-3 right-3 z-20">
                    <div className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5
                        ${restaurant.isOpen !== false ? 'bg-[var(--color-moz-green)] text-white' : 'bg-red-500 text-white'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full bg-white ${restaurant.isOpen !== false ? 'animate-pulse' : ''}`} />
                        {restaurant.isOpen !== false ? (lang === 'pt' ? 'Aberto agora' : 'Open now') : (lang === 'pt' ? 'Fechado' : 'Closed')}
                    </div>
                </div>

                {/* Logo - Bottom Left (overlapping) */}
                <div className="absolute bottom-0 left-4 z-20 translate-y-1/2">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md bg-white flex items-center justify-center">
                        <img
                            src={restaurant.logo_url || restaurant.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(restaurant.name || 'R')}&background=000&color=fff&size=128&bold=true`}
                            alt={`${restaurant.name} logo`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="flex-1 bg-surface px-4 pt-6 pb-4 rounded-b-[28px] flex flex-col">
                <div>
                    {/* Line 1: Name */}
                    <h3 className="font-display font-bold text-lg leading-tight text-text-main line-clamp-1 mb-1 normal-case">
                        {restaurant.name}
                    </h3>

                    {/* Line 2: Cuisine · Neighborhood */}
                    <p className="text-[12px] text-text-dim font-body">
                        {restaurant.cuisine || 'Restaurante'} · {locationDisplay}
                    </p>

                    {/* Line 3: Price Range */}
                    {restaurant.price_range && (
                        <p className="text-[12px] text-text-dim mt-1">
                            {restaurant.price_range}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
});

RestaurantCard.displayName = 'RestaurantCard';