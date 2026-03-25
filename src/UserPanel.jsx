import { useEffect, useRef } from 'react';
import { X, Heart, Globe, Moon, Sun, LogIn, LogOut, User, ChevronRight, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

export default function UserPanel({ isOpen, onClose, lang, setLang, darkMode, toggleDarkMode, favoritesCount, user, onLoginOpen, onLogout }) {
    const overlayRef = useRef(null);
    const panelRef = useRef(null);

    const t = lang === 'pt' ? {
        title: 'O Meu Espaço',
        subtitle: 'Configurações e perfil',
        profile: 'Perfil',
        guest: 'Visitante',
        guest_sub: 'Entra para guardar os teus favoritos',
        login: 'Entrar / Criar Conta',
        logout: 'Sair da Conta',
        favorites: 'Os Meus Favoritos',
        favorites_sub: item => `${item} ${item === 1 ? 'restaurante guardado' : 'restaurantes guardados'}`,
        language: 'Idioma',
        lang_pt: 'Português',
        lang_en: 'English',
        appearance: 'Aparência',
        dark: 'Modo Escuro',
        light: 'Modo Claro',
        settings: 'Definições',
        view_all_favs: 'Ver todos',
    } : {
        title: 'My Space',
        subtitle: 'Settings & profile',
        profile: 'Profile',
        guest: 'Guest',
        guest_sub: 'Sign in to save your favourites',
        login: 'Sign In / Create Account',
        logout: 'Sign Out',
        favorites: 'My Favourites',
        favorites_sub: item => `${item} saved ${item === 1 ? 'restaurant' : 'restaurants'}`,
        language: 'Language',
        lang_pt: 'Português',
        lang_en: 'English',
        appearance: 'Appearance',
        dark: 'Dark Mode',
        light: 'Light Mode',
        settings: 'Settings',
        view_all_favs: 'View all',
    };

    const handleClose = () => {
        gsap.to(panelRef.current, { x: '100%', duration: 0.35, ease: 'power3.in' });
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, onComplete: onClose });
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
            gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
            gsap.fromTo(panelRef.current, { x: '100%' }, { x: '0%', duration: 0.45, ease: 'power3.out' });
        } else {
            document.body.style.overflow = 'auto';
            window.removeEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[3000]">
            {/* Backdrop */}
            <div
                ref={overlayRef}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Panel */}
            <div
                ref={panelRef}
                className="absolute top-0 right-0 h-full w-full max-w-sm bg-surface border-l border-white/10 shadow-premium flex flex-col overflow-hidden"
                style={{ transform: 'translateX(100%)' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-8 pb-6 border-b border-border-subtle">
                    <div>
                        <h2 className="text-xl font-black tracking-tighter text-text-main">{t.title}</h2>
                        <p className="text-xs font-bold text-text-dim/50 uppercase tracking-widest mt-0.5">{t.subtitle}</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-10 h-10 rounded-2xl glass flex items-center justify-center hover:bg-primary/10 transition-all text-text-main"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-5 space-y-4">

                    {/* User / Login card */}
                    <div className="rounded-2xl bg-primary/5 border border-primary/10 p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <User size={22} />
                            </div>
                            <div>
                                <p className="font-black text-sm text-text-main">
                                    {user ? (user.email?.split('@')[0] || t.profile) : t.guest}
                                </p>
                                <p className="text-xs text-text-dim/60 font-medium">
                                    {user ? user.email : t.guest_sub}
                                </p>
                            </div>
                        </div>
                        {user ? (
                            <button
                                onClick={() => { onLogout(); handleClose(); }}
                                className="w-full h-10 rounded-xl glass flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-text-dim hover:text-red-500 hover:bg-red-500/10 transition-all"
                            >
                                <LogOut size={15} />
                                {t.logout}
                            </button>
                        ) : (
                            <button
                                onClick={() => { onLoginOpen(); handleClose(); }}
                                className="w-full h-10 rounded-xl bg-primary text-white flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-primary-glow"
                            >
                                <LogIn size={15} />
                                {t.login}
                            </button>
                        )}
                    </div>

                    {/* Favourites */}
                    <div className="rounded-2xl glass border border-border-subtle p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Heart size={16} className="text-primary" fill={favoritesCount > 0 ? 'currentColor' : 'none'} />
                                <span className="text-xs font-black uppercase tracking-widest text-text-main">{t.favorites}</span>
                            </div>
                            {favoritesCount > 0 && (
                                <Link
                                    to="/favoritos"
                                    onClick={handleClose}
                                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-1"
                                >
                                    {t.view_all_favs} <ChevronRight size={12} />
                                </Link>
                            )}
                        </div>
                        <p className="text-sm font-bold text-text-dim">
                            {t.favorites_sub(favoritesCount)}
                        </p>
                        {favoritesCount === 0 && (
                            <Link
                                to="/restaurantes"
                                onClick={handleClose}
                                className="mt-3 w-full h-9 rounded-xl glass flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-primary transition-all"
                            >
                                Explorar restaurantes <ChevronRight size={12} />
                            </Link>
                        )}
                    </div>

                    {/* Language */}
                    <div className="rounded-2xl glass border border-border-subtle p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Globe size={16} className="text-primary" />
                            <span className="text-xs font-black uppercase tracking-widest text-text-main">{t.language}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {['pt', 'en'].map(l => (
                                <button
                                    key={l}
                                    onClick={() => setLang(l)}
                                    className={`h-10 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                        lang === l
                                            ? 'bg-primary text-white shadow-primary-glow'
                                            : 'glass text-text-dim hover:text-text-main'
                                    }`}
                                >
                                    {l === 'pt' ? t.lang_pt : t.lang_en}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Appearance */}
                    <div className="rounded-2xl glass border border-border-subtle p-4">
                        <div className="flex items-center gap-2 mb-3">
                            {darkMode ? <Moon size={16} className="text-primary" /> : <Sun size={16} className="text-primary" />}
                            <span className="text-xs font-black uppercase tracking-widest text-text-main">{t.appearance}</span>
                        </div>
                        <button
                            onClick={toggleDarkMode}
                            className="w-full h-10 rounded-xl glass flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-text-dim hover:text-primary transition-all"
                        >
                            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
                            {darkMode ? t.light : t.dark}
                        </button>
                    </div>

                </div>

                {/* Footer */}
                <div className="px-6 pb-8 pt-4 border-t border-border-subtle">
                    <p className="text-center text-[10px] font-black uppercase tracking-widest text-text-dim/30">
                        Locais de Moz © {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </div>
    );
}
