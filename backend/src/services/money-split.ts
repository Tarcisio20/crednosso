import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";



export const getMoneySplitByIdOrder = async (id: number) => {
  try {
    return await prisma.moneySplit.findMany({
      where: { id_order: id }
    })
  } catch (err) {
    console.log("SERVICE => [MONEY_SPLIT] *** FUNCTION => [GET_MONEY_SPLIT_BY_ID_ORDER] *** ERROR =>", err)
    return null
  }
}

export const getMoneySplitByIdTreasury = async (id: number, id_order: number) => {
  try {
    return await prisma.moneySplit.findMany({
      where: { id_treasury_origin: id, id_order: id_order }
    })
  } catch (err) {
    console.log("SERVICE => [MONEY_SPLIT] *** FUNCTION => [GET_MONEY_SPLIT_BY_ID_TREASURY] *** ERROR =>", err)
    return null
  }
}
export const addRatteds = async (dataArray: Prisma.MoneySplitCreateManyInput[]) => {
  try{
    return  await prisma.moneySplit.createMany({ data: dataArray })
  }catch(err){
    console.log("SERVICE => [MONEY_SPLIT] *** FUNCTION => [ADD_RATTEDS] *** ERROR =>", err)
    return null
  }
}