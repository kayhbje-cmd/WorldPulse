// src/components/Toast.tsx - Toast notifications

import React, { useEffect } from 'react';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full px-3">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: () => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const type = toast.type || 'info';

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
    info: <Info className="w-4 h-4 text-orange-600 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-950',
    info: 'border-orange-200 bg-orange-50 text-orange-950',
    error: 'border-rose-200 bg-rose-50 text-rose-950',
  };

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between p-3 rounded-2xl border shadow-lg backdrop-blur-md animate-in slide-in-from-bottom-2 fade-in duration-200 text-xs font-semibold ${borders[type]}`}
    >
      <div className="flex items-center space-x-2.5">
        {icons[type]}
        <span>{toast.message}</span>
      </div>
      <button
        onClick={onDismiss}
        className="ml-2 p-1 rounded-full hover:bg-black/5 text-stone-500"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
