import { AppButton } from '@/components/button';
import { useGeolocation } from '@/hooks/useGeolocation';

export interface LocationPermissionButtonProps {
  className?: string;
}

/**
 * Primary action that opens the browser **location permission** prompt on tap.
 *
 * ### What it does
 * - Appears when GPS is unavailable (not granted, denied, or still resolving).
 * - Calls `getCurrentPosition` on click so the browser shows its allow/block dialog.
 * - Hides automatically once your location is available.
 *
 * @example Page header
 * ```tsx
 * <LocationPermissionButton className="w-full shrink-0 sm:w-auto" />
 * ```
 */
export function LocationPermissionButton({ className }: LocationPermissionButtonProps) {
  const { needsPermission, requesting, requestLocation } = useGeolocation();

  if (!needsPermission) {
    return null;
  }

  return (
    <AppButton
      type="primary"
      loading={requesting}
      onClick={requestLocation}
      className={className}
    >
      Allow location
    </AppButton>
  );
}
