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

const unsupportedMessage = 'Geolocation is not supported in this browser';

function isGeolocationSupported(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.geolocation;
}

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const { enabled = true } = options;
  const supported = isGeolocationSupported();
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(supported ? null : unsupportedMessage);

  useEffect(() => {
    if (!enabled || !supported) {
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
      },
      (err) => {
        setError(
          err.code === err.PERMISSION_DENIED
            ? 'Location permission denied. Enable it in browser settings.'
            : err.message || 'Unable to get your location',
        );
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5_000,
        timeout: 20_000,
      },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [enabled, supported]);

  const active = enabled && supported;
  const loading = active && position === null && error === null;

  return {
    position: active ? position : null,
    error: active ? error : supported ? null : unsupportedMessage,
    loading,
  };
}
