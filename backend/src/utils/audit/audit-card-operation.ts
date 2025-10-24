// src/utils/audit/audit-card-operator.ts
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

/** Sanitiza UM card-operator (ajuste conforme seu schema real) */
export function sanitizeCardOperator(data: AnyObj | null | undefined) {
  if (!data) return null;
  const {
    id,
    name,
    number_card,
    inUse,
    id_treasury,         // se existir FK direta
    treasury,            // se vier expandido
    status,
    createdAt,
    updatedAt,
    // ...rest ignorado
  } = data;

  return {
    id,
    name,
    number_card,
    inUse,
    id_treasury: typeof id_treasury === 'number' ? id_treasury : treasury?.id ?? null,
    status,
    createdAt,
    updatedAt,
    // subset mínimo da treasury (se expandido)
    treasury: treasury
      ? {
          id: treasury.id ?? treasury.id_system ?? null,
          name: treasury.name
        }
      : undefined,
  };
}

/** Sanitiza payload de criação/edição (sem campos sensíveis) */
export function sanitizeCardOperatorPayload(data: AnyObj | null | undefined) {
  if (!data) return null;
  const {
    id_treasury,
    name,
    number_card,
    inUse
  } = data;
  return { id_treasury, name, number_card, inUse };
}
