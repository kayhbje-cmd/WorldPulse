// src/components/ui/EmptyState.tsx
import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto my-6 bg-white/70 backdrop-blur-xs rounded-3xl border border-dashed border-gray-200">
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 text-2xl">
        {icon || '🎉'}
      </div>
      <h3 className="text-base font-bold text-gray-800">{title}</h3>
      {description && <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{description}</p>}
      {actionText && onAction && (
        <Button variant="primary" size="sm" className="mt-4" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
