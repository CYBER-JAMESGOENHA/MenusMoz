import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
    ChevronLeft, 
    Share2, 
    Heart, 
    MessageCircle, 
    Info, 
    ArrowLeft, 
    Star,
    Navigation,
    Phone,
    Globe,
    BookOpen,
    Camera,
    Calendar,
    Users,
    CreditCard,
    Car,
    Accessibility,
    Trophy,
    Music,
    UtensilsCrossed
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { restaurantService } from '../services/restaurantService';
import { translations } from '../translations';
import { DetailStarRating } from '../components/restaurant/DetailShared';
import { MenuCategories } from '../components/restaurant/MenuCategories';
import { ReviewSection } from '../components/restaurant/ReviewSection';
import { EventsSection } from '../components/restaurant/EventsSection';
import { AboutSection } from '../components/restaurant/AboutSection';
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
    const [activeTab, setActiveTab] = useState<'menu' | 'about' | 'events'>('about');
    
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
        <div ref={containerRef} className="min-h-screen bg-bg">
            <Helmet>
                <title>{restaurant.name} | Locais de Moz</title>
                <meta name="description" content={restaurant.description} />
            </Helmet>

            {/* --- HERO SECTION --- */}
            <section ref={heroRef} className={`relative h-[50vh] md:h-[65vh] w-full overflow-hidden rounded-b-3xl ${!restaurant.hero_image_url ? 'bg-neutral-900' : ''}`}>
                {/* Mobile Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex md:hidden absolute top-16 left-4 z-30 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition"
                    aria-label="Voltar"
                >
                    <ChevronLeft size={24} />
                </button>
                {restaurant.hero_image_url && (
                    <img 
                        src={restaurant.hero_image_url} 
                        alt={restaurant.name} 
                        className="absolute inset-0 w-full h-full object-cover scale-110"
                    />
                )}
                <div className="absolute bottom-8 left-8 z-20">
                    <img 
                        src={restaurant.logo_url || restaurant.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(restaurant.name || 'R')}&background=000&color=fff&size=256&bold=true`} 
                        alt={restaurant.name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-white/20 shadow-xl bg-surface"
                    />
                </div>
                {/* Desktop Tabs - Inside Hero */}
                <div className="hidden md:flex absolute bottom-8 right-8 z-20 gap-8">
                    {[
                        { id: 'about', label: 'AMBIENTE' },
                        { id: 'menu', label: 'MENU' },
                        { id: 'events', label: 'EVENTOS' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id as any);
                                const element = document.getElementById('tab-content');
                                if (element) {
                                    const offset = window.innerWidth < 1024 ? 80 : 100;
                                    const bodyRect = document.body.getBoundingClientRect().top;
                                    const elementRect = element.getBoundingClientRect().top;
                                    const elementPosition = elementRect - bodyRect;
                                    const offsetPosition = elementPosition - offset;
                                    window.scrollTo({
                                        top: offsetPosition,
                                        behavior: 'smooth'
                                    });
                                }
                            }}
                            className={`text-sm uppercase tracking-wide font-medium transition-all whitespace-nowrap ${
                                activeTab === tab.id 
                                ? 'text-white border-b border-white' 
                                : 'text-white/70 hover:text-white'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </section>

            {/* --- MAIN CONTENT --- */}
            <main className="max-w-7xl mx-auto px-4 md:px-8 xl:px-12 relative z-10 w-full bg-bg">
                <div className="flex flex-col gap-8 xl:gap-12">
                    
                    {/* FULL WIDTH CONTENT: Menu, About, Events, Reviews */}
                    <div className="w-full space-y-12">
                        
                        {/* Restaurant Sub-Header - Mobile Only */}
                        <div className="flex md:hidden gap-3 items-center px-6 md:px-8 mt-8 mb-6 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                            {[
                                { id: 'about', label: 'AMBIENTE' },
                                { id: 'menu', label: 'MENU' },
                                { id: 'events', label: 'EVENTOS' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id as any);
                                        const element = document.getElementById('tab-content');
                                        if (element) {
                                            const offset = window.innerWidth < 1024 ? 80 : 100;
                                            const bodyRect = document.body.getBoundingClientRect().top;
                                            const elementRect = element.getBoundingClientRect().top;
                                            const elementPosition = elementRect - bodyRect;
                                            const offsetPosition = elementPosition - offset;
                                            window.scrollTo({
                                                top: offsetPosition,
                                                behavior: 'smooth'
                                            });
                                        }
                                    }}
                                    className={`px-5 py-2.5 text-sm font-medium rounded-full whitespace-nowrap transition-all ${
                                        activeTab === tab.id 
                                        ? 'bg-red-600 text-white' 
                                        : 'bg-white text-text-dim border border-border-subtle hover:bg-white dark:bg-neutral-800/60 dark:text-neutral-300 dark:border-white/5 dark:hover:bg-neutral-700/60'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div id="tab-content" className="reveal-up mt-8">
                            {activeTab === 'menu' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <MenuCategories 
                                        restaurant={restaurant}
                                    />
                                </div>
                            )}

                            {activeTab === 'about' && (
                                <AboutSection 
                                    restaurant={restaurant} 
                                    lang={lang} 
                                />
                            )}

                            {activeTab === 'events' && (
                                <EventsSection 
                                    restaurant={restaurant} 
                                    lang={lang} 
                                />
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
