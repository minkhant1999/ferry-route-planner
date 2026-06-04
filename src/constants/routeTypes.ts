import type { RouteSchedule } from '@/types/geo';

export const ROUTE_SCHEDULE_OPTIONS: { label: string; value: RouteSchedule }[] = [
  { label: 'Morning only', value: 'morning' },
  { label: 'Evening only', value: 'evening' },
  { label: 'Morning & evening', value: 'both' },
];

export const GRADE_PRESETS = [
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'Grade 12',
] as const;

export const STORAGE_KEY = 'bus-route-plans';
