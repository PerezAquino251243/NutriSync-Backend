import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Carga el archivo .env desde la raíz del proyecto
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  DB_HOST: z.string().min(1),
  DB_PORT: z.string().transform(Number),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().transform(Number).default('6379'),
  REDIS_PASSWORD: z.string().optional(),
  EXTERNAL_FOOD_API_URL: z.string().url().optional(),
  EXTERNAL_FOOD_API_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
export type Env = typeof env;