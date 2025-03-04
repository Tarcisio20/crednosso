import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";


export const getAllTypeOperation = async () => {
    const typeOperation = await prisma.typeOperation.findMany()
    if(typeOperation){
        return typeOperation
    }
    return null
}

export const getTypeOperationForId = async (id : string) => {
    const typeOperation = await prisma.typeOperation.findFirst({
        where : { id : parseInt(id) }
    })
    if(typeOperation){
        return typeOperation
    }
    return null
}


export const addTypeOperation = async (data : Prisma.TypeOperationCreateInput) => {
    const typeOperation = await prisma.typeOperation.create({ data })
    if(typeOperation){
        return typeOperation
    }
    return null
}



export const updateTypeOperation = async (id: number, data : Prisma.TypeOperationUpdateInput) => {
    const editTreasury = await prisma.typeOperation.update({
        where : {
            id
        },
        data
    }) 
    if(editTreasury){
        return editTreasury
    }
    return null
}