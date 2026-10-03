// src/components/ui/Button.tsx
import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    'font-semibold rounded-xl transition-all duration-150 inline-flex items-center justify-center select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100';

  const variants = {
    primary:
      'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-700/20 active:bg-emerald-800',
    secondary:
      'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 active:bg-emerald-200',
    outline:
      'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100',
    ghost:
      'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200',
    danger:
      'bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-700/20 active:bg-red-800',
    success:
      'bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm active:bg-emerald-900',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
    icon: 'p-2.5 text-sm aspect-square',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};
