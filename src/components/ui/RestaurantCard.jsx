import React, { useRef, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, Clock, Bike, Circle } from 'lucide-react';
import { translations } from '../../translations';

export const RestaurantCard = memo(({ restaurant, isFavorite, toggleFavorite, lang }) => {
    const cardRef = useRef(null);
    const t = translations[lang]?.home ?? translations.pt.home;

    const handleToggleFavorite = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(restaurant.id);
    }, [restaurant.id, toggleFavorite]);

    return (
        <Link
            to={`/restaurante/${restaurant.slug}`}
            ref={cardRef}
            className="group relative flex flex-col bg-surface rounded-2xl overflow-hidden card-hover border border-border-subtle h-full shadow-sm hover:shadow-md transition-shadow duration-300"
        >
            {/* Top Image Section */}
            <div className="relative h-[150px] sm:h-[160px] w-full shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Subtle overlay for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                {/* Top Left Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                    {/* Featured/Promo Badge */}
                    <div className="bg-primary text-white px-2 py-1 rounded text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                        <Star size={10} className="fill-white" /> Destaque
                    </div>
                </div>

                {/* Favorite Button */}
                <button
                    onClick={handleToggleFavorite}
                    aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center transition-transform hover:scale-110 shadow-sm z-10 text-text-main"
                >
                    <Heart size={16} className={isFavorite ? "fill-primary text-primary" : "text-gray-700 dark:text-gray-300"} />
                </button>

                {/* Delivery Time Badge (Floating Bottom Right on Image) */}
                <div className="absolute bottom-3 right-3 bg-white dark:bg-surface text-text-main px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md flex items-center gap-1.5">
                    <Clock size={12} className="text-gray-600 dark:text-gray-400" />
                    <span>25-40 min</span>
                </div>
            </div>

            {/* Bottom Content Section */}
            <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between bg-surface relative">
                
                {/* Floating Logo - Smaller and more refined. Overlaps image. */}
                <div className="absolute -top-6 left-4 w-12 h-12 rounded-full border-[3px] border-surface overflow-hidden bg-surface shadow-sm z-20">
                    <img src={restaurant.image} alt={`${restaurant.name} Logo`} loading="lazy" className="w-full h-full object-cover" />
                </div>

                <div className="mt-7 flex flex-col gap-2 relative z-10">
                    
                    {/* Title and Rating Row */}
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="text-[15px] sm:text-base font-bold leading-tight text-text-main line-clamp-1">{restaurant.name}</h3>
                        {restaurant.rating && (
                            <div className="flex items-center gap-1 bg-gray-50 dark:bg-white/5 shrink-0 rounded-full px-1.5 py-0.5 border border-border-subtle shadow-sm drop-shadow-sm">
                                <span className="text-[11px] font-bold text-text-main">{restaurant.rating.toFixed(1)}</span>
                                <Star size={10} className="text-[#FFC107] fill-[#FFC107]" />
                                <span className="text-[9px] text-text-dim ml-0.5">({restaurant.reviewCount || '50+'})</span>
                            </div>
                        )}
                    </div>

                    {/* Metadata Row: Category, Price, Neighborhood */}
                    <div className="flex items-center flex-wrap gap-1.5 text-text-dim text-[11px] sm:text-xs font-medium">
                        <span className="truncate max-w-[100px]">{restaurant.cuisines?.[0]?.name || restaurant.cuisine || "Restaurante"}</span>
                        <Circle size={3} className="fill-current opacity-40" />
                        <span className="flex items-center gap-0.5"><MapPin size={10}/> {restaurant.neighborhood?.name || restaurant.neighborhood || "Maputo"}</span>
                        {restaurant.priceRange && (
                            <>
                                <Circle size={3} className="fill-current opacity-40" />
                                <span>{restaurant.priceRange}</span>
                            </>
                        )}
                    </div>

                    {/* Delivery Fee, Status Info Row */}
                    <div className="mt-0.5 flex items-center gap-3 text-[11px] sm:text-xs text-text-dim border-t border-border-subtle pt-2.5">
                        <div className="flex items-center gap-1">
                            <Bike size={12} className="text-gray-500 hover:text-primary transition-colors cursor-pointer" />
                            <span>Entrega: <strong className="font-semibold text-text-main">150 MT</strong></span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 ml-auto">
                            <span className="relative flex h-2 w-2">
                              {restaurant.isOpen && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                              <span className={`relative inline-flex rounded-full h-2 w-2 ${restaurant.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            </span>
                            <span className={`font-semibold ${restaurant.isOpen ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                                {restaurant.isOpen ? t.open_now : t.closed}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
});

