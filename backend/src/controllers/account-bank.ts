import { RequestHandler } from "express"
import { addAccountBank, delAccountBank, getAllAccountPagination, getForId, updateAccountBank } from "../services/account-bank";
import { AccontBankAddSchema } from "../schemas/addAccountBank";
import { createLog } from "services/logService";
import { diffObjects, sanitizeAccountBank } from "utils/audit/audit-account-bank";

export const getAllPagination: RequestHandler = async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 15;
  const skip = (page - 1) * pageSize;
  try {
    const account = await getAllAccountPagination(page, pageSize)

    if (!account) {
      await createLog({
        level: 'ERROR',
        action: 'GET_ALL_ACCOUNT_PAGINATION',
        message: 'Erro ao carregar contas bancarias',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 500,
        resource: 'account-bank',
        meta: { page, pageSize, skip }
      })

      res.status(500).json({ error: 'Erro ao carregar!' })
      return
    }

    await createLog({
      level: 'INFO',
      action: 'GET_ALL_ACCOUNT_PAGINATION',
      message: 'Sucesso ao carregar contas bancarias',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: 'account-bank',
      meta: {
        page,
        pageSize,
        totalItems: account.totalItems,
        totalPages: account.totalPages,
      },
    })
    res.status(200).json({ account })
    return

  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'GET_ALL_ACCOUNT_PAGINATION',
      message: 'Erro ao carregar contas bancarias',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 500,
      resource: 'account-bank',
      meta: { page, pageSize, error: String(error) },
    })
    res.status(500).json({ error: 'Erro ao carregar!' })
    return
  }
}

export const add: RequestHandler = async (req, res) => {
  const safeData = AccontBankAddSchema.safeParse(req.body)
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
      meta: { validation: safeData.error.flatten().fieldErrors },
    })
    res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  try {
    const newAccountBank = await addAccountBank({
      name: safeData.data.name,
      bank_branch: safeData.data.bank_branch,
      bank_branch_digit: safeData.data.bank_branch_digit,
      account: safeData.data.account,
      account_digit: safeData.data.account_digit,
      hash: safeData.data.hash,
      type: safeData.data.type,

    })
    if (!newAccountBank) {
      await createLog({
        level: 'ERROR',
        action: 'ADD_ACCOUNT_BANK',
        message: 'Erro ao salvar conta bancaria',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 500,
        resource: 'account-bank',
        meta: { payload: sanitizeAccountBank(safeData.data) },
      })
      res.status(500).json({ error: 'Erro ao salvar!' })
      return
    }
    await createLog({
      level: 'INFO',
      action: 'ADD_ACCOUNT_BANK',
      message: 'Sucesso ao salvar conta bancaria',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: 'account-bank',
      meta: {
        created: sanitizeAccountBank(newAccountBank),
        payload: sanitizeAccountBank(safeData.data),
      },
    })
    res.status(200).json({ account: newAccountBank })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'ADD_ACCOUNT_BANK',
      message: 'Erro ao salvar conta bancaria',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 500,
      resource: 'account-bank',
      meta: { payload: sanitizeAccountBank(safeData.success ? safeData.data : undefined), error: String(error) },
    })
    res.status(500).json({ error: 'Erro ao salvar!' })
    return
  }
}

export const getById: RequestHandler = async (req, res) => {
  const accountId = req.params.id
  if (!accountId || isNaN(parseInt(accountId))) {
    await createLog({
      level: 'ERROR',
      action: 'GET_ACCOUNT_BANK_BY_ID',
      message: 'Erro ao carregar conta bancaria',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'account-bank',
      meta: { id: req.params.id }
    })
    res.status(400).json({ error: 'ID inválido!' })
    return
  }
  try {
    const account = await getForId(parseInt(accountId))
    if (!account) {
      await createLog({
        level: 'ERROR',
        action: 'GET_ACCOUNT_BANK_BY_ID',
        message: 'Erro ao carregar conta bancaria',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'account-bank',
        resourceId: String(accountId),
      })
      res.status(400).json({ error: 'Erro ao salvar!' })
      return
    }
    await createLog({
      level: 'INFO',
      action: 'GET_ACCOUNT_BANK_BY_ID',
      message: 'Conta bancaria carregada com sucesso',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: 'account-bank',
      resourceId: String(accountId),
      meta: { account },
    })
    res.status(200).json({ account })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'GET_ACCOUNT_BANK_BY_ID',
      message: 'Erro ao carregar conta bancaria',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 500,
      resource: 'account-bank',
      resourceId: String(accountId),
      meta: { error: error }
    })
    res.status(500).json({ error: 'Erro ao carregar!' })
    return
  }
}

export const update: RequestHandler = async (req, res) => {
  const accountId = req.params.id
  if (!accountId || isNaN(parseInt(accountId))) {
    await createLog({
      level: 'ERROR',
      action: 'UPDATE_ACCOUNT_BANK',
      message: 'Erro ao editar conta bancaria',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'account-bank',
      meta: { id: req.params.id },
    })
    res.status(400).json({ error: 'ID inválido!' })
    return
  }
  const safeData = AccontBankAddSchema.safeParse(req.body)
  if (!safeData.success) {
    await createLog({
      level: 'ERROR',
      action: 'UPDATE_ACCOUNT_BANK',
      message: 'Erro ao editar conta bancaria',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'account-bank',
      resourceId: String(accountId),
      meta: { validation: safeData.error.flatten().fieldErrors },
    })
    res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  try {
    const before = await getForId(parseInt(accountId));
    const accountA = await updateAccountBank(parseInt(accountId), safeData.data)
    if (!accountA) {
      await createLog({
        level: 'ERROR',
        action: 'UPDATE_ACCOUNT_BANK',
        message: 'Erro ao editar conta bancaria',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 500,
        resource: 'account-bank',
        resourceId: String(accountId),
        meta: { payload: sanitizeAccountBank(safeData.data), before: sanitizeAccountBank(before) },
      })
      res.status(500).json({ error: 'Erro ao Editar!' })
      return
    }
    const metaBefore = sanitizeAccountBank(before);
    const metaAfter = sanitizeAccountBank(accountA);
    await createLog({
      level: 'INFO',
      action: 'UPDATE_ACCOUNT_BANK',
      message: 'Conta bancaria editada com sucesso',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: 'account-bank',
      resourceId: String(accountId),
      meta: {
        before: metaBefore,
        after: metaAfter,
        changed: diffObjects(metaBefore || {}, metaAfter || {}),
        payload: sanitizeAccountBank(safeData.data),
      },
    })
    res.status(200).json({ account: accountA })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'UPDATE_ACCOUNT_BANK',
      message: 'Erro ao editar conta bancaria',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 500,
      resource: 'account-bank',
      resourceId: String(accountId),
      meta: { payload: sanitizeAccountBank(safeData.data), error: String(error) },
    })
    res.status(500).json({ error: 'Erro ao Editar!' })
    return
  }
}

export const del: RequestHandler = async (req, res) => {
  const accountId = req.params.id
  if (!accountId || isNaN(parseInt(accountId))) {
    await createLog({
      level: 'ERROR',
      action: 'DELETE_ACCOUNT_BANK',
      message: 'Erro ao deletar conta bancaria',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'account-bank',
      resourceId: String(accountId),
    })
    res.status(400).json({ error: 'Informar ID para continuar!' })
    return
  }
  try {
    const before = await getForId(parseInt(accountId));
    const accountA = await delAccountBank(parseInt(accountId))
    if (!accountA) {
      await createLog({
        level: 'ERROR',
        action: 'DELETE_ACCOUNT_BANK',
        message: 'Erro ao deletar conta bancaria',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'account-bank',
        resourceId: String(accountId),
        meta: { before: sanitizeAccountBank(before) },
      })
      res.status(400).json({ error: 'Erro ao Editar!' })
      return
    }
    const metaBefore = sanitizeAccountBank(before);
    const metaAfter = sanitizeAccountBank(accountA);
    await createLog({
      level: 'INFO',
      action: 'DELETE_ACCOUNT_BANK',
      message: 'Conta bancaria deletada com sucesso',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: 'account-bank',
      resourceId: String(accountId),
      meta: {
        before: metaBefore,
        after: metaAfter,
        changed: diffObjects(metaBefore || {}, metaAfter || {}),
      },
    })
    res.status(200).json({ account: accountA })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'DELETE_ACCOUNT_BANK',
      message: 'Erro ao deletar conta bancaria',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 500,
      resource: 'account-bank',
      resourceId: String(accountId),
      meta: { error: String(error) },
    })
    res.status(500).json({ error: 'Erro ao Editar!' })
    return
  }
}