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
      <div className={`mx-auto max-w-7xl flex items-center justify-between transition-all duration-700 rounded-2xl px-4 md:px-5 py-0.5 ${isScrolled ? 'glass shadow-premium' : 'bg-transparent'}`}>

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
            className="hidden md:flex w-7.5 h-7.5 items-center justify-center rounded-lg glass hover:bg-primary/5 transition-all text-text-main group"
            title="Meus Pedidos"
          >
            <History size={14} className="group-hover:rotate-[-10deg] transition-transform" />
          </Link>

          {/* Favoritos */}
          <button 
            onClick={onPanelOpen}
            className="hidden md:flex w-7.5 h-7.5 items-center justify-center rounded-lg glass hover:bg-primary/5 transition-all text-text-main relative group"
            title="Favoritos"
          >
            <Heart size={14} className={favoritesCount > 0 ? 'fill-primary text-primary' : 'group-hover:scale-110 transition-transform'} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-1 bg-primary text-white text-[8px] font-bold rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Carrinho */}
          <Link
            to="/carrinho"
            className="hidden md:flex w-7.5 h-7.5 items-center justify-center rounded-lg bg-text-main text-bg hover:bg-primary transition-all relative group"
            title="Carrinho"
          >
            <ShoppingCart size={14} className="group-hover:scale-110 transition-transform" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-1 bg-moz-yellow text-text-main text-[8px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          <div className="w-px h-6 bg-border-subtle mx-1 hidden md:block" />

          {/* Perfil / Login */}
          {user ? (
            <button
              onClick={onPanelOpen}
              className="hidden md:flex w-7.5 h-7.5 flex items-center justify-center rounded-lg glass hover:bg-primary/10 transition-all text-text-main group overflow-hidden border-2 border-transparent hover:border-primary"
              aria-label="Conta"
            >
              <User size={14} className="group-hover:scale-110 transition-transform" />
            </button>
          ) : (
            <button
              onClick={onLoginOpen}
              className="hidden md:flex w-7.5 h-7.5 flex items-center justify-center rounded-lg glass hover:bg-primary text-text-main hover:text-white transition-all group"
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
