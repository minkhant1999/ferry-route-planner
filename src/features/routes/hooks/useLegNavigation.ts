import { useEffect, useRef } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useAppDispatch } from '@/store/hooks';
import { markStopReached } from '@/store/features/routePlansSlice';
import type { RouteDirection, RoutePlan } from '@/types/geo';
import { getNextStop, isNearStop } from '@/utils/routeProgress';

/**
 * Watches GPS and marks the next stop as reached when the bus arrives (within ~80 m).
 */
export function useLegNavigation(
  plan: RoutePlan | undefined,
  activeDirection: RouteDirection | 'both',
  enabled = true,
) {
  const dispatch = useAppDispatch();
  const { position } = useGeolocation({ enabled: enabled && Boolean(plan) });
  const lastMarkedRef = useRef<string | null>(null);

  useEffect(() => {
    lastMarkedRef.current = null;
  }, [plan?.id, activeDirection]);

  useEffect(() => {
    if (!enabled || !plan || !position) {
      return;
    }

    const directions: RouteDirection[] =
      activeDirection === 'both'
        ? (['morning', 'evening'] as const).filter((d) => {
            const leg = d === 'morning' ? plan.morning : plan.evening;
            return Boolean(leg);
          })
        : [activeDirection];

    for (const direction of directions) {
      const leg = direction === 'morning' ? plan.morning : plan.evening;
      if (!leg) continue;

      const nextStop = getNextStop(direction, plan, leg);
      if (!nextStop) continue;

      const markId = `${direction}:${nextStop.key}`;
      if (lastMarkedRef.current === markId) continue;

      if (isNearStop(position, nextStop)) {
        lastMarkedRef.current = markId;
        dispatch(
          markStopReached({
            planId: plan.id,
            direction,
            stopKey: nextStop.key,
          }),
        );
      }
    }
  }, [activeDirection, dispatch, enabled, plan, position]);
}
