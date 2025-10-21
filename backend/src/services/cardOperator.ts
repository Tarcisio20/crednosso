import { Prisma } from "@prisma/client"
import { prisma } from "../utils/prisma"

export const getAllCardOperator = async () => {
  try {
    const cardOperator = await prisma.operatorCard.findMany()
    return cardOperator
  } catch (err) {
    console.log("SERVICE => [CARD_OPERATOR] *** FUNCTION => [GET_ALL_CARD_OPERATOR] *** ERROR =>", err)
    return null
  }
}

export const getForIdTreasury = async (id: number) => {
  try {
    const cardOperator = await prisma.operatorCard.findMany({
      where: { id_treasury: id, status: true }
    })
    return cardOperator
  } catch (err) {
    console.log("SERVICE => [CARD_OPERATOR] *** FUNCTION => [GET_FOR_ID_TREASURY] *** ERROR =>", err)
    return null
  }
}

export const getCardOperatorForId = async (id: string) => {
  try {
    const cardOperator = await prisma.operatorCard.findFirst({
      where: { id: parseInt(id) }
    })
    return cardOperator
  } catch (err) {
    console.log("SERVICE => [CARD_OPERATOR] *** FUNCTION => [GET_CARD_OPERATOR_FOR_ID] *** ERROR =>", err)
    return null
  }
}

export const addCardOperator = async (data: Prisma.OperatorCardCreateInput) => {
  try {
    const cardOperator = await prisma.operatorCard.create({ data })
    return cardOperator
  } catch (err) {
    console.log("SERVICE => [CARD_OPERATOR] *** FUNCTION => [ADD_CARD_OPERATOR] *** ERROR =>", err)
    return null
  }
}

export const updateCardOperator = async (id: number, data: Prisma.OperatorCardUpdateInput) => {
  try {
    const cardOperator = await prisma.operatorCard.update({
      where: {
        id
      },
      data
    })
    return cardOperator
  } catch (err) {
    console.log("SERVICE => [CARD_OPERATOR] *** FUNCTION => [UPDATE_CARD_OPERATOR] *** ERROR =>", err)
    return null
  }
}

export const delCardOperator = async (id: number) => {
  try {
    const cardOperator = await prisma.operatorCard.update({
      where: {
        id
      },
      data: {
        status: false
      }
    })
    return cardOperator
  } catch (err) {
    console.log("SERVICE => [CARD_OPERATOR] *** FUNCTION => [DEL_CARD_OPERATOR] *** ERROR =>", err) 
    return null
  }
}
