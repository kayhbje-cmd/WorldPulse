// src/components/SubmitEventModal.tsx - Simple, User-Friendly 3-Input Bhandara Upload Modal

import React, { useState, useRef } from 'react';
import { 
  X, 
  MapPin, 
  Camera, 
  User, 
  CheckCircle2, 
  Navigation, 
  Upload, 
  Sparkles,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { eventSubmissionSchema } from '../utils/validation';
import { compressImageFile } from '../utils/image';
import { eventService } from '../services/eventService';

interface SubmitEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventSubmitted?: () => void;
  onShowToast: (message: string, type?: 'success' | 'info') => void;
}

export const SubmitEventModal: React.FC<SubmitEventModalProps> = ({
  isOpen,
  onClose,
  onEventSubmitted,
  onShowToast,
}) => {
  // The 3 required inputs:
  const [userName, setUserName] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Optional coordinates if GPS is tapped
  const [coordinates, setCoordinates] = useState<{ lat: number | null; lng: number | null }>({
    lat: null,
    lng: null,
  });

  const [isLocating, setIsLocating] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedEventId, setSubmittedEventId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle image upload from phone camera or gallery
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    try {
      // Compress the image file directly on the phone/browser
      const base64 = await compressImageFile(file, 1000, 0.75);
      setImagePreview(base64);
      if (errors.image_url) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.image_url;
          return next;
        });
      }
    } catch (err) {
      console.error('Image compression error:', err);
      alert('Could not read image file. Please try another photo.');
    } finally {
      setIsCompressing(false);
    }
  };

  // One-tap GPS button to detect location
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        setCoordinates({ lat: latitude, lng: longitude });

        // If location field is empty, give it a helpful label
        if (!locationAddress.trim()) {
          setLocationAddress(`Near My Location (${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E)`);
        }
        onShowToast('GPS coordinates pinned successfully!', 'success');
      },
      (err) => {
        setIsLocating(false);
        alert(`Location permission was denied or unavailable: ${err.message}. Please type the address manually.`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      organizer_name: userName.trim(),
      address: locationAddress.trim(),
      image_url: imagePreview || '',
      latitude: coordinates.lat,
      longitude: coordinates.lng,
    };

    const result = eventSubmissionSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as string;
        fieldErrors[fieldName] = issue.message;
      });
      setErrors(fieldErrors);
      onShowToast('Please fill all 3 inputs to list this Bhandara', 'info');
      return;
    }

    setIsSubmitting(true);
    try {
      const newEvent = await eventService.submitEvent(result.data);
      setIsSubmitting(false);
      setSubmittedEventId(newEvent.id);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#ea580c', '#f59e0b', '#fbbf24', '#ffffff'],
        });
      } catch {
        // Safe if confetti fails
      }

      onShowToast('Bhandara location listed and live!', 'success');
      if (onEventSubmitted) onEventSubmitted();
    } catch (err: any) {
      setIsSubmitting(false);
      alert(`Submission failed: ${err.message}`);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedEventId(null);
    setUserName('');
    setLocationAddress('');
    setImagePreview(null);
    setCoordinates({ lat: null, lng: null });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-[#FDFBF7] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-orange-100 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white flex items-center justify-between shadow-sm">
          <div className="space-y-0.5">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-semibold">
              <Sparkles className="w-3 h-3 text-amber-200" />
              <span>Easy Community Upload</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Outfit']">
              Upload Bhandara Location
            </h2>
            <p className="text-xs text-orange-100">
              Only 3 simple inputs — published live immediately!
            </p>
          </div>

          <button
            onClick={handleResetAndClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {submittedEventId ? (
          /* Confirmation Screen */
          <div className="p-7 text-center space-y-5 my-auto">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-2xl font-extrabold text-[#291809] font-['Outfit']">
                Bhandara Location Live!
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
                Thank you, <strong>{userName}</strong>! The Bhandara is now visible to everyone with Google Maps directions.
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 max-w-sm mx-auto text-left space-y-1.5 text-xs text-emerald-950">
              <div className="flex items-center space-x-1.5 font-bold text-emerald-800">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>{locationAddress}</span>
              </div>
              <p className="text-[11px] text-stone-600">
                Status: 🟢 Published immediately on community map
              </p>
            </div>

            <button
              onClick={handleResetAndClose}
              className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 shadow-md transition-all cursor-pointer"
            >
              Done & View on Map
            </button>
          </div>
        ) : (
          /* 3-Input Form */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
            {/* Input 1: User Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800 flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-orange-600" />
                <span>1. Your Name / Mandal Name *</span>
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                  if (errors.organizer_name) {
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.organizer_name;
                      return next;
                    });
                  }
                }}
                placeholder="e.g. Ramesh Patil or Shivaji Mandal"
                className={`w-full px-3.5 py-3 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
                  errors.organizer_name ? 'border-rose-400 bg-rose-50/30' : 'border-stone-300'
                }`}
              />
              {errors.organizer_name && (
                <p className="text-[11px] text-rose-600">{errors.organizer_name}</p>
              )}
            </div>

            {/* Input 2: Bhandara Location */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-800 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-600" />
                  <span>2. Bhandara Location & Landmark *</span>
                </label>

                {/* One-tap GPS button */}
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  disabled={isLocating}
                  className="inline-flex items-center space-x-1 text-[11px] font-bold text-orange-700 hover:text-orange-900 bg-orange-100/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  <Navigation className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? 'Locating...' : '📍 Use My GPS'}</span>
                </button>
              </div>

              <textarea
                rows={2}
                value={locationAddress}
                onChange={(e) => {
                  setLocationAddress(e.target.value);
                  if (errors.address) {
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.address;
                      return next;
                    });
                  }
                }}
                placeholder="e.g. Near Ambadevi Mandir, Gandhi Chowk, Amravati"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
                  errors.address ? 'border-rose-400 bg-rose-50/30' : 'border-stone-300'
                }`}
              />
              {coordinates.lat && coordinates.lng && (
                <p className="text-[11px] text-emerald-700 font-medium">
                  ✓ GPS Coordinates Pinned: {coordinates.lat.toFixed(4)}° N, {coordinates.lng.toFixed(4)}° E
                </p>
              )}
              {errors.address && (
                <p className="text-[11px] text-rose-600">{errors.address}</p>
              )}
            </div>

            {/* Input 3: Real Image Uploading from Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800 flex items-center space-x-1.5">
                <Camera className="w-3.5 h-3.5 text-orange-600" />
                <span>3. Real Photo of the Bhandara / Food Seva *</span>
              </label>

              {/* Hidden file input supporting phone camera and gallery */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Image Picker / Preview Card */}
              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-orange-400 bg-stone-100 group">
                  <img
                    src={imagePreview}
                    alt="Bhandara preview"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-1.5 bg-white text-stone-900 rounded-xl text-xs font-bold shadow-md cursor-pointer hover:bg-stone-100"
                    >
                      Change Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="px-3.5 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer hover:bg-rose-700"
                    >
                      Remove
                    </button>
                  </div>
                  <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[11px] font-semibold px-2 py-0.5 rounded-lg">
                    ✓ Photo Ready
                  </span>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-orange-50/60 ${
                    errors.image_url
                      ? 'border-rose-400 bg-rose-50/20'
                      : 'border-orange-300 bg-orange-50/30'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-2">
                    {isCompressing ? (
                      <RefreshCw className="w-6 h-6 animate-spin" />
                    ) : (
                      <Camera className="w-6 h-6" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-stone-800 block">
                    {isCompressing ? 'Processing photo...' : 'Tap to take photo or choose from gallery'}
                  </span>
                  <span className="text-[11px] text-stone-500 block mt-0.5">
                    Upload real photo of the food distribution, banner, or mandal
                  </span>
                </div>
              )}

              {errors.image_url && (
                <p className="text-[11px] text-rose-600">{errors.image_url}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || isCompressing}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-700 hover:to-amber-700 shadow-md shadow-orange-600/30 transition-all cursor-pointer disabled:opacity-50 transform hover:-translate-y-0.5"
              >
                {isSubmitting ? 'Posting Location...' : '🚀 Post Bhandara Location Now'}
              </button>
              <p className="text-[11px] text-stone-400 text-center mt-2">
                Instantly published • No sign-up required • Free for everyone
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
