import { Router } from 'express'
import * as pingController from '../controllers/ping'
import * as authController from '../controllers/auth'
import * as treasuryController from '../controllers/treasury'
import * as atmController from '../controllers/atm'
import * as typeOperationController from '../controllers/type-operation'
import { verifyJWT } from '../utils/jwt'


export const mainRouter = Router()

mainRouter.get('/ping', pingController.ping)
mainRouter.post('/auth/register', authController.register)
mainRouter.post('/auth/login', authController.login)

//Protegidas
mainRouter.get('/privateping',verifyJWT, pingController.privatePing)

// TREASURY
mainRouter.get('/treasury',verifyJWT, treasuryController.getAll)
mainRouter.get('/treasury/:id',verifyJWT, treasuryController.getByIdSystem)
mainRouter.post('/treasury/add',verifyJWT, treasuryController.add)
mainRouter.post('/treasury/add_saldo/:id',verifyJWT, treasuryController.addSaldo)
mainRouter.post('/treasury/update/:id',verifyJWT, treasuryController.update)


// ATM
mainRouter.get('/atm',verifyJWT, atmController.getAll)
mainRouter.get('/atm/:id',verifyJWT, atmController.getById)
mainRouter.post('/atm/add',verifyJWT, atmController.add)
mainRouter.post('/atm/update/:id',verifyJWT, atmController.update)

// type-operation
mainRouter.get('/type-operation',verifyJWT, typeOperationController.getAll)
mainRouter.post('/type-operation/add',verifyJWT, typeOperationController.add)