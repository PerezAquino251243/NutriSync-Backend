import { Router } from 'express';
import { DietPlanController } from '../controllers/diet_plan_controller';
import { authenticate, authorize } from '../middlewares/auth_middleware';

const router = Router();
const controller = new DietPlanController();

router.use(authenticate);
router.use(authorize('nutritionist'));

router.post('/', controller.create);
router.get('/', controller.findAll);
router.post('/:id/assign', controller.assign);

export default router;