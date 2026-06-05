import { useState } from 'react';
import { Alert, Card, Segmented, Tag } from 'antd';
import { AppButton } from '@/components';
import type { RouteDirection, RoutePlan } from '@/types/geo';
import { formatDistance, formatDuration } from '@/utils/geo';
import { useRouteOptimization } from '@/features/routes/hooks/useRouteOptimization';
import { useLegNavigation } from '@/features/routes/hooks/useLegNavigation';
import { StopProgressList } from '@/features/routes/components/StopProgressList';
import { useAppDispatch } from '@/store/hooks';
import { markStopReached, resetLegProgress } from '@/store/features/routePlansSlice';

interface OptimizePanelProps {
  plan: RoutePlan;
  mapView: RouteDirection | 'both';
  onMapViewChange: (view: RouteDirection | 'both') => void;
}

export function OptimizePanel({ plan, mapView, onMapViewChange }: OptimizePanelProps) {
  const dispatch = useAppDispatch();
  const { optimizeDirection, optimizeAll, isOptimizing, error } =
    useRouteOptimization(plan);
  const [localError, setLocalError] = useState<string | null>(null);
  const [navActive, setNavActive] = useState(true);

  useLegNavigation(plan, mapView, navActive);

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
        (OSRM). Enable navigation to auto-mark stops when you arrive (~80 m) and trim
        the route line on the map.
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

      {(plan.morning || plan.evening) && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <AppButton
            type={navActive ? 'primary' : 'default'}
            size="small"
            label={navActive ? 'Navigation on' : 'Navigation off'}
            onClick={() => setNavActive((v) => !v)}
          />
          <span className="text-xs text-slate-500">
            Uses your GPS to mark stops and hide driven route behind you.
          </span>
        </div>
      )}

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
            <StopProgressList
              plan={plan}
              leg={plan.morning}
              direction="morning"
              onMarkReached={(stopKey) =>
                dispatch(markStopReached({ planId: plan.id, direction: 'morning', stopKey }))
              }
              onResetProgress={() =>
                dispatch(resetLegProgress({ planId: plan.id, direction: 'morning' }))
              }
            />
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
            <StopProgressList
              plan={plan}
              leg={plan.evening}
              direction="evening"
              onMarkReached={(stopKey) =>
                dispatch(markStopReached({ planId: plan.id, direction: 'evening', stopKey }))
              }
              onResetProgress={() =>
                dispatch(resetLegProgress({ planId: plan.id, direction: 'evening' }))
              }
            />
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-200 p-3 text-sm text-slate-500 sm:p-4">
            Evening route not optimized yet.
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Blue = morning · dashed purple = evening · reached segments disappear from the map
      </p>
    </Card>
  );
}

export type { RouteDirection };
