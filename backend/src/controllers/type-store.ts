import { RequestHandler } from "express";
import { addTypeStore, deleteTypeStore, getAllTypeStores, getTypeStoreForId, updateTypeStore } from "../services/typeStore";
import { typeStoreAddSchema } from "../schemas/typeStoreAddSchema";

export const getAll: RequestHandler = async (req, res) => {
  const typeStore = await getAllTypeStores();
  if (!typeStore) {
    res.status(401).json({ error: "Erro ao carregar!" });
    return;
  }
  res.json({ typeStore });
};

export const add: RequestHandler = async (req, res) => {
  const safeData = typeStoreAddSchema.safeParse(req.body);
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors });
    return;
  }
  const newTStore = await addTypeStore({
    name: safeData.data.name,
  });
  if (!newTStore) {
    res.status(401).json({ error: "Erro ao salvar!" });
    return;
  }

  res.json({ typeStore: newTStore });
};

export const getById: RequestHandler = async (req, res) => {
  const typeStoreId = req.params.id;
  const typeStore = await getTypeStoreForId(typeStoreId);
  if (!typeStore) {
    res.status(401).json({ error: "Erro ao salvar!" });
    return;
  }

  res.json({ typeStore });
};

export const update: RequestHandler = async (req, res) => {
  const typeStoreId = req.params.id;
  const safeData = typeStoreAddSchema.safeParse(req.body);
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors });
    return;
  }
  const updateType = await updateTypeStore(
    parseInt(typeStoreId),
    safeData.data
  );
  if (!updateType) {
    res.status(401).json({ error: "Erro ao Editar!" });
    return;
  }

  res.json({ typeStore: updateType });
};

export const del : RequestHandler = async (req, res) => {
  const typeStoreId = req.params.id;
  const safeData = typeStoreAddSchema.safeParse(req.body);
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors });
    return;
  }
  const deleteType = await deleteTypeStore(parseInt(typeStoreId));
  if (!deleteType) {
    res.status(401).json({ error: "Erro ao Excluir!" });
    return;
  }

  res.json({ typeStore: deleteType });
};

