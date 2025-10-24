// src/utils/audit/audit-download.ts
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
 * Extrai data a partir de "dados-DD-MM-YYYY.xlsx".
 * Retorna uma ISO string (YYYY-MM-DD) ou null.
 */
export function extractDateFromFilename(name: string): string | null {
  const m = name?.match?.(/dados-(\d{2})-(\d{2})-(\d{4})\.xlsx$/i);
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  // Monta ISO (sem hora) para ficar estável no log
  return `${yyyy}-${mm}-${dd}`;
}

/** Sanitiza o nome do arquivo para log (sem paths, só nome e data derivada) */
export function sanitizeDownloadName(name?: string | null) {
  if (!name) return null;
  const base = String(name);
  return {
    name: base,
    dateFromName: extractDateFromFilename(base),
  };
}

/** Metadados de paginação para log */
export function sanitizeDownloadPaginationMeta(opts: {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  pageCount?: number;
}) {
  const { page, limit, total, totalPages, pageCount } = opts || {};
  return {
    page: Number(page ?? 1),
    limit: Number(limit ?? 10),
    total: Number(total ?? 0),
    totalPages: Number(totalPages ?? 0),
    pageCount: Number(pageCount ?? 0),
  };
}
