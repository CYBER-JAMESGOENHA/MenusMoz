import React from 'react';

/**
 * Skeleton loader for the HorizontalCarousel restaurant cards.
 * Matches the card dimensions (w-[80vw] sm:w-[260px] lg:w-[280px]) so the layout
 * doesn't jump when real data loads.
 */
interface CarouselSkeletonProps {
    count?: number;
}

export const CarouselSkeleton: React.FC<CarouselSkeletonProps> = ({ count = 5 }) => (
    <div className="flex overflow-x-hidden gap-5 pb-6 pt-2">
        {Array.from({ length: count }).map((_, i) => (
            <div
                key={i}
                className="shrink-0 w-[80vw] sm:w-[260px] lg:w-[290px] rounded-[2.5rem] overflow-hidden border border-border-subtle bg-surface shadow-premium animate-pulse scale-[0.98]"
                style={{ animationDelay: `${i * 120}ms` }}
            >
                {/* Image placeholder */}
                <div className="h-[160px] sm:h-[180px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
                    {/* Shimmer sweep */}
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
                {/* Content placeholder */}
                <div className="p-6 sm:p-7 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gray-200 dark:bg-gray-700 shrink-0" />
                        <div className="space-y-2 flex-col flex-1">
                             <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-full" />
                             <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-2/3" />
                        </div>
                    </div>
                    {/* Tags row */}
                    <div className="flex gap-2 pt-2">
                        <div className="h-6 w-16 bg-gray-100 dark:bg-gray-800 rounded-full" />
                        <div className="h-6 w-20 bg-gray-100 dark:bg-gray-800 rounded-full" />
                    </div>
                    {/* Footer divider */}
                    <div className="h-px w-full bg-border-subtle/50 mt-4" />
                    <div className="flex items-center justify-between">
                         <div className="h-4 w-20 bg-gray-100 dark:bg-gray-800 rounded-full" />
                         <div className="h-6 w-16 bg-accent/10 dark:bg-accent/5 rounded-full" />
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
        <div className="h-10 w-56 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse mb-3" />
        <div className="h-4 w-36 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse mb-6 ml-1" />
        <CarouselSkeleton />
    </div>
);
