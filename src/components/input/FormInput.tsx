import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { Input } from 'antd';
import type { InputProps } from 'antd';
import type { FormFieldProps } from '@/components/types';

export interface FormInputProps<T extends FieldValues> extends FormFieldProps<T> {
  control: Control<T>;
  name: FieldPath<T>;
  placeholder?: string;
  password?: boolean;
  type?: InputProps['type'];
  autoComplete?: string;
}

/**
 * Labeled form field using **Ant Design `Input`** (or `Input.Password`) connected to **react-hook-form** via `Controller`.
 *
 * ### What it does
 * - Renders a label, the input, and an optional error line.
 * - Syncs value and validation with your form through `control` and `name`.
 * - Sets `status="error"` on the Ant Design input when `error` is set.
 *
 * @example Basic text field
 * ```tsx
 * <FormInput
 *   control={control}
 *   name="email"
 *   id="email"
 *   label="Email"
 *   error={errors.email?.message}
 *   autoComplete="email"
 * />
 * ```
 *
 * @example Password field
 * ```tsx
 * <FormInput
 *   password
 *   control={control}
 *   name="password"
 *   id="password"
 *   label="Password"
 *   error={errors.password?.message}
 * />
 * ```
 */
export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  id,
  error,
  wrapperClassName = 'mb-4',
  disabled,
  placeholder,
  password,
  type = 'text',
  autoComplete,
}: FormInputProps<T>) {
  const InputComponent = password ? Input.Password : Input;

  return (
    <div className={wrapperClassName}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <InputComponent
            {...field}
            id={id}
            type={password ? undefined : type}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete={autoComplete}
            status={error ? 'error' : undefined}
            className="w-full !text-base sm:!text-sm"
            value={field.value ?? ''}
            onChange={(event) => {
              const next =
                type === 'number'
                  ? event.target.value === ''
                    ? ''
                    : Number(event.target.value)
                  : event.target.value;
              field.onChange(next);
            }}
          />
        )}
      />
      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
