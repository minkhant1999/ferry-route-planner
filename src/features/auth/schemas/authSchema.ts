import { z } from 'zod';
import type { UserRole } from '@/types/auth';
import { SERVICES } from '@/constants/services';

const roleValues = ['customer', 'owner'] as const satisfies readonly UserRole[];

const serviceIds = SERVICES.map((s) => s.id) as [string, ...string[]];

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    role: z.enum(roleValues),
    ownerServiceId: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .superRefine((data, ctx) => {
    if (data.role === 'owner') {
      if (!data.ownerServiceId) {
        ctx.addIssue({
          code: 'custom',
          message: 'Select the service you provide',
          path: ['ownerServiceId'],
        });
        return;
      }
      if (!serviceIds.includes(data.ownerServiceId)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Invalid service selected',
          path: ['ownerServiceId'],
        });
      }
    }
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const OWNER_SERVICE_OPTIONS = SERVICES.map((service) => ({
  label: service.name,
  value: service.id,
}));
