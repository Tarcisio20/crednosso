import { Prisma } from "@prisma/client"
import { prisma } from "../utils/prisma"

export const getAllStatusOrder = async () => {
    const statusOrder = await prisma.statusOrder.findMany()
    if(statusOrder){
        return statusOrder
    }
    return null
}

export const getStatusOrderForId = async (id : string) => {
    const statusOrder = await prisma.statusOrder.findFirst({
        where : { id : parseInt(id) }
    })
    if(statusOrder ){
        return statusOrder 
    }
    return null
}



export const addStatusOrder = async (data : Prisma.StatusOrderCreateInput) => {
    const statusOrder = await prisma.statusOrder.create({ data })
    if(statusOrder){
        return statusOrder
    }
    return null
}

export const updateStatusOrder = async (id: number, data : Prisma.StatusOrderUpdateInput) => {
    const editSOrder = await prisma.statusOrder.update({
        where : {
            id
        },
        data
    }) 
    if(editSOrder){
        return editSOrder
    }
    return null
}
