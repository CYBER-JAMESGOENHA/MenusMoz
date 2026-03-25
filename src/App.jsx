import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { restaurantService } from './services/restaurantService';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import CustomCursor from './CustomCursor';
import LoginModal from './LoginModal';
import UserPanel from './UserPanel';
import MobileBottomNav from './MobileBottomNav';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Home = lazy(() => import('./Home'));
const RestaurantDetail = lazy(() => import('./RestaurantDetail'));
const About = lazy(() => import('./About'));
const Blog = lazy(() => import('./Blog'));
const BlogPost = lazy(() => import('./BlogPost'));
const ForOwners = lazy(() => import('./ForOwners'));
const RestaurantListing = lazy(() => import('./RestaurantListing'));

export const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen bg-bg">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" role="status" aria-label="A carregar..." />
    </div>
);

export default function App() {
  const [lang, setLang] = useState('pt');

  // ── AUTH STATE (fix S1) ─────────────────────────────────────────────────────
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Get current session immediately on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Subscribe to auth changes for the lifetime of the app
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── FAVORITES (fix S2 / F1) ─────────────────────────────────────────────────
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('menusmoz-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('menusmoz-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // When user logs in, fetch DB favorites and merge with localStorage
  useEffect(() => {
    if (!user || !isSupabaseConfigured) return;
    const syncFavorites = async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select('restaurant_id')
        .eq('user_id', user.id);
      if (!error && data) {
        const dbIds = data.map(f => f.restaurant_id);
        setFavorites(prev => [...new Set([...prev, ...dbIds])]);
      }
    };
    syncFavorites();
  }, [user]);

  const toggleFavorite = async (id) => {
    const isCurrentlyFavorite = favorites.includes(id);
    // Optimistic local update
    setFavorites(prev =>
      isCurrentlyFavorite ? prev.filter(f => f !== id) : [...prev, id]
    );
    // Sync to DB if logged in (fix F1)
    if (user && isSupabaseConfigured) {
      try {
        await restaurantService.toggleFavorite(user.id, id, isCurrentlyFavorite);
      } catch (err) {
        if (import.meta.env.DEV) console.error('Favorite sync error:', err);
        // Rollback on failure
        setFavorites(prev =>
          isCurrentlyFavorite ? [...prev, id] : prev.filter(f => f !== id)
        );
      }
    }
  };

  // ── CONTENT LOADING ───────────────────────────────────────────────────────
  const [restaurants, setRestaurants] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoadingContent, setIsLoadingContent] = useState(true);

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
        // Only log in development (fix S6)
        if (import.meta.env.DEV) console.error('Failed to load content:', err);
      } finally {
        setIsLoadingContent(false);
      }
    };
    loadAllContent();
  }, [lang]);

  // ── DARK MODE ─────────────────────────────────────────────────────────────
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

  // ── SCROLL & PANELS ───────────────────────────────────────────────────────
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Router>
      <div className="min-h-screen relative bg-bg transition-colors duration-300 overflow-x-hidden">
        <CustomCursor />
        
        {/* Global Ambient Background */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/[0.03] rounded-full blur-[120px] animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full noise-overlay opacity-[0.01] mix-blend-overlay" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar
              isScrolled={isScrolled}
              onPanelOpen={() => setIsUserPanelOpen(true)}
              user={user}
            />
            
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} lang={lang} />
            
            <UserPanel
              isOpen={isUserPanelOpen}
              onClose={() => setIsUserPanelOpen(false)}
              lang={lang}
              setLang={setLang}
              darkMode={darkMode}
              toggleDarkMode={() => setDarkMode(!darkMode)}
              favoritesCount={favorites.length}
              user={user}
              onLoginOpen={() => { setIsUserPanelOpen(false); setIsLoginOpen(true); }}
              onLogout={() => { supabase.auth.signOut(); setIsUserPanelOpen(false); }}
            />

            <MobileBottomNav 
              favoritesCount={favorites.length} 
              onPanelOpen={() => setIsUserPanelOpen(true)} 
            />

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
                  <Route path="/blog/:slug" element={
                    isLoadingContent
                      ? <LoadingSpinner />
                      : <BlogPost lang={lang} posts={blogPosts} />
                  } />
                  <Route path="/proprietarios" element={<ForOwners lang={lang} />} />
                  <Route path="/favoritos" element={
                     isLoadingContent 
                     ? <LoadingSpinner />
                     : <Home lang={lang} favorites={favorites} toggleFavorite={toggleFavorite} showOnlyFavorites={true} restaurants={restaurants} heroSlides={heroSlides} />
                  } />
                  <Route path="/restaurantes" element={<RestaurantListing lang={lang} favorites={favorites} toggleFavorite={toggleFavorite} restaurants={restaurants} />} />
                  
                  {/* 404 catch-all */}
                  <Route path="*" element={
                    <div className="min-h-screen flex flex-col items-center justify-center gap-6 pt-32">
                      <div className="w-32 h-32 bg-primary/10 rounded-[3rem] flex items-center justify-center text-primary text-6xl font-display font-black" aria-hidden="true">404</div>
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
  );
}
