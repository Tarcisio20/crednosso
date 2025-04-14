"use client"

import { formatDateToString } from "@/app/utils/formatDateToString";
import { pdfGeneratorReleaseType } from "@/types/pdfGeneratorReleaseType";
import jsPDF from "jspdf";
import autoTable  from 'jspdf-autotable';
import { useState } from "react";
import { formatDateToStringForTitle } from "@/app/utils/formatDateToStringForTitle";

type pdfProps = {
  data: pdfGeneratorReleaseType[];
  onClose: () => void;
}

export const PdfGenerator = ({ data, onClose }: pdfProps) => {
  const [abaAtiva, setAbaAtiva] = useState(1)
  const dadosMateus = data.filter(item => item.id_type_store === 1 && item.type_operation !== 3);
  const dadosPosterus = data.filter(item => item.id_type_store === 2 && item.type_operation !== 3);
  const dadosEntreTesourarias = data.filter(item => item.type_operation === 3)

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
  const totalEntreTesourarias = calcularTotal(dadosEntreTesourarias)

  const formatarMoeda = (valor: number) =>
    valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });


  const handleGeneratePDF = () => {
    if (dadosMateus.length > 0) {
      gerarPDF("MATEUS", 'mateus', dadosMateus);
    }
    if (dadosPosterus.length > 0) {
      gerarPDF("POSTERUS", 'posterus', dadosPosterus);
    }
    if (dadosEntreTesourarias.length > 0) {
      gerarPDF("ENTRE TESOURARIAS", 'entre-tesourarias', dadosEntreTesourarias);
    }
  };


  const gerarPDF = (titulo: string, type : string, dados: typeof data) => {

    if (type === "entre-tesourarias") {
      console.log(dados)
      const doc = new jsPDF({
        orientation: 'landscape',
      });
      const dataOriginal = dados[0]?.date;
      const dataFormatada = dataOriginal ? formatDateToString(dataOriginal) : 'Data inválida';
      const columnStyles = {
        0: { cellWidth: 40 },  // CONTA
        1: { cellWidth: 60 },  // CÓDIGO
        2: { cellWidth: 50 }, // TESOURARIA (ajustado para evitar overflow)
        3: { cellWidth: 40 },  // REGIÃO
        4: { cellWidth: 60 },  // VALOR
      };
      (autoTable as any)(doc, {
        startY: 15, // Início com margem superior para não cortar
        head: [
          [
            {
              content: `DATA: ${dataFormatada}`,
              colSpan: 5,
              styles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold',  halign: 'center' }
            }
          ],
          [
            { content: "SAIDA",  colSpan: 2, styles: { fillColor: [41, 128, 185], textColor: 255,  halign: 'center' } },
            { content: "VALOR", styles: { fillColor: [41, 128, 185], textColor: 255,  halign: 'center' } },
            { content: "ENTRADA",   colSpan: 2, styles: { fillColor: [41, 128, 185], textColor: 255,  halign: 'center' } },
          ]
          ,
          [
            { content: "CODIGO - SAIDA", styles: { fillColor: [41, 128, 185], textColor: 255,  halign: 'center' } },
            { content: "TESOURARIA - SAIDA", styles: { fillColor: [41, 128, 185], textColor: 255,  halign: 'center' } },
            { content: "VALOR TRANSFERIDO", styles: { fillColor: [41, 128, 185], textColor: 255,  halign: 'center' } },
            { content: "CODIGO - ENTRADA", styles: { fillColor: [41, 128, 185], textColor: 255,  halign: 'center' } },
            { content: "TESOURARIA - ENTRADA", styles: { fillColor: [41, 128, 185], textColor: 255,  halign: 'center' } },
          ]
        ],
        body: dados.map((item) => [
          item.conta_origem.toString(),
          `${item.tesouraria_origem}`,
          item.valor,
          item.conta.toString(),
          `${item.tesouraria}`,
        ]),
        foot: [[
          {
            content: "TOTAL ",
            colSpan: 2,
            styles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' }
          },
          {
            content: formatarMoeda(calcularTotal(dados)),
            colSpan: 3,
            styles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold',  halign: 'right' }
          }
        ]],
        styles: {
          fontSize: 10,
          cellPadding: 2,
          halign: 'left',
          overflow: 'linebreak'
        },
        columnStyles: columnStyles,
        theme: 'grid',
        margin: { left: 15, right: 15 },
        tableWidth: 250, // Largura total fixa (280mm - margens)
        showHead: 'firstPage',
        showFoot: 'lastPage',
        alternateRowStyles: { fillColor: [240, 240, 240] }
      });

      doc.save(`entre-tesourarias-${formatDateToStringForTitle(dataFormatada)}.pdf`);
      return console.log(dataFormatada)
    } else {

      const doc = new jsPDF({
        orientation: 'landscape',
      });
      const dataOriginal = dados[0]?.date;
      const dataFormatada = dataOriginal ? formatDateToString(dataOriginal) : 'Data inválida';

      // Configuração de larguras fixas (em mm) para preencher a página em landscape (280mm)
      const columnStyles = {
        0: { cellWidth: 40 },  // CONTA
        1: { cellWidth: 30 },  // CÓDIGO
        2: { cellWidth: 130 }, // TESOURARIA (ajustado para evitar overflow)
        3: { cellWidth: 30 },  // REGIÃO
        4: { cellWidth: 40 },  // VALOR
      };

      (autoTable as any )(doc, {
        startY: 15, // Início com margem superior para não cortar
        head: [
          [
            {
              content: `DATA: ${dataFormatada}`,
              colSpan: 4,
              styles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' }
            },
            {
              content: "SOLICITADO",
              styles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' }
            }
          ],
          [
            { content: "CONTA", styles: { fillColor: [41, 128, 185], textColor: 255 } },
            { content: "CÓDIGO", styles: { fillColor: [41, 128, 185], textColor: 255 } },
            { content: "TESOURARIA", styles: { fillColor: [41, 128, 185], textColor: 255 } },
            { content: "REGIÃO", styles: { fillColor: [41, 128, 185], textColor: 255 } },
            { content: "VALOR", styles: { fillColor: [41, 128, 185], textColor: 255 } }
          ]
        ],
        body: dados.map((item) => [
          item.conta.toString(),
          item.codigo.toString(),
          `TESOURARIA - ${item.tesouraria}`,
          item.regiao.toString(),
          item.valor,
        ]),
        foot: [[
          {
            content: "TOTAL RETIRADO",
            colSpan: 4,
            styles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' }
          },
          {
            content: formatarMoeda(calcularTotal(dados)),
            styles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' }
          }
        ]],
        styles: {
          fontSize: 10,
          cellPadding: 2,
          halign: 'left',
          overflow: 'linebreak'
        },
        columnStyles: columnStyles,
        theme: 'grid',
        margin: { left: 15, right: 15 },
        tableWidth: 250, // Largura total fixa (280mm - margens)
        showHead: 'firstPage',
        showFoot: 'lastPage',
        alternateRowStyles: { fillColor: [240, 240, 240] }
      });

      doc.save(`pedido-${formatDateToStringForTitle(dataFormatada)}-${titulo.toLowerCase()}.pdf`);
    }
  };

  const Tabs = () => (
    <div className="flex mb-4 border-b-2 border-gray-200">
      <div>
        <div className="w-full flex justify-center items-center">
          <button
            onClick={handleGeneratePDF}
            className="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Gerar PDF(s)
          </button>
        </div>
        <div>

          {dadosMateus.length > 0 &&
            <button
              onClick={() => setAbaAtiva(1)}
              className={`px-4 py-2 text-md font-medium ${abaAtiva === 1
                ? 'bg-blue-600 text-white  border-b-2 border-blue-600'
                : 'text-black hover:text-gray-700'
                }`}
            >
              Mateus
            </button>
          }
          {dadosPosterus.length > 0 &&
            <button
              onClick={() => setAbaAtiva(2)}
              className={`px-4 py-2 text-md font-medium ${abaAtiva === 2
                ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                : 'text-black hover:text-gray-700'
                }`}
            >
              Posterus
            </button>
          }

          {dadosEntreTesourarias.length > 0 &&
            <button
              onClick={() => setAbaAtiva(3)}
              className={`px-4 py-2 text-md font-medium ${abaAtiva === 3
                ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                : 'text-black hover:text-gray-700'
                }`}
            >
              Entre Tesourarias
            </button>
          }

        </div>
      </div>

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
        <tr className="bg-blue-600 text-white font-bold">
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
          <td className="p-2 border border-black" colSpan={4}>TOTAL SOLICITADO</td>
          <td className="p-2 border border-black">
            {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </td>
        </tr>
      </tbody>
    </table>
  );

  const TabelaEntreTesourarias = ({ dados, total }: { dados: typeof data; total: number }) => (
    <table className="w-full border-collapse border border-black font-sans text-black">
      <thead>
        <tr className="bg-blue-600 text-white font-bold">
          <td className="p-2 border border-black text-center" colSpan={5} >DATA: {formatDateToString(data[0]?.date)}</td>
        </tr>
        <tr className="bg-blue-600 text-white font-bold">
          <th className="p-2 border border-black text-center" colSpan={2}>SAIDA</th>
          <th className="p-2 border border-black text-center">VALOR</th>
          <th className="p-2 border border-black text-center" colSpan={2}>ENTRADA</th>
        </tr>
        <tr className="bg-blue-600 text-white font-bold">
          <th className="p-2 border border-black text-center">CODIGO - SAIDA</th>
          <th className="p-2 border border-black text-center">TESOURARIA - SAIDA</th>
          <th className="p-2 border border-black text-center">VALOR TRANSFERIDO</th>
          <th className="p-2 border border-black text-center">CODIGO - ENTRADA</th>
          <th className="p-2 border border-black text-center">TESOURARIA - ENTRADA</th>
        </tr>
      </thead>
      <tbody>
        {dados.map((item, index) => (
          <tr key={index} className={index % 2 === 0 ? 'bg-blue-50' : ''}>
            <td className="p-2 border border-black text-center">{item.conta_origem}</td>
            <td className="p-2 border border-black text-center">{item.tesouraria_origem}</td>
            <td className="p-2 border border-black text-center">{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
            <td className="p-2 border border-black text-center">{item.conta}</td>
            <td className="p-2 border border-black text-center">{item.tesouraria}</td>
          </tr>
        ))}
         <tr className="bg-blue-200 font-bold">
          <td className="p-2 border border-black" colSpan={2}>TOTAL SOLICITADO</td>
          <td className="p-2 border border-black text-center">
            {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </td>
          <td className="p-2 border border-black" colSpan={2}></td>
        </tr>
      </tbody>
    </table>
  )

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#dfe0e7] p-6 rounded-lg shadow-lg w-[90vw] h-[90vh] flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-2xl font-bold text-red-600 hover:text-red-700"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4 text-black text-center uppercase">
          LANÇAMENTO {abaAtiva === 1 ? ' MATEUS' : 'POSTERUS'}
        </h2>

        <Tabs />

        <div className="flex-1 overflow-auto">
          {abaAtiva === 1 && dadosMateus.length > 0 && (
            <Tabela dados={dadosMateus} total={calcularTotal(dadosMateus)} />
          )}

          {abaAtiva === 2 && dadosPosterus.length > 0 && (
            <Tabela dados={dadosPosterus} total={calcularTotal(dadosPosterus)} />
          )}

          {abaAtiva === 3 && dadosEntreTesourarias.length > 0 && (
            <TabelaEntreTesourarias dados={dadosEntreTesourarias} total={calcularTotal(dadosEntreTesourarias)} />
          )}
        </div>
      </div>
    </div>
  );
};