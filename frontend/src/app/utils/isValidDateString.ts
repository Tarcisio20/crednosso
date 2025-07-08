export function isValidDateString(dateStr: string): boolean {
  // Verifica o padrão: 4 dígitos - 2 dígitos - 2 dígitos
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;

  // Tenta criar uma data
  const date = new Date(dateStr);

  // Verifica se a data é válida
  if (isNaN(date.getTime())) return false;

  // Verifica se os valores ainda batem (pra pegar 2025-02-31, por ex)
  const [year, month, day] = dateStr.split('-').map(Number);
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() + 1 === month &&
    date.getUTCDate() === day
  );
}
