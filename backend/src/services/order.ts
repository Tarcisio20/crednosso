import { Prisma } from "@prisma/client"
import { prisma } from "../utils/prisma"

export const addOrder = async (data : Prisma.OrderCreateInput) => {
    const order = await prisma.order.create({ data })
    if(order){
        return order
    }
    return null
}

export const searchByOrderDate = async  (data : { date_initial : Date, date_final : Date }) => {
    const order = await prisma.order.findMany({
        where : {
            date_order : {
                gte : data.date_initial,
                lte : data.date_final
            }
        }
    })
    if(order){
        return order
    }
    return null
}