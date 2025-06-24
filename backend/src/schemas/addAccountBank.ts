import { z } from "zod";

export const AccontBankAddSchema = z.object({
    name : z.string({ message : 'Nome é obrigatódio' }).min(2, 'Minimo de 2 caractereis'),
    bank_branch : z.string({ message : 'Número da Agência é obrigatódio' }).min(2, 'Minimo de 2 caracteres'),
    bank_branch_digit : z.string({ message : 'Digito da Agência é obrigatódio' }),
    account : z.string({ message : 'Numero da conta é obrigatódio' }),
    account_digit : z.string({ message : 'Numerodo digito da conta é obrigatódio' }),
    status : z.boolean({ message : 'Status é obrigatódio' }).optional()
})