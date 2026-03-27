import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FEATURED_DISHES } from '../../data';

gsap.registerPlugin(ScrollTrigger);

export const HeroSlideshow = ({ heroSlides = [], th, rootRef }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slideshowRef = useRef(null);
    const slides = heroSlides.length > 0 ? heroSlides : FEATURED_DISHES;

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length);
        }, 2500);
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
        <section ref={slideshowRef} className="max-w-[1440px] mx-auto px-4 pt-20 md:pt-24 mb-2 reveal overflow-hidden">
            <div className="relative rounded-3xl md:rounded-custom-lg bg-black text-white overflow-hidden min-h-[240px] sm:min-h-[280px] md:min-h-[320px] border border-white/10 shadow-premium flex items-center">

                <div className="hero-parallax-bg absolute inset-0 z-0 h-[115%] w-full -top-[7.5%]">
                    <img
                        key={`img-${currentSlide}`}
                        src={slides[currentSlide].image}
                        alt={slides[currentSlide].name}
                        className="slide-image w-full h-full object-cover rounded-3xl md:rounded-custom-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-[1]" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent z-[1] hidden sm:block" />
                </div>

                <div className="relative z-10 w-full max-w-lg p-6 sm:p-5 md:p-6 slide-content" key={`content-${currentSlide}`}>
                    <div className="flex flex-col gap-1.5 md:gap-2 mb-3 md:mb-4">
                        <span className="text-accent font-black uppercase tracking-[0.4em] text-[8px] md:text-[10px]">
                            {slides[currentSlide].tagline}
                        </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl mb-3 md:mb-4 leading-tight tracking-tighter italic font-display text-white drop-shadow-xl">
                        {slides[currentSlide].name}
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base text-white/95 mb-5 md:mb-6 font-medium leading-relaxed max-w-[240px] sm:max-w-xs drop-shadow-lg">
                        {slides[currentSlide].desc}
                    </p>
                    <Link
                        to={slides[currentSlide].link}
                        className="bg-white text-black px-8 py-3.5 md:py-3 rounded-xl font-black hover:bg-primary hover:text-white transition-all text-xs md:text-sm shadow-xl flex items-center gap-2 group/btn min-h-[44px] w-fit"
                    >
                        {th.view_restaurant} <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-8 md:bottom-12 md:left-16 z-20 flex items-center gap-3 sm:gap-4">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentSlide(i)}
                            className="group py-2 sm:py-4 min-h-[44px] flex items-center"
                            aria-label={`Slide ${i + 1}`}
                        >
                            <div className={`h-1 rounded-full transition-all duration-700 ${currentSlide === i ? 'w-10 sm:w-12 bg-primary' : 'w-5 sm:w-6 bg-white/30 group-hover:bg-white/60'}`} />
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};
