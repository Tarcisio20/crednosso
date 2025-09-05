import { bankType } from "@/types/bankType";
import { pdfGeneratorPaymentType } from "@/types/pdfGeneratorPaymentType";

export const GenerateArrays = (
  banks: bankType[],
  data: pdfGeneratorPaymentType[]
) => {
  const arraysPorHash: Record<
    string,
    { type: string; data: pdfGeneratorPaymentType[] }
  > = {};

  banks.forEach((bank) => {
    const key = String(bank.hash ?? "").trim();
    if (key) {
      arraysPorHash[key] = { type: bank.type, data: [] };
    }
  });

  data.forEach((item) => {
    const hashFromConta = String(item.conta_pagamento ?? "").replace(/\D/g, "");
    if (!hashFromConta) return;

    // só inclui se id_type_operation for 1 ou 2
    if ((item.id_type_operation === 1 || item.id_type_operation === 2) && arraysPorHash[hashFromConta]) {
      arraysPorHash[hashFromConta].data.push(item);
    }
  });

  // transforma o objeto em array
  return Object.values(arraysPorHash);
};
