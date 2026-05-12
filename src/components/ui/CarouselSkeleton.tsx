import React from 'react';

/**
 * Skeleton loader for the HorizontalCarousel restaurant cards.
 * Matches the new premium card design.
 */
interface CarouselSkeletonProps {
    count?: number;
}

export const CarouselSkeleton: React.FC<CarouselSkeletonProps> = ({ count = 5 }) => (
    <div className="flex overflow-x-hidden gap-5 pb-6 pt-2">
        {Array.from({ length: count }).map((_, i) => (
            <div
                key={i}
                className="shrink-0 w-[85vw] sm:w-[270px] lg:w-[300px] rounded-3xl overflow-hidden border border-neutral-100 dark:border-white/[0.06] bg-white dark:bg-[#0A0A0A] shadow-[0_2px_12px_rgba(0,0,0,0.04)] animate-pulse"
                style={{ animationDelay: `${i * 120}ms` }}
            >
                {/* Image Skeleton — Warm Atmospheric */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-[#1a1714] dark:via-[#1f1b18] dark:to-[#181615]">
                        {/* Subtle pattern overlay */}
                        <div className="absolute inset-0 opacity-20" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                        }} />
                    </div>
                    {/* Shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-[shimmer_2s_infinite]" />
                    {/* Cuisine badge placeholder */}
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-sm">
                        <div className="h-3 w-16 rounded-full bg-neutral-200/70 dark:bg-neutral-700/50" />
                    </div>
                </div>

                {/* Content Skeleton */}
                <div className="p-4 pb-3 space-y-3">
                    {/* Header Row */}
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            {/* Logo skeleton */}
                            <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800" />
                            <div className="space-y-1.5">
                                <div className="h-4 w-24 rounded-full bg-neutral-100 dark:bg-neutral-800" />
                                <div className="h-2 w-16 rounded-full bg-neutral-50 dark:bg-neutral-900" />
                            </div>
                        </div>
                        {/* Rating skeleton */}
                        <div className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/30">
                            <div className="h-3 w-8 rounded bg-amber-100/50 dark:bg-amber-800/20" />
                        </div>
                    </div>
                    
                    {/* Location Row */}
                    <div className="flex items-center gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                        <div className="h-3 w-20 rounded-full bg-neutral-100 dark:bg-neutral-800" />
                    </div>

                    {/* CTA Skeleton */}
                    <div className="mt-1">
                        <div className="w-full py-2.5 rounded-xl bg-neutral-50/80 dark:bg-white/[0.02] border border-neutral-100 dark:border-white/[0.05]">
                            <div className="h-3 w-24 mx-auto rounded-full bg-neutral-200/60 dark:bg-neutral-700/40" />
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

/**
 * A skeleton for the full page loading state — title + skeleton cards.
 */
interface CarouselSectionSkeletonProps {
    title?: string;
}

export const CarouselSectionSkeleton: React.FC<CarouselSectionSkeletonProps> = ({ title = '' }) => (
    <div className="max-w-7xl mx-auto px-4 mt-12 mb-8">
        {/* Title */}
        <div className="flex items-center gap-4 mb-6">
            <div className="w-1 h-10 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
            <div className="space-y-2">
                <div className="h-8 w-48 bg-neutral-100 dark:bg-neutral-800 rounded-2xl" />
                <div className="h-3 w-32 bg-neutral-50 dark:bg-neutral-900 rounded-full" />
            </div>
        </div>
        <CarouselSkeleton />
    </div>
);