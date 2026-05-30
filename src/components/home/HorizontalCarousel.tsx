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
        <div className="pt-0 pb-2">
            <div className="hidden md:block max-w-7xl mx-auto px-6 md:px-4 mb-1 md:mb-6">
                <h2 className="text-2xl md:text-3xl font-display font-medium text-text-main tracking-tight leading-none">
                    {title}
                </h2>
            </div>

            <section ref={sectionRef} className="max-w-7xl mx-auto px-0 md:px-4 pb-1 relative group/carousel">
                <button
                    onClick={() => scrollCarousel('left')}
                    className="absolute left-4 md:-left-2 top-[42%] -translate-y-1/2 z-30 w-7.5 h-7.5 rounded-full glass bg-surface/90 text-text-main hidden sm:flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:scale-105 hover:text-primary border border-black/5"
                    aria-label="Scroll esquerda"
                >
                    <ChevronLeft size={18} />
                </button>
                <button
                    onClick={() => scrollCarousel('right')}
                    className="absolute right-4 md:-right-2 top-[42%] -translate-y-1/2 z-30 w-7.5 h-7.5 rounded-full glass bg-surface/90 text-text-main hidden sm:flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:scale-105 hover:text-primary border border-black/5"
                    aria-label="Scroll direita"
                >
                    <ChevronRight size={18} />
                </button>

                <div ref={scrollRef} className="flex overflow-x-auto gap-3 px-[8vw] sm:px-4 pb-4 pt-0.5 no-scrollbar snap-x snap-mandatory">
                    {restaurants.map((rest, idx) => (
                        <div key={`${animationClass}-${rest.id}-${idx}`} className={`${animationClass} opacity-0 translate-y-4 shrink-0 w-[68vw] sm:w-[220px] lg:w-[260px] snap-center sm:snap-start`}>
                            <RestaurantCard
                                restaurant={rest}
                                isFavorite={favorites.includes(rest.id)}
                                toggleFavorite={toggleFavorite}
                                lang={lang}
                                userLatitude={userLatitude}
                                userLongitude={userLongitude}
                                userCity={userCity}
                                variant="carousel"
                            />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
