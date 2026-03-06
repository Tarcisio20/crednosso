import { RequestHandler } from "express"
import { createLog } from "services/logService"
import { getOsOpenInTableForDay } from "services/open-os"

export const getOsOpenForDay: RequestHandler = async (req, res) => {
  const { date } = req.params;

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);

  if (!date) {
    await createLog({
      level: 'ERROR',
      action: 'GET_OS_OPEN_FOR_DAY',
      message: 'Preciso de uma data para continuar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'atm',
    });

    res.status(400).json({ error: 'Preciso de uma data para continuar!' });
    return;
  }

  try {
    const os = await getOsOpenInTableForDay(date, page, limit);

    res.status(200).json({ openos: os });
    return;
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'GET_OS_OPEN_FOR_DAY',
      message: 'Erro ao buscar no banco!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'atm',
    });

    res.status(400).json({ error: 'Erro ao buscar no banco!' });
    return;
  }
};
