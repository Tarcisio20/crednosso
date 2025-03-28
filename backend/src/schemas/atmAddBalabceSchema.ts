import { z } from "zod";

export const atmAddBalabceSchema = z.object({

    cassete_A : z.number().optional(),
    cassete_B : z.number().optional(),
    cassete_C : z.number().optional(),
    cassete_D : z.number().optional(),
   
})