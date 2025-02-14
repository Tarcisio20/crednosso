import { Router } from 'express';
import { register }  from '../controllers/authController';

const router = Router();

router.post('/register', register);
//router.post('/sign-in', login);

export default router;
