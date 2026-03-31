import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Heart, Search, User } from 'lucide-react';
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
            <div className="bg-surface/90 backdrop-blur-xl border border-border-subtle rounded-3xl shadow-premium flex items-center justify-between px-6 py-3 relative pointer-events-auto pb-[calc(12px+env(safe-area-inset-bottom))]">
                
                {/* Home */}
                <NavLink 
                    to="/" 
                    className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive && location.pathname === '/' ? 'text-primary' : 'text-text-dim hover:text-text-main'}`}
                >
                    <Home size={22} className={location.pathname === '/' ? 'fill-primary/20' : ''} />
                    <span className="text-[9px] font-black uppercase tracking-widest hidden sm:block">{t.home}</span>
                </NavLink>

                {/* Favorites */}
                <NavLink 
                    to="/favoritos" 
                    className={({ isActive }) => `flex flex-col items-center gap-1 relative transition-colors ${isActive ? 'text-primary' : 'text-text-dim hover:text-text-main'} mr-8`}
                >
                    <Heart size={22} className={location.pathname === '/favoritos' ? 'fill-primary/20' : ''} />
                    {favoritesCount > 0 && (
                        <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black shadow-primary-glow">
                            {favoritesCount}
                        </span>
                    )}
                    <span className="text-[9px] font-black uppercase tracking-widest hidden sm:block">{t.favorites}</span>
                </NavLink>

                {/* Center Floating Search Button */}
                <NavLink 
                    to="/restaurantes"
                    className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-primary text-white rounded-[2rem] flex items-center justify-center shadow-primary-glow border-[6px] border-bg hover:scale-105 hover:-translate-y-1 transition-all duration-300 ring-4 ring-transparent hover:ring-primary/20"
                >
                    <Search size={26} className="text-white" />
                </NavLink>

                {/* Profile / Account */}
                <button 
                    onClick={onPanelOpen}
                    className="flex flex-col items-center gap-1 text-text-dim hover:text-text-main transition-colors mr-2 focus:outline-none"
                >
                    <User size={22} />
                    <span className="text-[9px] font-black uppercase tracking-widest hidden sm:block">{t.profile}</span>
                </button>
            </div>
        </div>
    );
}
