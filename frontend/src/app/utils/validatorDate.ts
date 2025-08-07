export function validatorDate(valor: string): boolean {
  let dia: number, mes: number, ano: number;

  if (/^(\d{2})\/(\d{2})\/(\d{4})$/.test(valor)) {
    // formato dd/mm/yyyy
    [dia, mes, ano] = valor.split("/").map(Number);
  } else if (/^(\d{4})-(\d{2})-(\d{2})$/.test(valor)) {
    // formato yyyy-mm-dd
    [ano, mes, dia] = valor.split("-").map(Number);
  } else {
    return false; // formato inválido
  }

  const data = new Date(ano, mes - 1, dia);
  return (
    data.getFullYear() === ano &&
    data.getMonth() === mes - 1 &&
    data.getDate() === dia
  );
}
