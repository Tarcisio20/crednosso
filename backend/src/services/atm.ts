import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";



export const getAllAtm = async () => {
    const atm = await prisma.atm.findMany()
    if(atm){
        return atm
    }
    return null
}


export const addAtm = async (data : Prisma.AtmCreateInput) => {
    const atm = await prisma.atm.create({ data })
    if(atm){
        return atm
    }
    return null
}
