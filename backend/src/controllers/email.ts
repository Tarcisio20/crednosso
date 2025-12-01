import { RequestHandler } from "express";
import { getOrderById } from "../services/order";
import { sendEmailOfOrder, sendOsEmail } from "../services/email";
import { getForIdSystem } from "../services/treasury";
import { createLog } from "services/logService";
import { sanitizeEmailOrdersList, sanitizeEmailRecipients, sanitizeEmailSendPayload } from "utils/audit/audit-email";
import { getSupplyByDate } from "services/supply";
import { getForIdTreasury as Id_contact } from "services/contact";
import { getForId } from "services/atm";
import { getForIdTreasury as Id_Card } from "services/cardOperator"

export const sendEmailToOrder: RequestHandler = async (req, res) => {
  const idsOrder = req.body
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
    })
    res.status(400).json({ error: "Informe pelo menos um ID de pedido." })
    return
  }
  try {
    const emails = []
    const orders = []
    for (let x = 0; idsOrder.length > x; x++) {
      let order: any = await getOrderById(parseInt(idsOrder[x]))
      let treasury: any = await getForIdSystem(order[0].id_treasury_destin)
      orders.push({
        id: order[0].id,
        id_type_operation: order[0].id_type_operation,
        id_trasury: order[0].id_treasury_destin,
        name_treasury: treasury.name_for_email,
        date: order[0].date_order,
        value_10: order[0].requested_value_A,
        value_20: order[0].requested_value_B,
        value_50: order[0].requested_value_C,
        value_100: order[0].requested_value_D,
      })
      let ctc: any = await getForIdTreasury(order[0].id_treasury_destin)
      for (let i = 0; ctc?.length > i; i++) {
        emails.push(ctc[i].email)
      }
      //return
    }
    const to = emails.join(",");
    const ok: any = await sendEmailOfOrder(to, orders);

    if (ok === true) {
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
          recipients: sanitizeEmailRecipients(to),
          orders: sanitizeEmailOrdersList(orders),
          payload: sanitizeEmailSendPayload(idsOrder),
        },
      })
      res.status(201).json({ email: true })
      return
    } else {
      await createLog({
        level: "ERROR",
        action: "SEND_EMAIL_TO_ORDER",
        message: "Erro no envio!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 500,
        resource: "email",
        meta: {
          recipients: sanitizeEmailRecipients(to),
          orders: sanitizeEmailOrdersList(orders),
          payload: sanitizeEmailSendPayload(idsOrder),
        },
      })
      res.status(500).json({ error: 'Erro no envio!' })
      return
    }
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
    })
    res.status(500).json({ error: "Erro ao processar!" });
    return
  }
}

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

    console.log("Supplies encontrados para a data:", date, supply?.length ?? 0);

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

    // 2) Monta array com TODOS os dados + e-mails + nome da tesouraria + nome do ATM + cardOperator
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

        // ----- CONTATOS: só status true / active -----
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

        // ----- Nome da tesouraria -----
        const treasuryName =
          (treasury as any)?.name ??
          (treasury as any)?.treasury_name ??
          (Array.isArray(treasury)
            ? treasury[0]?.name ?? treasury[0]?.treasury_name
            : undefined);

        // ----- Nome do ATM -----
        const atmName =
          (atm as any)?.name ??
          (atm as any)?.atm_name ??
          (Array.isArray(atm)
            ? atm[0]?.name ?? atm[0]?.atm_name
            : undefined);

        // ----- CARD-OPERATOR: só status true, pega o primeiro -----
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

        // usando o shape real: name + number_card
        const operatorCardNumber = cardOpAny?.number_card ?? null;
        const operatorName = cardOpAny?.name ?? null;

        const exchangeFlag = Boolean((item as any).total_exchange);

        const row = {
          // campos do supply
          id_supply: (item as any).id,
          id_atm: atmId,
          atmName,
          id_order: item.id_order,
          total_exchange: item.total_exchange, // campo original do banco
          exchange: exchangeFlag,             // usado para template
          date_on_supply: item.date_on_supply,
          cassete_A: item.cassete_A,
          cassete_B: item.cassete_B,
          cassete_C: item.cassete_C,
          cassete_D: item.cassete_D,
          status: item.status,

          // relacionamento
          id_treasury: treasuryId,
          treasuryName,

          // cardOperator (cartão do operador da transportadora)
          operatorCardNumber,
          operatorName,

          // e-mails (apenas contatos ativos)
          emails,
          to,
        };

        console.log(
          "[ROW EMAIL OS]",
          `supply=${row.id_supply}`,
          `atm=${row.id_atm}`,
          `treasury=${row.id_treasury}`,
          `exchange=${row.exchange}`,
          `to=${row.to}`
        );

        return row;
      })
    );

    // 3) Agrupa por tesouraria para mandar 1 e-mail por tesouraria
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

    // 4) Envia 1 e-mail por tesouraria
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