// src/utils/audit/audit-email.ts
type AnyObj = Record<string, any>;

/** Diff genérico: quais campos mudaram { from, to } */
export function diffObjects(before: AnyObj = {}, after: AnyObj = {}) {
  const changed: Record<string, { from: any; to: any }> = {};
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  for (const k of keys) {
    const a = before[k];
    const b = after[k];
    if (JSON.stringify(a) !== JSON.stringify(b)) {
      changed[k] = { from: a, to: b };
    }
  }
  return changed;
}

/**
 * Sanitiza UM resumo de "order" no formato que você usa para o e-mail.
 * Mantém apenas campos úteis e “seguros” para log.
 */
export function sanitizeEmailOrderSummary(data: AnyObj | null | undefined) {
  if (!data) return null;

  const {
    id,
    id_type_operation,
    id_trasury,       // no seu código você escreveu assim
    name_treasury,
    date,
    value_10,
    value_20,
    value_50,
    value_100,
  } = data;

  return {
    id,
    id_type_operation,
    id_trasury,
    name_treasury,
    date,
    value_10,
    value_20,
    value_50,
    value_100,
  };
}

/** Sanitiza lista de orders (resumo) */
export function sanitizeEmailOrdersList(list: AnyObj[] | null | undefined) {
  if (!Array.isArray(list)) return [];
  return list.map((o) => sanitizeEmailOrderSummary(o));
}

/**
 * Sanitiza lista de destinatários. Mantém a lista e a contagem.
 * (Se quiser redigir parcialmente os e-mails, dá pra trocar por uma versão mascarada)
 */
export function sanitizeEmailRecipients(recips: string[] | string | null | undefined) {
  const arr = Array.isArray(recips) ? recips : String(recips ?? '').split(',').map(s => s.trim()).filter(Boolean);
  return {
    recipients: arr,
    count: arr.length,
  };
}

/** Sanitiza payload de envio (ids informados na request, por ex.) */
export function sanitizeEmailSendPayload(data: AnyObj | null | undefined) {
  if (!data) return null;

  // quando a request vem como array de ids
  if (Array.isArray(data)) {
    return { orderIds: data.map((v) => Number(v)).filter((n) => !Number.isNaN(n)) };
  }

  // fallback
  const { orderIds } = data;
  return { orderIds: Array.isArray(orderIds) ? orderIds : [] };
}
