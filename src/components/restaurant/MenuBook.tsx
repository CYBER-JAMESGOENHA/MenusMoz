import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { OrnamentalDivider } from './DetailShared';

interface MenuItem {
    name: string;
    price: string;
    desc: string;
}

interface MenuCategory {
    name: string;
    items?: MenuItem[];
}

interface MenuBookProps {
    menuCategories: MenuCategory[];
    activePage: number;
    onPageChange: (index: number) => void;
}

interface MenuTabsProps {
    menuCategories: MenuCategory[];
    activePage: number;
    onPageChange: (index: number) => void;
}

export const MenuTabs: React.FC<MenuTabsProps> = ({ menuCategories, activePage, onPageChange }) => {
    return (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-6">
            {menuCategories.map((category, idx) => (
                <button
                    key={idx}
                    onClick={() => onPageChange(idx)}
                    className={`px-5 py-2.5 rounded-xl font-black text-sm tracking-widest transition-all whitespace-nowrap border-b-2 duration-300 font-display uppercase ${activePage === idx
                        ? 'bg-primary text-white border-primary shadow-md shadow-primary/20 scale-105'
                        : 'bg-surface/60 text-text-dim border-border-subtle hover:bg-primary/5 hover:text-primary hover:border-primary/30'
                        }`}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
};

export const MenuBook: React.FC<MenuBookProps> = ({ menuCategories, activePage, onPageChange }) => {
    const [isFlipping, setIsFlipping] = useState(false);
    const pageRef = useRef<HTMLDivElement>(null);

    const flipPage = (newPage: number) => {
        if (isFlipping || newPage === activePage || newPage < 0 || newPage >= menuCategories.length) return;
        setIsFlipping(true);
        gsap.to(pageRef.current, {
            rotateY: newPage > activePage ? -25 : 25,
            x: newPage > activePage ? -30 : 30,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                onPageChange(newPage);
                gsap.fromTo(
                    pageRef.current,
                    { rotateY: newPage > activePage ? 25 : -25, x: newPage > activePage ? 30 : -30, opacity: 0 },
                    { rotateY: 0, x: 0, opacity: 1, duration: 0.45, ease: 'power3.out', onComplete: () => setIsFlipping(false) }
                );
            }
        });
    };

    const currentCategory = menuCategories[activePage];

    return (
        <div className="flex flex-col h-full">
            {/* Book */}
            <div className="menu-book paper-texture [perspective:2000px] border border-border-subtle overflow-hidden flex-1">
                <style>{`
                    .menu-book {
                        background: var(--bg);
                        box-shadow: var(--shadow-premium);
                        border-radius: 2rem;
                        min-height: 400px;
                        display: flex;
                        flex-direction: column;
                    }
                    .paper-texture {
                        background-image: url("https://www.transparenttextures.com/patterns/natural-paper.png");
                    }
                `}</style>
                <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-b from-black/5 to-transparent pointer-events-none z-20" />
                <div className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-t from-black/5 to-transparent pointer-events-none z-20" />

                <div ref={pageRef} className="flex-1 p-6 md:p-10 relative z-10 [transform-style:preserve-3d] will-change-[transform,opacity]">
                    <div className="text-center mb-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-primary/60 mb-2 ml-1">Locais de Moz — Menu Digital</p>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-text-main leading-none font-display italic uppercase">
                            {currentCategory?.name || 'Menu'}
                        </h2>
                        <OrnamentalDivider />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        {currentCategory?.items?.map((item: MenuItem, i: number) => (
                            <div key={i} className="group">
                                <div className="flex justify-between items-baseline gap-3 mb-1.5">
                                    <h4 className="text-lg md:text-xl font-black text-text-main group-hover:text-primary transition-colors duration-300 font-display italic uppercase">
                                        {item.name}
                                    </h4>
                                    <div className="flex-1 border-b border-dotted border-text-dim/20 mx-1.5 mb-1 min-w-[5px]" />
                                    <span className="font-black text-lg text-primary shrink-0 font-mono italic tracking-tighter">{item.price}</span>
                                </div>
                                <p className="text-text-dim/80 leading-relaxed text-[13px] md:text-sm pl-0.5 font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 pt-8 border-t border-border-subtle flex justify-between items-center">
                        <button
                            onClick={() => activePage > 0 && flipPage(activePage - 1)}
                            disabled={activePage === 0 || isFlipping}
                            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-primary transition-colors duration-200 ${activePage === 0 ? 'opacity-0 pointer-events-none' : ''}`}
                        >
                            <ChevronLeft size={16} /> Voltar
                        </button>
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase px-4 py-1.5 rounded-full bg-primary/10 text-primary">
                            {activePage + 1} / {menuCategories.length}
                        </span>
                        <button
                            onClick={() => activePage < menuCategories.length - 1 && flipPage(activePage + 1)}
                            disabled={activePage === menuCategories.length - 1 || isFlipping}
                            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-primary transition-colors duration-200 ${activePage === menuCategories.length - 1 ? 'opacity-0 pointer-events-none' : ''}`}
                        >
                            Ver Próxima <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
