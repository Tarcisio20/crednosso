import { Prisma } from "@prisma/client"
import { prisma } from "../utils/prisma"

export const getAllTypeStores = async () => {
  try {
    return await prisma.typeStore.findMany({
      where: { status: true }
    })
  } catch (err) {
    console.log("SERVICE => [TYPE_STORE] *** FUNCTION => [GET_ALL_TYPE_STORES] *** ERROR =>", err)
    return null
  }
}

export const getAllTypeStoresPagination = async (page: number, pageSize: number) => {
  try {
    const skip = (page - 1) * pageSize;
    const [data, totalItems] = await prisma.$transaction([
      prisma.typeStore.findMany({
        skip: skip,
        take: pageSize,
        where: { status: true },
        orderBy: { id: 'asc' }
      }),
      prisma.typeStore.count({
        where: { status: true }
      })
    ])

    return {
      data,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize)
    };
  } catch (error) {
    console.log("SERVICE => [TYPE_STORE] *** FUNCTION => [GET_ALL_TYPE_STORES_PAGINATION] *** ERROR =>", error)
    return null;
  }

}

export const getTypeStoreForId = async (id: string) => {
  try {
    return await prisma.typeStore.findFirst({
      where: { id: parseInt(id) }
    })
  } catch (err) {
    console.log("SERVICE => [TYPE_STORE] *** FUNCTION => [GET_TYPE_STORE_FOR_ID] *** ERROR =>", err)
    return null
  }
}

export const addTypeStore = async (data: Prisma.typeStoreCreateInput) => {
  try {
    return await prisma.typeStore.create({ data })
  } catch (err) {
    console.log("SERVICE => [TYPE_STORE] *** FUNCTION => [ADD_TYPE_STORE] *** ERROR =>", err)
    return null
  }
}

export const updateTypeStore = async (id: number, data: Prisma.typeStoreUpdateInput) => {
  try {
    return await prisma.typeStore.update({
      where: {
        id
      },
      data
    })
  } catch (err) {
    console.log("SERVICE => [TYPE_STORE] *** FUNCTION => [UPDATE_TYPE_STORE] *** ERROR =>", err)
    return null
  }
}

export const deleteTypeStore = async (id: number) => {
  try {
    return await prisma.typeStore.update({
      where: {
        id
      },
      data: {
        status: false
      }
    })
  } catch (err) {
    console.log("SERVICE => [TYPE_STORE] *** FUNCTION => [DELETE_TYPE_STORE] *** ERROR =>", err)
    return null
  }
}
