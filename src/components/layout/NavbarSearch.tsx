import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronRight, MapPin, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { RESTAURANTS } from '../../data/mockData';
import { translations } from '../../translations';

interface Suggestion {
  type: 'restaurant' | 'dish';
  name: string;
  slug: string;
  image: string;
  restaurant?: string;
}

interface NavbarSearchProps {
  lang: 'pt' | 'en';
}

const NavbarSearch: React.FC<NavbarSearchProps> = ({ lang }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [location, setLocation] = useState('Maxaquene');
  const searchRef = useRef<HTMLDivElement>(null);
  const t = (translations[lang as keyof typeof translations] as any) ?? translations.pt;
  const navigate = useNavigate();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 1) {
      const filteredRest: Suggestion[] = RESTAURANTS.filter(r =>
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(query.toLowerCase())
      ).map(r => ({ type: 'restaurant', name: r.name, slug: r.slug, image: r.image }));

      const filteredDishes: Suggestion[] = [];
      RESTAURANTS.forEach(r => {
        r.menuCategories.forEach(cat => {
          cat.items.forEach(item => {
            if (item.name.toLowerCase().includes(query.toLowerCase())) {
              filteredDishes.push({ type: 'dish', name: item.name, restaurant: r.name, slug: r.slug, image: r.image });
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
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setSuggestions([]);
      navigate(`/restaurantes?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLocationRequest = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // In a real app, update with real address
          setLocation('Minha Localização');
        },
        () => {
          alert('Permita o acesso à localização.');
        }
      );
    }
  };

  return (
    <div ref={searchRef} className="relative hidden lg:block flex-1 max-w-2xl mx-12">
      <div className="flex items-center glass border border-border-subtle rounded-full overflow-hidden transition-all duration-500 bg-surface/5 hover:shadow-premium-lg ring-primary/5 focus-within:ring-2 focus-within:border-primary/30 h-14">
        
        {/* Location Selector (Left) */}
        <button
          onClick={handleLocationRequest}
          className="flex items-center gap-2 h-full px-6 hover:bg-primary/5 transition-colors group/loc border-r border-border-subtle shrink-0"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover/loc:scale-110 transition-transform">
            <MapPin size={16} />
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="text-[9px] font-black uppercase tracking-widest text-text-dim/50 italic">Onde?</span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-black text-text-main truncate max-w-[80px] uppercase italic">{location}</span>
              <ChevronDown size={12} className="text-primary" />
            </div>
          </div>
        </button>

        {/* Search Field (Rest) */}
        <div className="flex-1 flex items-center px-4 relative">
          <Search size={18} className="text-text-dim/40 mr-3" />
          <input
            type="text"
            placeholder={t.hero?.search_placeholder || 'Procure por pratos ou restaurantes'}
            value={searchQuery}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-none outline-none text-sm font-black text-text-main placeholder:text-text-dim/30 w-full italic uppercase tracking-tight"
          />
          
          {/* Magnifying Glass Indicator or Button */}
          {searchQuery && (
            <button 
              onClick={() => navigate(`/restaurantes?q=${encodeURIComponent(searchQuery)}`)}
              className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-primary-glow animate-in fade-in zoom-in duration-300 ml-2"
            >
              <Search size={16} strokeWidth={3} />
            </button>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-4 bg-surface/90 backdrop-blur-3xl border border-border-subtle rounded-[2rem] shadow-premium-lg overflow-hidden z-[2000] text-left animate-in fade-in slide-in-from-top-4 duration-500"
          role="listbox"
          aria-label="Sugestões de pesquisa"
        >
          <div className="px-6 py-4 bg-primary/5 border-b border-border-subtle flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">Resultados para você</span>
            <div className="w-1.5 h-1.5 rounded-full bg-moz-green animate-pulse" />
          </div>
          <div className="max-h-[60vh] overflow-y-auto no-scrollbar py-1">
            {suggestions.map((s, i) => (
              <Link
                key={i}
                to={`/restaurante/${s.slug}`}
                role="option"
                onClick={() => { setSuggestions([]); setSearchQuery(''); }}
                className="flex items-center gap-4 px-6 py-4 hover:bg-primary/5 transition-all group border-b border-border-subtle/50 last:border-0"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-premium group-hover:scale-105 transition-transform duration-500">
                  <img src={s.image} className="w-full h-full object-cover" alt={s.name} />
                </div>
                <div className="flex-1">
                  <p className="font-display font-black text-base text-text-main group-hover:text-primary transition-colors italic uppercase leading-tight tracking-tighter">{s.name}</p>
                  <p className="text-[9px] text-text-dim/50 font-black uppercase tracking-widest italic mt-1">
                    {s.type === 'restaurant' ? (lang === 'pt' ? 'Restaurante' : 'Restaurant') : `${lang === 'pt' ? 'Em' : 'In'} ${s.restaurant}`}
                  </p>
                </div>
                <ChevronRight size={16} className="text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarSearch;
