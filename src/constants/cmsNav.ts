import type { ReactNode } from 'react';

export interface CmsNavItem {
  key: string;
  label: string;
  path: string;
  icon?: ReactNode;
}

export function getCmsNavForService(serviceId: string | undefined): CmsNavItem[] {
  const dashboard: CmsNavItem = { key: 'dashboard', label: 'Dashboard', path: '/cms' };

  switch (serviceId) {
    case 'house-renting':
      return [
        dashboard,
        { key: 'houses', label: 'Houses', path: '/cms/houses' },
        { key: 'add-house', label: 'Add house', path: '/cms/houses/new' },
      ];
    case 'delivery':
      return [
        dashboard,
        { key: 'route-planner', label: 'Route planner', path: '/delivery/route-planner' },
      ];
    default:
      return [dashboard];
  }
}

export function getCmsTitleForService(serviceId: string | undefined): string {
  switch (serviceId) {
    case 'house-renting':
      return 'House renting CMS';
    case 'delivery':
      return 'Delivery CMS';
    default:
      return 'Owner CMS';
  }
}
