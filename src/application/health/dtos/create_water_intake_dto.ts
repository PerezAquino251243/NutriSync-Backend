import { z } from 'zod';

export const CreateWaterIntakeSchema = z.object({
  glasses: z.number().int().min(0).optional(),
  amountMl: z.number().min(0).optional(),
  intakeDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD requerido')
    .optional(),
});

export type CreateWaterIntakeDto = z.infer<typeof CreateWaterIntakeSchema>;