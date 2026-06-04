import { RoutePlannerPage } from '@/pages/RoutePlannerPage';
import { RoutesPage } from '@/pages/RoutesPage';

export const appRoutes = [
  { index: true, element: <RoutesPage /> },
  { path: 'routes/:planId', element: <RoutePlannerPage /> },
];
