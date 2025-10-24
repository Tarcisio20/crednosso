import { RequestHandler } from "express"
import { getAllBank } from "../services/bank"
import { createLog } from "services/logService"
import { sanitizeBankListForLog } from "utils/audit/audit-bank"

export const getAll: RequestHandler = async (req, res) => {
  try {
    const bank = await getAllBank()
    if (!bank) {
      await createLog({
        level: 'ERROR',
        action: 'GET_ALL_BANK',
        message: 'Erro ao carregar bancos',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: 'bank',
        meta: { result: null }, // não há dados, então só sinaliza
      })
      res.status(400).json({ error: 'Erro ao carregar!' })
      return
    }
    await createLog({
      level: 'INFO',
      action: 'GET_ALL_BANK',
      message: 'Sucesso ao carregar bancos',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: 'bank',
      meta: sanitizeBankListForLog(bank, 20), // count + sample (até 20 itens)
    })
    res.status(201).json({ bank })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'GET_ALL_BANK',
      message: 'Erro ao carregar bancos',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'bank',
      meta: { error: String((error as any)?.message ?? error) },
    })
    res.status(400).json({ error: 'Erro ao carregar!' })
    return
  }
}