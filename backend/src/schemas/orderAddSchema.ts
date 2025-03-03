import { z } from "zod";

export const orderAddSchema = z.object({
    id_type_operation : z.number({ message : 'Tipo de operação é obrigatódio' }),
    id_treasury_origin : z.number({ message : 'Transportadora de Origem é  obrigatódio' }),
    id_treasury_destin : z.number({ message : 'Transportadora de Destino é obrigatódio' }),
    id_type_order : z.number({ message : 'Tipo de pedido é obrigatódio' }),
    date_order : z.string({ message : 'Data do Pedido é obrigatódio' }),
    requested_value_A : z.number({ message : 'Valor de R$ 10,00 é obrigatódio' }),
    requested_value_B : z.number({ message : 'Valor de R$ 20,00 é obrigatódio' }),
    requested_value_C : z.number({ message : 'Valor de R$ 50,00 é obrigatódio' }),
    requested_value_D : z.number({ message : 'Valor de R$ 100,00 é obrigatódio' }),
    composition_change : z.boolean().optional(),
    confirmed_value_A : z.number().optional(),
    confirmed_value_B : z.number().optional(),
    confirmed_value_C : z.number().optional(),
    confirmed_value_D : z.number().optional(),
    status_order : z.number({ message : 'Status do pedido é obrigatório'}),
    observation : z.string().optional()
})