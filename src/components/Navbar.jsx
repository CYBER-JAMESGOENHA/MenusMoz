import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';

const Navbar = ({ isScrolled, onPanelOpen }) => {
  return (
    <nav 
      className={`fixed z-[1000] left-4 right-4 md:left-8 md:right-8 transition-all duration-700 ${isScrolled ? 'top-1 md:top-1.5' : 'top-2 md:top-2.5'}`}
      aria-label="Navegação principal"
    >
      <div className={`mx-auto max-w-7xl flex items-center justify-between transition-all duration-700 rounded-[2rem] px-5 sm:px-8 py-1 md:py-1.5 ${isScrolled ? 'glass shadow-premium' : 'bg-transparent'}`}>

        {/* Logo → Home */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-primary shrink-0 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-primary-glow group-hover:scale-110 transition-transform" aria-hidden="true">L</div>
          <div className="hidden lg:flex flex-col -gap-1">
            <span className="font-black text-2xl tracking-tighter text-text-main leading-none">Locais de Moz</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Moçambique</span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-10 font-black text-sm uppercase tracking-widest text-text-main/70">
          <Link to="/" className="hover:text-primary transition-colors focus:text-primary outline-none">Home</Link>
          <Link to="/blog" className="hover:text-primary transition-colors focus:text-primary outline-none">Sabor</Link>
          <Link to="/sobre" className="hover:text-primary transition-colors focus:text-primary outline-none">Sobre</Link>
          <Link to="/proprietarios" className="hover:text-primary transition-colors focus:text-primary outline-none">Negócios</Link>
        </div>

        {/* Notifications button */}
        <button
          onClick={onPanelOpen}
          className="w-11 h-11 flex items-center justify-center rounded-2xl glass hover:bg-primary/10 transition-all text-text-main border-none relative group"
          aria-label="Abrir painel"
        >
          <Bell size={18} aria-hidden="true" className="group-hover:rotate-12 transition-transform" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
