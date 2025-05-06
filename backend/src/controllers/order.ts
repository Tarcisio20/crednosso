import { RequestHandler } from "express"
import { orderAddSchema } from "../schemas/orderAddSchema"
import { addOrder, alterConfirmPatialById, alterDateOrderById, alterRequestsOrderForID, confirmPaymantAllIds, confirmTotalByIds, delOrderById, getAllOrder, getIdTreasuriesOrderByDate, getOrderById, getOrderByIds, getOrderByIdsForPaymment, searchByOrderDate, searchByOrderDatePagination, updateOrder } from "../services/order"
import { returnDateFormatted } from "../utils/returnDateFormatted"
import { orderSearchDateSchema } from "../schemas/orderSearchDate"
import { alterRequestsOrderSchema } from "../schemas/alterRequestsOrderSchema"
import { orderAlterPartialSchema } from "../schemas/orderAlterPartialSchema"
import { alterDateOrderSchema } from "../schemas/alterDataOrderSchema"
import { orderGenerateReleaseSchema } from "../schemas/orderGenerateReleaseSchema"
import { returnValueTotal } from "../utils/returnValueTotal"
import { addBalanceInTreasuryByIdSystem, getForIds, getForIdSystem, getTreasuryForTypeSupply, updateTreasury } from "../services/treasury"
import { calcularEstornoBRL } from "../utils/calcularEstorno"
import { OrderType } from "../types/OrderType"
import { returnDateInPtBr } from "../utils/returnDateInPtBr"
import { returnDate } from "../utils/returnDate"

export const getAll: RequestHandler = async (req, res) => {
  const order = await getAllOrder()
  if (!order) {
    res.status(401).json({ error: 'Erro ao salvar!' })
    return
  }

  res.json({ order })
}

export const getById: RequestHandler = async (req, res) => {
  const orderId = req.params.id
  if (!orderId) {
    res.status(401).json({ error: 'Preciso de um ID para continuar!' })
    return
  }
  const order = await getOrderById(parseInt(orderId))
  if (!order) {
    res.status(401).json({ error: 'Erro ao salvar!' })
    return
  }

  res.json({ order })
}

export const getIdTreasuryForDateOrder: RequestHandler = async (req, res) => {
  const date = req.params.date
  if (!date) {
    res.status(401).json({ error: 'Preciso de um data para continuar!' })
    return
  }
  type OrderHereType = {
    id  : number;
    id_treasury_destin :  number;
    requested_value_A: number;
    requested_value_B: number;
    requested_value_C: number;
    requested_value_D: number;
    confirmed_value_A: number;
    confirmed_value_B: number;
    confirmed_value_C: number;
    confirmed_value_D: number;
    date_order : Date;
    status_order : number;
  }

  const order : OrderHereType[] | null = await getIdTreasuriesOrderByDate(date)
  const orders = []
  if(order && order.length > 0){
    for(let x = 0; x < order.length; x++){
       let ordersForReturn = await getTreasuryForTypeSupply(order[x]?.id_treasury_destin,  2)
      console.log(ordersForReturn)
      if(ordersForReturn && ordersForReturn?.length > 0){
        const match = ordersForReturn.find(
          (item) => item.id_system === order[x].id_treasury_destin
        );

        if (match) {
          orders.push({
            id_treasury_destin: match.id_system,
            requested_value_A: order[x].requested_value_A,
            requested_value_B: order[x].requested_value_B,
            requested_value_C: order[x].requested_value_C,
            requested_value_D: order[x].requested_value_D,
            confirmed_value_A: order[x].confirmed_value_A,
            confirmed_value_B: order[x].confirmed_value_B,
            confirmed_value_C: order[x].confirmed_value_C,
            confirmed_value_D: order[x].confirmed_value_D,
            status_order : order[x].status_order
          });
        }
      }
    }
  }
  if (!orders) {
    res.status(401).json({ error: 'Erro ao salvar!' })
    return
  }

  res.json({ order : orders })
}

export const getAllOrdersForDate : RequestHandler = async (req, res) => {
  const date = req.params.date
  if (!date) {
    res.status(401).json({ error: 'Preciso de um data para continuar!' })
    return
  }
}

export const add: RequestHandler = async (req, res) => {
  const safeData = orderAddSchema.safeParse(req.body)
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  const newOrder = await addOrder({
    typeOperation: {
      connect: {
        id: safeData.data.id_type_operation
      }
    },
    treasuryOrigin: {
      connect: {
        id: safeData.data.id_treasury_origin
      }
    },
    treasuryDestin: {
      connect: {
        id: safeData.data.id_treasury_destin
      }
    },
    date_order: returnDateFormatted(safeData.data.date_order),
    typeOrder: {
      connect: {
        id: safeData.data.id_type_order
      }
    },
    requested_value_A: safeData.data.requested_value_A,
    requested_value_B: safeData.data.requested_value_B,
    requested_value_C: safeData.data.requested_value_C,
    requested_value_D: safeData.data.requested_value_D,
    statusOrder: {
      connect: {
        id: safeData.data.status_order
      }
    },
    observation: safeData.data.observation === undefined ? '' : safeData.data.observation
  })

  if (
    safeData.data.id_type_operation === 1 || safeData.data.id_type_operation === 2 ||
    safeData.data.id_type_operation === 4 || safeData.data.id_type_operation === 5
  ) {
    const treasury = await getForIdSystem(safeData.data.id_treasury_destin.toString())

    let data = {
      bills_10: safeData.data.requested_value_A + (treasury?.bills_10 || 0),
      bills_20: safeData.data.requested_value_B + (treasury?.bills_20 || 0) ,
      bills_50: safeData.data.requested_value_C + (treasury?.bills_50 || 0),
      bills_100: safeData.data.requested_value_D + (treasury?.bills_100 || 0),
    }
    await addBalanceInTreasuryByIdSystem(safeData.data.id_treasury_destin, data)
  }

  if (safeData.data.id_type_operation === 3) {
    const treasuryAdd = await getForIdSystem(safeData.data.id_treasury_destin.toString())
    const treasuryRemove = await getForIdSystem(safeData.data.id_treasury_origin.toString())

    let dataAdd = {
      bills_10: treasuryAdd?.bills_10 as number + safeData.data.requested_value_A,
      bills_20: treasuryAdd?.bills_20 as number + safeData.data.requested_value_B,
      bills_50: treasuryAdd?.bills_50 as number + safeData.data.requested_value_C,
      bills_100: treasuryAdd?.bills_100 as number + safeData.data.requested_value_D,
    }
    await addBalanceInTreasuryByIdSystem(safeData.data.id_treasury_destin, dataAdd)

    let dataRemove = {
      bills_10: treasuryRemove?.bills_10 as number - safeData.data.requested_value_A,
      bills_20: treasuryRemove?.bills_20 as number - safeData.data.requested_value_B,
      bills_50: treasuryRemove?.bills_50 as number - safeData.data.requested_value_C,
      bills_100: treasuryRemove?.bills_100 as number - safeData.data.requested_value_D,
    }

    await addBalanceInTreasuryByIdSystem(safeData.data.id_treasury_origin, dataRemove)
  }

  if (!newOrder) {
    res.status(401).json({ error: 'Erro ao salvar!' })
    return
  }

  res.json({ order: newOrder })
}

export const alterRequestsById: RequestHandler = async (req, res) => {
  const orderId = req.params.id
  if (!orderId) {
    res.status(401).json({ error: 'Preciso de um ID para continuar!' })
    return
  }
  const safeData = alterRequestsOrderSchema.safeParse(req.body)
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors })
    return
  }

  const oldOrder = await getOrderById(parseInt(orderId))

  const newOrder = await alterRequestsOrderForID(parseInt(orderId), {
    requested_value_A: safeData.data.requested_value_A,
    requested_value_B: safeData.data.requested_value_B,
    requested_value_C: safeData.data.requested_value_C,
    requested_value_D: safeData.data.requested_value_D,
    observation : safeData.data.observation
  })
  if (!newOrder) {
    res.status(401).json({ error: 'Erro ao salvar!' })
    return
  }

 const treasury = await getForIdSystem(newOrder.id_treasury_destin.toString())

  let data = {
    bills_10: safeData.data.requested_value_A ,
    bills_20: safeData.data.requested_value_B  ,
    bills_50: safeData.data.requested_value_C ,
    bills_100: safeData.data.requested_value_D ,
  }

  if(treasury){
    await addBalanceInTreasuryByIdSystem(treasury?.id_system, data )
  }

  res.json({ order: newOrder })
}

export const searchByDate: RequestHandler = async (req, res) => {
  const safeData = orderSearchDateSchema.safeParse(req.body)
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  const searchOrder = await searchByOrderDate({
    date_initial: returnDateFormatted(safeData.data.date_initial),
    date_final: returnDateFormatted(safeData.data.date_final),
  })
  if (!searchOrder) {
    res.status(401).json({ error: 'Erro ao salvar!' })
    return
  }

  res.json({ order: searchOrder })
}

export const searchByDatePagination: RequestHandler = async (req, res) => {
  const safeData = orderSearchDateSchema.safeParse(req.body)
  const page = parseInt(req.query.page as string, 10) || 1;
  const pageSize = parseInt(req.query.pageSize as string, 10) || 13;
  const skip = (page - 1) * pageSize;

  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  const searchOrder = await searchByOrderDatePagination({
    date_initial: returnDateFormatted(safeData.data.date_initial),
    date_final: returnDateFormatted(safeData.data.date_final),
    page,
    pageSize
  })
  if (!searchOrder) {
    res.status(401).json({ error: 'Erro ao salvar!' })
    return
  }

  res.json({ order: searchOrder })
}

export const delById: RequestHandler = async (req, res) => {
  const orderId = req.params.id
  if (!orderId) {
    res.status(401).json({ error: 'Preciso de um ID para continuar!' })
    return
  }
  const order : OrderType | null = await delOrderById(parseInt(orderId))
  if (!order) {
    res.status(401).json({ error: 'Erro ao Deletar!' })
    return
  }
  const treasury = await getForIdSystem(order?.id_treasury_destin.toString() as string)

  let data = {
    bills_10: treasury?.bills_10 as number  - order.requested_value_A,
    bills_20: treasury?.bills_20 as number - order.requested_value_B,
    bills_50: treasury?.bills_50 as number - order.requested_value_C,
    bills_100: treasury?.bills_100 as number - order.requested_value_D,
  }
  await addBalanceInTreasuryByIdSystem(treasury?.id_system as number, data)


  res.json({ order })
}

export const confirmTotal: RequestHandler = async (req, res) => {
  const safeData = req.body
  if (safeData.length === 0) {
    res.status(401).json({ error: 'Preciso de um ID para continuar!' })
    return
  }
  const order = await confirmTotalByIds(safeData)

  if (!order) {
    res.status(401).json({ error: 'Erro ao salvar!' })
    return
  }

  res.json({ order })
}

export const alterPartialByID: RequestHandler = async (req, res) => {
  const orderId = req.params.id
  if (!orderId) {
    res.status(401).json({ error: 'Preciso de um ID para continuar!' })
    return
  }
  const safeData = orderAlterPartialSchema.safeParse(req.body)
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  const order = await alterConfirmPatialById(parseInt(orderId), safeData.data)

  if (!order) {
    res.status(401).json({ error: 'Erro ao alterar!' })
    return
  }

  res.json({ order })
}

export const alterDateOrder: RequestHandler = async (req, res) => {
  const orderId = req.params.id
  if (!orderId) {
    res.status(401).json({ error: 'Preciso de um ID para continuar!' })
    return
  }
  const safeData = alterDateOrderSchema.safeParse(req.body)
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  

  const newOrder : OrderType[] | null = await getOrderById(parseInt(orderId))
  let obs = ''
  let id = ''
  if(newOrder){
    obs = newOrder[0].observation ?? ''
    id = newOrder[0].id?.toString() ?? ''
    let data = {
      typeOperation : { connect : {  id : newOrder[0].id_type_operation } },
      treasuryOrigin : { connect : { id_system : newOrder[0].id_treasury_origin } },
      treasuryDestin : { connect : { id_system :  newOrder[0].id_treasury_destin } },
      date_order: returnDateFormatted(safeData.data.date_order),
      typeOrder : { connect : { id : newOrder[0].id_type_order } },
      requested_value_A  : newOrder[0].requested_value_A,
      requested_value_B  : newOrder[0].requested_value_B,
      requested_value_C  : newOrder[0].requested_value_C,
      requested_value_D  : newOrder[0].requested_value_D,
      observation : `RELANÇADO DO DIA ${returnDate(newOrder[0].date_order)} || ID ${newOrder[0].id} || ${newOrder[0].observation}`,
      statusOrder : { connect : { id : 1 } }
    }

    await addOrder(data)
   
  }

  let data2 = {
    statusOrder : { connect : { id : 6 } },
    observation : `RELANÇADO PARA O DIA ${returnDateInPtBr(safeData.data.date_order)} || ID ${id} || ${obs}`
  }
  const order  = await updateOrder(parseInt(orderId), data2)

  if (!order) {
    res.status(401).json({ error: 'Erro ao alterar!' })
    return
}

  res.json({ order })
}

export const generateRelease: RequestHandler = async (req, res) => {

  const safeData = orderGenerateReleaseSchema.safeParse(req.body)
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors })
    return
  }

  const allOrders: any = await getOrderByIdsForPaymment(safeData.data)
  const orders = []
  const ids_treasuries = []
  const ids_treasuries_destin = []
  interface Treasury {
    id_system: number;
    name: string;
    id_type_store: number;
    account_number: string;
    region: number;
    bills_10: number;
    bills_20: number;
    bills_50: number;
    bills_100: number;
  }


  for (let x = 0; (allOrders || []).length > x; x++) {
    ids_treasuries.push(allOrders[x].id_treasury_destin)
  }

  const treasuries = await getForIds(ids_treasuries)

  const treasuryMap = (treasuries || []).reduce((map, treasury) => {
    map[treasury.id_system] = treasury;
    return map;
  }, {} as Record<number, Treasury>) 

  const mergedData = await Promise.all (allOrders?.map(async (order: any) => {
    const treasury = treasuryMap[order.id_treasury_destin] // Busca a tesouraria correspondente
    let tDestin = null
    if(order.id_type_operation === 3){
      tDestin = await getForIdSystem(order.id_treasury_origin)
    }

    return {
      codigo: order.id_treasury_origin,
      conta: treasury?.account_number,
      tesouraria: treasury?.name,
      regiao: treasury?.region,
      valor: returnValueTotal(order.requested_value_A, order.requested_value_B, order.requested_value_C, order.requested_value_D),
      id_type_store: treasury?.id_type_store,
      date: order.date_order,
      type_operation : order.id_type_operation,
      conta_origem : tDestin ? tDestin.account_number : 0,
      tesouraria_origem : tDestin ? tDestin.name : "",
    };
  }));
  if (!mergedData) {
    res.status(401).json({ error: 'Erro ao alterar!' })
    return
  }

  res.json({ order: mergedData })
}

export const generatePayment: RequestHandler = async (req, res) => {
  
  const safeData = orderGenerateReleaseSchema.safeParse(req.body)
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors })
    return
  }

  const allOrders: any = await getOrderByIdsForPaymment(safeData.data)
  const orders = []
  const ids_treasuries = []
  interface Treasury {
    id_system: number;
    name: string;
    gmcore_number : string;
    id_type_store: number;
    account_number: string;
    region: number;
    account_number_for_transfer : string;
  }
  for (let x = 0; (allOrders || []).length > x; x++) {
    ids_treasuries.push(allOrders[x].id_treasury_destin)
  }

  const treasuries = await getForIds(ids_treasuries)
  const treasuryMap = (treasuries || []).reduce((map, treasury) => {
    map[treasury.id_system] = treasury;
    return map;
  }, {} as Record<number, Treasury>)
  const mergedData = allOrders?.map((order: any) => {
    const treasury = treasuryMap[order.id_treasury_destin] // Busca a tesouraria correspondente
    return {
      codigo: order.id_treasury_origin,
      conta: treasury?.account_number,
      tesouraria: treasury?.name,
      gmcore : treasury?.gmcore_number,
      regiao: treasury?.region,
      valor: returnValueTotal(order.requested_value_A, order.requested_value_B, order.requested_value_C, order.requested_value_D),
      id_type_store: treasury?.id_type_store,
      date: order.date_order,
      conta_pagamento : treasury?.account_number_for_transfer,
      valorRealizado: returnValueTotal(order.confirmed_value_A, order.confirmed_value_B, order.confirmed_value_C, order.confirmed_value_D),
      estorno: calcularEstornoBRL(
        returnValueTotal(order.requested_value_A, order.requested_value_B, order.requested_value_C, order.requested_value_D),
        returnValueTotal(order.confirmed_value_A, order.confirmed_value_B, order.confirmed_value_C, order.confirmed_value_D)
      )
    };
  });

  const status = await confirmPaymantAllIds(safeData.data)

  if (!mergedData) {
    res.status(401).json({ error: 'Erro ao alterar!' })
    return
  }

  res.json({ order: mergedData })
}

export const generateReports: RequestHandler = async (req, res) => {

  const safeData = orderGenerateReleaseSchema.safeParse(req.body)
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors })
    return
  }

  const allOrders: any = await getOrderByIds(safeData.data)
  const orders = []
  const ids_treasuries = []
  const ids_treasuries_destin = []
  interface Treasury {
    id_system: number;
    name: string;
  }
  for (let x = 0; (allOrders || []).length > x; x++) {
    ids_treasuries.push(allOrders[x].id_treasury_origin)
    ids_treasuries_destin.push(allOrders[x].id_treasury_destin)
  }
  const treasuries = await getForIds(ids_treasuries)
  const treasuries_destin = await getForIds(ids_treasuries_destin)
  const treasuryMap = (treasuries || []).reduce((map, treasury) => {
    map[treasury.id_system] = treasury;
    return map;
  }, {} as Record<number, Treasury>)
  const treasuryMapDestin = (treasuries_destin || []).reduce((map, treasury) => {
    map[treasury.id_system] = treasury;
    return map;
  }, {} as Record<number, Treasury>)
  const mergedData = allOrders?.map((order: any) => {
    const treasury = treasuryMap[order.id_treasury_origin] // Busca a tesouraria correspondente
    const treasuryDestin = treasuryMapDestin[order.id_treasury_destin]
    return {
      id: order.id,
      id_operation : order.id_type_operation,
      treasury: treasury?.name,
      value_A: order.requested_value_A,
      value_B: order.requested_value_B,
      value_C: order.requested_value_C,
      value_D: order.requested_value_D,
      date: order.date_order,
      treasury_destin : treasuryDestin?.name
    }

  });

  if (!mergedData) {
    res.status(401).json({ error: 'Erro ao alterar!' })
    return
  }

  res.json({ order: mergedData })
}
