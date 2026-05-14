import cron from "node-cron";
import { runGetSaldosJob } from "../jobs/getSaldosJob";
import { prisma } from "../utils/prisma"; // ajuste esse caminho se seu prisma estiver em outro lugar

let schedulerStarted = false;

function getInicioDoDia() {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
}

function getFimDoDia() {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
}

async function jaRodouHoje() {
  const inicio = getInicioDoDia();
  const fim = getFimDoDia();

  const total = await prisma.atmMonitoring.count({
    where: {
      createdAt: {
        gte: inicio,
        lte: fim,
      },
    },
  });

  return total > 0;
}

async function executarSeHorarioFoiPerdido() {
  const now = new Date();

  const horaAtual = now.getHours();
  const minutoAtual = now.getMinutes();

  const passouDasSeis =
    horaAtual > 6 || (horaAtual === 6 && minutoAtual >= 0);

  if (!passouDasSeis) {
    console.log("[GET SALDOS] Ainda não passou das 06:00. Aguardando cron.");
    return;
  }

  const rodouHoje = await jaRodouHoje();

  if (rodouHoje) {
    console.log("[GET SALDOS] Já existe coleta de hoje. Não será executado ao iniciar.");
    return;
  }

  console.log("[GET SALDOS] Backend iniciou após 06:00 e ainda não rodou hoje. Executando agora.");

  await runGetSaldosJob("scheduler");
}

export function startGetSaldosScheduler() {
  if (schedulerStarted) {
    console.log("[GET SALDOS] Scheduler já foi iniciado.");
    return;
  }

  schedulerStarted = true;

  const enabled = process.env.GET_SALDOS_SCHEDULER_ENABLED === "true";

  if (!enabled) {
    console.log("[GET SALDOS] Scheduler desativado pelo .env.");
    return;
  }

  const cronExpression = process.env.GET_SALDOS_CRON || "0 6 * * *";

  if (!cron.validate(cronExpression)) {
    console.error(`[GET SALDOS] Cron inválido: ${cronExpression}`);
    return;
  }

  console.log(`[GET SALDOS] Scheduler iniciado. Cron: ${cronExpression}`);

  cron.schedule(
    cronExpression,
    async () => {
      try {
        console.log("[GET SALDOS] Horário do agendamento atingido.");

        await runGetSaldosJob("scheduler");
      } catch (error) {
        console.error("[GET SALDOS] Erro inesperado no scheduler:", error);
      }
    },
    {
      timezone: "America/Sao_Paulo",
    }
  );

  executarSeHorarioFoiPerdido().catch((error) => {
    console.error("[GET SALDOS] Erro ao verificar execução perdida:", error);
  });
}