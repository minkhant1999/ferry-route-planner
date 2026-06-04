import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, message } from 'antd';
import { z } from 'zod';
import { AppButton } from '@/components';
import { useAppDispatch } from '@/store/hooks';
import { setStudents } from '@/store/features/routePlansSlice';
import type { RoutePlan } from '@/types/geo';
import { studentHomeSchema } from '@/features/routes/schemas/studentSchema';
import type { StudentHomeValues } from '@/features/routes/schemas/studentSchema';
import { StudentLocationsEditor } from '@/features/routes/components/StudentLocationsEditor';

const planStopsSchema = z.object({
  students: z.array(studentHomeSchema),
});

type PlanStopsFormValues = z.infer<typeof planStopsSchema>;

interface PlanStudentBusStopsProps {
  plan: RoutePlan;
}

function toFormStops(plan: RoutePlan): StudentHomeValues[] {
  if (plan.students.length === 0) {
    return [{ name: '', phone: '', lat: plan.school.lat, lng: plan.school.lng }];
  }
  return plan.students.map((s) => ({
    name: s.name,
    phone: s.phone,
    lat: s.lat,
    lng: s.lng,
  }));
}

export function PlanStudentBusStops({ plan }: PlanStudentBusStopsProps) {
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PlanStopsFormValues>({
    resolver: zodResolver(planStopsSchema),
    values: { students: toFormStops(plan) },
  });

  const onSave = handleSubmit((values) => {
    const students = values.students
      .filter((s) => s.name.trim().length > 0)
      .map((s) => ({
        id: crypto.randomUUID(),
        name: s.name.trim(),
        phone: s.phone.trim(),
        lat: s.lat,
        lng: s.lng,
      }));

    dispatch(setStudents({ planId: plan.id, students }));
    message.success(
      students.length === 0
        ? 'Bus stops cleared'
        : `Saved ${students.length} bus stop${students.length === 1 ? '' : 's'}`,
    );
  });

  return (
    <Card
      title="Bus stops — student home locations"
      className="app-card shadow-sm"
    >
      <StudentLocationsEditor
        control={control}
        errors={errors}
        defaultLat={plan.school.lat}
        defaultLng={plan.school.lng}
      />
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <AppButton
          type="primary"
          loading={isSubmitting}
          onClick={onSave}
          className="!w-full sm:!w-auto"
        >
          Save bus stops
        </AppButton>
        <span className="text-center text-xs text-slate-500 sm:text-left">
          Use <strong>Add More</strong> for each student, then save.
        </span>
      </div>
    </Card>
  );
}
