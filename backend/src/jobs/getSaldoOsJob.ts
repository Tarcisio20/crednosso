import { prisma } from "../utils/prisma";
import { runGetOsOpenAtmsCron } from "script/get-os-open";
// ajuste esse caminho acima para o caminho real do arquivo onde está runGetOsOpenAtmsCron

let isRunning = false;

type RunAtmServiceOrderJobOptions = {
    jobId?: string;
    onProgress?: (payload: {
        etapa: string;
        message: string;
        totalColetado?: number;
        totalSalvo?: number;
        totalErro?: number;
        totalAtms?: number;
        atual?: number;
        atmId?: string;
    }) => void;
};

export async function runAtmServiceOrderJob(
    origem: "scheduler" | "manual",
    options?: RunAtmServiceOrderJobOptions
) {
    if (isRunning) {
        const message = "Já existe uma coleta de ordens de serviço em andamento.";

        console.log(`[ATM SERVICE ORDER] ${message} Origem solicitante: ${origem}`);

        options?.onProgress?.({
            etapa: "bloqueado",
            message,
        });

        return {
            ok: false,
            success: false,
            blocked: true,
            origem,
            message,
            totalColetado: 0,
            totalSalvo: 0,
            totalErro: 0,
        };
    }

    isRunning = true;

    try {
        console.log(`[ATM SERVICE ORDER] Iniciando execução. Origem: ${origem}`);

        options?.onProgress?.({
            etapa: "inicio",
            message: "Iniciando coleta de ordens de serviço...",
        });

        const atms = await prisma.atm.findMany({
            where: {
                status: true,
            },
            select: {
                id_system: true,
            },
            orderBy: {
                id_system: "asc",
            },
        });

        if (atms.length === 0) {
            const message = "Nenhum ATM ativo encontrado para consultar OS.";

            console.log(`[ATM SERVICE ORDER] ${message}`);

            return {
                ok: false,
                success: false,
                blocked: false,
                origem,
                message,
                totalColetado: 0,
                totalSalvo: 0,
                totalErro: 0,
            };
        }

        console.log(`[ATM SERVICE ORDER] Total de ATMs para consultar: ${atms.length}`);

        const result = await runGetOsOpenAtmsCron(
            atms.map((atm) => ({
                id_atm: atm.id_system,
            })),
            {
                onProgress: options?.onProgress,
            }
        );

        if (!result.success || !("save" in result)) {
            return {
                ok: false,
                success: false,
                blocked: false,
                origem,
                message: "Erro ao executar coleta de ordens de serviço.",
                totalColetado: result.totalColetado ?? 0,
                totalSalvo: 0,
                totalErro: 1,
                error: "error" in result ? result.error : null,
            };
        }

        const totalSalvo = result.save.totalSalvo ?? 0;
        const totalErro = result.save.totalErro ?? 0;

        console.log("[ATM SERVICE ORDER] Execução finalizada:", result);

        return {
            ok: true,
            success: true,
            blocked: false,
            origem,
            message: "Coleta de ordens de serviço finalizada com sucesso.",
            totalColetado: result.totalColetado,
            totalSalvo,
            totalErro,
            save: result.save,
        };
    } catch (error) {
        console.error("[ATM SERVICE ORDER] Erro ao executar job:", error);

        options?.onProgress?.({
            etapa: "erro",
            message: "Erro ao executar coleta de ordens de serviço.",
        });

        return {
            ok: false,
            success: false,
            blocked: false,
            origem,
            message: "Erro ao executar coleta de ordens de serviço.",
            totalColetado: 0,
            totalSalvo: 0,
            totalErro: 1,
            error,
        };
    } finally {
        isRunning = false;
    }
}