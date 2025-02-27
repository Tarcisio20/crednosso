import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";

export const addTypeOperation = async (data : Prisma.TypeOperationCreateInput) => {
    const typeOperation = await prisma.typeOperation.create({ data })
    if(typeOperation){
        return typeOperation
    }
    return null
}
