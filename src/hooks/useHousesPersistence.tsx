import { useEffect } from 'react';
import { hydrateHouses } from '@/store/features/housesSlice';
import { useAppDispatch } from '@/store/hooks';

export function HousesPersistence() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrateHouses());
  }, [dispatch]);

  return null;
}
