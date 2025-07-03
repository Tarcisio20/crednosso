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
    console.error('Erro no service:', error);
    return null;
  }
}

export const getForId = async (id: number) => {
    const user = await prisma.user.findFirst({
        where: { id: id },
        select : {
          id: true,
          name: true,
          slug: true,
          email: true,
          status: true
        }
    })
    if (user) {
        return user
    }
    return null
}

export const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: { email }
  })
  if (user) {
    return user;
  }
  return null;
}


export const findUserBySlug = async (slug: string) => {
  const user = await prisma.user.findFirst({
    select: {
      name: true,
      email: true,
      slug: true
    },
    where: { slug }
  })
  if (user) {
    return user;
  }
  return null;
}

export const createUser = async (data: Prisma.UserCreateInput) => {
  const user = await prisma.user.create({ data })
  if (user) {
    return user
  }

  return null
}

export const updateUser = async (id: number, data: Prisma.UserUpdateInput) => {
    const editUser = await prisma.user.update({
        where: {
            id: id
        },
        data,
        select : {
          id: true,
          name: true,
          slug: true,
          email: true,
          status: true
        }
    })
    if (editUser) {
        return editUser
    }
    return null
}

export const changePasswordFromId = async (id: number, data: Prisma.UserUpdateInput) => {
    const editUser = await prisma.user.update({
        where: {
            id: id
        },
        data,
        select : {
          id: true,
          name: true,
          slug: true,
          email: true,
          status: true
        }
    })
    if (editUser) {
        return editUser
    }
    return null
}
