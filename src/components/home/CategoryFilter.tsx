import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface CategoryItem {
    name: string;
    gradient: string;
    shadow: string;
    img: string;
    isSeeAll?: boolean;
}

const CATEGORY_DATA: CategoryItem[] = [
    { 
        name: 'Mariscos', 
        gradient: 'bg-gradient-to-br from-cyan-400 to-blue-700', 
        shadow: 'hover:shadow-blue-500/50',
        img: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400&h=400&fit=crop'
    },
    { 
        name: 'Portuguesa', 
        gradient: 'bg-gradient-to-br from-emerald-400 to-green-700', 
        shadow: 'hover:shadow-green-500/50',
        img: 'https://images.unsplash.com/photo-1534080564583-6be75777b700?w=400&h=400&fit=crop'
    },
    { 
        name: 'Pastelaria', 
        gradient: 'bg-gradient-to-br from-amber-400 to-orange-600', 
        shadow: 'hover:shadow-orange-500/50',
        img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop'
    },
    { 
        name: 'Street Food', 
        gradient: 'bg-gradient-to-br from-rose-400 to-red-700', 
        shadow: 'hover:shadow-red-500/50',
        img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop'
    },
    { 
        name: 'Moçambicana', 
        gradient: 'bg-gradient-to-br from-purple-500 to-indigo-800', 
        shadow: 'hover:shadow-indigo-500/50',
        img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=400&fit=crop'
    },
    { 
        name: 'Grelhados', 
        gradient: 'bg-gradient-to-br from-orange-500 to-red-800', 
        shadow: 'hover:shadow-orange-600/50',
        img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop'
    },
    {
        name: 'Ver Todas',
        gradient: 'bg-gradient-to-br from-zinc-800 to-black',
        shadow: 'hover:shadow-zinc-700/50',
        img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop',
        isSeeAll: true
    }
];

export const CategoryFilter: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLElement>(null);

    const scrollCarousel = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const amount = window.innerWidth > 1024 ? 600 : 300;
            scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        if (!containerRef.current) return;
        const ctx = gsap.context(() => {
            // Animate Title
            gsap.to('.category-title', {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 85%',
                }
            });

            // Animate Pills
            gsap.to('.category-pill', {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: 'back.out(1.2)',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 80%',
                }
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="max-w-7xl mx-auto px-4 mb-section w-full pt-0 relative group/cat">
            {/* Section Title - Centralized with specific width */}
            <div className="flex justify-center mb-section">
                <h2 className="category-title opacity-0 translate-y-12 text-4xl md:text-5xl font-display font-black italic tracking-tighter text-text-main uppercase text-center w-full max-w-[428px] md:max-w-[526px] leading-[0.85]">
                    Descubra A Tua Cena
                </h2>
            </div>

            {/* Navigation Buttons - Repositioned to sides */}
            <button
                onClick={() => scrollCarousel('left')}
                className="absolute left-4 top-[60%] -translate-y-1/2 z-20 w-12 h-12 rounded-full glass bg-surface/80 text-text-main hidden md:flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 shadow-premium opacity-0 group-hover/cat:opacity-100 hover:scale-110 pointer-events-auto"
                aria-label="Scroll left"
            >
                <ChevronLeft size={24} />
            </button>
            <button
                onClick={() => scrollCarousel('right')}
                className="absolute right-4 top-[60%] -translate-y-1/2 z-20 w-12 h-12 rounded-full glass bg-surface/80 text-text-main hidden md:flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 shadow-premium opacity-0 group-hover/cat:opacity-100 hover:scale-110 pointer-events-auto"
                aria-label="Scroll right"
            >
                <ChevronRight size={24} />
            </button>

            <div 
                ref={scrollRef} 
                className="flex overflow-x-auto gap-4 md:gap-8 pb-2 no-scrollbar snap-x snap-mandatory px-4 md:px-12 items-center md:justify-center"
            >
                {CATEGORY_DATA.map((cat) => (
                    <Link
                        key={cat.name}
                        to={cat.isSeeAll ? '/restaurantes' : `/restaurantes?category=${encodeURIComponent(cat.name)}`}
                        className={`category-pill opacity-0 translate-y-16 scale-95 shrink-0 snap-center relative overflow-hidden flex flex-col items-center justify-center p-4 w-[140px] h-[140px] md:w-[170px] md:h-[170px] rounded-full transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl group ${cat.shadow}`}
                    >
                        <img 
                            src={cat.img} 
                            alt={cat.name} 
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3" 
                        />
                        
                        <div className={`absolute inset-0 opacity-60 mix-blend-hard-light transition-opacity duration-500 group-hover:opacity-80 ${cat.gradient}`} />
                        <div className={`absolute inset-0 ${cat.isSeeAll ? 'bg-black/40 group-hover:bg-black/60' : 'bg-gradient-to-t from-black/80 via-black/30 to-black/10'} transition-all duration-300 group-hover:opacity-90`} />
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-white opacity-20 blur-[30px] rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
                        
                        <div className="relative z-10 flex flex-col items-center justify-center">
                            {cat.isSeeAll ? (
                                <>
                                    <span className="font-black text-xl md:text-2xl text-white text-center leading-tight tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-1 uppercase italic font-display">
                                        {cat.name}
                                    </span>
                                    <ArrowRight className="text-white w-6 h-6 transition-transform duration-300 group-hover:translate-x-2" />
                                </>
                            ) : (
                                <>
                                    <span className="font-black text-xl md:text-2xl text-white text-center leading-tight tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] uppercase italic font-display">
                                        {cat.name}
                                    </span>
                                    <div className="w-0 h-[3px] bg-white rounded-full mt-2 transition-all duration-500 group-hover:w-10" />
                                </>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};
