// Função para gerar HTML com as tabelas a partir dos dados
export const generateEmailTableHTML = (data: any[]): string => {
  console.log(data)
  let html = `
      <table style="border-collapse: collapse; width: 80%;">
    `;

  data.forEach((item) => {
    const formattedDate = new Date(item.date).toLocaleDateString("pt-BR", { timeZone: "UTC" });
    // Cabeçalho principal
    html += `
        <tr>
          <td colspan="3" style="border: 1px solid #000; background-color: #FFFF00; font-weight: bold; text-align: center; padding: 8px;">
            Nr: ${item.id} | RETIRADA DE LOJA / ${item.name_treasury} - ${formattedDate}
          </td>
        </tr>
        <tr>
          <th style="border: 1px solid #000; background-color: #FFFF00; font-weight: bold; padding: 8px;">CED.</th>
          <th style="border: 1px solid #000; background-color: #FFFF00; font-weight: bold; padding: 8px;">QTD</th>
          <th style="border: 1px solid #000; background-color: #FFFF00; font-weight: bold; padding: 8px;">VALOR</th>
        </tr>
      `;

    // Dados das cédulas
    const rowsData = [
      { label: "R$ 10,00", qtd: item.value_10, value: (item.value_10 * 10) },
      { label: "R$ 20,00", qtd: item.value_20, value: item.value_20 * 20 },
      { label: "R$ 50,00", qtd: item.value_50, value: item.value_50 * 50 },
      { label: "R$ 100,00", qtd: item.value_100, value: item.value_100 * 100 },
    ];

    rowsData.forEach((row) => {
      html += `
          <tr>
            <td style="border: 1px solid #000; padding: 8px;">${row.label}</td>
            <td style="border: 1px solid #000; padding: 8px; text-align: center;">${row.qtd}</td>
            <td style="border: 1px solid #000; padding: 8px; text-align: right;">R$ ${row.value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}</td>
          </tr>
        `;
    });

    // Linha do total
    const total = rowsData.reduce((acc, curr) => acc + curr.value, 0);
    html += `
        <tr>
          <td colspan="2" style="border: 1px solid #000; font-weight: bold; text-align: right; padding: 8px;">TOTAL</td>
          <td style="border: 1px solid #000; font-weight: bold; text-align: right; padding: 8px;">R$ ${total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}</td>
        </tr>
        <tr><td colspan="3" style="height: 20px;"></td></tr>
      `;
  });

  html += `</table>`;
  return html;
};
