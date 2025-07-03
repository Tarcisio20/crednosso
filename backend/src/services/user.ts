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