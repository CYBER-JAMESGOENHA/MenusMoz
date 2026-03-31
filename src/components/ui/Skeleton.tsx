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
  <div className="bg-surface rounded-3xl overflow-hidden shadow-premium aspect-[4/5] relative animate-pulse group">
    <div className="w-full h-full bg-gray-200 dark:bg-gray-800" />
    <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/20 via-transparent to-transparent">
      <div className="h-10 bg-white/10 w-3/4 rounded-xl mb-3" />
      <div className="h-5 bg-white/5 w-1/2 rounded-lg" />
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
