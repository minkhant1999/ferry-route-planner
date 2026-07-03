import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';

interface OwnerServiceGuardProps {
  serviceId: string;
  children: React.ReactNode;
}

export function OwnerServiceGuard({ serviceId, children }: OwnerServiceGuardProps) {
  const user = useAppSelector((state) => state.auth.user);

  if (user?.role !== 'owner' || user.ownerServiceId !== serviceId) {
    return <Navigate to="/cms" replace />;
  }

  return children;
}
