import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HeroSlide {
    image: string;
    name: string;
    tagline: string;
    desc: string;
    link: string;
}

interface HeroSlideshowProps {
    heroSlides?: HeroSlide[];
    th: any;
    rootRef: React.RefObject<HTMLDivElement | null>;
}

export const HeroSlideshow: React.FC<HeroSlideshowProps> = ({ heroSlides = [], th, rootRef }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slideshowRef = useRef<HTMLElement>(null);
    // Use whatever slides come from Supabase; empty = no section rendered
    const slides = heroSlides;
    if (slides.length === 0) return null;


    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length);
        }, 3500);
        return () => clearInterval(timer);
    }, [slides.length]);

    useEffect(() => {
        if (!slideshowRef.current || !rootRef?.current) return;
        const triggerEl = slideshowRef.current;
        const ctx = gsap.context(() => {
            gsap.to(".hero-parallax-bg", {
                y: "15%",
                ease: "none",
                scrollTrigger: {
                    trigger: triggerEl,
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });
        }, rootRef.current);
        return () => ctx.revert();
    }, [rootRef]);

    useEffect(() => {
        if (!slideshowRef.current || !rootRef?.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(".slide-content",
                { opacity: 0, x: 20 },
                { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }
            );
            gsap.fromTo(".slide-image",
                { opacity: 0, scale: 1.05, filter: "brightness(0.8)" },
                { opacity: 1, scale: 1, filter: "brightness(1)", duration: 2, ease: "power2.out" }
            );
        }, rootRef.current);
        return () => ctx.revert();
    }, [currentSlide, rootRef]);

    return (
        <section ref={slideshowRef} className="max-w-[1440px] mx-auto px-4 pt-16 md:pt-20 reveal overflow-hidden">
            <div className="relative rounded-2xl md:rounded-3xl bg-black text-white overflow-hidden min-h-[200px] sm:min-h-[240px] md:min-h-[280px] border border-white/8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] flex items-center group/hero">

                <div className="hero-parallax-bg absolute inset-0 z-0 h-[115%] w-full -top-[7.5%]">
                    <img
                        key={`img-${currentSlide}`}
                        src={slides[currentSlide].image}
                        alt={slides[currentSlide].name}
                        className="slide-image w-full h-full object-cover rounded-2xl md:rounded-3xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40 z-[1]" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/10 to-transparent z-[1] hidden sm:block" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 z-[1] sm:hidden" />
                </div>

                <div className="relative z-10 w-full max-w-lg p-5 pb-12 sm:p-6 sm:pb-6 md:p-8 md:pb-8 slide-content" key={`content-${currentSlide}`}>
                    <div className="flex flex-col gap-1.5 md:gap-2 mb-2 md:mb-3">
                        <span className="text-accent font-black uppercase tracking-[0.4em] text-[7px] md:text-[9px]">
                            {slides[currentSlide].tagline}
                        </span>
                    </div>
                    <h2 className="text-xl sm:text-2.5xl md:text-4xl lg:text-5xl mb-2 md:mb-3 leading-tight tracking-tighter italic font-display text-white drop-shadow-lg uppercase">
                        {slides[currentSlide].name}
                    </h2>
                    <p className="text-[10px] sm:text-xs md:text-sm text-white/90 mb-4 md:mb-5 font-medium leading-relaxed max-w-[220px] sm:max-w-xs drop-shadow-md">
                        {slides[currentSlide].desc}
                    </p>
                    <Link
                        to={slides[currentSlide].link}
                        className="bg-white/95 backdrop-blur-sm text-black px-6 py-2.5 md:py-2.5 rounded-lg font-black hover:bg-primary hover:text-white transition-all duration-300 text-[10px] md:text-xs shadow-[0_8px_20px_-8px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_25px_-8px_rgba(220,38,38,0.4)] flex items-center gap-2 group/btn min-h-[38px] w-fit border border-white/20 hover:border-primary"
                    >
                        {th.view_restaurant} <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                </div>

                <div className="absolute bottom-3 left-5 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8 z-20 flex justify-center gap-2 sm:gap-3">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentSlide(i)}
                            className="group min-h-[44px] flex items-center"
                            aria-label={`Slide ${i + 1}`}
                        >
                            <div className={`h-0.5 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-8 sm:w-10 bg-white shadow-sm' : 'w-4 sm:w-5 bg-white/25 group-hover:bg-white/50'}`} />
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};
