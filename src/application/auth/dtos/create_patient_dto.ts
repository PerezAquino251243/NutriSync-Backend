import { z } from 'zod';

export const CreatePatientSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
  phone: z.string().max(20).optional(),
  birthDate: z.string().optional(),
});

export type CreatePatientDto = z.infer<typeof CreatePatientSchema>;