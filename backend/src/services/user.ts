import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma"

export const findUserByEmail = async (email : string) => {
    const user = await prisma.user.findFirst({
        where : { email }
    })
    if(user){
        return user;
    }
    return null;
}


export const findUserBySlug = async (slug : string) => {
    const user = await prisma.user.findFirst({
        select : {
            name : true,
            email : true,
            slug : true
        },
        where : { slug }
    })
    console.log("USUARIO SERVICE", user)
    if(user){
        return user;
    }
    return null;
}

export const createUser = async (data : Prisma.UserCreateInput) => {
    const user = await prisma.user.create({ data })
    if(user) {
        return user
    }

    return null
}