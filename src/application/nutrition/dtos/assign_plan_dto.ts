import { z } from 'zod';

export const AssignPlanSchema = z.object({
  patientId: z.string().uuid('ID de paciente inválido'),
});

export type AssignPlanDto = z.infer<typeof AssignPlanSchema>;