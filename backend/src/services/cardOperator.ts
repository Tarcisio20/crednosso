import { Prisma } from "@prisma/client"
import { prisma } from "../utils/prisma"

export const getAllCardOperator = async () => {
    const cardOperator = await prisma.operatorCard.findMany()
    if(cardOperator){
        return cardOperator
    }
    return null
}

export const getForIdTreasury = async (id : number ) => {
    const cardOperator = await prisma.operatorCard.findMany({
        where : { id_treasury : id, status : true  }
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

export const delCardOperator = async (id: number) => {
    const cardOperator = await prisma.operatorCard.update({
        where : {
            id
        },
        data : {
            status : false
        }
    }) 
    if(cardOperator){
        return cardOperator
    }
    return null
}
