// src/utils/geo.ts - Geolocation and distance utilities for Bhandara Finder

/**
 * Approximate geographical center for Amravati, Maharashtra, India
 */
export const AMRAVATI_CENTER = {
  latitude: 20.9374,
  longitude: 77.7796,
  city: 'Amravati',
  state: 'Maharashtra',
};

/**
 * Key localities and areas across Amravati
 */
export const AMRAVATI_LOCALITIES = [
  'Rajapeth',
  'Gadge Nagar',
  'Badnera',
  'Camp (Amravati)',
  'Panchavati',
  'Sai Nagar',
  'Irwin Square',
  'Rukmini Nagar',
  'VMV Road / Shegaon Naka',
  'Tapovan / Gopal Nagar',
  'Dastur Nagar',
  'Navsari',
  'Gandhi Chowk / Ambadevi Area',
  'Kondeshwar Road',
] as const;

/**
 * Calculates straight-line distance in kilometers between two GPS coordinates using Haversine formula
 */
export function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // Round to 1 decimal place
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Format distance in user-friendly format (meters or kilometers)
 */
export function formatDistance(km: number | undefined): string {
  if (km === undefined || km === null || isNaN(km)) return '';
  if (km < 1) {
    const meters = Math.round(km * 1000);
    return `${meters} m away`;
  }
  return `${km.toFixed(1)} km away`;
}

/**
 * Constructs a secure Google Maps directions URL for an event
 */
export function getGoogleMapsDirectionsUrl(event: {
  venue_name: string;
  address: string;
  city: string;
  latitude?: number | null;
  longitude?: number | null;
}): string {
  if (event.latitude && event.longitude) {
    return `https://www.google.com/maps/dir/?api=1&destination=${event.latitude},${event.longitude}`;
  }
  const destinationQuery = `${event.venue_name}, ${event.address}, ${event.city}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destinationQuery)}`;
}
