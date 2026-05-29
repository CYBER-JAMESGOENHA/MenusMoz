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
        <div ref={searchRef} className="max-w-3xl mx-auto px-6 sm:px-4 pt-2 pb-0 relative z-[100]">
            {/* Background Decorative Glow — Removed for cleaner look */}
            
            {/* Compact Editorial Featured Line */}
            <div className="flex justify-center mb-2 h-5">
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
                                <span className="text-[7px] font-bold uppercase tracking-[0.12em] text-text-dim/40">
                                    {line.label}:
                                </span>
                                <span className="text-[9px] font-bold tracking-tight text-text-main group-hover/feat:text-primary transition-colors">
                                    {line.name}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-primary/30" />
                                <span className="text-[10px] font-medium text-text-dim/60 italic tracking-wide">
                                    {line.detail}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Compact Search Bar */}
            <div className={`relative flex items-center bg-surface/85 backdrop-blur-xl border border-border-subtle/60 rounded-2xl p-1 sm:p-1.5 transition-all duration-500 ${isFocused ? 'shadow-premium border-primary/20 scale-[1.005]' : 'hover:shadow-md'}`}>
                
                {/* Section 1: What */}
                <div className="flex-[1.5] flex flex-col pl-3 pr-2 py-1 sm:pl-4 sm:pr-3 sm:py-1.5 group/what">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1 leading-none">{lang === 'pt' ? 'O quê?' : 'What?'}</label>
                    <div className="flex items-center gap-2.5 mt-0.5">
                        <Search size={14} className={`shrink-0 transition-colors duration-300 ${isFocused ? 'text-primary' : 'text-text-dim/40'}`} />
                        <input
                            type="text"
                            placeholder={lang === 'pt' ? 'Procurar sabores...' : 'Search flavors...'}
                            value={searchQuery}
                            onFocus={() => setIsFocused(true)}
                            onChange={handleSearch}
                            onKeyDown={handleKeyDown}
                            className="bg-transparent border-none outline-none text-xs sm:text-sm text-text-main placeholder:text-text-dim/45 w-full font-medium tracking-tight py-0.5"
                        />
                    </div>
                </div>

                {/* Elegant vertical divider between fields */}
                <div className="w-[1px] h-8 bg-border-subtle/30 self-center hidden md:block mx-1" />

                {/* Section 2: Where */}
                <div className="flex-1 hidden md:flex flex-col px-4 py-1.5 group/where">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-dim/50 mb-1 leading-none">{lang === 'pt' ? 'Onde?' : 'Where?'}</label>
                    <button
                        onClick={handleLocationClick}
                        className="flex items-center gap-2.5 w-full text-left group/loc py-0.5 mt-0.5 text-xs font-medium text-text-dim/80 hover:text-primary transition-colors cursor-pointer"
                    >
                        <MapPin size={14} className="text-text-dim/40 group-hover/loc:text-primary transition-colors" />
                        {lang === 'pt' ? 'Perto de mim' : 'Near me'}
                    </button>
                </div>

                {/* Section 3: Filter & Action */}
                <div className="flex items-center gap-3 px-3">
                    <button
                        className="hidden sm:flex p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all text-text-dim/50 hover:text-text-main group/filter border border-transparent hover:border-border-subtle/30 cursor-pointer"
                        title="Filtros"
                    >
                        <SlidersHorizontal size={14} className="group-hover/filter:rotate-90 transition-transform duration-500" />
                    </button>

                    <button
                        onClick={() => navigate(`/restaurantes?q=${encodeURIComponent(searchQuery)}`)}
                        className="h-9 sm:h-11 px-3.5 sm:px-6 aspect-square sm:aspect-auto rounded-lg sm:rounded-xl bg-primary text-white font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 hover:bg-primary-dark hover:shadow-[0_4px_12px_rgba(220,38,38,0.25)] active:scale-95 cursor-pointer shrink-0 shadow-lg shadow-primary/10"
                    >
                        <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
                        <span className="hidden sm:inline">{lang === 'pt' ? 'Procurar' : 'Search'}</span>
                    </button>
                </div>
            </div>

            {/* Suggestions Overlay */}
            {suggestions.length > 0 && isFocused && (
                <div className="absolute top-[calc(100%-1rem)] left-4 right-4 bg-surface/95 backdrop-blur-3xl border border-border-subtle rounded-2xl shadow-premium-lg overflow-hidden z-[2000] animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="px-6 py-2 bg-primary/5 border-b border-border-subtle">
                        <span className="text-[8px] font-extrabold uppercase tracking-[0.15em] text-primary">
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
                            className="w-full flex items-center justify-between px-6 py-3 hover:bg-primary/5 transition-all group/item border-b border-border-subtle last:border-0"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-full bg-text-main/5 flex items-center justify-center text-text-main group-hover/item:bg-primary/10 group-hover/item:text-primary transition-all">
                                    <Search size={12} />
                                </div>
                                <div className="text-left">
                                    <p className="font-extrabold text-[13px] text-text-main group-hover/item:text-primary transition-colors tracking-tight">
                                        {s.name}
                                    </p>
                                    <p className="text-[8px] text-text-dim/60 uppercase tracking-widest font-extrabold">
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
