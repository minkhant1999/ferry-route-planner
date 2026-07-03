import { Navigate, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import type { UserRole } from '@/types/auth';
import { useAppSelector } from '@/store/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireOwnerService?: string;
  loginPath?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  requireOwnerService,
  loginPath = '/login',
}: ProtectedRouteProps) {
  const location = useLocation();
  const { user, isHydrated } = useAppSelector((state) => state.auth);

  if (!isHydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spin size="large" tip="Loading…" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={loginPath} replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  if (
    requireOwnerService &&
    (user.role !== 'owner' || user.ownerServiceId !== requireOwnerService)
  ) {
    return <Navigate to="/cms" replace />;
  }

  return children;
}
