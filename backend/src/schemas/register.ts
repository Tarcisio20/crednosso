import { z } from "zod";

export const registerSchema = z.object({
    name : z.string({ message : 'Nome é obrigatódio' }).min(2, 'Minimo de 2 caractereis'),
    email : z.string({ message : 'E-mail é obrigatódio' }).email('E-mail invalido'),
    password : z.string({ message : 'Senha é obrigatódio' }).min(4, 'Minimo de 4 caracteres')
})