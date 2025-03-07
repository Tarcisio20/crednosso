import { z } from "zod";

export const alterDateOrderSchema = z.object({
    date_order : z.string({ message : 'Data é obrigatódio' }),
})