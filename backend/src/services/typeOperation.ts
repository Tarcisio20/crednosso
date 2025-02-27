import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";


export const getAllTypeOperation = async () => {
    const typeOperation = await prisma.typeOperation.findMany()
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
