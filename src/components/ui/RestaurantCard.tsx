import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';

interface RestaurantCardProps {
    restaurant: any;
    isFavorite?: boolean;
    toggleFavorite?: (id: any) => Promise<void>;
    lang?: string;
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
    restaurant
}: RestaurantCardProps) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    
    const imageUrl = restaurant.image || restaurant.hero_image_url || restaurant.cover_url || getAtmosphereImage(restaurant.id);

    return (
        <Link
            to={`/restaurante/${restaurant.slug || restaurant.id}`}
            className="group relative block w-full aspect-[4/3] rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-out bg-neutral-100 dark:bg-neutral-900"
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
        </Link>
    );
});

RestaurantCard.displayName = 'RestaurantCard';