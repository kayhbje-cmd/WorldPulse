// src/pages/tabs/Map.tsx
import React, { useState, useMemo } from 'react';
import { Problem } from '../../types';
import { problemService } from '../../services/problem.service';
import { PROBLEM_CATEGORIES } from '../../constants/categories';
import { MapComponent } from '../../components/MapComponent';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useLanguage } from '../../contexts/LanguageContext';
import { ComplaintStatusBadge } from '../../components/ComplaintStatusBadge';
import { formatTimeAgo } from '../../utils/formatters';
import { 
  Crosshair, 
  Search, 
  Filter, 
  MapPin, 
  SlidersHorizontal, 
  ChevronRight,
  Loader2
} from 'lucide-react';

interface Props {
  onSelectProblem: (problem: Problem) => void;
  onNavigateToPost: () => void;
}

export const MapView: React.FC<Props> = ({ onSelectProblem, onNavigateToPost }) => {
  const { t, getCategoryName } = useLanguage();
  const { location, getLocation, loading: geoLoading } = useGeolocation();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchAddress, setSearchAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchedCoords, setSearchedCoords] = useState<[number, number] | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  React.useEffect(() => {
    const unsub = problemService.subscribeToChanges(() => {
      setRefreshKey((k) => k + 1);
    });
    return () => unsub();
  }, []);

  const problems = useMemo(() => {
    return problemService.getAll({
      category: selectedCategory,
      status: selectedStatus,
    });
  }, [selectedCategory, selectedStatus, refreshKey]);

  // Center on searched coords or user location or default Mumbai center
  const mapCenter: [number, number] = useMemo(() => {
    if (searchedCoords) return searchedCoords;
    if (location) return [location.lat, location.lng];
    return [19.076, 72.8777];
  }, [searchedCoords, location]);

  const handleSearchLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchAddress.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchAddress + ' India'
        )}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const first = data[0];
        setSearchedCoords([parseFloat(first.lat), parseFloat(first.lon)]);
      }
    } catch (err) {
      console.warn('Geocoding error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCenterOnMe = () => {
    setSearchedCoords(null);
    getLocation();
  };

  return (
    <div className="relative h-[calc(100vh-125px)] w-full flex flex-col lg:flex-row overflow-hidden pb-16 lg:pb-0">
      {/* Floating Search & Filter Bar over Map */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-col gap-2 max-w-lg mx-auto pointer-events-auto">
        <form onSubmit={handleSearchLocation} className="relative shadow-md rounded-2xl">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            placeholder="Search address or area in Maharashtra..."
            className="w-full bg-white/95 backdrop-blur-md pl-10 pr-20 py-2.5 rounded-2xl border border-gray-200 text-xs text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs disabled:opacity-50"
          >
            {isSearching ? <Loader2 size={13} className="animate-spin" /> : 'Search'}
          </button>
        </form>

        {/* Category Pills on Map */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shadow-xs transition ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-white/90 backdrop-blur-xs text-gray-700 border border-gray-200 hover:bg-white'
            }`}
          >
            All Pins ({problems.length})
          </button>
          {PROBLEM_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap shadow-xs transition ${
                  isSelected
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white/90 backdrop-blur-xs text-gray-700 border border-gray-200 hover:bg-white'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{getCategoryName(cat.id)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Center on Me GPS button */}
      <button
        onClick={handleCenterOnMe}
        disabled={geoLoading}
        title="Center map on my GPS location"
        className="absolute bottom-20 lg:bottom-6 right-4 z-30 p-3 rounded-2xl bg-white text-emerald-700 shadow-lg border border-gray-200 hover:bg-emerald-50 active:scale-95 transition-all flex items-center justify-center cursor-pointer pointer-events-auto"
      >
        <Crosshair size={20} className={geoLoading ? 'animate-spin text-emerald-600' : ''} />
      </button>

      {/* Main Leaflet Map View */}
      <div className="flex-1 h-full w-full">
        <MapComponent
          problems={problems}
          center={mapCenter}
          zoom={13}
          userLocation={location}
          onSelectProblem={(p) => {
            setSelectedProblem(p);
            onSelectProblem(p);
          }}
          selectedProblemId={selectedProblem?.id}
          className="h-full w-full rounded-none"
        />
      </div>

      {/* Desktop Side Panel (Split View) */}
      <div className="hidden lg:flex w-96 bg-white border-l border-gray-200 flex-col h-full overflow-y-auto p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">
            Civic Issues in View ({problems.length})
          </h3>
          <span className="text-xs text-emerald-700 font-semibold">Active Geotags</span>
        </div>

        <div className="space-y-3">
          {problems.map((prob) => {
            const cat = PROBLEM_CATEGORIES.find((c) => c.id === prob.category);
            return (
              <div
                key={prob.id}
                onClick={() => onSelectProblem(prob)}
                className="p-3 rounded-xl border border-gray-100 hover:border-emerald-300 hover:bg-emerald-50/30 transition cursor-pointer flex gap-3 items-center"
              >
                <img
                  src={prob.images[0]}
                  alt={prob.title}
                  className="w-16 h-16 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs">{cat?.emoji}</span>
                    <span className="text-[11px] font-semibold text-gray-500 uppercase truncate">
                      {cat?.name}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 line-clamp-1">
                    {prob.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 truncate mt-0.5">
                    📍 {prob.address}
                  </p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <ComplaintStatusBadge status={prob.status} size="sm" />
                    <span className="text-[10px] text-gray-400">
                      {formatTimeAgo(prob.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
