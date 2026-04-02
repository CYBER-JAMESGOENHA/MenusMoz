import React, { useRef, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { translations } from '../../translations';

interface RestaurantCardProps {
    restaurant: any;
    isFavorite: boolean;
    toggleFavorite: (id: any) => Promise<void>;
    lang: string;
}

export const RestaurantCard = memo(({ restaurant, isFavorite, toggleFavorite, lang }: RestaurantCardProps) => {
    const cardRef = useRef<HTMLAnchorElement>(null);

    const handleToggleFavorite = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(restaurant.id);
    }, [restaurant.id, toggleFavorite]);

    return (
        <Link
            to={`/restaurante/${restaurant.slug || restaurant.id}`}
            ref={cardRef}
            className="group relative flex flex-col bg-surface rounded-[24px] overflow-hidden border border-border-subtle h-fit shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 ease-in-out transform-gpu"
        >
            {/* Top Image Section */}
            <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08] group-hover:brightness-[0.92]"
                />
                
                {/* Elegant gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                {/* Favorite Button (Upgraded) */}
                <button
                    onClick={handleToggleFavorite}
                    aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 z-10 backdrop-blur-xl border shadow-xl
                        ${isFavorite 
                            ? 'bg-primary/90 border-primary/20 text-white' 
                            : 'bg-black/20 border-white/20 text-white hover:bg-black/40 hover:scale-110 active:scale-95'}`}
                >
                    <Heart size={20} className={`transition-transform duration-300 ${isFavorite ? 'fill-current scale-110' : 'group-hover/heart:scale-110'}`} />
                </button>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col gap-2.5">
                {/* Name & Rating */}
                <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[18px] font-extrabold leading-tight text-text-main line-clamp-1 group-hover:text-primary transition-colors duration-300">
                        {restaurant.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[13px] font-bold text-text-main bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 px-2 py-1 rounded-lg shrink-0 shadow-sm">
                        <Star size={14} className="fill-amber-500 text-amber-500" />
                        <span>{typeof restaurant.rating === 'number' ? restaurant.rating.toFixed(1) : restaurant.rating || '4.5'}</span>
                    </div>
                </div>

                {/* Identity & Distance */}
                <div className="flex items-end justify-between gap-4 mt-0.5">
                    <p className="text-[14px] text-text-dim/60 font-medium line-clamp-2 leading-snug">
                        {restaurant.identity_text || "Comida caseira, grelhados frescos, acompanhamentos"}
                    </p>
                    <div className="flex items-center gap-1 text-[13px] font-medium text-text-dim/80 shrink-0 whitespace-nowrap">
                        <span className="text-[14px] mb-0.5">📍</span>
                        <span>{restaurant.distance_km || restaurant.distance || "2.8"} km</span>
                    </div>
                </div>
            </div>
        </Link>
    );
});

