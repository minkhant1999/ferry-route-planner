import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_OSRM_URL}/route/v1/driving`,
  }),
  tagTypes: ['RouteGeometry'],
  endpoints: () => ({}),
});
