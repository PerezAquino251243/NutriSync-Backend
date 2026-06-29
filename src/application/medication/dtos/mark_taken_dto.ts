import { z } from 'zod';

export const MarkTakenSchema = z.object({
  taken: z.boolean(),
});

export type MarkTakenDto = z.infer<typeof MarkTakenSchema>;