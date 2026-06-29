// ⚠️ CARGA DE .env USANDO process.cwd() PARA OBTENER LA RAIZ DEL PROYECTO
import dotenv from 'dotenv';
import path from 'path';

// Carga el archivo .env desde la raíz del proyecto (usando process.cwd())
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Ahora importa el resto
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { UserEntity } from '../infrastructure/database/entities/user_entity';

// Obtén las variables directamente de process.env
const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  NODE_ENV,
} = process.env;

// Validación manual
if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASSWORD || !DB_NAME) {
  console.error('Faltan variables de entorno para la base de datos. Revisa tu archivo .env');
  console.error('Variables actuales:', { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME });
  throw new Error('Faltan variables de entorno para la base de datos. Revisa tu archivo .env');
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: false,
  logging: NODE_ENV === 'development',
  entities: [UserEntity],
  migrations: ['src/infrastructure/database/migrations/**/*.ts'],
  subscribers: [],
});