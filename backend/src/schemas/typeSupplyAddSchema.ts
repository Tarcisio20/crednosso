import { z } from "zod";

export const typeSupplyAddSchema = z.object({
    name : z.string({ message : 'Nome é obrigatódio' }).min(3, 'Minimo de 3 caractereis')
})