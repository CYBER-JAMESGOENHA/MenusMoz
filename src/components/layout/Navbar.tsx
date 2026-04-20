import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, ShoppingCart, History, User, Search, Bell } from 'lucide-react';
import { translations } from '../../translations';
import NavbarSearch from './NavbarSearch';

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
  const cartCount = 0;

  return (
    <nav 
      className={`fixed z-[1000] left-4 right-4 md:left-8 md:right-8 transition-all duration-700 ${isScrolled ? 'top-1 md:top-1.5' : 'top-2 md:top-2.5'} ${isRestaurantDetail ? 'hidden md:block' : ''}`}
      aria-label="Navegação principal"
    >
      <div className={`mx-auto max-w-7xl flex items-center justify-between transition-all duration-700 rounded-[2.5rem] px-4 md:px-6 py-2 ${isScrolled ? 'glass shadow-premium-lg' : 'bg-transparent'}`}>

        {/* 1. Branding (Esquerda - Comprimido) */}
        <Link to="/" className="flex items-center gap-2 group transition-all shrink-0">
          <div className="w-12 h-12 md:w-11 md:h-11 bg-primary shrink-0 rounded-[14px] md:rounded-2xl flex items-center justify-center text-white font-black text-xl md:shadow-primary-glow group-hover:scale-105 transition-transform" aria-hidden="true">L</div>
          <div className="hidden xl:flex flex-col leading-none">
            <span className="font-black text-lg tracking-tighter text-text-main uppercase">Locais Moz</span>
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary italic">Marketplace</span>
          </div>
        </Link>

        {/* 2. Barra de Busca (Centro - O maior foco) */}
        <NavbarSearch lang={lang} />

        {/* 3. Controles (Direita - Transacional) */}
        <div className="flex items-center gap-2 md:gap-3">
          
          {/* Mobile Bell (visible only on mobile to match design) */}
          <button className="md:hidden w-12 h-12 flex items-center justify-center rounded-[14px] text-text-main hover:text-white transition-colors">
            <Bell size={22} className="text-white" />
          </button>

          {/* Pedidos / Histórico */}
          <Link 
            to="/perfil" 
            className="hidden md:flex w-10 h-10 items-center justify-center rounded-2xl glass hover:bg-primary/5 transition-all text-text-main group"
            title="Meus Pedidos"
          >
            <History size={18} className="group-hover:rotate-[-10deg] transition-transform" />
          </Link>

          {/* Favoritos */}
          <button 
            onClick={onPanelOpen}
            className="hidden md:flex w-10 h-10 items-center justify-center rounded-2xl glass hover:bg-primary/5 transition-all text-text-main relative group"
            title="Favoritos"
          >
            <Heart size={18} className={favoritesCount > 0 ? 'fill-primary text-primary' : 'group-hover:scale-110 transition-transform'} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-primary-glow animate-in zoom-in duration-300">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Carrinho */}
          <button 
            className="hidden md:flex w-10 h-10 items-center justify-center rounded-2xl bg-text-main text-bg hover:bg-primary transition-all relative group"
            title="Carrinho"
          >
            <ShoppingCart size={18} className="group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-moz-yellow text-text-main text-[10px] font-black rounded-full flex items-center justify-center shadow-lg">
              {cartCount}
            </span>
          </button>

          <div className="w-px h-6 bg-border-subtle mx-1 hidden md:block" />

          {/* Perfil / Login */}
          {user ? (
            <button
              onClick={onPanelOpen}
              className="hidden md:flex w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-2xl glass hover:bg-primary/10 transition-all text-text-main group overflow-hidden border-2 border-transparent hover:border-primary"
              aria-label="Conta"
            >
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <User size={18} className="group-hover:scale-110 transition-transform" />
              )}
            </button>
          ) : (
            <button
              onClick={onLoginOpen}
              className="hidden md:flex w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-2xl glass hover:bg-primary text-text-main hover:text-white transition-all group"
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
