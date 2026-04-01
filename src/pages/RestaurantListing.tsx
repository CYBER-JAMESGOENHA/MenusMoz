import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, MapPin } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { RestaurantCard } from '../components/ui/RestaurantCard';
import { gsap } from 'gsap';
import { Restaurant } from '../services/restaurantService';

interface RestaurantListingProps {
    lang: string;
    favorites: number[];
    toggleFavorite: (id: any) => Promise<void>;
    restaurants: Restaurant[];
}

export default function RestaurantListing({ lang, favorites, toggleFavorite, restaurants = [] }: RestaurantListingProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const shouldAutoFocus = searchParams.get('autoFocus') === 'true';
    const searchInputRef = useRef<HTMLInputElement>(null);
    const gridContainerRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLElement>(null);
    
    // States for filters
    const [searchTerm, setSearchTerm] = useState(query);
    const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'Tudo');
    const [minRating, setMinRating] = useState(0);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    useEffect(() => {
        const cat = searchParams.get('category');
        if (cat) {
            setActiveCategory(cat);
        }
    }, [searchParams]);

    useEffect(() => {
        if (shouldAutoFocus && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [shouldAutoFocus]);

    // Filter logic - memoized
    const filteredRestaurants = useMemo(() => {
        return restaurants.filter(r => {
            let match = true;
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                match = r.name.toLowerCase().includes(searchLower) || 
                        r.cuisine.toLowerCase().includes(searchLower);
            }
            if (activeCategory !== 'Tudo' && match) {
                match = r.cuisine.toLowerCase() === activeCategory.toLowerCase();
            }
            if (minRating > 0 && match) {
                match = (r.rating || 0) >= minRating;
            }
            return match;
        });
    }, [restaurants, searchTerm, activeCategory, minRating]);

    useEffect(() => {
        if (!gridContainerRef.current) return;
        const ctx = gsap.context(() => {
            if (filteredRestaurants.length > 0) {
                gsap.fromTo('.restaurant-card-grid',
                    { opacity: 0, y: 30, scale: 0.95 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        scale: 1, 
                        duration: 0.8, 
                        stagger: 0.08, 
                        ease: 'power4.out', 
                        overwrite: 'auto',
                        clearProps: 'all'
                    }
                );
            }
        }, gridContainerRef.current);
        return () => ctx.revert();
    }, [filteredRestaurants]);

    // Update URL when search changes via input
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchParams(searchTerm ? { q: searchTerm } : {});
    };

    const clearFilters = () => {
        setSearchTerm('');
        setActiveCategory('Tudo');
        setMinRating(0);
        setSearchParams({});
        setIsMobileFiltersOpen(false);
    };

    return (
        <div className="min-h-screen bg-bg pt-24 pb-20">
            {/* Header / Backdrop Text */}
            <div className="absolute top-0 left-0 w-full h-[40vh] pointer-events-none overflow-hidden -z-10 opacity-5 dark:opacity-10">
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10rem] font-black italic whitespace-nowrap uppercase tracking-tighter select-none">
                    {activeCategory !== 'Tudo' ? activeCategory : 'Explorar'}
                </span>
            </div>

            <div className="max-w-[1536px] mx-auto px-4 md:px-12 lg:px-16 flex flex-col md:flex-row gap-8 relative">
                
                {/* Mobile Filter Toggle */}
                <button 
                    className="md:hidden flex items-center justify-center gap-3 w-full bg-surface border border-border-subtle py-4 rounded-2xl font-black text-text-main shadow-premium uppercase text-[10px] tracking-[0.2em]"
                    onClick={() => setIsMobileFiltersOpen(true)}
                >
                    <Filter size={18} className="text-primary" /> {lang === 'pt' ? 'Filtros de Pesquisa' : 'Search Filters'}
                </button>

                {/* Sidebar Filters */}
                <aside 
                    ref={sidebarRef}
                    className={`fixed inset-0 z-[2000] md:sticky md:top-24 md:z-auto bg-surface/90 backdrop-blur-3xl md:bg-transparent md:backdrop-blur-none w-full md:w-64 max-h-screen overflow-y-auto shrink-0 transition-all duration-500 rounded-[2.5rem] md:rounded-none ${isMobileFiltersOpen ? 'translate-y-0 opacity-100' : 'translate-y-full md:translate-y-0 opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto'}`}
                >
                    <div className="p-6 md:p-0 flex flex-col gap-10 h-screen md:h-auto pb-32 md:pb-0"> 
                        <div className="flex md:hidden items-center justify-between mb-2">
                             <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">{lang === 'pt' ? 'Critérios' : 'Criteria'}</span>
                                <h3 className="font-display font-black text-2xl text-text-main italic uppercase tracking-tighter">Filtros</h3>
                             </div>
                            <button onClick={() => setIsMobileFiltersOpen(false)} className="w-10 h-10 rounded-2xl glass flex items-center justify-center shadow-premium bg-white dark:bg-black">
                                <X size={20} className="text-text-main" />
                            </button>
                        </div>

                        {/* Search Input */}
                        <form onSubmit={handleSearchSubmit} className="space-y-3">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary ml-0.5">{lang === 'pt' ? 'Pesquisa Livre' : 'Free Search'}</h4>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity" />
                                <div className="relative flex items-center bg-surface border border-border-subtle rounded-2xl px-4 py-3 shadow-sm focus-within:border-primary transition-all duration-300">
                                    <Search size={16} className="text-text-dim/50 group-focus-within:text-primary shrink-0 transition-colors" />
                                    <input 
                                        ref={searchInputRef}
                                        type="text" 
                                        placeholder={lang === 'pt' ? "Procurar sabores..." : "Search flavors..."}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="bg-transparent border-none outline-none text-[13px] font-black text-text-main w-full ml-2 placeholder:text-text-dim/30 placeholder:italic placeholder:font-bold"
                                    />
                                </div>
                            </div>
                        </form>

                        {/* Categories */}
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary ml-0.5">{lang === 'pt' ? 'Gastronomia' : 'Gastronomy'}</h4>
                            <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                                {CATEGORIES.map(cat => (
                                    <button 
                                        key={cat}
                                        onClick={() => { setActiveCategory(cat); setIsMobileFiltersOpen(false); }}
                                        className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-300 ${activeCategory === cat ? 'bg-primary text-white shadow-primary-glow scale-105 active:scale-95' : 'bg-surface border border-border-subtle text-text-main hover:border-primary/50 hover:pl-5'}`}
                                    >
                                        <span className="italic">{cat}</span>
                                        {activeCategory === cat && <CheckCircle size={10} className="text-white" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Ratings */}
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary ml-0.5">{lang === 'pt' ? 'Qualidade' : 'Quality'}</h4>
                            <div className="flex flex-col gap-2">
                                {[4.5, 4.0, 3.5].map(rating => (
                                    <button 
                                        key={rating}
                                        onClick={() => { setMinRating(minRating === rating ? 0 : rating); setIsMobileFiltersOpen(false); }}
                                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${minRating === rating ? 'bg-text-main text-surface shadow-premium scale-105 active:scale-95' : 'bg-surface border border-border-subtle text-text-main hover:border-text-main/50 hover:pl-5'}`}
                                    >
                                        <span className={minRating === rating ? 'text-accent' : 'text-accent/60'}>★</span>
                                        <span className="italic">{rating} {lang === 'pt' ? '& Acima' : '& Above'}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <button 
                            onClick={clearFilters}
                            className="bg-red-500/10 text-red-600 border border-red-500/20 px-3 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm active:scale-95 italic"
                        >
                            {lang === 'pt' ? 'Limpar Todos' : 'Clear All'}
                        </button>
                    </div>
                </aside>

                {/* Main Grid */}
                <main className="flex-1 min-w-0">
                    <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                         <div className="space-y-1.5">
                             <div className="flex items-center gap-2 mb-1">
                                <MapPin size={10} className="text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Moçambique</span>
                             </div>
                             <h2 className="text-4xl lg:text-5xl font-display font-black tracking-tighter text-text-main italic leading-[0.85] uppercase">
                                {searchTerm ? `"${searchTerm}"` : (activeCategory !== 'Tudo' ? activeCategory : (lang === 'pt' ? 'O Diretório' : 'The Directory'))}
                            </h2>
                            <p className="text-[12px] font-bold text-text-dim/60 italic uppercase tracking-widest pl-0.5">
                                {lang === 'pt' ? 'Curadoria exclusiva de momentos gastronómicos.' : 'Exclusive curation of gastronomic moments.'}
                            </p>
                         </div>
                        <div className="flex items-center gap-2 bg-surface border border-border-subtle px-4 py-2 rounded-full shadow-premium shrink-0 w-fit self-start sm:self-end">
                            <div className="w-1.5 h-1.5 rounded-full bg-moz-green animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-text-main italic leading-none">
                                {filteredRestaurants.length} {lang === 'pt' ? 'Locais Encontrados' : 'Places Found'}
                            </span>
                        </div>
                    </div>

                    <div ref={gridContainerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 min-h-[400px]">
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
                        <div className="py-16 text-center glass rounded-2xl border border-border-subtle shadow-premium mt-8 overflow-hidden relative">
                             <div className="absolute inset-0 bg-primary/2 opacity-20 pointer-events-none" />
                             <div className="w-20 h-20 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-primary-glow/10 group-hover:rotate-12 transition-transform">
                                <Search size={32} />
                             </div>
                             <h3 className="text-3xl lg:text-4xl font-display font-black text-text-main italic tracking-tighter mb-4 uppercase">
                                {lang === 'pt' ? 'Sem Resultados' : 'No Results'}
                             </h3>
                             <p className="text-text-dim font-bold text-lg max-w-md mx-auto leading-relaxed italic uppercase opacity-60 tracking-tight px-6">
                                {lang === 'pt' 
                                    ? 'Não encontrámos nenhum espaço para este sabor. Tente explorar outras categorias.' 
                                    : "We couldn't find a place for this flavor. Try exploring other categories."}
                             </p>
                             <button 
                                onClick={clearFilters}
                                className="mt-10 bg-text-main text-surface px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-premium"
                             >
                                {lang === 'pt' ? 'Reiniciar Procura' : 'Reset Search'}
                             </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

// Helper icons
const CheckCircle = ({ size, className }: { size: number, className: string }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);
