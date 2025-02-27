import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";

export const addTypeOrder = async (data : Prisma.TypeOrderCreateInput) => {
    const typeOrder = await prisma.typeOrder.create({ data })
    if(typeOrder){
        return typeOrder
    }
    return null
}