import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, User, Plus, Bookmark } from 'lucide-react';
import { translations } from '../../translations';

interface MobileBottomNavProps {
    favoritesCount: number;
    onPanelOpen: () => void;
    lang: string;
}

export default function MobileBottomNav({ favoritesCount, onPanelOpen, lang }: MobileBottomNavProps) {
    const location = useLocation();
    const t = (translations[lang as keyof typeof translations] as any)?.nav_mobile ?? translations.pt.nav_mobile;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[1000] md:hidden px-4 pb-4 pt-2 pointer-events-none">
            {/* The main bar */}
            <div className="bg-surface/90 backdrop-blur-xl border border-border-subtle rounded-2xl shadow-premium flex items-center justify-center px-5 py-2.5 relative pointer-events-auto gap-4 pb-[calc(12px+env(safe-area-inset-bottom))]">
                
                {/* Home */}
                <NavLink 
                    to="/" 
                    className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive && location.pathname === '/' ? 'text-primary' : 'text-text-dim hover:text-text-main'}`}
                >
                    <Home size={22} strokeWidth={1.5} className={location.pathname === '/' ? 'fill-primary/20' : ''} />
                    <span className="text-[8px] font-black uppercase tracking-widest">{t.home}</span>
                </NavLink>

                {/* Bookmark (Favorites) */}
                <NavLink 
                    to="/favoritos" 
                    className={({ isActive }) => `flex flex-col items-center gap-1 relative transition-colors ${isActive ? 'text-primary' : 'text-text-dim hover:text-text-main'}`}
                >
                    <Bookmark size={22} strokeWidth={1.5} className={location.pathname === '/favoritos' ? 'fill-primary/20' : ''} />
                    {favoritesCount > 0 && (
                        <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black shadow-primary-glow">
                            {favoritesCount}
                        </span>
                    )}
                    <span className="text-[8px] font-black uppercase tracking-widest">{t.favorites}</span>
                </NavLink>

                {/* Center Floating + Button */}
                <NavLink 
                    to="/restaurantes"
                    className="absolute -top-5 left-1/2 -translate-x-1/2 w-14 h-14 bg-primary text-white rounded-full shadow-primary-glow flex items-center justify-center hover:scale-105 transition-all"
                >
                    <Plus size={26} strokeWidth={2} className="text-white" />
                </NavLink>

                {/* Cart */}
                <NavLink 
                    to="/cart" 
                    className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-text-dim hover:text-text-main'}`}
                >
                    <ShoppingCart size={22} strokeWidth={1.5} />
                    <span className="text-[8px] font-black uppercase tracking-widest">Carrinho</span>
                </NavLink>

                {/* Profile / Account */}
                <button 
                    onClick={onPanelOpen}
                    className="flex flex-col items-center gap-1 text-text-dim hover:text-text-main transition-colors focus:outline-none"
                >
                    <User size={22} strokeWidth={1.5} />
                    <span className="text-[8px] font-black uppercase tracking-widest">Perfil</span>
                </button>
            </div>
        </div>
    );
}
