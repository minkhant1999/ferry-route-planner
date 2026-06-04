import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from 'antd';
import { AppButton, FormInput } from '@/components';
import { useAppDispatch } from '@/store/hooks';
import { updateDepot, updateSchool } from '@/store/features/routePlansSlice';
import type { GeoStop } from '@/types/geo';
import {
  stopSchema,
  type StopFormValues,
} from '@/features/routes/schemas/stopSchema';

interface StopEditorProps {
  planId: string;
  kind: 'depot' | 'school';
  stop: GeoStop;
}

export function StopEditor({ planId, kind, stop }: StopEditorProps) {
  const dispatch = useAppDispatch();
  const title = kind === 'depot' ? 'Home location' : 'School location';

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StopFormValues>({
    resolver: zodResolver(stopSchema),
    values: {
      name: stop.name,
      lat: stop.lat,
      lng: stop.lng,
    },
  });

  const onSubmit = handleSubmit((values) => {
    const updated: GeoStop = {
      id: stop.id,
      name: values.name,
      lat: values.lat,
      lng: values.lng,
    };

    if (kind === 'depot') {
      dispatch(updateDepot({ planId, depot: updated }));
    } else {
      dispatch(updateSchool({ planId, school: updated }));
    }
  });

  return (
    <Card title={title} className="app-card shadow-sm">
      <form onSubmit={onSubmit}>
        <FormInput
          control={control}
          name="name"
          id={`${kind}-name`}
          label="Name"
          error={errors.name?.message}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormInput
            control={control}
            name="lat"
            id={`${kind}-lat`}
            label="Latitude"
            type="number"
            error={errors.lat?.message}
          />
          <FormInput
            control={control}
            name="lng"
            id={`${kind}-lng`}
            label="Longitude"
            type="number"
            error={errors.lng?.message}
          />
        </div>
        <AppButton
          type="default"
          htmlType="submit"
          loading={isSubmitting}
          className="w-full sm:w-auto"
          block
        >
          Update {title.toLowerCase()}
        </AppButton>
      </form>
    </Card>
  );
}
