import { useMemo } from 'react';
import { SERVICES } from '@/constants/services';

export function useFilteredServices(query: string) {
  return useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return SERVICES;
    return SERVICES.filter(
      (service) =>
        service.name.toLowerCase().includes(normalized) ||
        service.shortDescription.toLowerCase().includes(normalized) ||
        service.tagline.toLowerCase().includes(normalized),
    );
  }, [query]);
}
