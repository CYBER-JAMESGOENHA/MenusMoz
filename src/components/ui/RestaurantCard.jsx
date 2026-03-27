import React, { useRef, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowUpRight, Star } from 'lucide-react';
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
            className="group relative bg-surface rounded-custom-lg overflow-hidden card-hover border border-border-subtle flex flex-col block h-full"
        >
            <div className="relative h-48 sm:h-56 overflow-hidden shrink-0">
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                
                <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                    <div className="flex gap-2">
                        <div className="bg-white/95 backdrop-blur-xl px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] text-primary shadow-sm">
                            {restaurant.cuisines?.[0]?.name || restaurant.cuisine}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] backdrop-blur-xl shadow-sm ${restaurant.isOpen ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                            {restaurant.isOpen ? t.open_now : t.closed}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleToggleFavorite}
                    aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 z-10 ${isFavorite ? 'bg-primary text-white scale-110 shadow-primary-glow' : 'bg-white/90 glass text-black hover:bg-white'}`}
                >
                    <Heart size={18} fill={isFavorite ? "currentColor" : "none"} className={isFavorite ? "animate-pulse" : ""} />
                </button>
                
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                     <p className="text-white text-[10px] font-medium line-clamp-2 italic">"{restaurant.description}"</p>
                </div>
            </div>

            <div className="p-4 md:p-5 flex-1 flex flex-col bg-surface relative">
                <div className="absolute -top-5 right-4 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                    <ArrowUpRight size={20} />
                </div>

                <div className="flex items-start gap-3 mb-auto">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-[3px] border-surface shadow-md shrink-0 -mt-8 relative z-10 bg-surface">
                        <img src={restaurant.image} alt={restaurant.name} loading="lazy" className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex flex-col flex-1 pb-1">
                        <h3 className="text-lg font-display font-black leading-tight text-text-main group-hover:text-primary transition-colors line-clamp-1">{restaurant.name}</h3>
                        {restaurant.rating && (
                            <div className="flex items-center gap-1 mt-0.5">
                                <Star size={12} className="text-accent" fill="currentColor" />
                                <span className="text-xs font-bold text-text-dim">{restaurant.rating.toFixed(1)}</span>
                                <span className="text-[10px] text-text-dim/60 font-medium">({restaurant.reviewCount || 0})</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
});
