import { useState } from 'react';
import { Alert, Card, Segmented, Tag } from 'antd';
import { AppButton } from '@/components';
import type { RouteDirection, RoutePlan } from '@/types/geo';
import { formatDistance, formatDuration } from '@/utils/geo';
import { useRouteOptimization } from '@/features/routes/hooks/useRouteOptimization';

interface OptimizePanelProps {
  plan: RoutePlan;
  mapView: RouteDirection | 'both';
  onMapViewChange: (view: RouteDirection | 'both') => void;
}

function StopOrderList({
  plan,
  leg,
}: {
  plan: RoutePlan;
  leg: NonNullable<RoutePlan['morning']>;
}) {
  const studentMap = new Map(
    plan.students.map((s) => [s.id, s.phone ? `${s.name} (${s.phone})` : s.name]),
  );

  return (
    <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700">
      <li>{plan.depot.name} (home)</li>
      {leg.stopIds.map((id) => (
        <li key={id}>{studentMap.get(id) ?? 'Student'}</li>
      ))}
      <li>{plan.school.name} (school)</li>
    </ol>
  );
}

function EveningStopOrderList({
  plan,
  leg,
}: {
  plan: RoutePlan;
  leg: NonNullable<RoutePlan['evening']>;
}) {
  const studentMap = new Map(
    plan.students.map((s) => [s.id, s.phone ? `${s.name} (${s.phone})` : s.name]),
  );

  return (
    <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700">
      <li>{plan.school.name} (school)</li>
      {leg.stopIds.map((id) => (
        <li key={id}>{studentMap.get(id) ?? 'Student'}</li>
      ))}
      <li>{plan.depot.name} (home)</li>
    </ol>
  );
}

export function OptimizePanel({ plan, mapView, onMapViewChange }: OptimizePanelProps) {
  const { optimizeDirection, optimizeAll, isOptimizing, error } =
    useRouteOptimization(plan);
  const [localError, setLocalError] = useState<string | null>(null);

  const run = async (fn: () => Promise<void>) => {
    setLocalError(null);
    try {
      await fn();
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : 'Optimization failed');
    }
  };

  const errorMessage =
    localError ?? (error && 'message' in error ? String(error.message) : null);

  return (
    <Card title="Route optimization" className="app-card shadow-sm">
      <p className="mb-4 text-sm leading-relaxed text-slate-600">
        Plans the best pickup order, then loads real driving paths from OpenStreetMap
        (OSRM).
      </p>

      <div className="app-btn-stack mb-4">
        {(plan.schedule === 'morning' || plan.schedule === 'both') && (
          <AppButton
            type="primary"
            loading={isOptimizing}
            block
            onClick={() => run(() => optimizeDirection('morning'))}
          >
            <span className="hidden sm:inline">Optimize morning → school</span>
            <span className="sm:hidden">Morning → school</span>
          </AppButton>
        )}
        {(plan.schedule === 'evening' || plan.schedule === 'both') && (
          <AppButton
            type="primary"
            loading={isOptimizing}
            block
            onClick={() => run(() => optimizeDirection('evening'))}
          >
            <span className="hidden sm:inline">Optimize evening → home</span>
            <span className="sm:hidden">Evening → home</span>
          </AppButton>
        )}
        {plan.schedule === 'both' && (
          <AppButton loading={isOptimizing} block onClick={() => run(optimizeAll)}>
            Optimize both
          </AppButton>
        )}
      </div>

      {errorMessage ? (
        <Alert type="error" message={errorMessage} className="mb-4 text-sm" showIcon />
      ) : null}

      <Segmented
        block
        value={mapView}
        onChange={(v) => onMapViewChange(v as RouteDirection | 'both')}
        options={[
          { label: 'Both', value: 'both' },
          { label: 'Morning', value: 'morning' },
          { label: 'Evening', value: 'evening' },
        ]}
        className="mb-4 !max-w-full"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {plan.morning ? (
          <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-3 sm:p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Tag color="blue">Morning</Tag>
              <span className="text-xs text-slate-600 sm:text-sm">
                {formatDistance(plan.morning.distanceMeters)} ·{' '}
                {formatDuration(plan.morning.durationSeconds)}
              </span>
            </div>
            <StopOrderList plan={plan} leg={plan.morning} />
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-200 p-3 text-sm text-slate-500 sm:p-4">
            Morning route not optimized yet.
          </div>
        )}

        {plan.evening ? (
          <div className="rounded-lg border border-purple-100 bg-purple-50/50 p-3 sm:p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Tag color="purple">Evening</Tag>
              <span className="text-xs text-slate-600 sm:text-sm">
                {formatDistance(plan.evening.distanceMeters)} ·{' '}
                {formatDuration(plan.evening.durationSeconds)}
              </span>
            </div>
            <EveningStopOrderList plan={plan} leg={plan.evening} />
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-200 p-3 text-sm text-slate-500 sm:p-4">
            Evening route not optimized yet.
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Blue = morning · dashed purple = evening
      </p>
    </Card>
  );
}

export type { RouteDirection };
