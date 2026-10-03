// src/components/ComplaintStatusBadge.tsx
import React from 'react';
import { ProblemStatus } from '../types';
import { STATUS_CONFIG } from '../constants/categories';
import { useLanguage } from '../contexts/LanguageContext';
import { Clock, Eye, Wrench, CheckCircle2, AlertTriangle, MessageSquare } from 'lucide-react';

interface Props {
  status: ProblemStatus;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
}

export const ComplaintStatusBadge: React.FC<Props> = ({
  status,
  size = 'md',
  showDescription = false,
}) => {
  const { language } = useLanguage();
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.posted;

  const label =
    language === 'hi'
      ? config.label_hi
      : language === 'mr'
      ? config.label_mr
      : config.label;

  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 16 : 14;

  const renderIcon = () => {
    switch (status) {
      case 'posted':
        return <Clock size={iconSize} className="shrink-0" />;
      case 'being_helped':
        return <Eye size={iconSize} className="shrink-0" />;
      case 'in_progress':
        return <Wrench size={iconSize} className="shrink-0" />;
      case 'solved':
        return <CheckCircle2 size={iconSize} className="shrink-0" />;
      case 'escalated':
        return <AlertTriangle size={iconSize} className="shrink-0" />;
      case 'appeal':
        return <MessageSquare size={iconSize} className="shrink-0" />;
      default:
        return <Clock size={iconSize} className="shrink-0" />;
    }
  };

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
  };

  return (
    <div className="inline-flex flex-col">
      <span
        className={`inline-flex items-center rounded-full border shadow-2xs transition-colors ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeClasses[size]}`}
      >
        {renderIcon()}
        <span>{label}</span>
      </span>
      {showDescription && (
        <span className="text-[11px] text-gray-500 mt-1 pl-1">
          {config.description}
        </span>
      )}
    </div>
  );
};
