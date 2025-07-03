import { z } from "zod";

export const AddUserSchema = z.object({
    id : z.number().optional(),
    name : z.string(),
    slug : z.string().optional(),
    email : z.string().email(),
    status : z.boolean().optional(),
})