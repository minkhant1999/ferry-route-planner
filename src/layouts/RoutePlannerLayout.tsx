import { Link, Outlet } from 'react-router-dom';
import { MainFooter } from '@/components/footer';
import { DELIVERY_ROUTE_PLANNER_PATH } from '@/constants/services';

export function RoutePlannerLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="text-sm font-medium text-slate-600 no-underline hover:text-blue-600">
            ← ServiceHub home
          </Link>
          <Link
            to={DELIVERY_ROUTE_PLANNER_PATH}
            className="text-base font-semibold text-slate-900 no-underline"
          >
            Delivery route planner
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
        <Outlet />
      </main>
      <MainFooter />
    </div>
  );
}
