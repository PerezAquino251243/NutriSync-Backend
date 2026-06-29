import winston from 'winston';
import { env } from './env';

const { combine, timestamp, json, colorize, simple } = winston.format;

export const logger = winston.createLogger({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.Console({
      format: env.NODE_ENV === 'development' ? combine(colorize(), simple()) : json(),
    }),
  ],
});