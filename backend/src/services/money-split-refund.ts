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
  const moneySplitRefused = await prisma.mOneySplitRefund.findMany({
    where : {
      id_order : id
    }
   })
  if (moneySplitRefused) {
    return moneySplitRefused
  }
  return null
}

export const addRefund = async (data: Prisma.MOneySplitRefundCreateInput) => {
  const moneySplitRefused = await prisma.mOneySplitRefund.create({ data })
  if (moneySplitRefused) {
    return moneySplitRefused
  }
  return null
}