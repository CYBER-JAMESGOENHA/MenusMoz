import { useState, useRef, useEffect } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { RESTAURANTS } from '../data';
import { translations } from '../translations';

const NavbarSearch = ({ lang }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);
  const t = translations[lang] ?? translations.pt;
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 1) {
      const filteredRest = RESTAURANTS.filter(r =>
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(query.toLowerCase())
      ).map(r => ({ type: 'restaurant', name: r.name, slug: r.slug, image: r.image }));

      const filteredDishes = [];
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
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setSuggestions([]);
      navigate(`/restaurantes?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div ref={searchRef} className="relative hidden lg:block">
      <div className="flex items-center gap-3 glass border border-border-subtle rounded-3xl px-6 py-2.5 w-64 xl:w-96 group focus-within:w-[450px] transition-all duration-500 bg-white/10">
        <Search size={18} className="text-primary shrink-0 transition-transform group-focus-within:scale-125" aria-hidden="true" />
        <input
          type="text"
          placeholder={t.hero?.search_placeholder || 'Ouse descobrir...'}
          value={searchQuery}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          aria-label={lang === 'pt' ? 'Pesquisar restaurantes' : 'Search restaurants'}
          className="bg-transparent border-none outline-none text-sm font-bold text-text-main placeholder:text-text-dim/30 w-full"
        />
      </div>
      {suggestions.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-4 bg-surface/80 backdrop-blur-3xl border border-white/20 rounded-[2.5rem] shadow-premium overflow-hidden z-[2000] text-left w-[450px] animate-in fade-in slide-in-from-top-4 duration-300"
          role="listbox"
          aria-label="Sugestões de pesquisa"
        >
          <div className="p-4 bg-primary/5 border-b border-border-subtle">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Sugestões de Maputo</span>
          </div>
          <div className="max-h-[60vh] overflow-y-auto no-scrollbar">
            {suggestions.map((s, i) => (
              <Link
                key={i}
                to={`/restaurante/${s.slug}`}
                role="option"
                onClick={() => { setSuggestions([]); setSearchQuery(''); }}
                className="flex items-center gap-4 px-6 py-4 hover:bg-primary/5 transition-all group border-b border-border-subtle last:border-0"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                  <img src={s.image} className="w-full h-full object-cover" alt={s.name} />
                </div>
                <div className="flex-1">
                  <p className="font-black text-sm text-text-main group-hover:text-primary transition-colors">{s.name}</p>
                  <p className="text-[10px] text-text-dim/50 font-black uppercase tracking-widest mt-0.5">
                    {s.type === 'restaurant' ? 'Restaurante' : `Especialidade em ${s.restaurant}`}
                  </p>
                </div>
                <ChevronRight size={18} className="text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarSearch;
