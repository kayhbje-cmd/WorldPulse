// src/components/OfflineIndicator.tsx
import React from 'react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-amber-600/95 backdrop-blur-xs px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg animate-bounce">
      <WifiOff size={13} className="shrink-0" />
      <span>Offline Mode — Cached data active. Changes will sync.</span>
    </div>
  );
};
