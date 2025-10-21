import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";

export const getAllOperationalErrorPagination = async (page: number, pageSize: number) => {
  try {
    const skip = (page - 1) * pageSize;

    const [data, totalItems] = await prisma.$transaction([
      prisma.operationalError.findMany({
        skip,
        take: pageSize,
        where: { status: true },
        orderBy: { id: 'asc' }, // ajuste conforme sua necessidade
      }),
      prisma.operationalError.count({ where: { status: true } }),
    ]);

    return {
      data,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
    };
  } catch (err) {
    console.log("SERVICE => [OPERATIONAL_ERROR] *** FUNCTION => [GET_ALL_OPERATIONAL_ERROR_PAGINATION] *** ERROR =>", err)
    return null;
  }
}

export const getOperationErroForId = async (id: number) => {
  try {
    return await prisma.operationalError.findUnique({
      where: {
        id
      }
    })
  } catch (err) {
    console.log("SERVICE => [OPERATIONAL_ERROR] *** FUNCTION => [GET_OPERATION_ERROR_FOR_ID] *** ERROR =>", err)
    return null;
  }
}

export const addError = async (data: Prisma.OperationalErrorCreateInput) => {
  try {
    return await prisma.operationalError.create({ data })
  } catch (err) {
    console.log("SERVICE => [OPERATIONAL_ERROR] *** FUNCTION => [ADD_ERROR] *** ERROR =>", err)
    return null;
  }
}

export const editOperationalError = async (id: number, data: Prisma.OperationalErrorUpdateInput) => {
  try {
    return await prisma.operationalError.update({
      where: {
        id: id
      },
      data
    })
  } catch (err) {
    console.log("SERVICE => [OPERATIONAL_ERROR] *** FUNCTION => [EDIT_OPERATIONAL_ERROR] *** ERROR =>", err)
    return null;
  }
}

export const delOperationalError = async (id: number) => {
  try{
    return await prisma.operationalError.update({
    where: {
      id: id
    },
    data: {
      status: false
    }

  })
  }catch(err){
    console.log("SERVICE => [OPERATIONAL_ERROR] *** FUNCTION => [DEL_OPERATIONAL_ERROR] *** ERROR =>", err)
    return null;
  }
}
