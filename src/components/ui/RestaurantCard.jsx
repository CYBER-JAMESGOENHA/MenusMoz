import React, { useRef, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ChevronRight, MapPin } from 'lucide-react';
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
            className="group relative bg-[#121212] rounded-2xl overflow-hidden card-hover border border-white/10 flex flex-col block h-[420px] sm:h-[460px] shadow-xl"
        >
            <div className="relative flex-1 overflow-hidden shrink-0">
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                
                {/* Top Pills */}
                <div className="absolute top-4 left-4 flex gap-2">
                    <div className="bg-white px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#E53935] shadow-sm">
                        {restaurant.cuisines?.[0]?.name || restaurant.cuisine || "RESTAURANTE"}
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-sm ${restaurant.isOpen ? 'bg-[#0BB653] text-white' : 'bg-red-500 text-white'}`}>
                        {restaurant.isOpen ? t.open_now : t.closed}
                    </div>
                </div>

                {/* Favorite Button */}
                <button
                    onClick={handleToggleFavorite}
                    aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white flex items-center justify-center transition-transform hover:scale-105 shadow-md z-10 text-black"
                >
                    <Heart size={20} fill={isFavorite ? "black" : "none"} />
                </button>
            </div>

            {/* Bottom Section */}
            <div className="bg-[#121212] p-4 sm:p-5 relative flex flex-col shrink-0 min-h-[140px] z-20 border-t border-white/5">
                {/* Floating Logo */}
                <div className="absolute -top-10 left-4 sm:-top-12 sm:left-5 w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-[#121212] overflow-hidden bg-white shadow-lg pointer-events-none">
                    <img src={restaurant.image} alt={`${restaurant.name} Logo`} loading="lazy" className="w-full h-full object-cover" />
                </div>

                {/* Title & Rating */}
                <div className="ml-[88px] sm:ml-[108px] flex flex-col justify-start">
                    <h3 className="text-xl sm:text-2xl font-bold leading-tight text-white line-clamp-1">{restaurant.name}</h3>
                    {restaurant.rating && (
                        <div className="flex items-center gap-1 mt-1">
                            {/* Rendering 5 stars directly for layout matching */}
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} className={i < Math.floor(restaurant.rating) ? "text-[#FFC107]" : (i < restaurant.rating ? "text-[#FFC107] opacity-60" : "text-white/20")} fill="currentColor" />
                            ))}
                            <span className="text-[11px] sm:text-xs font-medium text-white ml-2">
                                {restaurant.rating.toFixed(1)} <span className="opacity-80">({restaurant.reviewCount || 0} Reviews)</span>
                            </span>
                        </div>
                    )}
                </div>

                {/* Extra Info & CTA (Revealed or bottom aligned) */}
                <div className="mt-4 flex items-center justify-between pl-1">
                    <div className="flex items-center gap-3 text-white/70 text-xs font-medium">
                        {restaurant.neighborhood && (
                            <div className="flex items-center gap-1">
                                <MapPin size={12} />
                                <span className="line-clamp-1">{restaurant.neighborhood.name || restaurant.neighborhood}</span>
                            </div>
                        )}
                        {restaurant.priceRange && (
                            <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] tracking-widest">{restaurant.priceRange}</span>
                        )}
                    </div>
                    
                    <button className="flex items-center justify-center gap-1 bg-white hover:bg-white/90 text-black px-4 py-2 rounded-full text-xs font-bold transition-colors group-hover:bg-primary group-hover:text-white">
                        <span>Ver Mais</span>
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </Link>
    );
});

