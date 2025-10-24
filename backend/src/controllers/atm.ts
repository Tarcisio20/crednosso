import { RequestHandler } from "express"
import { atmAddSchema } from "../schemas/atmAdd"
import { addAtm, addBalanceAtm, delAtm, getAllAtm, getAllAtmPagination, getForId, getForIdTreasury, updateAtm } from "../services/atm"
import { atmAddBalabceSchema } from "../schemas/atmAddBalabceSchema"
import { createLog } from "services/logService"
import { diffObjects, sanitizeAtm, sanitizeAtmBalancePayload } from "utils/audit/audit-atm"

export const getAll: RequestHandler = async (req, res) => {
  try {
    const atm = await getAllAtm()
    if (!atm) {
      await createLog({
        level: 'ERROR',
        action: 'GET_ALL_ATM',
        message: 'Erro ao carregar atms',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'atm',
      })
      res.status(400).json({ error: 'Erro ao carregar!' })
      return
    }
    await createLog({
      level: 'INFO',
      action: 'GET_ALL_ATM',
      message: 'Sucesso ao carregar atms',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: 'atm',
      meta: { count: Array.isArray(atm) ? atm.length : 0 },
    })
    res.status(200).json({ atm })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'GET_ALL_ATM',
      message: 'Erro ao carregar atms',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'atm',
      meta: { error: String(error) },
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
    const atm = await getAllAtmPagination(page, pageSize)
    if (!atm) {
      await createLog({
        level: 'ERROR',
        action: 'GET_ALL_ATM_PAGINATION',
        message: 'Erro ao carregar atms',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'atm',
        meta: { page, pageSize, skip },
      })
      res.status(401).json({ error: 'Erro ao carregar!' })
      return
    }
    await createLog({
      level: 'INFO',
      action: 'GET_ALL_ATM_PAGINATION',
      message: 'Sucesso ao carregar atms',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: 'atm',
      meta: {
        page,
        pageSize,
        totalItems: atm.totalItems,
        totalPages: atm.totalPages,
        pageCount: Array.isArray(atm.data) ? atm.data.length : 0,
      },
    })
    res.status(200).json({ atm })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'GET_ALL_ATM_PAGINATION',
      message: 'Erro ao carregar atms',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'atm',
      meta: { page, pageSize, error: String(error) },
    })
    res.status(400).json({ error: 'Erro ao carregar!' })
    return
  }
}

export const getAtmsForIdsTreasury: RequestHandler = async (req, res) => {
  const data = req.body
  if (!Array.isArray(data) || data.length === 0) {
    await createLog({
      level: 'ERROR',
      action: 'GET_ATMS_FOR_IDS_TREASURY',
      message: 'Erro ao carregar atms',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'atm',
      meta: { bodyType: typeof req.body },
    })
    res.status(400).json({ error: 'Erro ao carregar!' })
    return
  }
  try {
    const atms = []
    for (let x = 0; data.length > x; x++) {
      if (data[x]) {
        const a = await getForIdTreasury(data[x]);
        if (a) {
          // Se 'a' já for um array, espalhe seus elementos
          if (Array.isArray(a)) {
            atms.push(...a);
          } else {
            // Caso não seja array, insira diretamente
            atms.push(a);
          }
        }
      }
    }
    if (!atms) {
      await createLog({
        level: 'ERROR',
        action: 'GET_ATMS_FOR_IDS_TREASURY',
        message: 'Erro ao carregar atms',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'atm',
      })
      res.status(400).json({ error: 'Erro ao carregar!' })
      return
    }
    await createLog({
      level: 'INFO',
      action: 'GET_ATMS_FOR_IDS_TREASURY',
      message: 'Sucesso ao carregar atms',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: 'atm',
      meta: { treasuryIds: data, count: atms.length },
    })
    res.status(200).json({ atm: atms })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'GET_ATMS_FOR_IDS_TREASURY',
      message: 'Erro ao carregar atms',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'atm',
      meta: { treasuryIds: data, error: String(error) },
    })
    res.status(400).json({ error: 'Erro ao carregar!' })
    return
  }
}

export const getById: RequestHandler = async (req, res) => {
  const atmsId = req.params.id
  if (!atmsId || isNaN(parseInt(atmsId))) {
    await createLog({
      level: 'ERROR',
      action: 'GET_ATM_BY_ID',
      message: 'Erro ao carregar atms',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'atm',
      meta: { id: req.params.id },
    })
    res.status(400).json({ error: 'ID inválido!' })
    return
  }
  try {
    const atm = await getForId(parseInt(atmsId))
    if (!atm) {
      await createLog({
        level: 'ERROR',
        action: 'GET_ATM_BY_ID',
        message: 'Erro ao carregar atms',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'atm',
        resourceId: String(atmsId),
      })
      res.status(400).json({ error: 'Erro ao salvar!' })
      return
    }
    await createLog({
      level: 'INFO',
      action: 'GET_ATM_BY_ID',
      message: 'Sucesso ao carregar atms',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: 'atm',
      resourceId: String(atmsId),
    })
    res.status(200).json({ atm })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'GET_ATM_BY_ID',
      message: 'Erro ao carregar atms',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'atm',
      resourceId: String(atmsId),
      meta: { error: String(error) },
    })
    res.status(400).json({ error: 'Erro ao carregar!' })
    return
  }
}

export const add: RequestHandler = async (req, res) => {
  const safeData = atmAddSchema.safeParse(req.body)
  if (!safeData.success) {
    await createLog({
      level: 'ERROR',
      action: 'ADD_ATM',
      message: 'Erro ao salvar atm',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'atm',
      meta: { error: safeData.error.flatten().fieldErrors }
    })
    res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  try {
    const newTAtm = await addAtm({
      id_system: safeData.data.id_system,
      name: safeData.data.name,
      short_name: safeData.data.short_name,
      treasury: {
        connect: { id_system: safeData.data.id_treasury }

      },
      number_store: safeData.data.number_store,
      cassete_A: safeData.data.cassete_A,
      cassete_B: safeData.data.cassete_B,
      cassete_C: safeData.data.cassete_C,
      cassete_D: safeData.data.cassete_D,

    })
    if (!newTAtm) {
      await createLog({
        level: 'ERROR',
        action: 'ADD_ATM',
        message: 'Erro ao salvar atm',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'atm',
        meta: { payload: sanitizeAtm(safeData.data) },
      })
      res.status(400).json({ error: 'Erro ao salvar!' })
      return
    }
    await createLog({
      level: 'INFO',
      action: 'ADD_ATM',
      message: 'Sucesso ao salvar atm',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: 'atm',
      resourceId: String(newTAtm.id ?? newTAtm.id_system),
      meta: {
        created: sanitizeAtm(newTAtm),
        payload: sanitizeAtm(safeData.data),
      },
    })
    res.status(200).json({ atm: newTAtm })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'ADD_ATM',
      message: 'Erro ao salvar atm',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'atm',
      meta: { payload: sanitizeAtm(safeData.success ? safeData.data : undefined), error: String(error) },
    })
    res.status(400).json({ error: 'Erro ao salvar!' })
    return
  }
}

export const addBalance: RequestHandler = async (req, res) => {
  const atmId = req.params.id
  if (!atmId || isNaN(parseInt(atmId))) {
    await createLog({
      level: 'ERROR',
      action: 'ADD_ACCOUNT_BANK',
      message: 'Erro ao salvar conta bancaria',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'account-bank',
      meta: { id: req.params.id },
    })
    res.status(400).json({ error: 'Informar ID para continuar!' })
    return
  }
  const safeData = atmAddBalabceSchema.safeParse(req.body)
  if (!safeData.success) {
    await createLog({
      level: 'ERROR',
      action: 'ADD_ACCOUNT_BANK',
      message: 'Erro ao salvar conta bancaria',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'account-bank',
      resourceId: String(atmId),
      meta: { validation: safeData.error.flatten().fieldErrors },
    })
    res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  try {
    const before = await getForId(parseInt(atmId));
    const updated = await addBalanceAtm(parseInt(atmId), safeData.data);
    const newTAtm = await addBalanceAtm(parseInt(atmId), safeData.data)
    if (!newTAtm) {
      await createLog({
        level: 'ERROR',
        action: 'ADD_ACCOUNT_BANK',
        message: 'Erro ao salvar conta bancaria',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'account-bank',
        resourceId: String(atmId),
        meta: { payload: sanitizeAtmBalancePayload(safeData.data), before: sanitizeAtm(before) },
      })
      res.status(400).json({ error: 'Erro ao salvar!' })
      return
    }
    const metaBefore = sanitizeAtm(before);
    const metaAfter = sanitizeAtm(updated);
    await createLog({
      level: 'INFO',
      action: 'ADD_ACCOUNT_BANK',
      message: 'Sucesso ao salvar conta bancaria',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: 'account-bank',
      resourceId: String(atmId),
      meta: {
        before: metaBefore,
        after: metaAfter,
        changed: diffObjects(metaBefore || {}, metaAfter || {}),
        payload: sanitizeAtmBalancePayload(safeData.data),
      },
    })
    res.status(200).json({ atm: newTAtm })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'ADD_ACCOUNT_BANK',
      message: 'Erro ao salvar conta bancaria',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'account-bank',
      resourceId: String(atmId),
      meta: { payload: sanitizeAtmBalancePayload(safeData.success ? safeData.data : undefined), error: String(error) },
    })
    res.status(400).json({ error: 'Erro ao salvar!' })
    return
  }
}

export const update: RequestHandler = async (req, res) => {
  const atmId = req.params.id
  if (!atmId || isNaN(parseInt(atmId))) {
    await createLog({
      level: 'ERROR',
      action: 'UPDATE_ATM',
      message: 'Erro ao Editar atm',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'atm',
      meta: { id: req.params.id },
    })
    res.status(400).json({ error: 'Informar ID para continuar!' })
    return
  }
  const safeData = atmAddSchema.safeParse(req.body)
  if (!safeData.success) {
    await createLog({
      level: 'ERROR',
      action: 'UPDATE_ATM',
      message: 'Erro ao Editar atm',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'atm',
      resourceId: String(atmId),
      meta: { validation: safeData.error.flatten().fieldErrors },
    })
    res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  try {
    const before = await getForId(parseInt(atmId));
    const updateA = await updateAtm(parseInt(atmId), safeData.data)
    if (!updateA) {
      await createLog({
        level: 'ERROR',
        action: 'UPDATE_ATM',
        message: 'Erro ao Editar atm',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'atm',
        resourceId: String(atmId),
        meta: { payload: sanitizeAtm(safeData.data), before: sanitizeAtm(before) },
      })
      res.status(400).json({ error: 'Erro ao Editar!' })
      return
    }
    const metaBefore = sanitizeAtm(before);
    const metaAfter = sanitizeAtm(updateA);
    await createLog({
      level: 'INFO',
      action: 'UPDATE_ATM',
      message: 'Sucesso ao Editar atm',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: 'atm',
      resourceId: String(atmId),
      meta: {
        before: metaBefore,
        after: metaAfter,
        changed: diffObjects(metaBefore || {}, metaAfter || {}),
        payload: sanitizeAtm(safeData.data),
      },
    })
    res.status(200).json({ atm: updateA })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'UPDATE_ATM',
      message: 'Erro ao Editar atm',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'atm',
      meta: { error: 'Erro ao Editar!' }
    })
    res.status(400).json({ error: 'Erro ao Editar!' })
    return
  }
}

export const del: RequestHandler = async (req, res) => {
  const atmId = req.params.id
  if (!atmId || isNaN(parseInt(atmId))) {
    await createLog({
      level: 'ERROR',
      action: 'DELETE_ATM',
      message: 'Erro ao deletar atm',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'atm',
      meta: { id: req.params.id },
    })
    res.status(400).json({ error: 'Informar ID para continuar!' })
    return
  }
  try {
    const before = await getForId(parseInt(atmId));
    const delA = await delAtm(parseInt(atmId))
    if (!delA) {
      await createLog({
        level: 'ERROR',
        action: 'DELETE_ATM',
        message: 'Erro ao deletar atm',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'atm',
        resourceId: String(atmId),
        meta: { before: sanitizeAtm(before) },
      })
      res.status(400).json({ error: 'Erro ao Editar!' })
      return
    }
    const metaBefore = sanitizeAtm(before);
    const metaAfter = sanitizeAtm(delA);
    await createLog({
      level: 'INFO',
      action: 'DELETE_ATM',
      message: 'Sucesso ao deletar atm',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: 'atm',
      resourceId: String(atmId),
      meta: {
        before: metaBefore,
        after: metaAfter,
        changed: diffObjects(metaBefore || {}, metaAfter || {}),
      },
    })
    res.status(200).json({ atm: delA })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'DELETE_ATM',
      message: 'Erro ao deletar atm',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'atm',
      resourceId: String(atmId),
      meta: { error: String(error) },
    })
    res.status(400).json({ error: 'Erro ao Editar!' })
    return
  }
}
