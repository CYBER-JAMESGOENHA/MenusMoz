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
            <div className="relative h-[35vh] md:h-[40vh] overflow-hidden">
                <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/10 to-black/30" />
                <div className="absolute top-20 md:top-24 left-4 md:left-8 flex gap-3">
                    <Link to="/" className="glass p-2.5 md:p-3 rounded-full flex items-center gap-2 hover:bg-primary hover:text-white transition-all group border-none shadow-lg">
                        <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold pr-1 text-xs md:text-sm">{t.back}</span>
                    </Link>
                    <button onClick={() => toggleFavorite(restaurant.id)} className={`glass p-2.5 md:p-3 rounded-full transition-all border-none shadow-lg ${isFavorite ? 'bg-primary text-white scale-110' : 'hover:bg-white text-text-main group'}`}>
                        <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} className={isFavorite ? '' : 'group-hover:scale-110 group-hover:text-primary transition-all'} />
                    </button>
                    <button onClick={handleShare} className="glass p-2.5 md:p-3 rounded-full transition-all border-none shadow-lg text-text-main hover:bg-white group">
                        <Share2 size={18} className="group-hover:scale-110 transition-all" />
                    </button>
                </div>
            </div>

            {/* Info Card */}
            <div className="max-w-7xl mx-auto px-4 -mt-12 md:-mt-16 relative z-10">
                <div className="bg-surface rounded-2xl md:rounded-[2.5rem] p-5 md:p-10 shadow-2xl border border-border-subtle transition-colors duration-300">

                    {/* Restaurant Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                        <div className="reveal">
                            <div className="flex gap-2 mb-3">
                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">{restaurant.category || restaurant.cuisine}</span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${checkIsOpen(restaurant.hours) ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                    {checkIsOpen(restaurant.hours) ? th.open_now : th.closed}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl mb-2 md:mb-3 tracking-tighter text-text-main font-display font-black leading-[1.1] italic uppercase">{restaurant.name}</h1>
                            {restaurant.rating && <DetailStarRating rating={restaurant.rating} reviewCount={restaurant.reviewCount} />}
                            <p className="text-base md:text-lg text-text-dim max-w-2xl font-medium leading-relaxed mt-3">{restaurant.description}</p>
                        </div>

                        <div className="grid grid-cols-2 md:flex md:flex-col gap-4 reveal shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-500/10"><MapPin size={20} /></div>
                                <div><p className="text-[10px] font-black uppercase text-text-dim/40 tracking-widest leading-none mb-1">Localização</p><p className="font-black text-text-main text-sm">{restaurant.location || "Maputo"}</p></div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-amber-500 shadow-sm border border-amber-500/10"><Clock size={20} /></div>
                                <div><p className="text-[10px] font-black uppercase text-text-dim/40 tracking-widest leading-none mb-1">Horário</p><p className="font-black text-text-main text-sm">{restaurant.hours}</p></div>
                            </div>
                        </div>
                    </div>

                    {/* Cardápio + Sidebar */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
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
