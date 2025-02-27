import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";


export const getAllTypeOrder = async () => {
    const typeOrder = await prisma.typeOrder.findMany()
    if(typeOrder){
        return typeOrder
    }
    return null
}

export const getTypeOrderForId = async (id : string) => {
    const typeOrder = await prisma.typeOrder.findFirst({
        where : { id : parseInt(id) }
    })
    if(typeOrder ){
        return typeOrder 
    }
    return null
}


export const addTypeOrder = async (data : Prisma.TypeOrderCreateInput) => {
    const typeOrder = await prisma.typeOrder.create({ data })
    if(typeOrder){
        return typeOrder
    }
    return null
}

export const updateTypeOrder = async (id: number, data : Prisma.TypeOrderUpdateInput) => {
    const editOrder = await prisma.typeOrder.update({
        where : {
            id
        },
        data
    }) 
    if(editOrder){
        return editOrder
    }
    return null
}