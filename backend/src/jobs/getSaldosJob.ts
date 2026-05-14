import { runGetSaldosAtmsCron } from "../script/get-saldos";

let isRunning = false;

export async function runGetSaldosJob(
  origin: "scheduler" | "manual" = "scheduler"
) {
  if (isRunning) {
    console.log("[GET SALDOS] Já existe uma execução em andamento.");

    return {
      success: false,
      message: "Job get-saldos já está em execução.",
    };
  }

  isRunning = true;

  try {
    console.log(`[GET SALDOS] Iniciando execução. Origem: ${origin}`);

    const result = await runGetSaldosAtmsCron();

    console.log("[GET SALDOS] Job finalizado:", result);

    return result;
  } catch (error) {
    console.error("[GET SALDOS] Erro ao executar job:", error);

    return {
      success: false,
      message: "Erro ao executar job get-saldos.",
      error,
    };
  } finally {
    isRunning = false;
  }
}