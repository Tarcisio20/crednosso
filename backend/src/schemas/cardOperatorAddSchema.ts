import { z } from "zod";

export const cardOperatorAddSchema = z.object({
    id_treasury : z.number({ message : 'ID é obrigatódio' }),
    name : z.string({ message : 'Nome é obrigatódio' }).min(2, 'Minimo de 2 caractereis'),
    number_card : z.string({ message : 'Numero do cartão é obrigatódio' }).min(2, 'Minimo de 2 caractereis'),
    inUse : z.boolean().optional(),
    status : z.boolean({ message : 'Status é obrigatódio' }).optional(),
})