import { z } from "zod";

export const orderSearchDateSchema = z.object({
    date_initial : z.string({ message : 'Data Inicial é obrigatódio' }),
    date_final : z.string({ message : 'Data Final é  obrigatódio' }),
    page : z.string().optional(),
    pageSize : z.string().optional(),

})