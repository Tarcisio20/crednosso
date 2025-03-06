import { Prisma } from "@prisma/client"
import { prisma } from "../utils/prisma"


export const getOrderById = async  (id : number) => {
    const order = await prisma.order.findMany({
        where : {
           id,
           status_order : {
            not : 5
           }
        }
    })
    if(order){
        return order
    }
    return null
}

export const addOrder = async (data : Prisma.OrderCreateInput) => {
    const order = await prisma.order.create({ data })
    if(order){
        return order
    }
    return null
}

type alterRequestsOrderType = {
    requested_value_A : number;
    requested_value_B : number;
    requested_value_C : number;
    requested_value_D : number;
}
export const alterRequestsOrderForID = async (id : number, data : alterRequestsOrderType ) => {
    const order = await prisma.order.update({ 
        where : {
            id
        },
        data
     })
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