import React from 'react';

export const NewsCardSkeleton: React.FC = () => {
  return (
    <div className="bg-[#11141c] border border-white/5 rounded-xl overflow-hidden flex flex-col h-full animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-52 skeleton-shimmer bg-[#181d28]" />

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Metadata pill skeleton */}
          <div className="flex items-center gap-2">
            <div className="w-16 h-4 bg-white/10 rounded" />
            <div className="w-24 h-4 bg-white/5 rounded" />
          </div>

          {/* Title skeleton */}
          <div className="w-full h-5 bg-white/10 rounded" />
          <div className="w-4/5 h-5 bg-white/10 rounded" />

          {/* Excerpt skeleton */}
          <div className="w-full h-3.5 bg-white/5 rounded mt-3" />
          <div className="w-3/4 h-3.5 bg-white/5 rounded" />
        </div>

        {/* Footer Skeleton */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="w-20 h-4 bg-white/10 rounded" />
          <div className="w-16 h-4 bg-white/5 rounded" />
        </div>
      </div>
    </div>
  );
};

export const HeroSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#11141c] border border-white/5 rounded-2xl overflow-hidden p-4 sm:p-6 animate-pulse">
      <div className="lg:col-span-8 space-y-4">
        <div className="w-full h-80 sm:h-96 skeleton-shimmer bg-[#181d28] rounded-xl" />
        <div className="flex items-center gap-3">
          <div className="w-20 h-5 bg-[#d4af37]/20 rounded" />
          <div className="w-28 h-4 bg-white/10 rounded" />
        </div>
        <div className="w-full h-8 bg-white/15 rounded" />
        <div className="w-3/4 h-8 bg-white/15 rounded" />
        <div className="w-full h-4 bg-white/5 rounded" />
        <div className="w-5/6 h-4 bg-white/5 rounded" />
      </div>

      <div className="lg:col-span-4 flex flex-col justify-between space-y-4 border-t lg:border-t-0 lg:border-l border-white/5 pt-4 lg:pt-0 lg:pl-6">
        <div className="w-32 h-5 bg-white/10 rounded" />
        <div className="space-y-4 flex-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 bg-white/[0.02] rounded-lg space-y-2 border border-white/5">
              <div className="w-16 h-3.5 bg-white/10 rounded" />
              <div className="w-full h-4 bg-white/10 rounded" />
              <div className="w-4/5 h-4 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const TrendingSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-4 items-start p-3 bg-[#11141c] border border-white/5 rounded-lg">
          <div className="w-8 h-8 bg-white/10 rounded font-serif text-center" />
          <div className="flex-1 space-y-2">
            <div className="w-20 h-3 bg-white/10 rounded" />
            <div className="w-full h-4 bg-white/10 rounded" />
            <div className="w-2/3 h-4 bg-white/10 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};
