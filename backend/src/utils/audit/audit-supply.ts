// src/utils/audit/audit-supply.ts
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

/**
 * Sanitiza UM registro de supply (ajuste conforme seu schema real do Prisma).
 * Mantemos apenas campos “seguros” para log (sem objetos aninhados completos).
 */
export function sanitizeSupply(data: AnyObj | null | undefined) {
  if (!data) return null;

  // Tente cobrir tanto o shape "achatado" (id_atm, id_treasury) quanto o relacional (atm, treasury, order)
  const {
    id,
    // valores diretos (quando já vem em formato simples)
    id_atm,
    id_treasury,
    id_order,

    // relacionais (quando o service retorna com include)
    atm,
    treasury,
    order,

    cassete_A,
    cassete_B,
    cassete_C,
    cassete_D,
    total_exchange,
    date_on_supply,
    date,

    createdAt,
    updatedAt,
  } = data;

  return {
    id,

    // preferimos ids simples; se vier relacional, tentamos extrair id_system / id
    id_atm: typeof id_atm !== 'undefined'
      ? id_atm
      : (atm?.id_system ?? atm?.id ?? null),

    id_treasury: typeof id_treasury !== 'undefined'
      ? id_treasury
      : (treasury?.id_system ?? treasury?.id ?? null),

    id_order: typeof id_order !== 'undefined'
      ? id_order
      : (order?.id ?? null),

    cassete_A,
    cassete_B,
    cassete_C,
    cassete_D,
    total_exchange: !!total_exchange,

    // datas como string/Date simples (não logar objetos de timezone etc.)
    date_on_supply,
    date,

    createdAt,
    updatedAt,
  };
}

/** Sanitiza LISTA de supply */
export function sanitizeSupplyList(list: AnyObj[] | null | undefined) {
  if (!Array.isArray(list)) return [];
  return list.map(sanitizeSupply);
}

/**
 * Sanitiza payload de criação/edição (sem campos sensíveis).
 * Use para logar o "req.body" validado.
 */
export function sanitizeSupplyPayload(data: AnyObj | null | undefined) {
  if (!data) return null;

  const {
    id_atm,
    id_treasury,
    id_order,
    cassete_A,
    cassete_B,
    cassete_C,
    cassete_D,
    total_exchange,
    date_on_supply,
    date,
  } = data;

  return {
    id_atm,
    id_treasury,
    id_order,
    cassete_A,
    cassete_B,
    cassete_C,
    cassete_D,
    total_exchange: !!total_exchange,
    date_on_supply,
    date,
  };
}

/**
 * Sanitiza payloads de consulta (ex.: filtros por data),
 * útil para endpoints que recebem { date }.
 */
export function sanitizeSupplyFilterPayload(data: AnyObj | null | undefined) {
  if (!data) return null;
  const { date, startDate, endDate } = data as AnyObj;
  return { date, startDate, endDate };
}
