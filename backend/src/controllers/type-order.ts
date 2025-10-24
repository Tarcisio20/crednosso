import { RequestHandler } from "express"
import { typeOrderAddSchema } from "../schemas/typeOrderAddSchema"
import { addTypeOrder, getAllTypeOrder, getAllTypeOrderPagination, getTypeOrderForId, updateTypeOrder } from "../services/typeOrder"
import { createLog } from "services/logService"

export const getAll: RequestHandler = async (req, res) => {
  try {
    const typeOrder = await getAllTypeOrder()
    if (!typeOrder) {
      await createLog({
        level: "ERROR",
        action: "GET_ALL_TYPE_ORDER",
        message: "Erro ao carregar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 401,
        resource: "typeOrder",
        meta: { error: "Erro ao carregar!" },
      })
      res.status(401).json({ error: 'Erro ao carregar!' })
      return
    }
    await createLog({
      level: "INFO",
      action: "GET_ALL_TYPE_ORDER",
      message: "Sucesso ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "typeOrder",
      meta: { message: "Sucesso ao carregar!" },
    })
    res.status(200).json({ typeOrder })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_ALL_TYPE_ORDER",
      message: "Erro ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "typeOrder",
      meta: { error: error },
    })
    res.status(401).json({ error: 'Erro ao carregar!' })
    return
  }
}

export const getAllPagination: RequestHandler = async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 15;
  const skip = (page - 1) * pageSize;
  try {
    const typeOrder = await getAllTypeOrderPagination(page, pageSize)
    if (!typeOrder) {
      await createLog({
        level: "ERROR",
        action: "GET_ALL_TYPE_ORDER_PAGINATION",
        message: "Erro ao carregar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 401,
        resource: "typeOrder",
        meta: { error: "Erro ao carregar!" },
      })
      res.status(401).json({ error: 'Erro ao carregar!' })
      return
    }
    await createLog({
      level: "INFO",
      action: "GET_ALL_TYPE_ORDER_PAGINATION",
      message: "Sucesso ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "typeOrder",
      meta: { message: "Sucesso ao carregar!" },
    })
    res.status(200).json({ typeOrder })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_ALL_TYPE_ORDER_PAGINATION",
      message: "Erro ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "typeOrder",
      meta: { error: error },
    })
  }
}

export const getById: RequestHandler = async (req, res) => {
  const typeOrderId = req.params.id
  if (!typeOrderId || isNaN(parseInt(typeOrderId))) {
    await createLog({
      level: "ERROR",
      action: "GET_TYPE_ORDER_BY_ID",
      message: "Requisição sem ID!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "typeOrder",
      meta: { error: "Requisição sem ID!" },
    })
    res.status(401).json({ error: 'Requisição sem ID!' })
    return
  }
  try {
    const typeOrder = await getTypeOrderForId(typeOrderId)
    if (!typeOrder) {
      await createLog({
        level: "ERROR",
        action: "GET_TYPE_ORDER_BY_ID",
        message: "Erro ao retornar dados!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 401,
        resource: "typeOrder",
        meta: { error: "Erro ao retornar dados!" },
      })
      res.status(401).json({ error: 'Erro ao salvar!' })
      return
    }
    await createLog({
      level: "INFO",
      action: "GET_TYPE_ORDER_BY_ID",
      message: "Sucesso ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "typeOrder",
      meta: { message: "Sucesso ao carregar!" },
    })
    res.status(200).json({ typeOrder })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_TYPE_ORDER_BY_ID",
      message: "Erro ao retornar dados!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "typeOrder",
      meta: { error: error },
    })
    res.status(401).json({ error: 'Erro ao salvar!' })
    return
  }

}

export const add: RequestHandler = async (req, res) => {
  const safeData = typeOrderAddSchema.safeParse(req.body)
  if (!safeData.success) {
    await createLog({
      level: "ERROR",
      action: "ADD_TYPE_ORDER",
      message: "Erro ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "typeOrder",
      meta: { error: safeData.error.flatten().fieldErrors },
    })
    res.json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  try {
    const newTOrder = await addTypeOrder({
      id_system: safeData.data.id_system,
      name: safeData.data.name
    })
    if (!newTOrder) {
      await createLog({
        level: "ERROR",
        action: "ADD_TYPE_ORDER",
        message: "Erro ao salvar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 401,
        resource: "typeOrder",
        meta: { error: "Erro ao salvar!" },
      })
      res.status(401).json({ error: 'Erro ao salvar!' })
      return
    }
    await createLog({
      level: "INFO",
      action: "ADD_TYPE_ORDER",
      message: "Sucesso ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "typeOrder",
      meta: { message: "Sucesso ao salvar!" },
    })
    res.status(200).json({ typeOrder: newTOrder })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "ADD_TYPE_ORDER",
      message: "Erro ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "typeOrder",
      meta: { error: error },
    })
    res.status(401).json({ error: 'Erro ao salvar!' })
    return
  }

}

export const update: RequestHandler = async (req, res) => {
  const typeOrderId = req.params.id
  if (!typeOrderId || isNaN(parseInt(typeOrderId))) {
    await createLog({
      level: "ERROR",
      action: "UPDATE_TYPE_ORDER",
      message: "Requisição sem ID!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "typeOrder",
      meta: { error: "Requisição sem ID!" },
    })
    res.status(401).json({ error: "Requisição sem ID!" })
    return
  }
  const safeData = typeOrderAddSchema.safeParse(req.body)
  if (!safeData.success) {
    await createLog({
      level: "ERROR",
      action: "UPDATE_TYPE_ORDER",
      message: "Erro ao Editar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "typeOrder",
      meta: { error: safeData.error.flatten().fieldErrors },
    })
    res.json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  try {
    const updateType = await updateTypeOrder(parseInt(typeOrderId), safeData.data)
    if (!updateType) {
      await createLog({
        level: "ERROR",
        action: "UPDATE_TYPE_ORDER",
        message: "Erro ao Editar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 401,
        resource: "typeOrder",
        meta: { error: "Erro ao Editar!" },
      })
      res.status(401).json({ error: 'Erro ao Editar!' })
      return
    }
    await createLog({
      level: "INFO",
      action: "UPDATE_TYPE_ORDER",
      message: "Sucesso ao Editar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "typeOrder",
      meta: { message: "Sucesso ao Editar!" },
    })
    res.status(200).json({ typeOrder: updateType })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "UPDATE_TYPE_ORDER",
      message: "Erro ao Editar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "typeOrder",
      meta: { error: error },
    })
    res.status(401).json({ error: 'Erro ao Editar!' })
    return
  }


}

export const del: RequestHandler = async (req, res) => {
  const typeOrderId = req.params.id
  if (!typeOrderId || isNaN(parseInt(typeOrderId))) {
    await createLog({
      level: "ERROR",
      action: "DELETE_TYPE_ORDER",
      message: "Requisição sem ID!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "typeOrder",
      meta: { error: "Requisição sem ID!" },
    })
    res.status(401).json({ error: "Requisição sem ID!" })
    return
  }
  const safeData = typeOrderAddSchema.safeParse(req.body)
  if (!safeData.success) {
    await createLog({
      level: "ERROR",
      action: "DELETE_TYPE_ORDER",
      message: "Erro ao Editar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "typeOrder",
      meta: { error: safeData.error.flatten().fieldErrors },
    })
    res.json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  try {
    const updateType = await updateTypeOrder(parseInt(typeOrderId), safeData.data)
    if (!updateType) {
      await createLog({
        level: "ERROR",
        action: "DELETE_TYPE_ORDER",
        message: "Erro ao Editar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 401,
        resource: "typeOrder",
        meta: { error: "Erro ao Editar!" },
      })
      res.status(401).json({ error: 'Erro ao Editar!' })
      return
    }
    await createLog({
      level: "INFO",
      action: "DELETE_TYPE_ORDER",
      message: "Sucesso ao Editar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "typeOrder",
      meta: { message: "Sucesso ao Editar!" },
    })
    res.status(200).json({ typeOrder: updateType })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "DELETE_TYPE_ORDER",
      message: "Erro ao Editar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "typeOrder",
      meta: { error: error },
    })
    res.status(401).json({ error: 'Erro ao Editar!' })
    return
  }
}