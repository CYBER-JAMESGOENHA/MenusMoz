import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { OrnamentalDivider } from './DetailShared';

export const MenuBook = ({ menuCategories }) => {
    const [activePage, setActivePage] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);
    const pageRef = useRef(null);
    const tabsRef = useRef(null);

    const flipPage = (newPage) => {
        if (isFlipping || newPage === activePage) return;
        setIsFlipping(true);
        gsap.to(pageRef.current, {
            rotateY: newPage > activePage ? -25 : 25,
            x: newPage > activePage ? -30 : 30,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                setActivePage(newPage);
                gsap.fromTo(
                    pageRef.current,
                    { rotateY: newPage > activePage ? 25 : -25, x: newPage > activePage ? 30 : -30, opacity: 0 },
                    { rotateY: 0, x: 0, opacity: 1, duration: 0.45, ease: 'power3.out', onComplete: () => setIsFlipping(false) }
                );
            }
        });
        if (tabsRef.current) {
            const buttons = tabsRef.current.querySelectorAll('button');
            if (buttons[newPage]) buttons[newPage].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    };

    const triggerHaptic = () => { if (navigator.vibrate) navigator.vibrate(20); };
    const currentCategory = menuCategories[activePage];

    return (
        <div className="lg:col-span-2 space-y-6">
            {/* Tab row */}
            <div ref={tabsRef} className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {menuCategories.map((category, idx) => (
                    <button
                        key={idx}
                        onClick={() => { flipPage(idx); triggerHaptic(); }}
                        className={`px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all whitespace-nowrap border-b-2 duration-300 ${activePage === idx
                            ? 'bg-primary text-white border-primary shadow-md shadow-primary/20 scale-105'
                            : 'bg-surface/60 text-text-dim border-border-subtle hover:bg-primary/5 hover:text-primary hover:border-primary/30'
                            }`}
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            {/* Book */}
            <div className="menu-book paper-texture" style={{ perspective: '2000px' }}>
                <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-b from-black/10 to-transparent pointer-events-none z-20" />
                <div className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-t from-black/8 to-transparent pointer-events-none z-20" />

                <div ref={pageRef} className="flex-1 p-8 md:p-14 relative z-10" style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}>
                    <div className="text-center mb-10">
                        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary/60 mb-3">Locais de Moz — Seleção</p>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight text-text-main leading-none" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
                            {currentCategory?.name || 'Menu'}
                        </h2>
                        <OrnamentalDivider />
                    </div>

                    <div className="space-y-10">
                        {currentCategory?.items?.map((item, i) => (
                            <div key={i} className="group">
                                <div className="flex justify-between items-baseline gap-4 mb-1.5">
                                    <h4 className="text-xl md:text-2xl font-semibold text-text-main group-hover:text-primary transition-colors duration-300" style={{ fontFamily: "'Playfair Display', serif" }}>
                                        {item.name}
                                    </h4>
                                    <div className="flex-1 border-b border-dotted border-text-dim/20 mx-2 mb-1 min-w-[10px]" />
                                    <span className="font-bold text-xl text-primary shrink-0" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{item.price}</span>
                                </div>
                                <p className="text-text-dim/70 leading-relaxed text-[15px] pl-0.5">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 pt-8 border-t border-border-subtle flex justify-between items-center">
                        <button
                            onClick={() => activePage > 0 && flipPage(activePage - 1)}
                            disabled={activePage === 0 || isFlipping}
                            className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-text-dim hover:text-primary transition-colors duration-200 ${activePage === 0 ? 'opacity-0 pointer-events-none' : ''}`}
                        >
                            <ChevronLeft size={16} /> Voltar
                        </button>
                        <span className="text-xs font-bold tracking-[0.4em] uppercase px-4 py-1.5 rounded-full bg-primary/8 text-primary/70">
                            {activePage + 1} / {menuCategories.length}
                        </span>
                        <button
                            onClick={() => activePage < menuCategories.length - 1 && flipPage(activePage + 1)}
                            disabled={activePage === menuCategories.length - 1 || isFlipping}
                            className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-text-dim hover:text-primary transition-colors duration-200 ${activePage === menuCategories.length - 1 ? 'opacity-0 pointer-events-none' : ''}`}
                        >
                            Próxima <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
