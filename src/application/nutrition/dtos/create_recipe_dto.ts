import { z } from 'zod';

export const CreateRecipeSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  preparationMethod: z.string().min(1, 'El método de preparación es requerido'),
  observations: z.string().optional(),
  nutritionInfo: z.record(z.unknown()),
  ingredients: z.array(z.unknown()),
});

export type CreateRecipeDto = z.infer<typeof CreateRecipeSchema>;