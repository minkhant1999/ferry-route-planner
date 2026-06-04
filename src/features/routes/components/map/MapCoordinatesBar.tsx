import { AppButton } from '@/components';
import { copyToClipboard, formatCoord } from '@/utils/clipboard';

interface MapCoordinatesBarProps {
  lat: number;
  lng: number;
  /** Heading above the coordinates (default: map click). */
  title?: string;
  onClear?: () => void;
}

export function MapCoordinatesBar({ lat, lng, title = 'Clicked on map', onClear }: MapCoordinatesBarProps) {
  const latText = formatCoord(lat);
  const lngText = formatCoord(lng);
  const bothText = `${latText}, ${lngText}`;

  return (
    <div className="mt-2 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-slate-700">{title}</p>
          <div className="mt-1 grid grid-cols-1 gap-1 font-mono text-sm text-slate-800 sm:grid-cols-2">
            <span>
              <span className="text-slate-500">Lat:</span> {latText}
            </span>
            <span>
              <span className="text-slate-500">Lng:</span> {lngText}
            </span>
          </div>
        </div>
        {onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 text-xs text-slate-500 underline hover:text-slate-700"
          >
            Clear
          </button>
        ) : null}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <AppButton
          size="small"
          label="Copy latitude"
          className="flex-1 sm:flex-none"
          onClick={() => copyToClipboard(latText, 'latitude')}
        />
        <AppButton
          size="small"
          label="Copy longitude"
          className="flex-1 sm:flex-none"
          onClick={() => copyToClipboard(lngText, 'longitude')}
        />
        <AppButton
          size="small"
          type="primary"
          label="Copy both"
          className="flex-1 sm:flex-none"
          onClick={() => copyToClipboard(bothText, 'coordinates')}
        />
      </div>
    </div>
  );
}
