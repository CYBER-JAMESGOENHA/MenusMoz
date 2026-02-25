import { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Clock, Phone, Share2, Star } from 'lucide-react';
import { gsap } from 'gsap';
import { RESTAURANTS, checkIsOpen } from './data';

import { translations } from './translations';
import { Heart } from 'lucide-react';

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
        return () => ctx.revert();
    }, [slug]);

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
                        onClick={() => toggleFavorite(restaurant.id)}
                        className={`glass p-3 md:p-4 rounded-full transition-all border-none shadow-lg ${isFavorite ? 'bg-primary text-white scale-110' : 'hover:bg-white text-text-main'}`}
                    >
                        <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-20 md:-mt-32 relative z-10">
                <div className="bg-surface rounded-3xl md:rounded-[3rem] p-6 md:p-16 shadow-2xl shadow-border-subtle border border-border-subtle transition-colors duration-300">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16">
                        <div className="reveal">
                            <div className="flex gap-3 mb-4">
                                <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider inline-block">
                                    {restaurant.cuisine}
                                </span>
                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider inline-block ${checkIsOpen(restaurant.hours) ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                    {checkIsOpen(restaurant.hours) ? th.open_now : th.closed}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-7xl mb-4 md:mb-6 tracking-tighter text-text-main font-heading font-black leading-[1.1]">{restaurant.name}</h1>
                            <p className="text-lg md:text-xl text-text-dim max-w-2xl leading-relaxed">{restaurant.description}</p>
                        </div>

                        <div className="grid grid-cols-2 md:flex md:flex-col gap-6 reveal">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-primary"><MapPin size={24} /></div>
                                <div>
                                    <p className="text-xs font-bold uppercase text-text-dim/40">Localização</p>
                                    <p className="font-bold text-text-main">{restaurant.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-primary"><Clock size={24} /></div>
                                <div>
                                    <p className="text-xs font-bold uppercase text-text-dim/40">Horário</p>
                                    <p className="font-bold text-text-main">{restaurant.hours}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-16">
                        <div className="lg:col-span-2 space-y-16">
                            {restaurant.menuCategories.map((category, idx) => (
                                <div key={idx} className="reveal">
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
                                </div>
                            ))}
                        </div>

                        <div className="space-y-8 reveal">
                            <div className="bg-accent/10 p-8 rounded-[2rem] border border-accent/20">
                                <h4 className="font-black text-xl mb-6 uppercase tracking-wider text-text-main">{t.quick_res}</h4>
                                <p className="text-sm text-text-dim mb-8 font-medium">{t.res_desc}</p>
                                <div className="space-y-4">
                                    <a
                                        href={`tel:${restaurant.whatsapp}`}
                                        className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                                    >
                                        <Phone size={18} /> Ligar
                                    </a>
                                    <a
                                        href={whatsappLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full glass py-4 rounded-2xl font-bold hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-text-main border-none shadow-sm"
                                    >
                                        {t.whatsapp_res}
                                    </a>
                                </div>
                            </div>

                            <div className="bg-black text-white p-8 rounded-[2rem]">
                                <div className="flex items-center gap-2 mb-4 text-accent">
                                    <Star fill="currentColor" size={20} />
                                    <Star fill="currentColor" size={20} />
                                    <Star fill="currentColor" size={20} />
                                    <Star fill="currentColor" size={20} />
                                    <Star fill="currentColor" size={20} />
                                </div>
                                <p className="italic text-lg mb-6">"Simplesmente o melhor marisco de Maputo. O atendimento é impecável e a vista é magnífica."</p>
                                <p className="font-bold uppercase text-xs tracking-[0.2em] text-white/40">— Maria Santos, Foodie</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
