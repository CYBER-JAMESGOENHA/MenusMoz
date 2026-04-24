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
    <div className="relative bg-surface rounded-[32px] overflow-hidden border border-border-subtle h-[340px] animate-pulse flex flex-col p-8">
        {/* Top Right Badge */}
        <div className="absolute top-0 right-0 w-20 h-10 bg-gray-200 dark:bg-gray-800 rounded-bl-2xl" />

        {/* Header: Logo & Name */}
        <div className="flex items-start gap-5 mb-4">
            <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0" />
            <div className="flex-1 mt-2">
                <div className="h-8 bg-gray-200 dark:bg-gray-800 w-3/4 rounded-md mb-3" />
                <div className="flex gap-4">
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 w-16 rounded" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 w-20 rounded" />
                </div>
            </div>
        </div>

        {/* Body */}
        <div className="flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 w-full rounded mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 w-4/5 rounded" />
        </div>

        {/* Footer */}
        <div className="pt-6 flex items-center justify-between border-t border-border-subtle/30">
            <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-200 dark:bg-gray-800" />
                <div className="h-3 bg-gray-200 dark:bg-gray-800 w-20 rounded" />
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800/50" />
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
