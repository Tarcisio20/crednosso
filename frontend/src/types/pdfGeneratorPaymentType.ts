export type pdfGeneratorPaymentType = {
    aux ?: {}[], 
    id_type_operation  ?: number;
    id_order?: number;
    codigo: number;
    conta: string;
    tesouraria : string;
    regiao: number;
    gmcore : string;
    valor: string;
    id_type_store: number;
    date: string;
    valorRealizado: string;
    estorno : string;
    conta_pagamento : string;
    codigo_destin  : number;
    tesouraria_origem : string;
    type ?: string;
}