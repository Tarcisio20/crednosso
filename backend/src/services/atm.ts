import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";

export const getAllAtm = async () => {
  try {
    const atm = await prisma.atm.findMany({
      where: { status: true }
    })
    return atm
  } catch (err) {
    console.log("SERVICE => [ATM] *** FUNCTION => [GET_ALL_ATM] *** ERROR =>", err)
    return null
  }
}

export const getAllAtmPagination = async (page: number, pageSize: number) => {
  try {
    const skip = (page - 1) * pageSize;
    const [data, totalItems] = await prisma.$transaction([
      prisma.atm.findMany({
        skip: skip,
        take: pageSize,
        where: { status: true },
        orderBy: { id_system: 'asc' }
      }),
      prisma.atm.count({
        where: { status: true }
      })
    ])

    return {
      data,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize)
    };
  } catch (err) {
    console.log("SERVICE => [ATM] *** FUNCTION => [GET_ALL_ATM_PAGINATION] *** ERROR =>", err)
    return null;
  }
}

export const getForId = async (id: number) => {
  try {
    const treasury = await prisma.atm.findFirst({
      where: { id_system: id }
    })
    return treasury
  } catch (err) {
    console.log("SERVICE => [ATM] *** FUNCTION => [GET_FOR_ID] *** ERROR =>", err)
    return null
  }
}

export const getForIdTreasury = async (id: number) => {
  try {
    const atm = await prisma.atm.findMany({
      where: {
        id_treasury: id,
        status: true
      },
      select: {
        id_system: true,
        id_treasury: true,
        name: true,
        short_name: true,
        cassete_A: true,
        cassete_B: true,
        cassete_C: true,
        cassete_D: true
      }
    })
    return atm
  } catch (err) {
    console.log("SERVICE => [ATM] *** FUNCTION => [GET_FOR_ID_TREASURY] *** ERROR =>", err)
    return null
  }
}

export const addAtm = async (data: Prisma.AtmCreateInput) => {
  try {
    const atm = await prisma.atm.create({ data })
    return atm
  } catch (err) {
    console.log("SERVICE => [ATM] *** FUNCTION => [ADD_ATM] *** ERROR =>", err)
    return null
  }
}

export const addBalanceAtm = async (id: number, data: Prisma.AtmUpdateInput) => {
  try {
    const atm = await prisma.atm.update({
      where: { id_system: id },
      data
    })
    return atm
  } catch (err) {
    console.log("SERVICE => [ATM] *** FUNCTION => [ADD_BALANCE_ATM] *** ERROR =>", err)
    return null
  }
}

export const updateAtm = async (id: number, data: Prisma.AtmUpdateInput) => {
  try {
    const editAtm = await prisma.atm.update({
      where: {
        id_system: id
      },
      data
    })
    return editAtm
  } catch (err) {
    console.log("SERVICE => [ATM] *** FUNCTION => [UPDATE_ATM] *** ERROR =>", err)
    return null
  }
}

export const delAtm = async (id: number) => {
  try {
    const delAtm = await prisma.atm.update({
      where: {
        id_system: id
      },
      data: {
        status: false
      }
    })
    return delAtm
  } catch (err) {
    console.log("SERVICE => [ATM] *** FUNCTION => [DEL_ATM] *** ERROR =>", err)
    return null
  }
}
