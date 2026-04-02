import React, { useRef, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { translations } from '../translations';
import { HeroSlideshow } from '../components/home/HeroSlideshow';
import { CategoryFilter } from '../components/home/CategoryFilter';
import { MarqueeBanner } from '../components/home/MarqueeBanner';
import { HorizontalCarousel } from '../components/home/HorizontalCarousel';
import { EmptyFavorites } from '../components/home/EmptyFavorites';
import { RestaurantCard } from '../components/ui/RestaurantCard';
import { RestaurantCardSkeleton } from '../components/ui/Skeleton';
import { Restaurant } from '../services/restaurantService';
import { HeroSlide, BlogPost } from '../hooks/useContent';

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

    const filteredRestaurants = useMemo(() => 
        restaurants.filter(r => !showOnlyFavorites || favorites.includes(Number(r.id))),
        [restaurants, showOnlyFavorites, favorites]
    );

    const mostOrdered = useMemo(() => 
        [...restaurants].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)),
        [restaurants]
    );

    const recommended = useMemo(() => 
        [...restaurants].sort((a, b) => (b.rating || 0) - (a.rating || 0)),
        [restaurants]
    );

    if (isLoading) {
        return (
            <div className="pt-32 px-4 max-w-7xl mx-auto space-y-12">
                <div className="h-12 bg-gray-200 dark:bg-gray-800 w-1/3 rounded-2xl animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <RestaurantCardSkeleton key={i} />)}
                </div>
                <div className="h-12 bg-gray-200 dark:bg-gray-800 w-1/4 rounded-2xl animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <section className="pt-28 pb-10 px-4 text-center">
                    <div className="max-w-7xl mx-auto">
                        <span className="inline-block bg-primary/10 text-primary px-5 py-1.5 rounded-full font-black text-[10px] uppercase tracking-[0.3em] mb-6">
                            ❤️ {lang === 'pt' ? 'Os teus favoritos' : 'Your Favorites'}
                        </span>
                        <h1 className="text-4xl md:text-6xl mb-4 leading-[0.9] tracking-tighter text-text-main font-display italic">
                            {lang === 'pt' ? 'Os teus' : 'Your'} <span className="text-primary italic">{lang === 'pt' ? 'Favoritos' : 'Favorites'}</span>
                        </h1>
                    </div>
                </section>
            )}

            {/* ── Hero Slideshow ────────────────────────────────────────── */}
            {!showOnlyFavorites && <HeroSlideshow heroSlides={heroSlides} th={th} rootRef={rootRef} />}

            {/* ── Marquee Banner ────────────────────────────────────────── */}
            {!showOnlyFavorites && <MarqueeBanner />}

            {/* ── Category Filter Pills ──────────────────────────────────── */}
            {!showOnlyFavorites && (
                <CategoryFilter />
            )}

            {/* ── Carousel: Os Mais Pedidos ─────────────────────────────── */}
            {!showOnlyFavorites && (
                <HorizontalCarousel
                    title="Os Mais Pedidos"
                    subtitle="Os clássicos que nunca falham"
                    restaurants={mostOrdered}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                    lang={lang}
                    animationClass="dish-card-anim"
                    rootRef={rootRef}
                />
            )}

            {/* ── Favorites Grid ────────────────────────────────────────── */}
            {showOnlyFavorites && (
                <section className="max-w-7xl mx-auto px-4 pb-20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredRestaurants.length === 0
                            ? <EmptyFavorites lang={lang} />
                            : filteredRestaurants.map(rest => (
                                <div key={rest.id} className="restaurant-card h-full min-h-[380px]">
                                    <RestaurantCard
                                        restaurant={rest}
                                        isFavorite={favorites.includes(Number(rest.id))}
                                        toggleFavorite={toggleFavorite}
                                        lang={lang}
                                    />
                                </div>
                            ))
                        }
                    </div>
                </section>
            )}

            {/* ── Carousel: Recomendados ────────────────────────────────── */}
            {!showOnlyFavorites && (
                <HorizontalCarousel
                    title={th.recommended_title}
                    subtitle={th.top_picks}
                    restaurants={recommended}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                    lang={lang}
                    animationClass="recommended-card"
                    rootRef={rootRef}
                />
            )}

        </div>
    );
}

export { RestaurantCard } from '../components/ui/RestaurantCard';
