import { Link } from 'react-router-dom';
import { Bell, User } from 'lucide-react';

const Navbar = ({ isScrolled, onPanelOpen, user, onLoginOpen }) => {
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
            <span className="font-black text-2xl tracking-tighter text-text-main leading-none">Locais de Moz</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Moçambique</span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-10 font-black text-sm uppercase tracking-widest text-text-main/70">
          <Link to="/" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:text-primary focus-visible:ring-2 focus-visible:ring-primary/50 px-2 py-1 rounded-lg outline-none">Home</Link>
          <Link to="/blog" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:text-primary focus-visible:ring-2 focus-visible:ring-primary/50 px-2 py-1 rounded-lg outline-none">Sabor</Link>
          <Link to="/sobre" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:text-primary focus-visible:ring-2 focus-visible:ring-primary/50 px-2 py-1 rounded-lg outline-none">Sobre</Link>
          <Link to="/proprietarios" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:text-primary focus-visible:ring-2 focus-visible:ring-primary/50 px-2 py-1 rounded-lg outline-none">Negócios</Link>
        </div>

        {/* Botões do Lado Direito */}
        <div className="flex items-center gap-2">
          {user ? (
            <button
              onClick={onPanelOpen}
              className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-2xl bg-text-main text-bg hover:brightness-110 transition-all border-none relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Perfil do utilizador"
            >
              <User size={18} aria-hidden="true" className="group-hover:scale-110 transition-transform" />
            </button>
          ) : (
            <div className="hidden md:block">
              <button
                onClick={onLoginOpen}
                className="login-moz-btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Entrar ou criar conta"
              >
                <div className="login-moz-lens" aria-hidden="true">🇲🇿</div>
                <span className="login-moz-label">Entrar</span>
              </button>
            </div>
          )}

          {/* Notifications button */}
          <button
            onClick={onPanelOpen}
            className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-2xl glass hover:bg-primary/10 transition-all text-text-main border-none relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Abrir painel de notificações"
          >
            <Bell size={18} aria-hidden="true" className="group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
