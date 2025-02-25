import { z } from "zod";

export const treasuryAddSchema = z.object({
    id_system : z.number({ message : 'ID é obrigatódio' }).min(1, 'Minimo de 1 caractereis'),
    name : z.string({ message : 'Nome é obrigatódio' }).min(2, 'Minimo de 2 caractereis'),
    short_name : z.string({ message : 'Nome reduzido é obrigatódio' }).min(2, 'Minimo de 2 caracteres'),
    account_number : z.string({ message : 'Numero da conta é obrigatódio' }).min(1, 'Minimo de 1 caracteres'),
    gmcore_number : z.string({ message : 'Numero do GMCore é obrigatódio' }).min(1, 'Minimo de 1 caracteres')
})