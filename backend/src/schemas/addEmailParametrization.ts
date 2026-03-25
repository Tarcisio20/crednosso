import { z } from "zod";

export const EmailParametrizationAddSchema = z.object({
    name : z.string().min(2, 'Minimo de 2 caractereis').optional(),
    email : z.string({message : 'Email é obrigatorio'}),
    for_send_slug : z.string({ message : 'Tipo de Loja é obrigatorio' }),
    status : z.boolean({ message : 'Status é obrigatódio' }).optional()
})