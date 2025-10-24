// src/utils/audit/audit-contact.ts
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
 * Sanitiza UM contact (ajuste conforme seu schema real do Prisma).
 * Mantemos só campos “seguros” de log.
 */
export function sanitizeContact(data: AnyObj | null | undefined) {
  if (!data) return null;

  const {
    id,
    id_treasury,
    name,
    email,
    phone,
    position,      // se existir no seu modelo
    status,
    createdAt,
    updatedAt,
    // ...rest ignorado
  } = data;

  return {
    id,
    id_treasury,
    name,
    email,
    phone,
    position,
    status,
    createdAt,
    updatedAt,
  };
}

/** Sanitiza payload de criação/edição (sem campos sensíveis) */
export function sanitizeContactPayload(data: AnyObj | null | undefined) {
  if (!data) return null;

  const {
    id_treasury,
    name,
    email,
    phone,
    position,   // se existir no seu modelo
    status,     // em geral deixo status do payload visível (não é sensível)
  } = data;

  return {
    id_treasury,
    name,
    email,
    phone,
    position,
    status,
  };
}
