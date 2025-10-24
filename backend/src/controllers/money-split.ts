import { RequestHandler } from "express"
import { addRatteds, getMoneySplitByIdOrder, getMoneySplitByIdTreasury } from "../services/money-split"
import { addRattedSchema } from "../schemas/addRattedSchema"
import { getForIdSystem } from "../services/treasury"
import { returnDate } from "../utils/returnDate"
import { returnValueInReal } from "../utils/returnValueInReal"
import { createLog } from "services/logService"
import { sanitizeMoneySplitList, sanitizeMoneySplitPayload } from "utils/audit/audit-money-split"

export const getForIdOrder: RequestHandler = async (req, res) => {
  const { id } = req.params
  if (!id || isNaN(parseInt(id))) {
    await createLog({
      level: "ERROR",
      action: "GET_MONEY_SPLIT_BY_ID_ORDER",
      message: "ID nao informado!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "money-split",
      meta: { id: req.params.id },
    })
    res.status(400).json({ error: 'ID não informado!' })
    return
  }
  try {
    const moneySplit = await getMoneySplitByIdOrder(parseInt(id))
    if (!moneySplit) {
      await createLog({
        level: "ERROR",
        action: "GET_MONEY_SPLIT_BY_ID_ORDER",
        message: "Erro ao carregar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "money-split",
        resourceId: String(id),
      })
      res.status(400).json({ error: 'Erro ao carregar!' })
      return
    }
    await createLog({
      level: "INFO",
      action: "GET_MONEY_SPLIT_BY_ID_ORDER",
      message: "Sucesso ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: "money-split",
      resourceId: String(id),
      meta: {
        count: Array.isArray(moneySplit) ? moneySplit.length : 0,
        refunds: sanitizeMoneySplitList(moneySplit),
      },
    })
    res.status(201).json({ moneySplit })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_MONEY_SPLIT_BY_ID_ORDER",
      message: "Erro ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "money-split",
      resourceId: String(id),
      meta: { error: String(error) },
    })
    res.status(400).json({ error: 'Erro ao carregar!' })
    return
  }
}

export const addAllRatteds: RequestHandler = async (req, res) => {
  const safeData = addRattedSchema.safeParse(req.body);
  if (!safeData.success) {
    await createLog({
      level: "ERROR",
      action: "ADD_RATTEDS",
      message: "Dados inválidos!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "money-split",
      meta: { validation: safeData.error.flatten().fieldErrors },
    })
    res.status(400).json({ error: 'Dados inválidos!' })
    return
  }
  try {
    const moneySplit = await addRatteds(safeData.data)
    if (!moneySplit) {
      await createLog({
        level: "ERROR",
        action: "ADD_RATTEDS",
        message: "Erro ao carregar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "money-split",
        meta: { payload: sanitizeMoneySplitPayload(safeData.data) },
      })
      res.status(400).json({ error: 'Erro ao carregar!' })
      return
    }

    const items = Array.isArray(moneySplit) ? moneySplit : [moneySplit];

    await createLog({
      level: "INFO",
      action: "ADD_RATTEDS",
      message: "Sucesso ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: "money-split",
      meta: {
        payload: sanitizeMoneySplitPayload(safeData.data),
        count: items.length,
        created: sanitizeMoneySplitList(items),
      },
    })
    res.status(201).json({ moneySplit })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "ADD_RATTEDS",
      message: "Erro ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "money-split",
      meta: {
        payload: sanitizeMoneySplitPayload(safeData.success ? safeData.data : undefined),
        error: String(error),
      },
    })
    res.status(400).json({ error: 'Erro ao carregar!' })
    return
  }
}

export const getAllByIdTreasury: RequestHandler = async (req, res) => {
  const { id, id_order } = req.params
  if (!id || isNaN(parseInt(id))) {
    await createLog({
      level: "ERROR",
      action: "GET_ALL_BY_ID_TREASURY",
      message: "ID nao informado!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "money-split",
      meta: { treasuryId: req.params.id },
    })
    res.status(400).json({ error: 'ID não informado!' })
    return
  }
  if (!id_order || isNaN(parseInt(id_order))) {
    await createLog({
      level: "ERROR",
      action: "GET_ALL_BY_ID_TREASURY",
      message: "ID order nao informado!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "money-split",
      meta: { orderId: req.params.id_order },
    })
    res.status(400).json({ error: 'ID order order nao informado!' })
    return
  }
  try {
    const moneySplit = await getMoneySplitByIdTreasury(parseInt(id), parseInt(id_order))
    if (!moneySplit) {
      await createLog({
        level: "ERROR",
        action: "GET_ALL_BY_ID_TREASURY",
        message: "Erro ao carregar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "money-split",
        meta: { treasuryId: id, orderId: id_order },
      })
      res.status(400).json({ error: 'Erro ao carregar!' })
      return
    }
    await createLog({
      level: "INFO",
      action: "GET_ALL_BY_ID_TREASURY",
      message: "Sucesso ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: "money-split",
      meta: {
        treasuryId: id,
        orderId: id_order,
        count: Array.isArray(moneySplit) ? moneySplit.length : 0,
        items: sanitizeMoneySplitList(moneySplit),
      },
    })
    res.status(201).json({ moneySplit })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_ALL_BY_ID_TREASURY",
      message: "Erro ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "money-split",
      meta: { treasuryId: id, orderId: id_order, error: String(error) },
    })
    res.status(400).json({ error: 'Erro ao carregar!' })
    return
  }
}

export const getAllByIdTreasuryAjusted: RequestHandler = async (req, res) => {
  const { id, id_order } = req.params
  if (!id || isNaN(parseInt(id))) {
    await createLog({
      level: "ERROR",
      action: "GET_ALL_BY_ID_TREASURY",
      message: "ID nao informado!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "money-split",
      meta: { treasuryId: req.params.id },
    })
    res.status(400).json({ error: 'ID não informado!' })
    return
  }
  if (!id_order || isNaN(parseInt(id_order))) {
    await createLog({
      level: "ERROR",
      action: "GET_ALL_BY_ID_TREASURY",
      message: "ID order nao informado!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "money-split",
      meta: { orderId: req.params.id_order },
    })
    res.status(400).json({ error: 'ID order nao informado!' })
    return
  }
  try {
    const moneySplit = await getMoneySplitByIdTreasury(parseInt(id), parseInt(id_order))
    let result;
    if (moneySplit && moneySplit.length > 0) {
      result = await Promise.all( // <- Aqui está a correção
        moneySplit.map(async (item) => {
          const t = await getForIdSystem(item.id_treasury_rating.toString());
          const t_o = await getForIdSystem(item.id_treasury_origin.toString());
          return {
            id_order: item.id_order,
            codigo: item.id_treasury_rating,
            conta: t?.account_number,
            tesouraria: t?.name,
            gmcore: t?.gmcore_number,
            regiao: t?.region,
            valor: returnValueInReal(item.value),
            id_type_store: t?.id_type_store,
            date: returnDate(item.createdAt),
            conta_pagamento: t?.account_number_for_transfer,
            valorRealizado: returnValueInReal(item.value),
            estorno: 'R$ 00,00',
            codigo_destin: item.id_treasury_origin,
            tesouraria_origem: t_o?.name,
            type: 'RAT',
          };
        })
      );
    }
    if (!result) {
      await createLog({
        level: "ERROR",
        action: "GET_ALL_BY_ID_TREASURY",
        message: "Erro ao carregar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "money-split",
        meta: { treasuryId: id, orderId: id_order },
      })
      res.status(400).json({ error: 'Erro ao carregar!' })
      return
    }
    await createLog({
      level: "INFO",
      action: "GET_ALL_BY_ID_TREASURY",
      message: "Sucesso ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: "money-split",
      meta: {
        treasuryId: id,
        orderId: id_order,
        count: Array.isArray(result) ? result.length : 0,
      },
    })
    res.status(201).json({ moneySplit: result })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_ALL_BY_ID_TREASURY",
      message: "Erro ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "money-split",
      meta: { treasuryId: id, orderId: id_order, error: String(error) },
    })
    res.status(400).json({ error: 'Erro ao carregar!' })
    return
  }
}