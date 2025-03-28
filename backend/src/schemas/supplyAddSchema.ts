import { z } from "zod";

export const supplyAddSchema = z.object({
    id_atm : z.number({ message : 'ID é obrigatódio' }).min(1, 'Minimo de 1 caractereis'),
    cassete_A : z.number().optional(),
    cassete_B : z.number().optional(),
    cassete_C : z.number().optional(),
    cassete_D : z.number().optional(),
    total_exchange : z.boolean(),
    status : z.boolean().optional()
})