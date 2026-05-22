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

    const highlightLine = useMemo(() => {
        if (descriptor) return descriptor;
        if (restaurant.specialty) return restaurant.specialty;
        
        const fallbacks = lang === 'pt' ? [
            'Especialidade da casa',
            'Popular entre clientes',
            'Boa opção para grupos',
            'Menu disponível'
        ] : [
            'House specialty',
            'Popular among clients',
            'Good option for groups',
            'Menu available'
        ];
        const index = Math.abs(Number(restaurant.id) || 0) % fallbacks.length;
        return fallbacks[index];
    }, [descriptor, restaurant.specialty, restaurant.id, lang]);

    const imageUrl = restaurant.image || restaurant.hero_image_url || restaurant.cover_url || getAtmosphereImage(restaurant.id);
    const logoUrl = restaurant.logo_url || restaurant.logo;
    const initial = restaurant.name?.[0]?.toUpperCase() || 'R';
    const rating = typeof restaurant.rating === 'number' ? restaurant.rating.toFixed(1) : restaurant.rating || '4.5';

    return (
        <Link
            to={`/restaurante/${restaurant.slug || restaurant.id}`}
            className="group relative flex flex-col bg-white dark:bg-[#121212] rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-out"
        >
            {/* IMAGE CONTAINER — Cinematic & Prominent (Concept A & B) */}
            <div className="relative aspect-[4/3] w-full bg-neutral-100 dark:bg-neutral-900">
                {/* Restaurant Image */}
                <img
                    src={imageUrl}
                    alt={restaurant.name}
                    loading="lazy"
                    decoding="async"
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImageLoaded(true)}
                />
                
                {/* Blur-up placeholder */}
                {!imageLoaded && (
                    <img
                        src={imageUrl}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-50"
                        aria-hidden="true"
                    />
                )}

                {/* Cinematic Gradient Overlays (Concept B Elegance) */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-10" />
                <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-10" />

                {/* Top Overlay: Favorite Heart */}
                <button
                    onClick={handleToggleFavorite}
                    aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/20 dark:bg-black/40 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/30 dark:hover:bg-black/60 border border-white/20"
                >
                    <Heart 
                        size={15} 
                        className={`transition-all duration-300 ${isFavorite ? 'fill-rose-500 text-rose-500 scale-110' : 'text-white'}`}
                        strokeWidth={2.5}
                    />
                </button>

                {/* Overlapping Logo (Concept A Structure) */}
                <div className="absolute -bottom-6 left-4 z-20 w-14 h-14 rounded-full overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.2)] border-[3px] border-white dark:border-[#121212] bg-white flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                    {logoUrl ? (
                        <img src={logoUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-lg font-bold tracking-tight text-neutral-400">
                            {initial}
                        </span>
                    )}
                </div>
            </div>

            {/* CONTENT AREA — Minimalist & Crisp (Concept B Elegance) */}
            <div className="pt-9 pb-5 px-5 flex flex-col gap-2.5 relative z-0">
                {/* Header Row: Name & Rating */}
                <div className="flex items-start justify-between gap-3">
                    <h3 className="font-body text-base font-bold text-neutral-900 dark:text-neutral-50 leading-tight truncate group-hover:text-primary transition-colors duration-300">
                        {restaurant.name}
                    </h3>
                    
                    {/* Premium Rating Badge */}
                    <div className="flex items-center gap-1 bg-neutral-100 dark:bg-white/10 px-1.5 py-0.5 rounded-md shrink-0">
                        <Star size={11} className="fill-primary text-primary" />
                        <span className="text-[11px] font-bold text-neutral-900 dark:text-neutral-100">{rating}</span>
                    </div>
                </div>

                {/* Metadata Row: Cuisine, Status, Location */}
                <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400 font-medium tracking-tight">
                    <span>{restaurant.cuisine || 'Restaurante'}</span>
                    <span className="text-neutral-300 dark:text-neutral-700">•</span>
                    <span className={`flex items-center gap-1 ${isOpen ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {isOpen ? (lang === 'pt' ? 'Aberto' : 'Open') : (lang === 'pt' ? 'Fechado' : 'Closed')}
                    </span>
                    <span className="text-neutral-300 dark:text-neutral-700">•</span>
                    <span className="flex items-center gap-0.5 truncate">
                        <MapPin size={11} className="shrink-0" />
                        <span className="truncate">{area}</span>
                    </span>
                </div>

                {/* Specialty / Highlight Line */}
                {highlightLine && (
                    <div className="mt-1 text-[11px] font-medium text-neutral-500 dark:text-neutral-400 italic border-l-2 border-primary/40 pl-2">
                        {highlightLine}
                    </div>
                )}

                {/* Elegant CTA Button */}
                <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-white/5">
                    <div className="w-full py-2 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-200/50 dark:border-white/5 flex items-center justify-center gap-1.5 transition-all duration-300 group-hover:bg-primary group-hover:border-primary group-hover:text-white">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 group-hover:text-white transition-colors duration-300">
                            {t.home.view_restaurant}
                        </span>
                        <ArrowRight size={11} className="text-neutral-400 dark:text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                </div>
            </div>
        </Link>
    );
});

RestaurantCard.displayName = 'RestaurantCard';