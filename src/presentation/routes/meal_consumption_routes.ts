import { Router } from 'express';
import { MealConsumptionController } from '../controllers/meal_consumption_controller';
import { authenticate, authorize } from '../middlewares/auth_middleware';

const patientRouter = Router();
const nutritionistRouter = Router();
const controller = new MealConsumptionController();

// Rutas de paciente
patientRouter.use(authenticate);
patientRouter.put('/meals/:mealId/consume', controller.consume);
patientRouter.get('/consumptions', controller.getHistory);

// Rutas de nutrióloga
nutritionistRouter.use(authenticate);
nutritionistRouter.use(authorize('nutritionist'));
nutritionistRouter.get('/patients/:id/adherence', controller.getAdherence);

export { patientRouter, nutritionistRouter };