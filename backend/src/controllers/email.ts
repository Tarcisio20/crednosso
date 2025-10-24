import { RequestHandler } from "express";
import { getOrderById } from "../services/order";
import { getForIdTreasury } from "../services/contact";
import { sendEmailOfOrder } from "../services/email";
import { getForIdSystem } from "../services/treasury";
import { createLog } from "services/logService";
import { sanitizeEmailOrdersList, sanitizeEmailRecipients, sanitizeEmailSendPayload } from "utils/audit/audit-email";

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
