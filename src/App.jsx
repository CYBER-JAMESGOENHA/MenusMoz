import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Sun, Moon, Globe, Heart, Map as MapIcon } from 'lucide-react';
import Home from './Home';
import RestaurantDetail from './RestaurantDetail';
import About from './About';
import Blog from './Blog';
import ForOwners from './ForOwners';
import Map from './Map';
import { translations } from './translations';

const Navbar = ({ darkMode, toggleDarkMode, lang, setLang, favoritesCount }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const t = translations[lang].nav;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${isScrolled ? 'py-4' : 'py-8'}`}>
      <div className={`mx-auto max-w-7xl px-4 flex items-center justify-between rounded-full transition-all duration-500 ${isScrolled ? 'glass px-8 py-3' : 'bg-transparent'}`}>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">M</div>
          <span className="font-heading font-black text-2xl tracking-tighter text-primary">MenusMOZ</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 font-medium text-text-main/80">
          <Link to="/" className="hover:text-primary transition-colors">{t.home}</Link>
          <Link to="/blog" className="hover:text-primary transition-colors">{t.sabor}</Link>
          <Link to="/sobre" className="hover:text-primary transition-colors">{t.about}</Link>
          <Link to="/proprietarios" className="hover:text-primary transition-colors">{t.owners}</Link>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
            className="w-10 h-10 flex items-center justify-center rounded-full glass hover:bg-accent/20 transition-all text-text-main"
            title="Change Language"
          >
            <Globe size={18} />
            <span className="ml-1 text-xs font-bold uppercase">{lang}</span>
          </button>

          <Link to="/favoritos" className="relative w-10 h-10 flex items-center justify-center rounded-full glass hover:bg-accent/20 transition-all text-text-main">
            <Heart size={18} fill={favoritesCount > 0 ? "currentColor" : "none"} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {favoritesCount}
              </span>
            )}
          </Link>

          <Link to="/mapa" className="w-10 h-10 flex items-center justify-center rounded-full glass hover:bg-accent/20 transition-all text-text-main">
            <MapIcon size={18} />
          </Link>

          <button
            onClick={toggleDarkMode}
            className="w-10 h-10 flex items-center justify-center rounded-full glass hover:bg-accent/20 transition-all text-primary"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="bg-primary text-white px-6 py-2.5 rounded-full font-bold hover:bg-black transition-all shadow-lg shadow-primary/20">
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
              MenusMOZ
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
        <div className="border-t border-border-subtle pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-text-dim text-sm">
          <p>© 2026 MenusMOZ — O orgulho de cozinhar digital.</p>
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
        <Navbar
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
          lang={lang}
          setLang={setLang}
          favoritesCount={favorites.length}
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
