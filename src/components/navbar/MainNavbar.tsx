import { Link, useNavigate } from 'react-router-dom';
import { NavDropdown } from '@/components/dropdown';
import { AppButton } from '@/components/button';
import { DELIVERY_ROUTE_PLANNER_PATH, SERVICES, SERVICE_BY_ID } from '@/constants/services';
import { USER_ROLE_LABELS } from '@/types/auth';
import { logout } from '@/store/features/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const exploreItems = SERVICES.map((service) => ({
  key: service.id,
  label: (
    <Link to={service.path} className="block py-0.5">
      {service.icon} {service.name}
    </Link>
  ),
}));

export function MainNavbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const ownerService =
    user?.role === 'owner' && user.ownerServiceId
      ? SERVICE_BY_ID[user.ownerServiceId]
      : undefined;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            SH
          </span>
          <span className="text-base font-semibold text-white sm:text-lg">ServiceHub</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-1 sm:gap-2">
          <NavDropdown label="Explore services" items={exploreItems} />

          <Link
            to="/about"
            className="rounded-md px-2 py-1.5 text-sm font-medium text-white/90 no-underline transition hover:bg-white/10 hover:text-white"
          >
            About us
          </Link>

          <Link
            to="/contact"
            className="rounded-md px-2 py-1.5 text-sm font-medium text-white/90 no-underline transition hover:bg-white/10 hover:text-white"
          >
            Contact us
          </Link>

          {user?.role === 'owner' ? (
            <Link
              to="/cms"
              className="rounded-md px-2 py-1.5 text-sm font-medium text-amber-300 no-underline transition hover:bg-white/10"
            >
              CMS
            </Link>
          ) : null}

          {user?.role === 'owner' && user.ownerServiceId === 'delivery' ? (
            <Link
              to={DELIVERY_ROUTE_PLANNER_PATH}
              className="rounded-md px-2 py-1.5 text-sm font-medium text-emerald-300 no-underline transition hover:bg-white/10"
            >
              Route planner
            </Link>
          ) : null}

          {user ? (
            <div className="flex items-center gap-2 pl-1">
              <span className="hidden text-xs text-slate-300 sm:inline">
                {user.name} · {USER_ROLE_LABELS[user.role]}
                {ownerService ? ` · ${ownerService.name}` : ''}
              </span>
              <AppButton size="small" onClick={handleLogout}>
                Log out
              </AppButton>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-1">
              <Link to="/register" className="no-underline">
                <AppButton size="small">Register</AppButton>
              </Link>
              <Link to="/login" className="no-underline">
                <AppButton type="primary" size="small">
                  Log in
                </AppButton>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
