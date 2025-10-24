// src/utils/audit/audit-status-order.ts
type AnyObj = Record<string, any>;

/** Diff genérico: quais campos mudaram { from, to } */
export function diffObjects(before: AnyObj = {}, after: AnyObj = {}) {
  const changed: Record<string, { from: any; to: any }> = {};
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  for (const k of keys) {
    const a = (before as AnyObj)[k];
    const b = (after as AnyObj)[k];
    if (JSON.stringify(a) !== JSON.stringify(b)) {
      changed[k] = { from: a, to: b };
    }
  }
  return changed;
}

/** Sanitiza UM status-order (ajuste conforme seu schema real do Prisma) */
export function sanitizeStatusOrder(data: AnyObj | null | undefined) {
  if (!data) return null;
  const {
    id,
    name,
    status,      // caso exista status boolean/number
    createdAt,
    updatedAt,
  } = data;

  return {
    id,
    name,
    status,
    createdAt,
    updatedAt,
  };
}

/** Sanitiza LISTA de status-order */
export function sanitizeStatusOrderList(list: AnyObj[] | null | undefined) {
  if (!Array.isArray(list)) return [];
  return list.map(sanitizeStatusOrder);
}

/** Sanitiza payload de criação/edição (sem campos sensíveis) */
export function sanitizeStatusOrderPayload(data: AnyObj | null | undefined) {
  if (!data) return null;
  const { name, status } = data;
  return { name, status };
}
