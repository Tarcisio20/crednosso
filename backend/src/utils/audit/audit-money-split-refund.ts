// src/utils/audit/audit-money-split-refund.ts
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
 * Sanitiza UM registro de money-split-refund (ajuste conforme seu schema real do Prisma).
 * Mantemos apenas campos “seguros” para log.
 */
export function sanitizeMoneySplitRefund(data: AnyObj | null | undefined) {
  if (!data) return null;

  const {
    id,
    // dependendo do seu Prisma, esses campos podem vir como:
    // orderId / treasuryId OR relations { order: { id }, treasury: { id } }
    id_order,
    id_treasury_origin,
    order,
    treasury,
    value,
    status,
    createdAt,
    updatedAt,
  } = data as AnyObj;

  // normaliza ids caso venham por relação expandida
  const orderId =
    typeof id_order === "number"
      ? id_order
      : order?.id ?? order?.id_system ?? null;

  const treasuryId =
    typeof id_treasury_origin === "number"
      ? id_treasury_origin
      : treasury?.id ?? treasury?.id_system ?? null;

  return {
    id,
    id_order: orderId,
    id_treasury_origin: treasuryId,
    value,
    status,
    createdAt,
    updatedAt,
  };
}

/** Sanitiza payload de criação/edição (sem campos sensíveis) */
export function sanitizeMoneySplitRefundPayload(data: AnyObj | null | undefined) {
  if (!data) return null;

  const {
    // esperado no body validado:
    id_order,
    id_treasury_origin,
    value,
  } = data;

  return {
    id_order,
    id_treasury_origin,
    value,
  };
}

/** Sanitiza lista de refunds */
export function sanitizeMoneySplitRefundList(list: AnyObj[] | null | undefined) {
  if (!Array.isArray(list)) return [];
  return list.map((item) => sanitizeMoneySplitRefund(item));
}
