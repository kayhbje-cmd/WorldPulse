// src/components/ui/Skeleton.tsx
import React from 'react';
import { cn } from '../../utils/cn';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-gray-200/80', className)}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3">
      <Skeleton className="w-full h-44 rounded-xl" />
      <div className="flex gap-2">
        <Skeleton className="w-20 h-5" />
        <Skeleton className="w-16 h-5" />
      </div>
      <Skeleton className="w-3/4 h-5" />
      <Skeleton className="w-full h-4" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-16 h-7 rounded-lg" />
      </div>
    </div>
  );
};
