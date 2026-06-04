import { z } from 'zod';
import { studentHomeSchema } from './studentSchema';

export const routePlanSchema = z.object({
  name: z.string().min(1, 'Route name is required'),
  description: z.string().optional(),
  grade: z.string().optional(),
  schedule: z.enum(['morning', 'evening', 'both']),
  depotName: z.string().min(1, 'Depot name is required'),
  depotLat: z.number().min(-90, 'Latitude must be -90 to 90').max(90, 'Latitude must be -90 to 90'),
  depotLng: z
    .number()
    .min(-180, 'Longitude must be -180 to 180')
    .max(180, 'Longitude must be -180 to 180'),
  schoolName: z.string().min(1, 'School name is required'),
  schoolLat: z.number().min(-90, 'Latitude must be -90 to 90').max(90, 'Latitude must be -90 to 90'),
  schoolLng: z
    .number()
    .min(-180, 'Longitude must be -180 to 180')
    .max(180, 'Longitude must be -180 to 180'),
  students: z.array(studentHomeSchema),
});

export type RoutePlanFormValues = z.infer<typeof routePlanSchema>;
