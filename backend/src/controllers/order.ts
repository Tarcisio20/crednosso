import { RequestHandler } from "express"
import { orderAddSchema } from "../schemas/orderAddSchema"
import { addOrder, alterConfirmPatialById, alterRequestsOrderForID, confirmPaymantAllIds, confirmTotalByIds, delOrderById, getAllOrder, getIdTreasuriesOrderByDate, getInfosOrders, getMediasYears, getOrderById, getOrderByIds, getOrderByIdsForPaymment, getOrdersFiltereds, searchByOrderDate, searchByOrderDatePagination, updateOrder } from "../services/order"
import { returnDateFormatted } from "../utils/returnDateFormatted"
import { orderSearchDateSchema } from "../schemas/orderSearchDate"
import { alterRequestsOrderSchema } from "../schemas/alterRequestsOrderSchema"
import { orderAlterPartialSchema } from "../schemas/orderAlterPartialSchema"
import { alterDateOrderSchema } from "../schemas/alterDataOrderSchema"
import { orderGenerateReleaseSchema } from "../schemas/orderGenerateReleaseSchema"
import { returnValueTotal } from "../utils/returnValueTotal"
import { addBalanceInTreasuryByIdSystem, getForIds, getForIdSystem, getTreasuryForTypeSupply } from "../services/treasury"
import { calcularEstornoBRL } from "../utils/calcularEstorno"
import { OrderType } from "../types/OrderType"
import { returnDateInPtBr } from "../utils/returnDateInPtBr"
import { returnDate } from "../utils/returnDate"
import { orderEditSchema } from "../schemas/orderEditSchema"
import { createLog } from "services/logService"
import { diffObjects, sanitizeOrder, sanitizeOrderPayload } from "utils/audit/audit-order"

export const getAll: RequestHandler = async (req, res) => {
  try {
    const order = await getAllOrder()
    if (!order) {
      await createLog({
        level: 'ERROR',
        action: 'GET_ALL_ORDER',
        message: 'Erro ao retornar dados!',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'order',
      })
      res.status(400).json({ error: 'Erro ao salvar!' })
      return
    }
    await createLog({
      level: 'INFO',
      action: 'GET_ALL_ORDER',
      message: 'Sucesso ao retornar dados!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: 'order',
      meta: { count: Array.isArray(order) ? order.length : 0 }
    })
    res.status(201).json({ order })
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'GET_ALL_ORDER',
      message: 'Erro ao retornar dados!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
      meta: { error: String(error) }
    })
    res.status(400).json({ error: 'Erro ao salvar!' })
    return
  }
}

export const getById: RequestHandler = async (req, res) => {
  const orderId = req.params.id
  if (!orderId || isNaN(parseInt(orderId))) {
    await createLog({
      level: 'ERROR',
      action: 'GET_ORDER_BY_ID',
      message: 'Preciso de um ID para continuar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
      meta: { id: req.params.id }
    })
    res.status(400).json({ error: 'Preciso de um ID para continuar!' })
    return
  }
  try {
    const order = await getOrderById(parseInt(orderId))
    if (!order) {
      await createLog({
        level: 'ERROR',
        action: 'GET_ORDER_BY_ID',
        message: 'Erro ao salvar!',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'order',
        resourceId: String(orderId)
      })
      res.status(400).json({ error: 'Erro ao salvar!' })
      return
    }
    await createLog({
      level: 'INFO',
      action: 'GET_ORDER_BY_ID',
      message: 'Sucesso ao salvar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: 'order',
      resourceId: String(orderId)
    })
    res.status(201).json({ order })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'GET_ORDER_BY_ID',
      message: 'Erro ao salvar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
      resourceId: String(orderId),
    })
    res.status(400).json({ error: 'Erro ao salvar!' })
    return
  }
}

export const getIdTreasuryForDateOrder: RequestHandler = async (req, res) => {
  const date = req.params.date
  if (!date) {
    await createLog({
      level: 'ERROR',
      action: 'GET_ID_TREASURY_FOR_DATE_ORDER',
      message: 'Preciso de um data para continuar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
    })
    res.status(400).json({ error: 'Preciso de um data para continuar!' })
    return
  }
  type OrderHereType = {
    id: number;
    id_type_operation: number;
    id_treasury_destin: number;
    requested_value_A: number;
    requested_value_B: number;
    requested_value_C: number;
    requested_value_D: number;
    confirmed_value_A: number;
    confirmed_value_B: number;
    confirmed_value_C: number;
    confirmed_value_D: number;
    status_order: number;
  }
  try {
    const order: OrderHereType[] | null = await getIdTreasuriesOrderByDate(date)
    const orders = []
    if (order && order.length > 0) {
      for (let x = 0; x < order.length; x++) {
        let ordersForReturn = await getTreasuryForTypeSupply(order[x]?.id_treasury_destin, 2)
        if (ordersForReturn && ordersForReturn?.length > 0) {
          const match = ordersForReturn.find(
            (item) => item.id_system === order[x].id_treasury_destin
          );
          if (match) {
            orders.push({
              id: order[x].id,
              id_treasury_destin: match.id_system,
              requested_value_A: order[x].requested_value_A,
              requested_value_B: order[x].requested_value_B,
              requested_value_C: order[x].requested_value_C,
              requested_value_D: order[x].requested_value_D,
              confirmed_value_A: order[x].confirmed_value_A,
              confirmed_value_B: order[x].confirmed_value_B,
              confirmed_value_C: order[x].confirmed_value_C,
              confirmed_value_D: order[x].confirmed_value_D,
              status_order: order[x].status_order
            });
          }
        }
      }
    }
    if (!orders) {
      await createLog({
        level: 'ERROR',
        action: 'GET_ID_TREASURY_FOR_DATE_ORDER',
        message: 'Erro ao salvar!',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'order',
      })
      res.status(400).json({ error: 'Erro ao salvar!' })
      return
    }
    await createLog({
      level: 'INFO',
      action: 'GET_ID_TREASURY_FOR_DATE_ORDER',
      message: 'Sucesso ao salvar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: 'order',
      meta: { date, count: orders.length }
    })
    res.status(201).json({ order: orders })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'GET_ID_TREASURY_FOR_DATE_ORDER',
      message: 'Erro ao salvar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
      meta: { date, error: String(error) }
    })
    res.status(400).json({ error: 'Erro ao salvar!' })
    return
  }
}

export const getAllOrdersForDate: RequestHandler = async (req, res) => {
  const date = req.params.date
  if (!date) {
    await createLog({
      level: 'ERROR',
      action: 'GET_ALL_ORDERS_FOR_DATE',
      message: 'Preciso de um data para continuar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
    })
    res.status(400).json({ error: 'Preciso de um data para continuar!' })
    return
  }
  res.status(204).send();
}

export const add: RequestHandler = async (req, res) => {
  const safeData = orderAddSchema.safeParse(req.body)
  if (!safeData.success) {
    await createLog({
      level: 'ERROR',
      action: 'ADD_ORDER',
      message: 'Erro ao salvar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
      meta: { validation: safeData.error.flatten().fieldErrors }
    })
    res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  try {
    const newOrder = await addOrder({
      typeOperation: {
        connect: {
          id: safeData.data.id_type_operation
        }
      },
      treasuryOrigin: {
        connect: {
          id_system: safeData.data.id_treasury_origin
        }
      },
      treasuryDestin: {
        connect: {
          id_system: safeData.data.id_treasury_destin
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
        bills_20: safeData.data.requested_value_B + (treasury?.bills_20 || 0),
        bills_50: safeData.data.requested_value_C + (treasury?.bills_50 || 0),
        bills_100: safeData.data.requested_value_D + (treasury?.bills_100 || 0),
      }
      await addBalanceInTreasuryByIdSystem(safeData.data.id_treasury_destin, data)
    }

    if (safeData.data.id_type_operation === 3) {
      const treasuryAdd = await getForIdSystem(safeData.data.id_treasury_destin.toString())
      const treasuryRemove = await getForIdSystem(safeData.data.id_treasury_origin.toString())

      let dataAdd = {
        bills_10: (treasuryAdd?.bills_10 as number < 0) ? 0 : ((treasuryAdd?.bills_10 as number ?? 0) + safeData.data.requested_value_A),
        bills_20: (treasuryAdd?.bills_20 as number < 0) ? 0 : ((treasuryAdd?.bills_20 as number ?? 0) + safeData.data.requested_value_B),
        bills_50: (treasuryAdd?.bills_50 as number < 0) ? 0 : ((treasuryAdd?.bills_50 as number ?? 0) + safeData.data.requested_value_C),
        bills_100: (treasuryAdd?.bills_100 as number < 0) ? 0 : ((treasuryAdd?.bills_100 as number ?? 0) + safeData.data.requested_value_D),
      }
      await addBalanceInTreasuryByIdSystem(safeData.data.id_treasury_destin, dataAdd)
      let dataRemove = {
        bills_10: (treasuryRemove?.bills_10 as number < 0) ? 0 : (safeData.data.requested_value_A - (treasuryRemove?.bills_10 as number ?? 0)),
        bills_20: (treasuryRemove?.bills_20 as number < 0) ? 0 : (safeData.data.requested_value_B - (treasuryRemove?.bills_20 as number ?? 0)),
        bills_50: (treasuryRemove?.bills_50 as number < 0) ? 0 : (safeData.data.requested_value_C - (treasuryRemove?.bills_50 as number ?? 0)),
        bills_100: (treasuryRemove?.bills_100 as number < 0) ? 0 : (safeData.data.requested_value_D - (treasuryRemove?.bills_100 as number ?? 0)),
      };
      await addBalanceInTreasuryByIdSystem(safeData.data.id_treasury_origin, dataRemove)
    }

    if (!newOrder) {
      await createLog({
        level: 'ERROR',
        action: 'ADD_ORDER',
        message: 'Erro ao salvar!',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'order',
        meta: { payload: sanitizeOrderPayload(safeData.data) }
      })
      res.status(400).json({ error: 'Erro ao salvar!' })
      return
    }
    await createLog({
      level: 'INFO',
      action: 'ADD_ORDER',
      message: 'Sucesso ao salvar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: 'order',
      resourceId: String(newOrder?.id),
      meta: {
        created: sanitizeOrder(newOrder),
        payload: sanitizeOrderPayload(safeData.data)
      }
    })
    res.status(201).json({ order: newOrder })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'ADD_ORDER',
      message: 'Erro ao salvar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
      meta: {
        payload: sanitizeOrderPayload(safeData.success ? safeData.data : undefined),
        error: String(error)
      }
    })
    res.status(400).json({ error: 'Erro ao salvar!' })
    return
  }
}

export const alterRequestsById: RequestHandler = async (req, res) => {
  const orderId = req.params.id
  if (!orderId || isNaN(parseInt(orderId))) {
    await createLog({
      level: 'ERROR',
      action: 'ALTER_REQUESTS_BY_ID',
      message: 'Preciso de um ID para continuar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
      meta: { id: req.params.id }
    })
    res.status(400).json({ error: 'Preciso de um ID para continuar!' })
    return
  }
  const safeData = alterRequestsOrderSchema.safeParse(req.body)
  if (!safeData.success) {
    await createLog({
      level: 'ERROR',
      action: 'ALTER_REQUESTS_BY_ID',
      message: 'Erro ao Editar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
      resourceId: String(orderId),
      meta: { validation: safeData.error.flatten().fieldErrors }
    })
    res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  try {
    const before = await getOrderById(parseInt(orderId));
    const newOrder = await alterRequestsOrderForID(parseInt(orderId), {
      requested_value_A: safeData.data.requested_value_A,
      requested_value_B: safeData.data.requested_value_B,
      requested_value_C: safeData.data.requested_value_C,
      requested_value_D: safeData.data.requested_value_D,
      observation: safeData.data.observation
    })
    if (!newOrder) {
      await createLog({
        level: 'ERROR',
        action: 'ALTER_REQUESTS_BY_ID',
        message: 'Erro ao salvar!',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'order',
        resourceId: String(orderId),
        meta: { payload: sanitizeOrderPayload(safeData.data), before: sanitizeOrder(before) }
      })
      res.status(400).json({ error: 'Erro ao salvar!' })
      return
    }
    const metaBefore = sanitizeOrder(before);
    const metaAfter = sanitizeOrder(newOrder);
    const treasury = await getForIdSystem(newOrder.id_treasury_destin.toString())
    let data = {
      bills_10: safeData.data.requested_value_A,
      bills_20: safeData.data.requested_value_B,
      bills_50: safeData.data.requested_value_C,
      bills_100: safeData.data.requested_value_D,
    }
    if (treasury) {
      await addBalanceInTreasuryByIdSystem(treasury?.id_system, data)
    }
    await createLog({
      level: 'INFO',
      action: 'ALTER_REQUESTS_BY_ID',
      message: 'Sucesso ao Editar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: 'order',
      resourceId: String(orderId),
      meta: {
        before: metaBefore,
        after: metaAfter,
        changed: diffObjects(metaBefore || {}, metaAfter || {}),
        payload: sanitizeOrderPayload(safeData.data)
      }
    })
    res.status(201).json({ order: newOrder })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'ALTER_REQUESTS_BY_ID',
      message: 'Erro ao Editar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
      resourceId: String(orderId),
      meta: { error: String(error) }
    })
    res.status(400).json({ error: 'Erro ao Editar!' })
    return
  }
}

export const searchByDate: RequestHandler = async (req, res) => {
  const safeData = orderSearchDateSchema.safeParse(req.body)
  if (!safeData.success) {
    await createLog({
      level: 'ERROR',
      action: 'SEARCH_BY_DATE',
      message: 'Erro ao salvar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
      meta: { validation: safeData.error.flatten().fieldErrors }
    })
    res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  try {
    const searchOrder = await searchByOrderDate({
      date_initial: returnDateFormatted(safeData.data.date_initial),
      date_final: returnDateFormatted(safeData.data.date_final),
    })
    if (!searchOrder) {
      await createLog({
        level: 'ERROR',
        action: 'SEARCH_BY_DATE',
        message: 'Erro ao salvar!',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'order',
        meta: { payload: sanitizeOrderPayload(safeData.data) }
      })
      res.status(400).json({ error: 'Erro ao salvar!' })
      return
    }
    await createLog({
      level: 'INFO',
      action: 'SEARCH_BY_DATE',
      message: 'Sucesso ao salvar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: 'order',
      meta: {
        payload: sanitizeOrderPayload(safeData.data),
        count: Array.isArray(searchOrder) ? searchOrder.length : 0
      }
    })
    res.status(201).json({ order: searchOrder })
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'SEARCH_BY_DATE',
      message: 'Erro ao salvar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
      meta: {
        payload: sanitizeOrderPayload(safeData.success ? safeData.data : undefined),
        error: String(error)
      }
    })
    res.status(400).json({ error: 'Erro ao salvar!' })
    return
  }
}

export const searchByDatePagination: RequestHandler = async (req, res) => {
  const safeData = orderSearchDateSchema.safeParse(req.body)
  const page = parseInt(req.query.page as string, 10) || 1;
  const pageSize = parseInt(req.query.pageSize as string, 10) || 13;
  const skip = (page - 1) * pageSize;
  if (!safeData.success) {
    await createLog({
      level: 'ERROR',
      action: 'SEARCH_BY_DATE_PAGINATION',
      message: 'Payload inválido',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
      meta: { validation: safeData.error.flatten().fieldErrors }
    });
    res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  try {
    const searchOrder = await searchByOrderDatePagination({
      date_initial: returnDateFormatted(safeData.data.date_initial),
      date_final: returnDateFormatted(safeData.data.date_final),
      page,
      pageSize
    })
    if (!searchOrder) {
      await createLog({
        level: 'ERROR',
        action: 'SEARCH_BY_DATE_PAGINATION',
        message: 'Erro na consulta paginada',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'order',
        meta: { payload: sanitizeOrderPayload(safeData.data), page, pageSize, skip }
      });
      res.status(400).json({ error: 'Erro ao salvar!' })
      return
    }
    await createLog({
      level: 'INFO',
      action: 'SEARCH_BY_DATE_PAGINATION',
      message: 'Consulta paginada OK',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: 'order',
      meta: {
        payload: sanitizeOrderPayload(safeData.data),
        page, pageSize, skip,
        totalItems: searchOrder.meta.totalItems,
        totalPages: searchOrder.meta.totalPages,
        pageCount: Array.isArray(searchOrder.data) ? searchOrder.data.length : 0
      }
    });
    res.status(201).json({ order: searchOrder })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'SEARCH_BY_DATE_PAGINATION',
      message: 'Erro na consulta paginada',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
      meta: { error: String(error), page, pageSize, skip }
    });
    res.status(400).json({ error: 'Erro ao salvar!' });
    return
  }
}

export const delById: RequestHandler = async (req, res) => {
  const orderId = req.params.id
  if (!orderId || isNaN(parseInt(orderId))) {
    await createLog({
      level: 'ERROR',
      action: 'DEL_ORDER_BY_ID',
      message: 'ID inválido',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
      meta: { id: req.params.id }
    });
    res.status(400).json({ error: 'Preciso de um ID para continuar!' })
    return
  }
  try {
    const before = await getOrderById(parseInt(orderId));
    const order: OrderType | null = await delOrderById(parseInt(orderId))
    if (!order) {
      await createLog({
        level: 'ERROR',
        action: 'DEL_ORDER_BY_ID',
        message: 'Erro ao deletar',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'order',
        resourceId: String(orderId),
        meta: { before: sanitizeOrder(before) }
      });
      res.status(400).json({ error: 'Erro ao Deletar!' })
      return
    }
    const treasury = await getForIdSystem(order?.id_treasury_destin.toString() as string)
    let data = {
      bills_10: treasury?.bills_10 as number - order.requested_value_A,
      bills_20: treasury?.bills_20 as number - order.requested_value_B,
      bills_50: treasury?.bills_50 as number - order.requested_value_C,
      bills_100: treasury?.bills_100 as number - order.requested_value_D,
    }
    await addBalanceInTreasuryByIdSystem(treasury?.id_system as number, data)
    const metaBefore = sanitizeOrder(before);
    const metaAfter = null; // deletado
    await createLog({
      level: 'INFO',
      action: 'DEL_ORDER_BY_ID',
      message: 'Deletado com sucesso',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: 'order',
      resourceId: String(orderId),
      meta: {
        before: metaBefore,
        after: metaAfter,
        changed: diffObjects(metaBefore || {}, metaAfter || {})
      }
    });
    res.status(200).json({ order })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'DEL_ORDER_BY_ID',
      message: 'Erro ao deletar',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
      resourceId: String(orderId),
      meta: { error: String(error) }
    });
    res.status(400).json({ error: 'Erro ao Deletar!' });
    return
  }
}

export const confirmTotal: RequestHandler = async (req, res) => {
  const safeData = req.body
  if (safeData.length === 0) {
    await createLog({
      level: 'ERROR',
      action: 'CONFIRM_TOTAL',
      message: 'Preciso de um ID para continuar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
    })
    res.status(400).json({ error: 'Preciso de um ID para continuar!' })
    return
  }
  try {
    const order = await confirmTotalByIds(safeData)
    if (!order) {
      await createLog({
        level: 'ERROR',
        action: 'CONFIRM_TOTAL',
        message: 'Erro ao salvar!',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'order',
        meta: { ids: safeData }
      })
      res.status(400).json({ error: 'Erro ao salvar!' })
      return
    }
    await createLog({
      level: 'INFO',
      action: 'CONFIRM_TOTAL',
      message: 'Sucesso ao salvar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: 'order',
      meta: { ids: safeData }
    })
    res.status(201).json({ order })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'CONFIRM_TOTAL',
      message: 'Erro ao salvar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
      meta: { ids: safeData, error: String(error) }
    })
    res.status(400).json({ error: 'Erro ao salvar!' })
    return
  }
}

export const infosOrder: RequestHandler = async (req, res) => {
  const { id } = req.params
  if (!id || isNaN(parseInt(id))) {
    await createLog({
      level: 'ERROR',
      action: 'GET_INFOS_ORDER',
      message: 'Preciso de um ID para continuar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
      meta: { id: req.params.id }
    })
    res.status(400).json({ error: 'Preciso de um ID para continuar!' })
    return
  }
  try {
    const order = await getInfosOrders(parseInt(id))
    if (!order) {
      await createLog({
        level: 'ERROR',
        action: 'GET_INFOS_ORDER',
        message: 'Erro ao salvar!',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'order',
        resourceId: String(id)
      })
      res.status(400).json({ error: 'Erro ao salvar!' })
      return
    }
    await createLog({
      level: 'INFO',
      action: 'GET_INFOS_ORDER',
      message: 'Sucesso ao salvar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: 'order',
      resourceId: String(id)
    })
    res.status(201).json({ order })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'GET_INFOS_ORDER',
      message: 'Erro ao salvar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
      resourceId: String(id),
      meta: { error: String(error) }
    })
    res.status(400).json({ error: 'Erro ao salvar!' })
    return
  }
}

export const alterPartialByID: RequestHandler = async (req, res) => {
  const orderId = req.params.id
  if (!orderId || isNaN(parseInt(orderId))) {
    await createLog({
      level: 'ERROR',
      action: 'ALTER_PARTIAL_BY_ID',
      message: 'Preciso de um ID para continuar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
      meta: { id: req.params.id }
    })
    res.status(400).json({ error: 'Preciso de um ID para continuar!' })
    return
  }
  const safeData = orderAlterPartialSchema.safeParse(req.body)
  if (!safeData.success) {
    await createLog({
      level: 'ERROR',
      action: 'ALTER_PARTIAL_BY_ID',
      message: 'Erro ao alterar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
      resourceId: String(orderId),
      meta: { validation: safeData.error.flatten().fieldErrors }
    })
    res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  try {
    const before = await getOrderById(parseInt(orderId));
    const order = await alterConfirmPatialById(parseInt(orderId), safeData.data)

    if (!order) {
      await createLog({
        level: 'ERROR',
        action: 'ALTER_PARTIAL_BY_ID',
        message: 'Erro ao alterar!',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'order',
        resourceId: String(orderId),
        meta: { payload: sanitizeOrderPayload(safeData.data), before: sanitizeOrder(before) }
      })
      res.status(400).json({ error: 'Erro ao alterar!' })
      return
    }
    const metaBefore = sanitizeOrder(before);
    const metaAfter = sanitizeOrder(order);
    await createLog({
      level: 'INFO',
      action: 'ALTER_PARTIAL_BY_ID',
      message: 'Sucesso ao alterar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: 'order',
      resourceId: String(orderId),
      meta: {
        before: metaBefore,
        after: metaAfter,
        changed: diffObjects(metaBefore || {}, metaAfter || {}),
        payload: sanitizeOrderPayload(safeData.data)
      }
    })
    res.status(200).json({ order })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'ALTER_PARTIAL_BY_ID',
      message: 'Erro ao alterar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
      resourceId: String(orderId),
      meta: { error: String(error) }
    })
    res.status(400).json({ error: 'Erro ao alterar!' })
    return
  }
}

export const alterDateOrder: RequestHandler = async (req, res) => {
  const orderId = req.params.id
  if (!orderId || isNaN(parseInt(orderId))) {
    await createLog({
      level: 'ERROR',
      action: 'ALTER_DATE_ORDER',
      message: 'Preciso de um ID para continuar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
      meta: { id: req.params.id }
    })
    res.status(400).json({ error: 'Preciso de um ID para continuar!' })
    return
  }
  const safeData = alterDateOrderSchema.safeParse(req.body)
  if (!safeData.success) {
    await createLog({
      level: 'ERROR',
      action: 'ALTER_DATE_ORDER',
      message: 'Erro ao alterar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
      resourceId: String(orderId),
      meta: { validation: safeData.error.flatten().fieldErrors }
    })
    res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  try {
    const newOrder: OrderType[] | null = await getOrderById(parseInt(orderId))
    let obs = ''
    let id = ''
    if (newOrder) {
      obs = newOrder[0].observation ?? ''
      id = newOrder[0].id?.toString() ?? ''
      let data = {
        typeOperation: { connect: { id: newOrder[0].id_type_operation } },
        treasuryOrigin: { connect: { id_system: newOrder[0].id_treasury_origin } },
        treasuryDestin: { connect: { id_system: newOrder[0].id_treasury_destin } },
        date_order: returnDateFormatted(safeData.data.date_order),
        typeOrder: { connect: { id: newOrder[0].id_type_order } },
        requested_value_A: newOrder[0].requested_value_A,
        requested_value_B: newOrder[0].requested_value_B,
        requested_value_C: newOrder[0].requested_value_C,
        requested_value_D: newOrder[0].requested_value_D,
        observation: `RELANÇADO DO DIA ${returnDate(newOrder[0].date_order)} || ID ${newOrder[0].id} || ${newOrder[0].observation}`,
        statusOrder: { connect: { id: 1 } }
      }
      await addOrder(data)
    }
    let data2 = {
      statusOrder: { connect: { id: 6 } },
      observation: `RELANÇADO PARA O DIA ${returnDateInPtBr(safeData.data.date_order)} || ID ${id} || ${obs}`
    }
    const order = await updateOrder(parseInt(orderId), data2)

    if (!order) {
      await createLog({
        level: 'ERROR',
        action: 'ALTER_DATE_ORDER',
        message: 'Erro ao alterar!',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'order',
        resourceId: String(orderId),
        meta: { payload: sanitizeOrderPayload(safeData.data), before: sanitizeOrder(newOrder?.[0]) }
      })
      res.status(400).json({ error: 'Erro ao alterar!' })
      return
    }
    const metaBefore = sanitizeOrder(newOrder?.[0]);
    const metaAfter = sanitizeOrder(order);
    await createLog({
      level: 'INFO',
      action: 'ALTER_DATE_ORDER',
      message: 'Sucesso ao alterar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: 'order',
      resourceId: String(orderId),
      meta: {
        before: metaBefore,
        after: metaAfter,
        changed: diffObjects(metaBefore || {}, metaAfter || {}),
        payload: sanitizeOrderPayload(safeData.data)
      }
    })
    res.status(200).json({ order })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'ALTER_DATE_ORDER',
      message: 'Erro ao alterar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 500,
      resource: 'order',
      resourceId: String(orderId),
      meta: { error: String(error) }
    })
    res.status(500).json({ error: 'Erro ao alterar!' })
    return
  }
}

export const generateRelease: RequestHandler = async (req, res) => {
  const safeData = orderGenerateReleaseSchema.safeParse(req.body)
  if (!safeData.success) {
    await createLog({
      level: 'ERROR',
      action: 'ALTER_DATE_ORDER',
      message: 'Erro ao alterar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
      meta: { validation: safeData.error.flatten().fieldErrors }
    })
    res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  try {
    const allOrders: any = await getOrderByIdsForPaymment(safeData.data)
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
      ids_treasuries_destin.push(allOrders[x].id_treasury_origin)
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

    const mergedData = await Promise.all(allOrders?.map(async (order: any) => {
      const treasury = treasuryMap[order.id_treasury_destin] // Busca a tesouraria correspondente
      const tDestin = treasuryMapDestin[order.id_treasury_origin]

      return {
        codigo: order.id_treasury_origin,
        conta: treasury?.account_number,
        tesouraria: treasury?.name,
        regiao: treasury?.region,
        valor: returnValueTotal(order.requested_value_A, order.requested_value_B, order.requested_value_C, order.requested_value_D),
        id_type_store: treasury?.id_type_store,
        date: order.date_order,
        type_operation: order.id_type_operation,
        conta_origem: tDestin ? tDestin.account_number : 0,
        tesouraria_origem: tDestin ? tDestin.name : "",
      };
    }));
    if (!mergedData) {
      await createLog({
        level: 'ERROR',
        action: 'ALTER_DATE_ORDER',
        message: 'Erro ao alterar!',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'order',
        meta: { payload: safeData.data }
      })
      res.status(400).json({ error: 'Erro ao alterar!' })
      return
    }
    await createLog({
      level: 'INFO',
      action: 'ALTER_DATE_ORDER',
      message: 'Sucesso ao alterar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: 'order',
      meta: { count: mergedData.length }
    })
    res.status(200).json({ order: mergedData })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'ALTER_DATE_ORDER',
      message: 'Erro ao alterar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
      meta: { error: String(error) }
    })
    res.status(400).json({ error: 'Erro ao alterar!' })
    return
  }
}

export const generatePayment: RequestHandler = async (req, res) => {
  const safeData = orderGenerateReleaseSchema.safeParse(req.body)
  if (!safeData.success) {
    await createLog({
      level: 'ERROR',
      action: 'ALTER_DATE_ORDER',
      message: 'Erro ao alterar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
      meta: { validation: safeData.error.flatten().fieldErrors }
    })
    res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  try {
    const allOrders: any = await getOrderByIdsForPaymment(safeData.data)
    const ids_treasuries = []
    const ids_treasuries_origin = []
    interface Treasury {
      id_system: number;
      name: string;
      gmcore_number: string;
      id_type_store: number;
      account_number: string;
      region: number;
      account_number_for_transfer: string;
    }
    for (let x = 0; (allOrders || []).length > x; x++) {
      ids_treasuries.push(allOrders[x].id_treasury_destin)
      ids_treasuries_origin.push(allOrders[x].id_treasury_origin)
    }

    const treasuries = await getForIds(ids_treasuries)
    const treasuries_origin = await getForIds(ids_treasuries_origin)
    const treasuryMap = (treasuries || []).reduce((map, treasury) => {
      map[treasury.id_system] = treasury;
      return map;
    }, {} as Record<number, Treasury>)
    const treasuryMapOrigin = (treasuries_origin || []).reduce((map, treasury) => {
      map[treasury.id_system] = treasury;
      return map;
    }, {} as Record<number, Treasury>)
    const mergedData = allOrders?.map((order: any) => {
      const treasury = treasuryMap[order.id_treasury_destin] // Busca a tesouraria correspondente
      const treasury_origin = treasuryMapOrigin[order.id_treasury_origin] // Busca a tesouraria correspondente
      return {
        id_order: order.id,
        id_type_operation: order.id_type_operation,
        codigo: order.id_treasury_origin,
        conta: treasury?.account_number,
        tesouraria: treasury?.name,
        gmcore: treasury?.gmcore_number,
        regiao: treasury?.region,
        valor: returnValueTotal(order.requested_value_A, order.requested_value_B, order.requested_value_C, order.requested_value_D),
        id_type_store: treasury?.id_type_store,
        date: order.date_order,
        conta_pagamento: treasury?.account_number_for_transfer,
        valorRealizado: returnValueTotal(order.confirmed_value_A, order.confirmed_value_B, order.confirmed_value_C, order.confirmed_value_D),
        estorno: calcularEstornoBRL(
          returnValueTotal(order.requested_value_A, order.requested_value_B, order.requested_value_C, order.requested_value_D),
          returnValueTotal(order.confirmed_value_A, order.confirmed_value_B, order.confirmed_value_C, order.confirmed_value_D)
        ),
        codigo_destin: order.id_treasury_destin,
        tesouraria_origem: treasury_origin?.name,
      };
    });

    const status = await confirmPaymantAllIds(safeData.data)

    if (!mergedData) {
      await createLog({
        level: 'ERROR',
        action: 'ALTER_DATE_ORDER',
        message: 'Erro ao alterar!',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'order',
        meta: { payload: safeData.data }
      })
      res.status(400).json({ error: 'Erro ao alterar!' })
      return
    }
    await createLog({
      level: 'INFO',
      action: 'ALTER_DATE_ORDER',
      message: 'Sucesso ao alterar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: 'order',
      meta: { count: mergedData.length }
    })
    res.status(200).json({ order: mergedData })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'ALTER_DATE_ORDER',
      message: 'Erro ao alterar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
      meta: { error: String(error) }
    })
    res.status(400).json({ error: error })
    return
  }
}

export const generateReports: RequestHandler = async (req, res) => {
  const safeData = orderGenerateReleaseSchema.safeParse(req.body)
  if (!safeData.success) {
    await createLog({
      level: 'ERROR',
      action: 'ALTER_DATE_ORDER',
      message: 'Erro ao alterar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
      meta: { validation: safeData.error.flatten().fieldErrors }
    })
    res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  try {
    const allOrders: any = await getOrderByIds(safeData.data)
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
        id_operation: order.id_type_operation,
        treasury: treasury?.name,
        value_A: order.requested_value_A,
        value_B: order.requested_value_B,
        value_C: order.requested_value_C,
        value_D: order.requested_value_D,
        date: order.date_order,
        treasury_destin: treasuryDestin?.name
      }

    });

    if (!mergedData) {
      await createLog({
        level: 'ERROR',
        action: 'ALTER_DATE_ORDER',
        message: 'Erro ao alterar!',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'order',
        meta: { payload: safeData.data }
      })
      res.status(400).json({ error: 'Erro ao alterar!' })
      return
    }
    await createLog({
      level: 'INFO',
      action: 'ALTER_DATE_ORDER',
      message: 'Sucesso ao alterar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: 'order',
      meta: { count: mergedData.length }
    })
    res.status(200).json({ order: mergedData })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'ALTER_DATE_ORDER',
      message: 'Erro ao alterar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
      meta: { error: String(error) }
    })
    res.status(400).json({ error: error })
    return
  }
}

export const alterOrderByIdOrder: RequestHandler = async (req, res) => {
  const { id } = req.params
  if (!id || isNaN(parseInt(id))) {
    await createLog({
      level: 'ERROR',
      action: 'ALTER_ORDER_BY_ID_ORDER',
      message: 'Erro ao salvar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
      meta: { id: req.params.id }
    })
    res.status(400).json({ error: 'Erro ao salvar!' })
    return
  }

  const safeData = orderEditSchema.safeParse(req.body)
  if (safeData.success === false) {
    await createLog({
      level: 'ERROR',
      action: 'ALTER_ORDER_BY_ID_ORDER',
      message: 'Erro ao salvar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
      meta: { validation: safeData.error.flatten().fieldErrors }
    })
    res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  try {
    const before = await getOrderById(parseInt(id));
    let data = {}
    if (safeData.data.status_order) {
      data = {
        statusOrder: {
          ...data,
          connect: {
            id: safeData.data.status_order
          }
        }
      }
    }
    if (safeData.data.observation) {
      data = {
        ...data,
        observation: safeData.data.observation
      }
    }
    if (safeData.data.date_order) {
      data = {
        ...data,
        date_order: returnDateFormatted(safeData.data.date_order)
      }
    }
    if (safeData.data.id_type_operation) {
      data = {
        ...data,
        typeOperation: {
          ...data,
          connect: {
            id: safeData.data.id_type_operation
          }
        }
      }
    }
    if (safeData.data.id_treasury_origin) {
      data = {
        ...data,
        treasuryOrigin: {
          ...data,
          connect: {
            id_system: safeData.data.id_treasury_origin
          }
        }
      }
    }
    if (safeData.data.id_treasury_destin) {
      data = {
        ...data,
        treasuryDestin: {
          ...data,
          connect: {
            id_system: safeData.data.id_treasury_destin
          }
        }
      }
    }
    if (safeData.data.id_type_order) {
      data = {
        ...data,
        typeOrder: {
          ...data,
          connect: {
            id: safeData.data.id_type_order
          }
        }
      }
    }
    if (safeData.data.requested_value_A) {
      data = {
        ...data,
        requested_value_A: safeData.data.requested_value_A
      }
    }
    if (safeData.data.requested_value_B) {
      data = {
        ...data,
        requested_value_B: safeData.data.requested_value_B
      }
    }
    if (safeData.data.requested_value_C) {
      data = {
        ...data,
        requested_value_C: safeData.data.requested_value_C
      }
    }
    if (safeData.data.requested_value_D) {
      data = {
        ...data,
        requested_value_D: safeData.data.requested_value_D
      }
    }
    if (safeData.data.confirmed_value_A) {
      data = {
        ...data,
        confirmed_value_A: safeData.data.confirmed_value_A
      }
    }
    if (safeData.data.confirmed_value_B) {
      data = {
        ...data,
        confirmed_value_B: safeData.data.confirmed_value_B
      }
    }
    if (safeData.data.confirmed_value_C) {
      data = {
        ...data,
        confirmed_value_C: safeData.data.confirmed_value_C
      }
    }
    if (safeData.data.confirmed_value_D) {
      data = {
        ...data,
        confirmed_value_D: safeData.data.confirmed_value_D
      }
    }
    if (safeData.data.composition_change) {
      data = {
        ...data,
        composition_change: safeData.data.composition_change
      }
    }
    const order = await updateOrder(parseInt(id), data)
    if (!order) {
      await createLog({
        level: 'ERROR',
        action: 'ALTER_ORDER_BY_ID_ORDER',
        message: 'Erro ao alterar!',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'order',
        resourceId: String(id),
        meta: { payload: sanitizeOrderPayload(safeData.data), before: sanitizeOrder(before) }
      })
      res.status(400).json({ error: 'Erro ao alterar!' })
      return
    }
    const metaBefore = sanitizeOrder(before);
    const metaAfter = sanitizeOrder(order);
    await createLog({
      level: 'INFO',
      action: 'ALTER_ORDER_BY_ID_ORDER',
      message: 'Alterado com sucesso!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: 'order',
      resourceId: String(id),
      meta: {
        before: metaBefore,
        after: metaAfter,
        changed: diffObjects(metaBefore || {}, metaAfter || {}),
        payload: sanitizeOrderPayload(safeData.data)
      }
    })
    res.status(200).json({ order })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'ALTER_ORDER_BY_ID_ORDER',
      message: 'Erro ao alterar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
      resourceId: String(id),
      meta: { error: String(error) }
    })
    res.status(400).json({ error })
    return
  }
}

export const getOrderMediasForYear: RequestHandler = async (req, res) => {
  try {
    const medias = await getMediasYears()
    if (!medias) {
      await createLog({
        level: 'ERROR',
        action: 'GET_ORDER_MEDIAS_FOR_YEAR',
        message: 'Erro ao buscar médias!',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'order',
      })
      res.status(400).json({ error: 'Erro ao buscar médias!' })
      return
    }
    await createLog({
      level: 'INFO',
      action: 'GET_ORDER_MEDIAS_FOR_YEAR',
      message: 'Buscado com sucesso!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: 'order',
      meta: { mediasCount: Array.isArray(medias) ? medias.length : 0 }
    })
    res.status(200).json({ medias })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'GET_ORDER_MEDIAS_FOR_YEAR',
      message: 'Erro ao buscar médias!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'order',
      meta: { error: String(error) }
    })
    res.status(400).json({ error: 'Erro ao buscar médias!' })
    return
  }
}

export type FilterOrdersDTO = {
  transportadora?: string | null;
  statusPedido?: number[] | string | null; // aceita array OU string "1,2,3"
  datas?: {
    inicial?: string | null;
    final?: string | null;
  };
};

export const filtersOrders : RequestHandler = async ( req, res): Promise<void> => {
  try {
    const data = req.body as FilterOrdersDTO;

    const filters = await getOrdersFiltereds(data);

    // erro real (ex.: erro no Prisma)
    if (filters === null) {
      res.status(500).json({
        message: "Erro ao buscar pedidos.",
      });
      return;
    }

    // requisição válida: retorna filtros (pode ser [] mesmo)
    res.status(200).json({
      filters,
      total: filters.length,
    });
  } catch (err) {
    console.error("CONTROLLER /order/filters ERROR =>", err);

    // ⚠️ AQUI NADA DE ANINHAR res.status DENTRO DE OUTRO
    res.status(500).json({
      message: "Erro interno no servidor.",
    });
  }
};