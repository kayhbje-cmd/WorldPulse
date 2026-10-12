// src/App.tsx - Bhandara Finder Main Application

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  UtensilsCrossed, 
  Calendar, 
  PlusCircle, 
  RotateCcw, 
  CheckCircle2, 
  Search, 
  Flame, 
  Clock, 
  MapPin, 
  HeartHandshake,
  AlertCircle
} from 'lucide-react';
import { BhandaraEvent, FilterState, UserLocation } from './types';
import { eventService } from './services/eventService';
import { getEventLiveStatus } from './utils/status';
import { getDistanceFromLatLonInKm } from './utils/geo';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { EventCard } from './components/EventCard';
import { EventDetailsModal } from './components/EventDetailsModal';
import { SubmitEventModal } from './components/SubmitEventModal';
import { ReportModal } from './components/ReportModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { ToastContainer, ToastMessage } from './components/Toast';

export function App() {
  // Events & Loading State
  const [events, setEvents] = useState<BhandaraEvent[]>([]);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'all',
    timeFilter: 'all',
    locality: '',
    sortBy: 'upcoming',
  });

  // Debounced search text
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Geolocation State
  const [userLocation, setUserLocation] = useState<UserLocation>({
    latitude: null,
    longitude: null,
    isLoading: false,
    error: null,
  });

  // Modals & Active Selections
  const [selectedEvent, setSelectedEvent] = useState<BhandaraEvent | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [reportingEvent, setReportingEvent] = useState<BhandaraEvent | null>(null);

  // Toast feedback
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      message,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(filters.searchQuery);
    }, 250);
    return () => clearTimeout(handler);
  }, [filters.searchQuery]);

  // Load events & listen to updates from eventService
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [approved, pending] = await Promise.all([
        eventService.getApprovedEvents(),
        eventService.getPendingEvents(),
      ]);
      setEvents(approved);
      setPendingCount(pending.length);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = eventService.subscribe(() => {
      loadData();
    });
    return () => unsubscribe();
  }, []);

  // Request user Geolocation only upon explicit button click
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setUserLocation({
        latitude: null,
        longitude: null,
        isLoading: false,
        error: 'Geolocation is not supported by your browser.',
      });
      return;
    }

    setUserLocation((prev) => ({ ...prev, isLoading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setUserLocation({
          latitude,
          longitude,
          accuracy,
          isLoading: false,
          error: null,
        });
        // Switch sort to nearest automatically
        setFilters((prev) => ({ ...prev, sortBy: 'nearest' }));
        addToast('Acquired location! Showing nearest Bhandara events.', 'success');
      },
      (err) => {
        let msg = 'Could not access location.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Location permission was denied. You can search manually by locality.';
        } else if (err.code === err.TIMEOUT) {
          msg = 'Location request timed out. Please try again.';
        }
        setUserLocation({
          latitude: null,
          longitude: null,
          isLoading: false,
          error: msg,
        });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleClearLocation = () => {
    setUserLocation({
      latitude: null,
      longitude: null,
      isLoading: false,
      error: null,
    });
    if (filters.sortBy === 'nearest') {
      setFilters((prev) => ({ ...prev, sortBy: 'upcoming' }));
    }
    addToast('GPS location cleared.', 'info');
  };

  // Filter and sort events
  const processedEvents = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];

    // Calculate distance for all events if GPS coordinates are present
    const withDistances = events.map((event) => {
      let distance_km: number | undefined = undefined;
      if (
        userLocation.latitude !== null &&
        userLocation.longitude !== null &&
        event.latitude &&
        event.longitude
      ) {
        distance_km = getDistanceFromLatLonInKm(
          userLocation.latitude,
          userLocation.longitude,
          event.latitude,
          event.longitude
        );
      }
      return { ...event, distance_km };
    });

    // Apply Filters
    const filtered = withDistances.filter((event) => {
      const liveStatus = getEventLiveStatus(event);

      // Search Query filter (title, locality, venue, address, menu, organizer)
      if (debouncedSearch.trim()) {
        const q = debouncedSearch.toLowerCase();
        const matchesText =
          event.title.toLowerCase().includes(q) ||
          event.locality.toLowerCase().includes(q) ||
          event.venue_name.toLowerCase().includes(q) ||
          event.address.toLowerCase().includes(q) ||
          event.menu_details.toLowerCase().includes(q) ||
          event.organizer_name.toLowerCase().includes(q);

        if (!matchesText) return false;
      }

      // Category filter
      if (filters.category !== 'all' && event.category !== filters.category) {
        return false;
      }

      // Time / Status filter
      if (filters.timeFilter === 'today') {
        if (event.event_date !== todayStr) return false;
      } else if (filters.timeFilter === 'currently_serving') {
        if (liveStatus !== 'currently_serving') return false;
      } else if (filters.timeFilter === 'upcoming') {
        if (liveStatus !== 'upcoming') return false;
      } else if (filters.timeFilter === 'completed') {
        if (liveStatus !== 'completed') return false;
      }

      // Locality filter
      if (filters.locality && event.locality !== filters.locality) {
        return false;
      }

      return true;
    });

    // Apply Sorting
    return filtered.sort((a, b) => {
      if (filters.sortBy === 'nearest') {
        if (a.distance_km !== undefined && b.distance_km !== undefined) {
          return a.distance_km - b.distance_km;
        }
        if (a.distance_km !== undefined) return -1;
        if (b.distance_km !== undefined) return 1;
      }

      if (filters.sortBy === 'recently_added') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }

      // Default: Upcoming date & time
      const dateDiff = a.event_date.localeCompare(b.event_date);
      if (dateDiff !== 0) return dateDiff;
      return a.start_time.localeCompare(b.start_time);
    });
  }, [events, debouncedSearch, filters, userLocation]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.searchQuery !== '' ||
      filters.category !== 'all' ||
      filters.timeFilter !== 'all' ||
      filters.locality !== '' ||
      filters.sortBy !== 'upcoming' ||
      userLocation.latitude !== null
    );
  }, [filters, userLocation]);

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'all',
      timeFilter: 'all',
      locality: '',
      sortBy: 'upcoming',
    });
    handleClearLocation();
  };

  // Find events currently serving right now
  const currentlyServingEvents = useMemo(() => {
    return events.filter((e) => getEventLiveStatus(e) === 'currently_serving');
  }, [events]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] selection:bg-orange-200 selection:text-orange-950">
      {/* 1. Responsive Navbar */}
      <Navbar
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        totalListingsCount={events.length}
      />

      {/* 2. Hero Section */}
      <Hero
        searchQuery={filters.searchQuery}
        onSearchChange={(query) => setFilters((prev) => ({ ...prev, searchQuery: query }))}
        userLocation={userLocation}
        onRequestLocation={handleRequestLocation}
        onClearLocation={handleClearLocation}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        totalApprovedEvents={events.length}
      />

      {/* 3. Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
        onResetFilters={handleResetFilters}
        totalFilteredCount={processedEvents.length}
        hasActiveFilters={hasActiveFilters}
        hasLocation={userLocation.latitude !== null}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10 w-full">
        {/* Currently Serving Live Highlight Banner (if any) */}
        {currentlyServingEvents.length > 0 && filters.timeFilter !== 'currently_serving' && (
          <div className="bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-orange-500/10 border border-emerald-300/60 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/30">
                <span className="w-3 h-3 rounded-full bg-white pulse-serving" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-sm sm:text-base text-emerald-950 font-['Outfit']">
                    Currently Serving Mahaprasad Right Now!
                  </h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    Live
                  </span>
                </div>
                <p className="text-xs text-stone-600">
                  {currentlyServingEvents.length} community {currentlyServingEvents.length === 1 ? 'feast is' : 'feasts are'} actively distributing Prasad in Amravati.
                </p>
              </div>
            </div>

            <button
              onClick={() => setFilters((prev) => ({ ...prev, timeFilter: 'currently_serving' }))}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all cursor-pointer whitespace-nowrap self-end sm:self-center"
            >
              View Serving Now &rarr;
            </button>
          </div>
        )}

        {/* Section Heading & Context */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-orange-100 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-orange-700 uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4 fill-orange-600 text-orange-600" />
              <span>Amravati Seva Directory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#291809] font-['Outfit'] tracking-tight">
              {filters.timeFilter === 'currently_serving'
                ? 'Currently Serving Events in Amravati'
                : filters.timeFilter === 'today'
                ? 'Mahaprasad & Bhandaras Today'
                : filters.timeFilter === 'upcoming'
                ? 'Upcoming Bhandara Events'
                : 'All Verified Community Meals'}
            </h2>
          </div>

          <div className="text-xs text-stone-500 font-medium">
            Showing {processedEvents.length} of {events.length} verified listings
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl h-96 border border-stone-200/80 p-4 space-y-4">
                <div className="h-48 bg-stone-200 rounded-2xl" />
                <div className="h-4 bg-stone-200 rounded w-3/4" />
                <div className="h-4 bg-stone-200 rounded w-1/2" />
                <div className="h-12 bg-stone-100 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Empty States */}
        {!isLoading && processedEvents.length === 0 && (
          <div className="bg-white border border-orange-100 rounded-3xl p-8 sm:p-14 text-center max-w-xl mx-auto space-y-5 shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto shadow-md shadow-orange-600/15">
              <Flame className="w-8 h-8 fill-orange-600 text-orange-600" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-[#291809]">
                {events.length === 0
                  ? "No Bhandara Locations Listed Yet"
                  : "No Bhandaras Found Matching Your Filters"}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
                {events.length === 0
                  ? "This website is dedicated for anyone to find and upload Bhandara, J1 community meal, and Mahaprasad locations. Be the first to list a Bhandara in your area!"
                  : hasActiveFilters
                  ? "No Bhandara matches your current search or locality filter. Try clearing filters or list a new Bhandara location!"
                  : "No events are currently listed in this category. Anyone can upload a Bhandara location!"}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear All Filters</span>
                </button>
              )}

              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 shadow-md shadow-orange-600/25 transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Upload Bhandara Location Now</span>
              </button>
            </div>
          </div>
        )}

        {/* Event Cards Grid */}
        {!isLoading && processedEvents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {processedEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onSelectEvent={(e) => setSelectedEvent(e)}
              />
            ))}
          </div>
        )}

        {/* Add Bhandara Callout Banner */}
        <div className="bg-gradient-to-tr from-amber-700 via-orange-600 to-amber-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-orange-950/10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left z-10">
            <span className="text-amber-200 text-xs font-bold uppercase tracking-wider block">
              Mandal & Volunteer Invitation
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-['Outfit']">
              Know of an Upcoming Bhandara in Amravati?
            </h3>
            <p className="text-xs sm:text-sm text-orange-100 max-w-xl leading-relaxed">
              Help fellow devotees and citizens reach the venue. Share the date, timing, and prasad menu for verification by our moderation team.
            </p>
          </div>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="shrink-0 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-orange-950 bg-white hover:bg-orange-50 shadow-lg transition-transform hover:scale-105 cursor-pointer z-10"
          >
            + Add a Bhandara Now
          </button>
        </div>
      </main>

      {/* 4. Footer */}
      <Footer
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
      />

      {/* 5. Modals */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onOpenReportModal={(ev) => setReportingEvent(ev)}
          onShowToast={addToast}
        />
      )}

      <SubmitEventModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onEventSubmitted={() => {
          loadData();
        }}
        onShowToast={addToast}
      />

      <ReportModal
        event={reportingEvent}
        isOpen={reportingEvent !== null}
        onClose={() => setReportingEvent(null)}
        onShowToast={addToast}
      />

      <AdminDashboard
        isOpen={isAdminModalOpen}
        onClose={() => {
          setIsAdminModalOpen(false);
          loadData();
        }}
        onShowToast={addToast}
      />

      {/* 6. Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default App;
