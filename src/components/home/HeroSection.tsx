import React from 'react';

interface HeroSectionProps {
    children: React.ReactNode;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ children }) => {
    return (
        <section className="relative w-full pt-16 pb-2 px-4">
            <div className="max-w-7xl mx-auto relative">
                {/* Semantic H1 - visually hidden but accessible */}
                <h1 className="sr-only">
                    Discover Maputo through food.
                </h1>

                {/* Visual heading above search area */}
                <div className="text-center mb-4">
                    <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-primary/80">
                        Discover Maputo through food.
                    </span>
                </div>

                {/* Content wrapper */}
                <div className="relative">
                    {children}
                </div>

                {/* Floating detail image placeholder - desktop only */}
                <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 w-48 h-64 pointer-events-none">
                    {/* Placeholder for floating image structure - to be implemented separately */}
                </div>
            </div>
        </section>
    );
};

export default HeroSection;