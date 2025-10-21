import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";

export const getAllTypeOrder = async () => {
  try {
    return await prisma.typeOrder.findMany({
      where: { status: true }
    })
  } catch (err) {
    console.log("SERVICE => [TYPE_ORDER] *** FUNCTION => [GET_ALL_TYPE_ORDER] *** ERROR =>", err)
    return null
  }
}

export const getAllTypeOrderPagination = async (page: number, pageSize: number) => {
  try {
    const skip = (page - 1) * pageSize;
    const [data, totalItems] = await prisma.$transaction([
      prisma.typeOrder.findMany({
        skip: skip,
        take: pageSize,
        where: { status: true },
        orderBy: { id: 'asc' }
      }),
      prisma.typeOrder.count({
        where: { status: true }
      })
    ])

    return {
      data,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize)
    };
  } catch (error) {
    console.log("SERVICE => [TYPE_ORDER] *** FUNCTION => [GET_ALL_TYPE_ORDER_PAGINATION] *** ERROR =>", error)
    return null;
  }
}

export const getTypeOrderForId = async (id: string) => {
  try {
    return await prisma.typeOrder.findFirst({
      where: { id: parseInt(id) }
    })
  } catch (err) {
    console.log("SERVICE => [TYPE_ORDER] *** FUNCTION => [GET_TYPE_ORDER_FOR_ID] *** ERROR =>", err)
    return null
  }
}

export const addTypeOrder = async (data: Prisma.TypeOrderCreateInput) => {
  try {
    return await prisma.typeOrder.create({ data })
  } catch (err) {
    console.log("SERVICE => [TYPE_ORDER] *** FUNCTION => [ADD_TYPE_ORDER] *** ERROR =>", err)
    return null
  }
}

export const updateTypeOrder = async (id: number, data: Prisma.TypeOrderUpdateInput) => {
  try {
    return await prisma.typeOrder.update({
      where: {
        id
      },
      data
    })
  } catch (err) {
    console.log("SERVICE => [TYPE_ORDER] *** FUNCTION => [UPDATE_TYPE_ORDER] *** ERROR =>", err)
    return null
  }
}