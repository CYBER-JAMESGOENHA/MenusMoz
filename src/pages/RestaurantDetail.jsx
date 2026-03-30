import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, MapPin, Clock, Share2, Heart } from 'lucide-react';
import { gsap } from 'gsap';
import { checkIsOpen } from '../data';
import { restaurantService } from '../services/restaurantService';
import { translations } from '../translations';
import { DetailStarRating } from '../components/restaurant/DetailShared';
import { MenuBook } from '../components/restaurant/MenuBook';
import { ReservationSidebar, MobileReservationBar } from '../components/restaurant/ReservationSidebar';
import { ReviewSection } from '../components/restaurant/ReviewSection';

export default function RestaurantDetail({ lang, favorites, toggleFavorite, showLogin }) {
    const t = translations[lang]?.detail ?? translations.pt.detail;
    const th = translations[lang]?.home ?? translations.pt.home;
    const { slug } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        restaurantService.getBySlug(slug).then(data => {
            setRestaurant(data);
            setIsLoading(false);
        });
    }, [slug]);

    // Read current user from supabase if available
    useEffect(() => {
        let sub;
        import('../lib/supabase').then(({ supabase, isSupabaseConfigured }) => {
            if (!isSupabaseConfigured) return;
            supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
            const { data: { subscription } } = supabase.auth.onAuthStateChange((_, sess) => setUser(sess?.user ?? null));
            sub = subscription;
        });
        return () => sub?.unsubscribe();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!containerRef.current) return;
        const ctx = gsap.context(() => {
            gsap.from('.reveal', { y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' });
        }, containerRef.current);
        return () => ctx.revert();
    }, [slug]);

    const triggerHaptic = () => { if (navigator.vibrate) navigator.vibrate(20); };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: `Locais de Moz — ${restaurant.name}`, text: restaurant.description, url: window.location.href });
            } catch (err) {
                if (import.meta.env.DEV) console.log('Share error:', err);
            }
        }
    };

    if (isLoading) return <div className="flex items-center justify-center min-h-screen bg-bg"><div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
    if (!restaurant) return <div className="min-h-screen flex flex-col items-center justify-center"><h1 className="text-4xl mb-8 font-heading font-black text-text-main">Restaurante não encontrado</h1><Link to="/" className="bg-primary text-white px-8 py-3 rounded-full font-bold">Voltar ao Início</Link></div>;

    const isFavorite = favorites.includes(restaurant.id);

    return (
        <div ref={containerRef} className="pb-40 lg:pb-32 bg-bg transition-colors duration-500">

            {/* SEO */}
            <Helmet>
                <title>{restaurant.name} — {restaurant.cuisine} em {restaurant.location?.split(',')[1]?.trim() || 'Maputo'} | MenusMoz</title>
                <meta name="description" content={restaurant.description} />
                <meta property="og:title" content={restaurant.name} />
                <meta property="og:description" content={restaurant.description} />
                {restaurant.image && <meta property="og:image" content={restaurant.image} />}
            </Helmet>

            {/* ── Hero Image ─────────────────────────────────── */}
            <div className="relative h-[45vh] md:h-[60vh] overflow-hidden">
                <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-black/40" />
                <div className="absolute top-24 md:top-32 left-4 md:left-12 flex gap-3">
                    <Link to="/" className="glass p-3 md:p-4 rounded-full flex items-center gap-2 hover:bg-primary hover:text-white transition-all group border-none shadow-lg">
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold pr-1 text-sm md:text-base">{t.back}</span>
                    </Link>
                    <button onClick={() => { toggleFavorite(restaurant.id); triggerHaptic(); }} className={`glass p-3 md:p-4 rounded-full transition-all border-none shadow-lg ${isFavorite ? 'bg-primary text-white scale-110' : 'hover:bg-white text-text-main'}`}>
                        <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                    </button>
                    <button onClick={handleShare} className="glass p-3 md:p-4 rounded-full transition-all border-none shadow-lg text-text-main hover:bg-white">
                        <Share2 size={20} />
                    </button>
                </div>
            </div>

            {/* ── Info Card ──────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 -mt-20 md:-mt-32 relative z-10">
                <div className="bg-surface rounded-3xl md:rounded-[3rem] p-6 md:p-12 shadow-2xl border border-border-subtle transition-colors duration-300">

                    {/* Restaurant Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
                        <div className="reveal">
                            <div className="flex gap-3 mb-4">
                                <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">{restaurant.cuisine}</span>
                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${checkIsOpen(restaurant.hours) ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                    {checkIsOpen(restaurant.hours) ? th.open_now : th.closed}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-7xl mb-3 md:mb-4 tracking-tighter text-text-main font-heading font-black leading-[1.1]">{restaurant.name}</h1>
                            {restaurant.rating && <DetailStarRating rating={restaurant.rating} reviewCount={restaurant.reviewCount} />}
                            <p className="text-lg md:text-xl text-text-dim max-w-2xl leading-relaxed mt-4">{restaurant.description}</p>
                        </div>

                        <div className="grid grid-cols-2 md:flex md:flex-col gap-6 reveal shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center icon-green"><MapPin size={24} /></div>
                                <div><p className="text-xs font-bold uppercase text-text-dim/40">Localização</p><p className="font-bold text-text-main">{restaurant.location}</p></div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center icon-orange"><Clock size={24} /></div>
                                <div><p className="text-xs font-bold uppercase text-text-dim/40">Horário</p><p className="font-bold text-text-main">{restaurant.hours}</p></div>
                            </div>
                        </div>
                    </div>

                    {/* ── Cardápio + Sidebar ─────────────────── */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                        <div className="lg:col-span-2">
                            <MenuBook menuCategories={restaurant.menuCategories} />
                            {/* ── Reviews ──────────────────────── */}
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

            {/* ── Mobile WhatsApp Bar ────────────────────────── */}
            <MobileReservationBar restaurant={restaurant} t={t} />

        </div>
    );
}
