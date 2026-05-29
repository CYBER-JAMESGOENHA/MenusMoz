import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';

interface Slide {
    image: string;
    badge: { pt: string; en: string };
    title1: { pt: string; en: string };
    highlight: { pt: string; en: string };
    title2: { pt: string; en: string };
    subtitle: { pt: string; en: string };
}

const SLIDES: Slide[] = [
    {
        image: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=1600&auto=format&fit=crop",
        badge: { pt: "EM DESTAQUE", en: "FEATURED" },
        title1: { pt: "Onde Maputo vai ", en: "Where Maputo goes to " },
        highlight: { pt: "comer", en: "eat" },
        title2: { pt: ".", en: "." },
        subtitle: { pt: "Descubra os melhores restaurantes e experiências gastronómicas.", en: "Discover the best restaurants and culinary experiences." }
    },
    {
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop",
        badge: { pt: "MESA PREMIUM", en: "PREMIUM TABLE" },
        title1: { pt: "A mesa perfeita para ", en: "The perfect table to " },
        highlight: { pt: "celebrar", en: "celebrate" },
        title2: { pt: " o sabor.", en: " flavor." },
        subtitle: { pt: "Momentos únicos nos spots gastronómicos mais sofisticados da capital.", en: "Unique moments in the capital's most sophisticated dining spots." }
    },
    {
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1600&auto=format&fit=crop",
        badge: { pt: "SABORES ÚNICOS", en: "UNIQUE FLAVORS" },
        title1: { pt: "Novas sensações para ", en: "New sensations to " },
        highlight: { pt: "experimentar", en: "experience" },
        title2: { pt: " hoje.", en: " today." },
        subtitle: { pt: "Explore o melhor da gastronomia local e de fusão internacional.", en: "Explore the best of local and international fusion gastronomy." }
    },
    {
        image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1600&auto=format&fit=crop",
        badge: { pt: "AMBIENTE E ALMA", en: "AMBIANCE & SOUL" },
        title1: { pt: "Espaços ideais para ", en: "Ideal spaces to " },
        highlight: { pt: "partilhar", en: "share" },
        title2: { pt: " memórias.", en: " memories." },
        subtitle: { pt: "Encontre o ambiente ideal para criar momentos inesquecíveis.", en: "Find the ideal atmosphere to create unforgettable moments." }
    }
];

interface HeroSlideshowProps {
    lang: string;
}

export const HeroSlideshow: React.FC<HeroSlideshowProps> = ({ lang }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);
    const dragStartTime = useRef<number>(0);
    const slideshowTimerRef = useRef<any>(null);
    const isPt = lang === 'pt';

    // Set up slideshow interval
    const startSlideshow = useCallback(() => {
        if (slideshowTimerRef.current) {
            clearInterval(slideshowTimerRef.current);
        }
        slideshowTimerRef.current = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % SLIDES.length);
        }, 6500); // 6.5 seconds duration
    }, []);

    // Set dynamic slide-specific glow and border colors
    useEffect(() => {
        const colors = [
            { glow: 'rgba(206, 17, 38, 0.15)', border: 'rgba(206, 17, 38, 0.3)' }, // Red
            { glow: 'rgba(252, 227, 0, 0.12)', border: 'rgba(252, 227, 0, 0.25)' }, // Yellow
            { glow: 'rgba(0, 154, 68, 0.12)', border: 'rgba(0, 154, 68, 0.25)' },   // Green
            { glow: 'rgba(220, 38, 38, 0.15)', border: 'rgba(220, 38, 38, 0.3)' }   // Alt Red
        ];
        const active = colors[currentIndex] || colors[0];
        document.documentElement.style.setProperty('--active-slide-glow', active.glow);
        document.documentElement.style.setProperty('--active-slide-border', active.border);

        return () => {
            document.documentElement.style.removeProperty('--active-slide-glow');
            document.documentElement.style.removeProperty('--active-slide-border');
        };
    }, [currentIndex]);

    useEffect(() => {
        startSlideshow();
        return () => {
            if (slideshowTimerRef.current) {
                clearInterval(slideshowTimerRef.current);
            }
        };
    }, [startSlideshow]);

    // Handle Manual Navigation
    const navigateTo = (index: number) => {
        setCurrentIndex(index);
        startSlideshow(); // Reset timer
    };

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
        startSlideshow();
    }, [startSlideshow]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
        startSlideshow();
    }, [startSlideshow]);

    // Drag / Touch Handlers
    const handleDragStart = (clientX: number) => {
        setIsDragging(true);
        setStartX(clientX);
        setDragOffset(0);
        dragStartTime.current = Date.now();
    };

    const handleDragMove = (clientX: number) => {
        if (!isDragging) return;
        setDragOffset(clientX - startX);
    };

    const handleDragEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);

        const duration = Date.now() - dragStartTime.current;
        const threshold = 60; // 60px min distance for swipe

        if (Math.abs(dragOffset) > threshold && duration < 800) {
            if (dragOffset > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        }
        setDragOffset(0);
    };

    const handleCtaClick = () => {
        const searchSection = document.getElementById('search-section');
        if (searchSection) {
            searchSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const input = searchSection.querySelector('input');
            if (input) {
                setTimeout(() => input.focus(), 600);
            }
        }
    };

    return (
        <section 
            className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 -mt-[64px] md:-mt-[72px] mb-3 md:mb-8 select-none"
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onMouseMove={(e) => handleDragMove(e.clientX)}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
            onTouchEnd={handleDragEnd}
        >
            <div className="relative w-full h-[300px] sm:h-[350px] md:h-[370px] lg:h-[390px] xl:h-[410px] rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-premium bg-stone-900 group">
                
                {/* Drag hint overlay */}
                <div 
                    className="absolute inset-0 w-full h-full transition-transform duration-150 ease-out z-0 pointer-events-none"
                    style={{ transform: `translateX(${dragOffset * 0.15}px)` }}
                >
                    {SLIDES.map((slide, idx) => {
                        const isActive = idx === currentIndex;
                        return (
                            <div
                                key={slide.image}
                                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                                    isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                                }`}
                            >
                                {/* Active image Ken Burns scale effect */}
                                <img
                                    src={slide.image}
                                    alt="MenusMoz premium ambiance"
                                    className={`w-full h-full object-cover transition-transform ease-out select-none pointer-events-none ${
                                        isActive ? 'scale-[1.05] duration-[6500ms]' : 'scale-100 duration-500'
                                    }`}
                                    draggable={false}
                                />
                                
                                {/* Strong Dark Gradients for Text Readability: Left-to-Right and Bottom-to-Top */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-transparent z-10 pointer-events-none" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent z-10 pointer-events-none" />

                                {/* Slide Content Panel */}
                                <div className="absolute inset-0 z-20 flex items-center pl-[6%] sm:pl-[8%] md:pl-[10%] pr-6 pt-[64px] md:pt-[72px]">
                                    <div className="w-full max-w-[80%] sm:max-w-[550px] lg:max-w-[650px] flex flex-col items-start text-left pointer-events-auto">
                                        
                                        {/* Dynamic Category/Highlight Red Badge */}
                                        <span className="inline-block bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-bold tracking-[0.2em] mb-2 sm:mb-3 uppercase backdrop-blur-xs select-none">
                                            {isPt ? slide.badge.pt : slide.badge.en}
                                        </span>

                                        {/* Elegantly styled serif display text with primary Red emphasis */}
                                        <h1 className="font-display font-medium text-white leading-[1.2] tracking-tight text-[19px] xs:text-[22px] sm:text-[30px] md:text-[36px] lg:text-[40px] xl:text-[44px]">
                                            {isPt ? slide.title1.pt : slide.title1.en}
                                            <span className="text-primary font-semibold">
                                                {isPt ? slide.highlight.pt : slide.highlight.en}
                                            </span>
                                            {isPt ? slide.title2.pt : slide.title2.en}
                                        </h1>

                                        {/* Premium subtle description */}
                                        <p className="text-white/80 dark:text-white/70 text-[10px] xs:text-[11px] sm:text-sm md:text-base font-light mt-1.5 sm:mt-3 mb-3.5 sm:mb-5 leading-relaxed max-w-[90%] sm:max-w-[460px] md:max-w-[520px] select-none">
                                            {isPt ? slide.subtitle.pt : slide.subtitle.en}
                                        </p>

                                        {/* Solid Red CTA Button */}
                                        <button
                                            onClick={handleCtaClick}
                                            className="group/btn px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-primary hover:bg-primary-dark text-white font-body text-[9px] sm:text-[11px] font-bold tracking-widest uppercase transition-all duration-300 transform active:scale-95 flex items-center gap-1.5 hover:shadow-[0_4px_12px_rgba(220,38,38,0.2)] cursor-pointer"
                                        >
                                            {isPt ? 'Explorar Agora' : 'Explore Now'}
                                            <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                                        </button>

                                    </div>
                                </div>

							</div>
                        );
                    })}
                </div>

                {/* Miniature Premium Pagination Dots */}
                <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 z-30 flex items-center bg-stone-950/45 backdrop-blur-md p-1.5 rounded-full border border-white/10 select-none">
                    <div className="flex items-center gap-1">
                        {SLIDES.map((_, idx) => {
                            const isActive = idx === currentIndex;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => navigateTo(idx)}
                                    className={`h-1 rounded-full transition-all duration-500 cursor-pointer ${
                                        isActive 
                                            ? 'w-4 bg-primary' 
                                            : 'w-1 bg-white/30 hover:bg-white/60'
                                      }`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            );
                        })}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default HeroSlideshow;

