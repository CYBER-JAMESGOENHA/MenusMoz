import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, ShoppingCart, History, User, Bell } from 'lucide-react';
import { translations } from '../../translations';
import NavbarSearch from './NavbarSearch';
import { useCart } from '../../context/CartContext';

interface NavbarProps {
  isScrolled: boolean;
  onPanelOpen: () => void;
  user: any;
  onLoginOpen: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  lang: 'pt' | 'en';
  setLang: (lang: string) => void;
  favoritesCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ 
  isScrolled, 
  onPanelOpen, 
  user, 
  onLoginOpen, 
  lang,
  setLang,
  favoritesCount 
}) => {
  const location = useLocation();
  const isRestaurantDetail = location.pathname.startsWith('/restaurant/');
  const t = (translations[lang as keyof typeof translations] as any)?.nav ?? translations.pt.nav;
  const { totalItems } = useCart();

  return (
    <nav 
      className={`fixed z-[1000] left-4 right-4 md:left-8 md:right-8 transition-all duration-700 ${isScrolled ? 'top-1 md:top-1.5' : 'top-2 md:top-2.5'} ${isRestaurantDetail ? 'hidden md:block' : ''}`}
      aria-label="Navegação principal"
    >
      <div 
        className={`mx-auto max-w-7xl flex items-center justify-between transition-all duration-500 rounded-2xl px-4 md:px-5 border border-white/5 dark:border-white/10 bg-surface/80 dark:bg-surface/60 backdrop-blur-xl ${
          isScrolled ? 'py-0.5 shadow-premium' : 'py-1.5 shadow-premium'
        }`}
        style={{
          boxShadow: `0 10px 30px -12px var(--active-slide-glow), var(--shadow-premium)`,
          borderBottomColor: `var(--active-slide-border)`
        }}
      >

        {/* 1. Branding (Esquerda - Comprimido) */}
        <Link to="/" className="flex items-center gap-1 group transition-all shrink-0">
          <div className="w-7.5 h-7.5 bg-primary shrink-0 rounded-lg flex items-center justify-center text-white font-bold text-[13px] group-hover:scale-105 transition-transform" aria-hidden="true">L</div>
          <div className="hidden xl:flex flex-col leading-none">
            <span className="font-bold text-[12px] tracking-tight text-text-main">Locais de Moz</span>
            <span className="text-[5.5px] font-bold uppercase tracking-[0.12em] text-primary">Marketplace</span>
          </div>
        </Link>

        {/* 2. Barra de Busca (Centro - O maior foco) */}
        {(!isScrolled && location.pathname === '/') ? (
          <div className="flex-1" />
        ) : (
          <NavbarSearch lang={lang} />
        )}

        {/* 3. Controles (Direita - Transacional) */}
        <div className="flex items-center gap-1.5 md:gap-2">
          
          {/* Mobile Bell (visible only on mobile to match design) */}
          <button className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-text-main hover:text-white transition-colors">
            <Bell size={18} className="text-white" />
          </button>

          {/* Pedidos / Histórico */}
          <Link 
            to="/perfil" 
            className="hidden md:flex w-7.5 h-7.5 items-center justify-center rounded-lg glass hover:bg-primary/5 hover:border-primary/20 transition-all text-text-main group hover:-translate-y-0.5"
            title="Meus Pedidos"
          >
            <History size={14} className="animate-history-hover transition-transform" />
          </Link>

          {/* Favoritos */}
          <button 
            onClick={onPanelOpen}
            className="hidden md:flex w-7.5 h-7.5 items-center justify-center rounded-lg glass hover:bg-primary/5 hover:border-primary/20 transition-all text-text-main relative group hover:-translate-y-0.5"
            title="Favoritos"
          >
            <Heart size={14} className={`${favoritesCount > 0 ? 'fill-primary text-primary' : ''} animate-heartbeat-hover transition-transform`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[15px] h-[15px] px-1 bg-moz-red text-white text-[8px] font-black rounded-full flex items-center justify-center animate-in zoom-in duration-300 shadow-premium shadow-[0_0_8px_rgba(206,17,38,0.4)] badge-glow-red">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Carrinho */}
          <Link
            to="/carrinho"
            className="hidden md:flex w-7.5 h-7.5 items-center justify-center rounded-lg bg-text-main text-bg hover:bg-primary hover:text-white transition-all relative group hover:-translate-y-0.5 hover:shadow-premium-sm"
            title="Carrinho"
          >
            <ShoppingCart size={14} className="animate-cart-hover transition-transform" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[15px] h-[15px] px-1 bg-moz-yellow text-text-main text-[8px] font-black rounded-full flex items-center justify-center shadow-premium shadow-[0_0_8px_rgba(252,227,0,0.4)] badge-glow-yellow">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Idioma (Language Switcher) */}
          <div className="hidden md:flex items-center gap-0.5 bg-surface/10 rounded-full p-0.5 border border-border-subtle/30 text-[9px] font-black select-none shrink-0 glass shadow-premium-sm mx-1">
            <button
              onClick={() => setLang('pt')}
              className={`px-2 py-0.5 rounded-full transition-all duration-300 uppercase italic ${lang === 'pt' ? 'bg-primary text-white shadow-premium-sm font-black' : 'text-text-dim/60 hover:text-text-main'}`}
              aria-label="Português"
            >
              PT
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-0.5 rounded-full transition-all duration-300 uppercase italic ${lang === 'en' ? 'bg-primary text-white shadow-premium-sm font-black' : 'text-text-dim/60 hover:text-text-main'}`}
              aria-label="English"
            >
              EN
            </button>
          </div>

          <div className="w-px h-6 bg-border-subtle mx-1 hidden md:block" />

          {/* Perfil / Login */}
          {user ? (
            <button
              onClick={onPanelOpen}
              className="hidden md:flex w-7.5 h-7.5 flex items-center justify-center rounded-lg glass hover:bg-primary/10 hover:border-primary hover:-translate-y-0.5 transition-all text-text-main group overflow-hidden border-2 border-transparent"
              aria-label="Conta"
            >
              <User size={14} className="group-hover:scale-110 transition-transform" />
            </button>
          ) : (
            <button
              onClick={onLoginOpen}
              className="hidden md:flex w-7.5 h-7.5 flex items-center justify-center rounded-lg glass hover:bg-primary hover:text-white hover:-translate-y-0.5 transition-all text-text-main group"
              aria-label="Entrar"
            >
              <User size={14} className="group-hover:scale-110 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
