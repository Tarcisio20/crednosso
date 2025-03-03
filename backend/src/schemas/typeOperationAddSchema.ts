import { z } from "zod";

export const typeOperationdAddSchema = z.object({
    id_system : z.number({ message : 'ID é obrigatódio' }),
    name : z.string({ message : 'Nome é obrigatódio' }).min(3, 'Minimo de 3 caractereis'),
    status : z.boolean({ message : 'Status é obrigatódio' }).optional()
})