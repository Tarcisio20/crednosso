import { RequestHandler } from "express";
import { getAllAtmMonitoring } from "services/atm-mapping";
import { createLog } from "services/logService";

export const getAllAMonitoringin: RequestHandler = async (req, res) => {
  //   const page = parseInt(req.query.page as string) || 1;
  //   const pageSize = parseInt(req.query.pageSize as string) || 15;
  //   const skip = (page - 1) * pageSize;

  const date = req.params.date

  if (!date) {
    await createLog({
      level: 'ERROR',
      action: 'GET_ALL_ATM_MONITORING',
      message: 'Preciso de uma data para continuar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'atm-monitoring',
      meta: {}
    })
    res.status(400).json({ error: 'Preciso de uma data para continuar!' })
    return
  }
  try {
    const atmMonitoring = await getAllAtmMonitoring(date)

    if (!atmMonitoring) {
      await createLog({
        level: 'ERROR',
        action: 'GET_ALL_ATM_MONITORING',
        message: 'Erro ao carregar monitoramento de ATMs',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 500,
        resource: 'atm-monitoring',
        meta: {}
      })

      res.status(500).json({ error: 'Erro ao carregar!' })
      return
    }

    await createLog({
      level: 'INFO',
      action: 'GET_ALL_ATM_MONITORING',
      message: 'Sucesso ao carregar monitoramento de ATMs',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: 'atm-monitoring',
      meta: {
      },
    })
    res.status(200).json({ atmMonitoring })
    return

  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'GET_ALL_ATM_MONITORING',
      message: 'Erro ao carregar monitoramento de ATMs',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 500,
      resource: 'atm-monitoring',
      meta: { error: String(error) },
    })
    res.status(500).json({ error: 'Erro ao carregar!' })
    return
  }
}
