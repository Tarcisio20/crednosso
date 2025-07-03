import { z } from "zod";

export const operationalErrorAddSchema = z.object({
    id_treasury : z.number({ message : 'Erro Operacional é obrigatódio' }),
    num_os : z.number({ message : 'Número da OS é  obrigatódio' }),
    description : z.string({ message : 'Descrição é obbrigatório!' }),
    status : z.boolean().optional()
})