import { RequestHandler } from "express";
import { typeSupplyAddSchema } from "../schemas/typeSupplyAddSchema";
import {
  addTypeSupply,
  getAllTypeSupply,
  getAllTypeSupplyPagination,
  getTypeSupplyForId,
  updateTypeSupply,
} from "../services/typeSupply";
import { createLog } from "services/logService";

export const getAll: RequestHandler = async (req, res) => {
  try {
    const typeSupply = await getAllTypeSupply();
    if (!typeSupply) {
      await createLog({
        level: "ERROR",
        action: "GET_ALL_TYPE_SUPPLY",
        message: "Erro ao carregar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 401,
        resource: "typeSupply",
        meta: { error: "Erro ao carregar!" },
      })
      res.status(401).json({ error: "Erro ao carregar!" });
      return;
    }
    await createLog({
      level: "INFO",
      action: "GET_ALL_TYPE_SUPPLY",
      message: "Sucesso ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "typeSupply",
      meta: { message: "Sucesso ao carregar!" },
    })
    res.status(200).json({ typeSupply });
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_ALL_TYPE_SUPPLY",
      message: "Erro ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "typeSupply",
      meta: { error: "Erro ao carregar!" },
    })
    res.status(401).json({ error: "Erro ao carregar!" });
    return
  }
};

export const getAllPagination: RequestHandler = async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 15;
  const skip = (page - 1) * pageSize;
  try {
    const typeSupply = await getAllTypeSupplyPagination(page, pageSize);
    if (!typeSupply) {
      await createLog({
        level: "ERROR",
        action: "GET_ALL_TYPE_SUPPLY_PAGINATION",
        message: "Erro ao carregar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 401,
        resource: "typeSupply",
        meta: { error: "Erro ao carregar!" },
      })
      res.status(401).json({ error: "Erro ao carregar!" });
      return;
    }
    await createLog({
      level: "INFO",
      action: "GET_ALL_TYPE_SUPPLY_PAGINATION",
      message: "Sucesso ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "typeSupply",
      meta: { message: "Sucesso ao carregar!" },
    })
    res.status(200).json({ typeSupply });
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_ALL_TYPE_SUPPLY_PAGINATION",
      message: "Erro ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "typeSupply",
      meta: { error: "Erro ao carregar!" },
    })
    res.status(401).json({ error: "Erro ao carregar!" });
    return
  }
};

export const getById: RequestHandler = async (req, res) => {
  const typeSupplyId = req.params.id;
  if (!typeSupplyId || isNaN(parseInt(typeSupplyId))) {
    await createLog({
      level: "ERROR",
      action: "GET_TYPE_SUPPLY_BY_ID",
      message: "Requisição sem ID!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "typeSupply",
      meta: { error: "Requisição sem ID!" },
    })
    res.status(401).json({ error: "Requisição sem ID!" });
    return
  }
  try {
    const typeSupply = await getTypeSupplyForId(typeSupplyId);
    if (!typeSupply) {
      await createLog({
        level: "ERROR",
        action: "GET_TYPE_SUPPLY_BY_ID",
        message: "Erro ao carregar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 401,
        resource: "typeSupply",
        meta: { error: "Erro ao carregar!" },
      })
      res.status(401).json({ error: "Erro ao salvar!" });
      return;
    }
    await createLog({
      level: "INFO",
      action: "GET_TYPE_SUPPLY_BY_ID",
      message: "Sucesso ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "typeSupply",
      meta: { message: "Sucesso ao carregar!" },
    })
    res.status(200).json({ typeSupply });
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_TYPE_SUPPLY_BY_ID",
      message: "Erro ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "typeSupply",
      meta: { error: "Erro ao carregar!" },
    })
    res.status(401).json({ error: "Erro ao carregar!" });
    return
  }
};

export const add: RequestHandler = async (req, res) => {
  const safeData = typeSupplyAddSchema.safeParse(req.body);
  if (!safeData.success) {
    await createLog({
      level: "ERROR",
      action: "ADD_TYPE_SUPPLY",
      message: "Erro ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "typeSupply",
      meta: { error: safeData.error.flatten().fieldErrors },
    })
    res.json({ error: safeData.error.flatten().fieldErrors });
    return;
  }
  try {
    const newTSupply = await addTypeSupply({
      name: safeData.data.name,
    });
    if (!newTSupply) {
      await createLog({
        level: "ERROR",
        action: "ADD_TYPE_SUPPLY",
        message: "Erro ao salvar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 401,
        resource: "typeSupply",
        meta: { error: "Erro ao salvar!" },
      })
      res.status(401).json({ error: "Erro ao salvar!" });
      return;
    }
    await createLog({
      level: "INFO",
      action: "ADD_TYPE_SUPPLY",
      message: "Sucesso ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "typeSupply",
      meta: { message: "Sucesso ao salvar!" },
    })
    res.status(200).json({ typeSupply: newTSupply });
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "ADD_TYPE_SUPPLY",
      message: "Erro ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "typeSupply",
      meta: { error: "Erro ao salvar!" },
    })
    res.status(401).json({ error: "Erro ao salvar!" });
    return
  }
};

export const update: RequestHandler = async (req, res) => {
  const typeSupplyId = req.params.id;
  if (!typeSupplyId || isNaN(parseInt(typeSupplyId))) {
    await createLog({
      level: "ERROR",
      action: "UPDATE_TYPE_SUPPLY",
      message: "Requisição sem ID!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "typeSupply",
      meta: { error: "Requisição sem ID!" },
    })
    res.status(401).json({ error: "Requisição sem ID!" });
    return
  }
  const safeData = typeSupplyAddSchema.safeParse(req.body);
  if (!safeData.success) {
    await createLog({
      level: "ERROR",
      action: "UPDATE_TYPE_SUPPLY",
      message: "Erro ao Editar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "typeSupply",
      meta: { error: safeData.error.flatten().fieldErrors },
    })
    res.json({ error: safeData.error.flatten().fieldErrors });
    return;
  }
  try {
    const updateType = await updateTypeSupply(
      parseInt(typeSupplyId),
      safeData.data
    );
    if (!updateType) {
      await createLog({
        level: "ERROR",
        action: "UPDATE_TYPE_SUPPLY",
        message: "Erro ao Editar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 401,
        resource: "typeSupply",
        meta: { error: "Erro ao Editar!" },
      })
      res.status(401).json({ error: "Erro ao Editar!" });
      return;
    }
    await createLog({
      level: "INFO",
      action: "UPDATE_TYPE_SUPPLY",
      message: "Sucesso ao Editar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "typeSupply",
      meta: { message: "Sucesso ao Editar!" },
    })
    res.status(200).json({ typeSupply: updateType });
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "UPDATE_TYPE_SUPPLY",
      message: "Erro ao Editar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "typeSupply",
      meta: { error: "Erro ao Editar!" },
    })
    res.status(401).json({ error: "Erro ao Editar!" });
    return
  }
};
