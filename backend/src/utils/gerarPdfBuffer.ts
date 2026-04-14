import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
export const gerarPdfBuffer = async (titulo: string, dados: any[]) => {
  const doc = new jsPDF({
    orientation: "landscape",
  })

  ;(autoTable as any)(doc, {
    startY: 15,
    head: [[
      { content: "CONTA" },
      { content: "LOJA" },
      { content: "TESOURARIA" },
      { content: "CONTA PGTO." },
      { content: "VALOR ESTORNO" },
      { content: "VALOR REALIZADO" },
    ]],
    body: dados.map((item) => [
      item.conta?.toString() ?? "",
      item.gmcore ?? "",
      item.tesouraria ?? "",
      item.conta_pagamento ?? "",
      item.estorno?.toString() ?? "0",
      item.valorRealizado?.toString() ?? "0",
    ]),
  })

  return Buffer.from(doc.output("arraybuffer"))
}