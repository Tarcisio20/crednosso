import { Prisma } from "@prisma/client"
import { prisma } from "../utils/prisma"

export const getAllStatusOrder = async () => {
    const statusOrder = await prisma.statusOrder.findMany()
    if(statusOrder){
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
