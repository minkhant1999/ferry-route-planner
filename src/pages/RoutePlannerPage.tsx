import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Spin, Tag } from 'antd';
import {
  OptimizePanel,
  RouteMap,
  StopEditor,
  StudentStopsPanel,
} from '@/features/routes';
import type { RouteDirection } from '@/types/geo';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectPlan } from '@/store/features/routePlansSlice';
import { AppButton } from '@/components';

export function RoutePlannerPage() {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isHydrated = useAppSelector((s) => s.routePlans.isHydrated);
  const plan = useAppSelector((s) =>
    s.routePlans.plans.find((p) => p.id === planId),
  );
  const [mapView, setMapView] = useState<RouteDirection | 'both'>('both');

  useEffect(() => {
    if (planId) {
      dispatch(selectPlan(planId));
    }
  }, [dispatch, planId]);

  if (!isHydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spin size="large" tip="Loading saved routes…" />
      </div>
    );
  }

  if (!plan) {
    return (
      <Alert
        type="warning"
        showIcon
        message="Route not found"
        className="text-sm"
        action={
          <AppButton
            className="mt-2 w-full sm:mt-0 sm:w-auto"
            label="Back to routes"
            onClick={() => navigate('/')}
          />
        }
      />
    );
  }

  return (
    <div className="app-page">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold break-words text-slate-900 sm:text-2xl">
            {plan.name}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {plan.description ?? 'School bus route planner'}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
            {plan.grade ? <Tag>{plan.grade}</Tag> : null}
            <Tag color="processing">{plan.schedule}</Tag>
            <Tag>{plan.students.length} bus stops</Tag>
          </div>
        </div>
        <AppButton
          className="w-full shrink-0 sm:w-auto"
          label="← All routes"
          onClick={() => navigate('/')}
        />
      </div>

      <RouteMap plan={plan} activeDirection={mapView} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <StopEditor planId={plan.id} kind="depot" stop={plan.depot} />
        <StopEditor planId={plan.id} kind="school" stop={plan.school} />
      </div>

      <StudentStopsPanel plan={plan} />

      <OptimizePanel
        plan={plan}
        mapView={mapView}
        onMapViewChange={setMapView}
      />
    </div>
  );
}
