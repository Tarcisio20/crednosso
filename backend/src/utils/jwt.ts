import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { findUserBySlug } from "../services/user"
import { ExtendedRequest } from "../types/extended-request"

export const createJWT = (slug : string) => {
    return jwt.sign({ slug }, process.env.JWT_SECRET as string)
}

export const verifyJWT =  (req : ExtendedRequest, res : Response, next : NextFunction) => {
    const authHeader = req.headers['authorization']
    if(!authHeader){
        res.status(401).json({ error : 'Acesso negado!' })
        return
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(
        token,
        process.env.JWT_SECRET  as string,
        async (error, decoded : any) =>  {
            if(error){
                res.status(401).json({ error : 'Acesso negado!' })
                return 
            }
            const user = await findUserBySlug(decoded.slug)
            console.log("CONSULTA DO USER", user)
            if(!user){
                res.status(401).json({ error : 'Acesso negado!' })
                return   
            }
            console.log("User", user)
            req.userSlug = user.slug
            next()
    })
 
    
}