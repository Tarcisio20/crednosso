import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";

export const addTreasury = async (data : Prisma.TreasuryCreateInput) => {
    const treasury = await prisma.treasury.create({ data })
    if(treasury){
        return treasury
    }
    return null
}