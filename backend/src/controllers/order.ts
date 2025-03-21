import { RequestHandler } from "express"
import { orderAddSchema } from "../schemas/orderAddSchema"
import { addOrder, alterConfirmPatialById, alterDateOrderById, alterRequestsOrderForID, confirmTotalByIds, delOrderById, getIdTreasuriesOrderByDate, getOrderById, getOrderByIds, searchByOrderDate, searchByOrderDatePagination } from "../services/order"
import { returnDateFormatted } from "../utils/returnDateFormatted"
import { orderSearchDateSchema } from "../schemas/orderSearchDate"
import { alterRequestsOrderSchema } from "../schemas/alterRequestsOrderSchema"
import { orderAlterPartialSchema } from "../schemas/orderAlterPartialSchema"
import { alterDateOrderSchema } from "../schemas/alterDataOrderSchema"
import { orderGenerateReleaseSchema } from "../schemas/orderGenerateReleaseSchema"
import { returnValueTotal } from "../utils/returnValueTotal"
import { addBalanceInTreasuryByIdSystem, getForIds, getForIdSystem, updateTreasury } from "../services/treasury"
import { calcularEstornoBRL } from "../utils/calcularEstorno"
import { OrderType } from "../types/OrderType"

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
  const order = await getIdTreasuriesOrderByDate(date)

  if (!order) {
    res.status(401).json({ error: 'Erro ao salvar!' })
    return
  }

  res.json({ order })
}

export const add: RequestHandler = async (req, res) => {
  const safeData = orderAddSchema.safeParse(req.body)
  console.log("no add", safeData.data)
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
    console.log("Data", data)
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
  let data = {
    date_order: returnDateFormatted(safeData.data.date_order)
  }
  const order = await alterDateOrderById(parseInt(orderId), data)

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

  const allOrders: any = await getOrderByIds(safeData.data)
  const orders = []
  const ids_treasuries = []
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
    ids_treasuries.push(allOrders[x].id_treasury_origin)
  }
  const treasuries = await getForIds(ids_treasuries)
  console.log("Tesrouarias", treasuries)
  const treasuryMap = (treasuries || []).reduce((map, treasury) => {
    map[treasury.id_system] = treasury;
    return map;
  }, {} as Record<number, Treasury>)

  const mergedData = allOrders?.map((order: any) => {
    const treasury = treasuryMap[order.id_treasury_origin] // Busca a tesouraria correspondente

    return {
      codigo: order.id_treasury_origin,
      conta: treasury?.account_number,
      tesouraria: treasury?.name,
      regiao: treasury?.region,
      valor: returnValueTotal(order.requested_value_A, order.requested_value_B, order.requested_value_C, order.requested_value_D),
      id_type_store: treasury?.id_type_store,
      date: order.date_order
    };
  });

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

  const allOrders: any = await getOrderByIds(safeData.data)
  const orders = []
  const ids_treasuries = []
  interface Treasury {
    id_system: number;
    name: string;
    id_type_store: number;
    account_number: string;
    region: number;
  }
  for (let x = 0; (allOrders || []).length > x; x++) {
    ids_treasuries.push(allOrders[x].id_treasury_origin)
  }
  const treasuries = await getForIds(ids_treasuries)
  const treasuryMap = (treasuries || []).reduce((map, treasury) => {
    map[treasury.id_system] = treasury;
    return map;
  }, {} as Record<number, Treasury>)
  const mergedData = allOrders?.map((order: any) => {
    const treasury = treasuryMap[order.id_treasury_origin] // Busca a tesouraria correspondente
    console.log(order)
    return {
      codigo: order.id_treasury_origin,
      conta: treasury?.account_number,
      tesouraria: treasury?.name,
      regiao: treasury?.region,
      valor: returnValueTotal(order.requested_value_A, order.requested_value_B, order.requested_value_C, order.requested_value_D),
      id_type_store: treasury?.id_type_store,
      date: order.date_order,
      valorRealizado: returnValueTotal(order.confirmed_value_A, order.confirmed_value_B, order.confirmed_value_C, order.confirmed_value_D),
      estorno: calcularEstornoBRL(
        returnValueTotal(order.requested_value_A, order.requested_value_B, order.requested_value_C, order.requested_value_D),
        returnValueTotal(order.confirmed_value_A, order.confirmed_value_B, order.confirmed_value_C, order.confirmed_value_D)
      )
    };
  });

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
  interface Treasury {
    id_system: number;
    name: string;
  }
  for (let x = 0; (allOrders || []).length > x; x++) {
    ids_treasuries.push(allOrders[x].id_treasury_origin)
  }
  const treasuries = await getForIds(ids_treasuries)
  const treasuryMap = (treasuries || []).reduce((map, treasury) => {
    map[treasury.id_system] = treasury;
    return map;
  }, {} as Record<number, Treasury>)
  const mergedData = allOrders?.map((order: any) => {
    const treasury = treasuryMap[order.id_treasury_origin] // Busca a tesouraria correspondente

    return {
      id: order.id,
      treasury: treasury?.name,
      value_A: order.requested_value_A,
      value_B: order.requested_value_B,
      value_C: order.requested_value_C,
      value_D: order.requested_value_D,
      date: order.date_order,
    }

  });

  if (!mergedData) {
    res.status(401).json({ error: 'Erro ao alterar!' })
    return
  }

  res.json({ order: mergedData })
}
