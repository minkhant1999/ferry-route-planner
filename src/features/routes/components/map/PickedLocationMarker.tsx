import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { AppButton } from '@/components';
import { copyToClipboard, formatCoord } from '@/utils/clipboard';

const pickedIcon = L.divIcon({
  className: 'picked-location-marker',
  html: `<div class="picked-location-pin" aria-hidden="true"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

interface PickedLocationMarkerProps {
  lat: number;
  lng: number;
}

export function PickedLocationMarker({ lat, lng }: PickedLocationMarkerProps) {
  const latText = formatCoord(lat);
  const lngText = formatCoord(lng);
  const bothText = `${latText}, ${lngText}`;

  return (
    <Marker position={[lat, lng]} icon={pickedIcon} zIndexOffset={900}>
      <Popup>
        <div className="min-w-[200px] space-y-2">
          <p className="m-0 text-sm font-semibold text-slate-800">Picked location</p>
          <p className="m-0 font-mono text-xs text-slate-600">
            Lat: {latText}
            <br />
            Lng: {lngText}
          </p>
          <div className="flex flex-wrap gap-1">
            <AppButton
              size="small"
              label="Copy lat"
              onClick={() => copyToClipboard(latText, 'latitude')}
            />
            <AppButton
              size="small"
              label="Copy lng"
              onClick={() => copyToClipboard(lngText, 'longitude')}
            />
            <AppButton
              size="small"
              type="primary"
              label="Copy both"
              onClick={() => copyToClipboard(bothText, 'coordinates')}
            />
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
