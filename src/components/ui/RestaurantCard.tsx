import React, { useCallback, memo, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, ArrowRight } from 'lucide-react';
import { calculateDistance } from '../../hooks/useUserLocation';
import { translations } from '../../translations';

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

    const distanceInfo = useMemo(() => {
        if (!userLatitude || !userLongitude || !restaurant.latitude || !restaurant.longitude) return null;
        const distance = calculateDistance(userLatitude, userLongitude, restaurant.latitude, restaurant.longitude);
        if (distance < 1) return '< 1 km';
        return `${distance.toFixed(1)} km`;
    }, [userLatitude, userLongitude, restaurant.latitude, restaurant.longitude]);

    const area = useMemo(() => {
        const source = restaurant.address || restaurant.location || '';
        const parts = source.split(',').map((p: string) => p.trim());
        const knownAreas = ['Polana', 'Baixa', 'Sommerschield', 'Triunfo', 'Costa do Sol', 'Matola', 'Liberdade'];
        for (const known of knownAreas) {
            if (source.includes(known)) return known;
        }
        return parts[0] || restaurant.city || 'Maputo';
    }, [restaurant.address, restaurant.location, restaurant.city]);

    const descriptor = useMemo(() => {
        if (restaurant.identity_text) return restaurant.identity_text;
        if (restaurant.tags && restaurant.tags.length > 0) {
            const extraTag = restaurant.tags.find((t: any) => t !== restaurant.cuisine);
            if (extraTag) return extraTag;
        }
        if (restaurant.features && restaurant.features.length > 0) return restaurant.features[0];
        
        const fallbacks = [
            'Hidden Gem', 'Local Favorite', 'Sunset Spot', 
            'Rooftop Dining', 'Authentic Taste', 'Curated Experience',
            'City Classic', 'Modern Discovery'
        ];
        return fallbacks[Number(restaurant.id) % fallbacks.length];
    }, [restaurant.id, restaurant.identity_text, restaurant.tags, restaurant.features, restaurant.cuisine]);

    const imageUrl = restaurant.image || restaurant.hero_image_url || restaurant.cover_url;
    const logoUrl = restaurant.logo_url || restaurant.logo;
    const hasImage = !!imageUrl;
    const initial = restaurant.name?.[0]?.toUpperCase() || 'R';
    const rating = typeof restaurant.rating === 'number' ? restaurant.rating.toFixed(1) : restaurant.rating || '4.5';

    return (
        <Link
            to={`/restaurante/${restaurant.slug || restaurant.id}`}
            className="group relative flex flex-col bg-white dark:bg-[#0A0A0A] rounded-3xl overflow-hidden border border-neutral-100 dark:border-white/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15),0_8px_20px_-8px_rgba(220,38,38,0.06)] hover:-translate-y-1.5 transition-all duration-500 ease-out"
        >
            {/* IMAGE CONTAINER — Premium Restaurant Preview */}
            <div className="relative aspect-[4/3] w-full overflow-hidden">
                {/* Atmosphere Background (warm placeholder) */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-[#1a1714] dark:via-[#1f1b18] dark:to-[#181615]">
                    <div className="absolute inset-0 opacity-30" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }} />
                </div>

                {/* Subtle radial gradient for depth */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.15)_100%)]" />

                {/* Restaurant Image */}
                {hasImage ? (
                    <>
                        <img
                            src={imageUrl}
                            alt={restaurant.name}
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                            onLoad={() => setImageLoaded(true)}
                        />
                        {/* Blur-up placeholder while loading */}
                        {!imageLoaded && (
                            <img
                                src={imageUrl}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-60"
                                aria-hidden="true"
                            />
                        )}
                    </>
                ) : (
                    <>
                        <img
                            src={getAtmosphereImage(restaurant.id)}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover opacity-40 blur-[1px] scale-105"
                            aria-hidden="true"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-md flex items-center justify-center">
                                <span className="text-2xl font-display font-black italic text-amber-900/70 dark:text-amber-100/50">
                                    {initial}
                                </span>
                            </div>
                        </div>
                    </>
                )}

                {/* Elegant Image Overlay — Top Gradient */}
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />
                
                {/* Bottom Atmospheric Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 via-black/20 to-transparent pointer-events-none" />

                {/* Top Overlay: Favorite Heart — Floating Style */}
                <button
                    onClick={handleToggleFavorite}
                    className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-white/50 dark:border-white/10 hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)]"
                >
                    <Heart 
                        size={15} 
                        className={`transition-all duration-300 ${isFavorite ? 'fill-primary text-primary scale-110' : 'text-neutral-600 dark:text-white/80'}`}
                        strokeWidth={2.5}
                    />
                </button>

                {/* Cuisine Badge — Bottom Left */}
                {restaurant.cuisine && (
                    <div className="absolute bottom-3 left-3 z-20">
                        <span className="px-2.5 py-1 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-md text-[10px] font-semibold uppercase tracking-wide text-neutral-800 dark:text-white/90 shadow-sm border border-white/30 dark:border-white/10">
                            {restaurant.cuisine}
                        </span>
                    </div>
                )}
            </div>

            {/* CONTENT AREA — Refined Information Hierarchy */}
            <div className="p-4 pb-3 flex flex-col gap-0">
                {/* Header Row: Logo, Name, Rating */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden min-w-0">
                        {/* Restaurant Logo */}
                        <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 shadow-sm border border-neutral-100 dark:border-white/10 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-[#1a1a1a] dark:to-[#121212]">
                            {logoUrl ? (
                                <img src={logoUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-sm font-display font-black italic text-neutral-300 dark:text-neutral-600">
                                        {initial}
                                    </span>
                                </div>
                            )}
                        </div>
                        
                        {/* Name & Cuisine */}
                        <div className="flex flex-col min-w-0">
                            <h3 className="font-display text-[15px] font-black italic text-text-main dark:text-white truncate leading-tight group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300">
                                {restaurant.name}
                            </h3>
                            <p className="text-[10px] font-medium text-text-dim dark:text-neutral-500 truncate mt-0.5">
                                {restaurant.cuisine || 'Restaurante'}
                            </p>
                        </div>
                    </div>

                    {/* Rating Badge — Airbnb Style */}
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 flex-shrink-0">
                        <Star size={10} className="fill-white text-white opacity-90" />
                        <span className="text-[10px] font-bold text-white tracking-tight">{rating}</span>
                    </div>
                </div>

                {/* Editorial Metadata Row */}
                <div className="mt-2.5 flex items-center gap-2.5 text-[10px] sm:text-[11px] whitespace-nowrap overflow-hidden">
                    <div className="flex items-center gap-1.5 text-neutral-400 dark:text-neutral-500 shrink-0">
                        <MapPin size={11} strokeWidth={1.5} className="opacity-70" />
                        <span className="font-medium tracking-tight">{area}</span>
                    </div>
                    <span className="text-neutral-200 dark:text-neutral-800 font-light shrink-0">•</span>
                    <span className="font-medium text-neutral-500/80 dark:text-neutral-400/70 truncate tracking-tight">
                        {descriptor}
                    </span>
                </div>

                {/* CTA Button — Premium Touchpoint */}
                <div className="mt-3.5">
                    <div className="w-full py-2.5 rounded-xl bg-neutral-50/80 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06] flex items-center justify-center gap-2 group-hover:bg-primary group-hover:border-primary/20 transition-all duration-400 ease-out">
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-dim dark:text-neutral-400 group-hover:text-white transition-colors duration-400">
                            {t.home.view_restaurant}
                        </span>
                        <ArrowRight size={13} className="text-neutral-400 dark:text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-400" />
                    </div>
                </div>
            </div>
        </Link>
    );
});

RestaurantCard.displayName = 'RestaurantCard';