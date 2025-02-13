import { Router, Request, Response } from 'express';
import * as OperatorCardController from '../controllers/operatorCardController'


const router = Router();

router.post('/operator-card', OperatorCardController.getAll)

export default router;
