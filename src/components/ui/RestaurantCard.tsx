import React, { useCallback, memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

interface RestaurantCardProps {
    restaurant: any;
    isFavorite: boolean;
    toggleFavorite: (id: any) => Promise<void>;
    lang: string;
    userLatitude?: number | null;
    userLongitude?: number | null;
    userCity?: string | null;
    mode?: 'discovery' | 'delivery';
    variant?: 'default' | 'carousel';
}

const ATMOSPHERE_IMAGES = [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&q=80',
    'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400&q=80',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80',
];

const getAtmosphereImage = (id: number) => ATMOSPHERE_IMAGES[id % ATMOSPHERE_IMAGES.length];

export const RestaurantCard = memo(({
    restaurant,
    isFavorite,
    toggleFavorite,
    variant = 'default'
}: RestaurantCardProps) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    
    const handleToggleFavorite = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(restaurant.id);
    }, [restaurant.id, toggleFavorite]);

    const imageUrl = restaurant.image || restaurant.hero_image_url || restaurant.cover_url || getAtmosphereImage(restaurant.id);
    const logoUrl = restaurant.logo_url || restaurant.logo;
    const initial = restaurant.name?.[0]?.toUpperCase() || 'R';

    if (variant === 'carousel') {
        return (
            <Link
                to={`/restaurante/${restaurant.slug || restaurant.id}`}
                className="group relative flex flex-col w-full aspect-[16/15] sm:aspect-[16/9] rounded-[20px] overflow-hidden border border-black/5 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-out bg-white dark:bg-neutral-900"
            >
                {/* Upper section (6/10 or 60% height) for Restaurant Image */}
                <div className="relative w-full h-[60%] overflow-hidden shrink-0">
                    <img
                        src={imageUrl}
                        alt={restaurant.name}
                        loading="lazy"
                        decoding="async"
                        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setImageLoaded(true)}
                    />
                    
                    {!imageLoaded && (
                        <img
                            src={imageUrl}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-50"
                            aria-hidden="true"
                        />
                    )}

                    {/* Subtle top gradient for logo and heart button readability */}
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/45 to-transparent pointer-events-none z-10" />

                    {/* Top Row: Logo + Restaurant Name on Left, Heart Icon on Right */}
                    <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between gap-2">
                        {/* Logo + Name Badge */}
                        <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/10 shadow-sm max-w-[75%] shrink-0">
                            {/* Circular Logo */}
                            <div className="w-6.5 h-6.5 rounded-full overflow-hidden border border-white/30 bg-white flex items-center justify-center shrink-0 shadow-md">
                                {logoUrl ? (
                                    <img src={logoUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-[9px] font-bold text-neutral-400">
                                        {initial}
                                    </span>
                                )}
                            </div>

                            {/* Restaurant Name */}
                            <span className="text-[10px] font-bold text-white truncate max-w-[100px] drop-shadow-md font-body">
                                {restaurant.name}
                            </span>
                        </div>

                        {/* Favorite Heart */}
                        <button
                            onClick={handleToggleFavorite}
                            aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                            className="w-8.5 h-8.5 rounded-full bg-black/45 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-black/60 border border-white/10 shadow-md shrink-0"
                        >
                            <Heart 
                                size={15} 
                                className={`transition-all duration-300 ${isFavorite ? 'fill-rose-500 text-rose-500 scale-110' : 'text-white'}`}
                                strokeWidth={2.5}
                            />
                        </button>
                    </div>
                </div>

                {/* Lower section (4/10 or 40% height) for Restaurant Details */}
                <div className="relative w-full h-[40%] flex flex-col justify-between p-3.5 bg-white dark:bg-neutral-900 border-t border-black/5 dark:border-white/5">
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate font-display">
                            {restaurant.name}
                        </h3>
                        
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 truncate font-body">
                            {restaurant.cuisine || (restaurant.cuisines && restaurant.cuisines[0]?.name) || 'Restaurante'}
                        </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 font-body">
                        {/* Rating */}
                        <div className="flex items-center gap-1">
                            <span className="flex items-center text-amber-500 font-semibold gap-0.5">
                                ★ {restaurant.rating ? restaurant.rating.toFixed(1) : '4.5'}
                            </span>
                            {restaurant.reviewCount !== undefined && (
                                <span className="text-neutral-400 dark:text-neutral-500">
                                    ({restaurant.reviewCount})
                                </span>
                            )}
                        </div>

                        {/* Neighborhood / City */}
                        <span className="truncate max-w-[80px] text-neutral-400 dark:text-neutral-500">
                            {restaurant.location || restaurant.address?.split(',')[0] || 'Maputo'}
                        </span>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link
            to={`/restaurante/${restaurant.slug || restaurant.id}`}
            className="group relative block w-full aspect-[16/15] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-out bg-neutral-100 dark:bg-neutral-900"
        >
            {/* Restaurant Image */}
            <img
                src={imageUrl}
                alt={restaurant.name}
                loading="lazy"
                decoding="async"
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
            />
            
            {/* Blur-up placeholder */}
            {!imageLoaded && (
                <img
                    src={imageUrl}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-50"
                    aria-hidden="true"
                />
            )}

            {/* Subtle top gradient for heart readability */}
            <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/45 to-transparent pointer-events-none z-10" />

            {/* Top-right Favorite Heart */}
            <button
                onClick={handleToggleFavorite}
                aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                className="absolute top-3 right-3 z-20 w-9.5 h-9.5 rounded-full bg-black/45 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-black/60 border border-white/10 shadow-md"
            >
                <Heart 
                    size={17} 
                    className={`transition-all duration-300 ${isFavorite ? 'fill-rose-500 text-rose-500 scale-110' : 'text-white'}`}
                    strokeWidth={2.5}
                />
            </button>

            {/* Bottom shadow/gradient for logo/text readability */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none z-10" />

            {/* Bottom-left Brand row directly on image */}
            <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2.5">
                {/* Circular Logo */}
                <div className="w-8.5 h-8.5 rounded-full overflow-hidden border border-white/30 bg-white flex items-center justify-center shrink-0 shadow-lg">
                    {logoUrl ? (
                        <img src={logoUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-[10px] font-bold text-neutral-400">
                            {initial}
                        </span>
                    )}
                </div>

                {/* Restaurant Name */}
                <span className="text-xs font-bold text-white truncate max-w-[150px] drop-shadow-md font-body">
                    {restaurant.name}
                </span>
            </div>
        </Link>
    );
});

RestaurantCard.displayName = 'RestaurantCard';