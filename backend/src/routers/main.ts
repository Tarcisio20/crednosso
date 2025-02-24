import { Router } from 'express'
import * as pingController from '../controllers/ping'
import * as authController from '../controllers/auth'
import { verifyJWT } from '../utils/jwt'


export const mainRouter = Router()

mainRouter.get('/ping', pingController.ping)
mainRouter.post('/auth/register', authController.register)
mainRouter.post('/auth/login', authController.login)

//Protegidas
mainRouter.get('/privateping',verifyJWT, pingController.privatePing)
