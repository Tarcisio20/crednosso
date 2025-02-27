import { Prisma } from "@prisma/client"
import { prisma } from "../utils/prisma"

export const getForIdTreasury = async (id : number ) => {
    const cardOperator = await prisma.operatorCard.findFirst({
        where : { id_treasury : id  }
    })
    if(cardOperator){
        return cardOperator
    }
    return null
}

export const getCardOperatorForId = async (id : string) => {
    const cardOperator = await prisma.operatorCard.findFirst({
        where : { id : parseInt(id) }
    })
    if(cardOperator){
        return cardOperator
    }
    return null
}

export const addCardOperator = async (data : Prisma.OperatorCardCreateInput) => {
    const cardOperator = await prisma.operatorCard.create({ data })
    if(cardOperator){
        return cardOperator
    }
    return null
}

export const updateCardOperator = async (id: number, data : Prisma.OperatorCardUpdateInput) => {
    const cardOperator = await prisma.operatorCard.update({
        where : {
            id
        },
        data
    }) 
    if(cardOperator){
        return cardOperator
    }
    return null
}
