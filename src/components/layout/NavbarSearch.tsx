import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronRight, MapPin } from 'lucide-react';
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
          // In a real app, we'd update context with coords
          alert('Localização obtida com sucesso!');
        },
        () => {
          alert('Permita o acesso à localização no seu navegador.');
        }
      );
    } else {
      alert('Geolocalização não suportada neste navegador.');
    }
  };

  return (
    <div ref={searchRef} className="relative hidden lg:block">
      <div className="flex items-center gap-4 glass border border-border-subtle rounded-[2.5rem] pl-8 pr-3 py-3 w-80 xl:w-[480px] group focus-within:w-[540px] transition-all duration-700 bg-surface/5 hover:bg-surface/10 hover:shadow-premium ring-primary/5 focus-within:ring-4">
        <Search size={18} className="text-primary shrink-0 transition-transform group-focus-within:scale-125" aria-hidden="true" />
        <input
          type="text"
          placeholder={t.hero?.search_placeholder || 'Ouse descobrir...'}
          value={searchQuery}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          aria-label={lang === 'pt' ? 'Pesquisar restaurantes' : 'Search restaurants'}
          className="bg-transparent border-none outline-none text-sm font-black text-text-main placeholder:text-text-dim/30 w-full italic uppercase tracking-tight"
        />
        <button
          onClick={handleLocationRequest}
          title="Adicionar localização"
          className="flex items-center justify-center gap-3 h-11 px-5 rounded-[1.75rem] bg-primary/10 hover:bg-primary text-primary hover:text-white transition-all duration-500 hover:shadow-primary-glow group/loc shrink-0 whitespace-nowrap overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/loc:translate-x-[100%] transition-transform duration-700" />
          <MapPin size={16} className="transition-transform group-hover/loc:animate-bounce relative z-10" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] relative z-10">
            {lang === 'pt' ? 'Localização' : 'Location'}
          </span>
        </button>
      </div>

      {suggestions.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-6 bg-surface/90 backdrop-blur-3xl border border-border-subtle rounded-[3rem] shadow-premium overflow-hidden z-[2000] text-left w-[500px] animate-in fade-in slide-in-from-top-6 duration-700"
          role="listbox"
          aria-label="Sugestões de pesquisa"
        >
          <div className="px-8 py-5 bg-primary/5 border-b border-border-subtle flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary italic">Sugestões em Destaque</span>
            <div className="w-2 h-2 rounded-full bg-moz-green animate-pulse" />
          </div>
          <div className="max-h-[60vh] overflow-y-auto no-scrollbar py-2">
            {suggestions.map((s, i) => (
              <Link
                key={i}
                to={`/restaurante/${s.slug}`}
                role="option"
                onClick={() => { setSuggestions([]); setSearchQuery(''); }}
                className="flex items-center gap-6 px-8 py-5 hover:bg-primary/5 transition-all group border-b border-border-subtle/50 last:border-0"
              >
                <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 shadow-premium group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ring-primary/0 group-hover:ring-2">
                  <img src={s.image} className="w-full h-full object-cover" alt={s.name} />
                </div>
                <div className="flex-1">
                  <p className="font-display font-black text-lg text-text-main group-hover:text-primary transition-colors italic uppercase leading-none tracking-tighter">{s.name}</p>
                  <p className="text-[10px] text-text-dim/50 font-black uppercase tracking-[0.3em] mt-2 italic">
                    {s.type === 'restaurant' ? (lang === 'pt' ? 'Restaurante' : 'Restaurant') : `${lang === 'pt' ? 'Especialidade em' : 'Specialty in'} ${s.restaurant}`}
                  </p>
                </div>
                <ChevronRight size={20} className="text-primary opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500" aria-hidden="true" />
              </Link>
            ))}
          </div>
          <div className="p-6 bg-surface border-t border-border-subtle text-center">
             <button 
                onClick={() => navigate(`/restaurantes?q=${encodeURIComponent(searchQuery)}`)}
                className="text-[10px] font-black uppercase tracking-[0.4em] text-text-dim hover:text-primary transition-colors underline underline-offset-4"
             >
                {lang === 'pt' ? 'Ver todos os resultados' : 'View all results'}
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarSearch;
