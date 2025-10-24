import { RequestHandler } from "express";
import { cardOperatorAddSchema } from "../schemas/cardOperatorAddSchema";
import {
  getAllCardOperator,
  addCardOperator,
  getCardOperatorForId,
  getForIdTreasury,
  updateCardOperator,
  delCardOperator,
} from "../services/cardOperator";
import { createLog } from "../services/logService";
import { diffObjects, sanitizeCardOperator, sanitizeCardOperatorPayload, } from "utils/audit/audit-card-operation";

export const getAll: RequestHandler = async (req, res) => {
  try {
    const cardOperator = await getAllCardOperator()
    if (!cardOperator) {
      await createLog({
        level: "ERROR",
        action: "GET_ALL_CARD_OPERATOR",
        message: "Erro ao retornar dados!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "card-operator",
      })
      res.status(400).json({ error: "Erro ao salvar!" });
      return;
    }
    await createLog({
      level: "INFO",
      action: "GET_ALL_CARD_OPERATOR",
      message: "Sucesso ao retornar dados!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: "card-operator",
      meta: { count: Array.isArray(cardOperator) ? cardOperator.length : 0 },
    })
    res.status(201).json({ cardOperator });
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_ALL_CARD_OPERATOR",
      message: "Erro ao retornar dados!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "card-operator",
      meta: { error: String(error) },
    })
    res.status(400).json({ error: "Erro ao salvar!" });
    return
  }
};

export const getByIdTreasury: RequestHandler = async (req, res) => {
  const treasuryId = req.params.id;
  if (!treasuryId || isNaN(parseInt(treasuryId))) {
    await createLog({
      level: "ERROR",
      action: "GET_CARD_OPERATOR_BY_ID_TREASURY",
      message: "Requisição sem ID!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "card-operator",
      meta: { id: req.params.id },
    })
    res.status(400).json({ error: "Requisição sem ID!" });
    return;
  }
  try {
    const cardOperator = await getForIdTreasury(parseInt(treasuryId));
    if (!cardOperator) {
      await createLog({
        level: "ERROR",
        action: "GET_CARD_OPERATOR_BY_ID_TREASURY",
        message: "Erro ao retornar dados!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "card-operator",
        resourceId: String(treasuryId),
      })
      res.status(400).json({ error: "Erro ao retornar dados!" });
      return;
    }
    await createLog({
      level: "INFO",
      action: "GET_CARD_OPERATOR_BY_ID_TREASURY",
      message: "Sucesso ao retornar dados!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: "card-operator",
      resourceId: String(treasuryId),
      meta: { count: Array.isArray(cardOperator) ? cardOperator.length : 0 },
    })
    res.status(201).json({ cardOperator });
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_CARD_OPERATOR_BY_ID_TREASURY",
      message: "Erro ao retornar dados!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "card-operator",
      resourceId: String(treasuryId),
      meta: { error: String(error) },
    })
    res.status(400).json({ error: "Erro ao retornar dados!" });
    return
  }
};

export const getById: RequestHandler = async (req, res) => {
  const cardOperatorId = req.params.id;
  if (!cardOperatorId || isNaN(parseInt(cardOperatorId))) {
    await createLog({
      level: "ERROR",
      action: "GET_CARD_OPERATOR_BY_ID",
      message: "Requisição sem ID!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "card-operator",
      meta: { id: req.params.id },
    })
    res.status(400).json({ error: "Requisição sem ID!" });
    return;
  }
  try {
    const cardOperator = await getCardOperatorForId(cardOperatorId);
    if (!cardOperator) {
      await createLog({
        level: "ERROR",
        action: "GET_CARD_OPERATOR_BY_ID",
        message: "Erro ao retornar dados!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "card-operator",
        resourceId: String(cardOperatorId),
      })
      res.status(400).json({ error: "Erro ao salvar!" });
      return;
    }
    await createLog({
      level: "INFO",
      action: "GET_CARD_OPERATOR_BY_ID",
      message: "Sucesso ao retornar dados!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: "card-operator",
      resourceId: String(cardOperatorId),
    })
    res.status(201).json({ cardOperator });
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_CARD_OPERATOR_BY_ID",
      message: "Erro ao retornar dados!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "card-operator",
      resourceId: String(cardOperatorId),
      meta: { error: String(error) },
    })
    res.status(400).json({ error: "Erro ao retornar dados!" });
    return
  }
};

export const add: RequestHandler = async (req, res) => {
  const safeData = cardOperatorAddSchema.safeParse(req.body);
  if (!safeData.success) {
    await createLog({
      level: "ERROR",
      action: "ADD_CARD_OPERATOR",
      message: "Erro ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "card-operator",
      meta: { error: safeData.error.flatten().fieldErrors },
    })
    res.status(400).json({ error: safeData.error.flatten().fieldErrors });
    return;
  }
  try {
    const newCardOperator = await addCardOperator({
      treasury: {
        connect: { id: safeData.data.id_treasury },
      },
      name: safeData.data.name,
      number_card: safeData.data.number_card,
      inUse: safeData.data.inUse ?? false
    });
    if (!newCardOperator) {
      await createLog({
        level: "ERROR",
        action: "ADD_CARD_OPERATOR",
        message: "Erro ao salvar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "card-operator",
        meta: { payload: sanitizeCardOperatorPayload(safeData.data) },
      })
      res.status(400).json({ error: "Erro ao salvar!" });
      return;
    }
    await createLog({
      level: "INFO",
      action: "ADD_CARD_OPERATOR",
      message: "Sucesso ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: "card-operator",
      resourceId: String(newCardOperator.id),
      meta: {
        created: sanitizeCardOperator(newCardOperator),
        payload: sanitizeCardOperatorPayload(safeData.data),
      },
    })
    res.status(201).json({ cardOperator: newCardOperator });
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "ADD_CARD_OPERATOR",
      message: "Erro ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "card-operator",
      meta: {
        payload: sanitizeCardOperatorPayload(safeData.success ? safeData.data : undefined),
        error: String(error),
      },
    })
    res.status(400).json({ error: "Erro ao salvar!" });
    return
  }
};

export const update: RequestHandler = async (req, res) => {
  const cardOperatorId = req.params.id;
  if (!cardOperatorId || isNaN(parseInt(cardOperatorId))) {
    await createLog({
      level: "ERROR",
      action: "UPDATE_CARD_OPERATOR",
      message: "Requisição sem ID!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "card-operator",
      meta: { id: req.params.id },
    })
    res.status(400).json({ error: "Requisição sem ID!" });
    return
  }
  const safeData = cardOperatorAddSchema.safeParse(req.body);
  if (!safeData.success) {
    await createLog({
      level: "ERROR",
      action: "UPDATE_CARD_OPERATOR",
      message: "Erro ao Editar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "card-operator",
      resourceId: String(cardOperatorId),
      meta: { validation: safeData.error.flatten().fieldErrors },
    })
    res.status(400).json({ error: safeData.error.flatten().fieldErrors });
    return;
  }
  try {
    const before = await getCardOperatorForId(cardOperatorId);
    const updateCOperator = await updateCardOperator(
      parseInt(cardOperatorId),
      safeData.data
    );
    if (!updateCOperator) {
      await createLog({
        level: "ERROR",
        action: "UPDATE_CARD_OPERATOR",
        message: "Erro ao Editar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "card-operator",
        resourceId: String(cardOperatorId),
        meta: { payload: sanitizeCardOperatorPayload(safeData.data), before: sanitizeCardOperator(before) },
      })
      res.status(400).json({ error: "Erro ao Editar!" });
      return;
    }
    const metaBefore = sanitizeCardOperator(before);
    const metaAfter = sanitizeCardOperator(updateCOperator);
    await createLog({
      level: "INFO",
      action: "UPDATE_CARD_OPERATOR",
      message: "Sucesso ao Editar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: "card-operator",
      resourceId: String(cardOperatorId),
      meta: {
        before: metaBefore,
        after: metaAfter,
        changed: diffObjects(metaBefore || {}, metaAfter || {}),
        payload: sanitizeCardOperatorPayload(safeData.data),
      },
    })
    res.status(201).json({ cardOperator: updateCOperator });
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "UPDATE_CARD_OPERATOR",
      message: "Erro ao Editar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "card-operator",
      resourceId: String(cardOperatorId),
      meta: { error: String(error) },
    })
    res.status(400).json({ error: "Erro ao Editar!" });
    return
  }
};

export const del: RequestHandler = async (req, res) => {
  const cardOperatorId = req.params.id;
  if (!cardOperatorId || isNaN(parseInt(cardOperatorId))) {
    await createLog({
      level: "ERROR",
      action: "DELETE_CARD_OPERATOR",
      message: "Requisição sem ID!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "card-operator",
      resourceId: String(cardOperatorId),
      meta: { id: req.params.id },
    })
    res.status(400).json({ error: "Requisição sem ID!" });
    return;
  }
  try {
    const before = await getCardOperatorForId(cardOperatorId);
    const updateCOperator = await delCardOperator(
      parseInt(cardOperatorId),
    );
    if (!updateCOperator) {
      await createLog({
        level: "ERROR",
        action: "DELETE_CARD_OPERATOR",
        message: "Erro ao Editar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "card-operator",
        resourceId: String(cardOperatorId),
        meta: { before: sanitizeCardOperator(before) },
      })
      res.status(400).json({ error: "Erro ao Editar!" });
      return;
    }
    const metaBefore = sanitizeCardOperator(before);
    const metaAfter = sanitizeCardOperator(updateCOperator);
    await createLog({
      level: "INFO",
      action: "DELETE_CARD_OPERATOR",
      message: "Sucesso ao Editar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: "card-operator",
      resourceId: String(cardOperatorId),
      meta: {
        before: metaBefore,
        after: metaAfter,
        changed: diffObjects(metaBefore || {}, metaAfter || {}),
      },
    })
    res.status(201).json({ cardOperator: updateCOperator });
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "DELETE_CARD_OPERATOR",
      message: "Erro ao Editar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "card-operator",
      resourceId: String(cardOperatorId),
      meta: { error: String(error) },
    })
    res.status(400).json({ error: "Erro ao Editar!" });
    return
  }
};

