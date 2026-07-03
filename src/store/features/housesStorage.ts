import type { HouseListing } from '@/types/house';

const HOUSES_KEY = 'service-hub-houses';

export function readStoredHouses(): HouseListing[] {
  try {
    const raw = localStorage.getItem(HOUSES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HouseListing[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeStoredHouses(houses: HouseListing[]): void {
  localStorage.setItem(HOUSES_KEY, JSON.stringify(houses));
}
