import { z } from "zod";

export const atmAddSchema = z.object({
    id_system : z.number({ message : 'ID é obrigatódio' }),
    name : z.string({ message : 'Nome é obrigatódio' }).min(2, 'Minimo de 2 caractereis'),
    short_name : z.string({ message : 'Nome reduzido é obrigatódio' }).min(2, 'Minimo de 2 caracteres'),
    id_treasury : z.number({ message : 'Numero da conta é obrigatódio' }),
    cassete_A : z.number({ message : 'Numero Cassete A é obrigatódio' }).min(1, 'Minimo de 1 caracteres'),
    cassete_B : z.number({ message : 'Numero Cassete B é obrigatódio' }).min(1, 'Minimo de 1 caracteres'),
    cassete_C : z.number({ message : 'Numero Cassete C é obrigatódio' }).min(1, 'Minimo de 1 caracteres'),
    cassete_D : z.number({ message : 'Numero Cassete D é obrigatódio' }).min(1, 'Minimo de 1 caracteres')
})