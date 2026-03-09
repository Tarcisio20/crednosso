
export const generateBaseSlug = (value: string): string => {
  return value
    .normalize("NFD") // separa acentos
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .trim()
    .replace(/\s+/g, "_") // espaço vira _
    .replace(/[^A-Za-z0-9_]/g, "") // remove caracteres inválidos
    .replace(/_+/g, "_") // evita ___
    .replace(/^_+|_+$/g, "") // remove _ do início/fim
    .toUpperCase();
};