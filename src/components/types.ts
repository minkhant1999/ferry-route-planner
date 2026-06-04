import type { Control, FieldPath, FieldValues } from 'react-hook-form';

export interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  id: string;
  error?: string;
  wrapperClassName?: string;
  disabled?: boolean;
}
