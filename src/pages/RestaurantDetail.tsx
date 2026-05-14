import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    ChevronLeft,
    Star,
    Navigation,
    Phone,
    BookOpen,
    MapPin,
    Clock,
    Calendar,
    ArrowRight,
    Utensils,
    Music,
    CalendarCheck,
    Share2,
    Heart
} from 'lucide-react';
import { restaurantService, Restaurant } from '../services/restaurantService';
import { translations } from '../translations';
import { MenuCategories } from '../components/restaurant/MenuCategories';
import { DetailSkeleton } from '../components/ui/Skeleton';
import { useAuth } from '../context/AuthContext';

interface RestaurantDetailProps {
    lang: string;
    favorites: number[];
    toggleFavorite: (id: any) => Promise<void>;
    showLogin: () => void;
}

export default function RestaurantDetail({ lang, favorites, toggleFavorite, showLogin }: RestaurantDetailProps) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { slug } = useParams<{ slug: string }>();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const t = (translations[lang as keyof typeof translations] as any)?.detail ?? translations.pt.detail;
    const isEn = lang === 'en';

    useEffect(() => {
        if (slug) {
            setIsLoading(true);
            restaurantService.getBySlug(slug)
                .then(data => setRestaurant(data))
                .catch(err => {
                    console.error('Error fetching restaurant:', err);
                    setRestaurant(null);
                })
                .finally(() => setIsLoading(false));
        }
    }, [slug]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    const handleShare = async () => {
        if (navigator.share && restaurant) {
            try {
                await navigator.share({
                    title: `Locais de Moz — ${restaurant.name}`,
                    text: restaurant.description,
                    url: window.location.href
                });
            } catch (err) {
                if (import.meta.env.DEV) console.log('Share error:', err);
            }
        }
    };

    if (isLoading) return <DetailSkeleton />;

    if (!restaurant) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-4 text-center">
            <h1 className="text-4xl md:text-5xl mb-8 font-display font-black text-text-main tracking-tighter italic uppercase">Restaurante não encontrado</h1>
            <Link to="/" className="bg-primary text-white px-10 py-4 rounded-full font-black shadow-primary-glow hover:scale-105 transition-all uppercase tracking-widest text-sm">
                Voltar ao Início
            </Link>
        </div>
    );

    const isFavorite = (favorites || []).includes(restaurant.id as number);
    const isOpenNow = restaurant.isOpen;

    const signatureDishes = restaurant.signature_dishes || [
        { name: isEn ? 'Signature Dish' : 'Prato de Assinatura', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80', price: '1.250 MZN', tag: isEn ? 'Best Seller' : 'Mais Vendido' },
        { name: isEn ? 'Chef\'s Special' : 'Especial do Chef', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80', price: '950 MZN', tag: isEn ? 'Trending' : 'Tendência' },
        { name: isEn ? 'Coastal Delight' : 'Delícia Costeira', img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80', price: '1.400 MZN', tag: isEn ? 'Signature' : 'Assinatura' }
    ].slice(0, 3);

    return (
        <div ref={containerRef} className="min-h-screen bg-bg pb-20">
            <Helmet>
                <title>{restaurant.name} | Locais de Moz</title>
                <meta name="description" content={restaurant.description} />
            </Helmet>

            {/* Restaurant Snapshot Header */}
            <section className="relative bg-surface border-b border-border-subtle">
                {/* Compact Hero Visual */}
                <div className="relative h-[280px] md:h-[320px] overflow-hidden rounded-b-3xl">
                    {restaurant.hero_image_url && (
                        <img
                            src={restaurant.hero_image_url}
                            alt={restaurant.name}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    )}
                    {!restaurant.hero_image_url && (
                        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-black" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Mobile Back */}
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-4 left-4 z-30 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/50 transition"
                    >
                        <ChevronLeft size={22} />
                    </button>

                    {/* Actions */}
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                        <button onClick={handleShare} className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/50 transition">
                            <Share2 size={16} />
                        </button>
                        <button
                            onClick={() => user ? toggleFavorite(restaurant.id) : showLogin()}
                            className={`w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center transition ${isFavorite ? 'text-red-400' : 'text-white hover:bg-black/50'}`}
                        >
                            <Heart size={16} className={isFavorite ? 'fill-current' : ''} />
                        </button>
                    </div>

                    {/* Logo */}
                    <div className="absolute bottom-6 left-6">
                        <img
                            src={restaurant.logo_url || restaurant.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(restaurant.name || 'R')}&background=000&color=fff&size=256&bold=true`}
                            alt={restaurant.name}
                            className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-white/30 shadow-xl bg-surface"
                        />
                    </div>
                </div>

                {/* Compact Info Bar */}
                <div className="px-6 md:px-10 py-5">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            {/* Name + Category */}
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                <h1 className="text-text-main">
                                    {restaurant.name}
                                </h1>
                                {restaurant.cuisine && (
                                    <span className="px-2.5 py-1 rounded-full bg-bg border border-border-subtle text-text-dim text-[9px] font-bold uppercase tracking-widest">
                                        {restaurant.cuisine}
                                    </span>
                                )}
                            </div>

                            {/* Meta row */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-text-dim text-sm">
                                {restaurant.rating && (
                                    <div className="flex items-center gap-1">
                                        {[1,2,3,4,5].map(i => (
                                            <Star key={i} size={13} className={i <= Math.round(restaurant.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-text-dim/20'} />
                                        ))}
                                        <span className="font-black text-text-main ml-1">{Number(restaurant.rating).toFixed(1)}</span>
                                        {restaurant.reviewCount && (
                                            <span className="text-[11px] font-bold text-text-dim/60">({restaurant.reviewCount})</span>
                                        )}
                                    </div>
                                )}
                                {restaurant.location && (
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={13} />
                                        <span className="text-xs font-medium truncate max-w-[200px]">{restaurant.location?.split(',')[0]}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-2 shrink-0">
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${isOpenNow ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${isOpenNow ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                {isOpenNow ? (isEn ? 'Open' : 'Aberto') : (isEn ? 'Closed' : 'Fechado')}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        <button
                            onClick={() => {
                                document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full font-bold text-[9px] uppercase tracking-widest hover:bg-primary/90 transition-all shadow-sm"
                        >
                            <BookOpen size={13} />
                            {isEn ? 'View Menu' : 'Ver Menu'}
                        </button>
                        <button
                            onClick={() => window.open(`https://wa.me/${restaurant.whatsapp?.replace(/\D/g, '')}`, '_blank')}
                            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border-subtle text-text-main rounded-full font-bold text-[9px] uppercase tracking-widest hover:border-primary/50 hover:text-primary transition-all"
                        >
                            <CalendarCheck size={13} />
                            {isEn ? 'Reserve Table' : 'Reservar Mesa'}
                        </button>
                        <button
                            onClick={() => window.open(`tel:${restaurant.phone || restaurant.whatsapp}`)}
                            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border-subtle text-text-main rounded-full font-bold text-[9px] uppercase tracking-widest hover:border-primary/50 hover:text-primary transition-all"
                        >
                            <Phone size={13} />
                            {isEn ? 'Call' : 'Ligar'}
                        </button>
                        <button
                            onClick={() => {
                                const url = (restaurant.lat && restaurant.lng)
                                    ? `https://www.google.com/maps/dir/?api=1&destination=${restaurant.lat},${restaurant.lng}`
                                    : `https://maps.google.com/maps?q=${encodeURIComponent(restaurant.location || restaurant.address || restaurant.name)}`;
                                window.open(url, '_blank');
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border-subtle text-text-main rounded-full font-bold text-[9px] uppercase tracking-widest hover:border-primary/50 hover:text-primary transition-all"
                        >
                            <Navigation size={13} />
                            {isEn ? 'Directions' : 'Como Chegar'}
                        </button>
                    </div>
                </div>
            </section>

            {/* Main Single Scroll Content */}
            <main className="max-w-6xl mx-auto px-4 md:px-8">
                <div className="flex flex-col gap-10">

                    {/* --- Signature Dishes --- */}
                    <section className="pt-8">
                        <div className="flex items-end justify-between mb-5">
                            <div>
                                <span className="text-primary font-bold uppercase tracking-widest text-[9px] mb-1 block">
                                    {isEn ? 'Favorites' : 'Favoritos'}
                                </span>
                                <h2 className="text-text-main">
                                    {isEn ? 'Signature Dishes' : 'Pratos de Assinatura'}
                                </h2>
                            </div>
                            <button
                                onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}
                                className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[9px] hover:opacity-70 transition-opacity pb-1"
                            >
                                {isEn ? 'View Full Menu' : 'Ver Menu Completo'}
                                <ArrowRight size={13} />
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-3 md:gap-4">
                            {signatureDishes.map((item: any, i: number) => (
                                <div key={i} className="group cursor-pointer" onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}>
                                    <div className="relative aspect-square rounded-2xl overflow-hidden shadow-sm mb-3">
                                        <img
                                            src={item.image_url || item.img}
                                            alt={item.name}
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-white text-[7px] font-bold uppercase tracking-wider rounded-full">
                                            {item.tag}
                                        </div>
                                    </div>
                                    <div className="px-0.5">
                                        <h4 className="text-xs md:text-sm font-bold text-text-main group-hover:text-primary transition-colors leading-tight">{item.name}</h4>
                                        <p className="text-primary font-bold text-[10px] mt-0.5">{item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* --- Menu --- */}
                    <section id="menu-section">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <Utensils size={16} />
                            </div>
                            <h2 className="text-text-main">
                                {isEn ? 'Menu' : 'Cardápio'}
                            </h2>
                        </div>
                        <MenuCategories restaurant={restaurant} />
                    </section>

                    {/* --- About & Location (Compact) --- */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* About */}
                        <div className="bg-surface border border-border-subtle rounded-3xl p-5 md:p-7">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Heart size={16} />
                                </div>
                                <h3 className="text-text-main">
                                    {isEn ? 'About' : 'Sobre Nós'}
                                </h3>
                            </div>
                            <p className="text-text-dim text-sm leading-relaxed mb-5">
                                {restaurant.story || restaurant.description || (isEn
                                    ? 'A landmark for those who value quality and tradition.'
                                    : 'Um marco para quem valoriza a qualidade e a tradição.')}
                            </p>
                            {restaurant.awards && restaurant.awards.length > 0 && (
                                <div className="flex flex-wrap gap-3">
                                    {restaurant.awards.slice(0, 2).map((award: any, i: number) => (
                                        <div key={i} className="flex items-center gap-2 px-2.5 py-1 bg-bg rounded-full border border-border-subtle">
                                            <Star size={11} className="text-primary fill-primary" />
                                            <span className="text-[9px] font-bold uppercase tracking-wider text-text-main">{award.title}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Hours & Location */}
                        <div className="bg-surface border border-border-subtle rounded-3xl p-5 md:p-7 flex flex-col">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Clock size={16} />
                                </div>
                                <h3 className="text-text-main">
                                    {isEn ? 'Hours & Location' : 'Horário & Localização'}
                                </h3>
                            </div>

                            {/* Hours */}
                            <div className="space-y-3 mb-5">
                                {[
                                    { days: isEn ? 'Mon – Fri' : 'Seg – Sex', hours: restaurant.hours_weekday || '12:00 – 23:00' },
                                    { days: isEn ? 'Saturday' : 'Sábado', hours: restaurant.hours_saturday || '12:00 – 00:00' },
                                    { days: isEn ? 'Sunday' : 'Domingo', hours: restaurant.hours_sunday || '12:00 – 22:00' }
                                ].map((h, i) => (
                                    <div key={i} className="flex justify-between items-center">
                                        <span className="text-text-dim text-[11px] font-bold uppercase tracking-widest">{h.days}</span>
                                        <span className="text-text-main text-[11px] font-bold">{h.hours}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Location */}
                            {restaurant.location && (
                                <div className="mt-auto pt-4 border-t border-border-subtle">
                                    <div className="flex items-start gap-2 mb-3">
                                        <MapPin size={14} className="text-text-dim mt-0.5 shrink-0" />
                                        <p className="text-text-main text-sm font-medium">{restaurant.location}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const url = (restaurant.lat && restaurant.lng)
                                                ? `https://www.google.com/maps/dir/?api=1&destination=${restaurant.lat},${restaurant.lng}`
                                                : `https://maps.google.com/maps?q=${encodeURIComponent(restaurant.location || restaurant.address || restaurant.name)}`;
                                            window.open(url, '_blank');
                                        }}
                                        className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[9px] hover:opacity-70 transition-opacity"
                                    >
                                        <Navigation size={13} />
                                        {isEn ? 'Get Directions' : 'Como Chegar'}
                                        <ArrowRight size={11} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* --- Events (Lightweight) --- */}
                    {((restaurant.events && restaurant.events.length > 0) || (restaurant.specials && restaurant.specials.length > 0)) && (
                        <section>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Music size={16} />
                                </div>
                                <h2 className="text-text-main">
                                    {isEn ? 'Events' : 'Eventos'}
                                </h2>
                            </div>

                            <div className="flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
                                {(restaurant.events || []).slice(0, 3).map((event: any, i: number) => (
                                    <div key={i} className="flex-none w-[260px] bg-surface border border-border-subtle rounded-2xl overflow-hidden">
                                        <div className="relative h-32 overflow-hidden">
                                            <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                                            {event.event_date && (
                                                <div className="absolute top-3 left-3 bg-primary text-white px-2 py-1 rounded-lg text-center">
                                                    <span className="text-sm font-black block leading-none">{new Date(event.event_date).getDate()}</span>
                                                    <span className="text-[8px] font-black uppercase tracking-wider">{new Date(event.event_date).toLocaleDateString(lang, { month: 'short' })}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-primary mb-1">{event.title}</p>
                                            <h4 className="text-xs font-bold text-text-main leading-tight line-clamp-1">{event.title}</h4>
                                            {event.event_time && (
                                                <p className="text-text-dim text-[9px] font-bold uppercase tracking-widest mt-1.5 flex items-center gap-1">
                                                    <Clock size={9} /> {event.event_time}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}



                </div>
            </main>
        </div>
    );
}
