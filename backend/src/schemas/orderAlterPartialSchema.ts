import { z } from "zod";

export const orderAlterPartialSchema = z.object({
    confirmed_value_A :  z.number({ message : 'Valor A é obrigatódio' }),
    confirmed_value_B : z.number({ message : 'Valor B é obrigatódio' }),
    confirmed_value_C : z.number({ message : 'Valor C é obrigatódio' }),
    confirmed_value_D : z.number({ message : 'Valor D é obrigatódio' }),
    status_order   : z.number({ message : 'Valor D é obrigatódio' }),
    for_release : z.boolean(),
    composition_change : z.boolean(),
})