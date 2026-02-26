import { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Clock, Phone, Share2, Star, MessageCircle } from 'lucide-react';
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

export default function RestaurantDetail({ lang, favorites, toggleFavorite }) {
    const t = translations[lang].detail;
    const th = translations[lang].home;
    const { slug } = useParams();
    const restaurant = RESTAURANTS.find(r => r.slug === slug);
    const containerRef = useRef(null);

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

        // Intersection Observer for sticky navigation highlighting
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    document.querySelectorAll('.category-nav-link').forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, { threshold: 0.5, rootMargin: "-100px 0px -50% 0px" });

        document.querySelectorAll('section[id^="cat-"]').forEach(section => observer.observe(section));

        return () => {
            ctx.revert();
            observer.disconnect();
        };
    }, [slug]);

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

    return (
        <div ref={containerRef} className="pb-32">
            {/* Header Image */}
            <div className="relative h-[45vh] md:h-[60vh] overflow-hidden">
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-black/30"></div>
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

            <div className="max-w-7xl mx-auto px-4 -mt-20 md:-mt-32 relative z-10">
                <div className="bg-surface rounded-3xl md:rounded-[3rem] p-6 md:p-16 shadow-2xl shadow-border-subtle border border-border-subtle transition-colors duration-300">

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

                    {/* Main content grid: menu on the left, sidebar on the right */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

                        {/* Menu Column */}
                        <div className="lg:col-span-2 space-y-16">
                            {/* Sticky Category Nav */}
                            <div className="sticky top-24 z-[50] -mx-6 px-6 py-4 bg-surface/80 backdrop-blur-md border-y border-border-subtle overflow-x-auto no-scrollbar mb-8 shadow-sm">
                                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0"></div>
                                <div className="flex gap-4 min-w-max">
                                    {restaurant.menuCategories.map((category, idx) => (
                                        <a
                                            key={idx}
                                            href={`#cat-${idx}`}
                                            className="category-nav-link px-6 py-2 rounded-full font-bold text-sm bg-bg border border-border-subtle text-text-dim hover:border-primary/30 transition-all [&.active]:bg-primary [&.active]:text-white [&.active]:border-primary hover:scale-105"
                                        >
                                            {category.name}
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {restaurant.menuCategories.map((category, idx) => (
                                <section key={idx} id={`cat-${idx}`} className="reveal scroll-mt-48">
                                    <h3 className="text-3xl mb-8 flex items-center gap-4 text-text-main">
                                        {category.name}
                                        <div className="h-px bg-border-subtle flex-1"></div>
                                    </h3>
                                    <div className="space-y-8">
                                        {category.items.map((item, i) => (
                                            <div key={i} className="group cursor-default">
                                                <div className="flex justify-between items-end mb-2">
                                                    <h4 className="text-xl font-bold group-hover:text-primary transition-colors text-text-main">{item.name}</h4>
                                                    <span className="font-mono text-xl font-black text-primary">{item.price}</span>
                                                </div>
                                                <p className="text-text-dim/80">{item.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>

                        {/* Sidebar Column */}
                        <div className="space-y-8 lg:sticky lg:top-32 h-fit">
                            {/* Reservation Box */}
                            <div className="bg-primary/5 p-8 rounded-[3rem] border border-primary/10 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150"></div>
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

                            {/* Review Box — dynamic per restaurant */}
                            <div className="bg-surface border border-border-subtle p-8 rounded-[3rem] shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-accent/5 rounded-full -mr-8 -mt-8"></div>
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
                                <p className="italic text-lg mb-6 text-text-main relative z-10">"Simplesmente o melhor da cidade. O atendimento é impecável e os sabores são autênticos."</p>
                                <p className="font-bold uppercase text-xs tracking-[0.2em] text-text-dim/40 relative z-10">— Cliente Verificado, MenusMOZ</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
