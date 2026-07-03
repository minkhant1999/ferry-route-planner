import { useEffect } from 'react';
import { hydrateAuth } from '@/store/features/authSlice';
import { useAppDispatch } from '@/store/hooks';

export function AuthPersistence() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  return null;
}
