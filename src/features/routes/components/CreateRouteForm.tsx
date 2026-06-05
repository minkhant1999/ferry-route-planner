import { useEffect, useRef } from 'react';
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
import { useGeolocation } from '@/hooks/useGeolocation';
import { createId } from '@/utils/createId';
import { roundCoordinate } from '@/utils/geo';

const FALLBACK_DEPOT = { lat: 25.2048, lng: 55.2708 };
const FALLBACK_SCHOOL = { lat: 25.1972, lng: 55.2744 };
const FALLBACK_STOP = { lat: 25.2, lng: 55.27 };

interface CreateRouteFormProps {
  onCreated?: (planId: string) => void;
}

const gradeOptions = GRADE_PRESETS.map((g) => ({ label: g, value: g }));

export function CreateRouteForm({ onCreated }: CreateRouteFormProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { position, loading: geoLoading } = useGeolocation();
  const locationApplied = useRef(false);

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RoutePlanFormValues>({
    resolver: zodResolver(routePlanSchema),
    defaultValues: {
      name: '',
      description: '',
      grade: '',
      schedule: 'both',
      depotName: 'Home',
      depotLat: FALLBACK_DEPOT.lat,
      depotLng: FALLBACK_DEPOT.lng,
      schoolName: 'School',
      schoolLat: FALLBACK_SCHOOL.lat,
      schoolLng: FALLBACK_SCHOOL.lng,
      students: [{ name: '', phone: '', lat: FALLBACK_STOP.lat, lng: FALLBACK_STOP.lng }],
    },
  });

  useEffect(() => {
    if (!position || locationApplied.current) {
      return;
    }
    locationApplied.current = true;

    const lat = roundCoordinate(position.lat);
    const lng = roundCoordinate(position.lng);
    const values = getValues();

    reset({
      ...values,
      depotLat: lat,
      depotLng: lng,
      schoolLat: lat,
      schoolLng: lng,
      students: values.students.map((student, index) =>
        index === 0 ? { ...student, lat, lng } : student,
      ),
    });
  }, [position, reset, getValues]);

  const stopDefaultLat = position ? roundCoordinate(position.lat) : FALLBACK_STOP.lat;
  const stopDefaultLng = position ? roundCoordinate(position.lng) : FALLBACK_STOP.lng;

  const onSubmit = handleSubmit((values) => {
    const planId = createId();
    const students = values.students
      .filter((s: StudentHomeValues) => s.name.trim().length > 0)
      .map((s: StudentHomeValues) => ({
        id: createId(),
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
            1. Start Point
            {geoLoading && (
              <span className="ml-2 text-xs font-normal text-slate-500">
                Detecting your location…
              </span>
            )}
            {position && (
              <span className="ml-2 text-xs font-normal text-emerald-600">
                Using your current location
              </span>
            )}
          </p>
          <FormInput
            control={control}
            name="depotName"
            id="depot-name"
            label="Start Point name"
            placeholder="Bus depot / garage"
            error={errors.depotName?.message}
          />
          <div className="hidden md:block" aria-hidden />
          <FormInput
            control={control}
            name="depotLat"
            id="depot-lat"
            label="Start Point latitude"
            type="number"
            error={errors.depotLat?.message}
          />
          <FormInput
            control={control}
            name="depotLng"
            id="depot-lng"
            label="Start Point longitude"
            type="number"
            error={errors.depotLng?.message}
          />

          <p className="app-form-span-all mb-1 text-sm font-semibold text-slate-800">
            2. End Point
            {position && (
              <span className="ml-2 text-xs font-normal text-emerald-600">
                Using your current location
              </span>
            )}
          </p>
          <FormInput
            control={control}
            name="schoolName"
            id="school-name"
            label="End Point name"
            error={errors.schoolName?.message}
          />
          <div className="hidden md:block" aria-hidden />
          <FormInput
            control={control}
            name="schoolLat"
            id="school-lat"
            label="End Point latitude"
            type="number"
            error={errors.schoolLat?.message}
          />
          <FormInput
            control={control}
            name="schoolLng"
            id="school-lng"
            label="End Point longitude"
            type="number"
            error={errors.schoolLng?.message}
          />
        </div>

        <section className="app-form-section">
          <p className="mb-3 text-sm font-semibold text-slate-800">
            3. Stops between start point and end point
          </p>
          <StudentLocationsEditor
            control={control as unknown as Control<StudentBusStopsFormValues>}
            errors={errors as FieldErrors<StudentBusStopsFormValues>}
            defaultLat={stopDefaultLat}
            defaultLng={stopDefaultLng}
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
