export const parsedValue = (valor: string): number =>  {
    // Remove "R$", espaços e pontos de milhar, troca vírgula por ponto
    const cleaned = valor.replace(/\s/g, '').replace('R$', '').replace(/\./g, '').replace(',', '.');
    return parseFloat(cleaned);
  }