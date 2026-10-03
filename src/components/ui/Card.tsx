// src/components/ui/Card.tsx
import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  onClick,
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-gray-100/80 shadow-xs overflow-hidden transition-all duration-200',
        (onClick || hoverable) &&
          'cursor-pointer hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5 active:translate-y-0 active:shadow-xs',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};
