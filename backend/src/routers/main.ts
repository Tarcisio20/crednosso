import { Router } from 'express'
import * as pingController from '../controllers/ping'
import * as authController from '../controllers/auth'
import * as treasuryController from '../controllers/treasury'
import * as atmController from '../controllers/atm'
import * as typeOperationController from '../controllers/type-operation'
import * as typeOrderController from '../controllers/type-order'
import * as contactController from '../controllers/contact'

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
mainRouter.get('/type-operation/:id',verifyJWT, typeOperationController.getById)
mainRouter.post('/type-operation/add',verifyJWT, typeOperationController.add)
mainRouter.post('/type-operation/update/:id',verifyJWT, typeOperationController.update)

// type-order
mainRouter.get('/type-order',verifyJWT, typeOrderController.getAll)
mainRouter.get('/type-order/:id',verifyJWT, typeOrderController.getById)
mainRouter.post('/type-order/add',verifyJWT, typeOrderController.add)
mainRouter.post('/type-order/update/:id',verifyJWT, typeOrderController.update)

//contact
mainRouter.get('/contact/treasury/:id',verifyJWT, contactController.getByIdTreasury)
mainRouter.post('/contact/add',verifyJWT, contactController.add)