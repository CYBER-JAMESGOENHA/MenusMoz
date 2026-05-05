import React, { useCallback, memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin } from 'lucide-react';
import { calculateDistance } from '../../hooks/useUserLocation';

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

    const deliveryTime = useMemo(() => {
        if (restaurant.delivery_time) return `${restaurant.delivery_time} min`;
        if (restaurant.delivery_min_time && restaurant.delivery_max_time) {
            return `${restaurant.delivery_min_time}–${restaurant.delivery_max_time} min`;
        }
        return '25-40 min';
    }, [restaurant.delivery_time, restaurant.delivery_min_time, restaurant.delivery_max_time]);

    const imageUrl = restaurant.image || restaurant.hero_image_url || restaurant.cover_url;
    const logoUrl = restaurant.logo_url || restaurant.logo;
    const hasImage = !!imageUrl;
    const initial = restaurant.name?.[0]?.toUpperCase() || 'R';
    const isOpen = restaurant.isOpen !== false;
    const rating = typeof restaurant.rating === 'number' ? restaurant.rating.toFixed(1) : restaurant.rating || '4.5';

    return (
        <Link
            to={`/restaurante/${restaurant.slug || restaurant.id}`}
            className="group flex flex-col transition-all duration-500 ease-out"
        >
            {/* IMAGE CONTAINER — Premium Rounded with Overlays */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] bg-neutral-100 shadow-sm border border-neutral-100">
                {hasImage ? (
                    <img
                        src={imageUrl}
                        alt={restaurant.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-50">
                        <span className="text-5xl font-sans font-bold text-neutral-200">
                            {initial}
                        </span>
                    </div>
                )}

                {/* Top Overlay: Favorite Heart */}
                <button
                    onClick={handleToggleFavorite}
                    className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:bg-black/40 hover:scale-110 active:scale-95"
                >
                    <Heart 
                        size={20} 
                        className={`transition-colors duration-300 ${isFavorite ? 'fill-[#FF385C] text-[#FF385C]' : 'text-white'}`}
                        strokeWidth={2.5}
                    />
                </button>

                {/* Bottom Overlays: Delivery & Distance */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-20">
                    <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                        <span className="text-[11px] font-bold text-white uppercase tracking-tight">
                            Chega em {deliveryTime}
                        </span>
                    </div>
                    <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10">
                        <MapPin size={12} className="text-white/70" />
                        <span className="text-[11px] font-bold text-white uppercase tracking-tight">
                            A {distanceInfo || '2.8km'} de si
                        </span>
                    </div>
                </div>

                {/* Subtle bottom gradient for readability */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </div>

            {/* CONTENT AREA — Modern Information Hierarchy */}
            <div className="mt-4 px-1">
                {/* Header Row: Logo, Name, Rating */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden flex-shrink-0 bg-neutral-100">
                            {logoUrl ? (
                                <img src={logoUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-neutral-200 text-neutral-500 font-bold text-xs">
                                    {initial}
                                </div>
                            )}
                        </div>
                        <h3 className="font-display text-lg font-black italic uppercase tracking-tighter truncate leading-tight group-hover:text-primary transition-colors duration-300">
                            {restaurant.name}
                        </h3>
                    </div>
                    <div className="bg-[#FEF3C7] px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm flex-shrink-0 border border-amber-200/50">
                        <Star size={14} className="fill-amber-500 text-amber-500" />
                        <span className="text-[13px] font-black text-amber-800 tracking-tighter">{rating}</span>
                    </div>
                </div>

                {/* Subtitle: Cuisine & Location */}
                <div className="mt-1 flex items-center gap-2 text-neutral-500 font-medium text-[13px] pl-1">
                    <span>{restaurant.cuisine || 'Restaurante'}</span>
                    <span className="opacity-30">•</span>
                    <span>{restaurant.city || 'Maputo'}</span>
                </div>

                {/* Footer Row: Price & Status */}
                <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-neutral-400 mb-0.5">
                            Consumo Médio
                        </span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-[16px] font-black text-neutral-900 tracking-tight">
                                {restaurant.average_price || '850'}
                            </span>
                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-tighter">
                                MT / Pessoa
                            </span>
                        </div>
                    </div>

                    <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm border transition-all duration-500 ${
                        isOpen 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' 
                        : 'bg-neutral-50 text-neutral-400 border-neutral-200/50 grayscale'
                    }`}>
                        {isOpen && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                        {isOpen ? 'Pronto a Servir' : 'Encerrado'}
                    </div>
                </div>
            </div>
        </Link>
    );
});

RestaurantCard.displayName = 'RestaurantCard';