import { CheckCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import { AppButton } from '@/components';
import type { OptimizedLeg, RouteDirection, RoutePlan } from '@/types/geo';
import { buildLegStopSequence } from '@/utils/routeProgress';

interface StopProgressListProps {
  plan: RoutePlan;
  leg: OptimizedLeg;
  direction: RouteDirection;
  onMarkReached: (stopKey: string) => void;
  onResetProgress: () => void;
}

/**
 * Ordered stop list with reached / next / pending states (Google Maps–style navigation).
 */
export function StopProgressList({
  plan,
  leg,
  direction,
  onMarkReached,
  onResetProgress,
}: StopProgressListProps) {
  const sequence = buildLegStopSequence(direction, plan, leg);
  const reached = leg.reachedStopKeys ?? [];
  const nextIndex = reached.length;
  const allReached = nextIndex >= sequence.length;

  return (
    <div>
      <ol className="mt-2 list-none space-y-2 pl-0 text-sm">
        {sequence.map((stop, index) => {
          const isReached = index < reached.length;
          const isNext = index === nextIndex;

          return (
            <li
              key={stop.key}
              className={`flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2 ${
                isReached
                  ? 'border-emerald-200 bg-emerald-50/80 text-slate-500'
                  : isNext
                    ? 'border-blue-300 bg-blue-50/90 font-medium text-slate-900'
                    : 'border-slate-200 bg-white text-slate-700'
              }`}
            >
              <span className="flex min-w-0 flex-1 items-start gap-2">
                <span className="mt-0.5 w-5 shrink-0 text-center text-xs text-slate-400">
                  {index + 1}.
                </span>
                {isReached ? (
                  <CheckCircleOutlined className="mt-0.5 shrink-0 text-emerald-600" />
                ) : isNext ? (
                  <EnvironmentOutlined className="mt-0.5 shrink-0 text-blue-600" />
                ) : null}
                <span className={isReached ? 'line-through' : ''}>{stop.label}</span>
              </span>
              <span className="flex shrink-0 items-center gap-2">
                {isReached ? (
                  <Tag color="success" className="!m-0">
                    Reached
                  </Tag>
                ) : null}
                {isNext ? (
                  <>
                    <Tag color="processing" className="!m-0">
                      Next
                    </Tag>
                    <AppButton
                      type="link"
                      size="small"
                      className="!h-auto !p-0 !text-xs"
                      label="Mark reached"
                      onClick={() => onMarkReached(stop.key)}
                    />
                  </>
                ) : null}
              </span>
            </li>
          );
        })}
      </ol>
      {reached.length > 0 ? (
        <AppButton
          type="link"
          size="small"
          className="!mt-2 !px-0 !text-xs text-slate-500"
          label="Reset progress"
          onClick={onResetProgress}
        />
      ) : null}
      {allReached ? (
        <p className="mt-2 text-xs font-medium text-emerald-700">Route complete.</p>
      ) : null}
    </div>
  );
}
