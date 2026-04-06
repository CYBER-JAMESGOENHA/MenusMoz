import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface CategoryItem {
    name: string;
    img: string;
}

const CATEGORY_DATA: CategoryItem[] = [
    { 
        name: 'Mariscos', 
        img: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=800&h=1200&fit=crop'
    },
    { 
        name: 'Portuguesa', 
        img: 'https://images.unsplash.com/photo-1534080564583-6be75777b700?w=800&h=1200&fit=crop'
    },
    { 
        name: 'Pastelaria', 
        img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=1200&fit=crop'
    },
    { 
        name: 'Street Food', 
        img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=1200&fit=crop'
    },
    { 
        name: 'Moçambicana', 
        img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&h=1200&fit=crop'
    },
    { 
        name: 'Grelhados', 
        img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=1200&fit=crop'
    }
];

export const CategoryFilter: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(1);
    const containerRef = useRef<HTMLElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const touchStartX = useRef<number | null>(null);

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % CATEGORY_DATA.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + CATEGORY_DATA.length) % CATEGORY_DATA.length);
    };

    // Touch handlers for mobile swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!touchStartX.current) return;
        const touchEndX = e.changedTouches[0].clientX;
        const deltaX = touchStartX.current - touchEndX;

        if (deltaX > 50) handleNext();
        else if (deltaX < -50) handlePrev();

        touchStartX.current = null;
    };

    useEffect(() => {
        if (!containerRef.current) return;
        
        // Initial reveal
        gsap.fromTo('.category-section-title', 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
        );
    }, []);

    const getCardStyles = (index: number) => {
        const total = CATEGORY_DATA.length;
        const diff = (index - activeIndex + total) % total;
        
        // Circular logic for 3 cards visible
        let position = diff;
        if (position > total / 2) position -= total;
        
        const isActive = position === 0;
        const isSide = Math.abs(position) === 1;
        const isHidden = Math.abs(position) > 1;

        return {
            isActive,
            isSide,
            isHidden,
            position
        };
    };

    return (
        <section 
            ref={containerRef} 
            className="w-full max-w-7xl mx-auto px-4 mb-section pt-0 overflow-hidden select-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Minimal Header (Desktop only) */}
            <div className="hidden md:flex flex-col items-center mb-6">
                <h2 className="category-section-title text-3xl md:text-5xl font-display italic text-text-main tracking-tight text-center uppercase">
                    DESCUBRA A TUA CENA
                </h2>
                <div className="w-12 h-0.5 bg-primary mt-2 rounded-full opacity-30" />
            </div>

            {/* Mobile Native Scroll View (Circular Categories) */}
            <div className="md:hidden flex overflow-x-auto gap-4 px-2 pb-4 pt-2 no-scrollbar snap-x snap-mandatory">
                {CATEGORY_DATA.map((cat) => (
                    <Link 
                        key={cat.name}
                        to={`/restaurantes?category=${encodeURIComponent(cat.name)}`}
                        className="flex-shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-full relative overflow-hidden group snap-center border-2 border-border-subtle/20 shadow-xl"
                    >
                        <img 
                            src={cat.img} 
                            alt={cat.name} 
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 transition-colors" />
                        <div className="absolute inset-0 flex items-center justify-center p-2 text-center">
                            <span className="text-white text-lg font-display italic tracking-tight uppercase" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>
                                {cat.name}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Coverflow Container (Desktop only) */}
            <div className="hidden relative h-[380px] md:h-[480px] max-h-[60vh] md:flex items-center justify-center">
                
                {/* Navigation Controls - Premium Glassmorphism */}
                <button 
                    onClick={handlePrev}
                    className="absolute left-0 lg:-left-4 z-40 p-4 rounded-full glass hover:bg-primary hover:text-white transition-all duration-300 group shadow-premium hover:scale-110 active:scale-95"
                    aria-label="Previous"
                >
                    <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
                </button>

                <div className="relative w-full max-w-6xl h-full flex items-center justify-center pointer-events-none">
                    {CATEGORY_DATA.map((cat, index) => {
                        const { isActive, isSide, isHidden, position } = getCardStyles(index);
                        
                        return (
                            <div
                                key={cat.name}
                                ref={(el: HTMLDivElement | null) => { cardsRef.current[index] = el; }}
                                onClick={() => setActiveIndex(index)}
                                className={`
                                    absolute transition-all duration-700 cubic-bezier(0.23, 1, 0.32, 1) cursor-pointer pointer-events-auto
                                    ${isHidden ? 'opacity-0 scale-50' : 'opacity-100'}
                                    w-[240px] md:w-[480px] aspect-[4/5] md:aspect-[16/10] max-h-[45vh] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-premium group/card
                                `}
                                style={{
                                    transform: `
                                        translateX(${position * 65}%) 
                                        scale(${isActive ? 1 : 0.75})
                                        translateZ(${isActive ? '100px' : '0px'})
                                    `,
                                    zIndex: isActive ? 30 : (isSide ? 20 : 10),
                                    opacity: isActive ? 1 : (isSide ? 0.4 : 0),
                                    filter: isActive ? 'none' : 'grayscale(60%) blur(4px)',
                                    perspective: '1500px'
                                }}
                            >
                                <img 
                                    src={cat.img} 
                                    alt={cat.name} 
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110"
                                />
                                
                                {/* Gradient Overlays */}
                                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80" />
                                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 mix-blend-overlay" />
                                
                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
                                    <h3 
                                        className={`
                                            text-white font-display text-3xl md:text-4xl italic tracking-tight transition-all duration-700 delay-100 uppercase
                                            ${isActive ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-90'}
                                        `}
                                    >
                                        {cat.name}
                                    </h3>
                                    {isActive && (
                                        <Link 
                                            to={`/restaurantes?category=${encodeURIComponent(cat.name)}`}
                                            className="mt-6 text-white/70 text-[10px] md:text-xs font-body tracking-[0.3em] uppercase flex items-center gap-3 hover:text-white transition-all group/link translate-y-0 opacity-100 animate-in fade-in slide-in-from-bottom-2 duration-1000"
                                        >
                                            <span className="relative">
                                                Ver Opções
                                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white/50 transition-all duration-300 group-hover/link:w-full" />
                                            </span>
                                            <ChevronRight size={14} className="group-hover/link:translate-x-2 transition-transform" />
                                        </Link>
                                    )}
                                </div>

                                {/* Selection Glow */}
                                {isActive && (
                                    <div className="absolute inset-0 border-[2px] border-white/30 rounded-[2rem] md:rounded-[3rem] pointer-events-none" />
                                )}
                            </div>
                        );
                    })}
                </div>

                <button 
                    onClick={handleNext}
                    className="absolute right-0 lg:-right-4 z-40 p-4 rounded-full glass hover:bg-primary hover:text-white transition-all duration-300 group shadow-premium hover:scale-110 active:scale-95"
                    aria-label="Next"
                >
                    <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Pagination / Progress (Desktop only) */}
            <div className="hidden md:flex justify-center gap-3 mt-4">
                {CATEGORY_DATA.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`
                            h-1 transition-all duration-700 rounded-full
                            ${activeIndex === i ? 'w-12 bg-primary' : 'w-3 bg-text-dim/10 hover:bg-text-dim/30'}
                        `}
                        aria-label={`Go to category ${i + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};

