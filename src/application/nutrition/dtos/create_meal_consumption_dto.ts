import { z } from 'zod';

export const CreateMealConsumptionSchema = z.object({
  consumptionDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD requerido')
    .optional(),
  consumed: z.boolean(),
  substitutedRecipeId: z.string().uuid().optional(),
  notes: z.string().optional(),
});

export type CreateMealConsumptionDto = z.infer<typeof CreateMealConsumptionSchema>;