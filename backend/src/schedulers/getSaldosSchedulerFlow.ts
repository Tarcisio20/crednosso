import { runGetSaldosJob } from "jobs/getSaldosJob";
import { runAtmServiceOrderJob } from "jobs/getSaldoOsJob";

let isRunningScheduledFlow = false;

function resultSuccess(result: unknown): boolean {
  if (!result || typeof result !== "object") {
    return false;
  }

  if ("success" in result) {
    return Boolean((result as { success?: boolean }).success);
  }

  if ("ok" in result) {
    return Boolean((result as { ok?: boolean }).ok);
  }

  return false;
}

export async function runGetSaldosSchedulerFlow() {
  if (isRunningScheduledFlow) {
    const message = "Fluxo agendado já está em execução.";

    console.log(`[GET SALDOS SCHEDULER FLOW] ${message}`);

    return {
      success: false,
      blocked: true,
      message,
      saldos: null,
      atmServiceOrder: null,
    };
  }

  isRunningScheduledFlow = true;

  try {
    console.log("[GET SALDOS SCHEDULER FLOW] Iniciando fluxo agendado.");

    const saldosResult = await runGetSaldosJob("scheduler");

    const saldosSuccess = resultSuccess(saldosResult);

    if (!saldosSuccess) {
      console.log(
        "[GET SALDOS SCHEDULER FLOW] Get saldos não executou com sucesso. Bot de ordens não será executado."
      );

      return {
        success: false,
        blocked: false,
        message: "Get saldos não executou com sucesso.",
        saldos: saldosResult,
        atmServiceOrder: null,
      };
    }

    console.log(
      "[GET SALDOS SCHEDULER FLOW] Get saldos finalizado. Iniciando bot de ordens de serviço."
    );

    const atmServiceOrderResult = await runAtmServiceOrderJob("scheduler");

    const atmServiceOrderSuccess = resultSuccess(atmServiceOrderResult);

    return {
      success: saldosSuccess && atmServiceOrderSuccess,
      blocked: false,
      message: "Fluxo agendado finalizado.",
      saldos: saldosResult,
      atmServiceOrder: atmServiceOrderResult,
    };
  } catch (error) {
    console.error("[GET SALDOS SCHEDULER FLOW] Erro inesperado:", error);

    return {
      success: false,
      blocked: false,
      message: "Erro inesperado no fluxo agendado.",
      saldos: null,
      atmServiceOrder: null,
      error,
    };
  } finally {
    isRunningScheduledFlow = false;
  }
}