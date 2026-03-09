import { RequestHandler } from "express";
import { addTypeStore, deleteTypeStore, getAllTypeStores, getAllTypeStoresPagination, getTypeStoreBySlug, getTypeStoreForId, updateTypeStore } from "../services/typeStore";
import { typeStoreAddSchema } from "../schemas/typeStoreAddSchema";
import { createLog } from "services/logService";
import { generateBaseSlug } from "utils/generateBaseSlug";

export const getAll: RequestHandler = async (req, res) => {
  try {
    const typeStore = await getAllTypeStores();
    if (!typeStore) {
      await createLog({
        level: "ERROR",
        action: "GET_ALL_TYPE_STORE",
        message: "Erro ao carregar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 401,
        resource: "typeStore",
        meta: { error: "Erro ao carregar!" },
      })
      res.status(401).json({ error: "Erro ao carregar!" });
      return;
    }
    await createLog({
      level: "INFO",
      action: "GET_ALL_TYPE_STORE",
      message: "Sucesso ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "typeStore",
      meta: { message: "Sucesso ao carregar!" },
    })
    res.status(200).json({ typeStore });
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_ALL_TYPE_STORE",
      message: "Erro ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "typeStore",
      meta: { error: "Erro ao carregar!" },
    })
  }

};

export const getAllPagination: RequestHandler = async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 15;
  const skip = (page - 1) * pageSize;
  try {
    const typeStore = await getAllTypeStoresPagination(page, pageSize);
    if (!typeStore) {
      await createLog({
        level: "ERROR",
        action: "GET_ALL_TYPE_STORE_PAGINATION",
        message: "Erro ao carregar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 401,
        resource: "typeStore",
        meta: { error: "Erro ao carregar!" },
      })
      res.status(401).json({ error: "Erro ao carregar!" });
      return;
    }
    await createLog({
      level: "INFO",
      action: "GET_ALL_TYPE_STORE_PAGINATION",
      message: "Sucesso ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "typeStore",
      meta: { message: "Sucesso ao carregar!" },
    })
    res.status(200).json({ typeStore });
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_ALL_TYPE_STORE_PAGINATION",
      message: "Erro ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "typeStore",
      meta: { error: "Erro ao carregar!" },
    })
    res.status(401).json({ error: "Erro ao carregar!" });
    return
  }
};

const generateUniqueSlug = async (name: string): Promise<string> => {
  const baseSlug = generateBaseSlug(name);

  let slug = baseSlug;
  let count = 1;

  while (true) {
    const exists = await getTypeStoreBySlug(slug);

    if (!exists) {
      return slug;
    }

    slug = `${baseSlug}_${count}`;
    count++;
  }
};


export const add: RequestHandler = async (req, res) => {
  const safeData = typeStoreAddSchema.safeParse(req.body);

  if (!safeData.success) {
    await createLog({
      level: "ERROR",
      action: "ADD_TYPE_STORE",
      message: "Erro ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "typeStore",
      meta: { error: safeData.error.flatten().fieldErrors },
    });

    res.status(400).json({ error: safeData.error.flatten().fieldErrors });
    return;
  }

  try {
    const slug = await generateUniqueSlug(safeData.data.name);

    const newTStore = await addTypeStore({
      name: safeData.data.name,
      slug,
    });

    if (!newTStore) {
      await createLog({
        level: "ERROR",
        action: "ADD_TYPE_STORE",
        message: "Erro ao salvar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 500,
        resource: "typeStore",
        meta: { error: "Erro ao salvar!" },
      });

      res.status(500).json({ error: "Erro ao salvar!" });
      return;
    }

    await createLog({
      level: "INFO",
      action: "ADD_TYPE_STORE",
      message: "Sucesso ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: "typeStore",
      meta: { message: "Sucesso ao salvar!" },
    });

    res.status(201).json({ typeStore: newTStore });
    return;
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "ADD_TYPE_STORE",
      message: "Erro ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 500,
      resource: "typeStore",
      meta: {
        error: error instanceof Error ? error.message : "Erro ao salvar!",
      },
    });

    res.status(500).json({ error: "Erro ao salvar!" });
    return;
  }
};

export const getById: RequestHandler = async (req, res) => {
  const typeStoreId = req.params.id;
  if (!typeStoreId || isNaN(parseInt(typeStoreId))) {
    await createLog({
      level: "ERROR",
      action: "GET_TYPE_STORE_BY_ID",
      message: "Requisição sem ID!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "typeStore",
      meta: { error: "Requisição sem ID!" },
    })
    res.status(401).json({ error: "Requisição sem ID!" });
    return
  }
  try {
    const typeStore = await getTypeStoreForId(typeStoreId);
    if (!typeStore) {
      await createLog({
        level: "ERROR",
        action: "GET_TYPE_STORE_BY_ID",
        message: "Erro ao salvar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 401,
        resource: "typeStore",
        meta: { error: "Erro ao salvar!" },
      })
      res.status(401).json({ error: "Erro ao salvar!" });
      return;
    }
    await createLog({
      level: "INFO",
      action: "GET_TYPE_STORE_BY_ID",
      message: "Sucesso ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "typeStore",
      meta: { message: "Sucesso ao salvar!" },
    })
    res.status(200).json({ typeStore });
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_TYPE_STORE_BY_ID",
      message: "Erro ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "typeStore",
      meta: { error: "Erro ao salvar!" },
    })
    res.status(401).json({ error: "Erro ao salvar!" });
    return
  }
};

export const update: RequestHandler = async (req, res) => {
  const typeStoreId = req.params.id;
  if (!typeStoreId || isNaN(parseInt(typeStoreId))) {
    await createLog({
      level: 'ERROR',
      action: 'UPDATE_TYPE_STORE',
      message: 'Requisição sem ID!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: 'typeStore',
      meta: { error: 'Requisição sem ID!' },
    })
    res.status(401).json({ error: 'Requisição sem ID!' });
    return
  }
  const safeData = typeStoreAddSchema.safeParse(req.body);
  if (!safeData.success) {
    await createLog({
      level: "ERROR",
      action: "UPDATE_TYPE_STORE",
      message: "Erro ao Editar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "typeStore",
      meta: { error: safeData.error.flatten().fieldErrors },
    })
    res.json({ error: safeData.error.flatten().fieldErrors });
    return;
  }
  try {
    const updateType = await updateTypeStore(
      parseInt(typeStoreId),
      safeData.data
    );
    if (!updateType) {
      await createLog({
        level: "ERROR",
        action: "UPDATE_TYPE_STORE",
        message: "Erro ao Editar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 401,
        resource: "typeStore",
        meta: { error: "Erro ao Editar!" },
      })
      res.status(401).json({ error: "Erro ao Editar!" });
      return;
    }
    await createLog({
      level: "INFO",
      action: "UPDATE_TYPE_STORE",
      message: "Sucesso ao Editar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "typeStore",
      meta: { message: "Sucesso ao Editar!" },
    })
    res.status(200).json({ typeStore: updateType });
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "UPDATE_TYPE_STORE",
      message: "Erro ao Editar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "typeStore",
      meta: { error: "Erro ao Editar!" },
    })
    res.status(401).json({ error: "Erro ao Editar!" });
    return
  }
};

export const del: RequestHandler = async (req, res) => {
  const typeStoreId = req.params.id;
  if (!typeStoreId || isNaN(parseInt(typeStoreId))) {
    await createLog({
      level: 'ERROR',
      action: 'DELETE_TYPE_STORE',
      message: 'Requisição sem ID!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: 'typeStore',
      meta: { error: 'Requisição sem ID!' },
    })
    res.status(401).json({ error: 'Requisição sem ID!' });
    return
  }
  const safeData = typeStoreAddSchema.safeParse(req.body);
  if (!safeData.success) {
    await createLog({
      level: "ERROR",
      action: "DELETE_TYPE_STORE",
      message: "Erro ao Excluir!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "typeStore",
      meta: { error: safeData.error.flatten().fieldErrors },
    })
    res.json({ error: safeData.error.flatten().fieldErrors });
    return;
  }
  try {
    const deleteType = await deleteTypeStore(parseInt(typeStoreId));
    if (!deleteType) {
      await createLog({
        level: "ERROR",
        action: "DELETE_TYPE_STORE",
        message: "Erro ao Excluir!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 401,
        resource: "typeStore",
        meta: { error: "Erro ao Excluir!" },
      })
      res.status(401).json({ error: "Erro ao Excluir!" });
      return;
    }
    await createLog({
      level: "INFO",
      action: "DELETE_TYPE_STORE",
      message: "Sucesso ao Excluir!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "typeStore",
      meta: { message: "Sucesso ao Excluir!" },
    })
    res.status(200).json({ typeStore: deleteType });
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "DELETE_TYPE_STORE",
      message: "Erro ao Excluir!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "typeStore",
      meta: { error: "Erro ao Excluir!" },
    })
    res.status(401).json({ error: "Erro ao Excluir!" });
    return
  }
};

