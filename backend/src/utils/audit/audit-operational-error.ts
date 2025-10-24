// src/utils/audit/audit-operational-error.ts
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
 * Sanitiza UM operational-error (ajuste os campos conforme seu Prisma).
 * Mantemos só campos seguros no log.
 */
export function sanitizeOperationalError(data: AnyObj | null | undefined) {
  if (!data) return null;

  const {
    id,
    id_treasury,      // FK numérica
    treasury,         // caso venha expandido
    num_os,
    description,
    status,
    createdAt,
    updatedAt,
    // ...rest ignorado
  } = data as AnyObj;

  return {
    id,
    id_treasury: typeof id_treasury === 'number'
      ? id_treasury
      : treasury?.id ?? treasury?.id_system ?? null,
    num_os,
    description,
    status,
    createdAt,
    updatedAt,
  };
}

/** Sanitiza payload de criação/edição (sem campos sensíveis) */
export function sanitizeOperationalErrorPayload(data: AnyObj | null | undefined) {
  if (!data) return null;

  const {
    id_treasury,
    num_os,
    description,
    status, // geralmente não é sensível
  } = data;

  return {
    id_treasury,
    num_os,
    description,
    status,
  };
}

/** Sanitiza lista */
export function sanitizeOperationalErrorList(list: AnyObj[] | null | undefined) {
  if (!Array.isArray(list)) return [];
  return list.map((item) => sanitizeOperationalError(item));
}
