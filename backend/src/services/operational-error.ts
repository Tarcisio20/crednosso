import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";

export const getAllAtmPagination = async (page: number, pageSize: number) => {
    try {
        const skip = (page - 1) * pageSize;
        const [data, totalItems] = await prisma.$transaction([
            prisma.operationalError.findMany({
                skip: skip,
                take: pageSize,
                where: { status: true },
                orderBy: { id: 'asc' }
            }),
            prisma.operationalError.count({
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

export const getOperationErroForId = async (id : number) => {
    try {
       const error = await prisma.operationalError.findUnique({
           where: {
               id
           }
       })
       if(error){
        return error
       }
       return null
    } catch (error) {
        console.error('Erro no service:', error);
        return null;
    }
}


export const addError = async (data: Prisma.OperationalErrorCreateInput ) => {
    const operationalError = await prisma.operationalError.create({ data })
    if (operationalError) {
        return operationalError
    }
    return null
}

export const editOperationalError = async (id: number,  data : Prisma.OperationalErrorUpdateInput) => {
    const delError = await prisma.operationalError.update({
        where: {
            id: id
        },
        data
    })
    if (delError) {
        return delError
    }
    return null
}

export const delOperationalError = async (id: number) => {
    const delError = await prisma.operationalError.update({
        where: {
            id: id
        },
        data: {
            status: false
        }

    })
    if (delError) {
        return delError
    }
    return null
}
