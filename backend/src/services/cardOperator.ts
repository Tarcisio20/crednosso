import { Prisma } from "@prisma/client"
import { prisma } from "../utils/prisma"

export const addCardOperator = async (data : Prisma.OperatorCardCreateInput) => {
    const cardOperator = await prisma.operatorCard.create({ data })
    if(cardOperator){
        return cardOperator
    }
    return null
}
