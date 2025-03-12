import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";

export const getAllTypeOrder = async () => {
    const typeOrder = await prisma.typeOrder.findMany({
        where : { status : true }
    })
    if(typeOrder){
        return typeOrder
    }
    return null
}

export const getAllTypeOrderPagination = async (page: number, pageSize: number) => {
    try {
        const skip = (page - 1) * pageSize;
        const [data, totalItems] = await prisma.$transaction([
            prisma.typeOrder.findMany({
                skip: skip,
                take: pageSize,
                where: { status: true },
                orderBy: { id: 'asc' }
            }),
            prisma.typeOrder.count({
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