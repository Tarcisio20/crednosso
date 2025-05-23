import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";



export const getMoneySplitByIdOrder = async (id :number) => {
    const moneySplit = await prisma.moneySplit.findMany({
        where : {  id_order : id }
    })
    if(moneySplit){
        return moneySplit
    }
    return null
}

export const getMoneySplitByIdTreasury = async (id : number, id_order : number) => {
    const moneySplit = await prisma.moneySplit.findMany({ 
        where : { id_treasury_origin : id, id_order : id_order }
    })
    if(moneySplit){
        return moneySplit
    }
    return null
}


export const addRatteds = async (dataArray : Prisma.MoneySplitCreateManyInput[]) => {
    const moneySplit = await prisma.moneySplit.createMany({ data : dataArray})
    if(moneySplit){
        return moneySplit
    }
    return null
}