import { Router } from 'express';
import { RecipeController } from '../controllers/recipe_controller';
import { authenticate, authorize } from '../middlewares/auth_middleware';

const router = Router();
const controller = new RecipeController();

router.use(authenticate);
router.use(authorize('nutritionist'));

router.post('/', controller.create);
router.get('/', controller.findAll);
router.get('/:id', controller.findById);

export default router;