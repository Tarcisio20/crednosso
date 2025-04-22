import ExcelJS from 'exceljs';
import { formatDateToString } from './formatDateToString';
import { parsedValue } from './parsedValue';

type TransferData = {
  codigo: number;
  conta: string;
  tesouraria : string;
  regiao: number;
  gmcore : string;
  valor: string;
  id_type_store: number;
  date: string;
  valorRealizado: string;
  estorno : string;
};

export const generateExcelGMCORE = async (data: TransferData[]) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Retiradas');

    // Cabeçalho
    const headerRow = worksheet.addRow(['LOJA', 'DATA RETIRADA', 'VALOR', 'OBS']);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD700' }, // Amarelo ouro
      };
      cell.alignment = { horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Dados
    data.forEach((item) => {
      const row = worksheet.addRow([
        item.gmcore,
        formatDateToString(item.date),
        parsedValue(item.valorRealizado),
        'REFERENTE A ABASTECIMENTO',
      ]);
    });

    // Largura de colunas
    worksheet.columns = [
      { width: 10 },
      { width: 15 },
      { width: 15 },
      { width: 50 },
    ];

    // Gerar buffer e download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `gmcore.xlsx`;
    link.click();

    return true;
  } catch (error) {
    console.error('Erro ao gerar excel:', error);
    return false;
  }
};