// src/pages/EditProfile.tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Check, Camera } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const EditProfile: React.FC<Props> = ({ onBack }) => {
  const { user, updateUserProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [isSaved, setIsSaved] = useState(false);

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=160',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      phone,
      avatar_url: avatarUrl,
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onBack();
    }, 600);
  };

  return (
    <div className="pb-28 pt-2 max-w-md mx-auto px-4 space-y-5">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 text-xs font-bold shadow-2xs"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <h1 className="text-sm font-bold text-gray-900">Edit Profile</h1>
        <div className="w-12" />
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-2xs space-y-4">
        {/* Avatar Selection */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="relative">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
            />
          </div>

          <div className="flex gap-2">
            {sampleAvatars.map((url, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setAvatarUrl(url)}
                className={`w-10 h-10 rounded-full overflow-hidden border-2 transition ${
                  avatarUrl === url ? 'border-emerald-600 ring-2 ring-emerald-200' : 'border-gray-200 opacity-60'
                }`}
              >
                <img src={url} alt={`Choice ${i}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
            Phone Number (For municipal SMS alerts)
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5"
        >
          {isSaved ? <Check size={14} /> : null}
          <span>{isSaved ? 'Saved Successfully!' : 'Save Profile Changes'}</span>
        </button>
      </form>
    </div>
  );
};
