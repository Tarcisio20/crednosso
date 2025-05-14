import { z } from "zod";

export const  addRattedRefundSchema = z.object({
    id_order: z.number(),
    id_treasury_origin: z.number(),
    value: z.number(),
})
