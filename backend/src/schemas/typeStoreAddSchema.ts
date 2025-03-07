import { z } from "zod";

export const typeStoreAddSchema = z.object({
    name : z.string({ message : 'Nome é obrigatódio' }).min(3, 'Minimo de 3 caractereis'),
    status : z.boolean({ message : 'Status é obrigatódio' }).optional()
})