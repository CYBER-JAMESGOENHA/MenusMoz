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
    toggleFavorite
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

    return (
        <Link
            to={`/restaurante/${restaurant.slug || restaurant.id}`}
            className="group relative block w-full aspect-[20/9] xs:aspect-[20/9.5] sm:aspect-[16/9.5] rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-out bg-neutral-100 dark:bg-neutral-900"
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

            {/* Gradient Overlay for bottom text readability */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none z-10" />

            {/* Top-right Favorite Heart */}
            <button
                onClick={handleToggleFavorite}
                aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-black/60 border border-white/10"
            >
                <Heart 
                    size={13} 
                    className={`transition-all duration-300 ${isFavorite ? 'fill-rose-500 text-rose-500 scale-110' : 'text-white'}`}
                    strokeWidth={2.5}
                />
            </button>

            {/* Bottom-left Logo and Name */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 flex items-center gap-2">
                {/* Circular Logo */}
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-white/20 bg-white flex items-center justify-center shrink-0 shadow-md">
                    {logoUrl ? (
                        <img src={logoUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-[10px] font-bold text-neutral-400">
                            {initial}
                        </span>
                    )}
                </div>

                {/* Restaurant Name */}
                <span className="text-xs sm:text-sm font-bold text-white truncate drop-shadow-sm font-body">
                    {restaurant.name}
                </span>
            </div>
        </Link>
    );
});

RestaurantCard.displayName = 'RestaurantCard';