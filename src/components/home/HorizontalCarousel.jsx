import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RestaurantCard } from '../ui/RestaurantCard';

gsap.registerPlugin(ScrollTrigger);

export const HorizontalCarousel = ({
    title,
    subtitle,
    restaurants = [],
    favorites = [],
    toggleFavorite,
    lang,
    animationClass, // e.g. 'dish-card-anim' or 'recommended-card'
    rootRef,
}) => {
    const scrollRef = useRef(null);
    const sectionRef = useRef(null);

    const scrollCarousel = (direction) => {
        if (scrollRef.current) {
            const amount = window.innerWidth > 1024 ? 900 : window.innerWidth > 768 ? 600 : 320;
            scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        if (!rootRef?.current || !sectionRef.current) return;
        const ctx = gsap.context(() => {
            gsap.to(`.${animationClass}`, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 85%',
                }
            });
        }, rootRef.current);
        return () => ctx.revert();
    }, [restaurants, animationClass, rootRef]);

    return (
        <div>
            <div className="max-w-7xl mx-auto px-4 mt-6 mb-2">
                <h2 className="text-2xl md:text-3xl font-display font-black tracking-tighter text-text-main italic">{title}</h2>
                {subtitle && (
                    <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest mt-1 border-l-2 border-primary pl-2 ml-1">{subtitle}</p>
                )}
            </div>

            <section ref={sectionRef} className="max-w-7xl mx-auto px-4 pb-2 relative group/carousel">
                <button
                    onClick={() => scrollCarousel('left')}
                    className="absolute left-6 md:-left-4 top-[40%] -translate-y-1/2 z-30 w-14 h-14 rounded-full glass bg-surface/80 text-text-main shadow-premium hidden sm:flex items-center justify-center opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-110 hover:text-primary"
                    aria-label="Scroll esquerda"
                >
                    <ChevronLeft size={28} />
                </button>
                <button
                    onClick={() => scrollCarousel('right')}
                    className="absolute right-6 md:-right-4 top-[40%] -translate-y-1/2 z-30 w-14 h-14 rounded-full glass bg-surface/80 text-text-main shadow-premium hidden sm:flex items-center justify-center opacity-100 transition-all duration-300 hover:scale-110 hover:text-primary animate-pulse hover:animate-none"
                    aria-label="Scroll direita"
                >
                    <ChevronRight size={28} />
                </button>

                <div ref={scrollRef} className="flex overflow-x-auto gap-4 lg:gap-5 pb-4 pt-1 no-scrollbar snap-x snap-mandatory">
                    {restaurants.map((rest, idx) => (
                        <div key={`${animationClass}-${rest.id}-${idx}`} className={`${animationClass} opacity-0 translate-y-8 shrink-0 w-[80vw] sm:w-[280px] lg:w-[250px] xl:w-[270px] snap-start`}>
                            <RestaurantCard
                                restaurant={rest}
                                isFavorite={favorites.includes(rest.id)}
                                toggleFavorite={toggleFavorite}
                                lang={lang}
                            />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
