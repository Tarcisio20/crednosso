"use client"

import { formatDateToString } from "@/app/utils/formatDateToString";
import { pdfGeneratorPaymentType } from "@/types/pdfGeneratorPaymentType";
import jsPDF from "jspdf";
import { useState } from "react";
import autoTable from "jspdf-autotable";
import { formatDateToStringForTitle } from "@/app/utils/formatDateToStringForTitle";
import { generateExcelGMCORE } from "@/app/utils/generateExcelGMCORE";
import { sleep } from "@/app/utils/slep";
import { bankType } from "@/types/bankType";

type pdfProps = {
  data: pdfGeneratorPaymentType[];
  banks: bankType[];
  onClose: () => void;
}

export const PdfGeneratorPayment = ({ data, banks, onClose }: pdfProps) => {
  const [abaAtiva, setAbaAtiva] = useState(1)
  const dadosMateus = data.filter(item => item.id_type_store === 1);
  const dadosPosterus = data.filter(item => item.id_type_store === 2);

  const acount1: any = []
  const acount2: any = []
  const acount3: any = []
  const acount4: any = []
  const filterContas = data.filter(item => {
    let c = item.conta_pagamento.split('Conta: ')[1].split('-')[0].trim()
    if (c && c === banks[0].account) {
      acount1.push(item)
    } else if (c && c === banks[1].account) {
      acount2.push(item)
    } else if (c && c === banks[2].account) {
      acount3.push(item)
    } else {
      acount4.push(item)
    }

  })

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
      return acc + converterParaNumero(item.valorRealizado);
    }, 0);
  };

  const calcularTotalEstorno = (dados: typeof data) => {
    return dados.reduce((acc, item) => {
      return acc + converterParaNumero(item.estorno);
    }, 0);
  };

  const handleGenerateGMCore = async (dados: typeof data) => {

    const excel = await generateExcelGMCORE(dados)
  }

  const totalMateus = calcularTotal(dadosMateus);
  const totalPosterus = calcularTotal(dadosPosterus);

  const formatarMoeda = (valor: number) =>
    valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });


  const handleGeneratePDF = async () => {

    if (acount1.length > 0) {
      gerarPDF("Mateus", acount1)
    }
    await sleep(2000)
    if (acount2.length > 0) {
      gerarPDF("Mateus", acount2)
    }
    await sleep(2000)
    if (acount3.length > 0) {
      gerarPDF("Mateus", acount3)
    }
    if (acount4.length > 0) {
      gerarPDF("Mateus", acount4)
    }
    await sleep(2000)
    handleGenerateGMCore(dadosMateus)
    /* if (dadosMateus.length > 0) {
       gerarPDF("MATEUS", dadosMateus);
       await sleep(2000)
       handleGenerateGMCore(dadosMateus)
     }
     await sleep(2000)
     if (dadosPosterus.length > 0) {
       gerarPDF("POSTERUS", dadosPosterus);
     }*/
  };


  const gerarPDF = (titulo: string, dados: typeof data) => {
    const doc = new jsPDF({
      orientation: 'landscape',
    });
    const dataOriginal = dados[0]?.date;
    const dataFormatada = dataOriginal ? formatDateToString(dataOriginal) : 'Data inválida';

    // Configuração de larguras fixas (em mm) para preencher a página em landscape (280mm)
    const columnStyles = {
      0: { cellWidth: 30 },  // CONTA
      1: { cellWidth: 20 },  // CÓDIGO
      2: { cellWidth: 100 }, // TESOURARIA (ajustado para evitar overflow)
      3: { cellWidth: 30 },  // PAGAMENTO
      4: { cellWidth: 40 },  // VALOR 
      5: { cellWidth: 50 },  // VALOR
    };

    (autoTable as any)(doc, {
      startY: 15, // Início com margem superior para não cortar
      head: [
        [
          {
            content: `DATA: ${dataFormatada}`,
            colSpan: 5,
            styles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' }
          },
          {
            content: "TRANSF. BANCO",
            styles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' }
          }
        ],
        [
          { content: "CONTA", styles: { fillColor: [41, 128, 185], textColor: 255 } },
          { content: "LOJA", styles: { fillColor: [41, 128, 185], textColor: 255 } },
          { content: "TESOURARIA", styles: { fillColor: [41, 128, 185], textColor: 255 } },
          { content: "CONTA PGTO.", styles: { fillColor: [41, 128, 185], textColor: 255 } },
          { content: "VALOR ESTORNO", styles: { fillColor: [41, 128, 185], textColor: 255 } },
          { content: "VALOR REALIZADO", styles: { fillColor: [41, 128, 185], textColor: 255 } }
        ]
      ],
      body: dados.map((item) => [
        item.conta.toString(),
        item.gmcore,
        `TESOURARIA - ${item.tesouraria}`,
        item.conta_pagamento,
        item.estorno.toString(),
        item.valorRealizado.toString(),
      ]),
      foot: [[
        {
          content: "TOTAIS",
          colSpan: 4,
          styles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' }
        },
        {
          content: formatarMoeda(calcularTotalEstorno(dados)),
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
      showFoot: 'lastPage'
    });
    let a = dados[0].conta_pagamento.split('Agência: ')[1].split(' - ')[0].trim()
    let c = dados[0].conta_pagamento.split('Conta: ')[1].trim()

    if (c === "6886-1") {
      doc.save(`pedido-${formatDateToStringForTitle(dataFormatada)}-posterus-agencia-${a}-conta-${c}-a.pdf`);
    }else {
      doc.save(`pedido-${formatDateToStringForTitle(dataFormatada)}-mateus-agencia-${a}-conta-${c}-a.pdf`);
    }

    //doc.save(`pedido-${formatDateToStringForTitle(dataFormatada)}-${titulo.toLowerCase()}-a.pdf`);

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

        </div>
      </div>

    </div>
  );

  // Componente de Tabela Reutilizável
  const Tabela = ({ dados, total, totalEstorno }: { dados: typeof data; total: number, totalEstorno: number }) => (
    <table className="w-full border-collapse border border-black font-sans text-black">
      <thead>
        <tr className="bg-blue-600 text-white font-bold">
          <td className="p-2 border border-black">DATA: {formatDateToString(data[0]?.date)}</td>
          <td className="p-2 border border-black" colSpan={4}></td>
          <td className="p-2 border border-black">REALIZADO</td>
        </tr>
        <tr className="bg-blue-600 text-white font-bold">
          <th className="p-2 border border-black text-left">CONTA</th>
          <th className="p-2 border border-black text-left">LOJA</th>
          <th className="p-2 border border-black text-left">TESOURARIA</th>
          <th className="p-2 border border-black text-left">CONTA PGTO</th>
          <th className="p-2 border border-black text-left">VALOR ESTORNADO</th>
          <th className="p-2 border border-black text-left">VALOR REALIZADO</th>
        </tr>
      </thead>
      <tbody>
        {dados.map((item, index) => (
          <tr key={index} className={index % 2 === 0 ? 'bg-blue-50' : ''}>
            <td className="p-2 border border-black">{item.conta}</td>
            <td className="p-2 border border-black">{item.gmcore}</td>
            <td className="p-2 border border-black">TESOURARIA - {item.tesouraria}</td>
            <td className="p-2 border border-black">{item.conta_pagamento}</td>
            <td className="p-2 border border-black">{item.estorno}</td>
            <td className="p-2 border border-black">{item.valorRealizado}</td>
          </tr>
        ))}
        <tr className="bg-blue-200 font-bold">
          <td className="p-2 border border-black" colSpan={4}>TOTAIS</td>
          <td className="p-2 border border-black">
            {totalEstorno.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </td>
          <td className="p-2 border border-black">
            {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </td>
        </tr>
      </tbody>
    </table>
  );

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
          PAGAMENTO {abaAtiva === 1 ? 'MATEUS' : 'POSTERUS'}
        </h2>

        <Tabs />

        <div className="flex-1 overflow-auto">
          {abaAtiva === 1 && dadosMateus.length > 0 && (
            <Tabela dados={dadosMateus} total={calcularTotal(dadosMateus)} totalEstorno={calcularTotalEstorno(dadosMateus)} />
          )}

          {abaAtiva === 2 && dadosPosterus.length > 0 && (
            <Tabela dados={dadosPosterus} total={calcularTotal(dadosPosterus)} totalEstorno={calcularTotalEstorno(dadosPosterus)} />
          )}
        </div>
      </div>
    </div>
  );
};