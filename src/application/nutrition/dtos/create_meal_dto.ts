import { z } from 'zod';

export const CreateMealSchema = z.object({
  dayNumber: z.number().int().min(1, 'El día debe ser >= 1'),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  scheduledTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Formato HH:MM requerido'),
  recipeIds: z.array(z.string().uuid()).min(1, 'Al menos una receta'),
});

export const CreateMealsArraySchema = z.array(CreateMealSchema);

export type CreateMealDto = z.infer<typeof CreateMealSchema>;