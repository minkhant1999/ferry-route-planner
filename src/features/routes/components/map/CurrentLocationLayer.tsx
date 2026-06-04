import { useEffect } from 'react';
import { Circle, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { GeolocationPosition } from '@/hooks/useGeolocation';

const currentLocationIcon = L.divIcon({
  className: 'current-location-marker',
  html: `<div class="current-location-dot" aria-hidden="true"><span class="current-location-pulse"></span></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

interface FlyToCurrentLocationProps {
  target: GeolocationPosition | null;
  trigger: number;
}

function FlyToCurrentLocation({ target, trigger }: FlyToCurrentLocationProps) {
  const map = useMap();

  useEffect(() => {
    if (!target || trigger === 0) return;
    map.flyTo([target.lat, target.lng], Math.max(map.getZoom(), 15), { duration: 0.8 });
  }, [map, target, trigger]);

  return null;
}

interface CurrentLocationLayerProps {
  position: GeolocationPosition | null;
  locateTrigger: number;
  onMarkerClick?: () => void;
}

export function CurrentLocationLayer({
  position,
  locateTrigger,
  onMarkerClick,
}: CurrentLocationLayerProps) {
  if (!position) {
    return <FlyToCurrentLocation target={null} trigger={locateTrigger} />;
  }

  return (
    <>
      <FlyToCurrentLocation target={position} trigger={locateTrigger} />
      <Circle
        center={[position.lat, position.lng]}
        radius={position.accuracy}
        pathOptions={{
          color: '#2563eb',
          fillColor: '#2563eb',
          fillOpacity: 0.12,
          weight: 1,
        }}
      />
      <Marker
        position={[position.lat, position.lng]}
        icon={currentLocationIcon}
        zIndexOffset={1000}
        eventHandlers={onMarkerClick ? { click: onMarkerClick } : undefined}
      >
        <Popup>
          <strong>Your location</strong>
          <br />
          <span className="text-xs text-slate-600">
            ±{Math.round(position.accuracy)} m accuracy
          </span>
        </Popup>
      </Marker>
    </>
  );
}
