import { Request, Response } from 'express';

let ioInstance: any = null;

export const setIO = (io: any) => {
  ioInstance = io;
};

export const notifyScheduler = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!ioInstance) {
      res.status(500).json({ erro: "Socket.IO não inicializado" });
      return;
    }
    console.log("✅ Emitindo evento tarefa_iniciada");
    ioInstance.emit("tarefa_iniciada", {
      mensagem: "Processo iniciado pelo Agendador!",
    });

    res.sendStatus(200);
  } catch (error) {
    console.error("Erro ao emitir socket:", error);
    res.status(500).json({ erro: "Erro interno ao emitir evento" });
  }
};


export const notifyFinished = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!ioInstance) {
      res.status(500).json({ erro: "Socket.IO não inicializado" });
      return;
    }

    console.log("✅ Emitindo evento tarefa_finalizada");
    ioInstance.emit("tarefa_finalizada", {
      mensagem: "Processo finalizado com sucesso!",
    });

    res.sendStatus(200);
  } catch (error) {
    console.error("Erro ao emitir socket (finalizado):", error);
    res.status(500).json({ erro: "Erro interno ao emitir evento de finalização" });
  }
};
export const notifySchedulerError = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!ioInstance) {
      res.status(500).json({ erro: "Socket.IO não inicializado" });
      return;
    }

    console.log("❌ Emitindo evento tarefa_erro");
    ioInstance.emit("tarefa_erro", {
      mensagem: "❌ Ocorreu um erro durante a execução do processo!",
    });

    res.sendStatus(200);
  } catch (error) {
     console.log("❌Erro ao emitir socket (erro):", error);
    res.status(500).json({ erro: "Erro interno ao emitir evento de erro" });
  }
};

