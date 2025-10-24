import { RequestHandler } from "express"
import { typeOperationdAddSchema } from "../schemas/typeOperationAddSchema"
import { addTypeOperation, getAllTypeOperation, getAllTypeOperationPagination, getTypeOperationForId, updateTypeOperation } from "../services/typeOperation"
import { createLog } from "services/logService"


export const getAll: RequestHandler = async (req, res) => {
  try {
    const typeOperation = await getAllTypeOperation()
    if (!typeOperation) {
      await createLog({
        level: "ERROR",
        action: "GET_ALL_TYPE_OPERATION",
        message: "Erro ao carregar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 401,
        resource: "typeOperation",
        meta: { error: "Erro ao carregar!" },
      })
      res.status(401).json({ error: 'Erro ao carregar!' })
      return
    }
    await createLog({
      level: "INFO",
      action: "GET_ALL_TYPE_OPERATION",
      message: "Sucesso ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "typeOperation",
      meta: { message: "Sucesso ao carregar!" },
    })
    res.status(200).json({ typeOperation })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_ALL_TYPE_OPERATION",
      message: "Erro ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "typeOperation",
      meta: { error: "Erro ao carregar!" },
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
    const typeOperation = await getAllTypeOperationPagination(page, pageSize)
    if (!typeOperation) {
      await createLog({
        level: "ERROR",
        action: "GET_ALL_TYPE_OPERATION_PAGINATION",
        message: "Erro ao carregar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 401,
        resource: "typeOperation",
        meta: { error: "Erro ao carregar!" },
      })
      res.status(401).json({ error: 'Erro ao carregar!' })
      return
    }
    await createLog({
      level: "INFO",
      action: "GET_ALL_TYPE_OPERATION_PAGINATION",
      message: "Sucesso ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "typeOperation",
      meta: { message: "Sucesso ao carregar!" },
    })
    res.status(200).json({ typeOperation })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_ALL_TYPE_OPERATION_PAGINATION",
      message: "Erro ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "typeOperation",
      meta: { error: "Erro ao carregar!" },
    })
    res.status(401).json({ error: 'Erro ao carregar!' })
    return
  }


}

export const getById: RequestHandler = async (req, res) => {
  const typeOperationId = req.params.id
  if (!typeOperationId || isNaN(parseInt(typeOperationId))) {
    await createLog({
      level: "ERROR",
      action: "GET_TYPE_OPERATION_BY_ID",
      message: "Requisição sem ID!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "typeOperation",
      meta: { error: "Requisição sem ID!" },
    })
    res.status(401).json({ error: 'Requisição sem ID!' })
    return
  }
  try {
    const typeOperation = await getTypeOperationForId(typeOperationId)
    if (!typeOperation) {
      await createLog({
        level: "ERROR",
        action: "GET_TYPE_OPERATION_BY_ID",
        message: "Erro ao retornar dados!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 401,
        resource: "typeOperation",
        meta: { error: "Erro ao retornar dados!" },
      })
      res.status(401).json({ error: 'Erro ao salvar!' })
      return
    }
    await createLog({
      level: "INFO",
      action: "GET_TYPE_OPERATION_BY_ID",
      message: "Sucesso ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "typeOperation",
      meta: { message: "Sucesso ao carregar!" },
    })
    res.status(200).json({ typeOperation })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_TYPE_OPERATION_BY_ID",
      message: "Erro ao retornar dados!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "typeOperation",
      meta: { error: "Erro ao retornar dados!" },
    })
    res.status(401).json({ error: 'Erro ao salvar!' })
    return
  }
}

export const add: RequestHandler = async (req, res) => {
  const safeData = typeOperationdAddSchema.safeParse(req.body)
  if (!safeData.success) {
    await createLog({
      level: "ERROR",
      action: "ADD_TYPE_OPERATION",
      message: "Erro ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "typeOperation",
      meta: { error: safeData.error.flatten().fieldErrors },
    })
    res.json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  try {
    const newTOperation = await addTypeOperation({
      id_system: safeData.data.id_system,
      name: safeData.data.name
    })
    if (!newTOperation) {
      await createLog({
        level: "ERROR",
        action: "ADD_TYPE_OPERATION",
        message: "Erro ao salvar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 401,
        resource: "typeOperation",
        meta: { error: "Erro ao salvar!" },
      })
      res.status(401).json({ error: 'Erro ao salvar!' })
      return
    }
    await createLog({
      level: "INFO",
      action: "ADD_TYPE_OPERATION",
      message: "Sucesso ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "typeOperation",
      meta: { message: "Sucesso ao salvar!" },
    })
    res.status(200).json({ typeOperation: newTOperation })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "ADD_TYPE_OPERATION",
      message: "Erro ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "typeOperation",
      meta: { error: "Erro ao salvar!" },
    })
    res.status(401).json({ error: 'Erro ao salvar!' })
    return
  }
}

export const update: RequestHandler = async (req, res) => {
  const typeOperationId = req.params.id
  if (!typeOperationId || isNaN(parseInt(typeOperationId))) {
    await createLog({
      level: "ERROR",
      action: "UPDATE_TYPE_OPERATION",
      message: "Requisição sem ID!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "typeOperation",
      meta: { error: "Requisição sem ID!" },
    })
    res.status(401).json({ error: 'Requisição sem ID!' })
    return
  }
  const safeData = typeOperationdAddSchema.safeParse(req.body)
  if (!safeData.success) {
    await createLog({
      level: "ERROR",
      action: "UPDATE_TYPE_OPERATION",
      message: "Erro ao Editar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "typeOperation",
      meta: { error: safeData.error.flatten().fieldErrors },
    })
    res.json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  try {
    const updateType = await updateTypeOperation(parseInt(typeOperationId), safeData.data)
    if (!updateType) {
      await createLog({
        level: "ERROR",
        action: "UPDATE_TYPE_OPERATION",
        message: "Erro ao Editar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 401,
        resource: "typeOperation",
        meta: { error: "Erro ao Editar!" },
      })
      res.status(401).json({ error: 'Erro ao Editar!' })
      return
    }
    await createLog({
      level: "INFO",
      action: "UPDATE_TYPE_OPERATION",
      message: "Sucesso ao Editar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "typeOperation",
      meta: { message: "Sucesso ao Editar!" },
    })
    res.status(200).json({ typeOperation: updateType })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "UPDATE_TYPE_OPERATION",
      message: "Erro ao Editar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "typeOperation",
      meta: { error: "Erro ao Editar!" },
    })
    res.status(401).json({ error: 'Erro ao Editar!' })
    return
  }
}
