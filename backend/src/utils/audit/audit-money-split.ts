// src/utils/audit/audit-money-split.ts
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
 * Sanitiza UM registro de money-split (ajuste conforme seu schema do Prisma).
 * Mantemos campos “seguros” para log (sem dados sensíveis).
 */
export function sanitizeMoneySplit(data: AnyObj | null | undefined) {
  if (!data) return null;

  const {
    id,
    id_order,             // se a FK vier expandida, normalizamos abaixo
    id_treasury_origin,
    id_treasury_rating,
    order,
    treasury_origin,
    treasury_rating,
    value,
    status,
    createdAt,
    updatedAt,
    // ...rest ignorado
  } = data as AnyObj;

  const orderId =
    typeof id_order === 'number'
      ? id_order
      : order?.id ?? order?.id_system ?? null;

  const originId =
    typeof id_treasury_origin === 'number'
      ? id_treasury_origin
      : treasury_origin?.id ?? treasury_origin?.id_system ?? null;

  const ratingId =
    typeof id_treasury_rating === 'number'
      ? id_treasury_rating
      : treasury_rating?.id ?? treasury_rating?.id_system ?? null;

  return {
    id,
    id_order: orderId,
    id_treasury_origin: originId,
    id_treasury_rating: ratingId,
    value,
    status,
    createdAt,
    updatedAt,
  };
}

/** Sanitiza payload de criação/edição (sem campos sensíveis) */
export function sanitizeMoneySplitPayload(data: AnyObj | null | undefined) {
  if (!data) return null;

  // Ajuste conforme o schema do seu Zod (addRattedSchema)
  const {
    id_order,
    id_treasury_origin,
    id_treasury_rating,
    value,
    // Se o payload vier como lista/array, usar o helper de lista abaixo
  } = data;

  return {
    id_order,
    id_treasury_origin,
    id_treasury_rating,
    value,
  };
}

/** Sanitiza lista de registros */
export function sanitizeMoneySplitList(list: AnyObj[] | null | undefined) {
  if (!Array.isArray(list)) return [];
  return list.map((item) => sanitizeMoneySplit(item));
}
