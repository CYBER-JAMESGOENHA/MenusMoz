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
        const lifestyleFallbacks = [
            'Hidden Gem', 'Rooftop Dining', 'Live Music', 
            'Local Favorite', 'Sunset Spot', 'Fine Dining',
            'Street Favorite', 'Authentic Taste', 'Classic Spot',
            'Garden Seating', 'City Views', 'Elegant Dining'
        ];

        let text = '';
        // Prioritize short, punchy metadata
        if (restaurant.identity_text && restaurant.identity_text.split(/\s+/).length <= 3) {
            text = restaurant.identity_text;
        } else if (restaurant.tags && restaurant.tags.length > 0) {
            // Find a short tag that isn't the main cuisine
            const shortTag = restaurant.tags.find((t: any) => 
                t !== restaurant.cuisine && 
                typeof t === 'string' && 
                t.split(/\s+/).length <= 3
            );
            text = shortTag || '';
        } else if (restaurant.features && restaurant.features.length > 0) {
            const shortFeature = restaurant.features.find((f: any) => 
                typeof f === 'string' && 
                f.split(/\s+/).length <= 3
            );
            text = shortFeature || '';
        }

        // Final check: if text is empty or too long, use a curated lifestyle fallback
        if (!text || text.split(/\s+/).length > 3 || text.length > 22) {
            return lifestyleFallbacks[Number(restaurant.id) % lifestyleFallbacks.length];
        }

        return text;
    }, [restaurant.id, restaurant.identity_text, restaurant.tags, restaurant.features, restaurant.cuisine]);

    const imageUrl = restaurant.image || restaurant.hero_image_url || restaurant.cover_url;
    const logoUrl = restaurant.logo_url || restaurant.logo;
    const hasImage = !!imageUrl;
    const initial = restaurant.name?.[0]?.toUpperCase() || 'R';
    const rating = typeof restaurant.rating === 'number' ? restaurant.rating.toFixed(1) : restaurant.rating || '4.5';

    return (        <Link
            to={`/restaurante/${restaurant.slug || restaurant.id}`}
            className="group relative flex flex-col bg-white dark:bg-[#121212] rounded-2xl overflow-hidden border border-neutral-100 dark:border-white/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_-12px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-500 ease-out"
        >
            {/* IMAGE CONTAINER — Premium Restaurant Preview */}
            <div className="relative aspect-[16/11] w-full overflow-hidden">
                {/* Atmosphere Background (warm placeholder) */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-orange-50/50 to-rose-50/50 dark:from-[#1a1714] dark:via-[#181615] dark:to-[#161413]">
                    <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }} />
                </div>

                {/* Subtle radial gradient for depth */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.1)_100%)]" />

                {/* Restaurant Image */}
                {hasImage ? (
                    <>
                        <img
                            src={imageUrl}
                            alt={restaurant.name}
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                            onLoad={() => setImageLoaded(true)}
                        />
                        {/* Blur-up placeholder while loading */}
                        {!imageLoaded && (
                            <img
                                src={imageUrl}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-40"
                                aria-hidden="true"
                            />
                        )}
                    </>
                ) : (
                    <>
                        <img
                            src={getAtmosphereImage(restaurant.id)}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover opacity-30 blur-[1px] scale-105"
                            aria-hidden="true"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md flex items-center justify-center">
                                <span className="text-xl font-display font-black italic text-amber-900/40 dark:text-amber-100/30">
                                    {initial}
                                </span>
                            </div>
                        </div>
                    </>
                )}

                {/* Elegant Image Overlay — Top Gradient */}
                <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
                
                {/* Bottom Atmospheric Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />

                {/* Top Overlay: Favorite Heart — Floating Style */}
                <button
                    onClick={handleToggleFavorite}
                    className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm border border-white/40 dark:border-white/5"
                >
                    <Heart 
                        size={13} 
                        className={`transition-all duration-300 ${isFavorite ? 'fill-primary text-primary scale-110' : 'text-neutral-500 dark:text-white/60'}`}
                        strokeWidth={2.5}
                    />
                </button>

                {/* Cuisine Badge — Bottom Left */}
                {restaurant.cuisine && (
                    <div className="absolute bottom-2.5 left-2.5 z-20">
                        <span className="px-2 py-0.5 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md text-[9px] font-bold uppercase tracking-wider text-neutral-700 dark:text-white/80 border border-white/30 dark:border-white/5">
                            {restaurant.cuisine}
                        </span>
                    </div>
                )}
            </div>

            {/* CONTENT AREA — Refined Information Hierarchy */}
            <div className="p-3.5 pb-2.5 flex flex-col gap-0">
                {/* Header Row: Logo, Name, Rating */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
                        {/* Restaurant Logo */}
                        <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border border-neutral-100 dark:border-white/5 bg-neutral-50 dark:bg-[#1a1a1a]">
                            {logoUrl ? (
                                <img src={logoUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-[10px] font-display font-black italic text-neutral-300 dark:text-neutral-700">
                                        {initial}
                                    </span>
                                </div>
                            )}
                        </div>
                        
                        {/* Name & Subtitle */}
                        <div className="flex flex-col min-w-0">
                            <h3 className="font-display text-[13px] font-bold italic text-text-main dark:text-neutral-100 truncate leading-tight group-hover:text-primary transition-colors duration-300">
                                {restaurant.name}
                            </h3>
                            <p className="text-[9px] font-medium text-text-dim dark:text-neutral-500 truncate mt-0.5">
                                {restaurant.cuisine || 'Restaurante'}
                            </p>
                        </div>
                    </div>

                    {/* Rating Badge */}
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-neutral-50 dark:bg-white/[0.03] border border-neutral-100 dark:border-white/5 flex-shrink-0">
                        <Star size={9} className="fill-amber-400 text-amber-400" />
                        <span className="text-[9px] font-bold text-neutral-700 dark:text-neutral-300 tracking-tight">{rating}</span>
                    </div>
                </div>

                {/* Editorial Metadata Row */}
                <div className="mt-2 flex items-center gap-1.5 text-[10px] whitespace-nowrap overflow-hidden">
                    <div className="flex items-center gap-1 text-neutral-400 dark:text-neutral-600 shrink-0">
                        <MapPin size={9} strokeWidth={1.5} />
                        <span className="font-medium tracking-tight">{area}</span>
                    </div>
                    <span className="text-neutral-200 dark:text-neutral-800 font-light shrink-0">•</span>
                    <span className="font-medium text-neutral-500 dark:text-neutral-500 truncate tracking-tight">
                        {descriptor}
                    </span>
                </div>

                {/* CTA Link — Subtle Arrow */}
                <div className="mt-3 flex items-center justify-between">
                    <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-text-dim/40 dark:text-neutral-600 group-hover:text-primary transition-colors">
                        {t.home.view_restaurant}
                    </span>
                    <ArrowRight size={11} className="text-neutral-300 dark:text-neutral-700 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
            </div>
        </Link>
    );
});

RestaurantCard.displayName = 'RestaurantCard';