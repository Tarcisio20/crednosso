export const  returnDateInPtBr = (dateString: string): string => {
  const date = new Date(dateString);
  
  // Extrai dia, mês e ano
  const day = String(date.getUTCDate()).padStart(2, '0'); // Dia com 2 dígitos
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Mês com 2 dígitos (janeiro é 0)
  const year = date.getUTCFullYear(); // Ano com 4 dígitos

  // Retorna no formato "DD/MM/YYYY"
  return `${day}/${month}/${year}`;
  }