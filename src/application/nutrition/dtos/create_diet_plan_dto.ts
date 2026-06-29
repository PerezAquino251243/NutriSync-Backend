import { z } from 'zod';

export const CreateDietPlanSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  targetCalories: z.number().int().positive('Las calorías deben ser positivas'),
});

export type CreateDietPlanDto = z.infer<typeof CreateDietPlanSchema>;