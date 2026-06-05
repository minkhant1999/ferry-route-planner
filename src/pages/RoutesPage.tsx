import { Spin } from 'antd';
import { CreateRouteForm, RouteList } from '@/features/routes';
import { useAppSelector } from '@/store/hooks';

export function RoutesPage() {
  const isHydrated = useAppSelector((s) => s.routePlans.isHydrated);

  if (!isHydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spin size="large" tip="Loading saved routes…" />
      </div>
    );
  }

  return (
    <div className="app-page">
      <div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
        Route Planner
        </h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
          Set start point, end point, and stops in between.
          Use <strong>Add More</strong> for each stop, then you can also optimize morning and
          evening routes on the map.
        </p>
      </div>

      <CreateRouteForm />
      <RouteList />
    </div>
  );
}
