import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { Select } from 'antd';
import type { FormFieldProps } from '@/components/types';

export interface SelectOption {
  label: string;
  value: string;
}

export interface FormSelectProps<T extends FieldValues> extends FormFieldProps<T> {
  control: Control<T>;
  name: FieldPath<T>;
  options: SelectOption[];
  placeholder?: string;
  allowClear?: boolean;
}

/**
 * Labeled dropdown using **Ant Design `Select`** connected to **react-hook-form** via `Controller`.
 *
 * ### What it does
 * - Renders a label, select control, and optional error line.
 * - Syncs selected value with your form through `control` and `name`.
 * - Sets `status="error"` when validation fails.
 *
 * @example Schedule picker
 * ```tsx
 * <FormSelect
 *   control={control}
 *   name="schedule"
 *   id="schedule"
 *   label="Schedule"
 *   options={ROUTE_SCHEDULE_OPTIONS}
 *   error={errors.schedule?.message}
 * />
 * ```
 */
export function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  id,
  error,
  options,
  wrapperClassName = 'mb-4',
  disabled,
  placeholder,
  allowClear,
}: FormSelectProps<T>) {
  return (
    <div className={wrapperClassName}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            {...field}
            id={id}
            options={options}
            placeholder={placeholder}
            disabled={disabled}
            allowClear={allowClear}
            status={error ? 'error' : undefined}
            className="w-full"
          />
        )}
      />
      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
