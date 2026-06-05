import type { LatLng, OptimizedLeg, RouteDirection, RoutePlan } from '@/types/geo';
import { haversineKm } from '@/utils/geo';

export const ARRIVAL_THRESHOLD_KM = 0.08;

export const DEPOT_KEY = 'depot';
export const SCHOOL_KEY = 'school';

export interface RouteStopPoint {
  key: string;
  label: string;
  lat: number;
  lng: number;
}

export function buildLegStopSequence(
  direction: RouteDirection,
  plan: RoutePlan,
  leg: OptimizedLeg,
): RouteStopPoint[] {
  const studentMap = new Map(
    plan.students.map((s) => [
      s.id,
      s.phone ? `${s.name} (${s.phone})` : s.name,
    ]),
  );

  if (direction === 'morning') {
    return [
      {
        key: DEPOT_KEY,
        label: `${plan.depot.name} (home)`,
        lat: plan.depot.lat,
        lng: plan.depot.lng,
      },
      ...leg.stopIds.map((id) => {
        const student = plan.students.find((s) => s.id === id);
        return {
          key: id,
          label: studentMap.get(id) ?? 'Student',
          lat: student?.lat ?? 0,
          lng: student?.lng ?? 0,
        };
      }),
      {
        key: SCHOOL_KEY,
        label: `${plan.school.name} (school)`,
        lat: plan.school.lat,
        lng: plan.school.lng,
      },
    ];
  }

  return [
    {
      key: SCHOOL_KEY,
      label: `${plan.school.name} (school)`,
      lat: plan.school.lat,
      lng: plan.school.lng,
    },
    ...leg.stopIds.map((id) => {
      const student = plan.students.find((s) => s.id === id);
      return {
        key: id,
        label: studentMap.get(id) ?? 'Student',
        lat: student?.lat ?? 0,
        lng: student?.lng ?? 0,
      };
    }),
    {
      key: DEPOT_KEY,
      label: `${plan.depot.name} (home)`,
      lat: plan.depot.lat,
      lng: plan.depot.lng,
    },
  ];
}

export function getNextStop(
  direction: RouteDirection,
  plan: RoutePlan,
  leg: OptimizedLeg,
): RouteStopPoint | null {
  const sequence = buildLegStopSequence(direction, plan, leg);
  const reached = leg.reachedStopKeys ?? [];
  return sequence[reached.length] ?? null;
}

export function isNearStop(position: LatLng, stop: LatLng, thresholdKm = ARRIVAL_THRESHOLD_KM): boolean {
  return haversineKm(position, stop) <= thresholdKm;
}

/** OSRM geometry is [lng, lat]. Returns only the path from the last reached stop onward. */
export function trimGeometryFromCoordinate(
  geometry: [number, number][],
  from: LatLng,
): [number, number][] {
  if (geometry.length === 0) {
    return [];
  }

  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (let i = 0; i < geometry.length; i++) {
    const [lng, lat] = geometry[i];
    const distance = haversineKm(from, { lat, lng });
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = i;
    }
  }

  return geometry.slice(bestIndex);
}

export function getRemainingGeometry(
  direction: RouteDirection,
  plan: RoutePlan,
  leg: OptimizedLeg,
): [number, number][] {
  const reached = leg.reachedStopKeys ?? [];
  if (reached.length === 0) {
    return leg.geometry;
  }

  const sequence = buildLegStopSequence(direction, plan, leg);
  const lastReachedKey = reached[reached.length - 1];
  const lastReached = sequence.find((s) => s.key === lastReachedKey);

  if (!lastReached) {
    return leg.geometry;
  }

  if (reached.length >= sequence.length) {
    return [];
  }

  return trimGeometryFromCoordinate(leg.geometry, lastReached);
}

export function normalizeReachedStopKeys(leg: OptimizedLeg | null): string[] {
  return leg?.reachedStopKeys ?? [];
}
