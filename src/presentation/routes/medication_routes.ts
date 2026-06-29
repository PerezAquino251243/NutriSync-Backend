import { Router } from 'express';
import { MedicationController } from '../controllers/medication_controller';
import { authenticate } from '../middlewares/auth_middleware';

const router = Router();
const controller = new MedicationController();

router.use(authenticate);

router.get('/medications', controller.getMedications);
router.post('/medications', controller.createMedication);
router.put('/medications/:id/take', controller.markTaken);

export default router;