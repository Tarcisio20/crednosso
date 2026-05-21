import { runGetSaldosAtmsCron } from "../script/get-saldos";

let isRunning = false;

type RunGetSaldosJobOptions = {
  jobId?: string;
  onProgress?: (payload: {
    etapa: string;
    message: string;
    totalColetado?: number;
    totalSalvo?: number;
    totalErro?: number;
  }) => void;
};

export async function runGetSaldosJob(
  origem: "scheduler" | "manual",
  options?: RunGetSaldosJobOptions
) {
  try {
    options?.onProgress?.({
      etapa: "inicio",
      message: "Iniciando coleta de saldos.",
    });

    const result = await runGetSaldosAtmsCron({
      onProgress: options?.onProgress,
    });

    options?.onProgress?.({
      etapa: "finalizando",
      message: "Finalizando atualização de saldos.",
      totalColetado: result?.totalColetado ?? 0,
    });

    return result;
  } catch (error) {
    console.error("[GET SALDOS] Erro no job:", error);
    throw error;
  }
}