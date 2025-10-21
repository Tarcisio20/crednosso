import { Prisma } from "@prisma/client"
import { prisma } from "../utils/prisma"

export const getAllTypeSupply = async () => {
  try {
    return await prisma.typeSupply.findMany({
      where: { status: true }
    })
  } catch (err) {
    console.log("SERVICE => [TYPE_SUPPLY] *** FUNCTION => [GET_ALL_TYPE_SUPPLY] *** ERROR =>", err)
    return null
  }
}

export const getAllTypeSupplyPagination = async (page: number, pageSize: number) => {
  try {
    const skip = (page - 1) * pageSize;
    const [data, totalItems] = await prisma.$transaction([
      prisma.typeSupply.findMany({
        skip: skip,
        take: pageSize,
        where: { status: true },
        orderBy: { id: 'asc' }
      }),
      prisma.typeSupply.count({
        where: { status: true }
      })
    ])

    return {
      data,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize)
    };
  } catch (error) {
    console.log("SERVICE => [TYPE_SUPPLY] *** FUNCTION => [GET_ALL_TYPE_SUPPLY_PAGINATION] *** ERROR =>", error)
    return null;
  }
}

export const getTypeSupplyForId = async (id: string) => {
  try {
    return await prisma.typeSupply.findFirst({
      where: { id: parseInt(id) }
    })
  } catch (err) {
    console.log("SERVICE => [TYPE_SUPPLY] *** FUNCTION => [GET_TYPE_SUPPLY_FOR_ID] *** ERROR =>", err)
    return null
  }
}

export const addTypeSupply = async (data: Prisma.TypeSupplyCreateInput) => {
  try {
    return await prisma.typeSupply.create({ data })
  } catch (err) {
    console.log("SERVICE => [TYPE_SUPPLY] *** FUNCTION => [ADD_TYPE_SUPPLY] *** ERROR =>", err)
    return null
  }
}

export const updateTypeSupply = async (id: number, data: Prisma.TypeSupplyUpdateInput) => {
  try {
    return await prisma.typeSupply.update({
      where: {
        id
      },
      data
    })
  } catch (err) {
    console.log("SERVICE => [TYPE_SUPPLY] *** FUNCTION => [UPDATE_TYPE_SUPPLY] *** ERROR =>", err)
    return null
  }
}
