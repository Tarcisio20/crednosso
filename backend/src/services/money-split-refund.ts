import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";

type OrderWhereInput = {
  order: {
    connect: {
      id: number;
    };
  };
};
export const getRefusedForIdOrder = async (id : number) => {
  try{
    return await prisma.mOneySplitRefund.findMany({
    where : {
      id_order : id
    }
   })
  }catch(err){
    console.log("SERVICE => [MONEY_SPLIT_REFUND] *** FUNCTION => [GET_REFUSED_FOR_ID_ORDER] *** ERROR =>", err)
    return null
  }
}

export const addRefund = async (data: Prisma.MOneySplitRefundCreateInput) => {
  try{
    return await prisma.mOneySplitRefund.create({ data })
  }catch(err){
    console.log("SERVICE => [MONEY_SPLIT_REFUND] *** FUNCTION => [ADD_REFUND] *** ERROR =>", err)
    return null
  }
}