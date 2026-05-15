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
}

export const HeroSection: React.FC<HeroSectionProps> = ({ children, headline = 'discover' }) => {
    return (
        <section className="relative w-full pt-12 md:pt-16 pb-2 px-4">
            <div className="max-w-7xl mx-auto relative">
                <h1 className="text-center mb-4 font-normal text-[22px] md:text-[24px] tracking-wide text-primary/80">
                    {HERO_HEADLINES[headline]}
                </h1>

                {/* Content wrapper */}
                <div className="relative">
                    {children}
                </div>

                {/* Floating detail image placeholder - desktop only */}
                <div className="hidden md:block hero-floating-essence absolute -right-4 top-1/2 -translate-y-1/2 w-48 h-64 pointer-events-none">
                    <div className="hero-floating-essence-img pebble-mask w-full h-full opacity-90">
                        {/* Placeholder for floating image - to be implemented separately */}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;