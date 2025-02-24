import { RequestHandler } from "express";
import { registerSchema } from "../schemas/register";
import { createUser, findUserByEmail, findUserBySlug } from "../services/user";
import slug from "slug";
import { compare, hash } from "bcrypt-ts";
import { createJWT } from "../utils/jwt";
import { loginSchema } from "../schemas/login";

export const register : RequestHandler = async (req, res) => {
    const safeData = registerSchema.safeParse(req.body)
    if(!safeData.success){
        res.json({ error : safeData.error.flatten().fieldErrors })
        return 
    }
    const hasEmail = await findUserByEmail(safeData.data.email)
    if(hasEmail){
        res.json({ error : 'E-mail já existe' })
        return
    }
    let genSlug = true
    let userSlug = slug(safeData.data.name)
    while(genSlug) {
        const hasSlug = await findUserBySlug(userSlug)
        if(hasSlug) {
            let slugSuffix = Math.floor(Math.random() * 999999).toString()
            userSlug = slug(safeData.data.name + slugSuffix)
        }else{
            genSlug = false
        }
    }
    const hasPassword = await hash(safeData.data.password, 10)
    const newUser = await createUser({
        name : safeData.data.name,
        slug : userSlug,
        email : safeData.data.email,
        password : hasPassword
    })

    const token = createJWT(userSlug)

    res.status(201).json({
        token,
        user : {
            id : newUser?.id,
            name : newUser?.name,
            slug : newUser?.slug,
            email : newUser?.email
        }
     })
}

export const login : RequestHandler = async (req, res) => {
    const safeData = loginSchema.safeParse(req.body)
    if(!safeData.success){
        res.json({ error : safeData.error.flatten().fieldErrors })
        return 
    }
    const user = await findUserByEmail(safeData.data.email)
    if(!user) {
        res.status(401).json({ error : 'Acesso negado!' })
        return
    }
    const verifyPass = await compare(safeData.data.password, user.password)
    if(!verifyPass){
        res.status(401).json({ error : 'Acesso negado!' })
        return
    }

    const token = createJWT(user.slug)

    res.json({
        token,
        user : {
            id: user.id,
            name : user.name,
            email : user.email,
            slug : user.slug
        }
    })

}