import { Prisma } from "@prisma/client"
import { prisma } from "../utils/prisma"

export const getAllSupply = async () => {
  try {
    return await prisma.supply.findMany()
  } catch (err) {
    console.log("SERVICE => [SUPPLY] *** FUNCTION => [GET_ALL_SUPPLY] *** ERROR =>", err)
    return null
  }
}

export const addSupply = async (data: Prisma.SupplyCreateInput) => {
  try {
    return await prisma.supply.create({ data })
  } catch (error) {
    console.log("SERVICE => [SUPPLY] *** FUNCTION => [ADD_SUPPLY] *** ERROR =>", error)
    return null
  }
}

export const getAllForDate = async (date: any, dateEnd: any) => {
  try {
    return await prisma.supply.findMany({
      where: {
        date: {
          gte: date,
          lt: dateEnd,
        }
      }
    })
  } catch (err) {
    console.log("SERVICE => [SUPPLY] *** FUNCTION => [GET_ALL_FOR_DATE] *** ERROR =>", err)
    return null
  }
}

export const getAllForDatePagination = async (date: any, dateEnd: any, page: number, pageSize: number) => {
  try {
    // Normaliza datas se vierem como string
    const start = date instanceof Date ? date : new Date(date);
    const end = dateEnd instanceof Date ? dateEnd : new Date(dateEnd);

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
        orderBy: { id: "asc" },
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
  } catch (err) {
    console.log("SERVICE => [SUPPLY] *** FUNCTION => [GET_ALL_FOR_DATE_PAGINATION] *** ERROR =>", err)
    return null;
  }
}

export const getSupplyForIdTreasury = async (id: number) => {
  try {
    return await prisma.supply.findMany({
      where: {
        id_treasury: id
      }
    })
  } catch (err) {
    console.log("SERVICE => [SUPPLY] *** FUNCTION => [GET_SUPPLY_FOR_ID_TREASURY] *** ERROR =>", err)
    return null
  }
}

export const getAtmWitSupplyForIdAndDate = async (id: number, data: { date: string }) => {
  try {
    return await prisma.supply.findMany({
      where: {
        id_treasury: id
      }
    })
  } catch (err) {
    console.log("SERVICE => [SUPPLY] *** FUNCTION => [GET_ATM_WIT_SUPPLY_FOR_ID_AND_DATE] *** ERROR =>", err)
    return null
  }
}

export const lastRegister = async () => {
  try {
    return await prisma.supply.findFirst({
      orderBy: {
        id: 'desc', // ou 'createdAt' se você tiver essa coluna
      },
    });
  } catch (err) {
    console.log("SERVICE => [SUPPLY] *** FUNCTION => [LAST_REGISTER] *** ERROR =>", err)
    return null
  }
}

export const getAllForDateAndTreasury = async (date: any, dateEnd: any, id_treasury: number) => {
  try {
    return await prisma.supply.findMany({
      where: {
        date: {
          gte: date,
          lt: dateEnd,
        },
        id_treasury
      }
    })
  } catch (err) {
    console.log("SERVICE => [SUPPLY] *** FUNCTION => [GET_ALL_FOR_DATE_AND_TREASURY] *** ERROR =>", err)
    return null
  }
}

export const getSupplyByOrder = async (numOrder: number) => {
  try {
    return await prisma.supply.findMany({
      where: {
        id_order: numOrder,
        status: true // ou outro status que você queira filtrar
      }
    })
  } catch (error) {
    console.log("SERVICE => [SUPPLY] *** FUNCTION => [GET_SUPPLY_BY_ORDER] *** ERROR =>", error)
    return null
  }
}