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

  console.log(data)

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
    if (dadosMateus.length > 0) {
      gerarPDF("MATEUS", dadosMateus);
    }
    if (dadosPosterus.length > 0) {
      gerarPDF("POSTERUS", dadosPosterus);
    }
  };

  const gerarPDF = (titulo: string, dados: typeof data) => {
    const doc = new jsPDF({
      orientation: 'landscape',
    });
    const dataOriginal = data[0]?.date;
    const dataFormatada = dataOriginal ? formatDateToString(dataOriginal) : 'Data inválida';
    (autoTable as any)(doc, {
      startY: 20,
      head: [
        [
          {
            content: `DATA: ${dataFormatada}`,
            colSpan: 4,
            styles: {
              fillColor: [41, 128, 185],
              textColor: 255,
              fontStyle: 'bold'
            }
          },
          {
            content: "SOLCITADO",
            colSpan: 1,
            styles: {
              fillColor: [41, 128, 185],
              textColor: 255,
              fontStyle: 'bold'
            }
          }
        ],
        [
          "CONTA",
          "CÓDIGO",
          "TESOURARIA",
          "REGIÃO",
          {
            content: "VALOR",
            styles: {
              fillColor: [41, 128, 185],
              textColor: 255
            }
          }
        ]
      ],
      body: dados.map((item) => [
        item.conta.toString(),
        item.codigo.toString(),
        `TESOURARIA - ${item.tesouraria}`,
        item.regiao.toString(),
        item.valor,
      ]),
      foot: [
        [
          {
            content: "TOTAL RETIRADO",
            colSpan: 4,
            styles: {
              fillColor: [41, 128, 185],
              textColor: 255,
              fontStyle: 'bold'
            }
          },
          {
            content: formatarMoeda(calcularTotal(dados)),
            styles: {
              fillColor: [41, 128, 185],
              textColor: 255,
              fontStyle: 'bold'
            }
          }
        ]
      ],
      styles: {
        fontSize: 10,
        cellPadding: 2,
        halign: 'left'
      },
      columnStyles: {
        4: {
          cellWidth: 35,
          cellPadding: 3
        }
      },
      headerStyles: {
        fillColor: [255, 255, 255],
        textColor: 0,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fillColor: [255, 255, 255]
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      didParseCell: (data: any) => {
        if (data.section === 'head' && data.row.index === 1) {
          data.cell.styles.fillColor = [41, 128, 185];
          data.cell.styles.textColor = 255;
        }
      }
    });

    doc.save(`pedido-${formatDateToStringForTitle(dataFormatada)}-${titulo.toLowerCase()}.pdf`);
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
                : 'text-black-500 hover:text-gray-700'
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
                : 'text-black-500 hover:text-gray-700'
                }`}
            >
              Posterus
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