import { Prisma } from "@prisma/client"
import { prisma } from "../utils/prisma"

export const getAllStatusOrder = async () => {
    const statusOrder = await prisma.statusOrder.findMany({
        where : { status : true }
    })
    if(statusOrder){
        return statusOrder
    }
    return null
}

export const getAllStatusOrderPagination = async (page: number, pageSize: number) => {
    try {
        const skip = (page - 1) * pageSize;
        const [data, totalItems] = await prisma.$transaction([
            prisma.statusOrder.findMany({
                skip: skip,
                take: pageSize,
                where: { status: true },
                orderBy: { id: 'asc' }
            }),
            prisma.statusOrder.count({
                where: { status: true }
            })
        ])

        return {
            data,
            totalItems,
            totalPages: Math.ceil(totalItems / pageSize)
        };
    } catch (error) {
        console.error('Erro no service:', error);
        return null;
    }
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

export const delStatusOrder = async (id: number) => {
    const delSOrder = await prisma.statusOrder.update({
        where : {
            id
        },
        data : {
            status : false
        }
    }) 
    if(delSOrder){
        return delSOrder
    }
    return null
}
