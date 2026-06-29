import { z } from 'zod';

export const UpdatePatientSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  phone: z.string().max(20).optional(),
  birthDate: z.string().optional(),
});

export type UpdatePatientDto = z.infer<typeof UpdatePatientSchema>;