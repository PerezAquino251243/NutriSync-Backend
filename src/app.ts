import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import authRoutes from './presentation/routes/auth_routes'; // ← Agregar

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(json());
  app.use(urlencoded({ extended: true }));

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Agregar rutas de autenticación
  app.use('/api/v1/auth', authRoutes);

  app.use((err: Error, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  });

  return app;
};