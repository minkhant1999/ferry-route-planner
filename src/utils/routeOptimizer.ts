import type { GeoStop, LatLng, Student } from '@/types/geo';
import { haversineKm } from '@/utils/geo';

type StopPoint = LatLng & { id: string };

function nearestNeighborOrder(start: LatLng, stops: StopPoint[], end: LatLng): string[] {
  if (stops.length === 0) {
    return [];
  }

  const remaining = [...stops];
  const order: string[] = [];
  let current = start;

  while (remaining.length > 0) {
    let bestIndex = 0;
    let bestScore = Number.POSITIVE_INFINITY;

    for (let i = 0; i < remaining.length; i++) {
      const toStop = haversineKm(current, remaining[i]);
      const toEnd = haversineKm(remaining[i], end);
      const score = toStop + toEnd * 0.15;
      if (score < bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }

    const next = remaining.splice(bestIndex, 1)[0];
    order.push(next.id);
    current = { lat: next.lat, lng: next.lng };
  }

  return order;
}

export function optimizeMorningStopIds(
  depot: GeoStop,
  school: GeoStop,
  students: Student[],
): string[] {
  const studentStops: StopPoint[] = students.map((s) => ({
    id: s.id,
    lat: s.lat,
    lng: s.lng,
  }));

  return nearestNeighborOrder(
    { lat: depot.lat, lng: depot.lng },
    studentStops,
    { lat: school.lat, lng: school.lng },
  );
}

export function optimizeEveningStopIds(
  school: GeoStop,
  depot: GeoStop,
  students: Student[],
): string[] {
  const studentStops: StopPoint[] = students.map((s) => ({
    id: s.id,
    lat: s.lat,
    lng: s.lng,
  }));

  return nearestNeighborOrder(
    { lat: school.lat, lng: school.lng },
    studentStops,
    { lat: depot.lat, lng: depot.lng },
  );
}

export function resolveStopSequence(
  direction: 'morning' | 'evening',
  depot: GeoStop,
  school: GeoStop,
  students: Student[],
  stopIds: string[],
): LatLng[] {
  const studentMap = new Map(students.map((s) => [s.id, s]));

  if (direction === 'morning') {
    const coords: LatLng[] = [{ lat: depot.lat, lng: depot.lng }];
    for (const id of stopIds) {
      const student = studentMap.get(id);
      if (student) {
        coords.push({ lat: student.lat, lng: student.lng });
      }
    }
    coords.push({ lat: school.lat, lng: school.lng });
    return coords;
  }

  const coords: LatLng[] = [{ lat: school.lat, lng: school.lng }];
  for (const id of stopIds) {
    const student = studentMap.get(id);
    if (student) {
      coords.push({ lat: student.lat, lng: student.lng });
    }
  }
  coords.push({ lat: depot.lat, lng: depot.lng });
  return coords;
}
