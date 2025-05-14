import { z } from "zod";

const addRatted = z.object({
    id_order: z.number(),
    id_treasury_origin: z.number(),
    id_treasury_rating: z.number(),
    value: z.number(),
})

export const addRattedSchema = z.array(addRatted)