import { Prisma } from "@prisma/client"
import { prisma } from "../utils/prisma"

export const getAllTypeSupply = async () => {
    const typeSupply = await prisma.typeSupply.findMany({  
        where : { status : true }
    })
    if(typeSupply){
        return typeSupply
    }
    return null
}

export const getAllTypeSupplyPagination = async (page: number, pageSize: number) => {
    try {
        const skip = (page - 1) * pageSize;
        const [data, totalItems] = await prisma.$transaction([
            prisma.typeSupply.findMany({
                skip: skip,
                take: pageSize,
                where: { status: true },
                orderBy: { id: 'asc' }
            }),
            prisma.typeSupply.count({
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


export const getTypeSupplyForId = async (id : string) => {
    const typeSupply = await prisma.typeSupply.findFirst({
        where : { id : parseInt(id) }
    })
    if(typeSupply ){
        return typeSupply 
    }
    return null
}

export const addTypeSupply = async (data : Prisma.TypeSupplyCreateInput) => {
    const typeSupply = await prisma.typeSupply.create({ data })
    if(typeSupply){
        return typeSupply
    }
    return null
}

export const updateTypeSupply = async (id: number, data : Prisma.TypeSupplyUpdateInput) => {
    const editSupply = await prisma.typeSupply.update({
        where : {
            id
        },
        data
    }) 
    if(editSupply){
        return editSupply
    }
    return null
}
