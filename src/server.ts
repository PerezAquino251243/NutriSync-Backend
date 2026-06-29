import 'reflect-metadata';
import { createApp } from './app';
import { AppDataSource } from './config/database';
import { logger } from './config/logger';

const port = Number(process.env.PORT) || 3000;

const start = async () => {
  try {
    await AppDataSource.initialize();
    logger.info('Base de datos conectada');

    const app = createApp();

    app.listen(port, () => {
      logger.info(`🚀 Servidor corriendo en http://localhost:${port}`);
    });
  } catch (error) {
    logger.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

start();
