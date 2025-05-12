import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";


export const getAllTreasury = async () => {
    const treasury = await prisma.treasury.findMany({
        where: { status: true }
    })
    if (treasury) {
        return treasury
    }
    return null
}

export const getAllTreasuryPagination = async (page: number, pageSize: number) => {
    try {
        const skip = (page - 1) * pageSize;
        const [data, totalItems] = await prisma.$transaction([
            prisma.treasury.findMany({
                skip: skip,
                take: pageSize,
                where: { status: true },
                orderBy: { id: 'asc' }
            }),
            prisma.treasury.count({
                where: { status: true }
            })
        ]);

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

export const getForIdSystemEdit = async (id: string) => {
    const treasury = await prisma.treasury.findFirst({
        where: { 
            id_system : parseInt(id)
         }
    })
    if (treasury) {
        return treasury;
    }
    return null
}

export const getForIdSystem = async (id: string) => {
    console.log("Dentro do item", id)
    const treasury = await prisma.treasury.findFirst({
        where: { 
            id_system : parseInt(id)
         }
    })
    if (treasury) {
        return treasury
    }
    return null
}

export const getForIds = async (ids: number[]) => {
    const treasury = await prisma.treasury.findMany({
        where: {
            id_system: {
                in: ids
            }
        },
        select: {
            id_system: true,
            name: true,
            gmcore_number : true,
            account_number: true,
            region: true,
            bills_10: true,
            bills_20: true,
            bills_50: true,
            bills_100: true,
            id_type_store: true,
            account_number_for_transfer : true,
        }
    })
    if (treasury) {
        return treasury
    }
    return null
}

export const getTreasuryForTypeSupply = async (id: number, store : number) => {
    const treasury = await prisma.treasury.findMany({
        where: { 
            id_system : id,
            id_type_supply : store
         },
         select : {
            id_system : true
         }
    })
    if (treasury) {
    
        return treasury

    }
    return null
}

export const addTreasury = async (data: Prisma.TreasuryCreateInput) => {
    const treasury = await prisma.treasury.create({ data })
    if (treasury) {
        return treasury
    }
    return null
}

export const addBalanceInTreasuryByIdSystem = async (id: number,
    data: { bills_10: number, bills_20: number, bills_50: number, bills_100: number }
) => {
    console.log('data', data)
    const newBalance = await prisma.treasury.update({
        where: { id_system : id },
        data
    })
    if (newBalance) {
        return newBalance
    }
    return null
}


export const updateTreasury = async (id: number, data: Prisma.TreasuryUpdateInput) => {
    const editTreasury = await prisma.treasury.update({
        where: {
            id
        },
        data
    })
    if (editTreasury) {
        return editTreasury
    }
    return null
}