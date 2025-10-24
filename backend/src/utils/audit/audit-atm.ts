// src/utils/audit.ts
type AnyObj = Record<string, any>;

/**
 * Retorna as chaves que mudaram entre before e after,
 * com o par { from, to } pra cada campo alterado.
 */
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
 * Sanitiza ATM (ajuste os campos do seu modelo real).
 * Remova/sanitize qualquer campo sensível aqui.
 */
export function sanitizeAtm(data: AnyObj | null | undefined) {
  if (!data) return null;

  const {
    id,            // PK numérica usada nos endpoints /atm/:id
    id_system,     // se você usa um id "externo" também guardamos
    name,
    short_name,
    number_store,
    cassete_A,
    cassete_B,
    cassete_C,
    cassete_D,
    // Exemplo: se houver campos sensíveis como "secret", "apiKey" etc, NÃO exponha
    status,
    createdAt,
    updatedAt,
    // relações
    treasury,      // cuidado com payloads muito grandes; mantenha apenas o necessário
    // ...rest (intencionalmente ignorado)
  } = data as AnyObj;

  return {
    id,
    id_system,
    name,
    short_name,
    number_store,
    cassete_A,
    cassete_B,
    cassete_C,
    cassete_D,
    status,
    createdAt,
    updatedAt,
    // se precisar algo pontual da treasury, extraia só os campos essenciais:
    treasury: treasury
      ? {
          id_system: treasury.id_system ?? treasury.id, // ajuste conforme seu schema
          name: treasury.name,
        }
      : null,
  };
}

/**
 * Sanitiza payloads de UPDATE/ADD balance do ATM,
 * evitando guardar dados redundantes ou sensíveis.
 */
export function sanitizeAtmBalancePayload(data: AnyObj | null | undefined) {
  if (!data) return null;
  const {
    // mantenha só o que realmente importa na auditoria
    value_A,
    value_B,
    value_C,
    value_D,
    observation,
    // ...rest (ignorado)
  } = data;

  return { value_A, value_B, value_C, value_D, observation };
}
