// src/utils/audit.ts
type AnyObj = Record<string, any>;

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
 * Remova/sanitize campos sensíveis aqui.
 * Ajuste a lista conforme seu modelo real.
 */
export function sanitizeAccountBank(data: AnyObj | null | undefined) {
  if (!data) return null;
  const {
    id,
    name,
    bank_branch,
    bank_branch_digit,
    account,
    account_digit,
    type,
    status,
    // hash, // Se "hash" for sensível, comente/omita
    createdAt,
    updatedAt,
    ...rest
  } = data;

  return {
    id,
    name,
    bank_branch,
    bank_branch_digit,
    account,
    account_digit,
    type,
    status,
    createdAt,
    updatedAt,
    // ...se quiser manter/ocultar algo específico do "rest"
  };
}
