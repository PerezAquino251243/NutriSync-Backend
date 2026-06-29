import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import authRoutes from './presentation/routes/auth_routes';
import patientRoutes from './presentation/routes/patient_routes';
import dietPlanRoutes from './presentation/routes/diet_plan_routes';
import recipeRoutes from './presentation/routes/recipe_routes';
import {
  patientRouter as mealPatientRoutes,
  nutritionistRouter as mealNutritionistRoutes,
} from './presentation/routes/meal_consumption_routes';
import medicationRoutes from './presentation/routes/medication_routes';
import {
  patientRouter as moodPatientRoutes,
  nutritionistRouter as moodNutritionistRoutes,
} from './presentation/routes/mood_log_routes';
import waterIntakeRoutes from './presentation/routes/water_intake_routes';
import { errorHandler } from './presentation/middlewares/error_handler_middleware';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(json());
  app.use(urlencoded({ extended: true }));

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/nutritionists/patients', patientRoutes);
  app.use('/api/v1/nutritionists/diet-plans', dietPlanRoutes);
  app.use('/api/v1/nutritionists/recipes', recipeRoutes);
  app.use('/api/v1/patients', mealPatientRoutes);
  app.use('/api/v1/patients', medicationRoutes);
  app.use('/api/v1/patients', moodPatientRoutes);
  app.use('/api/v1/patients', waterIntakeRoutes);
  app.use('/api/v1/nutritionists', mealNutritionistRoutes);
  app.use('/api/v1/nutritionists', moodNutritionistRoutes);

  app.use(errorHandler);

  return app;
};
