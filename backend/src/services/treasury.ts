import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";


export const getAllTreasury = async () => {
    const treasury = await prisma.treasury.findMany()
    if(treasury){
        return treasury
    }
    return null
}

export const getForIdSystem = async (id : string) => {
    const treasury = await prisma.treasury.findFirst({
        where : { id_system : parseInt(id) }
    })
    if(treasury){
        return treasury
    }
    return null
}

export const addTreasury = async (data : Prisma.TreasuryCreateInput) => {
    const treasury = await prisma.treasury.create({ data })
    if(treasury){
        return treasury
    }
    return null
}

export const addBalanceInTreasuryByIdSystem = async (id_system : number, 
    data : { bills_10 : number, bills_20 : number, bills_50 : number, bills_100 : number }
) => {
    const newBalance = await prisma.treasury.update({
        where : { id_system },
        data
    })
    if(newBalance){
        return newBalance
    }
    return null
}