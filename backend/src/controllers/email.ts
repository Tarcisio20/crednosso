import { RequestHandler } from "express";
import { alterRequestsOrderForID, getOrderById } from "../services/order";
import { sendEmailOfOrder, sendOsEmail } from "../services/email";
import { getForIdSystem } from "../services/treasury";
import { createLog } from "services/logService";
import { sanitizeEmailOrdersList, sanitizeEmailRecipients, sanitizeEmailSendPayload } from "utils/audit/audit-email";
import { getEmailStatusByDate, getSupplyByDate } from "services/supply";
import { getForIdTreasury as Id_contact } from "services/contact";
import { getForId } from "services/atm";
import { getForIdTreasury as Id_Card } from "services/cardOperator"
import { OrderLevel } from "@prisma/client";
import { getIO } from "utils/socket-event";
import { v4 as uuid } from "uuid";


type TreasuryEmailResp =
  | { emails?: string[] | string | null; email?: string | null }
  | any;

export const sendEmailToOrder: RequestHandler = async (req, res) => {
  const idsOrder = req.body;

  if (!Array.isArray(idsOrder) || idsOrder.length === 0) {
    await createLog({
      level: "ERROR",
      action: "SEND_EMAIL_TO_ORDER",
      message: "Erro ao processar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "email",
      meta: { payload: sanitizeEmailSendPayload(req.body) },
    });

    res.status(400).json({ error: "Informe pelo menos um ID de pedido." });
    return;
  }

  try {
    const groupedOrders = new Map<
      number,
      {
        treasuryName: string;
        emails: string[];
        orders: any[];
      }
    >();

    for (let x = 0; x < idsOrder.length; x++) {
      const orderResult: any = await getOrderById(Number(idsOrder[x]));
      const order = orderResult?.[0];

      if (!order) continue;

      const treasuryId = Number(order.id_treasury_destin);
      const treasury: any = await getForIdSystem(String(treasuryId));
      const contacts: any = await Id_contact(treasuryId);

      if (!groupedOrders.has(treasuryId)) {
        groupedOrders.set(treasuryId, {
          treasuryName: treasury?.name_for_email ?? "",
          emails: [],
          orders: [],
        });
      }

      const bucket = groupedOrders.get(treasuryId)!;

      bucket.orders.push({
        id: order.id,
        id_type_operation: order.id_type_operation,
        id_trasury: order.id_treasury_destin,
        name_treasury: treasury?.name_for_email ?? "",
        date: order.date_order,
        value_10: order.requested_value_A,
        value_20: order.requested_value_B,
        value_50: order.requested_value_C,
        value_100: order.requested_value_D,
      });

      for (let i = 0; i < (contacts?.length ?? 0); i++) {
        const email = String(contacts[i]?.email ?? "").trim();
        if (email && !bucket.emails.includes(email)) {
          bucket.emails.push(email);
        }
      }
    }

    if (groupedOrders.size === 0) {
      await createLog({
        level: "ERROR",
        action: "SEND_EMAIL_TO_ORDER",
        message: "Nenhum pedido válido encontrado!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 404,
        resource: "email",
        meta: { payload: sanitizeEmailSendPayload(req.body) },
      });

      res.status(404).json({ error: "Nenhum pedido válido encontrado." });
      return;
    }

    const results: {
      treasuryId: number;
      treasuryName: string;
      ok: boolean;
      error?: any;
    }[] = [];

    for (const [treasuryId, group] of groupedOrders.entries()) {
      const to = group.emails.join(",");
      const result: any = await sendEmailOfOrder(to, group.orders);

      results.push({
        treasuryId,
        treasuryName: group.treasuryName,
        ok: result === true || result?.ok === true,
        error: result?.ok === false ? result?.error : undefined,
      });
    }

    const successResults = results.filter((r) => r.ok);
    const errorResults = results.filter((r) => !r.ok);

    if (errorResults.length === 0) {
      await createLog({
        level: "INFO",
        action: "SEND_EMAIL_TO_ORDER",
        message: "Email enviado com sucesso!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 201,
        resource: "email",
        meta: {
          groups: results,
          payload: sanitizeEmailSendPayload(idsOrder),
        },
      });

      res.status(201).json({
        email: true,
        total_groups: results.length,
        success_groups: successResults.length,
      });
      return;
    }

    await createLog({
      level: "ERROR",
      action: "SEND_EMAIL_TO_ORDER",
      message: "Erro no envio de um ou mais grupos!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 500,
      resource: "email",
      meta: {
        groups: results,
        payload: sanitizeEmailSendPayload(idsOrder),
      },
    });

    res.status(500).json({
      error: "Erro no envio de um ou mais e-mails!",
      total_groups: results.length,
      success_groups: successResults.length,
      error_groups: errorResults.length,
      details: errorResults,
    });
    return;
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "SEND_EMAIL_TO_ORDER",
      message: "Erro ao processar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 500,
      resource: "email",
      meta: {
        payload: sanitizeEmailSendPayload(req.body),
        error: String(error),
      },
    });

    res.status(500).json({ error: "Erro ao processar!" });
    return;
  }
};

export const sendEmailToOrderAsync: RequestHandler = async (req, res) => {
  const body = req.body as {
    idsOrder?: number[];
    socketId?: string;
    date?: string;
  };

  const idsOrder = body?.idsOrder ?? [];
  const socketId = body?.socketId;
  const date = body?.date;

  if (!Array.isArray(idsOrder) || idsOrder.length === 0) {
    res.status(400).json({ error: "Informe pelo menos um ID de pedido." });
    return;
  }

  const jobId = uuid();

  res.status(202).json({ ok: true, jobId });

  setImmediate(async () => {
    const io = getIO();

    const emit = (event: string, payload: any) => {
      if (socketId) io.to(socketId).emit(event, payload);
    };

    try {
      emit("order-email:started", {
        jobId,
        total: idsOrder.length,
        date,
      });

      const groupedOrders = new Map<
        number,
        {
          treasuryName: string;
          emails: string[];
          orders: any[];
        }
      >();

      for (let x = 0; x < idsOrder.length; x++) {
        const orderResult: any = await getOrderById(Number(idsOrder[x]));
        const order = orderResult?.[0];

        if (!order) continue;

        const treasuryId = Number(order.id_treasury_destin);
        const treasury: any = await getForIdSystem(String(treasuryId));
        const contacts: any = await Id_contact(treasuryId);

        if (!groupedOrders.has(treasuryId)) {
          groupedOrders.set(treasuryId, {
            treasuryName: treasury?.name_for_email ?? "",
            emails: [],
            orders: [],
          });
        }

        const bucket = groupedOrders.get(treasuryId)!;

        bucket.orders.push({
          id: order.id,
          id_type_operation: order.id_type_operation,
          id_trasury: order.id_treasury_destin,
          name_treasury: treasury?.name_for_email ?? "",
          date: order.date_order,
          value_10: order.requested_value_A,
          value_20: order.requested_value_B,
          value_50: order.requested_value_C,
          value_100: order.requested_value_D,
        });

        for (let i = 0; i < (contacts?.length ?? 0); i++) {
          const email = String(contacts[i]?.email ?? "").trim();
          if (email && !bucket.emails.includes(email)) {
            bucket.emails.push(email);
          }
        }
      }

      const groups = Array.from(groupedOrders.entries());

      emit("order-email:progress", {
        jobId,
        step: "grouped",
        totalGroups: groups.length,
      });

      let current = 0;

      for (const [treasuryId, group] of groups) {
        current++;

        emit("order-email:progress", {
          jobId,
          step: "sending",
          current,
          totalGroups: groups.length,
          treasuryId,
          treasuryName: group.treasuryName,
          status: "PENDENTE",
        });

        await Promise.all(
          group.orders.map((order) =>
            alterRequestsOrderForID(order.id, {
              send_email_status: OrderLevel.PENDENTE,
            })
          )
        );

        const to = group.emails.join(",");
        const result: any = await sendEmailOfOrder(to, group.orders);

        if (result?.ok) {
          await Promise.all(
            group.orders.map((order) =>
              alterRequestsOrderForID(order.id, {
                send_email_status: OrderLevel.ENVIADO,
              })
            )
          );

          emit("order-email:progress", {
            jobId,
            step: "done-group",
            current,
            totalGroups: groups.length,
            treasuryId,
            treasuryName: group.treasuryName,
            status: "ENVIADO",
          });
        } else {
          await Promise.all(
            group.orders.map((order) =>
              alterRequestsOrderForID(order.id, {
                send_email_status: OrderLevel.ERROR,
              })
            )
          );

          emit("order-email:progress", {
            jobId,
            step: "done-group",
            current,
            totalGroups: groups.length,
            treasuryId,
            treasuryName: group.treasuryName,
            status: "ERROR",
            error: result?.error ? String(result.error) : "Erro ao enviar",
          });
        }
      }

      await createLog({
        level: "INFO",
        action: "SEND_EMAIL_TO_ORDER_ASYNC",
        message: "Processamento assíncrono concluído!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 202,
        resource: "email",
        meta: { idsOrder, date, jobId },
      });

      emit("order-email:done", {
        jobId,
        ok: true,
        date,
      });
    } catch (error) {
      await createLog({
        level: "ERROR",
        action: "SEND_EMAIL_TO_ORDER_ASYNC",
        message: "Erro no processamento assíncrono!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 500,
        resource: "email",
        meta: {
          idsOrder,
          date,
          jobId,
          error: String(error),
        },
      });

      emit("order-email:error", {
        jobId,
        ok: false,
        error: String(error),
        date,
      });
    }
  });
};

export const sendEmailToOS: RequestHandler = async (req, res) => {
  const date = req.body.date as string | undefined;

  if (!date) {
    await createLog({
      level: "ERROR",
      action: "SEND_EMAIL_TO_OS",
      message: "Requisição sem DATE!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "supply",
    });
    res.status(400).json({
      success: false,
      error: "Erro ao receber data!",
    });
    return;
  }

  try {
    const supply = await getSupplyByDate(date);

    //console.log("Supplies encontrados para a data:", date, supply?.length ?? 0);

    if (!supply || supply.length === 0) {
      await createLog({
        level: "INFO",
        action: "SEND_EMAIL_TO_OS",
        message: `Nenhum abastecimento encontrado para a data ${date}.`,
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 200,
        resource: "supply",
      });
      res.status(200).json({
        success: false,
        data: [],
        message: "Nenhum abastecimento para a data informada.",
      });
      return;
    }

    const dataWithEmail = await Promise.all(
      supply.map(async (item) => {
        const treasuryId = (item as any).id_treasury;
        const atmId = item.id_atm;

        const [contacts, treasury, atm, cardOperatorRaw] = await Promise.all([
          Id_contact(treasuryId),
          getForIdSystem(treasuryId),
          getForId(atmId),
          Id_Card(treasuryId),
        ]);

        const contactListRaw = Array.isArray(contacts)
          ? contacts
          : contacts
            ? [contacts]
            : [];

        const contactList = contactListRaw.filter(
          (ctt: any) => ctt?.status === true || ctt?.active === true
        );

        const emails =
          contactList
            .map((ctt: any) => ctt.email)
            .filter((e: string | null | undefined) => !!e) ?? [];

        const to = emails.join(",");


        const treasuryName =
          (treasury as any)?.name ??
          (treasury as any)?.treasury_name ??
          (Array.isArray(treasury)
            ? treasury[0]?.name ?? treasury[0]?.treasury_name
            : undefined);

        const atmName =
          (atm as any)?.name ??
          (atm as any)?.atm_name ??
          (Array.isArray(atm)
            ? atm[0]?.name ?? atm[0]?.atm_name
            : undefined);


        const cardOpArrayRaw = Array.isArray(cardOperatorRaw)
          ? cardOperatorRaw
          : cardOperatorRaw
            ? [cardOperatorRaw]
            : [];

        const cardOpEnabled = cardOpArrayRaw.filter(
          (c: any) => c?.status === true
        );

        const cardOperator = cardOpEnabled[0] ?? null;
        const cardOpAny = cardOperator as any;

        const operatorCardNumber = cardOpAny?.number_card ?? null;
        const operatorName = cardOpAny?.name ?? null;

        const exchangeFlag = Boolean((item as any).total_exchange);

        const row = {
          id_supply: (item as any).id,
          id_atm: atmId,
          atmName,
          id_order: item.id_order,
          total_exchange: item.total_exchange,
          exchange: exchangeFlag,
          date_on_supply: item.date_on_supply,
          cassete_A: item.cassete_A,
          cassete_B: item.cassete_B,
          cassete_C: item.cassete_C,
          cassete_D: item.cassete_D,
          status: item.status,
          id_treasury: treasuryId,
          treasuryName,
          operatorCardNumber,
          operatorName,
          emails,
          to,
        };

        // console.log(
        //   "[ROW EMAIL OS]",
        //   `supply=${row.id_supply}`,
        //   `atm=${row.id_atm}`,
        //   `treasury=${row.id_treasury}`,
        //   `exchange=${row.exchange}`,
        //   `to=${row.to}`
        // );

        return row;
      })
    );

    type Grouped = {
      to: string;
      treasuryName?: string;
      records: any[];
    };

    const groupedByTreasury: Record<string, Grouped> = {};

    for (const row of dataWithEmail) {
      const key = String(row.id_treasury);

      if (!groupedByTreasury[key]) {
        groupedByTreasury[key] = {
          to: row.to,
          treasuryName: row.treasuryName,
          records: [],
        };
      }

      groupedByTreasury[key].records.push(row);
    }

    let allOk = true;

    for (const treasuryId of Object.keys(groupedByTreasury)) {
      const { to, treasuryName, records } = groupedByTreasury[treasuryId];

      if (!to) {
        console.log(
          `Tesouraria ${treasuryId} sem e-mails ATIVOS cadastrados, pulando envio.`
        );
        continue;
      }

      console.log(
        `Enviando email OS para tesouraria ${treasuryId} (${treasuryName}) - qt registros: ${records.length}`
      );

      const response = await sendOsEmail({
        date,
        treasuryId,
        treasuryName,
        to,
        records,
      });

      if (response !== true) {
        allOk = false;
      }
    }

    if (allOk) {
      await createLog({
        level: "INFO",
        action: "SEND_EMAIL_TO_OS",
        message: "E-mails de OS enviados com sucesso.",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 200,
        resource: "email",
        meta: { dataCount: dataWithEmail.length, date },
      });

      res.status(200).json({
        success: true,
        message: "Processamento concluído com sucesso.",
        data: dataWithEmail,
      });
      return;
    } else {
      await createLog({
        level: "ERROR",
        action: "SEND_EMAIL_TO_OS",
        message: "Um ou mais e-mails de OS falharam.",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 500,
        resource: "email",
        meta: { dataCount: dataWithEmail.length, date },
      });

      res.status(500).json({
        success: false,
        message: "Um ou mais e-mails de OS não foram enviados.",
        data: dataWithEmail,
      });
      return;
    }
  } catch (error) {
    console.error("SEND_EMAIL_TO_OS ERROR =>", error);

    await createLog({
      level: "ERROR",
      action: "SEND_EMAIL_TO_OS",
      message: "Erro ao processar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 500,
      resource: "email",
      meta: {
        payload: sanitizeEmailSendPayload(req.body),
        error: String(error),
      },
    });

    res.status(500).json({
      success: false,
      error: "Erro ao processar!",
    });
    return;
  }
};

export const normalizeEmails = (contacts: any): string[] => {
  if (!Array.isArray(contacts)) return [];

  return Array.from(
    new Set(
      contacts
        .map((c) => c?.email)
        .filter(Boolean)
        .map((e) => String(e).trim().toLowerCase())
        .filter((e) => e.includes("@"))
    )
  );
}

export const getEmailStatusForDate: RequestHandler = async (req, res) => {
  const { date } = req.params;

  if (!date) {
    res.status(400).json({ error: "Informe uma data." });
    return;
  }

  const ids = String(req.query.ids ?? "")
    .split(",")
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id) && id > 0);

  try {
    const status = await getEmailStatusByDate(date, ids);

    if (!status) {
      res.status(500).json({ error: "Erro ao buscar status." });
      return;
    }

    res.status(200).json({ status });
    return;
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar status." });
    return;
  }
};