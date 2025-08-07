import ExcelJS from 'exceljs';
import { supplyProps } from '../(private)/supply/add/page';
import { formatDateToString } from './formatDateToString';
import { generateFullReal } from './generateFullReal';
import { generateRealTotal } from './generateRealTotal';

type TransferData = supplyProps[]

export const generateExcelOs = async (data: TransferData) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Planilha');
        const headerRow = worksheet.addRow(['Terminal', 'troca_total', 'cassete_A', 'cassete_B', 'cassete_C', 'cassete_D', 'data_atendimento', 'Nr', 'total']);
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

        data.forEach((item) => {
            const row = worksheet.addRow([
                item.id_atm,
                item.total_exchange ? "S" : "N",
                item.cassete_A,
                item.cassete_B,
                item.cassete_C,
                item.cassete_D,
                formatDateToString(item?.date_on_supply as string),
                '',
                generateRealTotal(
                    item.cassete_A as number * 10,
                    item.cassete_B as number * 20,
                    item.cassete_C as number * 50,
                    item.cassete_D as number * 100
                ),
            ]);


        });

        // Gerar buffer e download
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `abastecimentos.xlsx`;
        link.click();

        return true;

    } catch (error) {
        console.error('Erro ao gerar excel:', error);
        return false;
    }
}
