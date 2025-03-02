import { RequestHandler } from "express";
import { typeSupplyAddSchema } from "../schemas/typeSupplyAddSchema";
import {
  addTypeSupply,
  getAllTypeSupply,
  getTypeSupplyForId,
  updateTypeSupply,
} from "../services/typeSupply";

export const getAll: RequestHandler = async (req, res) => {
  const typeSupply = await getAllTypeSupply();
  if (!typeSupply) {
    res.status(401).json({ error: "Erro ao carregar!" });
    return;
  }
  res.json({ typeSupply });
};

export const getById: RequestHandler = async (req, res) => {
  const typeSupplyId = req.params.id;
  const typeSupply = await getTypeSupplyForId(typeSupplyId);
  if (!typeSupply) {
    res.status(401).json({ error: "Erro ao salvar!" });
    return;
  }

  res.json({ typeSupply });
};

export const add: RequestHandler = async (req, res) => {
  const safeData = typeSupplyAddSchema.safeParse(req.body);
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors });
    return;
  }
  const newTSupply = await addTypeSupply({
    name: safeData.data.name,
  });
  if (!newTSupply) {
    res.status(401).json({ error: "Erro ao salvar!" });
    return;
  }

  res.json({ typeSupply: newTSupply });
};

export const update: RequestHandler = async (req, res) => {
  const typeSupplyId = req.params.id;
  const safeData = typeSupplyAddSchema.safeParse(req.body);
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors });
    return;
  }
  const updateType = await updateTypeSupply(
    parseInt(typeSupplyId),
    safeData.data
  );
  if (!updateType) {
    res.status(401).json({ error: "Erro ao Editar!" });
    return;
  }

  res.json({ typeSupply: updateType });
};
