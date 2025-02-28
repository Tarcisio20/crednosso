import { Prisma } from "@prisma/client"
import { prisma } from "../utils/prisma"

export const addTypeSupply = async (data : Prisma.TypeSupplyCreateInput) => {
    const typeSupply = await prisma.typeSupply.create({ data })
    if(typeSupply){
        return typeSupply
    }
    return null
}
