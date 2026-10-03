// src/pages/tabs/Post.tsx
import React, { useState, useRef } from 'react';
import { Category, LanguageCode, Problem } from '../../types';
import { PROBLEM_CATEGORIES, PRIORITY_OPTIONS } from '../../constants/categories';
import { problemService } from '../../services/problem.service';
import { voiceService } from '../../services/voice.service';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useGeolocation } from '../../hooks/useGeolocation';
import { Button, Input } from '../../components/ui';
import { 
  Camera, 
  UploadCloud, 
  Trash2, 
  MapPin, 
  Mic, 
  MicOff, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  LocateFixed,
  Search,
  Flame
} from 'lucide-react';
import { HypeBadge } from '../../components/HypeBadge';

interface Props {
  onSuccess: (newProblem: Problem) => void;
  initialData?: { category?: string; title?: string };
}

export const PostProblem: React.FC<Props> = ({ onSuccess, initialData }) => {
  const { user } = useAuth();
  const { language, t, getCategoryName } = useLanguage();
  const { location, getLocation, loading: geoLoading } = useGeolocation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
  ]);
  const [category, setCategory] = useState<Category>(
    (initialData?.category as Category) || 'infrastructure'
  );
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('SV Road, Bandra West, Mumbai 400050');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [problemLang, setProblemLang] = useState<LanguageCode>(language);

  // Status & dictation states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDictating, setIsDictating] = useState(false);
  const [searchLocationQuery, setSearchLocationQuery] = useState('');
  const [dismissDuplicate, setDismissDuplicate] = useState(false);

  const activeLat = location?.lat || 19.0596;
  const activeLng = location?.lng || 72.8295;

  // Real-time duplicate detection: check if same category issue already exists within ~350m
  const nearbyDuplicates = React.useMemo(() => {
    if (dismissDuplicate) return [];
    return problemService.findNearbyDuplicates(category, activeLat, activeLng, 0.4);
  }, [category, activeLat, activeLng, dismissDuplicate]);

  const handleHypeDuplicate = (dup: Problem) => {
    const result = problemService.hype(
      dup.id,
      {
        id: user?.id || 'usr-1',
        name: user?.name || 'Citizen',
        avatar_url: user?.avatar_url,
      },
      description.trim() || 'Citizen confirmed and witnessed this issue at location.',
      images[0]
    );

    voiceService.speak(
      language === 'hi'
        ? 'मुद्दे को हाइप दिया गया और आपका समर्थन दर्ज हुआ'
        : language === 'mr'
        ? 'तक्रारीला समर्थन देण्यात आले'
        : 'Issue hyped with your confirmation!',
      language
    );

    onSuccess(dup);
  };

  // Handle Image Upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 5 - images.length;
    const filesToRead = Array.from(files).slice(0, remainingSlots);

    filesToRead.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Dictation via Web Speech
  const toggleDictation = () => {
    if (isDictating) {
      setIsDictating(false);
      return;
    }

    setIsDictating(true);
    voiceService.listen(
      problemLang,
      (text) => {
        setDescription((prev) => (prev ? `${prev} ${text}` : text));
        setIsDictating(false);
      },
      () => {
        setIsDictating(false);
      }
    );
  };

  // Reverse geocoding or address search
  const handleFetchAddress = async () => {
    getLocation();
    if (location) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`
        );
        const data = await res.json();
        if (data.display_name) {
          setAddress(data.display_name);
        }
      } catch {
        setAddress(`Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`);
      }
    }
  };

  const handleSearchAddress = async () => {
    if (!searchLocationQuery.trim()) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchLocationQuery + ' Maharashtra India'
        )}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        setAddress(data[0].display_name);
      }
    } catch {}
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (images.length === 0) {
      setErrorMsg('Please upload at least 1 photo of the civic issue.');
      return;
    }
    if (!title.trim()) {
      setErrorMsg('Please provide a brief title for the issue.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please describe the civic issue in detail.');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('Please provide or detect an address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const lat = location?.lat || 19.0596;
      const lng = location?.lng || 72.8295;

      const created = problemService.create({
        category,
        title: title.trim(),
        description: description.trim(),
        address: address.trim(),
        latitude: lat,
        longitude: lng,
        images,
        priority_level: priority,
        language_code: problemLang,
        user: {
          id: user?.id || 'usr-1',
          name: user?.name || 'Citizen Aarav',
          avatar_url: user?.avatar_url,
          phone: user?.phone,
        },
      });

      // Play soft speech confirmation
      voiceService.speak(
        language === 'hi'
          ? 'आपकी शिकायत सफलतापूर्वक दर्ज कर ली गई है'
          : language === 'mr'
          ? 'आपली तक्रार यशस्वीरित्या नोंदवली गेली आहे'
          : 'Complaint registered successfully',
        language
      );

      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess(created);
      }, 500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error creating problem');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-28 pt-2 px-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
          <span>{t('postTitle', 'Report Civic Issue')}</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
            JanMitra Direct
          </span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          {t('postSubtitle', 'Submit photos, exact location, and details for immediate municipal response')}
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-red-700 animate-in fade-in">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Duplicate Detection Alert Card */}
      {nearbyDuplicates.length > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-linear-to-br from-amber-50 to-orange-50/80 border-2 border-amber-300 shadow-md space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-600 shrink-0 border border-orange-200">
              <Flame size={22} className="fill-orange-500 text-orange-600 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider text-orange-900 bg-orange-200/80 px-2 py-0.5 rounded-full">
                  Similar Issue Nearby ({nearbyDuplicates[0].distanceMeters}m away)
                </span>
                <HypeBadge score={nearbyDuplicates[0].problem.hype_score} size="sm" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 mt-1 truncate">
                {nearbyDuplicates[0].problem.title}
              </h4>
              <p className="text-xs text-gray-600 line-clamp-2 mt-0.5">
                {nearbyDuplicates[0].problem.description}
              </p>
              <div className="text-[11px] text-amber-800 font-medium mt-1">
                📍 {nearbyDuplicates[0].problem.address}
              </div>
            </div>
          </div>

          <div className="bg-white/90 p-3 rounded-xl border border-amber-200 text-xs text-gray-700 space-y-2">
            <p className="font-medium text-amber-950">
              🔥 <strong>Help prevent duplicate complaints!</strong> If this is the same civic problem, add your hype & photo to this existing report to escalate municipal attention and community priority.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleHypeDuplicate(nearbyDuplicates[0].problem)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-linear-to-r from-amber-500 via-orange-500 to-red-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 hover:brightness-105 active:scale-95 transition cursor-pointer"
              >
                <Flame size={15} className="fill-white" />
                <span>Hype This Issue Instead (+1 Hype)</span>
              </button>
              <button
                type="button"
                onClick={() => setDismissDuplicate(true)}
                className="text-xs text-gray-500 hover:text-gray-700 font-semibold px-2 py-1.5 cursor-pointer"
              >
                Continue filing new complaint
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Upload Images Section */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
              {t('uploadPhotos', 'Upload Proof Photos')} ({images.length}/5)
            </label>
            <span className="text-[11px] text-emerald-700 font-semibold">JPG, PNG, HEIC</span>
          </div>

          {/* Image Previews Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 mb-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200">
                <img src={img} alt={`Proof ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-red-600 text-white rounded-md transition cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}

            {images.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50/50 flex flex-col items-center justify-center text-gray-500 hover:text-emerald-700 transition cursor-pointer"
              >
                <Camera size={20} className="mb-1" />
                <span className="text-[10px] font-bold">+ Photo</span>
              </button>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            multiple
            className="hidden"
          />

          <p className="text-[11px] text-gray-400">
            {t('uploadHint', 'Tap to select photos or take photo. Geotagged images accelerate field inspection.')}
          </p>
        </div>

        {/* 2. Category Selection (8 Grid Cards with Emojis) */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2.5">
            {t('selectCategory', 'Select Issue Category')}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PROBLEM_CATEGORIES.map((cat) => {
              const isSelected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`flex flex-col items-center text-center p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500 shadow-xs'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl mb-1.5">{cat.emoji}</span>
                  <span className={`text-xs font-bold line-clamp-1 ${isSelected ? 'text-emerald-900' : 'text-gray-800'}`}>
                    {getCategoryName(cat.id)}
                  </span>
                  <span className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">
                    {cat.description.split(',')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Title & Description with Voice Dictation */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                {t('issueTitleLabel', 'Problem Title')}
              </label>
              <span className="text-[10px] text-gray-400">{title.length}/100</span>
            </div>
            <Input
              value={title}
              maxLength={100}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('issueTitlePlaceholder', 'e.g., Deep crater pothole opposite Metro Station Gate 2')}
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                {t('issueDescLabel', 'Detailed Description')}
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleDictation}
                  className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full transition cursor-pointer ${
                    isDictating
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  {isDictating ? <MicOff size={12} /> : <Mic size={12} />}
                  <span>{isDictating ? 'Stop' : t('voiceDictate', 'Voice Dictate')}</span>
                </button>
                <span className="text-[10px] text-gray-400">{description.length}/500</span>
              </div>
            </div>
            <textarea
              value={description}
              maxLength={500}
              rows={3}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t(
                'issueDescPlaceholder',
                'Describe the hazard, size, traffic danger, duration, and landmarks...'
              )}
              className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              required
            />
          </div>
        </div>

        {/* 4. Location & Ward Selection */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
              {t('locationSection', 'Location & Ward Pin')}
            </label>
            <button
              type="button"
              onClick={handleFetchAddress}
              disabled={geoLoading}
              className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-xl transition cursor-pointer"
            >
              <LocateFixed size={13} className={geoLoading ? 'animate-spin' : ''} />
              <span>{geoLoading ? t('locating', 'Locating...') : t('useGPS', 'Use Current GPS')}</span>
            </button>
          </div>

          <div className="relative">
            <MapPin size={15} className="absolute left-3.5 top-3 text-emerald-600" />
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              className="w-full bg-white pl-10 pr-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Street address, ward number, city..."
              required
            />
          </div>

          {/* Quick search location lookup */}
          <div className="flex gap-2">
            <input
              type="text"
              value={searchLocationQuery}
              onChange={(e) => setSearchLocationQuery(e.target.value)}
              placeholder="Or search locality: Dadar, Kothrud, Hinjewadi..."
              className="flex-1 text-xs px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="button"
              onClick={handleSearchAddress}
              className="px-3 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition"
            >
              Search
            </button>
          </div>
        </div>

        {/* 5. Priority Level & Language */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              {t('prioritySection', 'Urgency / Priority Level')}
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {PRIORITY_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPriority(opt.id as any)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                    priority === opt.id
                      ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Complaint Language
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { code: 'en', flag: '🇬🇧', label: 'English' },
                { code: 'hi', flag: '🇮🇳', label: 'हिन्दी' },
                { code: 'mr', flag: '🚩', label: 'मराठी' },
              ].map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setProblemLang(l.code as any)}
                  className={`px-2 py-1.5 rounded-xl text-xs font-semibold flex flex-col items-center border transition cursor-pointer ${
                    problemLang === l.code
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-gray-200 bg-white text-gray-700'
                  }`}
                >
                  <span className="text-base">{l.flag}</span>
                  <span className="text-[11px]">{l.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Estimation Banner */}
        <div className="bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-900">
          <Sparkles size={18} className="text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">AI Municipal Cost & Schedule Estimation</span>
            <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
              {t(
                'aiCostBanner',
                'AI Smart Estimator will calculate materials, budget, and completion time instantly upon submission.'
              )}
            </p>
          </div>
        </div>

        {/* Submit CTA */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          className="w-full text-base font-bold py-3.5 shadow-md shadow-emerald-700/20"
        >
          {t('submitReport', 'Submit Complaint to JanMitra')}
        </Button>
      </form>
    </div>
  );
};
