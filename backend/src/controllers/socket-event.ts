import { Request, Response } from 'express';
import { createLog } from 'services/logService';

let ioInstance: any = null;

export const setIO = (io: any) => {
  ioInstance = io;
};

export const notifyScheduler = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!ioInstance) {
      await createLog({
        level: "ERROR",
        action: "NOTIFY_SCHEDULER",
        message: "Socket.IO nao inicializado",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "socket",
      })
      res.status(400).json({ erro: "Socket.IO não inicializado" });
      return;
    }
    const event = "tarefa_iniciada";
    const payload = { mensagem: "Processo iniciado pelo Agendador!" };
    await createLog({
      level: "INFO",
      action: "NOTIFY_SCHEDULER",
      message: "Emitindo evento tarefa_iniciada",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "socket",
      meta: { event, payload },
    })
    console.log("✅ Emitindo evento tarefa_iniciada");
    ioInstance.emit("tarefa_iniciada", {
      mensagem: "Processo iniciado pelo Agendador!",
    });
    res.status(200).sendStatus(200);
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "NOTIFY_SCHEDULER",
      message: "Erro ao emitir socket",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "socket",
      meta: { error: String(error) },
    })
    console.error("Erro ao emitir socket:", error);
    res.status(400).json({ erro: "Erro interno ao emitir evento" });
    return
  }
};

export const notifyFinished = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!ioInstance) {
      await createLog({
        level: "ERROR",
        action: "NOTIFY_FINISHED",
        message: "Socket.IO nao inicializado",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "socket",
      })
      res.status(400).json({ erro: "Socket.IO não inicializado" });
      return;
    }
    const event = "tarefa_finalizada";
    const payload = { mensagem: "Processo finalizado com sucesso!" };
    await createLog({
      level: "INFO",
      action: "NOTIFY_FINISHED",
      message: "Emitindo evento tarefa_finalizada",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "socket",
      meta: { event, payload },
    })
    console.log("✅ Emitindo evento tarefa_finalizada");
    ioInstance.emit("tarefa_finalizada", {
      mensagem: "Processo finalizado com sucesso!",
    });
    res.status(200).sendStatus(200);
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "NOTIFY_FINISHED",
      message: "Erro ao emitir socket (finalizado)",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "socket",
      meta: { error: String(error) },
    })
    console.error("Erro ao emitir socket (finalizado):", error);
    res.status(400).json({ erro: "Erro interno ao emitir evento de finalização" });
    return
  }
};

export const notifySchedulerError = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!ioInstance) {
      await createLog({
        level: "ERROR",
        action: "NOTIFY_SCHEDULER_ERROR",
        message: "Socket.IO nao inicializado",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "socket",
      })
      res.status(400).json({ erro: "Socket.IO não inicializado" });
      return;
    }
    const event = "tarefa_erro";
    const payload = { mensagem: "❌ Ocorreu um erro durante a execução do processo!" };
    await createLog({
      level: "ERROR",
      action: "NOTIFY_SCHEDULER_ERROR",
      message: "Emitindo evento tarefa_erro",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "socket",
      meta: { event, payload },
    })
    console.log("❌ Emitindo evento tarefa_erro");
    ioInstance.emit("tarefa_erro", {
      mensagem: "❌ Ocorreu um erro durante a execução do processo!",
    });
    res.status(200).sendStatus(200);
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "NOTIFY_SCHEDULER_ERROR",
      message: "Erro ao emitir socket (erro)",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "socket",
      meta: { error: String(error) },
    })
    console.log("❌Erro ao emitir socket (erro):", error);
    res.status(400).json({ erro: "Erro interno ao emitir evento de erro" });
    return
  }
};

