import { Prisma } from "@prisma/client"
import { prisma } from "../utils/prisma"

export const addOrder = async (data : Prisma.OrderCreateInput) => {
    const order = await prisma.order.create({ data })
    if(order){
        return order
    }
    return null
}