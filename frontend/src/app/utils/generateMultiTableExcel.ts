import ExcelJS from 'exceljs';

type TransferData = {
  id: number;
  treasury: string;
  date: string;
  value_A: number;
  value_B: number;
  value_C: number;
  value_D: number;
};

export const generateMultiTableExcel = async (data: TransferData[]) => {
console.log("Excel", data)
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transferências');

    // Estilos tipados corretamente
    const headerStyle: Partial<ExcelJS.Style> = {
      font: { bold: true, color: { argb: '00000000' } },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' }
      },
      alignment: { horizontal: 'center' }
    };

    const currencyFormat = '"R$" #,##0.00';
    const boldStyle: Partial<ExcelJS.Style> = { font: { bold: true } };

    let currentRow = 1;

    data.forEach((item) => {
      // Formatar data para DD/MM/AAAA
      const formattedDate = new Date(item.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
      console.log("Formatada", item.date)
      // Cabeçalho principal (Nr: ...)
      worksheet.mergeCells(`A${currentRow}:C${currentRow}`);
      const titleCell = worksheet.getCell(`A${currentRow}`);
      titleCell.value = `Nr: ${item.id} | TRANSFERENCIA ENTRE CUSTODIA / ${item.treasury} - ${formattedDate}`;
      titleCell.style = headerStyle;

      currentRow++;

      // Cabeçalhos da tabela (CED., QTD, VALOR)
      const headerRow = worksheet.addRow(['CED.', 'QTD', 'VALOR']);
      headerRow.eachCell((cell) => {
        cell.style = { ...headerStyle };
      });
      currentRow++;

      // Dados das cédulas
      const rowsData = [
        { label: 'R$ 10,00', qtd: item.value_A, value: item.value_A * 10 },
        { label: 'R$ 20,00', qtd: item.value_B, value: item.value_B * 20 },
        { label: 'R$ 50,00', qtd: item.value_C, value: item.value_C * 50 },
        { label: 'R$ 100,00', qtd: item.value_D, value: item.value_D * 100 },
      ];

      rowsData.forEach((row) => {
        const newRow = worksheet.addRow([row.label, row.qtd, row.value]);
        newRow.getCell(3).numFmt = currencyFormat;
      });
      currentRow += rowsData.length;

      // Cálculo do total
      const total = rowsData.reduce((acc, curr) => acc + curr.value, 0);

      // Linha do TOTAL
      worksheet.mergeCells(`A${currentRow}:B${currentRow}`);
      worksheet.getCell(`A${currentRow}`).value = 'TOTAL';
      worksheet.getCell(`C${currentRow}`).value = total;
      worksheet.getCell(`C${currentRow}`).numFmt = currencyFormat; // Formata como Real

      // Atualiza apenas a fonte para bold sem sobrescrever o numFmt
      worksheet.getRow(currentRow).eachCell((cell, colNumber) => {
        cell.font = { ...(cell.font || {}), bold: true };
      });

      currentRow += 2; // Espaço entre tabelas
    });

    // Configurar largura das colunas
    worksheet.columns = [
      { width: 20 }, // CED.
      { width: 25 }, // QTD
      { width: 25 }, // VALOR
    ];

    worksheet.eachRow({ includeEmpty: false }, (row) => {
      row.eachCell({ includeEmpty: false }, (cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // Gerar e baixar arquivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `transferencias-${new Date().toISOString().slice(0, 10)}.xlsx`;
    link.click();

    return true
  } catch (e: any) {
    return false
  }
};