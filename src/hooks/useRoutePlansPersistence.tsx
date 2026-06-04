import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  loadRoutePlans,
  persistRoutePlans,
} from '@/store/features/routePlansSlice';

export function RoutePlansPersistence() {
  const dispatch = useAppDispatch();
  const plans = useAppSelector((s) => s.routePlans.plans);
  const hydrated = useRef(false);

  useEffect(() => {
    void dispatch(loadRoutePlans()).then(() => {
      hydrated.current = true;
    });
  }, [dispatch]);

  useEffect(() => {
    if (!hydrated.current) return;
    void dispatch(persistRoutePlans(plans));
  }, [dispatch, plans]);

  return null;
}
