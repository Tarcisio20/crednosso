import { z } from "zod";

export const orderEditSchema = z.object({
    id_type_operation : z.number().optional(),
    id_treasury_origin : z.number().optional(),
    id_treasury_destin : z.number().optional(),
    date_order : z.string().optional(),
    id_type_order : z.number().optional(),
    requested_value_A : z.number().optional(),
    requested_value_B : z.number().optional(),
    requested_value_C : z.number().optional(),
    requested_value_D : z.number().optional(),
    confirmed_value_A :  z.number().optional(),
    confirmed_value_B :  z.number().optional(),
    confirmed_value_C :  z.number().optional(),
    confirmed_value_D :  z.number().optional(),
    status_order   : z.number().optional(),
    composition_change : z.boolean(),
    observation : z.string().optional(),
})