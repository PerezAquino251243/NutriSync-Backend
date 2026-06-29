import { z } from 'zod';

const ReminderSchema = z.object({
  intervalHours: z.number().int().positive().optional(),
  daysOfWeek: z.array(z.number().int().min(0).max(6)),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Formato HH:MM requerido'),
  active: z.boolean().default(true),
});

export const CreateMedicationSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  dosage: z.string().min(1, 'La dosis es requerida'),
  active: z.boolean().default(true),
  reminders: z
    .array(ReminderSchema)
    .min(1, 'Al menos un recordatorio es requerido'),
});

export type CreateMedicationDto = z.infer<typeof CreateMedicationSchema>;