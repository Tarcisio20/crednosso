import { z } from "zod";

export const supplyAddSchema = z.object({
    id_atm : z.number({ message : 'ID é obrigatódio' }).min(1, 'Minimo de 1 caractereis'),
    id_treasury : z.number().optional(),
    name : z.string().optional(),
    short_name : z.string().optional(),
    total_exchange: z.boolean().optional(),
    cassete_A : z.number().optional(),
    cassete_B : z.number().optional(),
    cassete_C : z.number().optional(),
    cassete_D : z.number().optional(),
    date_on_supply : z.string().optional(),
    date : z.string().optional(),
    id_order : z.number().optional()
})
