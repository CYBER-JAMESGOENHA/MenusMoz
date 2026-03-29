import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight, ChevronLeft } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CATEGORY_DATA = [
    { 
        name: 'Mariscos', 
        gradient: 'bg-gradient-to-br from-cyan-400 to-blue-600', 
        shadow: 'hover:shadow-blue-500/40'
    },
    { 
        name: 'Portuguesa', 
        gradient: 'bg-gradient-to-br from-emerald-400 to-green-600', 
        shadow: 'hover:shadow-green-500/40'
    },
    { 
        name: 'Pastelaria', 
        gradient: 'bg-gradient-to-br from-amber-300 to-orange-500', 
        shadow: 'hover:shadow-orange-500/40'
    },
    { 
        name: 'Street Food', 
        gradient: 'bg-gradient-to-br from-rose-400 to-red-600', 
        shadow: 'hover:shadow-red-500/40'
    },
    { 
        name: 'Moçambicana', 
        gradient: 'bg-gradient-to-br from-violet-500 to-purple-600', 
        shadow: 'hover:shadow-purple-500/40'
    },
    { 
        name: 'Grelhados', 
        gradient: 'bg-gradient-to-br from-orange-500 to-red-700', 
        shadow: 'hover:shadow-orange-600/40'
    },
];

export const CategoryFilter = () => {
    const scrollRef = useRef(null);
    const containerRef = useRef(null);

    const scrollCarousel = (direction) => {
        if (scrollRef.current) {
            const amount = window.innerWidth > 1024 ? 600 : 300;
            scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to('.category-pill', {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: 'back.out(1.2)',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 85%',
                }
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="max-w-7xl mx-auto px-4 mb-20 w-full mt-12 relative group/cat">
            <div className="flex items-end justify-between mb-8 pl-2">
                 <div>
                    <h2 className="font-display font-black text-3xl md:text-4xl text-text-main italic tracking-tight relative inline-block">
                        Categorias 
                        <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-primary rounded-full"></span>
                    </h2>
                    <p className="text-[10px] md:text-xs text-text-dim mt-4 font-bold uppercase tracking-widest border-l-2 border-primary pl-2 ml-1">
                        Explora Novos Sabores
                    </p>
                 </div>
                 <div className="hidden sm:flex items-center gap-3 pr-2">
                     <button
                        onClick={() => scrollCarousel('left')}
                        className="w-12 h-12 rounded-full glass bg-surface/80 text-text-main flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 shadow-premium opacity-80 hover:opacity-100 hover:scale-110"
                        aria-label="Scroll left"
                     >
                         <ChevronLeft size={24} />
                     </button>
                     <button
                        onClick={() => scrollCarousel('right')}
                        className="w-12 h-12 rounded-full glass bg-surface/80 text-text-main flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 shadow-premium opacity-80 hover:opacity-100 hover:scale-110"
                        aria-label="Scroll right"
                     >
                         <ChevronRight size={24} />
                     </button>
                 </div>
            </div>

            <div 
                ref={scrollRef} 
                className="flex overflow-x-auto gap-4 md:gap-6 pb-12 pt-4 no-scrollbar snap-x snap-mandatory px-2 md:px-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                {CATEGORY_DATA.map((cat, i) => (
                    <Link
                        key={cat.name}
                        to={`/restaurantes?category=${encodeURIComponent(cat.name)}`}
                        className={`category-pill opacity-0 translate-y-16 scale-95 shrink-0 snap-center relative overflow-hidden flex flex-col justify-end p-6 w-[150px] h-[220px] md:w-[180px] md:h-[260px] rounded-[3rem] transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl group text-white ${cat.gradient} ${cat.shadow}`}
                    >
                        {/* Decorative Giant Background Letter */}
                        <span className="absolute -top-6 -right-2 text-[10rem] md:text-[12rem] font-black italic opacity-[0.08] pointer-events-none group-hover:scale-110 group-hover:-translate-x-4 group-hover:translate-y-2 transition-transform duration-700 select-none leading-none">
                            {cat.name.charAt(0)}
                        </span>
                        
                        {/* Blob Texture Effect for Glassmorphism depth */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-20 blur-[50px] rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black opacity-10 blur-[40px] rounded-full pointer-events-none" />
                        
                        <div className="relative z-10 flex flex-col items-center">
                            <span className="font-black text-xl md:text-2xl text-center leading-tight tracking-tight drop-shadow-md">
                                {cat.name}
                            </span>
                            
                            {/* Animated line */}
                            <div className="w-6 h-1 bg-white/60 rounded-full mt-3 mx-auto transition-all duration-500 group-hover:w-12 group-hover:bg-white" />
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};
