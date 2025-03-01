import { RequestHandler } from "express";
import { cardOperatorAddSchema } from "../schemas/cardOperatorAddSchema";
import {
  addCardOperator,
  getCardOperatorForId,
  getForIdTreasury,
  updateCardOperator,
} from "../services/cardOperator";

export const getByIdTreasury: RequestHandler = async (req, res) => {
  const cardOperatorId = req.params.id;
  if (!cardOperatorId) {
    res.status(401).json({ error: "Requisição sem ID!" });
    return;
  }
  const cardOperator = await getForIdTreasury(parseInt(cardOperatorId));
  if (!cardOperator) {
    res.status(401).json({ error: "Erro ao salvar!" });
    return;
  }

  res.json({ cardOperator });
};

export const getById: RequestHandler = async (req, res) => {
  const cardOperatorId = req.params.id;
  const cardOperator = await getCardOperatorForId(cardOperatorId);
  if (!cardOperator) {
    res.status(401).json({ error: "Erro ao salvar!" });
    return;
  }

  res.json({ cardOperator });
};

export const add: RequestHandler = async (req, res) => {
  const safeData = cardOperatorAddSchema.safeParse(req.body);
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors });
    return;
  }
  const newCardOperator = await addCardOperator({
    treasury: {
      connect: { id: safeData.data.id_treasury },
    },
    name: safeData.data.name,
    number_card: safeData.data.number_card,
  });
  if (!newCardOperator) {
    res.status(401).json({ error: "Erro ao salvar!" });
    return;
  }

  res.json({ operatorCard: newCardOperator });
};

export const update: RequestHandler = async (req, res) => {
  const cardOperatorId = req.params.id;
  const safeData = cardOperatorAddSchema.safeParse(req.body);
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors });
    return;
  }
  const updateCOperator = await updateCardOperator(
    parseInt(cardOperatorId),
    safeData.data
  );
  if (!updateCOperator) {
    res.status(401).json({ error: "Erro ao Editar!" });
    return;
  }

  res.json({ cardOperator: updateCOperator });
};
