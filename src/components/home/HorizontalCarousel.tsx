import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RestaurantCard } from '../ui/RestaurantCard';

gsap.registerPlugin(ScrollTrigger);

interface HorizontalCarouselProps {
    title: string;
    subtitle?: string;
    restaurants?: any[];
    favorites?: number[];
    toggleFavorite: (id: any) => Promise<void>;
    lang: string;
    animationClass: string;
    rootRef: React.RefObject<HTMLDivElement | null>;
    userLatitude?: number | null;
    userLongitude?: number | null;
    userCity?: string | null;
}

export const HorizontalCarousel: React.FC<HorizontalCarouselProps> = ({
    title,
    subtitle,
    restaurants = [],
    favorites = [],
    toggleFavorite,
    lang,
    animationClass,
    rootRef,
    userLatitude,
    userLongitude,
    userCity,
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null);

    const scrollCarousel = (direction: 'left' | 'right') => {
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
        <div className="pt-2 pb-6">
            <div className="max-w-7xl mx-auto px-6 mb-4 flex items-center gap-3">
                <div className="w-0.5 h-6 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
                <div className="flex flex-col">
                    <h2 className="text-lg md:text-xl font-display font-bold italic text-text-main dark:text-neutral-200 tracking-tight leading-tight">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-[9px] font-semibold text-text-dim/50 dark:text-neutral-500 uppercase tracking-widest mt-0.5">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            <section ref={sectionRef} className="max-w-7xl mx-auto px-4 pb-1 relative group/carousel">
                <button
                    onClick={() => scrollCarousel('left')}
                    className="absolute left-4 md:-left-3 top-[45%] -translate-y-1/2 z-30 w-10 h-10 rounded-full glass bg-surface/90 text-text-main shadow-[0_8px_20px_-6px_rgba(0,0,0,0.15)] hidden sm:flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:scale-105 hover:text-primary border border-black/5"
                    aria-label="Scroll esquerda"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={() => scrollCarousel('right')}
                    className="absolute right-4 md:-right-3 top-[45%] -translate-y-1/2 z-30 w-10 h-10 rounded-full glass bg-surface/90 text-text-main shadow-[0_8px_20px_-6px_rgba(0,0,0,0.15)] hidden sm:flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:scale-105 hover:text-primary border border-black/5"
                    aria-label="Scroll direita"
                >
                    <ChevronRight size={20} />
                </button>

                <div ref={scrollRef} className="flex overflow-x-auto gap-5 px-4 pb-10 pt-1 no-scrollbar snap-x snap-mandatory">
                    {restaurants.map((rest, idx) => (
                        <div key={`${animationClass}-${rest.id}-${idx}`} className={`${animationClass} opacity-0 translate-y-6 shrink-0 w-[80vw] sm:w-[230px] lg:w-[260px] snap-start`}>
                            <RestaurantCard
                                restaurant={rest}
                                isFavorite={favorites.includes(rest.id)}
                                toggleFavorite={toggleFavorite}
                                lang={lang}
                                userLatitude={userLatitude}
                                userLongitude={userLongitude}
                                userCity={userCity}
                            />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
