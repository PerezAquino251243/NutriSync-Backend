import Redis from 'ioredis';
import { env } from './env';
import { logger } from './logger';

export const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
  retryStrategy: (times: number) => {
    if (times > 10) {
      logger.error('Redis: no se pudo conectar después de 10 intentos');
      return null;
    }
    return Math.min(times * 50, 2000);
  },
});

redis.on('connect', () => logger.info('Redis conectado'));
redis.on('error', (err: Error) => logger.error('Redis error:', err));