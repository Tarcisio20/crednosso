import { RequestHandler } from "express"
import { statusOrderAddSchema } from "../schemas/statusOrderAddSchema"
import { addStatusOrder, delStatusOrder, getAllStatusOrder, getAllStatusOrderPagination, getStatusOrderForId, updateStatusOrder } from "../services/statusOrder"
import { createLog } from "services/logService"
import { diffObjects, sanitizeStatusOrder, sanitizeStatusOrderList, sanitizeStatusOrderPayload } from "utils/audit/audit-status-order"

export const getAll: RequestHandler = async (req, res) => {
  try {
    const statusOrder = await getAllStatusOrder()
    if (!statusOrder) {
      await createLog({
        level: "ERROR",
        action: "GET_ALL_STATUS_ORDER",
        message: "Erro ao carregar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "status-order",
      })
      res.status(400).json({ error: 'Erro ao carregar!' })
      return
    }
    await createLog({
      level: "INFO",
      action: "GET_ALL_STATUS_ORDER",
      message: "Sucesso ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "status-order",
      meta: { error: "Sucesso ao carregar!" },
    })
    res.status(200).json({ statusOrder })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_ALL_STATUS_ORDER",
      message: "Erro ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "status-order",
    })
    res.status(400).json({ error: 'Erro ao carregar!' })
    return
  }
}

export const getAllPagination: RequestHandler = async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 15;
  const skip = (page - 1) * pageSize;
  try {
    const statusOrder = await getAllStatusOrderPagination(page, pageSize)
    if (!statusOrder) {
      await createLog({
        level: "ERROR",
        action: "GET_ALL_STATUS_ORDER_PAGINATION",
        message: "Erro ao carregar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "status-order",
        meta: { page, pageSize },
      })
      res.status(400).json({ error: 'Erro ao carregar!' })
      return
    }
    await createLog({
      level: "INFO",
      action: "GET_ALL_STATUS_ORDER_PAGINATION",
      message: "Sucesso ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "status-order",
      meta: {
        page,
        pageSize,
        totalItems: statusOrder.totalItems,
        totalPages: statusOrder.totalPages,
        pageCount: Array.isArray(statusOrder.data) ? statusOrder.data.length : 0,
        items: sanitizeStatusOrderList(statusOrder.data),
      },
    })
    res.status(200).json({ statusOrder })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_ALL_STATUS_ORDER_PAGINATION",
      message: "Erro ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "status-order",
      meta: { page, pageSize, error: String(error) },
    })
    res.status(400).json({ error: 'Erro ao carregar!' })
    return
  }
}

export const getById: RequestHandler = async (req, res) => {
  const statusOrderId = req.params.id
  if (!statusOrderId || isNaN(parseInt(statusOrderId))) {
    await createLog({
      level: 'ERROR',
      action: 'GET_STATUS_ORDER_BY_ID',
      message: 'Preciso de um ID para continuar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'status-order',
      meta: { idParam: req.params.id },
    })
    res.status(400).json({ error: 'Preciso de um ID para continuar!' })
    return
  }
  try {
    const statusOrder = await getStatusOrderForId(statusOrderId)
    if (!statusOrder) {
      await createLog({
        level: 'ERROR',
        action: 'GET_STATUS_ORDER_BY_ID',
        message: 'Erro ao salvar!',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'status-order',
        resourceId: String(statusOrderId),
      })
      res.status(400).json({ error: 'Erro ao salvar!' })
      return
    }
    await createLog({
      level: 'INFO',
      action: 'GET_STATUS_ORDER_BY_ID',
      message: 'Sucesso ao salvar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: 'status-order',
      resourceId: String(statusOrderId),
      meta: { item: sanitizeStatusOrder(statusOrder) },
    })
    res.status(200).json({ statusOrder })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'GET_STATUS_ORDER_BY_ID',
      message: 'Erro ao salvar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'status-order',
      resourceId: String(statusOrderId),
      meta: { error: String(error) },
    })
    res.status(400).json({ error: 'Erro ao salvar!' })
    return
  }
}

export const add: RequestHandler = async (req, res) => {
  const safeData = statusOrderAddSchema.safeParse(req.body)
  if (!safeData.success) {
    await createLog({
      level: 'ERROR',
      action: 'ADD_STATUS_ORDER',
      message: 'Erro ao salvar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'status-order',
      meta: { error: safeData.error.flatten().fieldErrors },
    })
    res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  try {
    const newStatusOrder = await addStatusOrder({
      name: safeData.data.name
    })
    if (!newStatusOrder) {
      await createLog({
        level: 'ERROR',
        action: 'ADD_STATUS_ORDER',
        message: 'Erro ao salvar!',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'status-order',
        meta: { payload: sanitizeStatusOrderPayload(safeData.data) },
      })
      res.status(400).json({ error: 'Erro ao salvar!' })
      return
    }
    await createLog({
      level: 'INFO',
      action: 'ADD_STATUS_ORDER',
      message: 'Sucesso ao salvar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: 'status-order',
      resourceId: String(newStatusOrder.id),
    })
    res.status(200).json({ statusOrder: newStatusOrder })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'ADD_STATUS_ORDER',
      message: 'Erro ao salvar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'status-order',
      meta: {
        payload: sanitizeStatusOrderPayload(safeData.success ? safeData.data : undefined),
        error: String(error),
      },
    })
    res.status(400).json({ error: 'Erro ao salvar!' })
    return
  }
}

export const update: RequestHandler = async (req, res) => {
  const typeStatusOrderId = req.params.id
  if (!typeStatusOrderId || isNaN(parseInt(typeStatusOrderId))) {
    await createLog({
      level: 'ERROR',
      action: 'UPDATE_STATUS_ORDER',
      message: 'Selecione um Status Pedido, para continuar',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'status-order',
      meta: { idParam: req.params.id },
    })
    res.status(400).json({ error: 'Selecione um Status Pedido, para continuar' })
    return
  }
  const safeData = statusOrderAddSchema.safeParse(req.body)
  if (!safeData.success) {
    await createLog({
      level: 'ERROR',
      action: 'UPDATE_STATUS_ORDER',
      message: 'Erro ao Editar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'status-order',
      resourceId: String(typeStatusOrderId),
      meta: { validation: safeData.error.flatten().fieldErrors },
    })
    res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  try {
    const before = await getStatusOrderForId(typeStatusOrderId);
    const updateSOrder = await updateStatusOrder(parseInt(typeStatusOrderId), safeData.data)
    if (!updateSOrder) {
      await createLog({
        level: 'ERROR',
        action: 'UPDATE_STATUS_ORDER',
        message: 'Erro ao Editar!',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'status-order',
        resourceId: String(typeStatusOrderId),
        meta: {
          payload: sanitizeStatusOrderPayload(safeData.data),
          before: sanitizeStatusOrder(before),
        },
      })
      res.status(400).json({ error: 'Erro ao Editar!' })
      return
    }
    const metaBefore = sanitizeStatusOrder(before);
    const metaAfter = sanitizeStatusOrder(updateSOrder);
    await createLog({
      level: 'INFO',
      action: 'UPDATE_STATUS_ORDER',
      message: 'Sucesso ao Editar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: 'status-order',
      resourceId: String(typeStatusOrderId),
      meta: {
        before: metaBefore,
        after: metaAfter,
        changed: diffObjects(metaBefore || {}, metaAfter || {}),
        payload: sanitizeStatusOrderPayload(safeData.data),
      },
    })
    res.status(200).json({ statusOrder: updateSOrder })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'UPDATE_STATUS_ORDER',
      message: 'Erro ao Editar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'status-order',
      resourceId: String(typeStatusOrderId),
      meta: { error: String(error) },
    })
    res.status(400).json({ error: 'Erro ao Editar!' })
    return
  }
}

export const del: RequestHandler = async (req, res) => {
  const typeStatusOrderId = req.params.id
  if (!typeStatusOrderId || isNaN(parseInt(typeStatusOrderId))) {
    await createLog({
      level: 'ERROR',
      action: 'DELETE_STATUS_ORDER',
      message: 'Selecione um Status Pedido, para continuar',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'status-order',
      meta: { idParam: req.params.id },
    })
    res.status(400).json({ error: 'Selecione um Status Pedido, para continuar' })
    return
  }
  try {
    const before = await getStatusOrderForId(typeStatusOrderId);
    const delSOrder = await delStatusOrder(parseInt(typeStatusOrderId))
    if (!delSOrder) {
      await createLog({
        level: 'ERROR',
        action: 'DELETE_STATUS_ORDER',
        message: 'Erro ao Editar!',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 401,
        resource: 'status-order',
        resourceId: String(typeStatusOrderId),
        meta: { before: sanitizeStatusOrder(before) },
      })
      res.status(401).json({ error: 'Erro ao Editar!' })
      return
    }
    const metaBefore = sanitizeStatusOrder(before);
    const metaAfter = sanitizeStatusOrder(delSOrder);
    await createLog({
      level: 'INFO',
      action: 'DELETE_STATUS_ORDER',
      message: 'Sucesso ao Editar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: 'status-order',
      resourceId: String(typeStatusOrderId),
      meta: {
        before: metaBefore,
        after: metaAfter,
        changed: diffObjects(metaBefore || {}, metaAfter || {}),
      },
    })
    res.status(200).json({ statusOrder: delSOrder })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'DELETE_STATUS_ORDER',
      message: 'Erro ao Editar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 500,
      resource: 'status-order',
      resourceId: String(typeStatusOrderId),
      meta: { error: String(error) },
    })
    res.status(500).json({ error: 'Erro ao Editar!' })
    return
  }
}