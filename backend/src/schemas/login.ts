import { z } from "zod";

export const loginSchema = z.object({
    email : z.string({ message : 'E-mail é obrigatódio' }).email('E-mail invalido'),
    password : z.string({ message : 'Senha é obrigatódio' }).min(4, 'Minimo de 4 caracteres')
})