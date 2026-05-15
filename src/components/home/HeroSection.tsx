import React from 'react';

export const HERO_HEADLINES = {
    discover: 'Discover Maputo through food.',
    where: 'Where Maputo goes out.',
    tables: 'The city\'s best tables.',
} as const;

export type HeroHeadlineKey = keyof typeof HERO_HEADLINES;

interface HeroSectionProps {
    children: React.ReactNode;
    headline?: HeroHeadlineKey;
    floatingImageSrc?: string;
}

// Active headline: 'discover' | 'where' | 'tables'
export const HeroSection: React.FC<HeroSectionProps> = ({ children, headline = 'discover', floatingImageSrc }) => {
    return (
        <section className="relative w-full pt-6 pb-1 px-4">
            <div className="max-w-7xl mx-auto relative">
                <h1 className="text-center mb-2 font-normal text-[18px] md:text-[20px] text-text-main/70">
                    {HERO_HEADLINES[headline]}
                </h1>

                {/* Content wrapper */}
                <div className="relative">
                    {children}
                </div>

                {/* Floating detail image - desktop only */}
                {floatingImageSrc && (
                    <div className="hidden md:block hero-floating-essence absolute -right-4 top-1/2 -translate-y-1/2 w-48 h-64 pointer-events-none">
                        <div className="hero-floating-essence-img pebble-mask w-full h-full opacity-90">
                            <img 
                                src={floatingImageSrc} 
                                alt="Hero detail" 
                                loading="lazy"
                                decoding="async"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default HeroSection;