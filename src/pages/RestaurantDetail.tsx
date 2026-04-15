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
import { DetailStarRating, OrnamentalDivider } from '../components/restaurant/DetailShared';
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
    const [activeTab, setActiveTab] = useState<'menu' | 'about' | 'events' | 'reviews'>('menu');
    
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
                {restaurant.hero_image_url && (
                    <img 
                        src={restaurant.hero_image_url} 
                        alt={restaurant.name} 
                        className="absolute inset-0 w-full h-full object-cover scale-110"
                    />
                )}
            </section>

            {/* --- MAIN CONTENT --- */}
            <main className="max-w-7xl mx-auto px-4 md:px-8 xl:px-12 relative z-10 w-full">
                <div className="flex flex-col gap-8 xl:gap-12">
                    
                    {/* FULL WIDTH CONTENT: Menu, About, Events, Reviews */}
                    <div className="w-full space-y-12">
                        
                        {/* Restaurant Sub-Header */}
                        <div className="flex justify-between items-center px-6 md:px-8 py-6">
                            <div className="flex items-center gap-3">
                                <img 
                                    src={restaurant.logo_url || "https://placehold.co/100x100/e5e5e5/666666?text=REST"} 
                                    alt={restaurant.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <span className="font-serif text-2xl md:text-3xl text-gray-900">{restaurant.name}</span>
                            </div>
                            <div className="flex items-center gap-8">
                                {[
                                    { id: 'menu', label: 'MENU' },
                                    { id: 'about', label: 'VISITA & EXPERIÊNCIA' },
                                    { id: 'events', label: 'EVENTOS' },
                                    { id: 'reviews', label: 'REVIEWS' }
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
                                            ? 'text-red-600 border-b border-red-600' 
                                            : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div id="tab-content" className="reveal-up">
                            {activeTab === 'menu' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                                                     <h3 className="text-3xl font-display font-black text-text-main italic uppercase tracking-tighter mb-4">{restaurant.chefName}</h3>
                                                     <p className="text-text-dim text-lg italic font-medium leading-relaxed max-w-xl">
                                                         "{restaurant.chefQuote || 'A nossa cozinha é uma celebração dos sabores autênticos de Moçambique, elevada com técnicas modernas.'}"
                                                     </p>
                                                 </div>
                                             </div>
                                         </div>
                                     )}
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
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
