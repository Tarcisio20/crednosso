import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";



export const getAllAtm = async () => {
    const atm = await prisma.atm.findMany({
        where: { status: true }
    })
    if (atm) {
        return atm
    }
    return null
}

export const getAllAtmPagination = async (page: number, pageSize: number) => {
    try {
        const skip = (page - 1) * pageSize;
        const [data, totalItems] = await prisma.$transaction([
            prisma.atm.findMany({
                skip: skip,
                take: pageSize,
                where: { status: true },
                orderBy: { id_system: 'asc' }
            }),
            prisma.atm.count({
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

export const getForId = async (id: number) => {
    const treasury = await prisma.atm.findFirst({
        where: { id_system: id }
    })
    if (treasury) {
        return treasury
    }
    return null
}

export const getForIdTreasury = async (id: number) => {
    const atm = await prisma.atm.findMany({
        where: { id_treasury: id },
        select : {
            id_system : true,
            id_treasury : true,
            name : true,
            short_name : true,
            cassete_A : true,
            cassete_B : true,    
            cassete_C : true,
            cassete_D : true           
        }
    })
    if (atm) {
        return atm
    }
    return null
}

export const addAtm = async (data: Prisma.AtmCreateInput) => {
    const atm = await prisma.atm.create({ data })
    if (atm) {
        return atm
    }
    return null
}

export const addBalanceAtm = async (id: number, data: Prisma.AtmUpdateInput) => {
    const atm = await prisma.atm.update({
        where: { id_system: id },
        data
    })
    if (atm) {
        return atm
    }
    return null
}

export const updateAtm = async (id: number, data: Prisma.AtmUpdateInput) => {
    const editAtm = await prisma.atm.update({
        where: {
            id_system: id
        },
        data
    })
    if (editAtm) {
        return editAtm
    }
    return null
}

export const delAtm = async (id: number) => {
    const delAtm = await prisma.atm.update({
        where: {
            id_system: id
        },
        data: {
            status: false
        }

    })
    if (delAtm) {
        return delAtm
    }
    return null
}
