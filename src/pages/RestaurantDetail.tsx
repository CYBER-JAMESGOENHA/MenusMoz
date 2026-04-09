import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
    ChevronLeft, 
    MapPin, 
    Clock, 
    Share2, 
    Heart, 
    MessageCircle, 
    Info, 
    ArrowLeft, 
    Star,
    Navigation,
    Phone,
    Globe
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { restaurantService } from '../services/restaurantService';
import { translations } from '../translations';
import { DetailStarRating, OrnamentalDivider } from '../components/restaurant/DetailShared';
import { MenuCategories } from '../components/restaurant/MenuCategories';
import { ReservationSidebar, MobileReservationBar } from '../components/restaurant/ReservationSidebar';
import { ReviewSection } from '../components/restaurant/ReviewSection';
import { DetailSkeleton } from '../components/ui/Skeleton';
import { useAuth } from '../context/AuthContext';

gsap.registerPlugin(ScrollTrigger);

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
    const [restaurant, setRestaurant] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'menu' | 'reviews' | 'info'>('menu');
    
    const containerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const t = (translations[lang as keyof typeof translations] as any)?.detail ?? translations.pt.detail;
    const common = (translations[lang as keyof typeof translations] as any)?.home ?? translations.pt.home;

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
        if (isLoading || !restaurant || !containerRef.current) return;

        const ctx = gsap.context(() => {
            // Initial reveal
            gsap.from('.reveal-down', { 
                y: -20, 
                opacity: 0, 
                duration: 1, 
                ease: 'power4.out' 
            });

            gsap.from('.reveal-up', { 
                y: 40, 
                opacity: 0, 
                duration: 1.2, 
                stagger: 0.1, 
                ease: 'power3.out',
                delay: 0.2
            });

            // Hero parallax
            if (heroRef.current) {
                gsap.to(heroRef.current.querySelector('img'), {
                    yPercent: 20,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: heroRef.current,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: true
                    }
                });
            }
        }, containerRef.current);

        return () => ctx.revert();
    }, [isLoading, restaurant]);

    const handleShare = async () => {
        if (navigator.share && restaurant) {
            try {
                await navigator.share({ 
                    title: `Locais de Moz — ${restaurant.name}`, 
                    text: restaurant.description, 
                    url: window.location.href 
                });
            } catch (err) {
                console.log('Share error:', err);
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

    const isFavorite = (favorites || []).includes(restaurant.id);

    return (
        <div ref={containerRef} className="min-h-screen bg-bg pb-20 lg:pb-0">
            <Helmet>
                <title>{restaurant.name} | Locais de Moz</title>
                <meta name="description" content={restaurant.description} />
            </Helmet>

            {/* Sticky Mobile Header */}
            <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 lg:hidden pointer-events-none">
                <button 
                    onClick={() => navigate(-1)}
                    className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white pointer-events-auto active:scale-90 transition-transform shadow-2xl"
                >
                    <ArrowLeft size={24} />
                </button>
                <div className="flex gap-2 pointer-events-auto">
                    <button 
                        onClick={handleShare}
                        className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white active:scale-90 transition-transform shadow-2xl"
                    >
                        <Share2 size={20} />
                    </button>
                    <button 
                        onClick={() => toggleFavorite(restaurant.id)}
                        className={`w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center active:scale-90 transition-transform shadow-2xl ${isFavorite ? 'text-primary' : 'text-white'}`}
                    >
                        <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                    </button>
                </div>
            </div>

            {/* --- HERO SECTION --- */}
            <section ref={heroRef} className="relative h-[50vh] md:h-[65vh] w-full overflow-hidden">
                <img 
                    src={restaurant.image} 
                    alt={restaurant.name} 
                    className="absolute inset-0 w-full h-full object-cover scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" />
                
                {/* Desktop Top Nav */}
                <div className="absolute top-0 left-0 right-0 p-8 hidden lg:flex items-center justify-between">
                    <button 
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 text-white hover:bg-white/20 transition-all font-black uppercase text-xs tracking-widest"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        {t.back}
                    </button>
                    <div className="flex gap-4">
                        <button 
                            onClick={handleShare}
                            className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-white hover:bg-white/20 transition-all"
                        >
                            <Share2 size={20} />
                        </button>
                        <button 
                            onClick={() => toggleFavorite(restaurant.id)}
                            className={`bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 transition-all ${isFavorite ? 'text-primary' : 'text-white'} hover:bg-white/20`}
                        >
                            <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                        </button>
                    </div>
                </div>

                {/* Hero Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto flex flex-col items-start gap-4">
                    <div className="reveal-up flex flex-wrap gap-2">
                        {restaurant.isOpen ? (
                            <span className="bg-primary text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-primary-glow">
                                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                {common.open_now}
                            </span>
                        ) : (
                            <span className="bg-text-dim/20 backdrop-blur-md text-text-dim px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                {common.closed}
                            </span>
                        )}
                        <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/10">
                            {restaurant.cuisine}
                        </span>
                        {restaurant.price_level && (
                            <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/10">
                                {restaurant.price_level}
                            </span>
                        )}
                    </div>
                    
                    <h1 className="reveal-up text-5xl md:text-8xl font-display font-black text-white italic uppercase tracking-tighter leading-[0.8] drop-shadow-2xl">
                        {restaurant.name}
                    </h1>
                    
                    <div className="reveal-up flex items-center gap-6 mt-2">
                        <DetailStarRating rating={restaurant.rating} reviewCount={restaurant.reviewCount} />
                    </div>
                </div>
            </section>

            {/* --- MAIN CONTENT --- */}
            <main className="max-w-7xl mx-auto px-6 md:px-12 -mt-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
                    
                    {/* LEFT COLUMN: Menu & Reviews */}
                    <div className="space-y-12">
                        
                        {/* Tabs Navigation */}
                        <div className="flex items-center gap-1 bg-surface border border-border-subtle p-1.5 rounded-2xl w-fit reveal-up shadow-sm">
                            {[
                                { id: 'menu', label: 'Menu', icon: <Info size={16} /> },
                                { id: 'reviews', label: 'Reviews', icon: <Star size={16} /> },
                                { id: 'info', label: 'Info', icon: <MapPin size={16} /> }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                                        activeTab === tab.id 
                                        ? 'bg-primary text-white shadow-lg' 
                                        : 'text-text-dim hover:bg-black/5'
                                    }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="reveal-up min-h-[600px]">
                            {activeTab === 'menu' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <MenuCategories 
                                        menuCategories={restaurant.menuCategories || []} 
                                        restaurantName={restaurant.name}
                                        whatsapp={restaurant.whatsapp}
                                    />
                                    
                                    <OrnamentalDivider />
                                    
                                    {restaurant.chefName && (
                                        <div className="bg-surface rounded-[2.5rem] p-10 border border-border-subtle overflow-hidden relative group">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
                                            <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                                                {restaurant.chefImage && (
                                                    <img 
                                                        src={restaurant.chefImage} 
                                                        alt={restaurant.chefName}
                                                        className="w-32 h-32 rounded-3xl object-cover ring-4 ring-primary/10"
                                                    />
                                                )}
                                                <div className="text-center md:text-left">
                                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">Pelas mãos de</p>
                                                    <h3 className="text-3xl font-display font-black text-text-main italic uppercase tracking-tighter mb-4">Chef {restaurant.chefName}</h3>
                                                    <p className="text-text-dim text-lg italic font-medium leading-relaxed max-w-xl">
                                                        "{restaurant.chefQuote || 'A nossa cozinha é uma celebração dos sabores autênticos de Moçambique, elevada com técnicas modernas.'}"
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <ReviewSection 
                                        restaurant={restaurant} 
                                        user={user} 
                                        lang={lang} 
                                        t={t}
                                        onLoginOpen={showLogin}
                                    />
                                </div>
                            )}

                            {activeTab === 'info' && (
                                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {/* Location Card */}
                                    <div className="bg-surface rounded-[2.5rem] p-8 border border-border-subtle space-y-8 shadow-sm">
                                        <div className="flex flex-col md:flex-row gap-8 items-start">
                                            <div className="flex-1 space-y-6">
                                                <div className="space-y-2">
                                                    <h3 className="font-display font-black text-2xl uppercase italic tracking-tighter">Onde Estamos</h3>
                                                    <p className="text-text-dim font-medium flex items-start gap-2">
                                                        <MapPin className="shrink-0 text-primary mt-1" size={18} />
                                                        {restaurant.address || 'Endereço não disponível'}
                                                    </p>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <a 
                                                        href={`tel:${restaurant.phone || restaurant.whatsapp}`}
                                                        className="flex items-center gap-4 p-4 rounded-2xl bg-bg border border-border-subtle hover:border-primary/30 transition-all group"
                                                    >
                                                        <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                                            <Phone size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-text-dim/50">Telefone</p>
                                                            <p className="font-bold text-text-main">{restaurant.phone || restaurant.whatsapp}</p>
                                                        </div>
                                                    </a>
                                                    {restaurant.website && (
                                                        <a 
                                                            href={restaurant.website}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-4 p-4 rounded-2xl bg-bg border border-border-subtle hover:border-primary/30 transition-all group"
                                                        >
                                                            <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                                                <Globe size={18} />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-text-dim/50">Website</p>
                                                                <p className="font-bold text-text-main truncate max-w-[120px]">{restaurant.website.replace('https://', '')}</p>
                                                            </div>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {/* Static Map Placement */}
                                            <div className="w-full md:w-80 h-48 md:h-64 rounded-3xl bg-bg border border-border-subtle overflow-hidden relative">
                                                <img 
                                                    src={`https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80`} 
                                                    alt="Location Map"
                                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                                />
                                                <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                                                <button className="absolute bottom-4 right-4 bg-white text-black px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 hover:bg-black hover:text-white transition-all">
                                                    <Navigation size={12} /> Abrir no Maps
                                                </button>
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-border-subtle">
                                            <h3 className="font-display font-black text-2xl uppercase italic tracking-tighter mb-4 flex items-center gap-2">
                                                <Clock size={24} className="text-primary" /> Horário de Funcionamento
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {restaurant.hours && Object.entries(restaurant.hours).map(([day, hours]: [string, any]) => (
                                                    <div key={day} className="flex justify-between items-center p-3 rounded-xl bg-bg/50 border border-border-subtle/30">
                                                        <span className="font-black text-[10px] uppercase tracking-widest text-text-dim">{day}</span>
                                                        <span className="font-bold text-sm text-text-main">{hours || 'Cerrado'}</span>
                                                    </div>
                                                ))}
                                                {!restaurant.hours && (
                                                    <p className="text-text-dim italic text-sm">Horário sob consulta</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Features / Tags */}
                                    <div className="flex flex-wrap gap-3">
                                        {restaurant.features?.map((f: string) => (
                                            <div key={f} className="bg-surface px-5 py-3 rounded-2xl border border-border-subtle flex items-center gap-3 shadow-sm">
                                                <div className="w-2 h-2 rounded-full bg-primary" />
                                                <span className="font-black text-xs uppercase tracking-widest text-text-main">{f}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Sidebar (Desktop Only) */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-24 space-y-8 reveal-up">
                            {/* Booking Card */}
                            <div className="bg-surface rounded-[2.5rem] p-10 border border-border-subtle shadow-premium space-y-6">
                                <div className="space-y-2">
                                    <h3 className="font-display font-black text-3xl italic uppercase tracking-tighter">Reserva Rápida</h3>
                                    <p className="text-text-dim text-sm font-medium leading-relaxed">Garanta o seu lugar ou faça o seu pedido antecipadamente via WhatsApp.</p>
                                </div>
                                <div className="space-y-3">
                                    <a 
                                        href={`https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(`Olá, gostaria de fazer uma reserva no ${restaurant.name} através do Locais de Moz.`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full bg-primary text-white h-16 rounded-2xl flex items-center justify-center gap-3 font-black text-lg shadow-primary-glow hover:scale-[1.02] active:scale-95 transition-all"
                                    >
                                        <MessageCircle size={24} /> Reservar WhatsApp
                                    </a>
                                    <a 
                                        href={`tel:${restaurant.phone || restaurant.whatsapp}`}
                                        className="w-full bg-bg text-text-main border border-border-subtle h-14 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest hover:border-primary/50 transition-all"
                                    >
                                        <Phone size={18} /> Ligar para o Local
                                    </a>
                                </div>
                                
                                <div className="pt-4 flex items-center gap-4">
                                    <div className="flex-1 h-px bg-border-subtle" />
                                    <span className="text-[10px] font-black text-text-dim/40 uppercase tracking-[0.3em]">Ou consulte</span>
                                    <div className="flex-1 h-px bg-border-subtle" />
                                </div>
                                
                                <ReservationSidebar restaurant={restaurant} t={t} lang={lang} />
                            </div>

                            {/* Info Snippet */}
                            <div className="bg-surface rounded-[2rem] p-8 border border-border-subtle space-y-4 shadow-sm">
                                <div className="flex items-center gap-4 text-text-dim">
                                    <div className="w-10 h-10 rounded-xl bg-bg flex items-center justify-center shrink-0 border border-border-subtle">
                                        <MapPin size={18} />
                                    </div>
                                    <p className="text-xs font-bold leading-relaxed">{restaurant.address}</p>
                                </div>
                                <div className="flex items-center gap-4 text-text-dim">
                                    <div className="w-10 h-10 rounded-xl bg-bg flex items-center justify-center shrink-0 border border-border-subtle">
                                        <Clock size={18} />
                                    </div>
                                    <p className="text-xs font-bold">Consumo Médio: <span className="text-text-main">{restaurant.avg_consumption || 'Variável'}</span></p>
                                </div>
                            </div>
                        </div>
                    </aside>

                </div>
            </main>

            {/* Mobile Booking Bar */}
            <MobileReservationBar restaurant={restaurant} t={t} />
        </div>
    );
}
