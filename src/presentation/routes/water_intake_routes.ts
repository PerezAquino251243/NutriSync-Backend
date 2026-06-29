import { Router } from 'express';
import { WaterIntakeController } from '../controllers/water_intake_controller';
import { authenticate } from '../middlewares/auth_middleware';

const router = Router();
const controller = new WaterIntakeController();

router.use(authenticate);

router.post('/water', controller.registerIntake);
router.get('/water/streak', controller.getStreak);
router.get('/water/history', controller.getHistory);

export default router;