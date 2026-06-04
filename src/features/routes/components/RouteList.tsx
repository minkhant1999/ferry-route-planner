import { Card, List, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AppButton } from '@/components';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { deletePlan, selectPlan } from '@/store/features/routePlansSlice';
import { formatDistance, formatDuration } from '@/utils/geo';

export function RouteList() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const plans = useAppSelector((s) => s.routePlans.plans);

  return (
    <Card title="Your route plans" className="app-card shadow-sm">
      <List
        dataSource={plans}
        locale={{ emptyText: 'No routes yet. Create one to get started.' }}
        renderItem={(plan) => (
          <List.Item className="!flex-col !items-stretch gap-3 !px-0 sm:!flex-row sm:!items-center sm:!px-0">
            <List.Item.Meta
              className="!mb-0 min-w-0"
              title={
                <span className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="break-words">{plan.name}</span>
                  {plan.grade ? <Tag className="!m-0">{plan.grade}</Tag> : null}
                  <Tag color="processing" className="!m-0">
                    {plan.schedule}
                  </Tag>
                </span>
              }
              description={
                <span className="mt-1 block text-xs leading-relaxed text-slate-500 sm:text-sm">
                  {plan.students.length} bus stops
                  <span className="hidden sm:inline"> · </span>
                  <span className="block sm:inline">
                    {plan.morning
                      ? `AM ${formatDistance(plan.morning.distanceMeters)} (${formatDuration(plan.morning.durationSeconds)})`
                      : 'AM not planned'}
                  </span>
                  <span className="hidden sm:inline"> · </span>
                  <span className="block sm:inline">
                    {plan.evening
                      ? `PM ${formatDistance(plan.evening.distanceMeters)} (${formatDuration(plan.evening.durationSeconds)})`
                      : 'PM not planned'}
                  </span>
                </span>
              }
            />
            <div className="flex w-full gap-2 sm:w-auto sm:shrink-0">
              <AppButton
                type="primary"
                className="flex-1 sm:flex-none"
                block
                label="Open"
                onClick={() => {
                  dispatch(selectPlan(plan.id));
                  navigate(`/routes/${plan.id}`);
                }}
              />
              <AppButton
                danger
                className="flex-1 sm:flex-none"
                block
                label="Delete"
                onClick={() => dispatch(deletePlan(plan.id))}
              />
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
}
