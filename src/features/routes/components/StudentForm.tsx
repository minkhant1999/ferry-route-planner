import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from 'antd';
import { AppButton, FormInput } from '@/components';
import { useAppDispatch } from '@/store/hooks';
import { addStudent } from '@/store/features/routePlansSlice';
import {
  studentSchema,
  type StudentFormValues,
} from '@/features/routes/schemas/studentSchema';

interface StudentFormProps {
  planId: string;
  defaultLat?: number;
  defaultLng?: number;
  /** When true, omits outer card (used inside StudentStopsPanel). */
  embedded?: boolean;
}

export function StudentForm({
  planId,
  defaultLat = 25.2,
  defaultLng = 55.27,
  embedded = false,
}: StudentFormProps) {
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: '',
      phone: '',
      lat: defaultLat,
      lng: defaultLng,
    },
  });

  const onSubmit = handleSubmit((values) => {
    dispatch(
      addStudent({
        planId,
        student: {
          id: crypto.randomUUID(),
          name: values.name.trim(),
          phone: values.phone.trim(),
          lat: values.lat,
          lng: values.lng,
        },
      }),
    );
    reset({ name: '', phone: '', lat: values.lat, lng: values.lng });
  });

  const form = (
    <form onSubmit={onSubmit}>
      <FormInput
        control={control}
        name="name"
        id="student-name"
        label="Student name"
        placeholder="Ahmed Ali"
        error={errors.name?.message}
      />
      <FormInput
        control={control}
        name="phone"
        id="student-phone"
        label="Student phone number"
        type="tel"
        placeholder="09 123 456 789"
        autoComplete="tel"
        error={errors.phone?.message}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormInput
          control={control}
          name="lat"
          id="student-lat"
          label="Home latitude"
          type="number"
          placeholder="25.2048"
          error={errors.lat?.message}
        />
        <FormInput
          control={control}
          name="lng"
          id="student-lng"
          label="Home longitude"
          type="number"
          placeholder="55.2708"
          error={errors.lng?.message}
        />
      </div>
      <AppButton
        type="primary"
        htmlType="submit"
        loading={isSubmitting}
        className="w-full sm:w-auto"
        block
      >
        Add student
      </AppButton>
    </form>
  );

  if (embedded) {
    return form;
  }

  return (
    <Card title="Add student stop" className="app-card shadow-sm">
      {form}
    </Card>
  );
}
