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
      className={`fixed z-[1000] left-0 right-0 top-0 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#0E0E10]/80 backdrop-blur-md border-b border-white/5 shadow-sm py-1' 
          : 'bg-transparent py-1.5 md:py-2'
      } ${isRestaurantDetail ? 'hidden md:block' : ''}`}
      aria-label="Navegação principal"
    >
      <div 
        className="mx-auto max-w-7xl flex items-center justify-between px-5 md:px-8"
        style={{
          minHeight: '44px',
        }}
      >

        {/* 1. Branding (Esquerda - Logo Premium) */}
        <Link to="/" className="flex items-center gap-2.5 group transition-all shrink-0">
          <div className="w-8 h-8 bg-primary shrink-0 rounded-xl flex items-center justify-center text-white font-black text-xs group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(220,38,38,0.25)]" aria-hidden="true">L</div>
          <div className="flex flex-col leading-none">
            <span className="font-black text-[13px] tracking-tight text-white uppercase italic">Locais de Moz</span>
            <span className="text-[7px] font-black uppercase tracking-[0.18em] text-primary/70">Marketplace</span>
          </div>
        </Link>

        {/* 2. Barra de Busca (Centro - O maior foco) */}
        {(!isScrolled && location.pathname === '/') ? (
          <>
            {/* Show search in navbar on desktop even when not scrolled */}
            <NavbarSearch lang={lang} />
            {/* Empty space for mobile when not scrolled */}
            <div className="lg:hidden flex-1" />
          </>
        ) : (
          <NavbarSearch lang={lang} />
        )}

        {/* 3. Controles (Direita - Transacional) */}
        <div className="flex items-center gap-2 md:gap-2.5">
          
          {/* Mobile Bell */}
          <button className="md:hidden w-[34px] h-[34px] flex items-center justify-center rounded-full bg-stone-900/60 hover:bg-stone-800/80 border border-white/5 text-white hover:text-white transition-colors">
            <Bell size={15} className="text-white" />
          </button>

          {/* Pedidos / Histórico */}
          <Link 
            to="/perfil" 
            className="hidden md:flex w-[34px] h-[34px] items-center justify-center rounded-full bg-stone-900/60 hover:bg-stone-800/80 border border-white/5 transition-all text-stone-200 hover:text-white group hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
            title="Meus Pedidos"
          >
            <History size={14} className="animate-history-hover transition-transform text-stone-200 group-hover:text-white" />
          </Link>

          {/* Favoritos */}
          <button 
            onClick={onPanelOpen}
            className="hidden md:flex w-[34px] h-[34px] items-center justify-center rounded-full bg-stone-900/60 hover:bg-stone-800/80 border border-white/5 transition-all text-stone-200 hover:text-white relative group hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
            title="Favoritos"
          >
            <Heart size={14} className={`${favoritesCount > 0 ? 'fill-primary text-primary' : 'text-stone-200 group-hover:text-white'} animate-heartbeat-hover transition-transform`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-1 bg-moz-red text-white text-[7.5px] font-black rounded-full flex items-center justify-center animate-in zoom-in duration-300 shadow-premium shadow-[0_0_8px_rgba(206,17,38,0.4)] badge-glow-red">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Carrinho */}
          <Link
            to="/carrinho"
            className="hidden md:flex w-[34px] h-[34px] items-center justify-center rounded-full bg-stone-900/60 text-stone-200 hover:bg-primary hover:text-white border border-white/5 transition-all relative group hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
            title="Carrinho"
          >
            <ShoppingCart size={14} className="animate-cart-hover transition-transform" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-1 bg-moz-yellow text-text-main text-[7.5px] font-black rounded-full flex items-center justify-center shadow-premium shadow-[0_0_8px_rgba(252,227,0,0.4)] badge-glow-yellow">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Idioma */}
          <div className="hidden md:flex items-center bg-stone-900/60 rounded-full p-0.5 border border-white/5 text-[8.5px] font-black select-none shrink-0 backdrop-blur-xl shadow-premium-sm">
            <button
              onClick={() => setLang('pt')}
              className={`px-2 py-0.5 rounded-full transition-all duration-300 uppercase italic cursor-pointer ${lang === 'pt' ? 'bg-primary text-white shadow-premium-sm font-black' : 'text-stone-400 hover:text-white'}`}
              aria-label="Português"
            >
              PT
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-0.5 rounded-full transition-all duration-300 uppercase italic cursor-pointer ${lang === 'en' ? 'bg-primary text-white shadow-premium-sm font-black' : 'text-stone-400 hover:text-white'}`}
              aria-label="English"
            >
              EN
            </button>
          </div>

          <div className="w-px h-5 bg-white/10 mx-0.5 hidden md:block" />

          {/* Perfil / Login */}
          {user ? (
            <button
              onClick={onPanelOpen}
              className="hidden md:flex w-[34px] h-[34px] flex items-center justify-center rounded-full bg-stone-900/60 hover:bg-stone-800/80 border border-white/5 hover:-translate-y-0.5 transition-all text-stone-200 hover:text-white group overflow-hidden"
              aria-label="Conta"
            >
              <User size={14} className="group-hover:scale-110 transition-transform" />
            </button>
          ) : (
            <button
              onClick={onLoginOpen}
              className="hidden md:flex w-[34px] h-[34px] flex items-center justify-center rounded-full bg-stone-900/60 hover:bg-stone-800/80 border border-white/5 hover:-translate-y-0.5 transition-all text-stone-200 hover:text-white group"
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
