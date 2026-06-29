import { Router } from 'express';
import { AuthController } from '../controllers/auth_controller';

const router = Router();
const controller = new AuthController();

router.post('/register', controller.register);
router.post('/login', controller.login);

export default router;
