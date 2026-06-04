import type { LatLng } from '@/types/geo';
import { baseApi } from './baseApi';

export interface OsrmRouteResult {
  distanceMeters: number;
  durationSeconds: number;
  geometry: [number, number][];
}

interface OsrmApiResponse {
  code: string;
  routes?: Array<{
    distance: number;
    duration: number;
    geometry: {
      coordinates: [number, number][];
    };
  }>;
  message?: string;
}

function buildCoordinatePath(coordinates: LatLng[]): string {
  return coordinates.map((c) => `${c.lng},${c.lat}`).join(';');
}

export const routingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDrivingRoute: build.query<OsrmRouteResult, { coordinates: LatLng[] }>({
      query: ({ coordinates }) =>
        `/${buildCoordinatePath(coordinates)}?overview=full&geometries=geojson&steps=false`,
      transformResponse: (response: OsrmApiResponse): OsrmRouteResult => {
        const route = response.routes?.[0];
        if (!route) {
          throw new Error(response.message ?? 'No route found');
        }
        return {
          distanceMeters: route.distance,
          durationSeconds: route.duration,
          geometry: route.geometry.coordinates,
        };
      },
    }),
  }),
});

export const { useLazyGetDrivingRouteQuery } = routingApi;
