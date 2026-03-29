import React, { useRef, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, Clock, Bike, Circle, Tag } from 'lucide-react';
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
            to={`/restaurante/${restaurant.slug || restaurant.id}`}
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
                <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                    {/* Featured Badge */}
                    {(restaurant.is_featured || restaurant.isFeatured) && (
                        <div className="bg-primary text-white px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                            DESTAQUE
                        </div>
                    )}
                    {/* New Badge */}
                    {(restaurant.is_new || restaurant.isNew) && (
                        <div className="bg-green-600 text-white px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                            Novo
                        </div>
                    )}
                </div>

                {/* Favorite Button */}
                <button
                    onClick={handleToggleFavorite}
                    aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center transition-transform hover:scale-110 shadow-sm z-10 text-text-main"
                >
                    <Heart size={16} className={isFavorite ? "fill-primary text-primary" : "text-gray-700 dark:text-gray-300"} />
                </button>

                {/* ETA Pill (Floating Bottom Left on Image) */}
                <div className="absolute bottom-3 left-3 bg-white dark:bg-surface text-text-main px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${(restaurant.is_busy || restaurant.isBusy) ? 'bg-amber-500' : 'bg-green-500'}`}></span>
                    <Clock size={12} className="text-gray-600 dark:text-gray-400" />
                    <span>{restaurant.eta_min || restaurant.eta || "25-40 min"}</span>
                </div>

                {/* Distance Pill (Floating Bottom Right on Image) */}
                <div className="absolute bottom-3 right-3 bg-white dark:bg-surface text-text-main px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md flex items-center gap-1.5">
                    <MapPin size={12} className="text-gray-600 dark:text-gray-400" />
                    <span>{restaurant.distance_km || restaurant.distance || "2.8"} km</span>
                </div>
            </div>

            {/* Bottom Content Section */}
            <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between bg-surface relative">
                
                <div className="flex flex-col gap-2 relative z-10 mb-2">
                    {/* Title and Rating Row */}
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="text-[15px] sm:text-base font-bold leading-tight text-text-main line-clamp-1">{restaurant.name}</h3>
                        {restaurant.rating !== undefined && (
                            <div className="flex items-center gap-1 bg-gray-50 dark:bg-white/5 shrink-0 rounded-full px-1.5 py-0.5 border border-border-subtle shadow-sm drop-shadow-sm">
                                <Star size={10} className="text-[#FFC107] fill-[#FFC107]" />
                                <span className="text-[11px] font-bold text-text-main">{typeof restaurant.rating === 'number' ? restaurant.rating.toFixed(1) : restaurant.rating}</span>
                                <span className="text-[9px] text-text-dim ml-0.5">· {restaurant.review_count || restaurant.reviewCount || '0'}</span>
                            </div>
                        )}
                    </div>

                    {/* Category + Neighbourhood */}
                    <div className="flex items-center flex-wrap gap-1.5 text-text-dim text-[11px] sm:text-xs font-medium">
                        <span className="truncate max-w-[120px]">{restaurant.category || restaurant.cuisines?.[0]?.name || restaurant.cuisine || "Restaurante"}</span>
                        <Circle size={3} className="fill-current opacity-40" />
                        <span className="flex items-center gap-0.5">{restaurant.neighbourhood || restaurant.neighborhood?.name || restaurant.neighborhood || "Maputo"}</span>
                    </div>

                    {/* Popular dish chips */}
                    {restaurant.popular_dishes && restaurant.popular_dishes.length > 0 && (
                        <div className="flex gap-1.5 mt-1 overflow-x-auto no-scrollbar pb-1">
                            {restaurant.popular_dishes.slice(0, 3).map((dish, i) => (
                                <span key={i} className="flex-shrink-0 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full text-[10px] font-medium border border-gray-200 dark:border-gray-700 whitespace-nowrap">
                                    {dish}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Card footer */}
                <div className="mt-auto flex items-end justify-between border-t border-border-subtle pt-3">
                    <div className="flex flex-col gap-0.5">
                        <div className="text-[11px] sm:text-xs text-text-dim">
                            Entrega: <strong className="font-semibold text-text-main">{restaurant.delivery_fee_mt !== undefined ? `${restaurant.delivery_fee_mt} MT` : '150 MT'}</strong>
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-text-dim">
                            Valor médio: <strong className="font-semibold text-text-main">~{restaurant.avg_order_mt !== undefined ? `${restaurant.avg_order_mt} MT` : '620 MT'}</strong>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                            {restaurant.isOpen !== false && !(restaurant.is_busy || restaurant.isBusy) && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${restaurant.isOpen === false ? 'bg-gray-400' : (restaurant.is_busy || restaurant.isBusy) ? 'bg-amber-500' : 'bg-green-500'}`}></span>
                        </span>
                        <span className={`font-semibold text-[11px] sm:text-xs ${restaurant.isOpen === false ? 'text-gray-500' : (restaurant.is_busy || restaurant.isBusy) ? 'text-amber-500' : 'text-green-600 dark:text-green-400'}`}>
                            {restaurant.isOpen === false ? t.closed : (restaurant.is_busy || restaurant.isBusy) ? 'Movimentado' : 'Aberto'}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
});

