import type { RequestHandler } from "express";

export const webhook: RequestHandler = async (req, res) => {
  try {
    console.log("[TELEGRAM][WEBHOOK] body:", JSON.stringify(req.body, null, 2));
    res.sendStatus(200);
  } catch (error) {
    console.log("[TELEGRAM][WEBHOOK] erro:", error);
    res.sendStatus(500);
  }
};