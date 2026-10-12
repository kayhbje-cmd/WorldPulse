// src/tests/geo.test.ts - Unit tests for Haversine distance, formatting, and directions

import { describe, it, expect } from 'vitest';
import { 
  getDistanceFromLatLonInKm, 
  formatDistance, 
  getGoogleMapsDirectionsUrl 
} from '../utils/geo';

describe('Geolocation & Haversine Distance', () => {
  it('calculates 0 km for identical coordinates', () => {
    const dist = getDistanceFromLatLonInKm(20.9320, 77.7523, 20.9320, 77.7523);
    expect(dist).toBe(0);
  });

  it('calculates realistic distance between Amravati Ambadevi Mandir and Gadge Nagar', () => {
    // Ambadevi: 20.9320, 77.7523; Gadge Nagar: 20.9410, 77.7420
    const dist = getDistanceFromLatLonInKm(20.9320, 77.7523, 20.9410, 77.7420);
    expect(dist).toBeGreaterThan(1.0);
    expect(dist).toBeLessThan(2.0);
  });

  it('formats distance nicely for meters and kilometers', () => {
    expect(formatDistance(0.5)).toBe('500 m away');
    expect(formatDistance(1.4)).toBe('1.4 km away');
    expect(formatDistance(undefined)).toBe('');
  });

  it('generates correct Google Maps directions URL with coordinates', () => {
    const url = getGoogleMapsDirectionsUrl({
      venue_name: 'Ambadevi Mandir',
      address: 'Gandhi Chowk',
      city: 'Amravati',
      latitude: 20.9320,
      longitude: 77.7523,
    });
    expect(url).toBe('https://www.google.com/maps/dir/?api=1&destination=20.932,77.7523');
  });

  it('generates fallback Google Maps directions URL with encoded address when coordinates are missing', () => {
    const url = getGoogleMapsDirectionsUrl({
      venue_name: 'Sai Mandir Hall',
      address: 'Sai Nagar Road',
      city: 'Amravati',
    });
    expect(url).toContain('https://www.google.com/maps/dir/?api=1&destination=');
    expect(url).toContain(encodeURIComponent('Sai Mandir Hall'));
  });
});
