import { useState, useEffect, useRef } from 'react';
import { Search, ChevronRight, MapPin, Utensils, Heart, Tag } from 'lucide-react';
import { translations } from './translations';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { RESTAURANTS, CATEGORIES, checkIsOpen, FEATURED_DISHES } from './data';

gsap.registerPlugin(ScrollTrigger);

const RestaurantCard = ({ restaurant, isFavorite, toggleFavorite, lang }) => {
    const cardRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const t = translations[lang].home;

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
                <h3 className="text-2xl mb-2 text-text-main">{restaurant.name}</h3>
                <p className="text-text-dim text-sm mb-6 line-clamp-2">{restaurant.description}</p>

                <div className="space-y-3">
                    {restaurant.menuCategories[1].items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center group/item">
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

export default function Home({ lang, favorites, toggleFavorite, showOnlyFavorites }) {
    const t = translations[lang];
    const th = t.home;
    const [activeCategory, setActiveCategory] = useState("Tudo");
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const heroRef = useRef(null);
    const gridRef = useRef(null);
    const slideshowRef = useRef(null);

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
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % FEATURED_DISHES.length);
        }, 5000);
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
            gsap.from(".hero-content > *", {
                y: 60,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power4.out"
            });

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
            {/* Hero Section */}
            <section ref={heroRef} className="relative pt-32 md:pt-44 pb-20 md:pb-32 px-4 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-4/5 bg-primary/5 blur-[120px] rounded-full -z-10"></div>
                <div className="max-w-7xl mx-auto text-center hero-content">
                    <span className="inline-block bg-primary/10 text-primary px-5 py-1.5 rounded-full font-bold text-[10px] md:text-sm uppercase tracking-widest mb-6">
                        🇨🇼 Maputo • Matola • Beira
                    </span>
                    <h1 className="text-5xl md:text-8xl mb-4 leading-[1.1] md:leading-[0.9] tracking-tighter text-text-main">
                        {t.hero.title_part1} <br />{showOnlyFavorites ? <span className="text-primary italic">Favoritos</span> : <span className="text-primary italic">{t.hero.title_part2}</span>}
                    </h1>
                    <p className="text-xl md:text-2xl text-text-dim max-w-2xl mx-auto mb-12 font-medium">
                        {t.hero.subtitle}
                    </p>

                    <div className="max-w-3xl mx-auto relative group">
                        <input
                            type="text"
                            placeholder={t.hero.search_placeholder}
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-full h-16 md:h-20 pl-6 md:pl-8 pr-28 md:pr-32 rounded-2xl md:rounded-[2rem] glass border-border-subtle text-lg md:text-xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-text-dim/50 text-text-main"
                        />
                        <button className="absolute right-2 top-2 bottom-2 bg-primary text-white px-5 md:px-8 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3 font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/20">
                            <Search size={20} /> <span className="hidden sm:inline">Descobrir</span>
                        </button>

                        {suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-4 bg-surface border border-border-subtle rounded-3xl shadow-2xl overflow-hidden z-[1000] text-left">
                                {suggestions.map((s, i) => (
                                    <Link
                                        key={i}
                                        to={`/restaurante/${s.slug}`}
                                        className="flex items-center justify-between px-8 py-4 hover:bg-primary/5 transition-colors border-b border-border-subtle last:border-0"
                                    >
                                        <div>
                                            <p className="font-bold text-text-main">{s.name}</p>
                                            <p className="text-xs text-text-dim uppercase tracking-wider">
                                                {s.type === 'restaurant' ? 'Restaurante' : `Prato em ${s.restaurant}`}
                                            </p>
                                        </div>
                                        <ChevronRight size={16} className="text-primary" />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Featured Slideshow */}
            <section ref={slideshowRef} className="max-w-7xl mx-auto px-4 mb-20 reveal overflow-hidden">
                <div className="relative rounded-[3rem] bg-black text-white overflow-hidden min-h-[550px] border border-white/5 shadow-2xl shadow-primary/5 flex items-center">

                    {/* Active Slide Background */}
                    <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full -z-0 hidden lg:block overflow-hidden">
                        <img
                            key={`img-${currentSlide}`}
                            src={FEATURED_DISHES[currentSlide].image}
                            alt={FEATURED_DISHES[currentSlide].name}
                            className="slide-image w-full h-full object-cover rounded-l-[3rem] opacity-50"
                        />
                    </div>
                    {/* Mobile background */}
                    <div className="absolute inset-0 lg:hidden -z-0 overflow-hidden">
                        <img
                            key={`mob-img-${currentSlide}`}
                            src={FEATURED_DISHES[currentSlide].image}
                            alt={FEATURED_DISHES[currentSlide].name}
                            className="slide-image w-full h-full object-cover opacity-30"
                        />
                    </div>

                    <div className="relative z-10 max-w-xl p-8 md:p-16 slide-content" key={`content-${currentSlide}`}>
                        <span className="text-accent font-bold uppercase tracking-[0.3em] text-sm">
                            {FEATURED_DISHES[currentSlide].tagline}
                        </span>
                        <h2 className="text-4xl md:text-6xl mt-6 mb-8 uppercase italic font-black leading-none text-white whitespace-pre-line">
                            {FEATURED_DISHES[currentSlide].name.replace(' ', '\n')}
                        </h2>
                        <p className="text-lg md:text-xl text-white/70 mb-12 font-medium">
                            {FEATURED_DISHES[currentSlide].desc}
                        </p>
                        <div className="flex flex-wrap items-center gap-8">
                            <Link
                                to={FEATURED_DISHES[currentSlide].link}
                                className="bg-primary px-10 py-5 rounded-2xl font-bold hover:bg-white hover:text-black transition-all text-lg whitespace-nowrap"
                            >
                                {th.view_restaurant}
                            </Link>
                            <div className="font-mono text-3xl font-bold text-accent">
                                {FEATURED_DISHES[currentSlide].price}
                            </div>
                        </div>
                    </div>

                    {/* Fixed Pagination dots */}
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

            {/* Categories */}
            <section className="max-w-7xl mx-auto px-4 mb-20 overflow-x-auto no-scrollbar py-4">
                <div className="flex gap-3 min-w-max">
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

            {/* Restaurant Grid */}
            <section className="max-w-7xl mx-auto px-4 pb-32">
                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredRestaurants.map(rest => (
                        <div key={rest.id} className="restaurant-card">
                            <RestaurantCard
                                restaurant={rest}
                                isFavorite={favorites.includes(rest.id)}
                                toggleFavorite={toggleFavorite}
                                lang={lang}
                            />
                        </div>
                    ))}
                </div>
            </section>


            {/* How it works */}
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
                            <p className="text-text-dim max-w-[250px]">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
