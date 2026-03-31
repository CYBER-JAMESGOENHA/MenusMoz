import React, { useRef, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, Circle } from 'lucide-react';
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

    return (
        <Link
            to={`/restaurante/${restaurant.slug || restaurant.id}`}
            ref={cardRef}
            className="group relative flex flex-col bg-surface rounded-2xl overflow-hidden card-hover border border-border-subtle h-full shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
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

                {/* Top Left Badges and Dietary Info */}
                <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5 z-10">
                    <div className="flex flex-wrap items-center gap-1.5">
                        {/* Featured Badge */}
                        {(restaurant.is_featured || restaurant.isFeatured) && (
                            <div className="bg-primary/90 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1">
                                DESTAQUE
                            </div>
                        )}
                        {/* New Badge */}
                        {(restaurant.is_new || restaurant.isNew) && (
                            <div className="bg-emerald-600/90 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1">
                                Novo
                            </div>
                        )}
                    </div>
                    {/* Dietary Tags */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        {(restaurant.is_halal || restaurant.isHalal || restaurant.name?.toLowerCase().includes('halal') || restaurant.category === 'Indiana' || restaurant.category === 'Médio Oriente') && (
                            <div className="bg-white/95 dark:bg-black/80 backdrop-blur-md text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded text-[9px] font-extrabold tracking-wider uppercase shadow-sm flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_#10b981]"></span> Halal
                            </div>
                        )}
                        {(restaurant.is_vegetarian || restaurant.isVegetarian || restaurant.category === 'Saudável' || restaurant.category === 'Vegetariana') && (
                            <div className="bg-white/95 dark:bg-black/80 backdrop-blur-md text-green-700 dark:text-green-400 border border-green-500/30 px-1.5 py-0.5 rounded text-[9px] font-extrabold tracking-wider uppercase shadow-sm flex items-center gap-1">
                                <span>VEGGIE</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Favorite Button */}
                <button
                    onClick={handleToggleFavorite}
                    aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 dark:bg-black/60 dark:hover:bg-black/80 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm z-10 text-white border border-white/10"
                >
                    <Heart size={16} className={isFavorite ? "fill-primary text-primary" : "text-white"} />
                </button>

                {/* Conversational & Digital Info Pills */}
                <div className="absolute bottom-3 left-3 flex flex-col gap-1.5 z-10">
                    <div className="bg-black/70 backdrop-blur-md text-white/90 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-medium shadow-lg border border-white/10 flex items-center gap-1.5 group-hover:bg-primary/90 group-hover:text-white transition-all duration-300">
                        <span className={`h-1.5 w-1.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] ${(restaurant.is_busy || restaurant.isBusy) ? 'bg-amber-400' : 'bg-green-400'} animate-pulse`}></span>
                        <span className="tracking-tight">{(restaurant.is_busy || restaurant.isBusy) ? 'Alta procura:' : 'Chega em'} <strong className="font-bold">{restaurant.eta_min || restaurant.eta || "25-40"} min</strong></span>
                    </div>
                </div>

                {/* Distance Pill */}
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white/90 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-medium shadow-lg border border-white/10 flex items-center gap-1.5 hover:bg-black/90 transition-colors z-10">
                    <MapPin size={10} className="text-white/70" />
                    <span className="tracking-tight">A <strong className="font-bold">{restaurant.distance_km || restaurant.distance || "2.8"}km</strong> de si</span>
                </div>
            </div>

            {/* Bottom Content Section */}
            <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between bg-surface relative">
                
                <div className="flex flex-col gap-2 relative z-10 mb-2">
                    {/* Title and Rating Row */}
                    <div className="flex justify-between items-center gap-2">
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            {/* Logo */}
                            <div className="shrink-0 w-8 h-8 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-center">
                                <img
                                    src={restaurant.logo || restaurant.logoUrl || restaurant.image}
                                    alt={`${restaurant.name} logo`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            
                            <h3 className="text-[15px] sm:text-base font-bold leading-tight text-text-main truncate" title={restaurant.name}>
                                {restaurant.name}
                            </h3>
                        </div>
                        {restaurant.rating !== undefined && (
                            <div className="flex items-center gap-1 bg-[#fff8e6] dark:bg-yellow-900/20 shrink-0 rounded-full px-2 py-0.5 border border-[#ffe082] dark:border-yellow-900/50 shadow-sm drop-shadow-sm">
                                <Star size={10} className="text-[#FFC107] fill-[#FFC107]" />
                                <span className="text-[11px] font-bold text-amber-900 dark:text-amber-400">{typeof restaurant.rating === 'number' ? restaurant.rating.toFixed(1) : restaurant.rating}</span>
                                {restaurant.review_count !== undefined && (
                                    <span className="text-[9px] text-amber-700/70 dark:text-amber-500/70 ml-0.5">· {restaurant.review_count || restaurant.reviewCount || '0'}</span>
                                )}
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
                            {restaurant.popular_dishes.slice(0, 3).map((dish: string, i: number) => (
                                <span key={i} className="flex-shrink-0 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full text-[10px] font-medium border border-gray-200 dark:border-gray-700 whitespace-nowrap">
                                    {dish}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Card footer - "Digital" and Communicative */}
                <div className="mt-auto flex items-center justify-between border-t border-border-subtle/60 pt-3">
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                            <span className="text-[9px] sm:text-[10px] uppercase tracking-widest font-extrabold text-text-dim/80">
                                Consumo Médio
                            </span>
                            <span className="text-[12px] sm:text-[13px] font-black text-text-main font-mono tracking-tighter mt-0.5">
                                {restaurant.avg_consumption_mt || restaurant.avg_order_mt || '850'} <span className="text-[10px] text-text-dim font-sans font-bold uppercase">MT / Pessoa</span>
                            </span>
                        </div>
                    </div>
                    
                    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border shadow-sm shrink-0 backdrop-blur-sm transition-colors ${restaurant.isOpen === false ? 'bg-gray-50/50 border-gray-200 dark:bg-gray-800/30 dark:border-gray-700/50' : (restaurant.is_busy || restaurant.isBusy) ? 'bg-amber-50/50 border-amber-200/60 dark:bg-amber-900/10 dark:border-amber-700/30' : 'bg-green-50/50 border-green-200/60 dark:bg-green-900/10 dark:border-green-700/30'}`}>
                        <span className="relative flex h-2 w-2">
                            {restaurant.isOpen !== false && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${(restaurant.is_busy || restaurant.isBusy) ? 'bg-amber-400' : 'bg-green-400'}`}></span>}
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${restaurant.isOpen === false ? 'bg-gray-400' : (restaurant.is_busy || restaurant.isBusy) ? 'bg-amber-500' : 'bg-green-500 z-10'}`}></span>
                        </span>
                        <span className={`font-bold text-[9px] sm:text-[10px] uppercase tracking-wide ${restaurant.isOpen === false ? 'text-gray-500' : (restaurant.is_busy || restaurant.isBusy) ? 'text-amber-700 dark:text-amber-400' : 'text-green-700 dark:text-green-400'}`}>
                            {restaurant.isOpen === false ? 'Encerrado' : (restaurant.is_busy || restaurant.isBusy) ? 'Muitos pedidos' : 'Pronto a Servir'}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
});
