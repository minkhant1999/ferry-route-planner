import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { hydrateRoutePlans } from '@/store/features/routePlansSlice';
import { writeRoutePlansToStorage } from '@/store/features/routePlansStorage';

/**
 * Loads route plans from localStorage on mount and saves after every change.
 */
export function RoutePlansPersistence() {
  const dispatch = useAppDispatch();
  const plans = useAppSelector((s) => s.routePlans.plans);
  const isHydrated = useAppSelector((s) => s.routePlans.isHydrated);

  useEffect(() => {
    dispatch(hydrateRoutePlans());
  }, [dispatch]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    writeRoutePlansToStorage(plans);
  }, [plans, isHydrated]);

  return null;
}
