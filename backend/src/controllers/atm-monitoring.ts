import { randomUUID } from "crypto";
import { RequestHandler } from "express";
import { runGetSaldosJob } from "jobs/getSaldosJob";
import { getAllAtmMonitoring } from "services/atm-mapping";
import { createLog } from "services/logService";
import { getIO } from "utils/socket-event";

export const getAllAMonitoringin: RequestHandler = async (req, res) => {
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

let updateAtmMonitoringManualRunning = false;
let updateAtmMonitoringManualJobId: string | null = null;
let updateAtmMonitoringManualStartedAt: Date | null = null;
let updateAtmMonitoringManualFinishedAt: Date | null = null;
let updateAtmMonitoringManualMessage = "";

export const updateAtmMonitoringManual: RequestHandler = async (req, res) => {
  const io = getIO();
  const jobId = randomUUID();

  try {
    if (updateAtmMonitoringManualRunning) {
      res.status(409).json({
        success: false,
        message: "Atualização de saldos já está em execução.",
        jobId: updateAtmMonitoringManualJobId,
      });
      return;
    }

    updateAtmMonitoringManualRunning = true;
    updateAtmMonitoringManualJobId = jobId;
    updateAtmMonitoringManualStartedAt = new Date();
    updateAtmMonitoringManualFinishedAt = null;
    updateAtmMonitoringManualMessage = "Atualização de saldos iniciada.";

    res.status(202).json({
      success: true,
      message: "Atualização de saldos iniciada.",
      jobId,
    });

    io.emit("get-saldos:started", {
      jobId,
      message: "Atualização de saldos iniciada.",
    });

    runGetSaldosJob("manual", {
      jobId,
      onProgress: (payload) => {
        updateAtmMonitoringManualMessage =
          payload?.message || "Atualização de saldos em andamento.";

        io.emit("get-saldos:progress", {
          jobId,
          ...payload,
        });
      },
    })
      .then(async (result) => {
        updateAtmMonitoringManualRunning = false;
        updateAtmMonitoringManualJobId = null;
        updateAtmMonitoringManualFinishedAt = new Date();
        updateAtmMonitoringManualMessage = "Atualização de saldos finalizada.";

        io.emit("get-saldos:finished", {
          jobId,
          success: true,
          message: "Atualização de saldos finalizada.",
          result,
        });

        await createLog({
          level: "INFO",
          action: "UPDATE_ATM_MONITORING_MANUAL",
          message: "Sucesso ao atualizar monitoramento de ATMs manualmente",
          userSlug: req.userSlug ?? null,
          route: req.route?.path ?? null,
          method: req.method ?? null,
          statusCode: 200,
          resource: "atm-monitoring",
          meta: {
            jobId,
            result,
          },
        });
      })
      .catch(async (error) => {
        updateAtmMonitoringManualRunning = false;
        updateAtmMonitoringManualJobId = null;
        updateAtmMonitoringManualFinishedAt = new Date();
        updateAtmMonitoringManualMessage = "Erro ao atualizar saldos.";

        io.emit("get-saldos:error", {
          jobId,
          success: false,
          message: "Erro ao atualizar saldos.",
          error: String(error),
        });

        await createLog({
          level: "ERROR",
          action: "UPDATE_ATM_MONITORING_MANUAL",
          message: "Erro ao atualizar monitoramento de ATMs manualmente",
          userSlug: req.userSlug ?? null,
          route: req.route?.path ?? null,
          method: req.method ?? null,
          statusCode: 500,
          resource: "atm-monitoring",
          meta: {
            jobId,
            error: String(error),
          },
        });
      });
  } catch (error) {
    updateAtmMonitoringManualRunning = false;
    updateAtmMonitoringManualJobId = null;
    updateAtmMonitoringManualFinishedAt = new Date();
    updateAtmMonitoringManualMessage = "Erro ao iniciar atualização de saldos.";

    res.status(500).json({
      success: false,
      message: "Erro ao iniciar atualização de saldos.",
      error: String(error),
    });
  }
};
export const getStatusUpdateManual: RequestHandler = async (req, res) => {
  try {
    res.status(200).json({
      running: updateAtmMonitoringManualRunning,
      jobId: updateAtmMonitoringManualJobId,
      startedAt: updateAtmMonitoringManualStartedAt,
      finishedAt: updateAtmMonitoringManualFinishedAt,
      message: updateAtmMonitoringManualMessage,
    });

    return;
  } catch (error) {
    res.status(500).json({
      running: false,
      jobId: null,
      startedAt: null,
      finishedAt: null,
      message: "Erro ao consultar status da atualização manual.",
      error: String(error),
    });

    return;
  }
};