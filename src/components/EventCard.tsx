// src/components/EventCard.tsx - Cultural responsive event card

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Navigation, 
  Utensils, 
  Users, 
  ShieldCheck, 
  Share2, 
  ExternalLink,
  Sparkles,
  Info
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

interface EventCardProps {
  event: BhandaraEvent;
  onSelectEvent: (event: BhandaraEvent) => void;
  onShareEvent?: (event: BhandaraEvent) => void;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80';

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onSelectEvent,
  onShareEvent,
}) => {
  const [imgSrc, setImgSrc] = useState(event.image_url || FALLBACK_IMAGE);
  const liveStatus = getEventLiveStatus(event);
  const statusBadge = getStatusBadge(liveStatus);
  const categoryDetails = getCategoryDetails(event.category);
  const directionsUrl = getGoogleMapsDirectionsUrl(event);

  return (
    <article className="bg-white rounded-3xl overflow-hidden border border-orange-100/90 shadow-sm hover:shadow-xl hover:shadow-orange-950/10 transition-all duration-300 flex flex-col bhandara-card-hover group">
      {/* Top Image Banner with Floating Badges */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-100">
        <img
          src={imgSrc}
          alt={event.title}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Live Status Badge */}
        <div className="absolute top-3 left-3 flex items-center space-x-1.5">
          <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-xs ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
            <span className={`w-2 h-2 rounded-full ${statusBadge.dot} ${statusBadge.pulse ? 'pulse-serving' : ''}`} />
            <span>{statusBadge.label}</span>
          </div>
        </div>

        {/* Category Pill on top right */}
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md shadow-xs ${categoryDetails.bg} ${categoryDetails.text} ${categoryDetails.border}`}>
            {categoryDetails.label}
          </span>
        </div>

        {/* Distance Indicator if GPS active */}
        {event.distance_km !== undefined && (
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-amber-200 border border-amber-400/30 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
            <Navigation className="w-3 h-3 text-amber-400" />
            <span>{formatDistance(event.distance_km)}</span>
          </div>
        )}

        {/* Locality & City tag on bottom left */}
        <div className="absolute bottom-3 left-3 text-white flex items-center space-x-1 text-xs font-medium drop-shadow-sm">
          <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
          <span className="font-semibold text-white truncate max-w-[200px]">
            {event.locality}, {event.city}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Demo Listing Badge if sample data */}
          {event.is_demo && (
            <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-stone-100 border border-stone-200 text-stone-600">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Demo Listing (Amravati)</span>
            </div>
          )}

          {/* Event Title */}
          <h3 
            onClick={() => onSelectEvent(event)}
            className="text-lg sm:text-xl font-bold text-[#291809] hover:text-orange-700 transition-colors cursor-pointer line-clamp-2 leading-snug font-['Outfit']"
          >
            {event.title}
          </h3>

          {/* Timing & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600 bg-stone-50/80 p-2.5 rounded-2xl border border-stone-100">
            <div className="flex items-center space-x-2">
              <Calendar className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <span className="font-semibold text-[#291809]">
                {formatEventDate(event.event_date)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <span className="font-medium">
                {formatTimeRange(event.start_time, event.end_time)}
              </span>
            </div>
          </div>

          {/* Venue & Address */}
          <div className="text-xs text-stone-600 space-y-1">
            <div className="font-semibold text-[#291809] flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-600" />
              <span className="truncate">{event.venue_name}</span>
            </div>
            <p className="text-[11px] text-stone-500 pl-3 line-clamp-1">
              {event.address}
            </p>
          </div>

          {/* Menu / Prasad Details */}
          <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-2.5 text-xs">
            <div className="flex items-center space-x-1.5 text-amber-900 font-bold text-[11px] uppercase tracking-wider mb-1">
              <Utensils className="w-3 h-3 text-orange-600" />
              <span>Mahaprasad Menu</span>
            </div>
            <p className="text-stone-700 font-medium text-xs line-clamp-2">
              {event.menu_details}
            </p>
          </div>

          {/* Organizer / User Name */}
          <div className="flex items-center justify-between text-xs text-stone-600 pt-1">
            <div className="flex items-center space-x-1.5 truncate">
              <Users className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <span className="truncate font-semibold">Shared by: {event.organizer_name}</span>
            </div>

            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
              Live Listing
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
          {/* View Details Button */}
          <button
            onClick={() => onSelectEvent(event)}
            className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold text-orange-950 bg-orange-100/70 hover:bg-orange-200/70 border border-orange-200 text-center transition-colors cursor-pointer"
          >
            View Details
          </button>

          {/* Get Directions Button */}
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 py-2.5 px-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-sm transition-all cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Directions</span>
          </a>
        </div>
      </div>
    </article>
  );
};
