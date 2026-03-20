import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronRight, ArrowUpRight, Star } from 'lucide-react';
import { RESTAURANTS, checkIsOpen } from './data';
import TopBarFilters from './TopBarFilters';
import { translations } from './translations';
import { gsap } from 'gsap';

export default function RestaurantListing({ lang, favorites, toggleFavorite }) {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';

    const t = translations[lang];

    // Simple filtering based on query for now 
    // (Full filter logic usually lives here, integrating TopBarFilters)
    const filteredRestaurants = RESTAURANTS.filter(r => {
        let match = true;
        if (query) {
            match = r.name.toLowerCase().includes(query.toLowerCase()) || 
                    r.cuisine.toLowerCase().includes(query.toLowerCase());
        }
        if (category && match) {
            match = r.cuisine.toLowerCase().includes(category.toLowerCase());
        }
        return match;
    });

    useEffect(() => {
        gsap.fromTo('.stagger-row', 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' }
        );
    }, [filteredRestaurants]);

    return (
        <div className="min-h-screen bg-bg pt-20 flex flex-col">
            
            {/* The Command Bar / Top Bar */}
            <div className="sticky top-[64px] z-40 bg-bg w-full">
                <TopBarFilters lang={lang} />
            </div>

            <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-8 py-8 flex-1">
                
                {/* Header Context */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between border-b border-black/10 pb-6">
                    <div>
                        <h2 className="text-4xl md:text-6xl font-display font-black italic tracking-tighter text-text-main">
                            {query ? `Pesquisa: "${query}"` : 'Diretório'}
                        </h2>
                        <p className="mt-2 text-text-dim text-sm max-w-md font-medium uppercase tracking-widest">
                            Mostrando {filteredRestaurants.length} resultados premium
                        </p>
                    </div>
                </div>

                {/* Directory List Layout (Non-Generic wide rows) */}
                <div className="flex flex-col border-t border-black/10">
                    {filteredRestaurants.length > 0 ? (
                        filteredRestaurants.map((rest) => (
                            <Link 
                                to={`/restaurante/${rest.slug}`} 
                                key={rest.id}
                                className="stagger-row group relative py-6 md:py-8 border-b border-black/10 flex flex-col md:flex-row items-center gap-6 hover:bg-black/[0.02] transition-colors"
                            >
                                {/* Subtle hover indicator line */}
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-center duration-500"></div>

                                {/* Image Column */}
                                <div className="w-full md:w-48 h-32 shrink-0 rounded-2xl overflow-hidden relative">
                                    <img src={rest.image} alt={rest.name} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                                    {/* Open Badge */}
                                    <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-[0.2em] backdrop-blur-md ${checkIsOpen(rest.hours) ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                                        {checkIsOpen(rest.hours) ? 'Open' : 'Closed'}
                                    </div>
                                </div>

                                {/* Content Column */}
                                <div className="flex-1 min-w-0 pr-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-2xl font-display font-black text-text-main group-hover:text-primary transition-colors">{rest.name}</h3>
                                        <div className="flex items-center gap-1 bg-black/5 px-2 py-1 rounded text-[10px] font-bold">
                                            <Star size={10} className="text-accent fill-accent" />
                                            {rest.rating?.toFixed(1) || '4.5'}
                                        </div>
                                    </div>
                                    
                                    <p className="text-sm text-text-dim mb-4 line-clamp-2 max-w-3xl leading-relaxed italic">
                                        "{rest.description}"
                                    </p>

                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-[10px] bg-black/5 border border-black/10 text-black/70 px-3 py-1 rounded-full uppercase tracking-widest font-black">
                                            {rest.cuisine}
                                        </span>
                                        {/* Mock tags representing vibes/highlights that matched */}
                                        <span className="text-[10px] text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full uppercase tracking-widest font-bold">
                                            Best Wine Selection
                                        </span>
                                        <span className="text-[10px] text-orange-600 bg-orange-100 border border-orange-200 px-3 py-1 rounded-full uppercase tracking-widest font-bold">
                                            Romantic
                                        </span>
                                    </div>
                                </div>

                                {/* Action/Price Column */}
                                <div className="shrink-0 flex md:flex-col items-center justify-between md:items-end md:justify-center gap-4 w-full md:w-auto mt-4 md:mt-0 px-4 md:px-0">
                                    <div className="text-right">
                                        <div className="text-[10px] uppercase font-bold tracking-widest text-black/40">Average Cost</div>
                                        <div className="font-mono text-lg font-black text-text-main">
                                            {/* Mock price derived from somewhere, normally in data */}
                                            {Math.floor(Math.random() * 1000) + 500} MZN
                                        </div>
                                    </div>
                                    
                                    <button className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all shadow-sm">
                                        <ArrowUpRight size={20} className="group-hover:rotate-45 transition-transform" />
                                    </button>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="py-24 text-center border-b border-black/10">
                            <h3 className="text-3xl font-display font-black italic text-text-main/50 mb-2">Sem Resultados</h3>
                            <p className="text-text-dim/60 font-bold uppercase tracking-widest text-xs">Ajuste os filtros de pesquisa</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
