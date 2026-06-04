import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import { AppButton } from '@/components';
import { CurrentLocationLayer } from '@/features/routes/components/map/CurrentLocationLayer';
import { MapClickHandler } from '@/features/routes/components/map/MapClickHandler';
import { MapCoordinatesBar } from '@/features/routes/components/map/MapCoordinatesBar';
import { PickedLocationMarker } from '@/features/routes/components/map/PickedLocationMarker';
import { useGeolocation } from '@/hooks/useGeolocation';
import type { RoutePlan, RouteDirection } from '@/types/geo';
import { copyToClipboardSync, formatCoord } from '@/utils/clipboard';

import 'leaflet/dist/leaflet.css';

const depotIcon = L.divIcon({
  className: '',
  html: '<div style="background:#2563eb;color:#fff;border-radius:9999px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.25)">H</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const schoolIcon = L.divIcon({
  className: '',
  html: '<div style="background:#16a34a;color:#fff;border-radius:9999px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.25)">S</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const studentIcon = L.divIcon({
  className: '',
  html: '<div style="background:#ea580c;color:#fff;border-radius:9999px;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.25)">•</div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

interface RouteMapProps {
  plan: RoutePlan;
  activeDirection?: RouteDirection | 'both';
}

const COLORS = {
  morning: '#2563eb',
  evening: '#9333ea',
};

export function RouteMap({ plan, activeDirection = 'both' }: RouteMapProps) {
  const [locateTrigger, setLocateTrigger] = useState(0);
  const [picked, setPicked] = useState<{
    lat: number;
    lng: number;
    title: string;
  } | null>(null);
  const { position, error, loading } = useGeolocation();

  const center = useMemo(
    () => [plan.school.lat, plan.school.lng] as [number, number],
    [plan.school.lat, plan.school.lng],
  );

  useEffect(() => {
    delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
  }, []);

  const showMorning = activeDirection === 'both' || activeDirection === 'morning';
  const showEvening = activeDirection === 'both' || activeDirection === 'evening';

  const handleLocate = () => {
    if (!position) return;
    const bothText = `${formatCoord(position.lat)}, ${formatCoord(position.lng)}`;
    copyToClipboardSync(bothText, 'coordinates');
    setLocateTrigger((n) => n + 1);
    setPicked({
      lat: position.lat,
      lng: position.lng,
      title: 'Your location',
    });
  };

  return (
    <div className="relative">
      <div className="relative h-[min(52vh,320px)] w-full overflow-hidden rounded-lg border border-slate-200 sm:h-[380px] sm:rounded-xl md:h-[420px] lg:h-[480px]">
        <MapContainer center={center} zoom={12} className="h-full w-full z-0">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler
            onPick={(lat, lng) =>
              setPicked({ lat, lng, title: 'Clicked on map' })
            }
          />

          <CurrentLocationLayer
            position={position}
            locateTrigger={locateTrigger}
            onMarkerClick={handleLocate}
          />

          {picked ? <PickedLocationMarker lat={picked.lat} lng={picked.lng} /> : null}

          <Marker position={[plan.depot.lat, plan.depot.lng]} icon={depotIcon}>
            <Popup>{plan.depot.name} (home)</Popup>
          </Marker>

          <Marker position={[plan.school.lat, plan.school.lng]} icon={schoolIcon}>
            <Popup>{plan.school.name}</Popup>
          </Marker>

          {plan.students.map((student) => (
            <Marker
              key={student.id}
              position={[student.lat, student.lng]}
              icon={studentIcon}
            >
              <Popup>
                <strong>{student.name}</strong>
                {student.phone ? (
                  <>
                    <br />
                    <a href={`tel:${student.phone.replace(/\s/g, '')}`}>{student.phone}</a>
                  </>
                ) : null}
              </Popup>
            </Marker>
          ))}

          {showMorning && plan.morning?.geometry.length ? (
            <Polyline
              positions={plan.morning.geometry.map(([lng, lat]) => [lat, lng])}
              pathOptions={{ color: COLORS.morning, weight: 5, opacity: 0.85 }}
            />
          ) : null}

          {showEvening && plan.evening?.geometry.length ? (
            <Polyline
              positions={plan.evening.geometry.map(([lng, lat]) => [lat, lng])}
              pathOptions={{
                color: COLORS.evening,
                weight: 5,
                opacity: 0.85,
                dashArray: '8 8',
              }}
            />
          ) : null}
        </MapContainer>

        <AppButton
          type="default"
          aria-label="Center map on your location"
          title="My location"
          onClick={handleLocate}
          disabled={!position}
          className="!absolute !bottom-3 !right-3 z-[1000] !flex !h-11 !w-11 !min-h-0 !items-center !justify-center !rounded-full !border !border-slate-200 !bg-white !p-0 !shadow-md hover:!bg-slate-50"
        >
          <LocateIcon active={Boolean(position)} loading={loading} />
        </AppButton>
      </div>

      {picked ? (
        <MapCoordinatesBar
          lat={picked.lat}
          lng={picked.lng}
          title={picked.title}
          onClear={() => setPicked(null)}
        />
      ) : null}

      {error ? (
        <p className="mt-2 text-xs text-amber-700">{error}</p>
      ) : (
        <p className="mt-2 text-xs text-slate-500">
          {position
            ? 'Tap the map or location button to pick lat/lng and copy them. Blue dot = your location.'
            : loading
              ? 'Finding your location… Tap the map anytime to pick coordinates.'
              : 'Tap anywhere on the map to see and copy latitude & longitude.'}
        </p>
      )}
    </div>
  );
}

function LocateIcon({ active, loading }: { active: boolean; loading: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="3"
        fill={active ? '#2563eb' : loading ? '#94a3b8' : '#64748b'}
      />
      <path
        d="M12 2v3M12 19v3M2 12h3M19 12h3"
        stroke={active ? '#2563eb' : '#64748b'}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {loading ? (
        <circle
          cx="12"
          cy="12"
          r="8"
          stroke="#2563eb"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="origin-center animate-spin"
          style={{ transformOrigin: '12px 12px' }}
        />
      ) : null}
    </svg>
  );
}
