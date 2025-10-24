import { RequestHandler } from "express"
import { addError, delOperationalError, editOperationalError, getAllOperationalErrorPagination, getOperationErroForId } from "../services/operational-error";
import { operationalErrorAddSchema } from "../schemas/operationalErrorAdd";
import { createLog } from "services/logService";
import { diffObjects, sanitizeOperationalError, sanitizeOperationalErrorList, sanitizeOperationalErrorPayload } from "utils/audit/audit-operational-error";

export const getAllPagination: RequestHandler = async (req, res) => {
  const pageRaw = Number(req.query.page);
  const sizeRaw = Number(req.query.pageSize);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;
  const pageSize = Number.isFinite(sizeRaw) && sizeRaw > 0 ? Math.min(Math.floor(sizeRaw), 100) : 15;
  try {
    const result = await getAllOperationalErrorPagination(page, pageSize);
    if (!result) {
      await createLog({
        level: 'ERROR',
        action: 'GET_ALL_OPERATIONAL_ERROR_PAGINATION',
        message: 'Erro ao carregar erros operacionais',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'operational-error',
        meta: { page, pageSize },
      })
      res.status(400).json({ error: 'Erro ao carregar!' })
      return
    }
    await createLog({
      level: 'INFO',
      action: 'GET_ALL_OPERATIONAL_ERROR_PAGINATION',
      message: 'Sucesso ao carregar erros operacionais',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: 'operational-error',
      meta: {
        page: page,
        pageSize: pageSize,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        pageCount: Array.isArray(result.data) ? result.data.length : 0,
        items: sanitizeOperationalErrorList(result.data),
      },
    })
    res.status(201).json({ operationalError: result })
    return
  } catch (error: any) {
    await createLog({
      level: 'ERROR',
      action: 'GET_ALL_OPERATIONAL_ERROR_PAGINATION',
      message: 'Erro ao carregar erros operacionais',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'operational-error',
      meta: { error: String(error?.message ?? error) },
    })
    res.status(400).json({ error: "Erro interno" });
    return
  }
}

export const add: RequestHandler = async (req, res) => {
  const safeData = operationalErrorAddSchema.safeParse(req.body)
  if (!safeData.success) {
    await createLog({
      level: 'ERROR',
      action: 'ADD_OPERATIONAL_ERROR',
      message: 'Erro ao salvar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'operational-error',
      meta: { validation: safeData.error.flatten().fieldErrors },
    })
    res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  try {
    const newOError = await addError({
      treasury: {
        connect: { id: safeData.data.id_treasury }
      },
      num_os: safeData.data.num_os,
      description: safeData.data.description,
    })
    if (!newOError) {
      await createLog({
        level: 'ERROR',
        action: 'ADD_OPERATIONAL_ERROR',
        message: 'Erro ao salvar!',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'operational-error',
        meta: { payload: sanitizeOperationalErrorPayload(safeData.data) },
      })
      res.status(400).json({ error: 'Erro ao salvar!' })
      return
    }
    await createLog({
      level: 'INFO',
      action: 'ADD_OPERATIONAL_ERROR',
      message: 'Sucesso ao salvar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: 'operational-error',
      resourceId: String(newOError.id),
      meta: {
        created: sanitizeOperationalError(newOError),
        payload: sanitizeOperationalErrorPayload(safeData.data),
      },
    })
    res.status(201).json({ operationalError: newOError })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'ADD_OPERATIONAL_ERROR',
      message: 'Erro ao salvar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'operational-error',
      meta: {
        payload: sanitizeOperationalErrorPayload(safeData.success ? safeData.data : undefined),
        error: String(error),
      },
    })
    res.status(400).json({ error: "Erro interno" });
    return
  }
}

export const getOperationalErrorById: RequestHandler = async (req, res) => {
  const operationalErrorId = req.params.id
  if (!operationalErrorId || isNaN(parseInt(operationalErrorId))) {
    await createLog({
      level: 'ERROR',
      action: 'GET_OPERATIONAL_ERROR_BY_ID',
      message: 'Requisição sem ID!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'operational-error',
      meta: { idParam: req.params.id },
    })
    res.status(400).json({ error: 'Informar ID para continuar!' })
    return
  }
  try {
    const operationalError = await getOperationErroForId(parseInt(operationalErrorId))
    if (!operationalError) {
      await createLog({
        level: 'ERROR',
        action: 'GET_OPERATIONAL_ERROR_BY_ID',
        message: 'Erro ao carregar!',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'operational-error',
        resourceId: String(operationalErrorId),
      })
      res.status(400).json({ error: 'Erro ao carregar!' })
      return
    }
    await createLog({
      level: 'INFO',
      action: 'GET_OPERATIONAL_ERROR_BY_ID',
      message: 'Sucesso ao carregar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: 'operational-error',
      resourceId: String(operationalErrorId),
      meta: { item: sanitizeOperationalError(operationalError) },
    })
    res.status(201).json({ operationalError })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'GET_OPERATIONAL_ERROR_BY_ID',
      message: 'Erro ao carregar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'operational-error',
      resourceId: String(operationalErrorId),
      meta: { error: String(error) },
    })
    res.status(400).json({ error: "Erro interno" });
    return
  }
}

export const edit: RequestHandler = async (req, res) => {
  const operationalErrorId = req.params.id
  if (!operationalErrorId || isNaN(parseInt(operationalErrorId))) {
    await createLog({
      level: 'ERROR',
      action: 'EDIT_OPERATIONAL_ERROR',
      message: 'Requisição sem ID!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'operational-error',
      meta: { idParam: req.params.id },
    })
    res.status(400).json({ error: 'Informar ID para continuar!' })
    return
  }
  const safeData = operationalErrorAddSchema.safeParse(req.body)
  if (!safeData.success) {
    await createLog({
      level: 'ERROR',
      action: 'EDIT_OPERATIONAL_ERROR',
      message: 'Erro ao Editar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'operational-error',
      resourceId: String(operationalErrorId),
      meta: { validation: safeData.error.flatten().fieldErrors },
    })
    res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  try {
    const before = await getOperationErroForId(parseInt(operationalErrorId));
    const editE = await editOperationalError(parseInt(operationalErrorId), safeData.data)
    if (!editE) {
      await createLog({
        level: 'ERROR',
        action: 'EDIT_OPERATIONAL_ERROR',
        message: 'Erro ao Editar!',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'operational-error',
        resourceId: String(operationalErrorId),
        meta: { payload: sanitizeOperationalErrorPayload(safeData.data), before: sanitizeOperationalError(before) },
      })
      res.status(400).json({ error: 'Erro ao Editar!' })
      return
    }
    const metaBefore = sanitizeOperationalError(before);
    const metaAfter = sanitizeOperationalError(editE);
    await createLog({
      level: 'INFO',
      action: 'EDIT_OPERATIONAL_ERROR',
      message: 'Sucesso ao Editar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: 'operational-error',
      resourceId: String(operationalErrorId),
      meta: {
        before: metaBefore,
        after: metaAfter,
        changed: diffObjects(metaBefore || {}, metaAfter || {}),
        payload: sanitizeOperationalErrorPayload(safeData.data),
      },
    })
    res.status(201).json({ operationalError: editE })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'EDIT_OPERATIONAL_ERROR',
      message: 'Erro ao Editar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'operational-error',
      resourceId: String(operationalErrorId),
      meta: { error: String(error) },
    })
    res.status(400).json({ error: "Erro interno" });
    return
  }
}

export const del: RequestHandler = async (req, res) => {
  const operationalErrorId = req.params.id
  if (!operationalErrorId || isNaN(parseInt(operationalErrorId))) {
    await createLog({
      level: 'ERROR',
      action: 'DEL_OPERATIONAL_ERROR',
      message: 'Requisição sem ID!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'operational-error',
      meta: { idParam: req.params.id },
    })
    res.status(400).json({ error: 'Informar ID para continuar!' })
    return
  }
  try {
    const before = await getOperationErroForId(parseInt(operationalErrorId));
    const delE = await delOperationalError(parseInt(operationalErrorId))
    if (!delE) {
      await createLog({
        level: 'ERROR',
        action: 'DEL_OPERATIONAL_ERROR',
        message: 'Erro ao Editar!',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'operational-error',
        resourceId: String(operationalErrorId),
        meta: { before: sanitizeOperationalError(before) },
      })
      res.status(400).json({ error: 'Erro ao Editar!' })
      return
    }
    const metaBefore = sanitizeOperationalError(before);
    const metaAfter = sanitizeOperationalError(delE);
    await createLog({
      level: 'INFO',
      action: 'DEL_OPERATIONAL_ERROR',
      message: 'Sucesso ao Editar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: 'operational-error',
      resourceId: String(operationalErrorId),
      meta: {
        before: metaBefore,
        after: metaAfter,
        changed: diffObjects(metaBefore || {}, metaAfter || {}),
      },
    })
    res.status(201).json({ operationalError: delE })

  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'DEL_OPERATIONAL_ERROR',
      message: 'Erro ao Editar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'operational-error',
      resourceId: String(operationalErrorId),
      meta: { error: String(error) },
    })
    res.status(400).json({
      error: "Erro interno"
    })
    return
  }
}

