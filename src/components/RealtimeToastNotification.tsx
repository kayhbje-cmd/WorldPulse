// src/components/RealtimeToastNotification.tsx
import React, { useState, useEffect } from 'react';
import { realtimeService } from '../services/realtime.service';
import { Sparkles, ThumbsUp, Wrench, X, Bell } from 'lucide-react';
import { Problem } from '../types';

interface ToastData {
  id: string;
  type: 'created' | 'voted' | 'status';
  title: string;
  message: string;
  problemId?: string;
}

export const RealtimeToastNotification: React.FC<{
  onViewProblem?: (problemId: string) => void;
}> = ({ onViewProblem }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    const unsubscribe = realtimeService.subscribe((event) => {
      if (event.type === 'problem:created' && event.problem) {
        const newToast: ToastData = {
          id: `toast-${Date.now()}`,
          type: 'created',
          title: `⚡ Live Issue Uploaded by ${event.author || 'Citizen'}!`,
          message: event.problem.title,
          problemId: event.problem.id,
        };
        setToasts((prev) => [newToast, ...prev.slice(0, 2)]);
        autoDismiss(newToast.id);
      } else if (event.type === 'problem:voted') {
        const newToast: ToastData = {
          id: `toast-${Date.now()}`,
          type: 'voted',
          title: `👍 Real-time Like Received!`,
          message: `Complaint received an upvote! Now at ${event.upvotes} votes.`,
          problemId: event.problemId,
        };
        setToasts((prev) => [newToast, ...prev.slice(0, 2)]);
        autoDismiss(newToast.id);
      } else if (event.type === 'problem:status_updated') {
        const newToast: ToastData = {
          id: `toast-${Date.now()}`,
          type: 'status',
          title: `🛠️ Status Updated by ${event.officerName || 'Officer'}`,
          message: `Status changed to ${event.problem.status.toUpperCase()}`,
          problemId: event.problem.id,
        };
        setToasts((prev) => [newToast, ...prev.slice(0, 2)]);
        autoDismiss(newToast.id);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const autoDismiss = (id: string) => {
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-16 left-4 right-4 z-50 pointer-events-none flex flex-col items-center gap-2 max-w-md mx-auto">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => {
            if (toast.problemId && onViewProblem) {
              onViewProblem(toast.problemId);
            }
            removeToast(toast.id);
          }}
          className="pointer-events-auto w-full bg-gray-900/95 text-white backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-white/10 flex items-center gap-3 cursor-pointer hover:bg-black transition animate-in slide-in-from-top duration-300"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
            {toast.type === 'voted' ? (
              <ThumbsUp size={16} />
            ) : toast.type === 'status' ? (
              <Wrench size={16} />
            ) : (
              <Sparkles size={16} />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-black text-emerald-400 leading-tight">
              {toast.title}
            </h4>
            <p className="text-[11px] text-gray-300 truncate mt-0.5">
              {toast.message}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              removeToast(toast.id);
            }}
            className="text-gray-400 hover:text-white p-1"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
