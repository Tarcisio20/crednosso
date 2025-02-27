import { z } from "zod";

export const contactAddSchema = z.object({
    id_treasury : z.number({ message : 'ID é obrigatódio' }),
    name : z.string({ message : 'Nome é obrigatódio' }).min(2, 'Minimo de 2 caractereis'),
    email : z.string({ message : 'Email é obrigatódio' }).email('E-mail invalido'),
    phone : z.string({ message : 'Telefone é obrigatódio' }).min(3, 'Minimo de 1 caracteres'),
})