import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import { RESTAURANTS, CATEGORIES } from './data';
import { RestaurantCard } from './Home';
import { translations } from './translations';
import { gsap } from 'gsap';

export default function RestaurantListing({ lang, favorites, toggleFavorite }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    
    // States for filters
    const [searchTerm, setSearchTerm] = useState(query);
    const [activeCategory, setActiveCategory] = useState('Tudo');
    const [minRating, setMinRating] = useState(0);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    const t = translations[lang];

    // Filter logic
    const filteredRestaurants = RESTAURANTS.filter(r => {
        let match = true;
        if (searchTerm) {
            match = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    r.cuisine.toLowerCase().includes(searchTerm.toLowerCase());
        }
        if (activeCategory !== 'Tudo' && match) {
            match = r.cuisine.toLowerCase() === activeCategory.toLowerCase();
        }
        if (minRating > 0 && match) {
            match = (r.rating || 0) >= minRating;
        }
        return match;
    });

    useEffect(() => {
        if (filteredRestaurants.length > 0) {
            gsap.fromTo('.restaurant-card-grid', 
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' }
            );
        }
    }, [filteredRestaurants]);

    // Update URL when search changes via input
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchParams(searchTerm ? { q: searchTerm } : {});
    };

    return (
        <div className="min-h-screen bg-bg pt-28 pb-20">
            <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-8 relative">
                
                {/* Mobile Filter Toggle */}
                <button 
                    className="md:hidden flex items-center justify-center gap-2 w-full bg-surface border border-border-subtle py-3 rounded-2xl font-black text-text-main shadow-sm"
                    onClick={() => setIsMobileFiltersOpen(true)}
                >
                    <Filter size={18} /> Filtrar Resultados
                </button>

                {/* Sidebar Filters */}
                <aside className={`fixed inset-0 z-[2000] md:static md:z-auto bg-surface/95 backdrop-blur-3xl md:bg-transparent md:backdrop-blur-none w-full md:w-64 max-h-screen overflow-y-auto shrink-0 transition-transform duration-500 ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                    <div className="p-6 md:p-0 flex flex-col gap-8 h-full"> 
                        <div className="flex md:hidden items-center justify-between mb-2">
                            <h3 className="font-display font-black text-xl text-text-main italic">Filtros</h3>
                            <button onClick={() => setIsMobileFiltersOpen(false)} className="w-10 h-10 rounded-full glass flex items-center justify-center border-none shadow-sm">
                                <X size={20} className="text-text-main" />
                            </button>
                        </div>

                        {/* Search Input */}
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3">Pesquisa</h4>
                            <div className="flex items-center bg-surface border border-border-subtle rounded-2xl px-4 py-3 shadow-sm focus-within:border-primary transition-colors">
                                <Search size={16} className="text-text-dim shrink-0" />
                                <input 
                                    type="text" 
                                    placeholder="Procurar locais..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-transparent border-none outline-none text-sm font-bold text-text-main w-full ml-2 placeholder:text-text-dim/50"
                                />
                            </div>
                        </form>

                        {/* Categories */}
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3">Categorias</h4>
                            <div className="flex flex-col gap-2">
                                {CATEGORIES.map(cat => (
                                    <button 
                                        key={cat}
                                        onClick={() => { setActiveCategory(cat); setIsMobileFiltersOpen(false); }}
                                        className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${activeCategory === cat ? 'bg-primary text-white shadow-primary-glow scale-105' : 'bg-surface border border-border-subtle text-text-main hover:border-primary/50'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Ratings */}
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3">Avaliação Mínima</h4>
                            <div className="flex flex-col gap-2">
                                {[4.5, 4.0, 3.5].map(rating => (
                                    <button 
                                        key={rating}
                                        onClick={() => { setMinRating(minRating === rating ? 0 : rating); setIsMobileFiltersOpen(false); }}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${minRating === rating ? 'bg-text-main text-surface shadow-md' : 'bg-surface border border-border-subtle text-text-main hover:border-text-main/50'}`}
                                    >
                                        ⭐ {rating} & Acima
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => { setSearchTerm(''); setActiveCategory('Tudo'); setMinRating(0); setSearchParams({}); setIsMobileFiltersOpen(false); }}
                            className="bg-red-500/10 text-red-600 border border-red-500/20 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all mt-auto md:mt-2"
                        >
                            Limpar Filtros
                        </button>
                    </div>
                </aside>

                {/* Main Grid */}
                <main className="flex-1 min-w-0">
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between border-b border-border-subtle pb-4 gap-4">
                         <div>
                             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary block mb-2">Explorar</span>
                             <h2 className="text-4xl lg:text-5xl font-display font-black tracking-tighter text-text-main italic leading-none">
                                {searchTerm ? `Resultados: "${searchTerm}"` : (activeCategory !== 'Tudo' ? activeCategory : 'O Nosso Diretório')}
                            </h2>
                         </div>
                        <span className="bg-primary/5 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shrink-0 w-fit">
                            {filteredRestaurants.length} Locais
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {filteredRestaurants.map(rest => (
                            <div key={rest.id} className="restaurant-card-grid">
                                <RestaurantCard 
                                    restaurant={rest} 
                                    isFavorite={favorites.includes(rest.id)} 
                                    toggleFavorite={toggleFavorite} 
                                    lang={lang} 
                                />
                            </div>
                        ))}
                    </div>

                    {filteredRestaurants.length === 0 && (
                        <div className="py-32 text-center glass rounded-custom-lg border border-border-subtle shadow-premium mt-8">
                             <div className="w-24 h-24 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                <Search size={40} />
                             </div>
                             <h3 className="text-3xl font-display font-black text-text-main italic tracking-tighter mb-4">Nenhum resultado</h3>
                             <p className="text-text-dim font-bold text-sm max-w-sm mx-auto leading-relaxed">Não encontrámos nenhum espaço que corresponda à sua pesquisa. Tente ajustar as categorias ou limpar os filtros.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
