import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal, X } from 'lucide-react';
import { translations } from '../../translations';
import { toast } from 'react-hot-toast';

interface Suggestion {
    type: 'restaurant' | 'dish';
    name: string;
    slug: string;
    restaurant?: string;
}

interface HomeSearchProps {
    lang: string;
    restaurants?: any[];
}

export const HomeSearch: React.FC<HomeSearchProps> = ({ lang, restaurants = [] }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const t = (translations[lang as keyof typeof translations] as any) ?? translations.pt;
    const navigate = useNavigate();

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            setSuggestions([]);
            navigate(`/restaurantes?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.length > 1) {
            const filteredRest: Suggestion[] = restaurants.filter(r =>
                r.name.toLowerCase().includes(query.toLowerCase()) ||
                (r.cuisine && r.cuisine.toLowerCase().includes(query.toLowerCase()))
            ).map(r => ({ type: 'restaurant', name: r.name, slug: r.slug }));

            const filteredDishes: Suggestion[] = [];
            restaurants.forEach(r => {
                r.menuCategories?.forEach((cat: any) => {
                    cat.items?.forEach((item: any) => {
                        if (item.name.toLowerCase().includes(query.toLowerCase())) {
                            filteredDishes.push({ type: 'dish', name: item.name, restaurant: r.name, slug: r.slug });
                        }
                    });
                });
            });
            setSuggestions([...filteredRest, ...filteredDishes.slice(0, 3)]);
        } else {
            setSuggestions([]);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setSuggestions([]);
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLocationClick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => navigate(`/restaurantes?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`),
                () => toast.error(lang === 'pt' ? 'Não foi possível obter a sua localização.' : 'Could not get your location.')
            );
        }
    };

    const [activeFeaturedIndex, setActiveFeaturedIndex] = useState(0);
    const featuredLines = lang === 'pt' ? [
        { label: 'Destaque de hoje', name: 'Bel Piatto', detail: 'Rooftop Dining' },
        { label: 'Tendência em Maputo', name: 'Mercado 28', detail: 'Conceito Urbano' },
        { label: 'Favorito da semana', name: 'Iypslon', detail: 'Cozinha Moderna' },
        { label: 'Especial Marisco', name: 'Sabor do Mar', detail: 'Fresco e Autêntico' }
    ] : [
        { label: 'Featured today', name: 'Bel Piatto', detail: 'Rooftop Dining' },
        { label: 'Trending in Maputo', name: 'Mercado 28', detail: 'Urban Concept' },
        { label: 'This week’s favorite', name: 'Iypslon', detail: 'Modern Cuisine' },
        { label: 'Seafood spotlight', name: 'Sabor do Mar', detail: 'Fresh & Authentic' }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeaturedIndex((prev) => (prev + 1) % featuredLines.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [featuredLines.length]);

    return (
        <div ref={searchRef} className="max-w-4xl mx-auto px-4 pt-20 pb-6 relative z-[100]">
            {/* Background Decorative Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-48 bg-primary/5 blur-[100px] -z-10 pointer-events-none" />
            
            {/* Compact Editorial Featured Line */}
            <div className="flex justify-center mb-8 h-6">
                <div className="relative w-full flex justify-center">
                    {featuredLines.map((line, idx) => (
                        <div
                            key={idx}
                            className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
                                activeFeaturedIndex === idx 
                                ? 'opacity-100 translate-y-0' 
                                : 'opacity-0 translate-y-4 pointer-events-none'
                            }`}
                        >
                            <div className="flex items-center gap-2 group/feat cursor-pointer">
                                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-600 italic">
                                    {line.label}:
                                </span>
                                <span className="text-[10px] font-display font-bold italic tracking-tight text-text-main dark:text-neutral-300 group-hover/feat:text-primary transition-colors">
                                    {line.name}
                                </span>
                                <span className="w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                                <span className="text-[9px] font-medium text-text-dim/40 dark:text-neutral-500 italic tracking-wide">
                                    {line.detail}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Singular Elegant Search Bar — Minimalist Floating Style */}
            <div className={`relative flex items-center bg-white/70 dark:bg-[#1a1a1a]/60 backdrop-blur-3xl border border-neutral-200/50 dark:border-white/[0.05] rounded-full p-1.5 transition-all duration-700 ${isFocused ? 'shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border-primary/20 scale-[1.01]' : 'shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_45px_rgba(0,0,0,0.08)]'}`}>
                <div className="flex-1 flex items-center gap-4 px-6 py-2">
                    <Search size={18} className={`shrink-0 transition-colors duration-500 ${isFocused ? 'text-primary' : 'text-neutral-400 dark:text-neutral-600'}`} />
                    <input
                        type="text"
                        placeholder={lang === 'pt' ? 'Pesquisar restaurantes, cafés ou lugares...' : 'Search restaurants, cafes or places...'}
                        value={searchQuery}
                        onFocus={() => setIsFocused(true)}
                        onChange={handleSearch}
                        onKeyDown={handleKeyDown}
                        className="bg-transparent border-none outline-none text-base md:text-lg text-text-main dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 w-full font-display font-medium italic tracking-tight py-1"
                    />
                </div>

                <div className="flex items-center gap-2 px-3">
                    <button
                        onClick={handleLocationClick}
                        className="hidden sm:flex p-2.5 rounded-full hover:bg-neutral-100 dark:hover:bg-white/5 transition-all text-neutral-400 dark:text-neutral-600 hover:text-primary"
                        title={lang === 'pt' ? 'Perto de mim' : 'Near me'}
                    >
                        <MapPin size={20} />
                    </button>
                    
                    <button
                        className="hidden sm:flex p-2.5 rounded-full hover:bg-neutral-100 dark:hover:bg-white/5 transition-all text-neutral-400 dark:text-neutral-600 hover:text-text-main"
                        title="Filtros"
                    >
                        <SlidersHorizontal size={20} />
                    </button>

                    <button
                        onClick={() => navigate(`/restaurantes?q=${encodeURIComponent(searchQuery)}`)}
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white shadow-[0_8px_20px_-4px_rgba(220,38,38,0.3)] hover:scale-105 transition-all duration-500 active:scale-95 shrink-0"
                    >
                        <Search size={20} strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            {/* Suggestions Overlay */}
            {suggestions.length > 0 && isFocused && (
                <div className="absolute top-[calc(100%-1.5rem)] left-4 right-4 bg-surface/95 backdrop-blur-3xl border border-border-subtle rounded-[2rem] shadow-premium-lg overflow-hidden z-[2000] animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="px-8 py-3 bg-primary/5 border-b border-border-subtle">
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary/60 italic">
                            {lang === 'pt' ? 'Sugestões para si' : 'Suggestions for you'}
                        </span>
                    </div>
                    {suggestions.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                setSuggestions([]);
                                setSearchQuery('');
                                setIsFocused(false);
                                navigate(`/restaurante/${s.slug}`);
                            }}
                            className="w-full flex items-center justify-between px-8 py-4 hover:bg-primary/5 transition-all group/item border-b border-border-subtle last:border-0"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-text-main/5 flex items-center justify-center text-text-main group-hover/item:bg-primary/10 group-hover/item:text-primary transition-all">
                                    <Search size={14} />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-sm text-text-main group-hover/item:text-primary transition-colors tracking-tight italic font-display">
                                        {s.name}
                                    </p>
                                    <p className="text-[9px] text-text-dim/40 uppercase tracking-widest font-bold italic">
                                        {s.type === 'restaurant' ? (lang === 'pt' ? 'Estabelecimento' : 'Restaurant') : `${lang === 'pt' ? 'Prato' : 'Dish'} • ${s.restaurant}`}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
