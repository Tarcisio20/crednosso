import { RequestHandler } from "express"
import { getForIdTreasury } from "services/cardOperator";
import { sendEmailOnOS } from "services/email";
import { createLog } from "services/logService"
import { addOs, getAllOsOpenInTableForDay, getOsForId, getOsOpenInTableForDay, updateOS } from "services/os-open";
import { runPythonScript } from "utils/runOpenOsPython";
import { getIO } from "utils/socket-event";
import { v4 as uuid } from "uuid";
import { getForId as getAtm } from "services/atm";
import { getForIdSystem as getOperadorCard } from "services/treasury";


export const getOsOpenForDay: RequestHandler = async (req, res) => {
  const { date } = req.params;

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);

  if (!date) {
    await createLog({
      level: 'ERROR',
      action: 'GET_OS_OPEN_FOR_DAY',
      message: 'Preciso de uma data para continuar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'atm',
    });

    res.status(400).json({ error: 'Preciso de uma data para continuar!' });
    return;
  }

  try {
    const os = await getOsOpenInTableForDay(date, page, limit);

    res.status(200).json({ openos: os });
    return;
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'GET_OS_OPEN_FOR_DAY',
      message: 'Erro ao buscar no banco!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'atm',
    });

    res.status(400).json({ error: 'Erro ao buscar no banco!' });
    return;
  }
};

export const getAllById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    await createLog({
      level: 'ERROR',
      action: 'GET_OS_BY_ID',
      message: 'Preciso de um ID para continuar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'atm',
    });
    res.status(400).json({ error: 'Preciso de uma id para continuar!' });
    return;
  }

  try {
    const os = await getOsForId(Number(id));
    res.status(200).json({ openos: os });
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'GET_OS_BY_ID',
      message: 'Erro ao buscar no banco!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'atm',
      resourceId: String(id)
    })
    res.status(400).json({ error: 'Erro ao retornar OS do banco!' });
    return;
  }

}

type AddOsAutomationBody = {
  job_id?: string;
  socket_id?: string | null;

  id_supply?: number;
  id_treasury?: number;
  treasury_name?: string;
  date_on_supply?: string;

  id_atm?: number;
  atm_name?: string;
  terminal?: string | number;

  total_exchange?: boolean;
  troca_total?: "S" | "N" | string;

  cassete_A?: number;
  cassete_B?: number;
  cassete_C?: number;
  cassete_D?: number;

  emails?: string[];
  operator_card?: string | null;
  text_obs?: string;

  os?: string;
  situacao?: string;
  valor?: string;
  status?: boolean;
};

export const addOS: RequestHandler = async (req, res) => {
  const data = req.body as AddOsAutomationBody;

  console.log("[ADD_OS] body:", data);

  if (!data || typeof data !== "object") {
    await createLog({
      level: "ERROR",
      action: "ADD_OS",
      message: "Erro no corpo do envio!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "atm",
    });

    res.status(400).json({ ok: false, error: "Erro no corpo do envio!" });
    return;
  }

  const jobId = data.job_id ?? null;
  const socketId = data.socket_id ?? null;

  const id_supply = Number(data.id_supply ?? 0);
  const id_treasury = Number(data.id_treasury ?? 0);
  const id_atm = Number(data.id_atm ?? 0);

  const treasury_name = String(data.treasury_name ?? "");
  const date_on_supply = String(data.date_on_supply ?? "");
  const atm_name = String(data.atm_name ?? "");

  const osNumber = String(data.os ?? "").trim();
  const situacao = String(data.situacao ?? "").trim();
  const valor = String(data.valor ?? "").trim();
  const status = Boolean(data.status);

  const cassete_A = Number(data.cassete_A ?? 0);
  const cassete_B = Number(data.cassete_B ?? 0);
  const cassete_C = Number(data.cassete_C ?? 0);
  const cassete_D = Number(data.cassete_D ?? 0);
  const total_exchange = Boolean(data.total_exchange);

  const emails = Array.isArray(data.emails)
    ? [...new Set(data.emails.map((e) => String(e).trim()).filter(Boolean))]
    : [];

  const emit = (event: string, payload: any) => {
    try {
      if (!socketId) return;
      const io = getIO();
      io.to(socketId).emit(event, payload);
    } catch (error) {
      console.log("[ADD_OS] erro ao emitir socket:", error);
    }
  };

  if (!id_supply || !id_atm || !osNumber) {
    await createLog({
      level: "ERROR",
      action: "ADD_OS",
      message: `Dados obrigatórios ausentes. id_supply=${id_supply}, id_atm=${id_atm}, os=${osNumber}`,
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "atm",
    });

    emit("openos:item-error", {
      jobId,
      ok: false,
      id_supply,
      id_atm,
      error: "Dados obrigatórios ausentes para salvar a OS.",
    });

    res.status(400).json({
      ok: false,
      error: "Dados obrigatórios ausentes para salvar a OS.",
    });
    return;
  }

  try {
    const saved = await addOs({
      id_supply,
      id_atm: String(id_atm),
      os: osNumber,
      situacao,
      valor,
      status,
    } as any);

    let send_email = false;
    let email_result: any = null;

    if (saved?.id && emails.length > 0 && id_treasury > 0) {
      const payloadEmail = {
        email: emails,
        id_treasury,
        treasury_name,
        date_on_supply,
        atms: [
          {
            os_open_id: saved.id,
            id_supply,
            total_exchange,
            cassete_a: cassete_A,
            cassete_b: cassete_B,
            cassete_c: cassete_C,
            cassete_d: cassete_D,
            id_atm,
            atm_name,
            os: osNumber,
          },
        ],
      };

      email_result = await sendEmailOnOS(payloadEmail);

      if (email_result?.ok) {
        await updateOS(saved.id, {
          send_email: true,
        });

        send_email = true;
      }
    }

    await createLog({
      level: "INFO",
      action: "ADD_OS",
      message: `OS salva com sucesso. id=${saved?.id ?? null}, os=${osNumber}, atm=${id_atm}, email=${send_email}`,
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: "atm",
    });

    emit("openos:item-saved", {
      jobId,
      ok: true,
      item: {
        id: saved?.id ?? null,
        id_supply,
        id_treasury,
        treasury_name,
        date_on_supply,
        id_atm,
        atm_name,
        os: osNumber,
        situacao,
        valor,
        status,
        send_email,
      },
    });

    res.status(201).json({
      ok: true,
      id: saved?.id ?? null,
      send_email,
      email_result,
      item: {
        id: saved?.id ?? null,
        id_supply,
        id_treasury,
        treasury_name,
        date_on_supply,
        id_atm,
        atm_name,
        os: osNumber,
        situacao,
        valor,
        status,
      },
    });
  } catch (e: any) {
    console.log("[ADD_OS] erro:", e);

    await createLog({
      level: "ERROR",
      action: "ADD_OS",
      message: e?.message ?? "Erro ao salvar/enviar OS.",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 500,
      resource: "atm",
    });

    emit("openos:item-error", {
      jobId,
      ok: false,
      id_supply,
      id_atm,
      error: "Erro ao salvar/enviar OS.",
      details: e?.message ?? String(e),
    });

    res.status(500).json({
      ok: false,
      error: "Erro ao salvar/enviar OS.",
      details: e?.message ?? String(e),
    });
  }
};

type AttendOsForIdsBody = {
  socketId?: string;
  ids?: number[];
};

type OsItem = {
  id: number;
  number_card: string | null;
  [key: string]: any;
};

type EnrichedOsItem = OsItem & {
  number_card: string | null;
  enrichError: string | null;
};

export const atenderOsForIds: RequestHandler = async (req, res) => {
  const body = req.body as AttendOsForIdsBody;
  const socketId = body?.socketId;
  const ids = Array.isArray(body?.ids)
    ? [...new Set(
      body.ids
        .map((id) => Number(id))
        .filter((id) => Number.isFinite(id) && id > 0)
    )]
    : [];

    console.log("Atender OS para IDs:", ids.length);

  if (ids.length === 0) {
    await createLog({
      level: "ERROR",
      action: "ATTEND_OS_FOR_IDS",
      message: "Nenhum ID válido foi informado.",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "atm",
    });

    res.status(400).json({
      ok: false,
      error: "Nenhum ID válido foi informado.",
    });
    return;
  }

  const jobId = uuid();

  res.status(202).json({
    ok: true,
    jobId,
  });

  setImmediate(async () => {
    const io = getIO();

    const emit = (event: string, payload: any) => {
      try {
        if (socketId) io.to(socketId).emit(event, payload);
      } catch (error) {
        console.log("[ATTENDOS] erro ao emitir socket:", error);
      }
    };

    const normalizeOsResult = (value: any): OsItem[] => {
      if (!value) return [];
      if (Array.isArray(value)) {
        return value.filter(
          (item): item is OsItem =>
            !!item && typeof item.id === "number"
        );
      }
      if (typeof value === "object" && typeof value.id === "number") {
        return [value as OsItem];
      }
      return [];
    };

    try {
      emit("attendos:started", {
        jobId,
        total: ids.length,
      });

      emit("attendos:progress", {
        jobId,
        step: "load",
        message: "Buscando OSs selecionadas...",
      });

      const fetched = await Promise.all(
        ids.map(async (id) => {
          try {
            const result = await getOsForId(id);
            return normalizeOsResult(result);
          } catch (error) {
            console.log(`[ATTENDOS] erro ao buscar OS ${id}:`, error);
            return [];
          }
        })
      );

      const osList = fetched
        .flat()
        .filter(
          (item, index, arr) =>
            typeof item?.id === "number" &&
            arr.findIndex((x) => x.id === item.id) === index &&
            item.situacao === "Pendente" || item.situacao === "Cartão não encontrado!" || "Saldo insuficiente!"
        );

      if (osList.length === 0) {
        await createLog({
          level: "ERROR",
          action: "ATTEND_OS_FOR_IDS",
          message: "Nenhuma OS encontrada para os IDs informados.",
          userSlug: req.userSlug ?? null,
          route: req.route?.path ?? null,
          method: req.method ?? null,
          statusCode: 404,
          resource: "atm",
        });

        emit("attendos:error", {
          jobId,
          ok: false,
          error: "Nenhuma OS encontrada para os IDs informados.",
        });
        return;
      }

      emit("attendos:progress", {
        jobId,
        step: "enrich",
        message: "Buscando ATM, tesouraria e operadora...",
      });

      const enrichedOsList: EnrichedOsItem[] = await Promise.all(
        osList.map(async (item): Promise<EnrichedOsItem> => {
          try {
            const idAtm = Number(item.id_atm);

            if (!Number.isFinite(idAtm) || idAtm <= 0) {
              return {
                ...item,
                number_card: null,
                enrichError: "id_atm inválido.",
              };
            }

            const atm = await getAtm(idAtm);

            if (!atm) {
              return {
                ...item,
                number_card: null,
                enrichError: `ATM ${idAtm} não encontrado.`,
              };
            }

            const idTreasury = Number(atm.id_treasury);

            if (!Number.isFinite(idTreasury) || idTreasury <= 0) {
              return {
                ...item,
                number_card: null,
                enrichError: `ATM ${idAtm} sem id_treasury válido.`,
              };
            }

            const treasury = await getOperadorCard(String(idTreasury));

            if (!treasury) {
              return {
                ...item,
                number_card: null,
                enrichError: `Tesouraria ${idTreasury} não encontrada.`,
              };
            }

            const idSystem = Number(treasury.id_system);

            if (!Number.isFinite(idSystem) || idSystem <= 0) {
              return {
                ...item,
                number_card: null,
                enrichError: `Tesouraria ${idTreasury} sem id_system válido.`,
              };
            }

            const cardOperators = await getForIdTreasury(idSystem);
            const selectedCardOperator = cardOperators?.[0] ?? null;

            return {
              ...item,
              number_card: selectedCardOperator?.number_card ?? null,
              enrichError: null,
            };
          } catch (error: any) {
            return {
              ...item,
              number_card: null,
              enrichError: error?.message ?? String(error),
            };
          }
        })
      );

      console.log("enrichedOsList", enrichedOsList);

      const pyPayload = enrichedOsList.map((item) => ({
        id: Number(item.id),
        os: String(item.os ?? ""),
        number_card: item.number_card ?? null,
      }));

      const pyResult = await runPythonScript(
        pyPayload,
        "src/script/bot-atender-os.py"
      );

      emit("attendos:progress", {
        jobId,
        step: "process",
        message: "Atendendo OSs...",
      });

      let processed = 0;
      const results: Array<{
        id: number | null;
        ok: boolean;
        error?: string;
      }> = [];

      for (const item of enrichedOsList) {
        try {
          await updateOS(Number(item.id), {
            // exemplo:
            // operator_card: item.cardOperator?.operator_card ?? null,
            // id_treasury: item.id_treasury ?? null,
            // situacao: "ATENDIDA",
          } as any);

          const result = {
            id: Number(item.id),
            ok: true,
          };

          processed += 1;
          results.push(result);

          emit("attendos:progress", {
            jobId,
            step: "item",
            current: processed,
            total: enrichedOsList.length,
            message: `OS ${item.id} atendida (${processed}/${enrichedOsList.length})`,
          });
        } catch (error: any) {
          processed += 1;

          results.push({
            id: Number(item.id),
            ok: false,
            error: error?.message ?? String(error),
          });

          emit("attendos:progress", {
            jobId,
            step: "item-error",
            current: processed,
            total: enrichedOsList.length,
            message: `Falha ao atender OS ${item.id} (${processed}/${enrichedOsList.length})`,
          });
        }
      }

      const allOk = results.every((item) => item.ok === true);

      await createLog({
        level: allOk ? "INFO" : "ERROR",
        action: "ATTEND_OS_FOR_IDS",
        message: allOk
          ? `Atendimento concluído com sucesso. Total: ${results.length}`
          : `Atendimento concluído com falhas. Total: ${results.length}`,
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: allOk ? 200 : 207,
        resource: "atm",
      });

      emit("attendos:done", {
        jobId,
        ok: allOk,
        total: enrichedOsList.length,
        processed,
        results,
        pyResult,
      });
    } catch (e: any) {
      console.log("[ATTENDOS] erro geral:", e);

      await createLog({
        level: "ERROR",
        action: "ATTEND_OS_FOR_IDS",
        message: e?.message ?? "Erro ao atender OSs.",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 500,
        resource: "atm",
      });

      emit("attendos:error", {
        jobId,
        ok: false,
        error: "Erro ao atender OSs.",
        details: e?.message ?? String(e),
      });
    }
  });
};

type AttendOsForDateBody = {
  socketId?: string;
  date?: string;
};
export const atenderOsForDate: RequestHandler = async (req, res) => {
  const body = req.body as AttendOsForDateBody;

  const socketId = String(body?.socketId ?? "").trim() || undefined;
  const date = String(body?.date ?? "").trim();

  if (!date) {
    await createLog({
      level: "ERROR",
      action: "ATTEND_OS_FOR_DATE",
      message: "Data não informada.",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "atm",
    });

    res.status(400).json({
      ok: false,
      error: "Data não informada.",
    });
    return;
  }

  const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(date);
  if (!isValidDate) {
    await createLog({
      level: "ERROR",
      action: "ATTEND_OS_FOR_DATE",
      message: "Data inválida. Use o formato YYYY-MM-DD.",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "atm",
    });

    res.status(400).json({
      ok: false,
      error: "Data inválida. Use o formato YYYY-MM-DD.",
    });
    return;
  }

  const jobId = uuid();

  res.status(202).json({
    ok: true,
    jobId,
  });

  setImmediate(async () => {
    const io = getIO();

    const emit = (event: string, payload: any) => {
      try {
        if (socketId) io.to(socketId).emit(event, payload);
      } catch (error) {
        console.log("[ATTENDOS-DATE] erro ao emitir socket:", error);
      }
    };

    try {
      emit("attendos:started", {
        jobId,
        date,
      });

      emit("attendos:progress", {
        jobId,
        step: "load",
        message: `Buscando OSs abertas da data ${date}...`,
      });

      const osOpenResult = await getAllOsOpenInTableForDay(date);
    
      const osList = Array.isArray(osOpenResult?.data)
        ? osOpenResult.data.filter((item) => item?.situacao === "Pendente" || item?.situacao === "Cartão não encontrado!")
        : [];

      if (osList.length === 0) {
        await createLog({
          level: "ERROR",
          action: "ATTEND_OS_FOR_DATE",
          message: `Nenhuma OS pendente encontrada para a data ${date}.`,
          userSlug: req.userSlug ?? null,
          route: req.route?.path ?? null,
          method: req.method ?? null,
          statusCode: 404,
          resource: "atm",
        });

        emit("attendos:error", {
          jobId,
          ok: false,
          error: `Nenhuma OS pendente encontrada para a data ${date}.`,
        });
        return;
      }

      emit("attendos:progress", {
        jobId,
        step: "enrich",
        message: "Buscando ATM, tesouraria e operadora...",
      });

      const enrichedOsList: EnrichedOsItem[] = await Promise.all(
        osList.map(async (item): Promise<EnrichedOsItem> => {
          try {
            const idAtm = Number(item.id_atm);

            if (!Number.isFinite(idAtm) || idAtm <= 0) {
              return {
                ...item,
                number_card: null,
                enrichError: "id_atm inválido.",
              };
            }

            const atm = await getAtm(idAtm);

            if (!atm) {
              return {
                ...item,
                number_card: null,
                enrichError: `ATM ${idAtm} não encontrado.`,
              };
            }

            const idTreasury = Number(atm.id_treasury);

            if (!Number.isFinite(idTreasury) || idTreasury <= 0) {
              return {
                ...item,
                number_card: null,
                enrichError: `ATM ${idAtm} sem id_treasury válido.`,
              };
            }

            const treasury = await getOperadorCard(String(idTreasury));

            if (!treasury) {
              return {
                ...item,
                number_card: null,
                enrichError: `Tesouraria ${idTreasury} não encontrada.`,
              };
            }

            const idSystem = Number(treasury.id_system);

            if (!Number.isFinite(idSystem) || idSystem <= 0) {
              return {
                ...item,
                number_card: null,
                enrichError: `Tesouraria ${idTreasury} sem id_system válido.`,
              };
            }

            const cardOperators = await getForIdTreasury(idSystem);
            const selectedCardOperator = cardOperators?.[0] ?? null;

            return {
              ...item,
              number_card: selectedCardOperator?.number_card ?? null,
              enrichError: null,
            };
          } catch (error: any) {
            return {
              ...item,
              number_card: null,
              enrichError: error?.message ?? String(error),
            };
          }
        })
      );

     //console.log("enrichedOsList", enrichedOsList);

      const pyPayload = enrichedOsList.map((item) => ({
        id: Number(item.id),
        os: String(item.os ?? ""),
        number_card: item.number_card ?? null,
      }));

      emit("attendos:progress", {
        jobId,
        step: "process",
        message: "Atendendo OSs...",
      });

      const pyResult = await runPythonScript(
        pyPayload,
        "src/script/bot-atender-os.py"
      );

      let processed = 0;
      const results: Array<{
        id: number | null;
        ok: boolean;
        error?: string;
      }> = [];

      for (const item of enrichedOsList) {
        try {
          await updateOS(Number(item.id), {} as any);

          const result = {
            id: Number(item.id),
            ok: true,
          };

          processed += 1;
          results.push(result);

          emit("attendos:progress", {
            jobId,
            step: "item",
            current: processed,
            total: enrichedOsList.length,
            message: `OS ${item.id} atendida (${processed}/${enrichedOsList.length})`,
          });
        } catch (error: any) {
          processed += 1;

          results.push({
            id: Number(item.id),
            ok: false,
            error: error?.message ?? String(error),
          });

          emit("attendos:progress", {
            jobId,
            step: "item-error",
            current: processed,
            total: enrichedOsList.length,
            message: `Falha ao atender OS ${item.id} (${processed}/${enrichedOsList.length})`,
          });
        }
      }

      const allOk = results.every((item) => item.ok === true);

      await createLog({
        level: allOk ? "INFO" : "ERROR",
        action: "ATTEND_OS_FOR_DATE",
        message: allOk
          ? `Atendimento por data concluído com sucesso. Data: ${date}. Total: ${results.length}`
          : `Atendimento por data concluído com falhas. Data: ${date}. Total: ${results.length}`,
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: allOk ? 200 : 207,
        resource: "atm",
      });

      emit("attendos:done", {
        jobId,
        ok: allOk,
        date,
        total: enrichedOsList.length,
        processed,
        results,
        pyResult,
      });
    } catch (e: any) {
      console.log("[ATTENDOS-DATE] erro geral:", e);

      await createLog({
        level: "ERROR",
        action: "ATTEND_OS_FOR_DATE",
        message: e?.message ?? "Erro ao atender OSs por data.",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 500,
        resource: "atm",
      });

      emit("attendos:error", {
        jobId,
        ok: false,
        error: "Erro ao atender OSs por data.",
        details: e?.message ?? String(e),
      });
    }
  });
};

export const alterOS: RequestHandler = async (req, res) => {
  const data = req.body;
  console.log("data", data);

  if (!data) {
    await createLog({
      level: "ERROR",
      action: "ALTER_OS",
      message: "Erro no corpo do envio!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "atm",
    });
    res.status(400).json({ error: "Erro no corpo do envio!" });
    return;
  }

  if (
    data.cassete_A === 0 &&
    data.cassete_B === 0 &&
    data.cassete_C === 0 &&
    data.cassete_D === 0
  ) {
    await createLog({
      level: "ERROR",
      action: "ALTER_OS",
      message: "Tem que haver algum valor em um dos cassetes!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "atm",
    });
    res.status(400).json({ error: "Tem que haver algum valor em um dos cassetes!" });
    return;
  }

  try {

    const dataComplet = data
    const cardperator = await getForIdTreasury(data.id_treasury)

    dataComplet.cardperator = cardperator?.[0]?.name ?? "";

    console.log("dataComplet", dataComplet);
    const response = await runPythonScript(
      [dataComplet],
      "src/script/bot-alter-os.py",
      { timeoutMs: 60000, debug: true }
    );

    console.log("response python", response);

    res.status(200).json({
      message: "Alteração executada com sucesso!",
      data: response,
    });
    return;
  } catch (error) {
    console.log("erro alterOS", error);

    await createLog({
      level: "ERROR",
      action: "ALTER_OS",
      message: "Erro ao alterar no banco!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "atm",
    });

    res.status(400).json({ error: "Erro ao alterar no banco!" });
    return;
  }
};

type AtenderOsHookBody = {
  id: number;
  situacao: string;
};
export const atenderOsHook: RequestHandler = async (req, res) => {
  const data = req.body as AtenderOsHookBody;

  if (!data) {
    await createLog({
      level: "ERROR",
      action: "ALTER_OS",
      message: "Erro no corpo do envio!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "atm",
    });
    res.status(400).json({ error: "Erro no corpo do envio!" });
    return;
  }

  await updateOS(data.id, { situacao: data.situacao });

  res.status(200).json({ ok: true });
}
