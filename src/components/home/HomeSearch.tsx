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

    return (
        <div ref={searchRef} className="max-w-4xl mx-auto px-4 pt-24 pb-24 relative z-[100]">
            {/* Background Decorative Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-64 bg-primary/5 blur-[120px] -z-10 pointer-events-none" />
            <div className="absolute -top-20 left-1/4 w-64 h-64 bg-moz-yellow/5 blur-[100px] -z-10 pointer-events-none animate-pulse" />
            <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <h1 className="text-3xl md:text-5xl font-display italic font-black text-text-main tracking-tighter mb-4 leading-none uppercase">
                    {lang === 'pt' ? 'Descubra os Melhores Sabores' : 'Discover the Best Flavors'}
                </h1>
                <p className="text-text-dim/60 text-sm md:text-base font-medium tracking-tight uppercase italic">
                    {lang === 'pt' ? 'Maputo • Matola • E muito mais' : 'Maputo • Matola • And much more'}
                </p>
            </div>

            <div className={`relative flex items-center bg-surface/40 backdrop-blur-3xl border border-border-subtle/50 rounded-[3rem] p-2 transition-all duration-700 ${isFocused ? 'shadow-premium-xl border-primary/30 scale-[1.01]' : 'shadow-premium hover:shadow-premium-lg'}`}>
                
                {/* Section 1: What */}
                <div className="flex-[1.5] flex flex-col px-6 py-2 border-r border-border-subtle/30 group/what">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary mb-0.5 italic">{lang === 'pt' ? 'O quê?' : 'What?'}</label>
                    <div className="flex items-center gap-3">
                        <Search size={18} className={`shrink-0 transition-colors duration-500 ${isFocused ? 'text-primary' : 'text-text-dim/40'}`} />
                        <input
                            type="text"
                            placeholder={lang === 'pt' ? 'Restaurantes, cafés...' : 'Restaurants, cafés...'}
                            value={searchQuery}
                            onFocus={() => setIsFocused(true)}
                            onChange={handleSearch}
                            onKeyDown={handleKeyDown}
                            className="bg-transparent border-none outline-none text-base md:text-lg text-text-main placeholder:text-text-dim/30 w-full font-display font-black italic uppercase tracking-tighter"
                        />
                    </div>
                </div>

                {/* Section 2: Where */}
                <div className="flex-1 hidden md:flex flex-col px-8 py-2 border-r border-border-subtle/30 group/where">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-dim/50 mb-0.5 italic">{lang === 'pt' ? 'Onde?' : 'Where?'}</label>
                    <button
                        onClick={handleLocationClick}
                        className="flex items-center gap-3 w-full text-left group/loc"
                    >
                        <MapPin size={18} className="text-text-dim/40 group-hover/loc:text-primary transition-colors" />
                        <span className="text-sm font-black text-text-main/60 uppercase italic tracking-tight truncate">
                            {lang === 'pt' ? 'Perto de mim' : 'Near me'}
                        </span>
                    </button>
                </div>

                {/* Section 3: Filter & Action */}
                <div className="flex items-center gap-3 px-4">
                    <button
                        className="hidden sm:flex p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all text-text-dim/60 hover:text-text-main group/filter"
                        title="Filtros"
                    >
                        <SlidersHorizontal size={20} className="group-hover/filter:rotate-90 transition-transform duration-500" />
                    </button>

                    <button
                        onClick={() => navigate(`/restaurantes?q=${encodeURIComponent(searchQuery)}`)}
                        className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-primary-glow hover:scale-105 hover:rotate-[10deg] transition-all duration-500 active:scale-95 shrink-0"
                    >
                        <Search size={22} strokeWidth={3} />
                    </button>
                </div>
            </div>

            {/* Suggestions Overlay */}
            {suggestions.length > 0 && isFocused && (
                <div className="absolute top-[calc(100%-2rem)] left-4 right-4 bg-surface/95 backdrop-blur-3xl border border-border-subtle rounded-[2rem] shadow-premium-lg overflow-hidden z-[2000] animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="px-8 py-4 bg-primary/5 border-b border-border-subtle">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary italic">
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
                            className="w-full flex items-center justify-between px-8 py-5 hover:bg-primary/5 transition-all group/item border-b border-border-subtle last:border-0"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-text-main/5 flex items-center justify-center text-text-main group-hover/item:bg-primary/10 group-hover/item:text-primary transition-all">
                                    <Search size={16} />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-base text-text-main group-hover/item:text-primary transition-colors uppercase tracking-tight">
                                        {s.name}
                                    </p>
                                    <p className="text-[10px] text-text-dim/60 uppercase tracking-widest font-black italic">
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
