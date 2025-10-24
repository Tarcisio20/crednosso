import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";


export const getAllTreasury = async () => {
  try {
    return await prisma.treasury.findMany({
      where: { status: true }
    })
  } catch (err) {
    console.log("SERVICE => [TREASURY] *** FUNCTION => [GET_ALL_TREASURY] *** ERROR =>", err)
    return null
  }
}

export const getAllTreasuryPagination = async (page: number, pageSize: number) => {
  try {
    const skip = (page - 1) * pageSize;
    const [data, totalItems] = await prisma.$transaction([
      prisma.treasury.findMany({
        skip: skip,
        take: pageSize,
        where: { status: true },
        orderBy: { id: 'asc' }
      }),
      prisma.treasury.count({
        where: { status: true }
      })
    ]);

    return {
      data,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize)
    };
  } catch (error) {
    console.log("SERVICE => [TREASURY] *** FUNCTION => [GET_ALL_TREASURY_PAGINATION] *** ERROR =>", error)
    return null;
  }
}

export const getForIdSystemEdit = async (id: string) => {
  try {
    return await prisma.treasury.findFirst({
      where: {
        id_system: parseInt(id)
      }
    })
  } catch (err) {
    console.log("SERVICE => [TREASURY] *** FUNCTION => [GET_FOR_ID_SYSTEM_EDIT] *** ERROR =>", err)
    return null
  }
}

export const getForIdSystem = async (id: string) => {
  try {
    return await prisma.treasury.findFirst({
      where: {
        id_system: parseInt(id)
      }
    })
  } catch (err) {
    console.log("SERVICE => [TREASURY] *** FUNCTION => [GET_FOR_ID_SYSTEM] *** ERROR =>", err)
    return null
  }
}

export const getForIds = async (ids: number[]) => {
  try {
    return await prisma.treasury.findMany({
      where: {
        id_system: {
          in: ids
        }
      },
      select: {
        id_system: true,
        name: true,
        gmcore_number: true,
        account_number: true,
        region: true,
        bills_10: true,
        bills_20: true,
        bills_50: true,
        bills_100: true,
        id_type_store: true,
        account_number_for_transfer: true,
      }
    })
  } catch (err) {
    console.log("SERVICE => [TREASURY] *** FUNCTION => [GET_FOR_IDS] *** ERROR =>", err)
    return null
  }
}

export const getTreasuryForTypeSupply = async (id: number, store: number) => {
  try {
    return await prisma.treasury.findMany({
      where: {
        id_system: id,
        id_type_supply: store
      },
      select: {
        id_system: true
      }
    })
  } catch (err) {
    console.log("SERVICE => [TREASURY] *** FUNCTION => [GET_TREASURY_FOR_TYPE_SUPPLY] *** ERROR =>", err)
    return null
  }
}

export const addTreasury = async (data: Prisma.TreasuryCreateInput) => {
  try {
    return await prisma.treasury.create({ data })
  } catch (err) {
    console.log("SERVICE => [TREASURY] *** FUNCTION => [ADD_TREASURY] *** ERROR =>", err)
    return null
  }
}

export const addBalanceInTreasuryByIdSystem = async (id: number,
  data: { bills_10: number, bills_20: number, bills_50: number, bills_100: number }
) => {
  try {
    return await prisma.treasury.update({
      where: { id_system: id },
      data
    })
  } catch (err) {
    console.log("SERVICE => [TREASURY] *** FUNCTION => [ADD_BALANCE_IN_TREASURY_BY_ID_SYSTEM] *** ERROR =>", err)
    return null
  }
}

export const updateTreasury = async (id: number, data: Prisma.TreasuryUpdateInput) => {
  try {
    return await prisma.treasury.update({
      where: {
        id_system: id
      },
      data
    })
  } catch (err) {
    console.log("SERVICE => [TREASURY] *** FUNCTION => [UPDATE_TREASURY] *** ERROR =>", err)
    return null
  }
}

export const delTreasury = async (id: number) => {
  try {
    return await prisma.treasury.update({
      where: {
        id
      },
      data: {
        status: false
      }
    })
  } catch (err) {
    console.log("SERVICE => [TREASURY] *** FUNCTION => [DEL_TREASURY] *** ERROR =>", err)
    return null
  }
}

export const getTreasuriesInOrderForDate = async (date: string) => {
}