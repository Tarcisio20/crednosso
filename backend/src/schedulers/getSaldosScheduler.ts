import cron from "node-cron";
import { runGetSaldosSchedulerFlow } from "./getSaldosSchedulerFlow"; 
import { prisma } from "../utils/prisma";

let schedulerStarted = false;

const TIMEZONE = process.env.TZ || "America/Sao_Paulo";

function getDataSaoPaulo() {
  const now = new Date();

  const formatter = new Intl.DateTimeFormat("pt-BR", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);

  const get = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value);

  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
    second: get("second"),
  };
}

function getDataHoraSaoPaulo(hora: number, minuto = 0, segundo = 0) {
  const data = getDataSaoPaulo();

  return new Date(
    `${data.year}-${String(data.month).padStart(2, "0")}-${String(data.day).padStart(2, "0")}T${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}:${String(segundo).padStart(2, "0")}-03:00`
  );
}

async function jaRodouNaJanela(horaAgendada: number) {
  const inicio = getDataHoraSaoPaulo(horaAgendada, 0, 0);

  const proximaHora =
    horaAgendada === 6
      ? getDataHoraSaoPaulo(12, 0, 0)
      : getDataHoraSaoPaulo(23, 59, 59);

  const total = await prisma.atmMonitoring.count({
    where: {
      createdAt: {
        gte: inicio,
        lte: proximaHora,
      },
    },
  });

  return total > 0;
}

async function executarSeHorarioFoiPerdido() {
  const dataSP = getDataSaoPaulo();

  let horaAgendadaPerdida: number | null = null;

  if (dataSP.hour >= 12) {
    horaAgendadaPerdida = 12;
  } else if (dataSP.hour >= 6) {
    horaAgendadaPerdida = 6;
  }

  if (!horaAgendadaPerdida) {
    console.log("[GET SALDOS] Ainda não passou de nenhum horário agendado. Aguardando cron.");
    return;
  }

  const rodouNaJanela = await jaRodouNaJanela(horaAgendadaPerdida);

  if (rodouNaJanela) {
    console.log(`[GET SALDOS] Já existe coleta da janela das ${horaAgendadaPerdida}:00. Não será executado ao iniciar.`);
    return;
  }

  console.log(`[GET SALDOS] Backend iniciou após ${horaAgendadaPerdida}:00 e ainda não rodou essa janela. Executando agora.`);

  await runGetSaldosSchedulerFlow();
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

  const cronExpression = process.env.GET_SALDOS_CRON || "0 6,12 * * *";

  if (!cron.validate(cronExpression)) {
    console.error(`[GET SALDOS] Cron inválido: ${cronExpression}`);
    return;
  }

  console.log(`[GET SALDOS] Scheduler iniciado. Cron: ${cronExpression}`);
  console.log(`[GET SALDOS] Timezone: ${TIMEZONE}`);

  cron.schedule(
    cronExpression,
    async () => {
      try {
        console.log("[GET SALDOS] Horário do agendamento atingido.");

        await runGetSaldosSchedulerFlow();
      } catch (error) {
        console.error("[GET SALDOS] Erro inesperado no scheduler:", error);
      }
    },
    {
      timezone: TIMEZONE,
    }
  );

  executarSeHorarioFoiPerdido().catch((error) => {
    console.error("[GET SALDOS] Erro ao verificar execução perdida:", error);
  });
}