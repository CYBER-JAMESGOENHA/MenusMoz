import React, { useRef, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Clock, MapPin } from 'lucide-react';
import { translations } from '../../translations';

interface RestaurantCardProps {
    restaurant: any;
    isFavorite: boolean;
    toggleFavorite: (id: any) => Promise<void>;
    lang: string;
}

export const RestaurantCard = memo(({ restaurant, isFavorite, toggleFavorite, lang }: RestaurantCardProps) => {
    const cardRef = useRef<HTMLAnchorElement>(null);
    const t = (translations[lang as keyof typeof translations] as any)?.home ?? translations.pt.home;

    const handleToggleFavorite = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(restaurant.id);
    }, [restaurant.id, toggleFavorite]);

    const isOpen = restaurant.isOpen !== false;
    const isBusy = restaurant.is_busy || restaurant.isBusy;

    return (
        <Link
            to={`/restaurante/${restaurant.slug || restaurant.id}`}
            ref={cardRef}
            className="group relative flex flex-col bg-surface rounded-[20px] overflow-hidden border border-border-subtle h-fit shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 ease-in-out transform-gpu"
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

                {/* Status Indicator (Minimal) */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold tracking-wide">
                    <span className={`w-2 h-2 rounded-full ${!isOpen ? 'bg-gray-400' : isBusy ? 'bg-amber-400' : 'bg-green-500'} ${isOpen && !isBusy ? 'animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]' : ''}`}></span>
                    {!isOpen ? t.closed : isBusy ? (lang === 'pt' ? 'Muitos pedidos' : 'Very Busy') : t.open_now}
                </div>

                {/* Popular/Top Rated Badge */}
                {(restaurant.rating >= 4.5 || restaurant.is_featured) && (
                    <div className="absolute top-3 right-14 px-2.5 py-1 rounded-full bg-primary/95 text-white text-[9px] font-black uppercase tracking-wider shadow-lg backdrop-blur-sm">
                        {restaurant.rating >= 4.7 ? (lang === 'pt' ? 'Elite' : 'Elite') : (lang === 'pt' ? 'Popular' : 'Popular')}
                    </div>
                )}

                {/* Favorite Button (Upgraded) */}
                <button
                    onClick={handleToggleFavorite}
                    aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    className={`absolute top-2.5 right-2.5 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 z-10 backdrop-blur-xl border shadow-xl
                        ${isFavorite 
                            ? 'bg-primary/90 border-primary/20 text-white' 
                            : 'bg-white/10 border-white/20 text-white hover:bg-white/30 hover:scale-110 active:scale-95'}`}
                >
                    <Heart size={20} className={`transition-transform duration-300 ${isFavorite ? 'fill-current scale-110' : 'group-hover/heart:scale-110'}`} />
                </button>
            </div>

            {/* Content Section */}
            <div className="p-4 sm:p-5 flex flex-col gap-1">
                {/* Restaurant Name */}
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base sm:text-[17px] font-extrabold leading-tight text-text-main truncate group-hover:text-primary transition-colors duration-300">
                        {restaurant.name}
                    </h3>
                </div>

                {/* Rating + Category */}
                <div className="flex items-center gap-2 text-xs font-semibold">
                    <div className="flex items-center gap-1 text-amber-500">
                        <Star size={14} className="fill-current" />
                        <span className="text-text-main">
                            {typeof restaurant.rating === 'number' ? restaurant.rating.toFixed(1) : restaurant.rating}
                        </span>
                    </div>
                    <span className="text-text-dim/30">•</span>
                    <span className="text-text-dim/90 truncate">
                        {restaurant.category || restaurant.cuisines?.[0]?.name || "Restaurante"}
                    </span>
                </div>

                {/* Delivery Info: Time + Distance */}
                <div className="flex items-center gap-3 text-[11px] sm:text-xs text-text-dim/70 font-medium mt-1">
                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/50 px-2 py-0.5 rounded-md border border-gray-100 dark:border-gray-700/50">
                        <Clock size={12} className="text-text-dim/50" />
                        <span>{restaurant.eta_min || restaurant.eta || "25-40"} min</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/50 px-2 py-0.5 rounded-md border border-gray-100 dark:border-gray-700/50">
                        <MapPin size={12} className="text-text-dim/50" />
                        <span>{restaurant.distance_km || restaurant.distance || "2.8"} km</span>
                    </div>
                </div>

                {/* Price (Lower Priority) */}
                <div className="mt-2.5 pt-2.5 border-t border-border-subtle/30 flex items-center justify-between">
                    <div className="text-[12px] font-bold text-text-dim/80">
                        <span className="text-text-main font-black">
                            {restaurant.avg_consumption_mt || restaurant.avg_order_mt || '850'} MT
                        </span>
                        <span className="text-[10px] ml-1 font-medium opacity-60">/ pessoa</span>
                    </div>
                    
                    <div className="flex gap-1.5">
                        {restaurant.is_halal && (
                            <span className="w-5 h-5 rounded-md bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-[9px] font-black text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50" title="Halal">H</span>
                        )}
                        {restaurant.is_vegetarian && (
                            <span className="w-5 h-5 rounded-md bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-[9px] font-black text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800/50" title="Veggie">V</span>
                        )}
                    </div>
                </div>
            </div>

        </Link>
    );
});

