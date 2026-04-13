import React, { useRef, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';

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

    const handleLocationClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (restaurant.lat && restaurant.lng) {
            // Precise directions to exact GPS coordinates
            window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${restaurant.lat},${restaurant.lng}`,
                '_blank'
            );
        } else if (restaurant.location || restaurant.address) {
            window.open(
                `https://maps.google.com/maps?q=${encodeURIComponent(restaurant.location || restaurant.address)}`,
                '_blank'
            );
        } else {
            window.open(
                `https://maps.google.com/?q=${encodeURIComponent((restaurant.name || 'restaurante') + ' Moçambique')}`,
                '_blank'
            );
        }
    }, [restaurant]);

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

                {/* Location / Directions Badge */}
                <button
                    onClick={handleLocationClick}
                    title="Ver no Google Maps"
                    className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[12px] font-bold z-10 hover:bg-primary/80 hover:border-primary/40 transition-all duration-300 shadow-sm cursor-pointer active:scale-95"
                >
                    <span className="text-[13px] leading-none">📍</span>
                    <span className="truncate max-w-[120px]">
                        {restaurant.location
                            ? restaurant.location.split(',')[0]
                            : (restaurant.lat && restaurant.lng)
                                ? `${Number(restaurant.lat).toFixed(4)}, ${Number(restaurant.lng).toFixed(4)}`
                                : 'Ver no mapa'}
                    </span>
                    {(restaurant.lat && restaurant.lng) && (
                        <span className="text-emerald-400 text-[10px] font-black uppercase tracking-wider">GPS</span>
                    )}
                </button>

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
            <div className="p-4 flex flex-col gap-2.5">
                {/* 1. HEADER LINE */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 shrink-0 rounded-full overflow-hidden border border-border-subtle bg-surface flex items-center justify-center shadow-sm">
                        <img 
                            src={restaurant.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(restaurant.name || 'R')}&background=random&color=fff&size=128&bold=true`} 
                            alt={`${restaurant.name} logo`} 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    
                    <h3 className="text-[16px] flex-1 font-bold leading-tight text-text-main line-clamp-1 group-hover:text-primary transition-colors duration-300">
                        {restaurant.name}
                    </h3>

                    <div className="flex flex-col items-end gap-0.5 shrink-0">
                        <div className="flex items-center gap-1 text-[13px] font-bold text-text-main">
                            <span>{typeof restaurant.rating === 'number' ? restaurant.rating.toFixed(1) : restaurant.rating || '4.5'}</span>
                            <Star size={12} className="fill-amber-500 text-amber-500" />
                        </div>
                        <span className="text-[11px] font-bold tracking-wide uppercase text-emerald-600 dark:text-emerald-400">
                            {restaurant.isOpen !== false ? "Aberto agora" : "Fechado"}
                        </span>
                    </div>
                </div>

                {/* 2. DESCRIPTION LINE (IDENTITY TEXT) */}
                <p className="text-[13px] text-text-dim/80 font-medium line-clamp-1 leading-snug">
                    {restaurant.identity_text || restaurant.description || restaurant.cuisine}
                </p>

                {/* 3. ACTION BUTTONS */}
                <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-primary text-white text-[13px] font-bold py-2 px-4 rounded-[12px] flex items-center justify-center transition-colors group-hover:bg-primary/90">
                        Fazer Pedido
                    </div>
                    <div className="flex-1 bg-surface text-text-main border border-border-subtle text-[13px] font-bold py-2 px-4 rounded-[12px] flex items-center justify-center transition-colors group-hover:bg-gray-50 dark:group-hover:bg-white/5">
                        Ver Restaurante
                    </div>
                </div>
            </div>
        </Link>
    );
});


