import { z } from 'zod';

export const studentHomeSchema = z.object({
  name: z.string().min(1, 'Student name is required'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[\d\s+\-()]+$/, 'Use digits, spaces, +, -, or parentheses only'),
  lat: z.number().min(-90, 'Latitude must be -90 to 90').max(90, 'Latitude must be -90 to 90'),
  lng: z
    .number()
    .min(-180, 'Longitude must be -180 to 180')
    .max(180, 'Longitude must be -180 to 180'),
});

/** Single student on the create-route form (same shape as add-student form). */
export const studentSchema = studentHomeSchema;

export type StudentHomeValues = z.infer<typeof studentHomeSchema>;
export type StudentFormValues = StudentHomeValues;
