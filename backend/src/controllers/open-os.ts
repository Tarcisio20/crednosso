import { RequestHandler } from "express"
import { getForIdTreasury } from "services/cardOperator";
import { createLog } from "services/logService"
import { getOsOpenInTableForDay } from "services/open-os"
import { getOsForId } from "services/os-open";
import { runPythonScript } from "utils/runOpenOsPython";

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
