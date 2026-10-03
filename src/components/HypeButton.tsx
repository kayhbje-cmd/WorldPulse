// src/components/HypeButton.tsx
import React, { useState } from 'react';
import { problemService } from '../services/problem.service';
import { useAuth } from '../contexts/AuthContext';
import { Flame, Sparkles } from 'lucide-react';

interface HypeButtonProps {
  problemId: string;
  initialHype?: number;
  hypedBy?: string[];
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  onHypeSuccess?: (newHype: number, isHyped: boolean) => void;
  className?: string;
}

export const HypeButton: React.FC<HypeButtonProps> = ({
  problemId,
  initialHype = 1,
  hypedBy = [],
  size = 'md',
  showLabel = true,
  onHypeSuccess,
  className = '',
}) => {
  const { user } = useAuth();
  const currentUserId = user?.id || 'usr-guest';

  // Check if current user has already hyped this issue
  const [isHyped, setIsHyped] = useState<boolean>(() => {
    return problemService.isHypedByUser(problemId, currentUserId);
  });

  const [hypeCount, setHypeCount] = useState<number>(initialHype);
  const [isAnimating, setIsAnimating] = useState(false);

  // Sync state if props change
  React.useEffect(() => {
    setHypeCount(initialHype);
    setIsHyped(problemService.isHypedByUser(problemId, currentUserId));
  }, [initialHype, problemId, currentUserId]);

  const handleHypeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Trigger visual flame pop animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);

    const result = problemService.hype(problemId, {
      id: currentUserId,
      name: user?.name || 'Citizen',
      avatar_url: user?.avatar_url,
    });

    setHypeCount(result.hypeScore);
    setIsHyped(result.isHyped);

    if (onHypeSuccess) {
      onHypeSuccess(result.hypeScore, result.isHyped);
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-xs sm:text-sm gap-1.5',
    lg: 'px-4 py-2.5 text-sm sm:text-base gap-2',
  };

  const iconSizes = {
    sm: 13,
    md: 15,
    lg: 18,
  };

  return (
    <button
      type="button"
      onClick={handleHypeClick}
      title={isHyped ? "You hyped this issue (Click to un-hype)" : "Hype this issue to increase community priority"}
      className={`relative inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 select-none cursor-pointer border active:scale-95 ${
        isHyped
          ? 'bg-linear-to-r from-amber-500 via-orange-500 to-red-600 text-white border-transparent shadow-md shadow-orange-500/30 hover:brightness-105'
          : 'bg-amber-50/80 hover:bg-amber-100/90 text-amber-800 border-amber-200/80 hover:border-amber-300'
      } ${sizeClasses[size]} ${className}`}
    >
      {/* Animated flame burst particles */}
      {isAnimating && (
        <span className="absolute -top-3 -right-2 flex items-center gap-0.5 text-amber-500 animate-bounce pointer-events-none">
          <Sparkles size={14} className="text-orange-400" />
          <span className="text-[10px] font-black text-red-500">+1</span>
        </span>
      )}

      <Flame
        size={iconSizes[size]}
        className={`transition-transform duration-300 ${
          isHyped ? 'fill-current text-amber-100 scale-110' : 'text-amber-600'
        } ${isAnimating ? 'animate-pulse scale-125' : ''}`}
      />

      {showLabel && (
        <span>{isHyped ? 'Hyped' : 'Hype'}</span>
      )}

      <span
        className={`ml-0.5 px-1.5 py-0.2 rounded-md text-[11px] font-black ${
          isHyped ? 'bg-black/20 text-white' : 'bg-amber-100 text-amber-900'
        }`}
      >
        {hypeCount}
      </span>
    </button>
  );
};
