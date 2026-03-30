import React from 'react';

/**
 * Skeleton loader for the HorizontalCarousel restaurant cards.
 * Matches the card dimensions (w-[80vw] sm:w-[260px] lg:w-[280px]) so the layout
 * doesn't jump when real data loads.
 */
export const CarouselSkeleton = ({ count = 5 }) => (
    <div className="flex overflow-x-hidden gap-4 lg:gap-5 pb-4 pt-1">
        {Array.from({ length: count }).map((_, i) => (
            <div
                key={i}
                className="shrink-0 w-[80vw] sm:w-[260px] lg:w-[280px] rounded-2xl overflow-hidden border border-border-subtle bg-surface animate-pulse"
                style={{ animationDelay: `${i * 80}ms` }}
            >
                {/* Image placeholder */}
                <div className="h-[150px] sm:h-[160px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 relative">
                    {/* Shimmer sweep */}
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                </div>
                {/* Content placeholder */}
                <div className="p-3 sm:p-4 space-y-3">
                    {/* Name row */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full flex-1" />
                        <div className="h-5 w-12 bg-gray-100 dark:bg-gray-800 rounded-full shrink-0" />
                    </div>
                    {/* Category */}
                    <div className="h-3 w-28 bg-gray-100 dark:bg-gray-800 rounded-full" />
                    {/* Footer row */}
                    <div className="flex items-center justify-between pt-2 border-t border-border-subtle/40 mt-1">
                        <div className="h-8 w-24 bg-gray-100 dark:bg-gray-800 rounded-lg" />
                        <div className="h-6 w-20 bg-gray-100 dark:bg-gray-800 rounded-lg" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

/**
 * A skeleton for the full page loading state — title + skeleton cards.
 */
export const CarouselSectionSkeleton = ({ title = '' }) => (
    <div className="max-w-7xl mx-auto px-4 mt-8 mb-4">
        {/* Title */}
        <div className="h-7 w-40 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mb-2" />
        <div className="h-3 w-32 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse mb-4" />
        <CarouselSkeleton />
    </div>
);
