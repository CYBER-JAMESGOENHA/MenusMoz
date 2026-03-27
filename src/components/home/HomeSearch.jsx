import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Utensils, Heart } from 'lucide-react';
import { translations } from '../../translations';

export const HomeSearch = ({ lang, restaurants = [] }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const searchRef = useRef(null);
    const t = translations[lang] ?? translations.pt;
    const navigate = useNavigate();

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            setSuggestions([]);
            navigate(`/restaurantes?q=${encodeURIComponent(searchQuery.trim())}&autoFocus=true`);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.length > 1) {
            const filteredRest = restaurants.filter(r =>
                r.name.toLowerCase().includes(query.toLowerCase()) ||
                r.cuisine.toLowerCase().includes(query.toLowerCase())
            ).map(r => ({ type: 'restaurant', name: r.name, slug: r.slug }));

            const filteredDishes = [];
            restaurants.forEach(r => {
                r.menuCategories?.forEach(cat => {
                    cat.items?.forEach(item => {
                        if (item.name.toLowerCase().includes(query.toLowerCase())) {
                            filteredDishes.push({ type: 'dish', name: item.name, restaurant: r.name, slug: r.slug });
                        }
                    });
                });
            });
            setSuggestions([...filteredRest, ...filteredDishes.slice(0, 5)]);
        } else {
            setSuggestions([]);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setSuggestions([]);
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={searchRef} className="max-w-4xl mx-auto px-4 mt-2 mb-2 relative z-[100]">
            <div className={`group relative transform transition-all duration-700 ${isFocused ? 'scale-[1.02]' : 'hover:-translate-y-1'}`}>
                {/* Animated glowing border effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r from-primary via-moz-yellow to-moz-green rounded-[3rem] blur-xl transition-all duration-1000 ${isFocused ? 'opacity-40 animate-pulse' : 'opacity-0 group-hover:opacity-20'}`}></div>

                <div className={`relative flex items-center bg-surface/80 backdrop-blur-2xl border transition-all duration-500 rounded-3xl md:rounded-[3rem] px-5 sm:px-8 py-3 md:py-4 ${isFocused ? 'border-primary shadow-premium shadow-primary/10' : 'border-border-subtle shadow-xl'}`}>
                    <Search size={22} className={`transition-colors duration-500 ${isFocused ? 'text-primary' : 'text-text-dim/50'}`} />
                    <input
                        type="text"
                        placeholder={t.hero?.search_placeholder || 'O que você quer comer hoje?'}
                        value={searchQuery}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => !suggestions.length && setIsFocused(false)}
                        onChange={handleSearch}
                        onKeyDown={handleKeyDown}
                        className="bg-transparent border-none outline-none text-lg md:text-2xl text-text-main placeholder:text-text-dim/40 w-full font-display font-medium px-4"
                    />
                </div>

                {suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-4 bg-surface/95 backdrop-blur-2xl border border-border-subtle rounded-custom shadow-premium overflow-hidden z-[2000] text-left animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="px-8 py-4 bg-primary/5 border-b border-border-subtle">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{lang === 'pt' ? 'Resultados Encontrados' : 'Search Results'}</span>
                        </div>
                        {suggestions.map((s, i) => (
                            <Link
                                key={i}
                                to={`/restaurante/${s.slug}`}
                                onClick={() => { setSuggestions([]); setSearchQuery(''); setIsFocused(false); }}
                                className="flex items-center justify-between px-8 py-5 hover:bg-primary/5 transition-all group/item border-b border-border-subtle last:border-0"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${s.type === 'restaurant' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
                                        {s.type === 'restaurant' ? <Utensils size={18} /> : <Heart size={18} />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg text-text-main group-hover/item:text-primary transition-colors">{s.name}</p>
                                        <p className="text-[10px] text-text-dim uppercase tracking-widest font-black">
                                            {s.type === 'restaurant' ? (lang === 'pt' ? 'Estabelecimento' : 'Restaurant') : `${lang === 'pt' ? 'Prato' : 'Dish'} • ${s.restaurant}`}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight size={20} className="text-primary opacity-0 group-hover/item:opacity-100 transform translate-x-2 group-hover/item:translate-x-0 transition-all" />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
