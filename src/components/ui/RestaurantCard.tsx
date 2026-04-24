import React, { useRef, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ArrowRight } from 'lucide-react';

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
            className="group relative flex flex-col bg-surface rounded-[32px] overflow-hidden border border-border-subtle h-[340px] p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
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
            <div className="flex items-start gap-5 mb-6 relative z-10">
                {/* Circular Logo Avatar */}
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-2xl bg-surface flex items-center justify-center shrink-0 transition-transform duration-700 group-hover:rotate-3 group-hover:scale-105">
                    <img 
                        src={restaurant.logo_url || restaurant.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(restaurant.name || 'R')}&background=000&color=fff&size=128&bold=true`} 
                        alt={`${restaurant.name} logo`} 
                        className="w-full h-full object-cover" 
                    />
                </div>

                {/* Restaurant Name (Unusually large, Premium Serif) */}
                <div className="mt-2 pr-12">
                    <h3 className="text-[34px] font-display font-black leading-[0.85] text-text-main tracking-tighter mb-3 transition-colors duration-300 group-hover:text-primary">
                        {restaurant.name}
                    </h3>
                    
                    {/* Metadata Pills (Text-only) */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dim/60">
                            {restaurant.location?.split(',')[0] || 'Maputo'}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dim/60">
                            {restaurant.cuisine || 'Gourmet'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Body: Short Description (Muted Sans-serif) */}
            <div className="mb-4 relative z-10 max-w-[90%] flex-1">
                <p className="text-[15px] text-text-dim/70 font-body font-medium leading-relaxed line-clamp-3 italic">
                    {restaurant.identity_text || restaurant.description || "Experiência gastronómica única com sabores autênticos e ingredientes selecionados."}
                </p>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-6 flex items-center justify-between border-t border-border-subtle relative z-10">
                <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-moz-green shadow-[0_0_10px_rgba(0,154,68,0.4)] animate-pulse" />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-moz-green">
                        {restaurant.isOpen !== false ? (lang === 'pt' ? 'ABERTO AGORA' : 'OPEN NOW') : (lang === 'pt' ? 'FECHADO' : 'CLOSED')}
                    </span>
                </div>
                
                <div className="flex items-center gap-2 text-text-dim group-hover:text-primary transition-colors duration-300">
                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                        {lang === 'pt' ? 'Ver Menú' : 'View Menu'}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:scale-110 shadow-sm">
                        <ArrowRight size={20} />
                    </div>
                </div>
            </div>

            {/* Subtle Favorite Heart */}
            <button
                onClick={handleToggleFavorite}
                className={`absolute top-24 right-8 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 z-20
                    ${isFavorite 
                        ? 'text-primary drop-shadow-lg scale-125' 
                        : 'text-text-dim/30 hover:text-primary hover:scale-110'}`}
            >
                <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
            </button>
        </Link>
    );
});




