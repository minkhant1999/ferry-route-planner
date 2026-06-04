import { Card } from 'antd';
import type { RoutePlan } from '@/types/geo';
import { StudentForm } from '@/features/routes/components/StudentForm';
import { StudentTable } from '@/features/routes/components/StudentTable';

interface StudentStopsPanelProps {
  plan: RoutePlan;
}

/** Add student stop form + list table (matches route detail layout). */
export function StudentStopsPanel({ plan }: StudentStopsPanelProps) {
  return (
    <Card title="Add student stop" className="app-card shadow-sm">
      <StudentForm
        planId={plan.id}
        defaultLat={plan.school.lat}
        defaultLng={plan.school.lng}
        embedded
      />
      <StudentTable planId={plan.id} students={plan.students} embedded />
    </Card>
  );
}
