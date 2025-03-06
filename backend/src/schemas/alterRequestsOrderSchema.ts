import { z } from "zod";

export const alterRequestsOrderSchema = z.object({
    requested_value_A : z.number({ message : 'Valor de R$ 10,00 é obrigatódio' }),
    requested_value_B : z.number({ message : 'Valor de R$ 20,00 é obrigatódio' }),
    requested_value_C : z.number({ message : 'Valor de R$ 50,00 é obrigatódio' }),
    requested_value_D : z.number({ message : 'Valor de R$ 100,00 é obrigatódio' }),
})