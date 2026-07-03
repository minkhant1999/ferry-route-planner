import { z } from 'zod';

const renterSchema = z.object({
  name: z.string().min(2, 'Renter name is required'),
  phone: z.string().min(6, 'Phone number is required'),
  idType: z.enum(['nrc', 'passport']),
  idNumber: z.string().min(4, 'NRC or passport number is required'),
  contractStart: z.string().min(1, 'Contract start is required'),
  durationMonths: z.number().min(1, 'Duration must be at least 1 month'),
  contractEnd: z.string().min(1, 'Contract end is required'),
  contractPhoto: z.string().optional(),
  nrcPhoto: z.string().optional(),
});

export const houseFormSchema = z
  .object({
    title: z.string().min(2, 'Title is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    photos: z.array(z.string()).min(1, 'Upload at least one house photo'),
    status: z.enum(['available', 'rented']),
    renter: renterSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === 'rented') {
      if (!data.renter?.name) {
        ctx.addIssue({
          code: 'custom',
          message: 'Renter details are required when status is Rented',
          path: ['renter', 'name'],
        });
      }
      if (!data.renter?.contractPhoto) {
        ctx.addIssue({
          code: 'custom',
          message: 'Contract photo is required',
          path: ['renter', 'contractPhoto'],
        });
      }
      if (!data.renter?.nrcPhoto) {
        ctx.addIssue({
          code: 'custom',
          message: 'NRC / passport photo is required',
          path: ['renter', 'nrcPhoto'],
        });
      }
    }
  });

export type HouseFormValues = z.infer<typeof houseFormSchema>;

export const HOUSE_STATUS_OPTIONS = [
  { label: 'Available', value: 'available' },
  { label: 'Rented', value: 'rented' },
];

export const RENTER_ID_TYPE_OPTIONS = [
  { label: 'NRC', value: 'nrc' },
  { label: 'Passport', value: 'passport' },
];
