import { Router } from 'express'
import * as pingController from '../controllers/ping'
import * as authController from '../controllers/auth'
import * as treasuryController from '../controllers/treasury'
import * as atmController from '../controllers/atm'
import * as typeOperationController from '../controllers/type-operation'
import * as typeOrderController from '../controllers/type-order'
import * as contactController from '../controllers/contact'
import * as cardOperatorController from '../controllers/card-operator'
import * as typeSupplyController from '../controllers/type-supply'
import * as statusOrderController from '../controllers/status-order'
import * as orderController from '../controllers/order'

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
mainRouter.get('/contact/:id',verifyJWT, contactController.getById)
mainRouter.post('/contact/add',verifyJWT, contactController.add)
mainRouter.post('/contact/update/:id',verifyJWT, contactController.update)

// card-operator
mainRouter.post('/card-operator/add',verifyJWT, cardOperatorController.add)
mainRouter.get('/card-operator/:id',verifyJWT, cardOperatorController.getById)
mainRouter.get('/card-operator/treasury/:id',verifyJWT, cardOperatorController.getByIdTreasury)
mainRouter.post('/card-operator/update/:id',verifyJWT, cardOperatorController.update)


// type-supply
mainRouter.get('/type-supply',verifyJWT, typeSupplyController.getAll)
mainRouter.get('/type-supply/:id',verifyJWT, typeSupplyController.getById)
mainRouter.post('/type-supply/add',verifyJWT, typeSupplyController.add)
mainRouter.post('/type-supply/update/:id',verifyJWT, typeSupplyController.update)


// status order
mainRouter.get('/status-order',verifyJWT, statusOrderController.getAll)
mainRouter.get('/status-order/:id',verifyJWT, statusOrderController.getById)
mainRouter.post('/status-order/add',verifyJWT, statusOrderController.add)
mainRouter.post('/status-order/update/:id',verifyJWT, statusOrderController.update)

// order
mainRouter.get('/order/:id',verifyJWT, orderController.getById)
mainRouter.get('/order/del/:id',verifyJWT, orderController.delById)
mainRouter.post('/order/confirm-partial/:id',verifyJWT, orderController.alterPartialByID)
mainRouter.post('/order/alter-order-requests/:id',verifyJWT, orderController.alterRequestsById)
mainRouter.post('/order/alter-date-order/:id',verifyJWT, orderController.alterDateOrder)
mainRouter.post('/order/search-by-date',verifyJWT, orderController.searchByDate)
mainRouter.post('/order/add',verifyJWT, orderController.add)
mainRouter.post('/order/confirm-total',verifyJWT, orderController.confirmTotal)