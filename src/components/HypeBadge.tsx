// src/components/HypeBadge.tsx
import React from 'react';
import { Flame } from 'lucide-react';

interface HypeBadgeProps {
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  showTier?: boolean;
  className?: string;
}

export const HypeBadge: React.FC<HypeBadgeProps> = ({
  score = 1,
  size = 'md',
  showTier = true,
  className = '',
}) => {
  // Determine Hype Attention Level
  const getTierInfo = (s: number) => {
    if (s >= 51) {
      return {
        label: 'High Attention',
        badgeBg: 'bg-red-50 text-red-800 border-red-300 ring-1 ring-red-300/40',
        flameColor: 'text-red-600 fill-red-500',
        dotColor: 'bg-red-500',
      };
    }
    if (s >= 11) {
      return {
        label: 'Growing',
        badgeBg: 'bg-orange-50 text-orange-800 border-orange-200 ring-1 ring-orange-200/40',
        flameColor: 'text-orange-600 fill-orange-400',
        dotColor: 'bg-orange-500',
      };
    }
    return {
      label: 'Community Notice',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
      flameColor: 'text-amber-600',
      dotColor: 'bg-amber-400',
    };
  };

  const tier = getTierInfo(score);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2',
  };

  return (
    <div
      title="Citizen Hype Score: Represents community reports & citizen confirmations (Distinct from official municipal severity)"
      className={`inline-flex items-center font-bold rounded-full border shadow-2xs ${tier.badgeBg} ${sizeClasses[size]} ${className}`}
    >
      <Flame size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14} className={tier.flameColor} />
      <span>Hype {score}</span>
      {showTier && (
        <>
          <span className="opacity-40">•</span>
          <span className="font-semibold opacity-90">{tier.label}</span>
        </>
      )}
    </div>
  );
};
