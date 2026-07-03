import { ProtectedRoute, OwnerServiceGuard } from '@/components/auth';
import { MainLayout } from '@/layouts/MainLayout';
import { CmsLayout } from '@/layouts/CmsLayout';
import { RoutePlannerLayout } from '@/layouts/RoutePlannerLayout';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { RoutePlannerPage } from '@/pages/RoutePlannerPage';
import { RoutesPage } from '@/pages/RoutesPage';
import { ServicePage } from '@/pages/ServicePage';
import { CmsDashboardPage } from '@/pages/cms/CmsDashboardPage';
import { CmsHouseFormPage } from '@/pages/cms/CmsHouseFormPage';
import { CmsHousesListPage } from '@/pages/cms/CmsHousesListPage';

export const appRoutes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'services/:serviceId', element: <ServicePage /> },
    ],
  },
  {
    path: '/cms',
    element: (
      <ProtectedRoute allowedRoles={['owner']}>
        <CmsLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <CmsDashboardPage /> },
      {
        path: 'houses',
        element: (
          <OwnerServiceGuard serviceId="house-renting">
            <CmsHousesListPage />
          </OwnerServiceGuard>
        ),
      },
      {
        path: 'houses/new',
        element: (
          <OwnerServiceGuard serviceId="house-renting">
            <CmsHouseFormPage />
          </OwnerServiceGuard>
        ),
      },
      {
        path: 'houses/:houseId/edit',
        element: (
          <OwnerServiceGuard serviceId="house-renting">
            <CmsHouseFormPage />
          </OwnerServiceGuard>
        ),
      },
    ],
  },
  {
    path: '/delivery/route-planner',
    element: (
      <ProtectedRoute allowedRoles={['owner']} requireOwnerService="delivery">
        <RoutePlannerLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <RoutesPage /> },
      { path: ':planId', element: <RoutePlannerPage /> },
    ],
  },
];
