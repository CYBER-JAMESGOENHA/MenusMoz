import React, { useCallback, memo, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, ArrowRight } from 'lucide-react';
import { calculateDistance } from '../../hooks/useUserLocation';
import { translations } from '../../translations';
import { checkIsOpen } from '../../utils/timeUtils';

interface RestaurantCardProps {
    restaurant: any;
    isFavorite: boolean;
    toggleFavorite: (id: any) => Promise<void>;
    lang: string;
    userLatitude?: number | null;
    userLongitude?: number | null;
    userCity?: string | null;
    mode?: 'discovery' | 'delivery';
}

const ATMOSPHERE_IMAGES = [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&q=80',
    'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400&q=80',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80',
];

const getAtmosphereImage = (id: number) => ATMOSPHERE_IMAGES[id % ATMOSPHERE_IMAGES.length];

export const RestaurantCard = memo(({
    restaurant,
    isFavorite,
    toggleFavorite,
    lang,
    userLatitude,
    userLongitude,
    userCity,
    mode = 'delivery'
}: RestaurantCardProps) => {
    const t = translations[lang as 'pt' | 'en'] || translations.pt;
    const [imageLoaded, setImageLoaded] = useState(false);
    
    const handleToggleFavorite = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(restaurant.id);
    }, [restaurant.id, toggleFavorite]);

    const isOpen = useMemo(() => {
        if (restaurant.isOpen !== undefined) return restaurant.isOpen;
        if (restaurant.is_open !== undefined) return restaurant.is_open;
        if (restaurant.hours) return checkIsOpen(restaurant.hours);
        return true;
    }, [restaurant.isOpen, restaurant.is_open, restaurant.hours]);

    const distanceInfo = useMemo(() => {
        if (!userLatitude || !userLongitude || !restaurant.latitude || !restaurant.longitude) return null;
        const distance = calculateDistance(userLatitude, userLongitude, restaurant.latitude, restaurant.longitude);
        if (distance < 1) return '< 1 km';
        return `${distance.toFixed(1)} km`;
    }, [userLatitude, userLongitude, restaurant.latitude, restaurant.longitude]);

    const area = useMemo(() => {
        const source = (restaurant.address || restaurant.location || '').toLowerCase();
        const knownAreas = ['Polana', 'Baixa', 'Sommerschield', 'Triunfo', 'Costa do Sol', 'Matola', 'Liberdade', 'Malhangalene', 'Coop', 'Alto Maé'];
        
        for (const known of knownAreas) {
            if (source.includes(known.toLowerCase())) return known;
        }
        
        // Fallback to first part of address if it looks like a neighborhood (short, no numbers)
        const parts = (restaurant.address || restaurant.location || '').split(',');
        const firstPart = parts[0]?.trim();
        if (firstPart && firstPart.length < 15 && !/\d/.test(firstPart)) {
            return firstPart;
        }
        
        return restaurant.city || 'Maputo';
    }, [restaurant.address, restaurant.location, restaurant.city]);

    const descriptor = useMemo(() => {
        if (restaurant.identity_text && restaurant.identity_text.split(/\s+/).length <= 3) {
            return restaurant.identity_text;
        }
        if (restaurant.tags && restaurant.tags.length > 0) {
            const shortTag = restaurant.tags.find((t: any) =>
                t !== restaurant.cuisine &&
                typeof t === 'string' &&
                t.split(/\s+/).length <= 3
            );
            if (shortTag) return shortTag;
        }
        if (restaurant.features && restaurant.features.length > 0) {
            const shortFeature = restaurant.features.find((f: any) =>
                typeof f === 'string' &&
                f.split(/\s+/).length <= 3
            );
            if (shortFeature) return shortFeature;
        }
        return '';
    }, [restaurant.identity_text, restaurant.tags, restaurant.features, restaurant.cuisine]);

    const imageUrl = restaurant.image || restaurant.hero_image_url || restaurant.cover_url || getAtmosphereImage(restaurant.id);
    const logoUrl = restaurant.logo_url || restaurant.logo;
    const initial = restaurant.name?.[0]?.toUpperCase() || 'R';
    const rating = typeof restaurant.rating === 'number' ? restaurant.rating.toFixed(1) : restaurant.rating || '4.5';

    return (
        <Link
            to={`/restaurante/${restaurant.slug || restaurant.id}`}
            className="group relative flex flex-col bg-surface dark:bg-[#1E1C1B] rounded-xl overflow-hidden border border-border-subtle dark:border-white/5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-500 ease-out"
        >
            {/* IMAGE CONTAINER — Premium Restaurant Preview */}
            <div className="relative aspect-[3/2] w-full overflow-hidden">
                {/* Atmosphere Background (warm placeholder) */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-neutral-900/60 dark:via-zinc-900/40 dark:to-neutral-950/60">
                    <div className="absolute inset-0 opacity-30" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }} />
                </div>

                {/* Restaurant Image */}
                <img
                    src={imageUrl}
                    alt={restaurant.name}
                    loading="lazy"
                    decoding="async"
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImageLoaded(true)}
                />
                {/* Blur-up placeholder while loading */}
                {!imageLoaded && (
                    <img
                        src={imageUrl}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-60"
                        aria-hidden="true"
                    />
                )}

                {/* Elegant Image Overlay — Top Gradient (Softer) */}
                <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/15 to-transparent pointer-events-none" />

                {/* Open/Closed Badge — Top Left */}
                <div className="absolute top-2.5 left-2.5 z-20">
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider shadow-sm border backdrop-blur-md ${isOpen ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                        {isOpen ? (lang === 'pt' ? 'Aberto' : 'Open') : (lang === 'pt' ? 'Fechado' : 'Closed')}
                    </span>
                </div>

                {/* Top Overlay: Favorite Heart — Floating Style */}
                <button
                    onClick={handleToggleFavorite}
                    aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    aria-pressed={isFavorite}
                    className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-white/50 dark:border-white/10 hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)]"
                >
                    <Heart 
                        size={13} 
                        className={`transition-all duration-300 ${isFavorite ? 'fill-primary text-primary scale-110' : 'text-neutral-600 dark:text-white/80'}`}
                        strokeWidth={2.5}
                    />
                </button>
            </div>

            {/* CONTENT AREA — Refined Information Hierarchy */}
            <div className="p-3 pb-2.5 flex flex-col gap-0">
                {/* Header Row: Logo, Name, Rating */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden min-w-0">
                        {/* Restaurant Logo */}
                        <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 shadow-sm border border-neutral-200/50 dark:border-white/10 bg-white dark:bg-neutral-800/80 flex items-center justify-center">
                            {logoUrl ? (
                                <img src={logoUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-sm font-semibold tracking-tight text-neutral-400 dark:text-neutral-500">
                                    {initial}
                                </span>
                            )}
                        </div>
                        
                        {/* Name & Cuisine */}
                        <div className="flex flex-col min-w-0 justify-center">
                            <h3 className="font-display text-[13.5px] font-bold text-text-main dark:text-white truncate leading-tight group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300">
                                {restaurant.name}
                            </h3>
                            <p className="text-[9px] font-semibold text-text-dim dark:text-neutral-500 truncate mt-0.5 uppercase tracking-wide">
                                {restaurant.cuisine || 'Restaurante'}
                            </p>
                        </div>
                    </div>

                    {/* Rating Badge — Airbnb Style */}
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 flex-shrink-0">
                        <Star size={9} className="fill-primary text-primary" />
                        <span className="text-[9px] font-bold text-white tracking-tight">{rating}</span>
                    </div>
                </div>

                {/* Editorial Metadata Row — Airbnb Inspired */}
                <div className="mt-1 flex items-center gap-1 text-[9px] whitespace-nowrap overflow-hidden">
                    <div className="flex items-center gap-1 text-neutral-400 dark:text-neutral-500 shrink-0">
                        <MapPin size={9.5} strokeWidth={1.5} className="opacity-50" />
                        <span className="font-medium tracking-tight">{area}</span>
                    </div>
                    {descriptor && (
                        <>
                            <span className="text-neutral-200 dark:text-neutral-800 font-light shrink-0">•</span>
                            <span className="font-medium text-neutral-500 dark:text-neutral-400 truncate tracking-tight">
                                {descriptor}
                            </span>
                        </>
                    )}
                </div>

                {/* CTA Button — Premium Touchpoint */}
                <div className="mt-2.5">
                    <div className="w-full py-1.5 rounded-lg bg-neutral-100/50 dark:bg-neutral-800/20 border border-neutral-200/60 dark:border-white/5 flex items-center justify-center gap-1.5 transition-all duration-300 ease-out group-hover:bg-neutral-200/50 dark:group-hover:bg-neutral-800/50 group-hover:border-primary/30">
                        <span className="text-[9.5px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300">
                            {t.home.view_restaurant}
                        </span>
                        <ArrowRight size={9.5} className="text-neutral-500 dark:text-neutral-500 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300" />
                    </div>
                </div>
            </div>
        </Link>
    );
});

RestaurantCard.displayName = 'RestaurantCard';