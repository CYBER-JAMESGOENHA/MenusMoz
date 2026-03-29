import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CATEGORY_DATA = [
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
        <section ref={containerRef} className="max-w-7xl mx-auto px-4 mb-8 w-full mt-6 relative group/cat">
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
                className="flex overflow-x-auto gap-4 md:gap-6 pb-12 pt-4 no-scrollbar snap-x snap-mandatory px-2 md:px-4 items-center"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                {CATEGORY_DATA.map((cat, i) => (
                    <Link
                        key={cat.name}
                        to={cat.isSeeAll ? '/restaurantes' : `/restaurantes?category=${encodeURIComponent(cat.name)}`}
                        className={`category-pill opacity-0 translate-y-16 scale-95 shrink-0 snap-center relative overflow-hidden flex flex-col items-center justify-center p-4 w-[140px] h-[140px] md:w-[170px] md:h-[170px] rounded-full transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl group ${cat.shadow}`}
                    >
                        {/* Background Image inside the circle */}
                        <img 
                            src={cat.img} 
                            alt={cat.name} 
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3" 
                        />
                        
                        {/* Vibrant Gradient Overlay interacting with image */}
                        <div className={`absolute inset-0 opacity-60 mix-blend-hard-light transition-opacity duration-500 group-hover:opacity-80 ${cat.gradient}`} />
                        
                        {/* Dark Vignette to ensure text readability */}
                        <div className={`absolute inset-0 ${cat.isSeeAll ? 'bg-black/40 group-hover:bg-black/60' : 'bg-gradient-to-t from-black/80 via-black/30 to-black/10'} transition-all duration-300 group-hover:opacity-90`} />
                        
                        {/* Blob Texture Effect for additional depth */}
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-white opacity-20 blur-[30px] rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
                        
                        {/* Text and Icon */}
                        <div className="relative z-10 flex flex-col items-center justify-center">
                            {cat.isSeeAll ? (
                                <>
                                    <span className="font-black text-xl md:text-2xl text-white text-center leading-tight tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-1">
                                        {cat.name}
                                    </span>
                                    <ArrowRight className="text-white w-6 h-6 transition-transform duration-300 group-hover:translate-x-2" />
                                </>
                            ) : (
                                <>
                                    <span className="font-black text-xl md:text-2xl text-white text-center leading-tight tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                        {cat.name}
                                    </span>
                                    {/* Animated decorative line indicator under text */}
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
