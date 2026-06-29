import { Router } from 'express';
import { MoodLogController } from '../controllers/mood_log_controller';
import { authenticate, authorize } from '../middlewares/auth_middleware';

const patientRouter = Router();
const nutritionistRouter = Router();
const controller = new MoodLogController();

// Rutas de paciente
patientRouter.use(authenticate);
patientRouter.post('/mood', controller.createOrUpdate);
patientRouter.get('/mood', controller.getLogs);

// Rutas de nutrióloga
nutritionistRouter.use(authenticate);
nutritionistRouter.use(authorize('nutritionist'));
nutritionistRouter.put('/mood-logs/:logId/comment', controller.addComment);

export { patientRouter, nutritionistRouter };