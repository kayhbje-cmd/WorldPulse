// src/components/VoteButton.tsx
import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { problemService } from '../services/problem.service';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  problemId: string;
  initialUpvotes: number;
  initialDownvotes?: number;
  onVoteChange?: (newUpvotes: number, newDownvotes: number) => void;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md';
}

export const VoteButton: React.FC<Props> = ({
  problemId,
  initialUpvotes,
  initialDownvotes = 0,
  onVoteChange,
  orientation = 'horizontal',
  size = 'md',
}) => {
  const { user } = useAuth();
  const userId = user?.id || 'usr-guest';

  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState<'upvote' | 'downvote' | null>(() => {
    return problemService.getUserVote(problemId, userId);
  });
  const [isAnimating, setIsAnimating] = useState(false);

  React.useEffect(() => {
    setUpvotes(initialUpvotes);
    if (initialDownvotes !== undefined) setDownvotes(initialDownvotes);
    setUserVote(problemService.getUserVote(problemId, userId));
  }, [initialUpvotes, initialDownvotes, problemId, userId]);

  React.useEffect(() => {
    const unsub = problemService.subscribeToChanges(() => {
      const p = problemService.getById(problemId);
      if (p) {
        setUpvotes(p.upvotes);
        setDownvotes(p.downvotes);
        setUserVote(problemService.getUserVote(problemId, userId));
      }
    });
    return () => unsub();
  }, [problemId, userId]);

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    const result = problemService.upvote(problemId, userId);
    setUpvotes(result.upvotes);
    setDownvotes(result.downvotes);
    setUserVote(result.userVote);
    if (onVoteChange) {
      onVoteChange(result.upvotes, result.downvotes);
    }
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    const result = problemService.downvote(problemId, userId);
    setUpvotes(result.upvotes);
    setDownvotes(result.downvotes);
    setUserVote(result.userVote);
    if (onVoteChange) {
      onVoteChange(result.upvotes, result.downvotes);
    }
  };

  const isUpvoted = userVote === 'upvote';
  const isDownvoted = userVote === 'downvote';

  const isVert = orientation === 'vertical';

  return (
    <div
      className={`inline-flex items-center bg-gray-50 border border-gray-200/80 rounded-xl p-0.5 shadow-2xs ${
        isVert ? 'flex-col' : 'flex-row'
      }`}
    >
      <button
        type="button"
        aria-label="Support this complaint"
        onClick={handleUpvote}
        className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold transition-all cursor-pointer ${
          isUpvoted
            ? 'bg-emerald-600 text-white shadow-xs'
            : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 active:scale-95'
        }`}
      >
        <ChevronUp
          size={size === 'sm' ? 14 : 16}
          className={`transition-transform duration-200 ${
            isAnimating && isUpvoted ? '-translate-y-0.5 scale-125' : ''
          }`}
        />
        <span>{upvotes}</span>
      </button>

      <div className={`bg-gray-200 ${isVert ? 'w-full h-px my-0.5' : 'h-3.5 w-px mx-0.5'}`} />

      <button
        type="button"
        aria-label="Downvote or report spam"
        onClick={handleDownvote}
        className={`flex items-center justify-center rounded-lg p-1 text-xs transition-all cursor-pointer ${
          isDownvoted
            ? 'bg-rose-100 text-rose-700'
            : 'text-gray-400 hover:text-rose-600 hover:bg-rose-50 active:scale-95'
        }`}
      >
        <ChevronDown size={size === 'sm' ? 14 : 16} />
      </button>
    </div>
  );
};
