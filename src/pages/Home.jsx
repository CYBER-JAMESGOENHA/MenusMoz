import React, { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { translations } from '../translations';
import { HeroSlideshow } from '../components/home/HeroSlideshow';
import { HomeSearch } from '../components/home/HomeSearch';
import { CategoryFilter } from '../components/home/CategoryFilter';
import { HorizontalCarousel } from '../components/home/HorizontalCarousel';
import { EmptyFavorites } from '../components/home/EmptyFavorites';
import { RestaurantCard } from '../components/ui/RestaurantCard';

export default function Home({ lang, favorites, toggleFavorite, showOnlyFavorites, restaurants = [], heroSlides = [] }) {
    const t = translations[lang] ?? translations.pt;
    const th = t.home;
    const rootRef = useRef(null);

    const filteredRestaurants = restaurants.filter(
        r => !showOnlyFavorites || favorites.includes(r.id)
    );

    const mostOrdered = [...restaurants].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    const recommended = [...restaurants].sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return (
        <div ref={rootRef} className="relative overflow-hidden selection:bg-primary/20">
            <Helmet>
                <title>{t.meta.title}</title>
                <meta name="description" content={t.meta.description} />
            </Helmet>

            {/* ── Favorites header ─────────────────────────────────────── */}
            {showOnlyFavorites && (
                <section className="pt-40 pb-12 px-4 text-center">
                    <div className="max-w-7xl mx-auto">
                        <span className="inline-block bg-primary/10 text-primary px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.3em] mb-8">
                            ❤️ {lang === 'pt' ? 'Os teus favoritos' : 'Your Favorites'}
                        </span>
                        <h1 className="text-6xl md:text-8xl mb-6 leading-[0.9] tracking-tighter text-text-main font-display italic">
                            {lang === 'pt' ? 'Os teus' : 'Your'} <span className="text-primary italic">{lang === 'pt' ? 'Favoritos' : 'Favorites'}</span>
                        </h1>
                    </div>
                </section>
            )}

            {/* ── Hero Slideshow ────────────────────────────────────────── */}
            {!showOnlyFavorites && <HeroSlideshow heroSlides={heroSlides} th={th} rootRef={rootRef} />}

            {/* ── Search Bar ────────────────────────────────────────────── */}
            {!showOnlyFavorites && <HomeSearch lang={lang} restaurants={restaurants} />}

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
                                <div key={rest.id} className="restaurant-card opacity-0 translate-y-8 h-full min-h-[380px]">
                                    <RestaurantCard
                                        restaurant={rest}
                                        isFavorite={favorites.includes(rest.id)}
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

// Re-export RestaurantCard so existing consumers (e.g. RestaurantListing) keep working
export { RestaurantCard } from '../components/ui/RestaurantCard';
