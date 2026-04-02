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
    <div className="bg-surface rounded-[20px] overflow-hidden border border-border-subtle h-fit animate-pulse flex flex-col">
        {/* Image Placeholder */}
        <div className="aspect-[16/9] w-full bg-gray-200 dark:bg-gray-800" />
        
        {/* Content Placeholder */}
        <div className="p-4 sm:p-5 flex flex-col gap-3">
            {/* Title */}
            <div className="h-5 bg-gray-200 dark:bg-gray-800 w-3/4 rounded-md" />
            
            {/* Meta Row (Rating/Category) */}
            <div className="flex gap-2 items-center">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 w-12 rounded-md" />
                <div className="h-1 w-1 bg-gray-200 dark:bg-gray-800 rounded-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 w-24 rounded-md" />
            </div>

            {/* Logistics info (ETA/Dist) */}
            <div className="flex gap-3 pt-1">
                <div className="h-5 bg-gray-100 dark:bg-gray-800/50 w-20 rounded-md border border-gray-100 dark:border-gray-700/50" />
                <div className="h-5 bg-gray-100 dark:bg-gray-800/50 w-20 rounded-md border border-gray-100 dark:border-gray-700/50" />
            </div>

            {/* Price Footer */}
            <div className="mt-2.5 pt-2.5 border-t border-border-subtle/30 flex justify-between items-center">
                <div className="h-5 bg-gray-200 dark:bg-gray-800 w-28 rounded-md" />
                <div className="h-5 bg-gray-200 dark:bg-gray-800 w-5 rounded-md" />
            </div>
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
