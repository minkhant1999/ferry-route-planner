import { useEffect, useState } from 'react';

export interface GeolocationPosition {
  lat: number;
  lng: number;
  accuracy: number;
}

interface UseGeolocationOptions {
  /** When false, does not request location (default true). */
  enabled?: boolean;
}

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const { enabled = true } = options;
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    if (!navigator.geolocation) {
      setError('Geolocation is not supported in this browser');
      setLoading(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (coords) => {
        setPosition({
          lat: coords.coords.latitude,
          lng: coords.coords.longitude,
          accuracy: coords.coords.accuracy,
        });
        setError(null);
        setLoading(false);
      },
      (err) => {
        setError(
          err.code === err.PERMISSION_DENIED
            ? 'Location permission denied. Enable it in browser settings.'
            : err.message || 'Unable to get your location',
        );
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5_000,
        timeout: 20_000,
      },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [enabled]);

  return { position, error, loading };
}
