export const generateCurrency = (value: string): number => {
  if (!value) return 0;
  const cleaned = value.replace(/\./g, '').replace('R$', '').replace(',', '.').trim();
  const number = parseFloat(cleaned);
  return isNaN(number) ? 0 : number;
};

  