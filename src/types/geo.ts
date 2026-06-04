export interface LatLng {
  lat: number;
  lng: number;
}

export interface GeoStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface Student {
  id: string;
  name: string;
  phone: string;
  lat: number;
  lng: number;
}

export type RouteSchedule = 'morning' | 'evening' | 'both';
export type RouteDirection = 'morning' | 'evening';

export interface OptimizedLeg {
  direction: RouteDirection;
  stopIds: string[];
  distanceMeters: number;
  durationSeconds: number;
  geometry: [number, number][];
}

export interface RoutePlan {
  id: string;
  name: string;
  description?: string;
  grade?: string;
  schedule: RouteSchedule;
  depot: GeoStop;
  school: GeoStop;
  students: Student[];
  morning: OptimizedLeg | null;
  evening: OptimizedLeg | null;
  createdAt: string;
  updatedAt: string;
}

export interface RoutePlansState {
  plans: RoutePlan[];
  selectedPlanId: string | null;
}
