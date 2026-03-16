import { RequestHandler } from "express"
import { getForIdTreasury } from "services/cardOperator";
import { sendEmailOnOS } from "services/email";
import { createLog } from "services/logService"
import { getOsOpenInTableForDay } from "services/open-os"
import { addOs, getOsForId, updateOS } from "services/os-open";
import { runPythonScript } from "utils/runOpenOsPython";
import { getIO } from "utils/socket-event";

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
    const  cardperator = await getForIdTreasury(data.id_treasury)

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
