import { useForm, type Control, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Card } from 'antd';
import { AppButton, FormInput, FormSelect } from '@/components';
import { GRADE_PRESETS, ROUTE_SCHEDULE_OPTIONS } from '@/constants/routeTypes';
import { useAppDispatch } from '@/store/hooks';
import { addPlan } from '@/store/features/routePlansSlice';
import {
  StudentLocationsEditor,
  type StudentBusStopsFormValues,
} from '@/features/routes/components/StudentLocationsEditor';
import {
  routePlanSchema,
  type RoutePlanFormValues,
} from '@/features/routes/schemas/routePlanSchema';
import type { StudentHomeValues } from '@/features/routes/schemas/studentSchema';

interface CreateRouteFormProps {
  onCreated?: (planId: string) => void;
}

const gradeOptions = GRADE_PRESETS.map((g) => ({ label: g, value: g }));

export function CreateRouteForm({ onCreated }: CreateRouteFormProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RoutePlanFormValues>({
    resolver: zodResolver(routePlanSchema),
    defaultValues: {
      name: '',
      description: '',
      grade: '',
      schedule: 'both',
      depotName: 'Home',
      depotLat: 25.2048,
      depotLng: 55.2708,
      schoolName: 'School',
      schoolLat: 25.1972,
      schoolLng: 55.2744,
      students: [{ name: '', phone: '', lat: 25.2, lng: 55.27 }],
    },
  });

  const onSubmit = handleSubmit((values) => {
    const planId = crypto.randomUUID();
    const students = values.students
      .filter((s: StudentHomeValues) => s.name.trim().length > 0)
      .map((s: StudentHomeValues) => ({
        id: crypto.randomUUID(),
        name: s.name.trim(),
        phone: s.phone.trim(),
        lat: s.lat,
        lng: s.lng,
      }));

    dispatch(
      addPlan({
        id: planId,
        name: values.name,
        description: values.description,
        grade: values.grade || undefined,
        schedule: values.schedule,
        depot: {
          name: values.depotName,
          lat: values.depotLat,
          lng: values.depotLng,
        },
        school: {
          name: values.schoolName,
          lat: values.schoolLat,
          lng: values.schoolLng,
        },
        students,
      }),
    );
    reset();
    onCreated?.(planId);
    navigate(`/routes/${planId}`);
  });

  return (
    <Card title="Create route plan" className="app-card shadow-sm">
      <form onSubmit={onSubmit}>
        <div className="app-form-grid">
          <FormInput
            control={control}
            name="name"
            id="route-name"
            label="Route name"
            placeholder="Route Name"
            error={errors.name?.message}
          />
          <FormSelect
            control={control}
            name="grade"
            id="route-grade"
            label="Grade (optional)"
            options={gradeOptions}
            placeholder="Select grade"
            allowClear
            error={errors.grade?.message}
          />
          <FormInput
            control={control}
            name="description"
            id="route-description"
            label="Description"
            placeholder="North zone pickup"
            error={errors.description?.message}
            wrapperClassName="mb-3 app-form-span-all"
          />
          <FormSelect
            control={control}
            name="schedule"
            id="route-schedule"
            label="Schedule"
            options={ROUTE_SCHEDULE_OPTIONS}
            error={errors.schedule?.message}
            wrapperClassName="mb-3 app-form-span-all"
          />

          <p className="app-form-span-all mb-1 text-sm font-semibold text-slate-800">
            1. Home location (bus start &amp; end)
          </p>
          <FormInput
            control={control}
            name="depotName"
            id="depot-name"
            label="Home name"
            placeholder="Bus depot / garage"
            error={errors.depotName?.message}
          />
          <div className="hidden md:block" aria-hidden />
          <FormInput
            control={control}
            name="depotLat"
            id="depot-lat"
            label="Home latitude"
            type="number"
            error={errors.depotLat?.message}
          />
          <FormInput
            control={control}
            name="depotLng"
            id="depot-lng"
            label="Home longitude"
            type="number"
            error={errors.depotLng?.message}
          />

          <p className="app-form-span-all mb-1 text-sm font-semibold text-slate-800">
            2. School location (destination)
          </p>
          <FormInput
            control={control}
            name="schoolName"
            id="school-name"
            label="School name"
            error={errors.schoolName?.message}
          />
          <div className="hidden md:block" aria-hidden />
          <FormInput
            control={control}
            name="schoolLat"
            id="school-lat"
            label="School latitude"
            type="number"
            error={errors.schoolLat?.message}
          />
          <FormInput
            control={control}
            name="schoolLng"
            id="school-lng"
            label="School longitude"
            type="number"
            error={errors.schoolLng?.message}
          />
        </div>

        <section className="app-form-section">
          <p className="mb-3 text-sm font-semibold text-slate-800">
            3. Bus stops between home and school
          </p>
          <StudentLocationsEditor
            control={control as unknown as Control<StudentBusStopsFormValues>}
            errors={errors as FieldErrors<StudentBusStopsFormValues>}
            defaultLat={25.1972}
            defaultLng={55.2744}
          />
        </section>

        <div className="mt-4">
          <AppButton
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            className="!w-full md:!w-auto"
          >
            Create route
          </AppButton>
        </div>
      </form>
    </Card>
  );
}
