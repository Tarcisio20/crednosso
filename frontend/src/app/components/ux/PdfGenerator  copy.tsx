"use client"

import { formatDateToString } from "@/app/utils/formatDateToString";
import { pdfGeneratorReleaseType } from "@/types/pdfGeneratorReleaseType";
import jsPDF from "jspdf";
import { useState } from "react";
import autoTable from "jspdf-autotable";
import { formatDateToStringForTitle } from "@/app/utils/formatDateToStringForTitle";

type pdfProps = {
  data: pdfGeneratorReleaseType[];
  onClose: () => void;
}

export const PdfGenerator = ({ data, onClose }: pdfProps) => {
  const [abaAtiva, setAbaAtiva] = useState(1) 
  const dadosMateus = data.filter(item => item.id_type_store === 1);
  const dadosPosterus = data.filter(item => item.id_type_store === 2);

  const converterParaNumero = (valorString: string): number => {
    // Remove todos os caracteres não numéricos exceto vírgula
    const valorLimpo = valorString
      .replace(/[^\d,]/g, '') // Permite números e vírgula
      .replace(/\./g, '')     // Remove pontos (separadores de milhar)
      .replace(',', '.');     // Converte para formato decimal internacional
  
    const numero = parseFloat(valorLimpo);
    return isNaN(numero) ? 0 : numero;
  };
  
  

  const calcularTotal = (dados: typeof data) => {
    return dados.reduce((acc, item) => {
      return acc + converterParaNumero(item.valor);
    }, 0);
  };

  const totalMateus = calcularTotal(dadosMateus);
  const totalPosterus = calcularTotal(dadosPosterus);

  // Formatação dos totais
  const formatarMoeda = (valor: number) =>
    valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });


  const handleGeneratePDF = () => {
    gerarPDF("MATEUS", dadosMateus);
    gerarPDF("POSTERUS", dadosPosterus);
  };
  

  
  const gerarPDF = (titulo: string, dados: typeof data) => {
    const doc = new jsPDF({
      orientation: 'landscape',
    });
    const dataFormatada = formatDateToString(dados[0]?.date);
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFont("helvetica", "bold");
    doc.text(`pedido - ${formatDateToStringForTitle(dados[0]?.date)} ${titulo.toLowerCase()}`, pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(12);

    doc.text(`DATA: ${dataFormatada}`, 15, 30);
    doc.text("SOLCITADO", pageWidth - 40, 30);

    const tableData = dados.map((item) => [
      item.conta,
      item.codigo,
      `TESOURARIA - ${item.tesouraria}`,
      item.regiao,
      item.valor,
    ]);
  
    (autoTable as any)(doc, {
     head: [["CONTA", "CÓDIGO", "TESOURARIA", "REGIÃO", "VALOR"]],
        body: tableData,
        startY: 40, // Ajuste da posição inicial
        margin: { left: 10, right: 10 },
        styles: {
            fontSize: 10,
            cellPadding: 1.5,
        },
        headerStyles: {
            fillColor: [41, 128, 185], // Cor do header
            textColor: 255
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245]
        }
    });

    const total = calcularTotal(dados);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL RETIRADO: ${formatarMoeda(total)}`, 15, doc.internal.pageSize.getHeight() - 10);
  
    doc.save(`${titulo}.pdf`);
  };


  const Tabs = () => (
    <div className="flex mb-4 border-b-2 border-gray-200">
      <button
  onClick={handleGeneratePDF}
  className="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
>
  Gerar PDFs
</button>
      <button
        onClick={() => setAbaAtiva(1)}
        className={`px-4 py-2 text-md font-medium ${
          abaAtiva === 1 
          ? 'bg-blue-600 text-white  border-b-2 border-blue-600' 
          : 'text-black-500 hover:text-gray-700'
        }`}
      >
        Mateus
      </button>
      <button
        onClick={() => setAbaAtiva(2)}
        className={`px-4 py-2 text-md font-medium ${
          abaAtiva === 2
          ? 'bg-blue-600 text-white border-b-2 border-blue-600'
          : 'text-black-500 hover:text-gray-700'
        }`}
      >
        Posterus
      </button>
    </div>
  );

  // Componente de Tabela Reutilizável
  const Tabela = ({ dados, total }: { dados: typeof data; total: number }) => (
    <table className="w-full border-collapse border border-black font-sans text-black">
      <thead>
        <tr className="bg-blue-600 text-white font-bold">
          <td className="p-2 border border-black">DATA: {formatDateToString(data[0]?.date)}</td>
          <td className="p-2 border border-black" colSpan={3}></td>
          <td className="p-2 border border-black">SOLICITADO</td>
        </tr>
        <tr>
          <th className="p-2 border border-black text-left">CONTA</th>
          <th className="p-2 border border-black text-left">CODIGO</th>
          <th className="p-2 border border-black text-left">TESOURARIA</th>
          <th className="p-2 border border-black text-left">REGIÃO</th>
          <th className="p-2 border border-black text-left">VALOR</th>
        </tr>
      </thead>
      <tbody>
        {dados.map((item, index) => (
          <tr key={index} className={index % 2 === 0 ? 'bg-blue-50' : ''}>
            <td className="p-2 border border-black">{item.conta}</td>
            <td className="p-2 border border-black">{item.codigo}</td>
            <td className="p-2 border border-black">TESOURARIA - {item.tesouraria}</td>
            <td className="p-2 border border-black">{item.regiao}</td>
            <td className="p-2 border border-black">{item.valor}</td>
          </tr>
        ))}
        <tr className="bg-blue-200 font-bold">
          <td className="p-2 border border-black" colSpan={4}>TOTAL</td>
          <td className="p-2 border border-black">
            {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </td>
        </tr>
      </tbody>
    </table>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-zinc-500 p-6 rounded-lg shadow-lg w-[90vw] h-[90vh] flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-2xl font-bold text-red-600 hover:text-red-700"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4 text-black text-center uppercase">
          Solicitação {abaAtiva === 1 ? 'Mateus' : 'Posterus'}
        </h2>

        <Tabs />

        <div className="flex-1 overflow-auto">
          {abaAtiva === 1 && dadosMateus.length > 0 && (
            <Tabela dados={dadosMateus} total={calcularTotal(dadosMateus)} />
          )}

          {abaAtiva === 2 && dadosPosterus.length > 0 && (
            <Tabela dados={dadosPosterus} total={calcularTotal(dadosPosterus)} />
          )}
        </div>
      </div>
    </div>
  );
};