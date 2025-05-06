import { Prisma } from "@prisma/client"
import { prisma } from "../utils/prisma"

export const getAllSupply = async () => {
  const supply = await prisma.supply.findMany()
  if(supply){
    return supply
  }
  return null
}

export const addSupply = async (data: Prisma.SupplyCreateInput) => {
  const suplly = await prisma.supply.create({ data })
  if (suplly) {
    return suplly
  }
  return null
}

export const getAllForDate = async (date: any, dateEnd: any) => {
  const suplly = await prisma.supply.findMany({
    where: {
      date: {
        gte: date,
        lt: dateEnd,
      }
    }
  })
  if (suplly) {
    return suplly
  }
  return null
}

export const getSupplyForIdTreasury = async (id: number) => {
  const suplly = await prisma.supply.findMany({
    where: {
    id_treasury  : id 
    }
  })
  if (suplly) {
    return suplly
  }
  return []
}

export const lastRegister  = async () => {
const supply = await prisma.supply.findFirst({
  orderBy: {
    id: 'desc', // ou 'createdAt' se você tiver essa coluna
  },
});
  if(supply){
    return supply
  }
  return null
}

export const getAllForDateAndTreasury  = async (date: any, dateEnd: any, id_treasury : number) => {
  const suplly = await prisma.supply.findMany({
    where: {
      date: {
        gte: date,
        lt: dateEnd,
      },
      id_treasury
    }
  })
  if (suplly) {
    return suplly
  }
  return null
  }