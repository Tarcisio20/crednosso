import { z } from "zod";

export const supplyAddSchema = z.object({
    id_atm : z.number({ message : 'ID é obrigatódio' }).min(1, 'Minimo de 1 caractereis'),
    id_treasury : z.number().optional(),
    name : z.string().optional(),
    short_name : z.string().optional(),
    check : z.boolean().optional(),
    type : z.string().optional(),
    cass_A : z.number().optional(),
    cass_B : z.number().optional(),
    cass_C : z.number().optional(),
    cass_D : z.number().optional(),
    date : z.string().optional(),
    order : z.string().optional()
})
