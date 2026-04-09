import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, X, MapPin, SlidersHorizontal, ChevronRight, Star, Clock, Heart } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { RestaurantCard } from '../components/ui/RestaurantCard';
import { gsap } from 'gsap';
import { Restaurant } from '../services/restaurantService';
import { translations } from '../translations';
import { Helmet } from 'react-helmet-async';

interface RestaurantListingProps {
    lang: string;
    favorites: number[];
    toggleFavorite: (id: any) => Promise<void>;
    restaurants: Restaurant[];
}

export default function RestaurantListing({ lang, favorites, toggleFavorite, restaurants = [] }: RestaurantListingProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get('q') || '';
    const categoryParam = searchParams.get('category') || 'Tudo';
    const shouldAutoFocus = searchParams.get('autoFocus') === 'true';
    
    const searchInputRef = useRef<HTMLInputElement>(null);
    const gridContainerRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const t = (translations[lang as keyof typeof translations] as any)?.hero ?? translations.pt.hero;
    const th = (translations[lang as keyof typeof translations] as any)?.home ?? translations.pt.home;

    // States for filters
    const [searchTerm, setSearchTerm] = useState(query);
    const [activeCategory, setActiveCategory] = useState(categoryParam);
    const [minRating, setMinRating] = useState(0);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [sortBy, setSortBy] = useState<'rating' | 'newest'>('rating');

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

    // Initial load animation
    useEffect(() => {
        if (!containerRef.current) return;
        const ctx = gsap.context(() => {
            gsap.from('.reveal-up', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out'
            });
        }, containerRef.current);
        return () => ctx.revert();
    }, []);

    // Filter logic - memoized
    const filteredRestaurants = useMemo(() => {
        let result = [...restaurants].filter(r => {
            let match = true;
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                match = r.name.toLowerCase().includes(searchLower) || 
                        r.cuisine?.toLowerCase().includes(searchLower) ||
                        r.tags?.some(tag => tag.toLowerCase().includes(searchLower));
            }
            if (activeCategory !== 'Tudo' && match) {
                match = r.cuisine?.toLowerCase() === activeCategory.toLowerCase();
            }
            if (minRating > 0 && match) {
                match = (r.rating || 0) >= minRating;
            }
            return match;
        });

        if (sortBy === 'rating') {
            result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }

        return result;
    }, [restaurants, searchTerm, activeCategory, minRating, sortBy]);

    useEffect(() => {
        if (!gridContainerRef.current) return;
        const ctx = gsap.context(() => {
            if (filteredRestaurants.length > 0) {
                gsap.fromTo('.restaurant-grid-item',
                    { opacity: 0, y: 20 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        duration: 0.5, 
                        stagger: 0.05, 
                        ease: 'power2.out',
                        overwrite: 'auto'
                    }
                );
            }
        }, gridContainerRef.current);
        return () => ctx.revert();
    }, [filteredRestaurants]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchParams(searchTerm ? { q: searchTerm, category: activeCategory } : { category: activeCategory });
    };

    const handleCategoryClick = (cat: string) => {
        setActiveCategory(cat);
        setSearchParams(searchTerm ? { q: searchTerm, category: cat } : { category: cat });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setActiveCategory('Tudo');
        setMinRating(0);
        setSearchParams({});
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-bg pt-24 md:pt-32 pb-20">
            <Helmet>
                <title>Explorar Restaurantes | Locais de Moz</title>
            </Helmet>

            <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <div className="reveal-up flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <Search size={16} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Diretório Gastronómico</span>
                        </div>
                        <h1 className="reveal-up text-5xl md:text-7xl font-display font-black text-text-main italic uppercase tracking-tighter leading-none">
                            Explorar <span className="text-primary tracking-[-0.1em] not-italic">Savoir-faire</span>
                        </h1>
                        <p className="reveal-up text-text-dim text-lg font-medium max-w-xl leading-relaxed">
                            Descubra os sabores autênticos e os espaços que definem a cultura moçambicana, do clássico ao experimental.
                        </p>
                    </div>

                    {/* Stats Counter */}
                    <div className="reveal-up bg-surface border border-border-subtle p-6 rounded-[2rem] shadow-sm hidden lg:block">
                        <div className="flex items-center gap-4">
                            <div className="text-right border-r border-border-subtle pr-4">
                                <p className="text-2xl font-black text-text-main italic">{restaurants.length}</p>
                                <p className="text-[8px] font-black uppercase tracking-widest text-text-dim/50">Restaurantes</p>
                            </div>
                            <div className="pl-4">
                                <div className="flex -space-x-2">
                                    {[1,2,3,4].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-surface bg-bg overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" />
                                        </div>
                                    ))}
                                    <div className="w-8 h-8 rounded-full border-2 border-surface bg-primary text-white flex items-center justify-center text-[10px] font-black">
                                        +
                                    </div>
                                </div>
                                <p className="text-[8px] font-black uppercase tracking-widest text-primary mt-1">Comunidade Ativa</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- FILTER BAR --- */}
                <div className="reveal-up space-y-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search Input */}
                        <form onSubmit={handleSearchSubmit} className="flex-1 relative group">
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-text-dim/40 group-focus-within:text-primary transition-colors">
                                <Search size={20} />
                            </div>
                            <input 
                                ref={searchInputRef}
                                type="text" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Restaurante, cozinha ou prato..."
                                className="w-full h-16 bg-surface border-2 border-border-subtle rounded-2xl pl-16 pr-6 text-text-main font-bold placeholder:text-text-dim/30 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                            />
                            {searchTerm && (
                                <button 
                                    type="button"
                                    onClick={() => setSearchTerm('')}
                                    className="absolute inset-y-0 right-4 flex items-center text-text-dim/40 hover:text-text-main"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </form>

                        {/* Sort & Quick Filters */}
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                                className="h-16 px-6 bg-surface border-2 border-border-subtle rounded-2xl flex items-center gap-3 font-black uppercase text-xs tracking-widest text-text-main hover:border-primary/50 transition-all shrink-0"
                            >
                                <Filter size={18} />
                                <span className="hidden md:inline">Filtros</span>
                            </button>
                            
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="h-16 px-6 bg-surface border-2 border-border-subtle rounded-2xl font-black uppercase text-xs tracking-widest text-text-main hover:border-primary/50 transition-all outline-none appearance-none cursor-pointer pr-12 relative"
                                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
                            >
                                <option value="rating">Melhor Avaliados</option>
                                <option value="newest">Mais Recentes</option>
                            </select>
                        </div>
                    </div>

                    {/* Category Scroll */}
                    <div className="relative overflow-hidden group">
                        <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
                            <button 
                                onClick={() => handleCategoryClick('Tudo')}
                                className={`px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all whitespace-nowrap border-2 ${
                                    activeCategory === 'Tudo' 
                                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                                    : 'bg-surface border-border-subtle text-text-dim hover:border-primary/30'
                                }`}
                            >
                                Tudo
                            </button>
                            {(CATEGORIES || []).map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => handleCategoryClick(cat)}
                                    className={`px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all whitespace-nowrap border-2 ${
                                        activeCategory === cat 
                                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                                        : 'bg-surface border-border-subtle text-text-dim hover:border-primary/30'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- RESULTS GRID --- */}
                <div ref={gridContainerRef} className="space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-text-dim">
                                {filteredRestaurants.length} Resultados Encontrados
                            </h2>
                        </div>
                        {(searchTerm || activeCategory !== 'Tudo' || minRating > 0) && (
                            <button 
                                onClick={clearFilters}
                                className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline underline-offset-4"
                            >
                                Limpar Filtros
                            </button>
                        )}
                    </div>

                    {filteredRestaurants.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredRestaurants.map(restaurant => (
                                <div key={restaurant.id} className="restaurant-grid-item">
                                    <RestaurantCard 
                                        restaurant={restaurant} 
                                        isFavorite={favorites.includes(Number(restaurant.id))} 
                                        toggleFavorite={toggleFavorite} 
                                        lang={lang}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 flex flex-col items-center justify-center text-center bg-surface border-2 border-dashed border-border-subtle rounded-[3rem] space-y-6">
                            <div className="w-20 h-20 bg-bg rounded-[2rem] flex items-center justify-center text-text-dim/20">
                                <Search size={40} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-display font-black text-text-main italic uppercase tracking-tighter">Sem resultados</h3>
                                <p className="text-text-dim max-w-sm">
                                    Não encontramos nenhum restaurante que corresponda aos seus filtros. Tente ajustar a sua pesquisa.
                                </p>
                            </div>
                            <button 
                                onClick={clearFilters}
                                className="bg-primary text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-primary-glow"
                            >
                                Mostrar todos os locais
                            </button>
                        </div>
                    )}
                </div>
                
                {/* --- FOOTER CTA --- */}
                <div className="reveal-up pt-10 border-t border-border-subtle">
                    <div className="bg-primary p-12 rounded-[3rem] overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-1000 rotate-45" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="space-y-4 text-center md:text-left">
                                <h2 className="text-3xl md:text-5xl font-display font-black text-white italic uppercase tracking-tighter leading-tight">
                                    Tem um Restaurante?
                                </h2>
                                <p className="text-white/80 font-medium max-w-md">
                                    Junte-se à maior plataforma gastronómica de Moçambique e leve o seu menu a milhares de clientes.
                                </p>
                            </div>
                            <button 
                                onClick={() => navigate('/owners')}
                                className="bg-white text-primary px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-black hover:text-white transition-all shadow-2xl active:scale-95 whitespace-nowrap"
                            >
                                Começar Agora
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
