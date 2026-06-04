import { z } from 'zod';

export const stopSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  lat: z.number().min(-90, 'Latitude must be -90 to 90').max(90, 'Latitude must be -90 to 90'),
  lng: z
    .number()
    .min(-180, 'Longitude must be -180 to 180')
    .max(180, 'Longitude must be -180 to 180'),
});

export type StopFormValues = z.infer<typeof stopSchema>;
