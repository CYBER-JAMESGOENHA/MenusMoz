import React, { useRef, useCallback, memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ArrowRight, MapPin, Clock, Utensils, Bike, Navigation } from 'lucide-react';
import { calculateDistance } from '../../hooks/useUserLocation';

interface RestaurantCardProps {
    restaurant: any;
    isFavorite: boolean;
    toggleFavorite: (id: any) => Promise<void>;
    lang: string;
    userLatitude?: number | null;
    userLongitude?: number | null;
    userCity?: string | null;
}

export const RestaurantCard = memo(({ restaurant, isFavorite, toggleFavorite, lang, userLatitude, userLongitude, userCity }: RestaurantCardProps) => {
    const cardRef = useRef<HTMLAnchorElement>(null);

    const handleToggleFavorite = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(restaurant.id);
    }, [restaurant.id, toggleFavorite]);

    const distanceInfo = useMemo(() => {
        if (!userLatitude || !userLongitude || !restaurant.latitude || !restaurant.longitude) return null;
        const distance = calculateDistance(userLatitude, userLongitude, restaurant.latitude, restaurant.longitude);
        if (distance < 1) return '< 1 km';
        return `${distance.toFixed(1)} km`;
    }, [userLatitude, userLongitude, restaurant.latitude, restaurant.longitude]);

    const locationDisplay = useMemo(() => {
        if (distanceInfo) return distanceInfo;
        return restaurant.location?.split(',')[0] || 'Maputo';
    }, [distanceInfo, restaurant.location]);

    return (
        <Link
            to={`/restaurante/${restaurant.slug || restaurant.id}`}
            ref={cardRef}
            className="group relative flex flex-col bg-surface rounded-[28px] overflow-hidden border border-border-subtle h-full min-h-[340px] p-6 sm:p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        >
            {/* Ambient Background Radial Gradient (Top Right, Diffuse) */}
            <div 
                className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-[0.05] transition-all duration-1000 group-hover:opacity-[0.1]"
                style={{ 
                    background: `radial-gradient(circle at 100% 0%, var(--color-primary), transparent 80%)` 
                }} 
            />

            {/* Floating Rating Badge (Anchored to top-right edge) */}
            <div className="absolute top-0 right-0 z-20">
                <div className="bg-text-main text-white px-4 py-2 rounded-bl-2xl font-black text-[14px] shadow-xl flex items-center gap-1.5 transition-transform duration-500 group-hover:scale-110 origin-top-right">
                    <span>{typeof restaurant.rating === 'number' ? restaurant.rating.toFixed(1) : restaurant.rating || '4.5'}</span>
                    <Star size={12} className="fill-white text-white mb-0.5" />
                </div>
            </div>

            {/* Header: Logo & Name (Side-by-Side) */}
            <div className="flex items-start gap-4 mb-5 relative z-10">
                {/* Circular Logo Avatar */}
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border-subtle shadow-lg bg-surface flex items-center justify-center shrink-0 transition-transform duration-700 group-hover:rotate-3 group-hover:scale-105">
                    <img 
                        src={restaurant.logo_url || restaurant.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(restaurant.name || 'R')}&background=000&color=fff&size=128&bold=true`} 
                        alt={`${restaurant.name} logo`} 
                        className="w-full h-full object-cover" 
                    />
                </div>

                {/* Restaurant Name */}
                <div className="mt-1 pr-12">
                    <h3 className="text-2xl font-bold leading-tight text-text-main tracking-tight mb-2 transition-colors duration-300 group-hover:text-primary line-clamp-2">
                        {restaurant.name}
                    </h3>
                    
                    {/* Location / Navigation Button */}
                    <div className="flex items-center gap-2">
                        <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${restaurant.latitude ? `${restaurant.latitude},${restaurant.longitude}` : encodeURIComponent(restaurant.location || restaurant.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => { e.stopPropagation(); }}
                            className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-text-main/80 bg-black/5 hover:bg-primary/10 hover:text-primary px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-colors border border-black/5 dark:bg-white/5 dark:border-white/5 z-20"
                        >
                            <Navigation size={12} className="text-primary/80" />
                            {locationDisplay}
                        </a>
                    </div>
                </div>
            </div>

            {/* Quick Info Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-4 relative z-10">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-hover text-text-main/80 border border-border-subtle/50">
                    <Utensils size={13} className="text-text-dim" />
                    <span className="text-xs font-semibold">{restaurant.cuisine || 'Gourmet'}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary/5 text-primary border border-primary/10">
                    <Clock size={13} />
                    <span className="text-xs font-semibold">{restaurant.delivery_time || '30-40 min'}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-hover text-text-main/80 border border-border-subtle/50">
                    <Bike size={13} className="text-text-dim" />
                    <span className="text-xs font-semibold">{restaurant.delivery_fee === 0 ? 'Grátis' : (restaurant.delivery_fee ? `MT ${restaurant.delivery_fee}` : 'Entrega')}</span>
                </div>
            </div>

            {/* Body: Short Description (Muted Sans-serif) */}
            <div className="mb-4 relative z-10 max-w-[95%] flex-1">
                <p className="text-[14px] text-text-dim/80 font-body leading-relaxed line-clamp-3">
                    {restaurant.identity_text || restaurant.description || "Experiência gastronómica única com sabores autênticos e ingredientes selecionados."}
                </p>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-5 flex items-center justify-between border-t border-border-subtle relative z-10">
                <div className="flex items-center gap-2.5">
                    <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${restaurant.isOpen !== false ? 'bg-moz-green shadow-[0_0_10px_rgba(0,154,68,0.4)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]'}`} />
                    <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${restaurant.isOpen !== false ? 'text-moz-green' : 'text-red-500'}`}>
                        {restaurant.isOpen !== false ? (lang === 'pt' ? 'ABERTO AGORA' : 'OPEN NOW') : (lang === 'pt' ? 'FECHADO' : 'CLOSED')}
                    </span>
                </div>
                
                <div className="flex items-center gap-2 text-text-dim group-hover:text-primary transition-colors duration-300">
                    <span className="text-[11px] font-bold uppercase tracking-widest hidden sm:inline opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                        {lang === 'pt' ? 'Ver Menú' : 'View Menu'}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-surface-hover flex items-center justify-center transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:scale-110 shadow-sm border border-border-subtle">
                        <ArrowRight size={18} />
                    </div>
                </div>
            </div>

            {/* Subtle Favorite Heart */}
            <button
                onClick={handleToggleFavorite}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 z-20 bg-surface/50 backdrop-blur-sm border border-border-subtle/50
                    ${isFavorite 
                        ? 'text-red-500 drop-shadow-md scale-110' 
                        : 'text-text-dim/50 hover:text-red-500 hover:scale-110'}`}
            >
                <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
            </button>
        </Link>
    );
});




