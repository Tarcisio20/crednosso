import { RequestHandler } from "express"
import { addRattedRefundSchema } from "../schemas/addRattedRefundSchema";
import { addRefund, getRefusedForIdOrder } from "../services/money-split-refund";
import { createLog } from "services/logService";
import { sanitizeContactPayload } from "utils/audit/audit-contact";
import { sanitizeMoneySplitRefund, sanitizeMoneySplitRefundList } from "utils/audit/audit-money-split-refund";

export const add: RequestHandler = async (req, res) => {
  const safeData = addRattedRefundSchema.safeParse(req.body);
  if (!safeData.success) {
    await createLog({
      level: "ERROR",
      action: "ADD_MONEY_SPLIT_REFUND",
      message: "Erro ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "money-split-refund",
      meta: { validation: safeData.error.flatten().fieldErrors },
    })
    res.status(400).json({ error: 'Dados inválidos!' })
    return
  }
  try {
    const data = {
      order: {
        connect: { id: safeData.data.id_order }
      },
      treasury: {
        connect: { id: safeData.data.id_treasury_origin }
      },
      value: safeData.data.value,
    }

    const moneySplitRefund = await addRefund(data)
    if (!moneySplitRefund) {
      await createLog({
        level: "ERROR",
        action: "ADD_MONEY_SPLIT_REFUND",
        message: "Erro ao salvar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "money-split-refund",
        meta: { payload: sanitizeContactPayload(safeData.data) },
      })
      res.status(400).json({ error: 'Erro ao carregar!' })
      return
    }
    await createLog({
      level: "INFO",
      action: "ADD_MONEY_SPLIT_REFUND",
      message: "Sucesso ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: "money-split-refund",
      resourceId: String(moneySplitRefund.id),
      meta: {
        created: sanitizeMoneySplitRefund(moneySplitRefund),
        payload: sanitizeContactPayload(safeData.data),
      },
    })
    res.status(201).json({ moneySplitRefund })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "ADD_MONEY_SPLIT_REFUND",
      message: "Erro ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "money-split-refund",
      meta: {
        payload: sanitizeContactPayload(safeData.success ? safeData.data : undefined),
        error: String(error),
      },
    })
    res.status(400).json({ error: 'Erro ao carregar!' })
    return
  }
}

export const getResultByIdOrder: RequestHandler = async (req, res) => {
  const { id } = req.params
  if (!id || isNaN(parseInt(id))) {
    await createLog({
      level: "ERROR",
      action: "GET_MONEY_SPLIT_REFUND_BY_ID_ORDER",
      message: "Dados inválidos!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "money-split-refund",
      meta: { id: req.params.id },
    })
    res.status(400).json({ error: 'Dados inválidos!' })
    return
  }
  try {
    const moneySplitRefund = await getRefusedForIdOrder(parseInt(id))
    if (!moneySplitRefund) {
      await createLog({
        level: "ERROR",
        action: "GET_MONEY_SPLIT_REFUND_BY_ID_ORDER",
        message: "Erro ao carregar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "money-split-refund",
        resourceId: String(id),
      })
      res.status(400).json({ error: 'Erro ao carregar!' })
      return
    }
    await createLog({
      level: "INFO",
      action: "GET_MONEY_SPLIT_REFUND_BY_ID_ORDER",
      message: "Sucesso ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: "money-split-refund",
      resourceId: String(id),
      meta: {
        count: Array.isArray(moneySplitRefund) ? moneySplitRefund.length : 0,
        refunds: sanitizeMoneySplitRefundList(moneySplitRefund),
      },
    })
    res.status(201).json({ moneySplitRefund })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_MONEY_SPLIT_REFUND_BY_ID_ORDER",
      message: "Erro ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "money-split-refund",
      resourceId: String(id),
      meta: { error: String(error) },
    })
    res.status(400).json({ error: 'Erro ao carregar!' })
    return
  }
}
