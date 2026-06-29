import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { UserEntity } from '../infrastructure/database/entities/user_entity';
import { env } from './env';

// Usa las variables de entorno validadas desde env.ts
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, NODE_ENV } = env;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: false,
  logging: NODE_ENV === 'development',
  entities: [UserEntity],
  migrations: ['src/infrastructure/database/migrations/**/*.ts'],
  subscribers: [],
});