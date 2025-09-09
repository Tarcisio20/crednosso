import { Prisma } from "@prisma/client"
import { prisma } from "../utils/prisma"

export const getAllSupply = async () => {
  const supply = await prisma.supply.findMany()
  if (supply) {
    return supply
  }
  return null
}

export const addSupply = async (data: Prisma.SupplyCreateInput) => {
  try {
    return await prisma.supply.create({ data })
  } catch (error) {
    console.error("Erro ao adicionar abastecimento:", error);
    return null
   }
 
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

export const getAllForDatePagination = async (date: any, dateEnd: any, page : number, pageSize : number) => {
  try {
    // Normaliza datas se vierem como string
    const start = date instanceof Date ? date : new Date(date);
    const end   = dateEnd   instanceof Date ? dateEnd   : new Date(dateEnd);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Parâmetros de data inválidos.");
    }

    const skip = (page - 1) * pageSize;

    const where = {
      date: {
        gte: start,
        lt: end,      // se quiser incluir o fim, troque para lte: end
      },
      // status: true, // descomente se precisar filtrar por status
    } as const;

    const [data, totalItems] = await prisma.$transaction([
      prisma.supply.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { id : "asc" },
         // ajuste se preferir outra ordenação
         include: {
          atm: {
            select: { name: true, id_system: true }, // pega só o que precisa
          },
        },
      }),
      prisma.supply.count({ where }),
    ]);
    return {
      data,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize)
    };
  } catch (error) {
    return null;
  }
}


export const getSupplyForIdTreasury = async (id: number) => {
  const suplly = await prisma.supply.findMany({
    where: {
      id_treasury: id
    }
  })
  if (suplly) {
    return suplly
  }
  return []
}

export const getAtmWitSupplyForIdAndDate = async (id: number, data: { date: string }) => {
  const suplly = await prisma.supply.findMany({
    where: {
      id_treasury: id
    }
  })
  if (suplly) {
    return suplly
  }
  return []
}

export const lastRegister = async () => {
  const supply = await prisma.supply.findFirst({
    orderBy: {
      id: 'desc', // ou 'createdAt' se você tiver essa coluna
    },
  });
  if (supply) {
    return supply
  }
  return null
}

export const getAllForDateAndTreasury = async (date: any, dateEnd: any, id_treasury: number) => {
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

export const getSupplyByOrder = async (numOrder: number) => {
  try { 
    const supply = await prisma.supply.findMany({
      where: {
        id_order: numOrder,
        status: true // ou outro status que você queira filtrar
      }
    })
    return supply
  }catch (error) {
   
    return []
  } 
}