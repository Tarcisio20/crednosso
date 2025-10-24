// src/utils/audit.ts
type AnyObj = Record<string, any>;

/** Limita array no log para evitar payload gigante */
export function limitForLog<T>(arr: T[] = [], max = 20) {
  return arr.slice(0, max);
}

/** Sanitiza 1 banco (ajuste os campos conforme seu modelo real) */
export function sanitizeBank(item: AnyObj | null | undefined) {
  if (!item) return null;
  const {
    id,
    code,        // ex: 001
    name,        // ex: Banco do Brasil
    ispb,        // se existir
    // NUNCA inclua segredos/chaves/credentials aqui
    createdAt,
    updatedAt,
  } = item as AnyObj;

  return { id, code, name, ispb, createdAt, updatedAt };
}

/** Sanitiza lista de bancos para log (com contagem e amostra limitada) */
export function sanitizeBankListForLog(list: AnyObj[] | null | undefined, sampleMax = 20) {
  const results = Array.isArray(list) ? list : [];
  return {
    count: results.length,
    sample: limitForLog(results.map(sanitizeBank), sampleMax),
  };
}
