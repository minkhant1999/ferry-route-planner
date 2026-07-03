import { useEffect } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from 'antd';
import { AppButton, FormInput, FormSelect } from '@/components';
import {
  HOUSE_STATUS_OPTIONS,
  RENTER_ID_TYPE_OPTIONS,
  houseFormSchema,
  type HouseFormValues,
} from '@/features/house-renting/schemas/houseFormSchema';
import {
  PhotoUploadField,
  SinglePhotoUpload,
} from '@/features/house-renting/components/PhotoUploadField';
import { addMonthsIso, toDatetimeLocalValue } from '@/utils/imageUpload';
import type { HouseListing } from '@/types/house';

interface HouseFormProps {
  initial?: HouseListing;
  onSubmit: (values: HouseFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
}

const defaultRenter = {
  name: '',
  phone: '',
  idType: 'nrc' as const,
  idNumber: '',
  contractStart: '',
  durationMonths: 12,
  contractEnd: '',
  contractPhoto: '',
  nrcPhoto: '',
};

export function HouseForm({ initial, onSubmit, onCancel, submitting }: HouseFormProps) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<HouseFormValues>({
    resolver: zodResolver(houseFormSchema),
    defaultValues: initial
      ? {
          title: initial.title,
          description: initial.description,
          photos: initial.photos,
          status: initial.status,
          renter: initial.renter ?? defaultRenter,
        }
      : {
          title: '',
          description: '',
          photos: [],
          status: 'available',
          renter: defaultRenter,
        },
  });

  const status = useWatch({ control, name: 'status' });
  const contractStart = useWatch({ control, name: 'renter.contractStart' });
  const durationMonths = useWatch({ control, name: 'renter.durationMonths' });

  useEffect(() => {
    if (status !== 'rented' || !contractStart || !durationMonths) return;
    const end = addMonthsIso(contractStart, Number(durationMonths));
    if (end) setValue('renter.contractEnd', toDatetimeLocalValue(end));
  }, [status, contractStart, durationMonths, setValue]);

  return (
    <Card className="app-card shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <FormInput
          control={control}
          name="title"
          id="house-title"
          label="House title"
          error={errors.title?.message}
          placeholder="e.g. Sunny 2BR apartment"
        />

        <FormInput
          control={control}
          name="description"
          id="house-description"
          label="Description"
          error={errors.description?.message}
          placeholder="Rooms, amenities, location notes…"
        />

        <Controller
          control={control}
          name="photos"
          render={({ field }) => (
            <PhotoUploadField
              label="House photos"
              photos={field.value ?? []}
              onChange={field.onChange}
              error={errors.photos?.message}
            />
          )}
        />

        <FormSelect
          control={control}
          name="status"
          id="house-status"
          label="Status"
          options={HOUSE_STATUS_OPTIONS}
          error={errors.status?.message}
        />

        {status === 'rented' ? (
          <div className="app-form-section !mt-4 space-y-1">
            <h3 className="text-sm font-semibold text-slate-900">Renter details</h3>

            <FormInput
              control={control}
              name="renter.name"
              id="renter-name"
              label="Renter name"
              error={errors.renter?.name?.message}
            />

            <FormInput
              control={control}
              name="renter.phone"
              id="renter-phone"
              label="Phone number"
              error={errors.renter?.phone?.message}
            />

            <FormSelect
              control={control}
              name="renter.idType"
              id="renter-id-type"
              label="ID type"
              options={RENTER_ID_TYPE_OPTIONS}
              error={errors.renter?.idType?.message}
            />

            <FormInput
              control={control}
              name="renter.idNumber"
              id="renter-id-number"
              label="NRC or passport number"
              error={errors.renter?.idNumber?.message}
            />

            <FormInput
              control={control}
              name="renter.contractStart"
              id="renter-contract-start"
              label="Contract start"
              type="datetime-local"
              error={errors.renter?.contractStart?.message}
            />

            <FormInput
              control={control}
              name="renter.durationMonths"
              id="renter-duration"
              label="Duration (months)"
              type="number"
              error={errors.renter?.durationMonths?.message}
            />

            <FormInput
              control={control}
              name="renter.contractEnd"
              id="renter-contract-end"
              label="Contract end (auto-calculated)"
              disabled
              error={errors.renter?.contractEnd?.message}
            />

            <Controller
              control={control}
              name="renter.contractPhoto"
              render={({ field }) => (
                <SinglePhotoUpload
                  label="Photo of contract"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.renter?.contractPhoto?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="renter.nrcPhoto"
              render={({ field }) => (
                <SinglePhotoUpload
                  label="Photo of NRC / passport"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.renter?.nrcPhoto?.message}
                />
              )}
            />
          </div>
        ) : null}

        <div className="app-btn-stack !mt-6">
          <AppButton type="primary" htmlType="submit" loading={submitting}>
            {initial ? 'Save changes' : 'Add house'}
          </AppButton>
          <AppButton onClick={onCancel}>Cancel</AppButton>
        </div>
      </form>
    </Card>
  );
}
