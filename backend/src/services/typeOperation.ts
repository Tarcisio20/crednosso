import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";


export const getAllTypeOperation = async () => {
  try {
    return await prisma.typeOperation.findMany({
      where: { status: true }
    })
  } catch (err) {
    console.log("SERVICE => [TYPE_OPERATION] *** FUNCTION => [GET_ALL_TYPE_OPERATION] *** ERROR =>", err)
    return null
  }
}

export const getAllTypeOperationPagination = async (page: number, pageSize: number) => {
  try {
    const skip = (page - 1) * pageSize;
    const [data, totalItems] = await prisma.$transaction([
      prisma.typeOperation.findMany({
        skip: skip,
        take: pageSize,
        where: { status: true },
        orderBy: { id: 'asc' }
      }),
      prisma.typeOperation.count({
        where: { status: true }
      })
    ])

    return {
      data,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize)
    };
  } catch (error) {
    console.log("SERVICE => [TYPE_OPERATION] *** FUNCTION => [GET_ALL_TYPE_OPERATION_PAGINATION] *** ERROR =>", error)
    return null;
  }
}


export const getTypeOperationForId = async (id: string) => {
  try {
    return await prisma.typeOperation.findFirst({
      where: { id: parseInt(id) }
    })
  } catch (err) {
    console.log("SERVICE => [TYPE_OPERATION] *** FUNCTION => [GET_TYPE_OPERATION_FOR_ID] *** ERROR =>", err)
    return null
  }
}

export const addTypeOperation = async (data: Prisma.TypeOperationCreateInput) => {
  try {
    return await prisma.typeOperation.create({ data })
  } catch (err) {
    console.log("SERVICE => [TYPE_OPERATION] *** FUNCTION => [ADD_TYPE_OPERATION] *** ERROR =>", err)
    return null
  }
}

export const updateTypeOperation = async (id: number, data: Prisma.TypeOperationUpdateInput) => {
  try {
    return await prisma.typeOperation.update({
      where: {
        id
      },
      data
    })
  } catch (err) {
    console.log("SERVICE => [TYPE_OPERATION] *** FUNCTION => [UPDATE_TYPE_OPERATION] *** ERROR =>", err)
    return null
  }
}