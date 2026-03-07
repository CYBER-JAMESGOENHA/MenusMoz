import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Sun, Moon, Globe, Heart, Map as MapIcon, Menu, X, Search, ChevronRight } from 'lucide-react';
import { RESTAURANTS } from './data';
import Home from './Home';
import RestaurantDetail from './RestaurantDetail';
import About from './About';
import Blog from './Blog';
import ForOwners from './ForOwners';
import Map from './Map';
import CustomCursor from './CustomCursor';
import LoginModal from './LoginModal';
import { translations } from './translations';

const NavbarSearch = ({ lang }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);
  const t = translations[lang];

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 1) {
      const filteredRest = RESTAURANTS.filter(r =>
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(query.toLowerCase())
      ).map(r => ({ type: 'restaurant', name: r.name, slug: r.slug }));

      const filteredDishes = [];
      RESTAURANTS.forEach(r => {
        r.menuCategories.forEach(cat => {
          cat.items.forEach(item => {
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
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative hidden lg:block">
      <div className="flex items-center gap-2 glass border border-border-subtle rounded-2xl px-4 py-2 w-64 xl:w-80">
        <Search size={15} className="text-text-dim shrink-0" />
        <input
          type="text"
          placeholder={t.hero?.search_placeholder || 'Pesquisar...'}
          value={searchQuery}
          onChange={handleSearch}
          className="bg-transparent border-none outline-none text-sm text-text-main placeholder:text-text-dim/50 w-full"
        />
      </div>
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border-subtle rounded-2xl shadow-2xl overflow-hidden z-[2000] text-left">
          {suggestions.map((s, i) => (
            <Link
              key={i}
              to={`/restaurante/${s.slug}`}
              onClick={() => { setSuggestions([]); setSearchQuery(''); }}
              className="flex items-center justify-between px-5 py-3 hover:bg-primary/5 transition-colors border-b border-border-subtle last:border-0"
            >
              <div>
                <p className="font-bold text-sm text-text-main">{s.name}</p>
                <p className="text-[10px] text-text-dim uppercase tracking-wider">
                  {s.type === 'restaurant' ? 'Restaurante' : `Prato em ${s.restaurant}`}
                </p>
              </div>
              <ChevronRight size={14} className="text-primary" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Navbar = ({ darkMode, toggleDarkMode, lang, setLang, favoritesCount, onLoginOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = translations[lang].nav;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${isScrolled || isMenuOpen ? 'py-4' : 'py-8'}`}>
      <div className={`mx-auto max-w-7xl px-4 flex items-center justify-between transition-all duration-500 ${isScrolled || isMenuOpen ? 'glass px-6 py-3 mx-4 rounded-3xl' : 'bg-transparent px-4'}`}>
        <Link to="/" className="flex items-center z-[1001]" onClick={() => setIsMenuOpen(false)}>
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">L</div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8 font-medium text-text-main/80">
          <Link to="/" className="hover:text-primary transition-colors">{t.home}</Link>
          <Link to="/blog" className="hover:text-primary transition-colors">{t.sabor}</Link>
          <Link to="/sobre" className="hover:text-primary transition-colors">{t.about}</Link>
          <Link to="/proprietarios" className="hover:text-primary transition-colors">{t.owners}</Link>
        </div>

        {/* Search Bar */}
        <NavbarSearch lang={lang} />

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
              className="w-10 h-10 flex items-center justify-center rounded-full glass hover:bg-primary/10 transition-all text-text-main border-none shadow-sm"
              title="Change Language"
            >
              <Globe size={18} />
              <span className="ml-1 text-[10px] font-bold uppercase">{lang}</span>
            </button>

            <Link to="/favoritos" className="relative w-10 h-10 flex items-center justify-center rounded-full glass hover:bg-primary/10 transition-all text-text-main border-none shadow-sm">
              <Heart size={18} fill={favoritesCount > 0 ? "currentColor" : "none"} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {favoritesCount}
                </span>
              )}
            </Link>

            <Link to="/mapa" className="w-10 h-10 flex items-center justify-center rounded-full glass hover:bg-primary/10 transition-all text-text-main border-none shadow-sm">
              <MapIcon size={18} />
            </Link>

            <button
              onClick={toggleDarkMode}
              className="w-10 h-10 flex items-center justify-center rounded-full glass hover:bg-primary/10 transition-all text-primary border-none shadow-sm"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          <button
            onClick={onLoginOpen}
            className="login-moz-btn hidden md:flex items-center gap-2"
          >
            <span className="login-moz-lens">🇲🇿</span>
            <span className="login-moz-label">{t.login}</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/20 z-[1001]"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-surface/95 backdrop-blur-xl z-[900] transition-all duration-500 lg:hidden ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="flex flex-col items-center justify-center h-full gap-8 p-8">
          <div className="flex flex-col items-center gap-6 mb-12 text-center">
            {[
              { to: "/", label: t.home },
              { to: "/blog", label: t.sabor },
              { to: "/sobre", label: t.about },
              { to: "/proprietarios", label: t.owners },
              { to: "/favoritos", label: `Favoritos (${favoritesCount})` },
              { to: "/mapa", label: "Mapa Interativo" }
            ].map((link, i) => (
              <Link
                key={i}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className="text-3xl font-black tracking-tighter text-text-main hover:text-primary transition-all duration-300"
                style={{
                  opacity: isMenuOpen ? 1 : 0,
                  transform: isMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: isMenuOpen ? `${i * 60}ms` : '0ms'
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div
            className="flex gap-4"
            style={{
              opacity: isMenuOpen ? 1 : 0,
              transform: isMenuOpen ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.3s ease, transform 0.3s ease',
              transitionDelay: isMenuOpen ? '360ms' : '0ms'
            }}
          >
            <button
              onClick={() => { setLang(lang === 'pt' ? 'en' : 'pt'); setIsMenuOpen(false); }}
              className="px-6 py-3 rounded-2xl glass font-bold text-text-main flex items-center gap-2 border-none shadow-sm"
            >
              <Globe size={20} /> {lang.toUpperCase()}
            </button>
            <button
              onClick={() => { toggleDarkMode(); setIsMenuOpen(false); }}
              className="px-6 py-3 rounded-2xl glass font-bold text-primary flex items-center gap-2 border-none shadow-sm"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />} {darkMode ? 'Light' : 'Dark'}
            </button>
          </div>

          <button
            onClick={() => { onLoginOpen(); setIsMenuOpen(false); }}
            className="w-full max-w-xs bg-primary text-white py-5 rounded-3xl font-black text-xl shadow-2xl shadow-primary/30 mt-8"
            style={{
              opacity: isMenuOpen ? 1 : 0,
              transform: isMenuOpen ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.3s ease, transform 0.3s ease',
              transitionDelay: isMenuOpen ? '420ms' : '0ms'
            }}
          >
            {t.login}
          </button>
        </div>
      </div>
    </nav>
  );
};

const Footer = ({ lang }) => {
  const t = translations[lang].footer;
  const tn = translations[lang].nav;

  return (
    <footer className="bg-surface pt-24 pb-12 rounded-t-[3rem] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-8 uppercase font-heading font-black text-3xl tracking-tighter text-primary">
              Locais de Moz
            </div>
            <p className="text-text-dim text-xl max-w-md">
              {t.desc}
            </p>
          </div>
          <div>
            <h5 className="font-bold mb-6 text-sm uppercase tracking-widest text-primary">{t.platform}</h5>
            <div className="flex flex-col gap-4 text-text-dim">
              <Link to="/sobre" className="hover:text-text-main">{tn.about}</Link>
              <Link to="/blog" className="hover:text-text-main">{tn.sabor}</Link>
              <Link to="/proprietarios" className="hover:text-text-main">{tn.owners}</Link>
            </div>
          </div>
          <div>
            <h5 className="font-bold mb-6 text-sm uppercase tracking-widest text-primary">Social</h5>
            <div className="flex flex-col gap-4 text-text-dim">
              <a href="#" className="hover:text-text-main">Instagram</a>
              <a href="#" className="hover:text-text-main">Facebook</a>
              <a href="#" className="hover:text-text-main">LinkedIn</a>
            </div>
          </div>
        </div>
        {/* Newsletter CTA */}
        <div className="mb-16 bg-primary/5 border border-primary/10 rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 justify-between">
          <div>
            <h4 className="text-2xl font-black tracking-tighter text-text-main mb-2">Fique por dentro do sabor 🇲🇿</h4>
            <p className="text-text-dim">Receba as melhores ofertas e novidades dos restaurantes de Moçambique.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <input
              type="email"
              placeholder="O seu email..."
              className="flex-1 md:w-72 h-14 px-6 rounded-2xl glass border border-border-subtle text-text-main placeholder:text-text-dim/50 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
            />
            <button className="bg-primary text-white px-8 py-3 rounded-2xl font-black whitespace-nowrap hover:brightness-110 transition-all shadow-lg shadow-primary/20">
              Subscrever
            </button>
          </div>
        </div>

        <div className="border-t border-border-subtle pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-text-dim text-sm">
          <p>© 2026 Locais de Moz — O orgulho de cozinhar digital.</p>
          <div className="flex gap-8">
            <a href="#">Privacidade</a>
            <a href="#">Termos de Uso</a>
            <a href="#">Contactos</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [lang, setLang] = useState('pt');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('menusmoz-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('menusmoz-dark-mode');
    return saved === 'true' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('menusmoz-dark-mode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('menusmoz-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  return (
    <Router>
      <main className="min-h-screen relative bg-bg transition-colors duration-300">
        <CustomCursor />
        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} lang={lang} />
        <Navbar
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
          lang={lang}
          setLang={setLang}
          favoritesCount={favorites.length}
          onLoginOpen={() => setIsLoginOpen(true)}
        />
        <Routes>
          <Route path="/" element={<Home lang={lang} favorites={favorites} toggleFavorite={toggleFavorite} />} />
          <Route path="/restaurante/:slug" element={<RestaurantDetail lang={lang} favorites={favorites} toggleFavorite={toggleFavorite} />} />
          <Route path="/mapa" element={<Map lang={lang} />} />
          <Route path="/sobre" element={<About lang={lang} />} />
          <Route path="/blog" element={<Blog lang={lang} />} />
          <Route path="/proprietarios" element={<ForOwners lang={lang} />} />
          <Route path="/favoritos" element={<Home lang={lang} favorites={favorites} toggleFavorite={toggleFavorite} showOnlyFavorites={true} />} />
        </Routes>
        <Footer lang={lang} />
      </main>
    </Router>
  );
}
