import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, Globe, Heart, Menu, X, Search, ChevronRight, ShoppingBag, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { RESTAURANTS } from './data';
import CustomCursor from './CustomCursor';
import LoginModal from './LoginModal';
import MobileBottomNav from './MobileBottomNav';
import { translations } from './translations';
import { restaurantService } from './services/restaurantService';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const Home = lazy(() => import('./Home'));
const RestaurantDetail = lazy(() => import('./RestaurantDetail'));
const About = lazy(() => import('./About'));
const Blog = lazy(() => import('./Blog'));
const ForOwners = lazy(() => import('./ForOwners'));
const RestaurantListing = lazy(() => import('./RestaurantListing'));
const PrivacyPolicy = lazy(() => import('./PrivacyPolicy'));
const TermsOfUse = lazy(() => import('./TermsOfUse'));

export const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen bg-bg">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
);

const NavbarSearch = ({ lang }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);
  const t = translations[lang];
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
        <Search size={18} className="text-primary shrink-0 transition-transform group-focus-within:scale-125" />
        <input
          type="text"
          placeholder={t.hero?.search_placeholder || 'Ouse descobrir...'}
          value={searchQuery}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none outline-none text-sm font-bold text-text-main placeholder:text-text-dim/30 w-full"
        />
      </div>
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-surface/80 backdrop-blur-3xl border border-white/20 rounded-[2.5rem] shadow-premium overflow-hidden z-[2000] text-left w-[450px] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-4 bg-primary/5 border-b border-border-subtle">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Sugestões de Maputo</span>
          </div>
          <div className="max-h-[60vh] overflow-y-auto no-scrollbar">
            {suggestions.map((s, i) => (
              <Link
                key={i}
                to={`/restaurante/${s.slug}`}
                onClick={() => { setSuggestions([]); setSearchQuery(''); }}
                className="flex items-center gap-4 px-6 py-4 hover:bg-primary/5 transition-all group border-b border-border-subtle last:border-0"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                  <img src={s.image} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-1">
                  <p className="font-black text-sm text-text-main group-hover:text-primary transition-colors">{s.name}</p>
                  <p className="text-[10px] text-text-dim/50 font-black uppercase tracking-widest mt-0.5">
                    {s.type === 'restaurant' ? 'Restaurante' : `Especialidade em ${s.restaurant}`}
                  </p>
                </div>
                <ChevronRight size={18} className="text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Navbar = ({ darkMode, toggleDarkMode, lang, setLang, favoritesCount, onLoginOpen, isScrolled }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = translations[lang].nav;

  useEffect(() => {
    // This useEffect is now handled by the parent App component
    // const handleScroll = () => setIsScrolled(window.scrollY > 40);
    // window.addEventListener('scroll', handleScroll);
    // return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed z-[1000] left-4 right-4 md:left-8 md:right-8 transition-all duration-700 ${isScrolled || isMenuOpen ? 'top-1 md:top-1.5' : 'top-2 md:top-2.5'}`}>
      <div className={`mx-auto max-w-7xl flex items-center justify-between transition-all duration-700 rounded-[2rem] px-5 sm:px-8 py-1 md:py-1.5 ${isScrolled || isMenuOpen ? 'glass shadow-premium' : 'bg-transparent'}`}>
        <div className="flex items-center gap-4 z-[1001]">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-12 h-12 flex items-center justify-center rounded-2xl bg-primary text-white shadow-primary-glow"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link to="/" className="hidden lg:flex items-center gap-3 group" onClick={() => setIsMenuOpen(false)}>
            <div className="w-12 h-12 bg-primary shrink-0 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-primary-glow group-hover:scale-110 transition-transform">L</div>
            <div className="flex flex-col -gap-1">
                <span className="font-black text-2xl tracking-tighter text-text-main leading-none">Locais de Moz</span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Moçambique</span>
            </div>
          </Link>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:hidden font-display italic font-black text-2xl tracking-tighter text-text-main z-[1000] pointer-events-none">
          Locais de Moz
        </div>

        <div className="hidden lg:flex items-center gap-10 font-black text-sm uppercase tracking-widest text-text-main/70">
          <Link to="/" className="hover:text-primary transition-colors focus:text-primary outline-none">Home</Link>
          <Link to="/blog" className="hover:text-primary transition-colors focus:text-primary outline-none">Sabor</Link>
          <Link to="/sobre" className="hover:text-primary transition-colors focus:text-primary outline-none">Sobre</Link>
          <Link to="/proprietarios" className="hover:text-primary transition-colors focus:text-primary outline-none">Negócios</Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3">
             <button
              onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
              className="w-11 h-11 flex items-center justify-center rounded-2xl glass hover:bg-primary/10 transition-all text-text-main border-none"
            >
              <Globe size={18} />
              <span className="ml-1 text-[10px] font-black uppercase">{lang}</span>
            </button>

            <Link to="/favoritos" className="relative w-11 h-11 flex items-center justify-center rounded-2xl glass hover:bg-primary/10 transition-all text-text-main border-none">
              <Heart size={18} fill={favoritesCount > 0 ? "currentColor" : "none"} className={favoritesCount > 0 ? "text-primary" : ""} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-primary-glow">
                  {favoritesCount}
                </span>
              )}
            </Link>

            <button
              onClick={toggleDarkMode}
              className="w-11 h-11 flex items-center justify-center rounded-2xl glass hover:bg-primary/10 transition-all text-primary border-none"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          <button
            onClick={onLoginOpen}
            className="login-moz-btn hidden lg:flex scale-110 ml-4"
          >
            <span className="login-moz-lens">🇲🇿</span>
            <span className="login-moz-label font-black uppercase text-[10px] tracking-widest">{t.login}</span>
          </button>

        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-surface/98 backdrop-blur-3xl z-[900] transition-all duration-700 lg:hidden ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="flex flex-col items-center justify-center h-full gap-4 p-8 overflow-y-auto no-scrollbar">
          <div className="flex flex-col items-center gap-6 mb-2 text-center">
            {[
              { to: "/", label: t.home },
              { to: "/blog", label: t.sabor },
              { to: "/sobre", label: t.about },
              { to: "/proprietarios", label: t.owners },
              { to: "/favoritos", label: `Favoritos (${favoritesCount})` }
            ].map((link, i) => (
              <Link
                key={i}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className="text-3xl sm:text-4xl font-black tracking-tighter text-text-main hover:text-primary transition-all duration-500"
                style={{
                  opacity: isMenuOpen ? 1 : 0,
                  transform: isMenuOpen ? 'translateY(0)' : 'translateY(30px)',
                  transitionDelay: isMenuOpen ? `${i * 80}ms` : '0ms'
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div
            className="flex gap-6"
            style={{
              opacity: isMenuOpen ? 1 : 0,
              transform: isMenuOpen ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.5s ease',
              transitionDelay: isMenuOpen ? '480ms' : '0ms'
            }}
          >
            <button
              onClick={() => { setLang(lang === 'pt' ? 'en' : 'pt'); setIsMenuOpen(false); }}
              className="w-14 h-14 rounded-2xl glass font-black text-text-main flex items-center justify-center border-none shadow-premium"
            >
              <Globe size={24} />
            </button>
            <button
              onClick={() => { toggleDarkMode(); setIsMenuOpen(false); }}
              className="w-14 h-14 rounded-2xl glass font-black text-primary flex items-center justify-center border-none shadow-premium"
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>

          <button
            onClick={() => { onLoginOpen(); setIsMenuOpen(false); }}
            className="login-moz-btn w-full max-w-xs mt-2"
            style={{
              opacity: isMenuOpen ? 1 : 0,
              transform: isMenuOpen ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.5s ease',
              transitionDelay: isMenuOpen ? '560ms' : '0ms'
            }}
          >
            <span className="login-moz-lens">🇲🇿</span>
            <span className="login-moz-label font-black uppercase text-xs tracking-[0.2em]">{t.login}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

const NewsletterForm = ({ lang }) => {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // 'idle'|'loading'|'success'|'error'|'duplicate'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState('error');
      return;
    }
    setState('loading');
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('newsletter_subscribers')
          .insert([{ email: email.trim().toLowerCase() }]);
        if (error) {
          if (error.code === '23505') { setState('duplicate'); return; }
          throw error;
        }
      } else {
        await new Promise(r => setTimeout(r, 600));
      }
      setState('success');
      setEmail('');
    } catch {
      setState('error');
    }
  };

  if (state === 'success') {
    return (
      <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-2xl px-5 py-4">
        <CheckCircle size={20} className="text-green-500 shrink-0" />
        <p className="text-sm font-bold text-green-600">
          {lang === 'pt' ? 'Subscrito! Até breve 🎉' : 'Subscribed! See you soon 🎉'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {state === 'duplicate' && (
        <p className="text-xs font-bold text-amber-500 mb-2 flex items-center gap-1">
          <AlertCircle size={12} />
          {lang === 'pt' ? 'Este email já está subscrito.' : 'Email already subscribed.'}
        </p>
      )}
      {state === 'error' && (
        <p className="text-xs font-bold text-red-500 mb-2 flex items-center gap-1">
          <AlertCircle size={12} />
          {lang === 'pt' ? 'Email inválido ou erro.' : 'Invalid email or error.'}
        </p>
      )}
      <div className="relative group">
        <input
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); if (state !== 'idle') setState('idle'); }}
          placeholder={lang === 'pt' ? 'Seu melhor email...' : 'Your best email...'}
          maxLength={200}
          className="w-full h-16 pl-6 pr-32 rounded-2xl glass border border-border-subtle text-text-main placeholder:text-text-dim/40 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
          disabled={state === 'loading'}
          aria-label={lang === 'pt' ? 'Subscrever newsletter' : 'Subscribe newsletter'}
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          className="absolute right-2 top-2 bottom-2 bg-primary text-white px-5 rounded-xl font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all shadow-primary-glow disabled:opacity-70 flex items-center gap-2"
        >
          {state === 'loading' ? <Loader2 size={16} className="animate-spin" /> : 'OK'}
        </button>
      </div>
    </form>
  );
};

const Footer = ({ lang }) => {
  const t = translations[lang].footer;
  const tn = translations[lang].nav;

  return (
    <footer className="bg-surface pt-32 pb-24 md:pb-16 rounded-t-custom-lg transition-colors duration-300 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-moz-green via-moz-yellow to-moz-red opacity-30" />
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-12 gap-16 mb-24">
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center gap-4 mb-8 group">
              <div className="w-14 h-14 bg-primary shrink-0 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-primary-glow group-hover:rotate-12 transition-transform">L</div>
              <div className="flex flex-col">
                <span className="text-3xl font-black tracking-tighter text-text-main leading-none uppercase">Locais de Moz</span>
                <span className="text-xs font-black uppercase tracking-[0.4em] text-primary mt-1">Digital Gastronomy</span>
              </div>
            </Link>
            <p className="text-text-dim text-2xl leading-relaxed max-w-md italic font-medium">
              "{t.desc}"
            </p>
            
            <div className="flex gap-4 mt-10">
                {[
                  { name: 'Instagram', href: 'https://instagram.com' },
                  { name: 'Facebook', href: 'https://facebook.com' },
                  { name: 'Twitter', href: 'https://twitter.com' },
                ].map(social => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="w-12 h-12 rounded-2xl glass flex items-center justify-center hover:bg-primary hover:text-white transition-all transform hover:-translate-y-2"
                    >
                        <span className="sr-only">{social.name}</span>
                        <div className="w-5 h-5 bg-current opacity-20" />
                    </a>
                ))}
            </div>
          </div>
          
          <div className="md:col-span-2 md:offset-1">
            <h5 className="font-black mb-8 text-xs uppercase tracking-[0.3em] text-primary">{t.platform}</h5>
            <div className="flex flex-col gap-5 text-lg font-bold text-text-dim">
              <Link to="/sobre" className="hover:text-primary transition-colors">{tn.about}</Link>
              <Link to="/blog" className="hover:text-primary transition-colors">{tn.sabor}</Link>
              <Link to="/proprietarios" className="hover:text-primary transition-colors">{tn.owners}</Link>
            </div>
          </div>

          <div className="md:col-span-4">
             <h5 className="font-black mb-8 text-xs uppercase tracking-[0.3em] text-primary">Sabor na Caixa</h5>
             <p className="text-text-dim mb-6 font-medium">Receba as melhores ofertas e novidades dos restaurantes de Moçambique.</p>
             <NewsletterForm lang={lang} />
          </div>
        </div>

        <div className="border-t border-border-subtle pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-text-dim text-xs font-black uppercase tracking-widest">
          <p>© 2026 Locais de Moz — Moçambique Digital.</p>
          <div className="flex gap-10">
            <Link to="/privacidade" className="hover:text-primary transition-colors">Privacidade</Link>
            <Link to="/termos" className="hover:text-primary transition-colors">Termos</Link>
            <a href="mailto:contacto@locaisdemoz.co.mz" className="hover:text-primary transition-colors">Contactos</a>
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
  
  const [restaurants, setRestaurants] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);


  // Carregar dados dinâmicos do Supabase (Restaurantes, Hero, Blog)
  useEffect(() => {
    const loadAllContent = async () => {
      try {
        const [resData, heroData, blogData] = await Promise.all([
          restaurantService.getAll(),
          restaurantService.getHeroSlides(lang),
          restaurantService.getBlogPosts(lang)
        ]);
        setRestaurants(resData);
        setHeroSlides(heroData);
        setBlogPosts(blogData);
      } catch (err) {
        console.error('Failed to load content:', err);
      } finally {
        setIsLoadingContent(false);
      }
    };
    loadAllContent();
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('menusmoz-favorites', JSON.stringify(favorites));
  }, [favorites]);

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
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  return (
    <HelmetProvider>
      <Router>
        <Helmet>
          <title>MenusMoz — O Sabor Digital de Moçambique</title>
          <meta name="description" content="Explore os melhores menus de Maputo, Matola e Beira. Do curry mais picante aos mariscos frescos da nossa costa." />
        </Helmet>
        
        <div className="min-h-screen relative bg-bg transition-colors duration-300 overflow-x-hidden">
          <CustomCursor />
          
          {/* Global Ambient Background */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/[0.03] rounded-full blur-[120px] animate-pulse" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full noise-overlay opacity-[0.01] mix-blend-overlay" />
          </div>

          <div className="relative z-10 flex flex-col min-h-screen">
              <Navbar
                darkMode={darkMode}
                toggleDarkMode={() => setDarkMode(!darkMode)}
                lang={lang}
                setLang={setLang}
                favoritesCount={favorites.length}
                onLoginOpen={() => setIsLoginOpen(true)}
                isScrolled={isScrolled}
              />
              
              <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} lang={lang} />
              <MobileBottomNav favoritesCount={favorites.length} onLoginOpen={() => setIsLoginOpen(true)} />

              <main className="flex-grow">
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route path="/" element={
                      isLoadingContent 
                        ? <LoadingSpinner /> 
                        : <Home lang={lang} favorites={favorites} toggleFavorite={toggleFavorite} restaurants={restaurants} heroSlides={heroSlides} blogPosts={blogPosts} />
                    } />
                    <Route path="/restaurante/:slug" element={<RestaurantDetail lang={lang} favorites={favorites} toggleFavorite={toggleFavorite} showLogin={() => setIsLoginOpen(true)} />} />
                    <Route path="/sobre" element={<About lang={lang} />} />
                    <Route path="/blog" element={
                      isLoadingContent 
                        ? <LoadingSpinner /> 
                        : <Blog lang={lang} posts={blogPosts} />
                    } />
                    <Route path="/proprietarios" element={<ForOwners lang={lang} />} />
                    <Route path="/privacidade" element={<PrivacyPolicy lang={lang} />} />
                    <Route path="/termos" element={<TermsOfUse lang={lang} />} />
                    <Route path="/favoritos" element={
                       isLoadingContent 
                       ? <LoadingSpinner />
                       : <Home lang={lang} favorites={favorites} toggleFavorite={toggleFavorite} showOnlyFavorites={true} restaurants={restaurants} heroSlides={heroSlides} />
                    } />
                    <Route path="/restaurantes" element={<RestaurantListing lang={lang} favorites={favorites} toggleFavorite={toggleFavorite} restaurants={restaurants} />} />
                    
                    {/* 404 catch-all */}
                    <Route path="*" element={
                      <div className="min-h-screen flex flex-col items-center justify-center gap-6 pt-32">
                        <div className="w-32 h-32 bg-primary/10 rounded-[3rem] flex items-center justify-center text-primary text-6xl font-display font-black">404</div>
                        <h1 className="text-4xl font-display font-black text-text-main tracking-tighter">Página não encontrada</h1>
                        <p className="text-text-dim font-medium">O endereço que procura não existe.</p>
                        <Link to="/" className="bg-primary text-white px-10 py-4 rounded-full font-black hover:brightness-110 transition-all shadow-primary-glow">
                          Voltar ao Início
                        </Link>
                      </div>
                    } />
                  </Routes>
                </Suspense>
              </main>

              <Footer lang={lang} />
          </div>
        </div>
      </Router>
    </HelmetProvider>
  );
}

