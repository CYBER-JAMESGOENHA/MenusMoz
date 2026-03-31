import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, User, Moon, Sun, Languages } from 'lucide-react';
import { translations } from '../../translations';

interface NavbarProps {
  isScrolled: boolean;
  onPanelOpen: () => void;
  user: any;
  onLoginOpen: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  lang: string;
  setLang: (lang: string) => void;
  favoritesCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ 
  isScrolled, 
  onPanelOpen, 
  user, 
  onLoginOpen, 
  darkMode, 
  toggleDarkMode, 
  lang, 
  setLang,
  favoritesCount 
}) => {
  const t = (translations[lang as keyof typeof translations] as any)?.nav ?? translations.pt.nav;

  return (
    <nav 
      className={`fixed z-[1000] left-4 right-4 md:left-8 md:right-8 transition-all duration-700 ${isScrolled ? 'top-1 md:top-1.5' : 'top-2 md:top-2.5'}`}
      aria-label="Navegação principal"
    >
      <div className={`mx-auto max-w-7xl flex items-center justify-between transition-all duration-700 rounded-[2rem] px-5 sm:px-8 py-1 md:py-1.5 ${isScrolled ? 'glass shadow-premium' : 'bg-transparent'}`}>

        {/* Logo → Home */}
        <Link to="/" className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl">
          <div className="w-12 h-12 bg-primary shrink-0 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-primary-glow group-hover:scale-110 transition-transform" aria-hidden="true">L</div>
          <div className="hidden lg:flex flex-col -gap-1">
            <span className="font-black text-2xl tracking-tighter text-text-main leading-none uppercase">Locais de Moz</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Moçambique</span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-10 font-black text-sm uppercase tracking-widest text-text-main/70">
          <Link to="/" className="hover:text-primary transition-colors px-2 py-1 rounded-lg outline-none">{t.home}</Link>
          <Link to="/blog" className="hover:text-primary transition-colors px-2 py-1 rounded-lg outline-none">{t.sabor}</Link>
          <Link to="/sobre" className="hover:text-primary transition-colors px-2 py-1 rounded-lg outline-none">{t.about}</Link>
          <Link to="/proprietarios" className="hover:text-primary transition-colors px-2 py-1 rounded-lg outline-none">{t.owners}</Link>
        </div>

        {/* Botões do Lado Direito */}
        <div className="flex items-center gap-2">
          {/* Quick Stats / Theme / Lang */}
          <div className="hidden md:flex items-center gap-1 mr-2 px-3 py-1.5 glass rounded-2xl border-none">
            <button onClick={toggleDarkMode} className="p-2 hover:bg-primary/5 rounded-xl transition-all" aria-label="Alterar tema">
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <div className="w-px h-4 bg-border-subtle mx-1" />
            <button 
                onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')} 
                className="flex items-center gap-1.5 p-2 hover:bg-primary/5 rounded-xl transition-all uppercase text-[10px] font-black"
            >
                <Languages size={16} />
                <span>{lang}</span>
            </button>
          </div>

          {user ? (
            <button
              onClick={onPanelOpen}
              className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-2xl bg-text-main text-bg hover:brightness-110 transition-all border-none relative group"
              aria-label="Perfil do utilizador"
            >
              <User size={18} aria-hidden="true" className="group-hover:scale-110 transition-transform" />
            </button>
          ) : (
            <div className="hidden md:block">
              <button
                onClick={onLoginOpen}
                className="login-moz-btn"
                aria-label="Entrar ou criar conta"
              >
                <div className="login-moz-lens" aria-hidden="true">🇲🇿</div>
                <span className="login-moz-label">{t.login}</span>
              </button>
            </div>
          )}

          {/* Notifications / Panel button */}
          <button
            onClick={onPanelOpen}
            className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-2xl glass hover:bg-primary/10 transition-all text-text-main border-none relative group"
            aria-label="Menu"
          >
            <Bell size={18} aria-hidden="true" className="group-hover:rotate-12 transition-transform" />
            {favoritesCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full animate-pulse shadow-primary-glow" />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
