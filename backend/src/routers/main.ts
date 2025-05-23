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
import * as typeStoreController from '../controllers/type-store'
import * as emailController from '../controllers/email'
import * as supplyController from '../controllers/supply'
import * as bankController from '../controllers/bank'
import * as moneySplitController from '../controllers/money-split'
import * as moneySplitRefundController from '../controllers/money-split-refund'

import { verifyJWT } from '../utils/jwt'


export const mainRouter = Router()

mainRouter.get('/ping', pingController.ping)
mainRouter.post('/auth/register', authController.register)
mainRouter.post('/auth/login', authController.login)

//Protegidas
mainRouter.get('/privateping',verifyJWT, pingController.privatePing)

// TREASURY
mainRouter.get('/treasury',verifyJWT, treasuryController.getAll)
mainRouter.get('/treasury-pagination',verifyJWT, treasuryController.getAllPagination)
mainRouter.get('/treasury/:id',verifyJWT, treasuryController.getByIdSystem)
mainRouter.post('/treasury/add',verifyJWT, treasuryController.add)
mainRouter.post('/treasury/add_saldo/:id',verifyJWT, treasuryController.addSaldo)
mainRouter.post('/treasury/minus_saldo/:id',verifyJWT, treasuryController.minusSaldo)
mainRouter.post('/treasury/update/:id',verifyJWT, treasuryController.update)
mainRouter.post('/treasury/ids',verifyJWT, treasuryController.getTreasuriesForID)


// ATM
mainRouter.get('/atm',verifyJWT, atmController.getAll)
mainRouter.get('/atm-pagination',verifyJWT, atmController.getAllPagination)
mainRouter.get('/atm/:id',verifyJWT, atmController.getById)
mainRouter.post('/atm/add',verifyJWT, atmController.add)
mainRouter.post('/atm/add_balance',verifyJWT, atmController.addBalance)
mainRouter.post('/atm/update/:id',verifyJWT, atmController.update)
mainRouter.post('/atm/treasury',verifyJWT, atmController.getAtmsForIdsTreasury)

// type-operation
mainRouter.get('/type-operation',verifyJWT, typeOperationController.getAll)
mainRouter.get('/type-operation-pagination',verifyJWT, typeOperationController.getAllPagination)
mainRouter.get('/type-operation/:id',verifyJWT, typeOperationController.getById)
mainRouter.post('/type-operation/add',verifyJWT, typeOperationController.add)
mainRouter.post('/type-operation/update/:id',verifyJWT, typeOperationController.update)

// type-order
mainRouter.get('/type-order',verifyJWT, typeOrderController.getAll)
mainRouter.get('/type-order-pagination',verifyJWT, typeOrderController.getAllPagination)
mainRouter.get('/type-order/:id',verifyJWT, typeOrderController.getById)
mainRouter.post('/type-order/add',verifyJWT, typeOrderController.add)
mainRouter.post('/type-order/update/:id',verifyJWT, typeOrderController.update)

//contact
mainRouter.get('/contact',verifyJWT, contactController.getAll)
mainRouter.get('/contact/treasury/:id',verifyJWT, contactController.getByIdTreasury)
mainRouter.get('/contact/:id',verifyJWT, contactController.getById)
mainRouter.post('/contact/add',verifyJWT, contactController.add)
mainRouter.post('/contact/update/:id',verifyJWT, contactController.update)

// card-operator
mainRouter.get('/card-operator',verifyJWT, cardOperatorController.getAll)
mainRouter.get('/card-operator/:id',verifyJWT, cardOperatorController.getById)
mainRouter.get('/card-operator/treasury/:id',verifyJWT, cardOperatorController.getByIdTreasury)
mainRouter.post('/card-operator/add',verifyJWT, cardOperatorController.add)
mainRouter.post('/card-operator/update/:id',verifyJWT, cardOperatorController.update)


// type-supply
mainRouter.get('/type-supply',verifyJWT, typeSupplyController.getAll)
mainRouter.get('/type-supply-pagination',verifyJWT, typeSupplyController.getAllPagination)
mainRouter.get('/type-supply/:id',verifyJWT, typeSupplyController.getById)
mainRouter.post('/type-supply/add',verifyJWT, typeSupplyController.add)
mainRouter.post('/type-supply/update/:id',verifyJWT, typeSupplyController.update)


// status order
mainRouter.get('/status-order',verifyJWT, statusOrderController.getAll)
mainRouter.get('/status-order-pagination',verifyJWT, statusOrderController.getAllPagination)
mainRouter.get('/status-order/:id',verifyJWT, statusOrderController.getById)
mainRouter.post('/status-order/add',verifyJWT, statusOrderController.add)
mainRouter.post('/status-order/update/:id',verifyJWT, statusOrderController.update)

// order
mainRouter.get('/order',verifyJWT, orderController.getAll)
mainRouter.get('/order/:id',verifyJWT, orderController.getById)
mainRouter.get('/order/del/:id',verifyJWT, orderController.delById)
mainRouter.get('/order/treasury/:date',verifyJWT, orderController.getIdTreasuryForDateOrder)
mainRouter.get('/order/get-for-date/:date',verifyJWT, orderController.getAllOrdersForDate )
mainRouter.post('/order/confirm-partial/:id',verifyJWT, orderController.alterPartialByID)
mainRouter.post('/order/alter-order-requests/:id',verifyJWT, orderController.alterRequestsById)
mainRouter.post('/order/alter-date-order/:id',verifyJWT, orderController.alterDateOrder)
mainRouter.post('/order/search-by-date',verifyJWT, orderController.searchByDate)
mainRouter.post('/order/search-by-date-pagination',verifyJWT, orderController.searchByDatePagination)
mainRouter.post('/order/add',verifyJWT, orderController.add)
mainRouter.post('/order/confirm-total',verifyJWT, orderController.confirmTotal)
mainRouter.get('/order/infos-order/:id',verifyJWT, orderController.infosOrder)
mainRouter.post('/order/generate-release',verifyJWT, orderController.generateRelease)
mainRouter.post('/order/generate-payment',verifyJWT, orderController.generatePayment)
mainRouter.post('/order/order-for-report',verifyJWT, orderController.generateReports)
mainRouter.post('/order/edit-order-for-id/:id',verifyJWT, orderController.alterOrderByIdOrder)


// type store
mainRouter.get('/type-store',verifyJWT, typeStoreController.getAll)
mainRouter.get('/type-store-pagination',verifyJWT, typeStoreController.getAllPagination)
mainRouter.get('/type-store/:id',verifyJWT, typeStoreController.getById)
mainRouter.post('/type-store/add',verifyJWT, typeStoreController.add)
mainRouter.post('/type-store/update/:id',verifyJWT, typeStoreController.update)
mainRouter.post('/type-store/delete/:id',verifyJWT, typeStoreController.del)

// e-mail
mainRouter.post('/email/send-order',verifyJWT, emailController.sendEmailToOrder)

// Supply
mainRouter.get('/supply',verifyJWT, supplyController.getAll)
mainRouter.get('/supply/treasury/:id',verifyJWT, supplyController.getForIDTreasury)
mainRouter.post('/supply/for-day',verifyJWT, supplyController.forDate)
mainRouter.post('/supply/day/:day',verifyJWT, supplyController.getAllDay)
mainRouter.post('/supply/add_all',verifyJWT, supplyController.addAll)
mainRouter.post('supply/add_individual',verifyJWT, supplyController.addIndivudual)
mainRouter.post('/supply/add_supply',verifyJWT, supplyController.add)
mainRouter.post('/supply/for-day-treasury/:id',verifyJWT, supplyController.getForDayAndTreasury)
mainRouter.post('/supply/supply/get-supply-open/:id',verifyJWT, supplyController.getAtmsWithSupply)

// bank
mainRouter.get('/bank',verifyJWT, bankController.getAll)

// money split
mainRouter.get('/money-split/:id',verifyJWT, moneySplitController.getForIdOrder)
mainRouter.post('/money-split/add-ratteds',verifyJWT, moneySplitController.addAllRatteds)
mainRouter.get('/money-split/get-ratted/:id/',verifyJWT, moneySplitController.getAllByIdTreasury)
mainRouter.get('/money-split/get-ratted-ajusted/:id/:id_order',verifyJWT, moneySplitController.getAllByIdTreasuryAjusted)

// money split refund
mainRouter.post('/money-split-refund/add',verifyJWT, moneySplitRefundController.add)
mainRouter.get('/money-split-refund/get-id-order/:id',verifyJWT, moneySplitRefundController.getResultByIdOrder)
