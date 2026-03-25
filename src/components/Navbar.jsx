import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Globe, Heart, Menu, X, Bell, User } from 'lucide-react';
import { translations } from '../translations';
import NavbarSearch from './NavbarSearch';

const Navbar = ({ darkMode, toggleDarkMode, lang, setLang, favoritesCount, onLoginOpen, onPanelOpen, isScrolled, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = translations[lang].nav;

  return (
    <nav
      className={`fixed z-[1000] left-4 right-4 md:left-8 md:right-8 transition-all duration-700 ${isScrolled || isMenuOpen ? 'top-1 md:top-1.5' : 'top-2 md:top-2.5'}`}
      aria-label="Navegação principal"
    >
      <div className={`mx-auto max-w-7xl flex items-center justify-between transition-all duration-700 rounded-[2rem] px-5 sm:px-8 py-1 md:py-1.5 ${isScrolled || isMenuOpen ? 'glass shadow-premium' : 'bg-transparent'}`}>
        <div className="flex items-center gap-4 z-[1001]">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-12 h-12 flex items-center justify-center rounded-2xl bg-primary text-white shadow-primary-glow"
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>

          <Link to="/" className="hidden lg:flex items-center gap-3 group" onClick={() => setIsMenuOpen(false)}>
            <div className="w-12 h-12 bg-primary shrink-0 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-primary-glow group-hover:scale-110 transition-transform" aria-hidden="true">L</div>
            <div className="hidden lg:flex flex-col -gap-1">
                <span className="font-black text-2xl tracking-tighter text-text-main leading-none">Locais de Moz</span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Moçambique</span>
            </div>
          </Link>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:hidden font-display italic font-black text-2xl tracking-tighter text-text-main z-[1000] pointer-events-none" aria-hidden="true">
          Locais de Moz
        </div>

        <div className="hidden lg:flex items-center gap-10 font-black text-sm uppercase tracking-widest text-text-main/70">
          <Link to="/" className="hover:text-primary transition-colors focus:text-primary outline-none">Home</Link>
          <Link to="/blog" className="hover:text-primary transition-colors focus:text-primary outline-none">Sabor</Link>
          <Link to="/sobre" className="hover:text-primary transition-colors focus:text-primary outline-none">Sobre</Link>
          <Link to="/proprietarios" className="hover:text-primary transition-colors focus:text-primary outline-none">Negócios</Link>
          <NavbarSearch lang={lang} />
        </div>

        <div className="flex items-center gap-3">
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

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 bg-surface/98 backdrop-blur-3xl z-[900] transition-all duration-700 lg:hidden ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        aria-hidden={!isMenuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
      >
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
              aria-label={lang === 'pt' ? 'Mudar para inglês' : 'Switch to Portuguese'}
            >
              <Globe size={24} aria-hidden="true" />
            </button>
            <button
              onClick={() => { toggleDarkMode(); setIsMenuOpen(false); }}
              className="w-14 h-14 rounded-2xl glass font-black text-primary flex items-center justify-center border-none shadow-premium"
              aria-label={darkMode ? 'Activar modo claro' : 'Activar modo escuro'}
            >
              {darkMode ? <Sun size={24} aria-hidden="true" /> : <Moon size={24} aria-hidden="true" />}
            </button>
          </div>

          {!user && (
            <button
              onClick={() => { onLoginOpen(); setIsMenuOpen(false); }}
              className="login-moz-btn w-full max-w-xs mt-2"
              aria-label="Abrir modal de login"
              style={{
                opacity: isMenuOpen ? 1 : 0,
                transform: isMenuOpen ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.5s ease',
                transitionDelay: isMenuOpen ? '560ms' : '0ms'
              }}
            >
              <span className="login-moz-lens" aria-hidden="true">🇲🇿</span>
              <span className="login-moz-label font-black uppercase text-xs tracking-[0.2em]">{t.login}</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
