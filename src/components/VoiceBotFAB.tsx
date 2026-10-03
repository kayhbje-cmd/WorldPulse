// src/components/VoiceBotFAB.tsx
import React from 'react';
import { Mic } from 'lucide-react';

interface Props {
  onClick: () => void;
  className?: string;
}

export const VoiceBotFAB: React.FC<Props> = ({ onClick, className }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      aria-label="Open voice assistant"
      className={
        className ||
        "fixed right-4 bottom-20 z-40 w-13 h-13 rounded-full bg-linear-to-r from-emerald-600 to-emerald-700 text-white shadow-xl shadow-emerald-700/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-emerald-500/20"
      }
    >
      <div className="relative">
        <Mic size={22} className="relative z-10" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-white animate-ping" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-white" />
      </div>
    </button>
  );
};
