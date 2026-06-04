import { useMapEvents } from 'react-leaflet';

interface MapClickHandlerProps {
  onPick: (lat: number, lng: number) => void;
}

/** Listens for map clicks and reports lat/lng (ignores marker/popup clicks). */
export function MapClickHandler({ onPick }: MapClickHandlerProps) {
  useMapEvents({
    click(e) {
      if (e.originalEvent.defaultPrevented) return;
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}
