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
      className={`fixed z-[1000] left-4 right-4 md:left-8 md:right-8 transition-all duration-700 ${isScrolled ? 'top-1.5 md:top-2' : 'top-3 md:top-4'} ${isRestaurantDetail ? 'hidden md:block' : ''}`}
      aria-label="Navegação principal"
    >
      <div 
        className={`mx-auto max-w-7xl flex items-center justify-between transition-all duration-500 rounded-2xl px-5 md:px-6 border border-white/5 dark:border-white/10 bg-surface/80 dark:bg-surface/60 backdrop-blur-xl ${
          isScrolled ? 'py-2 md:py-2.5 shadow-premium' : 'py-2.5 md:py-3 shadow-premium'
        }`}
        style={{
          minHeight: '72px',
          boxShadow: `0 10px 30px -12px var(--active-slide-glow), var(--shadow-premium)`,
          borderBottomColor: `var(--active-slide-border)`
        }}
      >

        {/* 1. Branding (Esquerda - Logo Premium) */}
        <Link to="/" className="flex items-center gap-2.5 group transition-all shrink-0">
          <div className="w-10 h-10 bg-primary shrink-0 rounded-xl flex items-center justify-center text-white font-black text-base group-hover:scale-105 transition-transform shadow-[0_0_20px_rgba(220,38,38,0.3)]" aria-hidden="true">L</div>
          <div className="flex flex-col leading-none">
            <span className="font-black text-[15px] tracking-tight text-text-main uppercase italic">Locais de Moz</span>
            <span className="text-[8px] font-black uppercase tracking-[0.18em] text-primary/70">Marketplace</span>
          </div>
        </Link>

        {/* 2. Barra de Busca (Centro - O maior foco) */}
        {(!isScrolled && location.pathname === '/') ? (
          <div className="flex-1" />
        ) : (
          <NavbarSearch lang={lang} />
        )}

        {/* 3. Controles (Direita - Transacional) */}
        <div className="flex items-center gap-2 md:gap-2.5">
          
          {/* Mobile Bell (visible only on mobile to match design) */}
          <button className="md:hidden w-11 h-11 flex items-center justify-center rounded-xl text-text-main hover:text-white transition-colors">
            <Bell size={20} className="text-white" />
          </button>

          {/* Pedidos / Histórico */}
          <Link 
            to="/perfil" 
            className="hidden md:flex w-11 h-11 items-center justify-center rounded-xl glass hover:bg-primary/5 hover:border-primary/20 transition-all text-text-main group hover:-translate-y-0.5"
            title="Meus Pedidos"
          >
            <History size={18} className="animate-history-hover transition-transform" />
          </Link>

          {/* Favoritos */}
          <button 
            onClick={onPanelOpen}
            className="hidden md:flex w-11 h-11 items-center justify-center rounded-xl glass hover:bg-primary/5 hover:border-primary/20 transition-all text-text-main relative group hover:-translate-y-0.5"
            title="Favoritos"
          >
            <Heart size={18} className={`${favoritesCount > 0 ? 'fill-primary text-primary' : ''} animate-heartbeat-hover transition-transform`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1.5 bg-moz-red text-white text-[9px] font-black rounded-full flex items-center justify-center animate-in zoom-in duration-300 shadow-premium shadow-[0_0_8px_rgba(206,17,38,0.4)] badge-glow-red">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Carrinho */}
          <Link
            to="/carrinho"
            className="hidden md:flex w-11 h-11 items-center justify-center rounded-xl bg-text-main text-bg hover:bg-primary hover:text-white transition-all relative group hover:-translate-y-0.5 hover:shadow-premium-sm"
            title="Carrinho"
          >
            <ShoppingCart size={18} className="animate-cart-hover transition-transform" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1.5 bg-moz-yellow text-text-main text-[9px] font-black rounded-full flex items-center justify-center shadow-premium shadow-[0_0_8px_rgba(252,227,0,0.4)] badge-glow-yellow">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Idioma (Language Switcher) */}
          <div className="hidden md:flex items-center gap-1 bg-surface/10 rounded-full p-1 border border-border-subtle/30 text-[10px] font-black select-none shrink-0 glass shadow-premium-sm">
            <button
              onClick={() => setLang('pt')}
              className={`px-3 py-1.5 rounded-full transition-all duration-300 uppercase italic ${lang === 'pt' ? 'bg-primary text-white shadow-premium-sm font-black' : 'text-text-dim/60 hover:text-text-main'}`}
              aria-label="Português"
            >
              PT
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1.5 rounded-full transition-all duration-300 uppercase italic ${lang === 'en' ? 'bg-primary text-white shadow-premium-sm font-black' : 'text-text-dim/60 hover:text-text-main'}`}
              aria-label="English"
            >
              EN
            </button>
          </div>

          <div className="w-px h-7 bg-border-subtle mx-1 hidden md:block" />

          {/* Perfil / Login */}
          {user ? (
            <button
              onClick={onPanelOpen}
              className="hidden md:flex w-11 h-11 flex items-center justify-center rounded-xl glass hover:bg-primary/10 hover:border-primary hover:-translate-y-0.5 transition-all text-text-main group overflow-hidden border-2 border-transparent"
              aria-label="Conta"
            >
              <User size={18} className="group-hover:scale-110 transition-transform" />
            </button>
          ) : (
            <button
              onClick={onLoginOpen}
              className="hidden md:flex w-11 h-11 flex items-center justify-center rounded-xl glass hover:bg-primary hover:text-white hover:-translate-y-0.5 transition-all text-text-main group"
              aria-label="Entrar"
            >
              <User size={18} className="group-hover:scale-110 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
