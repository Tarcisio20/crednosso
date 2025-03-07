import { z } from "zod";

export const treasuryAddSchema = z.object({
    id_system : z.number({ message : 'ID é obrigatódio' }).min(1, 'Minimo de 1 caractereis'),
    id_type_supply : z.number({ message : 'Tipo de Abastecimento é obrigatódio' }).min(1, 'Minimo de 1 caractereis'),
    id_type_store : z.number({ message : 'Tipo de Pagamento é obrigatódio' }),
    enabled_gmcore : z.boolean({ message : 'Ativo no GMCore é obrigatódio' }),
    name : z.string({ message : 'Nome é obrigatódio' }).min(2, 'Minimo de 2 caractereis'),
    short_name : z.string({ message : 'Nome reduzido é obrigatódio' }).min(2, 'Minimo de 2 caracteres'),
    region : z.number({ message : 'Região é obrigatódio' }),
    account_number : z.string({ message : 'Numero da conta é obrigatódio' }).min(1, 'Minimo de 1 caracteres'),
    gmcore_number : z.string({ message : 'Numero do GMCore é obrigatódio' }).min(1, 'Minimo de 1 caracteres'),
    status : z.boolean({ message : 'Status é obrigatódio' }).optional()
})