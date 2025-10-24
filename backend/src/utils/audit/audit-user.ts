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
 * Sanitiza USER (ajuste conforme seu model real).
 * Nunca retornar senha, tokens, etc.
 */
export function sanitizeUser(data: AnyObj | null | undefined) {
  if (!data) return null;
  const {
    id,
    slug,
    name,
    email,
    // nunca inclua password / resets / tokens
    createdAt,
    updatedAt,
    // se houver "active", "role", etc, inclua se fizer sentido
    active,
    role,
  } = data as AnyObj;

  return { id, slug, name, email, createdAt, updatedAt, active, role };
}

/**
 * Sanitiza payload do REGISTER (não logar senha).
 */
export function sanitizeUserRegisterPayload(data: AnyObj | null | undefined) {
  if (!data) return null;
  const { name, email } = data as AnyObj;
  return { name, email };
}

/**
 * Sanitiza payload do LOGIN (apenas email).
 */
export function sanitizeUserLoginPayload(data: AnyObj | null | undefined) {
  if (!data) return null;
  const { email } = data as AnyObj;
  return { email };
}
