import { Prisma } from "@prisma/client"
import { prisma } from "../utils/prisma"

export const getAllStatusOrder = async () => {
  try {
    return await prisma.statusOrder.findMany({
      where: { status: true }
    })
  } catch (err) {
    console.log("SERVICE => [STATUS_ORDER] *** FUNCTION => [GET_ALL_STATUS_ORDER] *** ERROR =>", err)
    return null
  }
}

export const getAllStatusOrderPagination = async (page: number, pageSize: number) => {
  try {
    const skip = (page - 1) * pageSize;
    const [data, totalItems] = await prisma.$transaction([
      prisma.statusOrder.findMany({
        skip: skip,
        take: pageSize,
        where: { status: true },
        orderBy: { id: 'asc' }
      }),
      prisma.statusOrder.count({
        where: { status: true }
      })
    ])

    return {
      data,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize)
    };
  } catch (error) {
    console.log("SERVICE => [STATUS_ORDER] *** FUNCTION => [GET_ALL_STATUS_ORDER_PAGINATION] *** ERROR =>", error)
    return null;
  }
}

export const getStatusOrderForId = async (id: string) => {
  try {
    return await prisma.statusOrder.findFirst({
      where: { id: parseInt(id) }
    })
  } catch (err) {
    console.log("SERVICE => [STATUS_ORDER] *** FUNCTION => [GET_STATUS_ORDER_FOR_ID] *** ERROR =>", err)
    return null
  }
}

export const addStatusOrder = async (data: Prisma.StatusOrderCreateInput) => {
  try {
    return await prisma.statusOrder.create({ data })
  } catch (err) {
    console.log("SERVICE => [STATUS_ORDER] *** FUNCTION => [ADD_STATUS_ORDER] *** ERROR =>", err)
    return null
  }
}

export const updateStatusOrder = async (id: number, data: Prisma.StatusOrderUpdateInput) => {
  try {
    return await prisma.statusOrder.update({
      where: {
        id
      },
      data
    })
  } catch (err) {
    console.log("SERVICE => [STATUS_ORDER] *** FUNCTION => [UPDATE_STATUS_ORDER] *** ERROR =>", err)
    return null
  }
}

export const delStatusOrder = async (id: number) => {
  try {
    return await prisma.statusOrder.update({
      where: {
        id
      },
      data: {
        status: false
      }
    })
  } catch (err) {
    console.log("SERVICE => [STATUS_ORDER] *** FUNCTION => [DEL_STATUS_ORDER] *** ERROR =>", err)
    return null
  }
}
