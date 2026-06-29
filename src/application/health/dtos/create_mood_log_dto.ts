import { z } from 'zod';

export const CreateMoodLogSchema = z.object({
  moodType: z.string().min(1, 'El tipo de ánimo es requerido'),
  logDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD requerido')
    .optional(),
  patientComment: z.string().optional(),
});

export type CreateMoodLogDto = z.infer<typeof CreateMoodLogSchema>;