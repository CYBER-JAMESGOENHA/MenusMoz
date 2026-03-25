import { Link } from 'react-router-dom';
import { Sun, Moon, Globe, Heart, Bell, User } from 'lucide-react';
import { translations } from '../translations';
import NavbarSearch from './NavbarSearch';

const Navbar = ({ darkMode, toggleDarkMode, lang, setLang, favoritesCount, onLoginOpen, onPanelOpen, isScrolled, user }) => {
  const t = translations[lang].nav;

  return (
    <nav
      className={`fixed z-[1000] left-4 right-4 md:left-8 md:right-8 transition-all duration-700 ${isScrolled ? 'top-1 md:top-1.5' : 'top-2 md:top-2.5'}`}
      aria-label="Navegação principal"
    >
      <div className={`mx-auto max-w-7xl flex items-center justify-between transition-all duration-700 rounded-[2rem] px-5 sm:px-8 py-1 md:py-1.5 ${isScrolled ? 'glass shadow-premium' : 'bg-transparent'}`}>
        
        {/* Logo (Left side) */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-primary shrink-0 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-primary-glow group-hover:scale-110 transition-transform" aria-hidden="true">L</div>
            <div className="hidden lg:flex flex-col -gap-1">
                <span className="font-black text-2xl tracking-tighter text-text-main leading-none">Locais de Moz</span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Moçambique</span>
            </div>
            {/* Mobile Logo Text */}
            <div className="lg:hidden flex flex-col -gap-1">
                <span className="font-black text-xl tracking-tighter text-text-main leading-none">Locais de Moz</span>
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary">Moz</span>
            </div>
          </Link>
        </div>

        {/* Desktop Links (Central) */}
        <div className="hidden lg:flex items-center gap-10 font-black text-sm uppercase tracking-widest text-text-main/70">
          <Link to="/" className="hover:text-primary transition-colors focus:text-primary outline-none">Home</Link>
          <Link to="/blog" className="hover:text-primary transition-colors focus:text-primary outline-none">Sabor</Link>
          <Link to="/sobre" className="hover:text-primary transition-colors focus:text-primary outline-none">Sobre</Link>
          <Link to="/proprietarios" className="hover:text-primary transition-colors focus:text-primary outline-none">Negócios</Link>
          <NavbarSearch lang={lang} />
        </div>

        {/* Action Buttons (Right side) */}
        <div className="flex items-center gap-3">
          {/* Desktop Only Actions */}
          <div className="hidden sm:flex items-center gap-3">
             <button
              onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
              className="w-11 h-11 flex items-center justify-center rounded-2xl glass hover:bg-primary/10 transition-all text-text-main border-none"
              aria-label={lang === 'pt' ? 'Mudar para inglês' : 'Switch to Portuguese'}
            >
              <Globe size={18} aria-hidden="true" />
              <span className="ml-1 text-[10px] font-black uppercase">{lang}</span>
            </button>

            <Link
              to="/favoritos"
              className="relative w-11 h-11 flex items-center justify-center rounded-2xl glass hover:bg-primary/10 transition-all text-text-main border-none"
              aria-label={`Favoritos${favoritesCount > 0 ? ` (${favoritesCount})` : ''}`}
            >
              <Heart size={18} fill={favoritesCount > 0 ? "currentColor" : "none"} className={favoritesCount > 0 ? "text-primary" : ""} aria-hidden="true" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-primary-glow" aria-hidden="true">
                  {favoritesCount}
                </span>
              )}
            </Link>

            <button
              onClick={toggleDarkMode}
              className="w-11 h-11 flex items-center justify-center rounded-2xl glass hover:bg-primary/10 transition-all text-primary border-none"
              aria-label={darkMode ? 'Activar modo claro' : 'Activar modo escuro'}
            >
              {darkMode ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
            </button>
          </div>

          {/* Social Notification / Panel Toggle (Mobile & Desktop) */}
          <button
            onClick={onPanelOpen}
            className="w-11 h-11 flex items-center justify-center rounded-2xl glass hover:bg-primary/10 transition-all text-text-main border-none relative group"
            aria-label="Abrir painel de utilizador"
          >
            {user ? (
               <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-black text-xs shadow-primary-glow group-hover:scale-110 transition-transform">
                {user.email?.[0]?.toUpperCase() || <User size={16} />}
              </div>
            ) : (
              <Bell size={18} aria-hidden="true" className="group-hover:rotate-12 transition-transform" />
            )}
          </button>

          {/* Desktop Login Button */}
          {!user && (
            <button
              onClick={onLoginOpen}
              className="login-moz-btn hidden lg:flex scale-110 ml-4"
              aria-label="Abrir modal de login"
            >
              <span className="login-moz-lens" aria-hidden="true">🇲🇿</span>
              <span className="login-moz-label font-black uppercase text-[10px] tracking-widest">{t.login}</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
