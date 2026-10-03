// src/components/ImageLightboxModal.tsx
import React from 'react';
import { X } from 'lucide-react';

interface Props {
  imageUrl: string | null;
  onClose: () => void;
  title?: string;
}

export const ImageLightboxModal: React.FC<Props> = ({ imageUrl, onClose, title }) => {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white/80 hover:text-white bg-black/40 p-2.5 rounded-full transition"
      >
        <X size={24} />
      </button>

      <div
        className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={title || 'Civic issue inspection image'}
          className="max-h-[80vh] w-auto max-w-full rounded-2xl shadow-2xl object-contain border border-white/10"
        />
        {title && (
          <p className="text-white/90 text-xs font-medium mt-3 bg-black/50 px-4 py-1.5 rounded-full">
            {title}
          </p>
        )}
      </div>
    </div>
  );
};
