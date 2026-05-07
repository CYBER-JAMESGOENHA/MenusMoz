import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  const cn = className || "w-full h-full";
  return (
    <div className={`bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl ${cn}`} />
  );
};

export const RestaurantCardSkeleton: React.FC = () => (
    <div className="bg-white dark:bg-neutral-900/40 rounded-[32px] p-3 border border-neutral-100 dark:border-white/5 shadow-sm h-full flex flex-col animate-pulse">
        {/* Image Placeholder */}
        <div className="aspect-[4/3] w-full bg-neutral-200 dark:bg-neutral-800 rounded-[24px]" />
        
        <div className="mt-4 px-1 pb-1 flex flex-col gap-3">
            {/* Header: Logo & Name */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 shrink-0" />
                    <div className="flex flex-col gap-1.5">
                        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 w-32 rounded" />
                        <div className="h-3 bg-neutral-100 dark:bg-neutral-800/50 w-20 rounded" />
                    </div>
                </div>
                <div className="w-10 h-6 bg-amber-100/50 dark:bg-amber-900/20 rounded-lg" />
            </div>

            {/* Location placeholder */}
            <div className="h-3 bg-neutral-100 dark:bg-neutral-800/50 w-40 rounded ml-1" />

            {/* CTA Placeholder */}
            <div className="mt-2 h-10 bg-neutral-50 dark:bg-white/5 rounded-xl border border-neutral-100 dark:border-white/5" />
        </div>
    </div>
);

export const DetailSkeleton: React.FC = () => (
  <div className="pb-32 bg-bg overflow-hidden">
    <div className="h-[45vh] md:h-[65vh] bg-gray-200 dark:bg-gray-800 animate-pulse relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
    </div>
    <div className="max-w-7xl mx-auto px-4 -mt-20 md:-mt-32 relative z-10 animate-pulse">
        <div className="bg-surface rounded-[3.5rem] p-12 md:p-20 shadow-2xl h-[800px] border border-border-subtle relative">
            <div className="absolute top-10 right-10 w-24 h-24 bg-gray-200/50 dark:bg-gray-800/50 rounded-full" />
            <div className="h-16 bg-gray-200 dark:bg-gray-800 w-1/2 rounded-2xl mb-10" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 w-1/4 rounded-lg mb-16" />
            
            <div className="space-y-12 mb-20">
                <div className="h-32 bg-gray-200 dark:bg-gray-800 w-full rounded-3xl" />
                <div className="h-32 bg-gray-200 dark:bg-gray-800 w-full rounded-3xl" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <div className="h-10 bg-gray-200 dark:bg-gray-800 w-1/3 rounded-xl" />
                    <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-[3rem]" />
                </div>
                <div className="space-y-6">
                    <div className="h-10 bg-gray-200 dark:bg-gray-800 w-1/3 rounded-xl" />
                    <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-[3rem]" />
                </div>
            </div>
        </div>
    </div>
  </div>
);
