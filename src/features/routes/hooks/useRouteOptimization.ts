import { useCallback } from 'react';
import type { RouteDirection, RoutePlan } from '@/types/geo';
import { useLazyGetDrivingRouteQuery } from '@/store/api/routingApi';
import { useAppDispatch } from '@/store/hooks';
import { setOptimizedLeg } from '@/store/features/routePlansSlice';
import {
  optimizeEveningStopIds,
  optimizeMorningStopIds,
  resolveStopSequence,
} from '@/utils/routeOptimizer';

export function useRouteOptimization(plan: RoutePlan | undefined) {
  const dispatch = useAppDispatch();
  const [fetchRoute, { isFetching, error }] = useLazyGetDrivingRouteQuery();

  const optimizeDirection = useCallback(
    async (direction: RouteDirection) => {
      if (!plan) return;
      if (plan.students.length === 0) {
        throw new Error('Add at least one student before optimizing.');
      }

      const stopIds =
        direction === 'morning'
          ? optimizeMorningStopIds(plan.depot, plan.school, plan.students)
          : optimizeEveningStopIds(plan.school, plan.depot, plan.students);

      const coordinates = resolveStopSequence(
        direction,
        plan.depot,
        plan.school,
        plan.students,
        stopIds,
      );

      const result = await fetchRoute({ coordinates }).unwrap();

      dispatch(
        setOptimizedLeg({
          planId: plan.id,
          leg: {
            direction,
            stopIds,
            distanceMeters: result.distanceMeters,
            durationSeconds: result.durationSeconds,
            geometry: result.geometry,
          },
        }),
      );
    },
    [dispatch, fetchRoute, plan],
  );

  const optimizeAll = useCallback(async () => {
    if (!plan) return;

    if (plan.schedule === 'morning' || plan.schedule === 'both') {
      await optimizeDirection('morning');
    }
    if (plan.schedule === 'evening' || plan.schedule === 'both') {
      await optimizeDirection('evening');
    }
  }, [optimizeDirection, plan]);

  return {
    optimizeDirection,
    optimizeAll,
    isOptimizing: isFetching,
    error,
  };
}
