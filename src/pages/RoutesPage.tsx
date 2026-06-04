import { CreateRouteForm, RouteList } from '@/features/routes';

export function RoutesPage() {
  return (
    <div className="app-page">
      <div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
          School Bus Route Planner
        </h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
          Set home location, school location, and bus stops (student homes) in between.
          Use <strong>Add More</strong> for each student stop, then optimize morning and
          evening routes on the map.
        </p>
      </div>

      <CreateRouteForm />
      <RouteList />
    </div>
  );
}
