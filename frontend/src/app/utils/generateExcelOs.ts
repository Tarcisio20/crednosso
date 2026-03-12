import ExcelJS from "exceljs";
import { supplyType } from "@/types/supplyType";
import { formatDateToString } from "./formatDateToString";
import { generateRealTotal } from "./generateRealTotal";

type TransferData = supplyType[];

export const generateExcelOs = async (data: TransferData) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Planilha");

    worksheet.columns = [
      { header: "Terminal", key: "terminal", width: 15 },
      { header: "troca_total", key: "troca_total", width: 15 },
      { header: "cassete_A", key: "cassete_A", width: 15 },
      { header: "cassete_B", key: "cassete_B", width: 15 },
      { header: "cassete_C", key: "cassete_C", width: 15 },
      { header: "cassete_D", key: "cassete_D", width: 15 },
      { header: "data_atendimento", key: "data_atendimento", width: 20 },
      { header: "Nr", key: "nr", width: 10 },
      { header: "total", key: "total", width: 20 },
    ];

    const headerRow = worksheet.getRow(1);

    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD700" },
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    data.forEach((item) => {
      const casseteA = Number(item.cassete_A ?? 0);
      const casseteB = Number(item.cassete_B ?? 0);
      const casseteC = Number(item.cassete_C ?? 0);
      const casseteD = Number(item.cassete_D ?? 0);

      const total = generateRealTotal(
        casseteA * 10,
        casseteB * 20,
        casseteC * 50,
        casseteD * 100
      );

      const row = worksheet.addRow([
        item.id_atm ?? "",
        item.total_exchange ? "S" : "N",
        casseteA,
        casseteB,
        casseteC,
        casseteD,
        item.date_on_supply ? formatDateToString(item.date_on_supply as string) : "",
        "",
        total,
      ]);

      row.eachCell((cell) => {
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = "abastecimentos.xlsx";
    link.click();

    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Erro ao gerar excel:", error);
    return false;
  }
};