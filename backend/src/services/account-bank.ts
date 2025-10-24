
import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { createLog } from "./logService";


export async function getAllAccountPagination(page: number, pageSize: number) {
  try {
    const safePage = Math.max(1, Number(page) || 1);
    const safePageSize = Math.min(100, Math.max(1, Number(pageSize) || 10));
    const skip = (safePage - 1) * safePageSize;

    // orderBy para paginação estável
    const [data, totalItems] = await prisma.$transaction([
      prisma.accountBank.findMany({
        skip,
        take: safePageSize,
        where: { status: true },
        orderBy: { id: 'asc' }, // ajuste a coluna-chave
      }),
      prisma.accountBank.count({ where: { status: true } }),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));


    return {
      data,
      page: safePage,
      pageSize: safePageSize,
      totalItems,
      totalPages,
    };
  } catch (err) {
    console.log("SERVICE => [ACCOUNT_BANK] *** FUNCTION => [GET_ALL_ACCOUNT_PAGINATION] *** ERROR =>", err)
  
    return null
  }
}

export const addAccountBank = async (data: Prisma.AccountBankCreateInput) => {
  try {
    const account = await prisma.accountBank.create({ data })
    return account
  } catch (err) {
    console.log("SERVICE => [ACCOUNT_BANK] *** FUNCTION => [ADD_ACCOUNT_BANK] *** ERROR =>", err) 
    return null
  }

}

export const getForId = async (id: number) => {
  try {
    const accountBank = await prisma.accountBank.findFirst({
      where: { id: id }
    })
    return accountBank
  } catch (err) {
    console.log("SERVICE => [ACCOUNT_BANK] *** FUNCTION => [GET_FOR_ID] *** ERROR =>", err) 
    return null
  }
}

export const updateAccountBank = async (id: number, data: Prisma.AccountBankUpdateInput) => {
  try {
    const editAccount = await prisma.accountBank.update({
      where: {
        id: id
      },
      data
    })
    return editAccount
  } catch (err) {
    console.log("SERVICE => [ACCOUNT_BANK] *** FUNCTION => [UPDATE_ACCOUNT_BANK] *** ERROR =>", err)
    return null
  }
}

export const delAccountBank = async (id: number) => {
  try {
    const delAccount = await prisma.accountBank.update({
      where: {
        id: id
      },
      data: {
        status: false
      }
    })
    return delAccount
  } catch (err) {
    console.log("SERVICE => [ACCOUNT_BANK] *** FUNCTION => [DEL_ACCOUNT_BANK] *** ERROR =>", err)
    return null
  }
}