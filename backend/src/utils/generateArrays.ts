export type pdfGeneratorPaymentType = {
  aux?: Record<string, unknown>[];
  id_type_operation?: number;
  id_order?: number;
  codigo: number;
  conta: string;
  tesouraria: string;
  regiao: number;
  gmcore: string;
  valor: string;
  id_type_store: number;
  date: string;
  valorRealizado: string;
  estorno: string;
  conta_pagamento: string;
  codigo_destin: number;
  tesouraria_origem: string;
  type?: string;
};

export type bankType = {
    id ?: number;
    name : string;
    bank_branch : string;
    bank_branch_digit : string;
    account : string;
    account_digit : string;
    hash : string;
    type : string;
    status : boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

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
