import React, { useState, useEffect, useRef, useCallback } from 'react';

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
        title1: { pt: "Onde Maputo escolhe ", en: "Where Maputo chooses to " },
        highlight: { pt: "comer", en: "eat" },
        title2: { pt: ".", en: "." },
        subtitle: { pt: "Descubra os melhores restaurantes e experiências gastronómicas.", en: "Discover the best restaurants and culinary experiences." }
    },
    {
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop",
        badge: { pt: "MESA PREMIUM", en: "PREMIUM TABLE" },
        title1: { pt: "A mesa perfeita para ", en: "The perfect table to " },
        highlight: { pt: "comer", en: "eat" },
        title2: { pt: " e celebrar.", en: " and celebrate." },
        subtitle: { pt: "Momentos únicos nos spots mais sofisticados da capital.", en: "Unique moments in the capital's most sophisticated spots." }
    },
    {
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1600&auto=format&fit=crop",
        badge: { pt: "SABORES ÚNICOS", en: "UNIQUE FLAVORS" },
        title1: { pt: "Novas experiências para ", en: "New experiences to " },
        highlight: { pt: "comer", en: "eat" },
        title2: { pt: " e amar.", en: " and love." },
        subtitle: { pt: "Explore o melhor da gastronomia local e de fusão internacional.", en: "Explore the best of local and international fusion gastronomy." }
    },
    {
        image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1600&auto=format&fit=crop",
        badge: { pt: "AMBIENTE E ALMA", en: "AMBIANCE & SOUL" },
        title1: { pt: "Espaços ideais para ", en: "Ideal spaces to " },
        highlight: { pt: "comer", en: "eat" },
        title2: { pt: " em boa companhia.", en: " in great company." },
        subtitle: { pt: "Encontre o ambiente ideal para criar memórias inesquecíveis.", en: "Find the ideal atmosphere to create unforgettable memories." }
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

    // Set dynamic slide-specific glow and border colors for Option C header integration
    useEffect(() => {
        const colors = [
            { glow: 'rgba(212, 175, 55, 0.18)', border: 'rgba(212, 175, 55, 0.35)' }, // Gold
            { glow: 'rgba(230, 138, 0, 0.14)', border: 'rgba(230, 138, 0, 0.28)' },   // Amber
            { glow: 'rgba(0, 154, 68, 0.12)', border: 'rgba(0, 154, 68, 0.25)' },     // Emerald Green
            { glow: 'rgba(255, 107, 107, 0.14)', border: 'rgba(255, 107, 107, 0.30)' } // Coral Rose
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
            className="w-full max-w-7xl mx-auto px-4 mt-4 md:mt-6 mb-4 md:mb-5 select-none"
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onMouseMove={(e) => handleDragMove(e.clientX)}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
            onTouchEnd={handleDragEnd}
        >
            <div className="relative w-full h-[260px] sm:h-[300px] md:h-[340px] lg:h-[360px] rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-premium bg-stone-900 group">
                
                {/* Drag hint overlay (subtle transform matching drag progress) */}
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
                                    alt="Locais de Moz premium ambience"
                                    className={`w-full h-full object-cover transition-transform ease-out select-none pointer-events-none ${
                                        isActive ? 'scale-[1.06] duration-[6500ms]' : 'scale-100 duration-500'
                                    }`}
                                    draggable={false}
                                />
                                
                                {/* Responsive Vignette Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30 md:to-transparent z-10 pointer-events-none" />

                                {/* Slide Content Panel */}
                                <div className="absolute inset-0 z-20 flex items-center pl-[7%] sm:pl-[8%] md:pl-[10%] pr-6">
                                    <div className="w-full max-w-[420px] lg:max-w-[500px] flex flex-col items-start text-left pointer-events-auto">
                                        
                                        {/* Dynamic Category/Highlight Gold Badge */}
                                        <span className="inline-block bg-[#D4AF37]/15 text-[#E6C762] border border-[#D4AF37]/35 px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold tracking-[0.25em] mb-2 sm:mb-3 uppercase backdrop-blur-xs select-none">
                                            {isPt ? slide.badge.pt : slide.badge.en}
                                        </span>

                                        {/* Elegantly styled serif display text with primary Gold emphasis */}
                                        <h1 className="font-display font-medium text-white leading-[1.1] tracking-tight text-[26px] sm:text-[34px] md:text-[42px] lg:text-[48px]">
                                            {isPt ? slide.title1.pt : slide.title1.en}
                                            <span className="text-[#D4AF37] font-semibold">
                                                {isPt ? slide.highlight.pt : slide.highlight.en}
                                            </span>
                                            {isPt ? slide.title2.pt : slide.title2.en}
                                        </h1>

                                        {/* Premium subtle description */}
                                        <p className="text-white/80 dark:text-white/70 text-xs sm:text-sm md:text-[16px] font-light mt-2 sm:mt-3 mb-4 sm:mb-5 leading-relaxed max-w-[380px] sm:max-w-none select-none">
                                            {isPt ? slide.subtitle.pt : slide.subtitle.en}
                                        </p>

                                        {/* Custom styled Gold CTA outline button */}
                                        <button
                                            onClick={handleCtaClick}
                                            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-white/20 hover:border-[#D4AF37]/75 bg-black/30 hover:bg-black/50 text-white font-body text-[10px] sm:text-[11px] font-bold tracking-widest uppercase transition-all duration-300 transform active:scale-95 flex items-center gap-2 hover:shadow-[0_0_15px_rgba(212,175,55,0.25)] cursor-pointer"
                                        >
                                            {isPt ? 'Explorar Agora' : 'Explore Now'}
                                            <span className="text-[#D4AF37] group-hover:translate-x-1 transition-transform">→</span>
                                        </button>

                                    </div>
                                </div>

                            </div>
                        );
                    })}
                </div>

                {/* Miniature Gold Pagination Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 select-none">
                    {SLIDES.map((_, idx) => {
                        const isActive = idx === currentIndex;
                        return (
                            <button
                                key={idx}
                                onClick={() => navigateTo(idx)}
                                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                    isActive 
                                        ? 'w-6 bg-[#D4AF37]' 
                                        : 'w-1.5 bg-white/40 hover:bg-white/70'
                                }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default HeroSlideshow;
