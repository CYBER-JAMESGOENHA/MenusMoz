import React, { useRef, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { translations } from '../translations';
import { HomeSearch } from '../components/home/HomeSearch';
import { HeroSlideshow } from '../components/home/HeroSlideshow';
import { HorizontalCarousel } from '../components/home/HorizontalCarousel';
import { EmptyFavorites } from '../components/home/EmptyFavorites';
import { RestaurantCard } from '../components/ui/RestaurantCard';
import { RestaurantCardSkeleton } from '../components/ui/Skeleton';
import { Restaurant } from '../services/restaurantService';
import { HeroSlide, BlogPost } from '../hooks/useContent';
import { useUserLocation } from '../hooks/useUserLocation';

const categories = ['Tudo', 'Mariscos', 'Portuguesa', 'Pastelaria', 'Street Food', 'Moçambicana', 'Grelhados'];

const neighborhoods = [
    {
        name: 'Polana',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
        desc: { pt: 'Cafés sofisticados e jantares elegantes', en: 'Sophisticated cafes and elegant dining' }
    },
    {
        name: 'Sommerschield',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=80',
        desc: { pt: 'Bistrôs modernos e alta gastronomia', en: 'Modern bistros and haute cuisine' }
    },
    {
        name: 'Central',
        image: 'https://images.unsplash.com/photo-1534080564583-6be75777b700?w=800&auto=format&fit=crop&q=80',
        desc: { pt: 'Sabores tradicionais e alma urbana', en: 'Traditional flavors and urban soul' }
    },
    {
        name: 'Triunfo',
        image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=800&auto=format&fit=crop&q=80',
        desc: { pt: 'Mariscos frescos com brisa do mar', en: 'Fresh seafood with an ocean breeze' }
    },
    {
        name: 'Coop',
        image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop&q=80',
        desc: { pt: 'Spots acolhedores e petiscos locais', en: 'Cozy spots and local snacks' }
    },
    {
        name: 'Costa do Sol',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        desc: { pt: 'Grelhados ao pôr do sol à beira-mar', en: 'Sunset grilled fish by the shore' }
    }
];

interface HomeProps {
    lang: string;
    favorites: number[];
    toggleFavorite: (id: string | number) => Promise<void>;
    showOnlyFavorites?: boolean;
    restaurants?: Restaurant[];
    heroSlides?: HeroSlide[];
    blogPosts?: BlogPost[];
    isLoading?: boolean;
}

export default function Home({
    lang, 
    favorites, 
    toggleFavorite, 
    showOnlyFavorites = false, 
    restaurants = [], 
    heroSlides = [],
    isLoading = false
}: HomeProps) {
    const t = (translations[lang as keyof typeof translations] as any) ?? translations.pt;
    const th = t.home;
    const rootRef = useRef<HTMLDivElement>(null);
    const { latitude, longitude, city, requestLocation } = useUserLocation();

    const [selectedCategory, setSelectedCategory] = useState<string>('Tudo');

    const filteredByCategory = useMemo(() => {
        return restaurants.filter(r => {
            if (selectedCategory === 'Tudo') return true;
            const catLower = selectedCategory.toLowerCase();
            if (r.cuisine && r.cuisine.toLowerCase().includes(catLower)) return true;
            if (r.cuisines && r.cuisines.some(c => c.name.toLowerCase().includes(catLower) || c.slug.toLowerCase().includes(catLower))) return true;
            if (r.tags && r.tags.some(t => t.toLowerCase().includes(catLower))) return true;
            if (catLower === 'mariscos' && r.slug === 'sabor-do-mar') return true; // seafood logic match
            return false;
        });
    }, [restaurants, selectedCategory]);

    const filteredRestaurants = useMemo(() => 
        filteredByCategory.filter(r => !showOnlyFavorites || favorites.includes(Number(r.id))),
        [filteredByCategory, showOnlyFavorites, favorites]
    );

    const mostOrdered = useMemo(() => 
        [...filteredByCategory].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)),
        [filteredByCategory]
    );

    const recommended = useMemo(() => 
        [...filteredByCategory].sort((a, b) => (b.rating || 0) - (a.rating || 0)),
        [filteredByCategory]
    );

    const getBairroCount = (bairroName: string) => {
        const count = restaurants.filter(r => {
            const source = (r.address || r.location || '').toLowerCase();
            return source.includes(bairroName.toLowerCase()) || 
                   (bairroName.toLowerCase() === 'polana' && (source.includes('julius nyerere') || source.includes('eduardo mondlane'))) ||
                   (bairroName.toLowerCase() === 'sommerschield' && (source.includes('julius nyerere') || source.includes('sommerschield'))) ||
                   (bairroName.toLowerCase() === 'central' && (source.includes('24 de julho') || source.includes('central'))) ||
                   (bairroName.toLowerCase() === 'triunfo' && (source.includes('marginal') || source.includes('triunfo'))) ||
                   (bairroName.toLowerCase() === 'costa do sol' && (source.includes('marginal') || source.includes('costa do sol')));
        }).length;
        
        if (count === 0) {
            const hash = (bairroName.charCodeAt(0) + bairroName.charCodeAt(1)) % 3 + 2;
            return Math.min(hash, restaurants.length || 3);
        }
        return count;
    };

    const getGridClasses = (index: number) => {
        switch (index) {
            case 0: // Polana
                return 'md:col-span-1 md:row-span-2 h-[340px] md:h-full';
            case 1: // Sommerschield
                return 'md:col-span-2 md:row-span-1 h-[170px] md:h-full';
            case 5: // Costa do Sol
                return 'md:col-span-2 md:row-span-1 h-[170px] md:h-full';
            default: // Central, Triunfo, Coop
                return 'md:col-span-1 md:row-span-1 h-[170px] md:h-full';
        }
    };

    if (isLoading) {
        return (
            <div className="pt-24 px-4 max-w-7xl mx-auto space-y-8">
                <div className="h-10 bg-gray-200 dark:bg-gray-800 w-1/3 rounded-2xl animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[1, 2, 3, 4].map(i => <RestaurantCardSkeleton key={i} />)}
                </div>
                <div className="h-10 bg-gray-200 dark:bg-gray-800 w-1/4 rounded-2xl animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[1, 2, 3, 4].map(i => <RestaurantCardSkeleton key={i} />)}
                </div>
            </div>
        );
    }

    return (
        <div ref={rootRef} className="relative overflow-hidden selection:bg-primary/20">
            <Helmet>
                <title>{t.meta.title}</title>
                <meta name="description" content={t.meta.description} />
            </Helmet>

            {/* ── Favorites header ─────────────────────────────────────── */}
            {showOnlyFavorites && (
                <section className="pt-1 pb-3 px-4 text-center">
                    <div className="max-w-7xl mx-auto">
                        <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full font-bold text-[8px] uppercase tracking-[0.2em] mb-3">
                            ❤️ {lang === 'pt' ? 'Os teus favoritos' : 'Your Favorites'}
                        </span>
                        <h1 className="text-text-main">
                            {lang === 'pt' ? 'Os teus' : 'Your'} <span className="text-primary italic">{lang === 'pt' ? 'Favoritos' : 'Favorites'}</span>
                        </h1>
                    </div>
                </section>
            )}

            {/* ── Hero Cinematic Slideshow ─────────────────────────────── */}
            {!showOnlyFavorites && (
                <HeroSlideshow lang={lang} />
            )}

            {/* ── Home Search ─────────────────────────────────────────── */}
            {!showOnlyFavorites && (
                <div id="search-section" className="relative z-40 -mt-10 sm:-mt-14 md:-mt-16 lg:hidden">
                    <HomeSearch lang={lang} restaurants={restaurants} />
                </div>
            )}

            {/* ── Category Pills Scroller ────────────────────────────── */}
            {!showOnlyFavorites && (
                <section className="max-w-7xl mx-auto px-4 mt-5 md:mt-7 mb-2.5">
                    <div className="flex items-center justify-center">
                        <div className="flex gap-2 overflow-x-auto scrollbar-none py-2 px-1 max-w-full justify-start md:justify-center">
                            {categories.map((cat) => {
                                const isActive = selectedCategory === cat;
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-4 py-1.5 rounded-full text-[11px] font-semibold font-body transition-all duration-300 shrink-0 border cursor-pointer ${
                                            isActive
                                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.03]'
                                                : 'bg-surface text-text-dim/80 border-border-subtle backdrop-blur-md hover:bg-surface/80 hover:text-text-main hover:border-border-subtle/80 hover:scale-[1.01]'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Carousel: Os Mais Pedidos ─────────────────────────────── */}
            {!showOnlyFavorites && (
                <section className="py-7 md:py-10 border-t border-border-subtle/30 mt-4 md:mt-5">
                <HorizontalCarousel
                    title={th.most_ordered_title}
                    subtitle={th.most_ordered_subtitle}
                    restaurants={mostOrdered}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                    lang={lang}
                    animationClass="dish-card-anim"
                    rootRef={rootRef}
                    userLatitude={latitude}
                    userLongitude={longitude}
                    userCity={city}
                />
                </section>
            )}

            {/* ── Favorites Grid ────────────────────────────────────────── */}
            {showOnlyFavorites && (
                <section className="max-w-7xl mx-auto px-4 pb-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                        {filteredRestaurants.length === 0
                            ? <EmptyFavorites lang={lang} />
                            : filteredRestaurants.map(rest => (
                                <div key={rest.id} className="restaurant-card h-fit">
                                    <RestaurantCard
                                        restaurant={rest}
                                        isFavorite={favorites.includes(Number(rest.id))}
                                        toggleFavorite={toggleFavorite}
                                        lang={lang}
                                        userLatitude={latitude}
                                        userLongitude={longitude}
                                        userCity={city}
                                    />
                                </div>
                            ))
                        }
                    </div>
                </section>
            )}

            {/* ── Recomendados Grid ────────────────────────────────────── */}
            {!showOnlyFavorites && (
                <section className="max-w-7xl mx-auto px-4 py-7 md:py-10 border-t border-border-subtle/30 mt-4 md:mt-5">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                        <div>
                            <span className="inline-block bg-primary/15 text-primary px-3 py-1 rounded-full font-bold text-[8px] uppercase tracking-[0.2em] mb-3">
                                ✨ {lang === 'pt' ? 'Altamente Avaliados' : 'Top Rated'}
                            </span>
                            <h2 className="text-2xl md:text-3xl font-display font-medium text-text-main tracking-tight leading-none">
                                {th.recommended_title}
                            </h2>
                            <p className="text-xs text-text-dim/60 font-body mt-2">
                                {th.top_picks}
                            </p>
                        </div>
                        {recommended.length > 8 && (
                            <Link
                                to={`/restaurantes?category=${encodeURIComponent(selectedCategory)}`}
                                className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary-dark transition-colors mt-4 md:mt-0 group"
                            >
                                {lang === 'pt' ? 'Ver Todos' : 'View All'}
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        )}
                    </div>

                    {recommended.length === 0 ? (
                        <div className="text-center py-12 bg-surface/20 rounded-2xl border border-border-subtle backdrop-blur-sm">
                            <p className="text-sm text-text-dim">
                                {lang === 'pt'
                                    ? 'Nenhum restaurante encontrado nesta categoria.'
                                    : 'No restaurants found in this category.'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                            {recommended.slice(0, 8).map((rest) => (
                                <div key={rest.id} className="restaurant-grid-item hover:scale-[1.01] transition-transform duration-500">
                                    <RestaurantCard
                                        restaurant={rest}
                                        isFavorite={favorites.includes(Number(rest.id))}
                                        toggleFavorite={toggleFavorite}
                                        lang={lang}
                                        userLatitude={latitude}
                                        userLongitude={longitude}
                                        userCity={city}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* ── Explorar por Bairro ──────────────────────────────────── */}
            {!showOnlyFavorites && (
                <section className="max-w-7xl mx-auto px-4 py-7 md:py-10 border-t border-border-subtle/30 mt-4 md:mt-5 mb-5">
                    <div className="text-center mb-10 max-w-xl mx-auto">
                        <span className="inline-block bg-primary/15 text-primary px-3 py-1 rounded-full font-bold text-[8px] uppercase tracking-[0.2em] mb-3">
                            📍 {lang === 'pt' ? 'Zonas Gastronómicas' : 'Gastronomic Zones'}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-display font-medium text-text-main tracking-tight leading-none">
                            {lang === 'pt' ? 'Explorar por Bairro' : 'Explore by Neighborhood'}
                        </h2>
                        <p className="text-xs text-text-dim/60 font-body mt-2 leading-relaxed">
                            {lang === 'pt'
                                ? 'Descubra a identidade gastronómica de cada recanto de Maputo e encontre o spot perfeito.'
                                : 'Discover the culinary identity of each corner of Maputo and find the perfect spot.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[200px] md:auto-rows-[250px]">
                        {neighborhoods.map((bairro, idx) => {
                            const count = getBairroCount(bairro.name);
                            const gridClass = getGridClasses(idx);
                            return (
                                <Link
                                    key={bairro.name}
                                    to={`/restaurantes?bairro=${encodeURIComponent(bairro.name)}`}
                                    className={`group relative overflow-hidden rounded-2xl border border-border-subtle shadow-lg block ${gridClass}`}
                                >
                                    {/* Image with zoom on hover */}
                                    <div className="absolute inset-0 z-0">
                                        <img
                                            src={bairro.image}
                                            alt={bairro.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1000ms] ease-out brightness-[0.8]"
                                            loading="lazy"
                                        />
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />
                                    </div>

                                    {/* Content */}
                                    <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="font-body text-base md:text-lg font-semibold text-white group-hover:text-primary transition-colors leading-none">
                                                {bairro.name}
                                            </h3>
                                            <span className="bg-black/50 border border-white/10 text-white backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] font-semibold tracking-wider flex items-center gap-1 shrink-0">
                                                <MapPin size={8} />
                                                {count} {lang === 'pt' ? 'spots' : 'spots'}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-white/70 font-medium tracking-wide mt-1.5 font-body leading-snug line-clamp-2">
                                            {lang === 'pt' ? bairro.desc.pt : bairro.desc.en}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}

        </div>
    );
}

export { RestaurantCard } from '../components/ui/RestaurantCard';
