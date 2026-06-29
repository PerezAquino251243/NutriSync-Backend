import { Router } from 'express';
import { PatientController } from '../controllers/patient_controller';
import { authenticate, authorize } from '../middlewares/auth_middleware';

const router = Router();
const controller = new PatientController();

router.use(authenticate);
router.use(authorize('nutritionist'));

router.post('/', controller.create);
router.get('/', controller.findAll);
router.get('/:id', controller.findById);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

export default router;