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

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[1000] md:hidden px-4 pb-4 pt-2 pointer-events-none">
            {/* The main bar */}
            <div className="bg-surface/90 backdrop-blur-xl border border-border-subtle rounded-2xl shadow-premium flex items-center justify-between px-2 py-2.5 relative pointer-events-auto pb-[calc(12px+env(safe-area-inset-bottom))]">
                
                {/* Home */}
                <NavLink 
                    to="/" 
                    className={({ isActive }) => `flex flex-col items-center gap-1 flex-1 transition-colors ${isActive ? 'text-primary' : 'text-text-dim/60 hover:text-text-main'}`}
                >
                    {isActive('/') && <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />}
                    <Home size={24} strokeWidth={1.5} />
                    <span className="text-[12px] font-black uppercase tracking-widest">Início</span>
                </NavLink>

                {/* Bookmark (Favorites) */}
                <NavLink 
                    to="/favoritos" 
                    className={({ isActive }) => `flex flex-col items-center gap-1 relative flex-1 transition-colors ${isActive ? 'text-primary' : 'text-text-dim/60 hover:text-text-main'}`}
                >
                    {isActive('/favoritos') && <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />}
                    <Bookmark size={24} strokeWidth={1.5} />
                    {favoritesCount > 0 && (
                        <span className="absolute top-0 right-1/4 translate-x-2 bg-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black shadow-primary-glow">
                            {favoritesCount}
                        </span>
                    )}
                    <span className="text-[12px] font-black uppercase tracking-widest">Favoritos</span>
                </NavLink>

                {/* Center Floating + Button */}
                <div className="relative flex-1 flex justify-center">
                    {/* Outer ring */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-[72px] h-[72px] border-2 border-dashed border-primary/30 bg-transparent rounded-full flex items-center justify-center">
                        {/* Inner button */}
                        <NavLink 
                            to="/restaurantes"
                            className="w-[52px] h-[52px] bg-primary text-white rounded-full shadow-primary-glow flex items-center justify-center hover:scale-105 transition-all"
                        >
                            <Plus size={28} strokeWidth={2} className="text-white" />
                        </NavLink>
                    </div>
                </div>

                {/* Cart */}
                <NavLink 
                    to="/cart" 
                    className={({ isActive }) => `flex flex-col items-center gap-1 flex-1 transition-colors ${isActive ? 'text-primary' : 'text-text-dim/60 hover:text-text-main'}`}
                >
                    {isActive('/cart') && <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />}
                    <ShoppingCart size={24} strokeWidth={1.5} />
                    <span className="text-[12px] font-black uppercase tracking-widest">Carrinho</span>
                </NavLink>

                {/* Profile / Account */}
                <button 
                    onClick={onPanelOpen}
                    className="flex flex-col items-center gap-1 flex-1 text-text-dim/60 hover:text-text-main transition-colors focus:outline-none"
                >
                    <User size={24} strokeWidth={1.5} />
                    <span className="text-[12px] font-black uppercase tracking-widest">Perfil</span>
                </button>
            </div>
        </div>
    );
}
