import { z } from "zod";

export const AddIndividualSchema = z.object({
    id_atm : z.number(),
    id_treasury : z.number(),
    name : z.string(),
    short_name : z.string(),
    check : z.boolean(),
    type : z.string(),
    cass_A : z.number(),
    cass_B : z.number(),
    cass_C : z.number(),
    cass_D : z.number(),
})