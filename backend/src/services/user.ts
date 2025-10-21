import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma"


export const getAllUserPagination = async (page: number, pageSize: number) => {
  try {
    const skip = (page - 1) * pageSize;
    const [data, totalItems] = await prisma.$transaction([
      prisma.user.findMany({
        skip: skip,
        take: pageSize,
        where: { status: true },
        orderBy: { id: 'asc' },
        select: {
          id: true,
          email: true,
          name: true,
          slug: true,
          status: true
        }
      }),
      prisma.user.count({
        where: { status: true },
      })
    ])

    return {
      data,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize)
    };
  } catch (error) {
    console.log("SERVICE => [USER] *** FUNCTION => [GET_ALL_USER_PAGINATION] *** ERROR =>", error)
    return null;
  }
}

export const getForId = async (id: number) => {
  try {
    return await prisma.user.findFirst({
      where: { id: id },
      select: {
        id: true,
        name: true,
        slug: true,
        email: true,
        status: true
      }
    })
  } catch (err) {
    console.log("SERVICE => [USER] *** FUNCTION => [GET_FOR_ID] *** ERROR =>", err)
    return null
  }
}

export const findUserByEmail = async (email: string) => {
  try {
    return await prisma.user.findFirst({
      where: { email }
    })
  } catch (err) {
    console.log("SERVICE => [USER] *** FUNCTION => [FIND_USER_BY_EMAIL] *** ERROR =>", err)
    return null
  }
}

export const findUserBySlug = async (slug: string) => {
  try {
    return await prisma.user.findFirst({
      select: {
        name: true,
        email: true,
        slug: true
      },
      where: { slug }
    })
  } catch (err) {
    console.log("SERVICE => [USER] *** FUNCTION => [FIND_USER_BY_SLUG] *** ERROR =>", err)
    return null
  }
}

export const createUser = async (data: Prisma.UserCreateInput) => {
  try {
    return await prisma.user.create({ data })
  } catch (err) {
    console.log("SERVICE => [USER] *** FUNCTION => [CREATE_USER] *** ERROR =>", err)
    return null
  }
}

export const updateUser = async (id: number, data: Prisma.UserUpdateInput) => {
  try {
    return await prisma.user.update({
      where: {
        id: id
      },
      data,
      select: {
        id: true,
        name: true,
        slug: true,
        email: true,
        status: true
      }
    })
  } catch (err) {
    console.log("SERVICE => [USER] *** FUNCTION => [UPDATE_USER] *** ERROR =>", err)
    return null
  }
}

export const changePasswordFromId = async (id: number, data: Prisma.UserUpdateInput) => {
  try {
    return await prisma.user.update({
      where: {
        id: id
      },
      data,
      select: {
        id: true,
        name: true,
        slug: true,
        email: true,
        status: true
      }
    })
  } catch (err) {
    console.log("SERVICE => [USER] *** FUNCTION => [CHANGE_PASSWORD_FROM_ID] *** ERROR =>", err)
    return null
  }
}
