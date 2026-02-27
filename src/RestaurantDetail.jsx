import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Clock, Phone, Share2, Star, MessageCircle, ChevronRight, ChevronDown } from 'lucide-react';
import { gsap } from 'gsap';
import { RESTAURANTS, checkIsOpen } from './data';
import { translations } from './translations';
import { Heart } from 'lucide-react';

const StarRating = ({ rating, reviewCount }) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return (
        <div className="flex items-center gap-1.5 mt-2">
            {[1, 2, 3, 4, 5].map(i => (
                <Star
                    key={i}
                    size={18}
                    className={i <= full ? 'text-accent' : i === full + 1 && half ? 'text-accent opacity-60' : 'text-text-dim/30'}
                    fill={i <= full ? 'currentColor' : i === full + 1 && half ? 'currentColor' : 'none'}
                />
            ))}
            <span className="text-sm font-bold text-text-dim ml-1">{rating?.toFixed(1)}</span>
            {reviewCount && <span className="text-sm text-text-dim/60">({reviewCount} avaliações)</span>}
        </div>
    );
};

// Ornamental SVG divider
const OrnamentalDivider = () => (
    <div className="flex items-center justify-center gap-3 my-8 text-primary/40 select-none">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/20" />
        <svg width="20" height="20" viewBox="0 0 20 20" className="shrink-0">
            <path d="M10 2 L11.5 8.5 L18 10 L11.5 11.5 L10 18 L8.5 11.5 L2 10 L8.5 8.5 Z" fill="currentColor" />
        </svg>
        <svg width="12" height="12" viewBox="0 0 12 12" className="shrink-0">
            <circle cx="6" cy="6" r="3" fill="currentColor" />
        </svg>
        <svg width="20" height="20" viewBox="0 0 20 20" className="shrink-0">
            <path d="M10 2 L11.5 8.5 L18 10 L11.5 11.5 L10 18 L8.5 11.5 L2 10 L8.5 8.5 Z" fill="currentColor" />
        </svg>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/20" />
    </div>
);

export default function RestaurantDetail({ lang, favorites, toggleFavorite }) {
    const t = translations[lang].detail;
    const th = translations[lang].home;
    const { slug } = useParams();
    const restaurant = RESTAURANTS.find(r => r.slug === slug);
    const containerRef = useRef(null);
    const pageRef = useRef(null);
    const tabsRef = useRef(null);
    const [activePage, setActivePage] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const ctx = gsap.context(() => {
            gsap.from(".reveal", {
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out"
            });
        }, containerRef);
        return () => ctx.revert();
    }, [slug]);

    // Page flip animation — physical paper feel
    const flipPage = (newPage) => {
        if (isFlipping || newPage === activePage) return;
        setIsFlipping(true);

        // Flip out: rotate away like turning a page
        gsap.to(pageRef.current, {
            rotateY: newPage > activePage ? -25 : 25,
            x: newPage > activePage ? -30 : 30,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                setActivePage(newPage);
                // Flip in from the other side
                gsap.fromTo(
                    pageRef.current,
                    { rotateY: newPage > activePage ? 25 : -25, x: newPage > activePage ? 30 : -30, opacity: 0 },
                    {
                        rotateY: 0,
                        x: 0,
                        opacity: 1,
                        duration: 0.45,
                        ease: "power3.out",
                        onComplete: () => setIsFlipping(false)
                    }
                );
            }
        });

        // Animate the tab indicator
        if (tabsRef.current) {
            const buttons = tabsRef.current.querySelectorAll('button');
            if (buttons[newPage]) {
                buttons[newPage].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `MenusMOZ — ${restaurant.name}`,
                    text: `Olha este menu incrível no MenusMOZ: ${restaurant.description}`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        }
    };

    const triggerHaptic = () => {
        if (navigator.vibrate) navigator.vibrate(20);
    };

    if (!restaurant) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-4xl mb-8 font-heading font-black text-text-main">Restaurante não encontrado</h1>
                <Link to="/" className="bg-primary text-white px-8 py-3 rounded-full font-bold">Voltar ao Início</Link>
            </div>
        );
    }

    const isFavorite = favorites.includes(restaurant.id);
    const whatsappLink = `https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(`Olá, gostaria de fazer uma reserva no ${restaurant.name} através do MenusMOZ.`)}`;
    const currentCategory = restaurant.menuCategories[activePage];

    return (
        <div ref={containerRef} className="pb-32 bg-bg transition-colors duration-500">
            {/* Header Image */}
            <div className="relative h-[45vh] md:h-[60vh] overflow-hidden">
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-black/40" />
                <div className="absolute top-24 md:top-32 left-4 md:left-12 flex gap-3">
                    <Link to="/" className="glass p-3 md:p-4 rounded-full flex items-center gap-2 hover:bg-primary hover:text-white transition-all group border-none shadow-lg">
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold pr-1 text-sm md:text-base">{t.back}</span>
                    </Link>
                    <button
                        onClick={() => { toggleFavorite(restaurant.id); triggerHaptic(); }}
                        className={`glass p-3 md:p-4 rounded-full transition-all border-none shadow-lg ${isFavorite ? 'bg-primary text-white scale-110' : 'hover:bg-white text-text-main'}`}
                    >
                        <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                    <button
                        onClick={handleShare}
                        className="glass p-3 md:p-4 rounded-full transition-all border-none shadow-lg text-text-main hover:bg-white"
                    >
                        <Share2 size={20} />
                    </button>
                </div>
            </div>

            {/* Restaurant Info Card */}
            <div className="max-w-7xl mx-auto px-4 -mt-20 md:-mt-32 relative z-10">
                <div className="bg-surface rounded-3xl md:rounded-[3rem] p-6 md:p-12 shadow-2xl border border-border-subtle transition-colors duration-300">

                    {/* Restaurant Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
                        <div className="reveal">
                            <div className="flex gap-3 mb-4">
                                <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider inline-block">
                                    {restaurant.cuisine}
                                </span>
                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider inline-block ${checkIsOpen(restaurant.hours) ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                    {checkIsOpen(restaurant.hours) ? th.open_now : th.closed}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-7xl mb-3 md:mb-4 tracking-tighter text-text-main font-heading font-black leading-[1.1]">{restaurant.name}</h1>
                            {restaurant.rating && (
                                <StarRating rating={restaurant.rating} reviewCount={restaurant.reviewCount} />
                            )}
                            <p className="text-lg md:text-xl text-text-dim max-w-2xl leading-relaxed mt-4">{restaurant.description}</p>
                        </div>

                        <div className="grid grid-cols-2 md:flex md:flex-col gap-6 reveal shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center icon-green"><MapPin size={24} /></div>
                                <div>
                                    <p className="text-xs font-bold uppercase text-text-dim/40">Localização</p>
                                    <p className="font-bold text-text-main">{restaurant.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center icon-orange"><Clock size={24} /></div>
                                <div>
                                    <p className="text-xs font-bold uppercase text-text-dim/40">Horário</p>
                                    <p className="font-bold text-text-main">{restaurant.hours}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* === CARDÁPIO DIGITAL === */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

                        {/* Main Menu Column */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Category Selector — elegant tabs */}
                            <div
                                ref={tabsRef}
                                className="flex gap-2 overflow-x-auto no-scrollbar pb-2"
                            >
                                {restaurant.menuCategories.map((category, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => { flipPage(idx); triggerHaptic(); }}
                                        className={`px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all whitespace-nowrap border-b-2 duration-300 ${activePage === idx
                                            ? 'bg-primary text-white border-primary shadow-md shadow-primary/20 scale-105'
                                            : 'bg-surface/60 text-text-dim border-border-subtle hover:bg-primary/5 hover:text-primary hover:border-primary/30'
                                            }`}
                                        style={{ fontFamily: "'Playfair Display', serif" }}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>

                            {/* Physical Menu Book */}
                            <div
                                className="menu-book paper-texture"
                                style={{ perspective: '2000px' }}
                            >
                                {/* Top shadow line (book top edge) */}
                                <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-b from-black/10 to-transparent pointer-events-none z-20" />
                                {/* Bottom shadow line */}
                                <div className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-t from-black/8 to-transparent pointer-events-none z-20" />

                                <div
                                    ref={pageRef}
                                    className="flex-1 p-8 md:p-14 relative z-10"
                                    style={{
                                        transformStyle: 'preserve-3d',
                                        willChange: 'transform, opacity',
                                    }}
                                >
                                    {/* Category Header — Garamond style */}
                                    <div className="text-center mb-10">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary/60 mb-3">
                                            MenusMOZ — Seleção
                                        </p>
                                        <h2
                                            className="text-4xl md:text-6xl font-black tracking-tight text-text-main leading-none"
                                            style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
                                        >
                                            {currentCategory.name}
                                        </h2>
                                        <OrnamentalDivider />
                                    </div>

                                    {/* Menu Items */}
                                    <div className="space-y-10">
                                        {currentCategory.items.map((item, i) => (
                                            <div key={i} className="group">
                                                <div className="flex justify-between items-baseline gap-4 mb-1.5">
                                                    <h4
                                                        className="text-xl md:text-2xl font-semibold text-text-main group-hover:text-primary transition-colors duration-300"
                                                        style={{ fontFamily: "'Playfair Display', serif" }}
                                                    >
                                                        {item.name}
                                                    </h4>
                                                    <div className="flex-1 border-b border-dotted border-text-dim/20 mx-2 mb-1 min-w-[20px]" />
                                                    <span
                                                        className="font-bold text-xl text-primary shrink-0"
                                                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                                                    >
                                                        {item.price}
                                                    </span>
                                                </div>
                                                <p className="text-text-dim/70 leading-relaxed text-[15px] pl-0.5">{item.desc}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Page Navigation Footer */}
                                    <div className="mt-16 pt-8 border-t border-border-subtle flex justify-between items-center">
                                        <button
                                            onClick={() => activePage > 0 && flipPage(activePage - 1)}
                                            disabled={activePage === 0 || isFlipping}
                                            className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-text-dim hover:text-primary transition-colors duration-200 ${activePage === 0 ? 'opacity-0 pointer-events-none' : ''}`}
                                        >
                                            <ChevronLeft size={16} /> Voltar
                                        </button>
                                        <span
                                            className="text-xs font-bold tracking-[0.4em] uppercase px-4 py-1.5 rounded-full bg-primary/8 text-primary/70"
                                        >
                                            {activePage + 1} / {restaurant.menuCategories.length}
                                        </span>
                                        <button
                                            onClick={() => activePage < restaurant.menuCategories.length - 1 && flipPage(activePage + 1)}
                                            disabled={activePage === restaurant.menuCategories.length - 1 || isFlipping}
                                            className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-text-dim hover:text-primary transition-colors duration-200 ${activePage === restaurant.menuCategories.length - 1 ? 'opacity-0 pointer-events-none' : ''}`}
                                        >
                                            Próxima <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Column */}
                        <div className="space-y-8 lg:sticky lg:top-32 h-fit">
                            {/* Reservation Box */}
                            <div className="bg-primary/5 p-8 rounded-[3rem] border border-primary/10 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150" />
                                <h4 className="font-black text-xl mb-6 uppercase tracking-wider text-text-main relative z-10">{t.quick_res}</h4>
                                <p className="text-sm text-text-dim mb-8 font-medium relative z-10">{t.res_desc}</p>
                                <div className="space-y-4 relative z-10">
                                    <a
                                        href={whatsappLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={triggerHaptic}
                                        className="prism-border w-full bg-primary text-white py-5 rounded-3xl font-black text-xl hover:brightness-110 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-primary/30"
                                    >
                                        <MessageCircle size={24} /> {t.whatsapp_res}
                                    </a>
                                    <a
                                        href={`tel:${restaurant.whatsapp}`}
                                        className="w-full glass py-4 rounded-2xl font-bold hover:bg-primary/10 transition-all flex items-center justify-center gap-2 text-text-main border-none shadow-sm"
                                    >
                                        <Phone size={18} /> Ligar Direto
                                    </a>
                                </div>
                            </div>

                            {/* Review Box */}
                            <div className="bg-surface border border-border-subtle p-8 rounded-[3rem] shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-accent/5 rounded-full -mr-8 -mt-8" />
                                <div className="flex items-center gap-2 mb-4 text-accent relative z-10">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <Star
                                            key={i}
                                            size={20}
                                            fill={i <= Math.round(restaurant.rating ?? 5) ? 'currentColor' : 'none'}
                                            className={i <= Math.round(restaurant.rating ?? 5) ? 'text-accent' : 'text-text-dim/20'}
                                        />
                                    ))}
                                    {restaurant.rating && (
                                        <span className="ml-2 font-black text-lg text-text-main">{restaurant.rating.toFixed(1)}</span>
                                    )}
                                </div>
                                <p
                                    className="italic text-lg mb-6 text-text-main relative z-10 leading-relaxed"
                                    style={{ fontFamily: "'Playfair Display', serif" }}
                                >
                                    "Simplesmente o melhor da cidade. O atendimento é impecável e os sabores são autênticos."
                                </p>
                                <p className="font-bold uppercase text-xs tracking-[0.2em] text-text-dim/40 relative z-10">— Cliente Verificado, MenusMOZ</p>
                            </div>

                            {/* Scroll hint on mobile */}
                            <div className="flex flex-col items-center gap-2 text-text-dim/30 lg:hidden">
                                <ChevronDown size={18} className="animate-bounce" />
                                <span className="text-xs uppercase tracking-widest font-bold">Deslize para mais</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
