import { STORAGE_KEY } from '@/constants/routeTypes';
import type { RoutePlan } from '@/types/geo';

export function readRoutePlansFromStorage(): RoutePlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as RoutePlan[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeRoutePlansToStorage(plans: RoutePlan[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}
