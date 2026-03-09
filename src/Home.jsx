import { useState, useEffect, useRef } from 'react';
import { MapPin, Utensils, Heart, Tag, Star, Search, ChevronRight } from 'lucide-react';
import { translations } from './translations';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { RESTAURANTS, CATEGORIES, checkIsOpen, FEATURED_DISHES } from './data';

gsap.registerPlugin(ScrollTrigger);

const StarRating = ({ rating }) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(i => (
                <Star
                    key={i}
                    size={12}
                    className={i <= full ? 'text-accent' : i === full + 1 && half ? 'text-accent opacity-60' : 'text-text-dim/30'}
                    fill={i <= full ? 'currentColor' : i === full + 1 && half ? 'currentColor' : 'none'}
                />
            ))}
            <span className="text-xs font-bold text-text-dim ml-1">{rating.toFixed(1)}</span>
        </div>
    );
};

const RestaurantCard = ({ restaurant, isFavorite, toggleFavorite, lang }) => {
    const cardRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const t = translations[lang].home;

    // Safely pick a category with items — prefer index 1, fallback to 0
    const previewCategory = restaurant.menuCategories.length > 1
        ? restaurant.menuCategories[1]
        : restaurant.menuCategories[0];

    return (
        <div
            ref={cardRef}
            className="group relative bg-surface rounded-[2rem] overflow-hidden card-hover border border-border-subtle"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative h-64 overflow-hidden">
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <div className="flex gap-2">
                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-primary">
                            {restaurant.cuisine}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm ${checkIsOpen(restaurant.hours) ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                            {checkIsOpen(restaurant.hours) ? t.open_now : t.closed}
                        </div>
                    </div>
                    {restaurant.offer && (
                        <div className="bg-accent text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg self-start">
                            <Tag size={10} /> {restaurant.offer}
                        </div>
                    )}
                </div>

                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(restaurant.id); }}
                    className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all ${isFavorite ? 'bg-primary text-white scale-110' : 'bg-white/50 text-black hover:bg-white'}`}
                >
                    <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                </button>
            </div>

            <div className="p-5 md:p-8">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-2xl text-text-main">{restaurant.name}</h3>
                    {restaurant.rating && (
                        <div className="flex items-center gap-1 shrink-0 mt-1">
                            <StarRating rating={restaurant.rating} />
                            {restaurant.reviewCount && (
                                <span className="text-[10px] text-text-dim ml-1">({restaurant.reviewCount})</span>
                            )}
                        </div>
                    )}
                </div>
                <p className="text-text-dim text-sm mb-6 line-clamp-2">{restaurant.description}</p>

                <div className="space-y-3">
                    {previewCategory.items.slice(0, 3).map((item) => (
                        <div key={item.name} className="flex justify-between items-center group/item">
                            <span className="text-sm border-b border-border-subtle flex-1 mr-4 pb-1 text-text-dim">{item.name}</span>
                            <span className="font-mono text-primary font-bold text-sm">{item.price}</span>
                        </div>
                    ))}
                </div>

                <div className={`mt-8 transition-all duration-500 scale-y-0 origin-top h-0 ${isHovered ? 'scale-y-100 h-12' : ''}`}>
                    <Link
                        to={`/restaurante/${restaurant.slug}`}
                        className="w-full bg-black text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary transition-colors"
                    >
                        {t.view_full_menu} <ChevronRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

const EmptyFavorites = ({ lang }) => {
    const isPt = lang === 'pt';
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 rounded-[2rem] bg-primary/10 flex items-center justify-center mb-8">
                <Heart size={44} className="text-primary" />
            </div>
            <h3 className="text-3xl font-black tracking-tighter text-text-main mb-4">
                {isPt ? 'Nenhum favorito ainda' : 'No favorites yet'}
            </h3>
            <p className="text-text-dim max-w-sm mb-10 text-lg">
                {isPt
                    ? 'Guarda os teus restaurantes favoritos tocando no ❤️ em qualquer card.'
                    : 'Save your favorite restaurants by tapping ❤️ on any card.'}
            </p>
            <Link
                to="/"
                className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-lg hover:brightness-110 transition-all shadow-lg shadow-primary/20"
            >
                {isPt ? 'Explorar Restaurantes' : 'Explore Restaurants'}
            </Link>
        </div>
    );
};

const HomeSearch = ({ lang }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const searchRef = useRef(null);
    const t = translations[lang];

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.length > 1) {
            const filteredRest = RESTAURANTS.filter(r =>
                r.name.toLowerCase().includes(query.toLowerCase()) ||
                r.cuisine.toLowerCase().includes(query.toLowerCase())
            ).map(r => ({ type: 'restaurant', name: r.name, slug: r.slug }));

            const filteredDishes = [];
            RESTAURANTS.forEach(r => {
                r.menuCategories.forEach(cat => {
                    cat.items.forEach(item => {
                        if (item.name.toLowerCase().includes(query.toLowerCase())) {
                            filteredDishes.push({ type: 'dish', name: item.name, restaurant: r.name, slug: r.slug });
                        }
                    });
                });
            });
            setSuggestions([...filteredRest, ...filteredDishes.slice(0, 5)]);
        } else {
            setSuggestions([]);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setSuggestions([]);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={searchRef} className="max-w-4xl mx-auto px-4 mb-8 relative z-[100]">
            <div className="group relative">
                <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-3xl group-hover:bg-primary/20 transition-all duration-500" />
                <div className="relative flex items-center glass border border-border-subtle rounded-3xl px-6 py-5 shadow-2xl">
                    <Search size={24} className="text-primary shrink-0 mr-4" />
                    <input
                        type="text"
                        placeholder={t.hero?.search_placeholder || 'O que você quer comer hoje?'}
                        value={searchQuery}
                        onChange={handleSearch}
                        className="bg-transparent border-none outline-none text-xl text-text-main placeholder:text-text-dim/40 w-full font-medium"
                    />
                </div>

                {suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-4 bg-surface/95 backdrop-blur-xl border border-border-subtle rounded-[2rem] shadow-2xl overflow-hidden z-[2000] text-left animate-in fade-in slide-in-from-top-4 duration-300">
                        {suggestions.map((s, i) => (
                            <Link
                                key={i}
                                to={`/restaurante/${s.slug}`}
                                onClick={() => { setSuggestions([]); setSearchQuery(''); }}
                                className="flex items-center justify-between px-8 py-4 hover:bg-primary/10 transition-colors border-b border-border-subtle last:border-0"
                            >
                                <div>
                                    <p className="font-bold text-lg text-text-main">{s.name}</p>
                                    <p className="text-xs text-text-dim uppercase tracking-widest font-bold">
                                        {s.type === 'restaurant' ? 'Estabelecimento' : `Prato • ${s.restaurant}`}
                                    </p>
                                </div>
                                <ChevronRight size={18} className="text-primary" />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default function Home({ lang, favorites, toggleFavorite, showOnlyFavorites }) {
    const t = translations[lang];
    const th = t.home;
    const [activeCategory, setActiveCategory] = useState("Tudo");
    const [currentSlide, setCurrentSlide] = useState(0);
    const gridRef = useRef(null);
    const slideshowRef = useRef(null);


    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % FEATURED_DISHES.length);
        }, 2500);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (slideshowRef.current) {
            gsap.fromTo(".slide-content",
                { opacity: 0, x: 20 },
                { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }
            );
            gsap.fromTo(".slide-image",
                { opacity: 0, scale: 1.05 },
                { opacity: 0.5, scale: 1, duration: 4, ease: "power1.out" }
            );
        }
    }, [currentSlide]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.utils.toArray(".restaurant-card").forEach((card, i) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    },
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    delay: i % 3 * 0.1,
                    ease: "power2.out"
                });
            });
        });
        return () => ctx.revert();
    }, []);

    const filteredRestaurants = (activeCategory === "Tudo" ? RESTAURANTS : RESTAURANTS.filter(r => r.cuisine.includes(activeCategory) || (activeCategory === "Moçambicana" && r.cuisine.includes("Matapa"))))
        .filter(r => !showOnlyFavorites || favorites.includes(r.id));

    return (
        <div className="relative overflow-hidden">
            {/* Favorites Mini Header — only when showOnlyFavorites */}
            {showOnlyFavorites && (
                <section className="pt-36 pb-8 px-4 text-center">
                    <div className="max-w-7xl mx-auto">
                        <span className="inline-block bg-primary/10 text-primary px-5 py-1.5 rounded-full font-bold text-[10px] md:text-sm uppercase tracking-widest mb-6">
                            ❤️ Os teus favoritos
                        </span>
                        <h1 className="text-5xl md:text-7xl mb-4 leading-tight tracking-tighter text-text-main">
                            {lang === 'pt' ? 'Os teus' : 'Your'} <span className="text-primary italic">{lang === 'pt' ? 'Favoritos' : 'Favorites'}</span>
                        </h1>
                        <p className="text-xl text-text-dim max-w-2xl mx-auto font-medium">
                            {lang === 'pt' ? 'Os restaurantes que guardaste para visitar.' : 'The restaurants you saved to visit.'}
                        </p>
                    </div>
                </section>
            )}

            {!showOnlyFavorites && <HomeSearch lang={lang} />}

            {/* Featured Slideshow — Hero, only on main page */}
            {!showOnlyFavorites && (
                <section ref={slideshowRef} className="max-w-7xl mx-auto px-4 pt-4 md:pt-8 mb-12 reveal overflow-hidden">
                    <div className="relative rounded-[3rem] bg-black text-white overflow-hidden min-h-[300px] md:min-h-[550px] border border-white/5 shadow-2xl shadow-primary/5 flex items-center">

                        {/* Active Slide Background */}
                        <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full -z-0 hidden lg:block overflow-hidden pointer-events-none">
                            <img
                                key={`img-${currentSlide}`}
                                src={FEATURED_DISHES[currentSlide].image}
                                alt={FEATURED_DISHES[currentSlide].name}
                                className="slide-image w-full h-full object-cover rounded-l-[3rem] opacity-50"
                            />
                        </div>
                        {/* Mobile background */}
                        <div className="absolute inset-0 lg:hidden -z-0 overflow-hidden pointer-events-none">
                            <img
                                key={`mob-img-${currentSlide}`}
                                src={FEATURED_DISHES[currentSlide].image}
                                alt={FEATURED_DISHES[currentSlide].name}
                                className="slide-image w-full h-full object-cover opacity-40"
                            />
                        </div>

                        <div className="relative z-10 max-w-xl p-6 md:p-16 slide-content" key={`content-${currentSlide}`}>
                            <span className="text-accent font-bold uppercase tracking-[0.3em] text-[10px] md:text-sm">
                                {FEATURED_DISHES[currentSlide].tagline}
                            </span>
                            <h2 className="text-3xl md:text-6xl mt-3 md:mt-6 mb-4 md:mb-8 uppercase italic font-black leading-none text-white whitespace-normal md:whitespace-pre-line">
                                {FEATURED_DISHES[currentSlide].name}
                            </h2>
                            <p className="text-sm md:text-xl text-white/70 mb-6 md:mb-12 font-medium line-clamp-2 md:line-clamp-none">
                                {FEATURED_DISHES[currentSlide].desc}
                            </p>
                            <div className="flex flex-wrap items-center gap-8">
                                <Link
                                    to={FEATURED_DISHES[currentSlide].link}
                                    className="bg-primary px-8 py-4 md:px-10 md:py-5 rounded-2xl font-bold hover:bg-white hover:text-black transition-all text-base md:text-lg whitespace-nowrap"
                                >
                                    {th.view_restaurant}
                                </Link>
                            </div>
                        </div>

                        {/* Pagination dots */}
                        <div className="absolute bottom-8 left-8 md:bottom-16 md:left-16 z-20 flex gap-3">
                            {FEATURED_DISHES.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentSlide(i)}
                                    className={`h-2 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-12 bg-primary' : 'w-2 bg-white/20'}`}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Categories */}
            {!showOnlyFavorites && (
                <section className="max-w-7xl mx-auto px-4 mb-20 overflow-x-auto no-scrollbar py-4 w-full">
                    <div className="flex gap-3 min-w-0 md:min-w-max">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-8 py-4 rounded-full font-bold transition-all whitespace-nowrap ${activeCategory === cat
                                    ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105'
                                    : 'bg-surface text-text-main border border-border-subtle hover:border-primary/30'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {/* Restaurant Grid */}
            <section className="max-w-7xl mx-auto px-4 pb-32">
                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredRestaurants.length === 0 && showOnlyFavorites
                        ? <EmptyFavorites lang={lang} />
                        : filteredRestaurants.map(rest => (
                            <div key={rest.id} className="restaurant-card">
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

            {/* How it works — only on main page */}
            {!showOnlyFavorites && (
                <section className="max-w-7xl mx-auto px-4 mb-32 text-center">
                    <h2 className="text-4xl md:text-5xl mb-12 md:20 tracking-tighter italic">{th.how_it_works}</h2>
                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { icon: Search, title: th.step1_title, desc: th.step1_desc, color: "icon-blue" },
                            { icon: Utensils, title: th.step2_title, desc: th.step2_desc, color: "icon-orange" },
                            { icon: MapPin, title: th.step3_title, desc: th.step3_desc, color: "icon-green" }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center group">
                                <div className={`w-24 h-24 ${item.color} flex items-center justify-center rounded-[2rem] mb-8 transition-transform group-hover:scale-110 shadow-lg shadow-black/5`}>
                                    <item.icon size={44} />
                                </div>
                                <h4 className="text-2xl mb-4 uppercase font-black text-text-main">{item.title}</h4>
                                <p className="text-text-dim max-w-xs mx-auto md:max-w-[250px]">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
