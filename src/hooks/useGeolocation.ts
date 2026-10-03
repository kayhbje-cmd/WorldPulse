// src/hooks/useGeolocation.ts
import { useState, useEffect } from 'react';

interface Coordinates {
  lat: number;
  lng: number;
}

export const useGeolocation = (autoFetch: boolean = true) => {
  // Default to central Mumbai / Pune metro area if GPS permission pending
  const [location, setLocation] = useState<Coordinates>({
    lat: 19.076,
    lng: 72.8777,
  });
  const [hasRealLocation, setHasRealLocation] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getLocation = () => {
    setLoading(true);
    setError(null);

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setHasRealLocation(true);
        setLoading(false);
      },
      (err) => {
        console.warn('Geolocation notice:', err.message);
        setError(err.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  };

  useEffect(() => {
    if (autoFetch) {
      getLocation();
    }
  }, [autoFetch]);

  return { location, setLocation, hasRealLocation, error, loading, getLocation };
};
