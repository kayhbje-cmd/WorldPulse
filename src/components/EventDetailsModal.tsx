// src/components/EventDetailsModal.tsx - Full event modal view with directions, sharing & reporting

import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Navigation, 
  Utensils, 
  Phone, 
  Users, 
  ShieldCheck, 
  Share2, 
  AlertTriangle, 
  Check, 
  Sparkles,
  Info,
  ExternalLink
} from 'lucide-react';
import { BhandaraEvent } from '../types';
import { 
  getEventLiveStatus, 
  getStatusBadge, 
  getCategoryDetails, 
  formatEventDate, 
  formatTimeRange 
} from '../utils/status';
import { formatDistance, getGoogleMapsDirectionsUrl } from '../utils/geo';

interface EventDetailsModalProps {
  event: BhandaraEvent | null;
  onClose: () => void;
  onOpenReportModal: (event: BhandaraEvent) => void;
  onShowToast: (message: string, type?: 'success' | 'info') => void;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=1200&q=80';

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  event,
  onClose,
  onOpenReportModal,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);

  if (!event) return null;

  const liveStatus = getEventLiveStatus(event);
  const statusBadge = getStatusBadge(liveStatus);
  const categoryDetails = getCategoryDetails(event.category);
  const directionsUrl = getGoogleMapsDirectionsUrl(event);

  const handleShare = async () => {
    const shareData = {
      title: `${event.title} - Bhandara Finder`,
      text: `${event.title} at ${event.venue_name}, ${event.locality}, Amravati. Mahaprasad Menu: ${event.menu_details}. Check timings & details on Bhandara Finder.`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        onShowToast('Event shared successfully!', 'success');
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      `${event.title}\n📍 Venue: ${event.venue_name}, ${event.address}\n📅 Date: ${formatEventDate(event.event_date)} (${formatTimeRange(event.start_time, event.end_time)})\n🍛 Menu: ${event.menu_details}\n🔗 Link: ${window.location.href}`
    );
    setCopied(true);
    onShowToast('Event link and details copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-[#FDFBF7] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-orange-100 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with Close Button */}
        <div className="relative">
          <div className="h-56 sm:h-64 w-full bg-stone-200 overflow-hidden relative">
            <img
              src={event.image_url || FALLBACK_IMAGE}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer z-10"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Badges on Banner */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-xs ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                <span className={`w-2 h-2 rounded-full inline-block mr-1.5 ${statusBadge.dot} ${statusBadge.pulse ? 'pulse-serving' : ''}`} />
                {statusBadge.label}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-xs ${categoryDetails.bg} ${categoryDetails.text} ${categoryDetails.border}`}>
                {categoryDetails.label}
              </span>
            </div>

            {/* Title on Banner Bottom */}
            <div className="absolute bottom-3 left-4 right-4 text-white">
              {event.is_demo && (
                <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-400 text-stone-900 mb-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>Demonstration Listing • Amravati</span>
                </div>
              )}
              <h2 className="text-xl sm:text-2xl font-bold font-['Outfit'] leading-tight drop-shadow-md">
                {event.title}
              </h2>
              <p className="text-xs text-amber-200 flex items-center space-x-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-orange-400" />
                <span>{event.locality}, {event.city}</span>
                {event.distance_km !== undefined && (
                  <span>• {formatDistance(event.distance_km)}</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-orange-50 text-orange-600 mt-0.5">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  Event Date
                </span>
                <span className="text-sm font-bold text-[#291809]">
                  {formatEventDate(event.event_date)}
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  Serving Timing
                </span>
                <span className="text-sm font-bold text-[#291809]">
                  {formatTimeRange(event.start_time, event.end_time)}
                </span>
              </div>
            </div>
          </div>

          {/* Mahaprasad Menu Details */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center space-x-2 text-amber-950 font-bold text-sm">
              <Utensils className="w-4 h-4 text-orange-600" />
              <span>Mahaprasad & Food Details</span>
            </div>
            <p className="text-stone-800 text-sm leading-relaxed font-medium pl-6">
              {event.menu_details}
            </p>
          </div>

          {/* Venue & Full Address with Directions Action */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 flex-1">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  Venue & Address
                </span>
                <h4 className="text-base font-bold text-[#291809]">
                  {event.venue_name}
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {event.address}, {event.locality}, {event.city}, Maharashtra
                </p>
              </div>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-sm transition-all"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Google Maps</span>
              </a>
            </div>

            {event.latitude && event.longitude && (
              <div className="text-[11px] text-stone-500 bg-stone-50 px-2.5 py-1.5 rounded-lg flex items-center justify-between">
                <span>GPS Coordinates: {event.latitude.toFixed(4)}° N, {event.longitude.toFixed(4)}° E</span>
                <span className="text-emerald-700 font-semibold">Geo-verified</span>
              </div>
            )}
          </div>

          {/* About Event / Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              About This Bhandara / Seva
            </h4>
            <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Special Instructions */}
          {event.instructions && (
            <div className="bg-orange-50/60 border border-orange-200/70 rounded-2xl p-3.5 text-xs text-stone-700 space-y-1">
              <div className="flex items-center space-x-1.5 font-bold text-orange-950">
                <Info className="w-3.5 h-3.5 text-orange-600" />
                <span>Special Instructions for Devotees</span>
              </div>
              <p className="pl-5 text-stone-600 leading-relaxed">
                {event.instructions}
              </p>
            </div>
          )}

          {/* Organizer and Contact Information */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  Organized by
                </span>
                <span className="text-sm font-bold text-[#291809]">
                  {event.organizer_name}
                </span>
              </div>
            </div>

            {event.contact_phone && (
              <a
                href={`tel:${event.contact_phone}`}
                className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-orange-950 bg-orange-100/70 hover:bg-orange-200 border border-orange-200 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-orange-600" />
                <span>Call Organizer ({event.contact_phone})</span>
              </a>
            )}
          </div>
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200/80 flex items-center justify-between gap-2">
          {/* Report Incorrect Info Button */}
          <button
            onClick={() => {
              onClose();
              onOpenReportModal(event);
            }}
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-stone-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-stone-400 group-hover:text-rose-600" />
            <span>Report Incorrect Info</span>
          </button>

          {/* Share Button & Close */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-stone-600" />}
              <span>{copied ? 'Link Copied' : 'Share Event'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-stone-700 hover:bg-stone-200/80 rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
