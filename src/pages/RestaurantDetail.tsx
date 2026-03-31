import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, MapPin, Clock, Share2, Heart } from 'lucide-react';
import { gsap } from 'gsap';
import { checkIsOpen } from '../utils/timeUtils';
import { restaurantService } from '../services/restaurantService';
import { translations } from '../translations';
import { DetailStarRating } from '../components/restaurant/DetailShared';
import { MenuBook } from '../components/restaurant/MenuBook';
import { ReservationSidebar, MobileReservationBar } from '../components/restaurant/ReservationSidebar';
import { ReviewSection } from '../components/restaurant/ReviewSection';
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
    const t = (translations[lang as keyof typeof translations] as any)?.detail ?? translations.pt.detail;
    const th = (translations[lang as keyof typeof translations] as any)?.home ?? translations.pt.home;
    const { slug } = useParams<{ slug: string }>();
    const [restaurant, setRestaurant] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (slug) {
            setIsLoading(true);
            restaurantService.getBySlug(slug)
                .then(data => {
                    setRestaurant(data);
                })
                .catch(err => {
                    console.error('Error fetching restaurant:', err);
                    setRestaurant(null);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [slug]);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!containerRef.current) return;
        const ctx = gsap.context(() => {
            gsap.from('.reveal', { y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' });
        }, containerRef.current);
        return () => ctx.revert();
    }, [slug, isLoading]);

    const handleShare = async () => {
        if (navigator.share && restaurant) {
            try {
                await navigator.share({ title: `Locais de Moz — ${restaurant.name}`, text: restaurant.description, url: window.location.href });
            } catch (err) {
                if ((import.meta as any).env.DEV) console.log('Share error:', err);
            }
        }
    };

    if (isLoading) return <DetailSkeleton />;
    
    if (!restaurant) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-4 text-center">
            <h1 className="text-4xl md:text-5xl mb-8 font-display font-black text-text-main tracking-tighter italic">Restaurante não encontrado</h1>
            <Link to="/" className="bg-primary text-white px-10 py-4 rounded-full font-black shadow-primary-glow hover:scale-105 transition-all">
                Voltar ao Início
            </Link>
        </div>
    );

    const isFavorite = favorites.includes(restaurant.id);

    return (
        <div ref={containerRef} className="pb-40 lg:pb-32 bg-bg transition-colors duration-500">

            <Helmet>
                <title>{restaurant.name} — {restaurant.category || restaurant.cuisine} em {restaurant.location?.split(',')[1]?.trim() || 'Maputo'} | Locais de Moz</title>
                <meta name="description" content={restaurant.description} />
                <meta property="og:title" content={`${restaurant.name} — Locais de Moz`} />
                <meta property="og:description" content={restaurant.description} />
                {restaurant.image && <meta property="og:image" content={restaurant.image} />}
            </Helmet>

            {/* Hero Image */}
            <div className="relative h-[45vh] md:h-[60vh] overflow-hidden">
                <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-black/40" />
                <div className="absolute top-24 md:top-32 left-4 md:left-12 flex gap-3">
                    <Link to="/" className="glass p-3 md:p-4 rounded-full flex items-center gap-2 hover:bg-primary hover:text-white transition-all group border-none shadow-lg">
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold pr-1 text-sm md:text-base">{t.back}</span>
                    </Link>
                    <button onClick={() => toggleFavorite(restaurant.id)} className={`glass p-3 md:p-4 rounded-full transition-all border-none shadow-lg ${isFavorite ? 'bg-primary text-white scale-110' : 'hover:bg-white text-text-main group'}`}>
                        <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} className={isFavorite ? '' : 'group-hover:scale-110 group-hover:text-primary transition-all'} />
                    </button>
                    <button onClick={handleShare} className="glass p-3 md:p-4 rounded-full transition-all border-none shadow-lg text-text-main hover:bg-white group">
                        <Share2 size={20} className="group-hover:scale-110 transition-all" />
                    </button>
                </div>
            </div>

            {/* Info Card */}
            <div className="max-w-7xl mx-auto px-4 -mt-20 md:-mt-32 relative z-10">
                <div className="bg-surface rounded-3xl md:rounded-[3rem] p-6 md:p-12 shadow-2xl border border-border-subtle transition-colors duration-300">

                    {/* Restaurant Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
                        <div className="reveal">
                            <div className="flex gap-3 mb-4">
                                <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-wider">{restaurant.category || restaurant.cuisine}</span>
                                <span className={`px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-wider ${checkIsOpen(restaurant.hours) ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                    {checkIsOpen(restaurant.hours) ? th.open_now : th.closed}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-7xl mb-3 md:mb-4 tracking-tighter text-text-main font-display font-black leading-[1.1] italic uppercase">{restaurant.name}</h1>
                            {restaurant.rating && <DetailStarRating rating={restaurant.rating} reviewCount={restaurant.reviewCount} />}
                            <p className="text-lg md:text-xl text-text-dim max-w-2xl font-medium leading-relaxed mt-4">{restaurant.description}</p>
                        </div>

                        <div className="grid grid-cols-2 md:flex md:flex-col gap-6 reveal shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-500/10"><MapPin size={24} /></div>
                                <div><p className="text-xs font-black uppercase text-text-dim/40 tracking-widest">Localização</p><p className="font-black text-text-main">{restaurant.location || "Maputo"}</p></div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-amber-500 shadow-sm border border-amber-500/10"><Clock size={24} /></div>
                                <div><p className="text-xs font-black uppercase text-text-dim/40 tracking-widest">Horário</p><p className="font-black text-text-main">{restaurant.hours}</p></div>
                            </div>
                        </div>
                    </div>

                    {/* Cardápio + Sidebar */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                        <div className="lg:col-span-2">
                            <MenuBook menuCategories={restaurant.menuCategories} />
                            <ReviewSection
                                restaurant={restaurant}
                                user={user}
                                lang={lang}
                                t={t}
                                onLoginOpen={showLogin}
                            />
                        </div>
                        <ReservationSidebar restaurant={restaurant} t={t} lang={lang} />
                    </div>
                </div>
            </div>

            {/* Mobile WhatsApp Bar */}
            <MobileReservationBar restaurant={restaurant} t={t} />

        </div>
    );
}
