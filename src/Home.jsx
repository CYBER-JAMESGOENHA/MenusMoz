import { useState, useEffect, useRef } from 'react';
import { MapPin, Utensils, Heart, Tag, Star, Search, ChevronRight, ChevronLeft, Mouse } from 'lucide-react';
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

const EmptyFavorites = ({ lang }) => {
    const t = lang === 'pt' ? 'Não tens favoritos ainda.' : 'No favorites yet.';
    const sub = lang === 'pt' ? 'Explora os melhores sabores de Moçambique e guarda os teus preferidos aqui.' : 'Explore the best flavors of Mozambique and save your favorites here.';
    const btn = lang === 'pt' ? 'Explorar Agora' : 'Explore Now';
    return (
        <div className="col-span-full py-32 text-center reveal">
            <div className="w-32 h-32 bg-primary/10 rounded-[3rem] flex items-center justify-center text-primary mx-auto mb-10 shadow-premium">
                <Heart size={64} />
            </div>
            <h2 className="text-4xl md:text-6xl font-display mb-6 tracking-tight text-text-main italic">{t}</h2>
            <p className="text-text-dim text-xl max-w-md mx-auto mb-12 font-medium leading-relaxed italic">"{sub}"</p>
            <Link to="/" className="inline-flex items-center gap-4 bg-primary text-white px-10 py-5 rounded-full font-black text-lg shadow-premium hover:shadow-primary-glow transition-all">
                {btn} <ChevronRight size={24} />
            </Link>
        </div>
    );
};

const RestaurantCard = ({ restaurant, isFavorite, toggleFavorite, lang }) => {
    const cardRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const t = translations[lang].home;

    const previewCategory = restaurant.menuCategories.length > 1
        ? restaurant.menuCategories[1]
        : restaurant.menuCategories[0];

    return (
        <div
            ref={cardRef}
            className="group relative bg-surface rounded-custom-lg overflow-hidden card-hover border border-border-subtle"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative h-56 overflow-hidden">
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <div className="flex gap-2">
                        <div className="bg-white/95 backdrop-blur-xl px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-primary shadow-sm">
                            {restaurant.cuisine}
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-xl shadow-sm ${checkIsOpen(restaurant.hours) ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                            {checkIsOpen(restaurant.hours) ? t.open_now : t.closed}
                        </div>
                    </div>
                </div>

                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(restaurant.id); }}
                    className={`absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${isFavorite ? 'bg-primary text-white scale-110 shadow-primary-glow' : 'bg-white/90 glass text-black hover:bg-white'}`}
                >
                    <Heart size={22} fill={isFavorite ? "currentColor" : "none"} className={isFavorite ? "animate-pulse" : ""} />
                </button>
                
                <div className="absolute bottom-6 left-6 right-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                     <p className="text-white text-xs font-medium line-clamp-2 italic">"{restaurant.description}"</p>
                </div>
            </div>

            <div className="px-5 pb-5 pt-3 md:px-6 md:pb-6 md:pt-4">
                <div className="flex flex-col gap-1.5 mb-4 md:mb-5">
                    <h3 className="text-xl font-display leading-tight text-text-main group-hover:text-primary transition-colors">{restaurant.name}</h3>
                    {restaurant.rating && (
                        <div className="flex items-center">
                            <StarRating rating={restaurant.rating} />
                        </div>
                    )}
                </div>

                <div className="mb-5">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary/80">{lang === 'pt' ? 'Assinatura do Chef' : 'Chef\'s Signature'}</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-baseline gap-3">
                           <span className="text-base font-display font-bold text-text-main leading-none line-clamp-1">{previewCategory.items[0].name}</span>
                           <div className="flex-1 border-b border-dotted border-border-subtle/50 mx-2 relative top-[-4px]" />
                           <span className="font-mono text-text-main font-black text-[12px] whitespace-nowrap">{previewCategory.items[0].price}</span>
                        </div>
                        <p className="text-[10px] text-text-dim/80 line-clamp-2 leading-relaxed italic">"{previewCategory.items[0].desc}"</p>
                    </div>
                </div>

                <Link
                    to={`/restaurante/${restaurant.slug}`}
                    className="w-full bg-text-main text-surface py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-primary transition-all duration-300 group-hover:shadow-lg translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                >
                    {t.view_full_menu} <ChevronRight size={18} />
                </Link>
            </div>
        </div>
    );
};


const HomeSearch = ({ lang }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
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
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={searchRef} className="max-w-4xl mx-auto px-4 mt-2 mb-2 relative z-[100]">
            <div className={`group relative transform transition-all duration-700 ${isFocused ? 'scale-[1.02]' : 'hover:-translate-y-1'}`}>
                {/* Animated glowing border effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r from-primary via-moz-yellow to-moz-green rounded-[3rem] blur-xl transition-all duration-1000 ${isFocused ? 'opacity-40 animate-pulse' : 'opacity-0 group-hover:opacity-20'}`}></div>

                <div className={`relative flex items-center bg-surface/80 backdrop-blur-2xl border transition-all duration-500 rounded-3xl md:rounded-[3rem] px-5 sm:px-8 py-3 md:py-4 ${isFocused ? 'border-primary shadow-premium shadow-primary/10' : 'border-border-subtle shadow-xl'}`}>
                    <Search size={22} className={`transition-colors duration-500 ${isFocused ? 'text-primary' : 'text-text-dim/50'}`} />
                    <input
                        type="text"
                        placeholder={t.hero?.search_placeholder || 'O que você quer comer hoje?'}
                        value={searchQuery}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => !suggestions.length && setIsFocused(false)}
                        onChange={handleSearch}
                        className="bg-transparent border-none outline-none text-lg md:text-2xl text-text-main placeholder:text-text-dim/40 w-full font-display font-medium px-4"
                    />
                </div>

                {suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-4 bg-surface/95 backdrop-blur-2xl border border-border-subtle rounded-custom shadow-premium overflow-hidden z-[2000] text-left animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="px-8 py-4 bg-primary/5 border-b border-border-subtle">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{lang === 'pt' ? 'Resultados Encontrados' : 'Search Results'}</span>
                        </div>
                        {suggestions.map((s, i) => (
                            <Link
                                key={i}
                                to={`/restaurante/${s.slug}`}
                                onClick={() => { setSuggestions([]); setSearchQuery(''); setIsFocused(false); }}
                                className="flex items-center justify-between px-8 py-5 hover:bg-primary/5 transition-all group/item border-b border-border-subtle last:border-0"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${s.type === 'restaurant' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
                                        {s.type === 'restaurant' ? <Utensils size={18} /> : <Heart size={18} />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg text-text-main group-hover/item:text-primary transition-colors">{s.name}</p>
                                        <p className="text-[10px] text-text-dim uppercase tracking-widest font-black">
                                            {s.type === 'restaurant' ? (lang === 'pt' ? 'Estabelecimento' : 'Restaurant') : `${lang === 'pt' ? 'Prato' : 'Dish'} • ${s.restaurant}`}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight size={20} className="text-primary opacity-0 group-hover/item:opacity-100 transform translate-x-2 group-hover/item:translate-x-0 transition-all" />
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

    const scrollCarousel = (direction) => {
        if (gridRef.current) {
            const scrollAmount = window.innerWidth > 1024 ? 900 : window.innerWidth > 768 ? 600 : 320;
            gridRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };


    useEffect(() => {
        if (slideshowRef.current) {
            // Efeito de parallax no scroll (puxando ligeiramente na direção oposta ao dar o scroll real)
            gsap.to(".hero-parallax-bg", {
                y: "15%",
                ease: "none",
                scrollTrigger: {
                    trigger: slideshowRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });
        }
    }, []);

    const filteredRestaurants = (activeCategory === "Tudo" ? RESTAURANTS : RESTAURANTS.filter(r => r.cuisine.includes(activeCategory) || (activeCategory === "Moçambicana" && r.cuisine.includes("Matapa"))))
        .filter(r => !showOnlyFavorites || favorites.includes(r.id));

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
                { opacity: 0, scale: 1.05, filter: "brightness(0.8)" },
                { opacity: 1, scale: 1, filter: "brightness(1)", duration: 2, ease: "power2.out" }
            );
        }
    }, [currentSlide]);

    useEffect(() => {
        if (filteredRestaurants.length > 0) {
            gsap.to(".restaurant-card", {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: gridRef.current,
                    start: "top 85%",
                }
            });
        }
    }, [filteredRestaurants, activeCategory]);

    return (
        <div className="relative overflow-hidden selection:bg-primary/20">
            {/* Favorites Mini Header — only when showOnlyFavorites */}
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

            {/* Featured Slideshow — Editorial Hero */}
            {!showOnlyFavorites && (
                <section ref={slideshowRef} className="max-w-[1440px] mx-auto px-4 pt-12 md:pt-14 mb-2 reveal overflow-hidden">
                    <div className="relative rounded-3xl md:rounded-custom-lg bg-black text-white overflow-hidden min-h-[280px] sm:min-h-[320px] md:min-h-[380px] border border-white/10 shadow-premium flex items-center">

                        {/* Brighter Advertisement Background */}
                        <div className="hero-parallax-bg absolute inset-0 z-0 h-[115%] w-full -top-[7.5%]">
                            <img
                                key={`img-${currentSlide}`}
                                src={FEATURED_DISHES[currentSlide].image}
                                alt={FEATURED_DISHES[currentSlide].name}
                                className="slide-image w-full h-full object-cover rounded-3xl md:rounded-custom-lg opacity-100 scale-100 transition-all duration-1000"
                            />
                            {/* Even lighter adaptive overlay for maximum image "light" */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-1" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent z-1 hidden sm:block" />
                        </div>

                        <div className="relative z-10 w-full max-w-lg p-6 sm:p-8 md:p-10 slide-content" key={`content-${currentSlide}`}>
                            <div className="flex flex-col gap-1.5 md:gap-2 mb-3 md:mb-4">
                                <span className="text-accent font-black uppercase tracking-[0.4em] text-[8px] md:text-[10px]">
                                    {FEATURED_DISHES[currentSlide].tagline}
                                </span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl mb-3 md:mb-4 leading-tight tracking-tighter italic font-display text-white drop-shadow-xl">
                                {FEATURED_DISHES[currentSlide].name}
                            </h2>
                            <p className="text-xs sm:text-sm md:text-base text-white/95 mb-5 md:mb-6 font-medium leading-relaxed max-w-[240px] sm:max-w-xs drop-shadow-lg">
                                {FEATURED_DISHES[currentSlide].desc}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 md:gap-6">
                                <Link
                                    to={FEATURED_DISHES[currentSlide].link}
                                    className="bg-white text-black px-8 py-3.5 md:py-3 rounded-xl font-black hover:bg-primary hover:text-white transition-all text-xs md:text-sm shadow-xl flex items-center gap-2 group/btn min-h-[44px]"
                                >
                                    {th.view_restaurant} <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>

                        {/* Scroll Indicator REMOVED */}

                        {/* Classic Horizontal Pagination — Numbers Removed for Premium Vibe */}
                        <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-8 md:bottom-12 md:left-16 z-20 flex items-center gap-3 sm:gap-4">
                             {FEATURED_DISHES.map((dish, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentSlide(i)}
                                    className="group py-2 sm:py-4 min-h-[44px] flex items-center"
                                >
                                    <div className={`h-1 rounded-full transition-all duration-700 ${currentSlide === i ? 'w-10 sm:w-12 bg-primary' : 'w-5 sm:w-6 bg-white/30 group-hover:bg-white/60'}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {!showOnlyFavorites && <HomeSearch lang={lang} />}

            {/* Categories — tactile pills */}
            {!showOnlyFavorites && (
                <section className="max-w-7xl mx-auto px-4 mb-2 overflow-x-auto no-scrollbar w-full">
                    <div className="flex gap-3 md:gap-4 min-w-0 md:min-w-max pb-1">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 md:px-10 py-2.5 md:py-3 rounded-full font-black text-xs md:text-sm transition-all duration-500 whitespace-nowrap min-h-[40px] ${activeCategory === cat
                                    ? 'bg-primary text-white shadow-premium shadow-primary/30 -translate-y-1 scale-105'
                                    : 'bg-surface text-text-main border border-border-subtle hover:border-primary/50 hover:shadow-lg'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {/* Restaurant Carousel */}
            <section className="max-w-7xl mx-auto px-4 pb-8 md:pb-12 relative group/carousel">
                <button 
                  onClick={(e) => { e.preventDefault(); scrollCarousel('left'); }}
                  className="absolute left-6 md:-left-4 top-[40%] -translate-y-1/2 z-30 w-14 h-14 rounded-full glass bg-surface/80 text-text-main shadow-premium hidden sm:flex items-center justify-center opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-110 hover:text-primary"
                >
                    <ChevronLeft size={28} />
                </button>
                <button 
                  onClick={(e) => { e.preventDefault(); scrollCarousel('right'); }}
                  className="absolute right-6 md:-right-4 top-[40%] -translate-y-1/2 z-30 w-14 h-14 rounded-full glass bg-surface/80 text-text-main shadow-premium hidden sm:flex items-center justify-center opacity-100 hover:opacity-100 transition-all duration-300 hover:scale-110 hover:text-primary animate-pulse hover:animate-none"
                >
                    <ChevronRight size={28} />
                </button>

                <div ref={gridRef} className="flex overflow-x-auto gap-6 lg:gap-8 pb-4 pt-1 no-scrollbar snap-x snap-mandatory">
                    {filteredRestaurants.length === 0 && showOnlyFavorites
                        ? <div className="w-full shrink-0"><EmptyFavorites lang={lang} /></div>
                        : filteredRestaurants.map(rest => (
                            <div key={rest.id} className="restaurant-card opacity-0 translate-y-8 shrink-0 w-[85vw] sm:w-[320px] lg:w-[270px] xl:w-[290px] snap-start">
                                <RestaurantCard
                                    restaurant={rest}
                                    isFavorite={favorites.includes(rest.id)}
                                    toggleFavorite={toggleFavorite}
                                    lang={lang}
                                />
                            </div>
                        ))
                    }
                    {/* View All Card */}
                    {filteredRestaurants.length > 0 && !showOnlyFavorites && (
                        <div className="restaurant-card opacity-0 translate-y-8 shrink-0 w-[85vw] sm:w-[320px] lg:w-[270px] xl:w-[290px] snap-start flex items-center justify-center">
                            <Link to="/restaurantes" className="flex flex-col items-center justify-center gap-4 w-full h-full min-h-[420px] bg-surface rounded-custom-lg border border-border-subtle card-hover hover:border-primary/50 group/viewall transition-all duration-300">
                                <div className="w-20 h-20 rounded-[2rem] bg-primary/10 text-primary flex items-center justify-center group-hover/viewall:bg-primary group-hover/viewall:text-white group-hover/viewall:shadow-primary-glow transition-all duration-500 group-hover/viewall:scale-110">
                                    <ChevronRight size={40} className="group-hover/viewall:translate-x-1 transition-transform" />
                                </div>
                                <h3 className="font-display text-3xl font-black italic text-text-main group-hover/viewall:text-primary transition-colors">{lang === 'pt' ? 'Ver Todos' : 'View All'}</h3>
                                <p className="text-xs font-bold text-text-dim uppercase tracking-widest">{lang === 'pt' ? 'Explorar' : 'Explore'}</p>
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* How it works — only on main page */}
            {!showOnlyFavorites && (
                <section className="max-w-7xl mx-auto px-4 pb-8 text-center mt-4">
                    <h2 className="text-3xl md:text-4xl mb-4 md:mb-6 tracking-tighter italic">{th.how_it_works}</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Search, title: th.step1_title, desc: th.step1_desc, color: "icon-blue" },
                            { icon: Utensils, title: th.step2_title, desc: th.step2_desc, color: "icon-orange" },
                            { icon: MapPin, title: th.step3_title, desc: th.step3_desc, color: "icon-green" }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center group">
                                <div className={`w-24 h-24 ${item.color} flex items-center justify-center rounded-[2rem] mb-3 transition-transform group-hover:scale-110 shadow-lg shadow-black/5`}>
                                    <item.icon size={44} />
                                </div>
                                <h4 className="text-2xl mb-1 uppercase font-black text-text-main">{item.title}</h4>
                                <p className="text-text-dim max-w-xs mx-auto md:max-w-[250px]">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
