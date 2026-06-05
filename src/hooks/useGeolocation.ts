import { useCallback, useEffect, useState } from 'react';

export interface GeolocationPosition {
  lat: number;
  lng: number;
  accuracy: number;
}

export type GeolocationPermissionState = 'granted' | 'denied' | 'prompt' | 'unknown';

interface UseGeolocationOptions {
  /** When false, does not request location (default true). */
  enabled?: boolean;
}

const unsupportedMessage = 'Geolocation is not supported in this browser';

const geoOptions: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 5_000,
  timeout: 20_000,
};

function isGeolocationSupported(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.geolocation;
}

function mapGeolocationError(err: GeolocationPositionError): string {
  if (err.code === err.PERMISSION_DENIED) {
    return 'Location permission denied. Tap “Allow location” or enable it in browser settings.';
  }
  return err.message || 'Unable to get your location';
}

function readPosition(coords: GeolocationCoordinates): GeolocationPosition {
  return {
    lat: coords.latitude,
    lng: coords.longitude,
    accuracy: coords.accuracy,
  };
}

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const { enabled = true } = options;
  const supported = isGeolocationSupported();
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(supported ? null : unsupportedMessage);
  const [permissionState, setPermissionState] =
    useState<GeolocationPermissionState>('unknown');
  const [requesting, setRequesting] = useState(false);
  const [watchGeneration, setWatchGeneration] = useState(0);

  useEffect(() => {
    if (!supported || !navigator.permissions?.query) {
      return;
    }

    let cancelled = false;
    let permissionStatus: PermissionStatus | undefined;

    navigator.permissions
      .query({ name: 'geolocation' })
      .then((status) => {
        if (cancelled) return;
        permissionStatus = status;
        setPermissionState(status.state as GeolocationPermissionState);
        status.onchange = () => {
          setPermissionState(status.state as GeolocationPermissionState);
        };
      })
      .catch(() => {
        if (!cancelled) {
          setPermissionState('unknown');
        }
      });

    return () => {
      cancelled = true;
      if (permissionStatus) {
        permissionStatus.onchange = null;
      }
    };
  }, [supported]);

  useEffect(() => {
    if (!enabled || !supported) {
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (coords) => {
        setPosition(readPosition(coords.coords));
        setError(null);
        setPermissionState('granted');
      },
      (err) => {
        setError(mapGeolocationError(err));
        if (err.code === err.PERMISSION_DENIED) {
          setPermissionState('denied');
        }
      },
      geoOptions,
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [enabled, supported, watchGeneration]);

  const requestLocation = useCallback(() => {
    if (!supported) {
      return;
    }

    setRequesting(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (coords) => {
        setPosition(readPosition(coords.coords));
        setError(null);
        setPermissionState('granted');
        setRequesting(false);
        setWatchGeneration((n) => n + 1);
      },
      (err) => {
        setError(mapGeolocationError(err));
        if (err.code === err.PERMISSION_DENIED) {
          setPermissionState('denied');
        }
        setRequesting(false);
      },
      { ...geoOptions, maximumAge: 0 },
    );
  }, [supported]);

  const active = enabled && supported;
  const loading = active && position === null && error === null && !requesting;
  const needsPermission =
    active &&
    !position &&
    (permissionState === 'prompt' ||
      permissionState === 'denied' ||
      permissionState === 'unknown' ||
      Boolean(error));

  return {
    position: active ? position : null,
    error: active ? error : supported ? null : unsupportedMessage,
    loading,
    permissionState,
    needsPermission,
    requesting,
    requestLocation,
  };
}
