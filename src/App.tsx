import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useAuth } from './context/AuthContext';
import { useFavorites } from './hooks/useFavorites';
import { useDarkMode } from './hooks/useDarkMode';
import { useContent } from './hooks/useContent';

import CustomCursor from './components/ui/CustomCursor';
import LoginModal from './components/ui/LoginModal';
import UserPanel from './components/layout/UserPanel';
import MobileBottomNav from './components/layout/MobileBottomNav';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import GlobalErrorBoundary from './components/ui/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import { ArrowLeft, Search, RotateCcw } from 'lucide-react';
import LoadingSpinner from './components/ui/LoadingSpinner';

const Home = lazy(() => import('./pages/Home'));
const RestaurantDetail = lazy(() => import('./pages/RestaurantDetail'));
const About = lazy(() => import('./pages/About'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const ForOwners = lazy(() => import('./pages/ForOwners'));
const RestaurantListing = lazy(() => import('./pages/RestaurantListing'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Profile = lazy(() => import('./pages/Profile'));

export default function App() {
  const { user, signOut } = useAuth();
  const [lang, setLang] = useState('pt');
  
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { favorites, toggleFavorite } = useFavorites(user);
  const { restaurants, heroSlides, blogPosts, isLoadingContent } = useContent(lang);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);

  const selectedLang = (lang === 'en' || lang === 'pt' ? lang : 'pt') as 'en' | 'pt';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <GlobalErrorBoundary lang={selectedLang}>
          <div className="min-h-screen relative bg-bg transition-colors duration-500 selection:bg-primary/20 selection:text-primary overflow-x-hidden">
            <Toaster 
                position="top-center" 
                reverseOrder={false}
                toastOptions={{
                    className: 'font-display italic uppercase tracking-tighter shadow-premium rounded-2xl border border-border-subtle bg-surface text-text-main',
                    duration: 4000,
                    style: {
                        borderRadius: '1.5rem',
                        background: 'var(--surface)',
                        color: 'var(--text-main)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.875rem',
                        fontWeight: '900'
                    }
                }}
            />
            <CustomCursor />
             
            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                  lang={selectedLang}
                  setLang={setLang}
                  favoritesCount={favorites.length}
                  onLoginOpen={() => setIsLoginOpen(true)}
                  isScrolled={isScrolled}
                  onPanelOpen={() => setIsUserPanelOpen(true)}
                  user={user}
                />
                
                <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} lang={selectedLang} />
                
                <UserPanel
                  isOpen={isUserPanelOpen}
                  onClose={() => setIsUserPanelOpen(false)}
                  lang={selectedLang}
                  setLang={setLang}
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                  favoritesCount={favorites.length}
                  user={user}
                  onLoginOpen={() => { setIsUserPanelOpen(false); setIsLoginOpen(true); }}
                  onLogout={() => { 
                    signOut();
                    setIsUserPanelOpen(false); 
                  }}
                />

                <MobileBottomNav 
                  favoritesCount={favorites.length} 
                  onPanelOpen={() => setIsUserPanelOpen(true)}
                  lang={selectedLang}
                />

                <main className="flex-grow">
                  <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                      <Route path="/" element={
                          <Home 
                            lang={selectedLang} 
                            favorites={favorites} 
                            toggleFavorite={toggleFavorite} 
                            restaurants={restaurants} 
                            heroSlides={heroSlides} 
                            blogPosts={blogPosts}
                            isLoading={isLoadingContent}
                          />
                      } />
                      <Route path="/restaurante/:slug" element={
                        <RestaurantDetail 
                            lang={selectedLang} 
                            favorites={favorites} 
                            toggleFavorite={toggleFavorite} 
                            showLogin={() => setIsLoginOpen(true)} 
                        />
                      } />
                      <Route path="/sobre" element={<About lang={selectedLang} />} />
                      <Route path="/blog" element={
                        isLoadingContent 
                          ? <LoadingSpinner /> 
                          : <Blog lang={selectedLang} posts={blogPosts} />
                      } />
                      <Route path="/blog/:slug" element={
                        isLoadingContent
                          ? <LoadingSpinner />
                          : <BlogPost lang={selectedLang} posts={blogPosts} />
                      } />
                      <Route path="/proprietarios" element={<ForOwners lang={selectedLang} />} />
                      <Route path="/favoritos" element={
                          <Home 
                            lang={selectedLang} 
                            favorites={favorites} 
                            toggleFavorite={toggleFavorite} 
                            showOnlyFavorites={true} 
                            restaurants={restaurants} 
                            heroSlides={heroSlides} 
                            isLoading={isLoadingContent}
                          />
                      } />
                      <Route path="/restaurantes" element={
                        <RestaurantListing 
                            lang={selectedLang} 
                            favorites={favorites} 
                            toggleFavorite={toggleFavorite} 
                            restaurants={restaurants} 
                        />
                      } />
                      <Route path="/privacidade" element={<Privacy lang={selectedLang} />} />
                      <Route path="/termos" element={<Terms lang={selectedLang} />} />
                      <Route path="/perfil" element={<Profile lang={selectedLang} />} />
                      
                      <Route path="*" element={
                        <div className="min-h-screen flex flex-col items-center justify-center gap-10 px-6 pt-32 text-center bg-bg relative overflow-hidden">
                          <div className="absolute inset-0 bg-primary/2 -z-10 pointer-events-none" />
                          <div className="relative">
                            <div className="w-40 h-40 bg-primary/10 rounded-[3.5rem] flex items-center justify-center text-primary text-7xl font-display font-black shadow-primary-glow/10 skew-x-[-10deg] animate-bounce">
                                <span className="skew-x-[10deg]">404</span>
                            </div>
                            <div className="absolute -top-4 -right-4 w-12 h-12 bg-moz-yellow rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                                <Search size={24} className="text-white" />
                            </div>
                          </div>
                          
                          <div className="max-w-md">
                            <h1 className="text-5xl md:text-6xl font-display font-black text-text-main tracking-tighter uppercase italic leading-none mb-6">Página Não Encontrada</h1>
                            <p className="text-text-dim/60 text-xl font-bold uppercase italic tracking-tight mb-10">O sabor que procura fugiu do nosso menu digital.</p>
                            
                            <Link to="/" className="group inline-flex items-center gap-4 bg-text-main text-surface px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] hover:bg-primary hover:text-white transition-all shadow-premium italic overflow-hidden relative">
                                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                                <RotateCcw size={20} className="group-hover:-rotate-180 transition-transform duration-500" />
                                <span>Voltar ao Início</span>
                            </Link>
                          </div>
                        </div>
                      } />
                    </Routes>
                  </Suspense>
                </main>

                <Footer lang={selectedLang} />
            </div>
          </div>
        </GlobalErrorBoundary>
      </Router>
    </HelmetProvider>
  );
}
