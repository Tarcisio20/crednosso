import ExcelJS from "exceljs";

export type OperationalErrorType = {
  id?: number;
  id_treasury: number;
  num_os: number;
  description: string;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type OperationalErrorData = OperationalErrorType[];

const formatExcelDate = (date?: string) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate;
};

export const GenerateExcelErros = async (data: OperationalErrorData) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Erros");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Tesouraria", key: "id_treasury", width: 15 },
      { header: "Nº OS", key: "num_os", width: 15 },
      { header: "Descrição", key: "description", width: 60 },
      { header: "Status", key: "status", width: 15 },
      { header: "Data Criação", key: "createdAt", width: 20 },
    ];

    worksheet.views = [{ state: "frozen", ySplit: 1 }];

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
      const row = worksheet.addRow([
        item.id ?? "",
        item.id_treasury ?? "",
        item.num_os ?? "",
        item.description ?? "",
        item.status === undefined ? "" : item.status ? "Ativo" : "Inativo",
        formatExcelDate(item.createdAt),
      ]);

      row.eachCell((cell, colNumber) => {
        cell.alignment = {
          horizontal: colNumber === 4 ? "left" : "center",
          vertical: "middle",
          wrapText: colNumber === 4,
        };

        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };

        if (colNumber === 6 && cell.value instanceof Date) {
          cell.numFmt = "dd/mm/yyyy";
        }
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer as BlobPart], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = "erros_operacionais.xlsx";
    link.click();

    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Erro ao gerar excel de erros:", error);
    return false;
  }
};