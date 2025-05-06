import { Prisma } from "@prisma/client"
import { prisma } from "../utils/prisma"
import { returnDateFormatted } from "../utils/returnDateFormatted"

export const getAllOrder = async () => {
  const order = await prisma.order.findMany()
  if (order) {
    return order
  }
  return null
}

export const getOrderById = async (id: number) => {
  const order = await prisma.order.findMany({
    where: {
      id,
      status_order: {
        not: 5
      }
    }
  })
  if (order) {
    return order
  }
  return null
}

export const getOrderByIds = async (ids: number[]) => {
  const order = await prisma.order.findMany({
    where: {
      id: {
        in: ids,
      },
    }
  })
  if (order) {
    return order
  }
  return null
}

export const getOrderByIdsForPaymment = async (ids: number[]) => {
  const order = await prisma.order.findMany({
    where: {
      id: {
        in: ids,
      },
      id_type_operation : {
        not: 3,
      }
    }
  })
  if (order) {
    return order
  }
  return null
}


export const getIdTreasuriesOrderByDate = async (date: string) => {
  const order = await prisma.order.findMany({
    where: {
      date_order: returnDateFormatted(date),
      status_order : {not : 5 }
    },
    select : {
      id : true,
      id_treasury_destin : true,
      requested_value_A : true,
      requested_value_B: true,
      requested_value_C : true,
      requested_value_D : true,
      confirmed_value_A : true,
      confirmed_value_B : true,
      confirmed_value_C : true,
      confirmed_value_D : true,
      date_order : true,
      status_order : true,
    }
  })
  if (order) {
    return order
  }
  return null
}

export const addOrder = async (data: Prisma.OrderCreateInput) => {
  const order = await prisma.order.create({ data })
  if (order) {
    return order
  }
  return null
}

type alterRequestsOrderType = {
  requested_value_A: number;
  requested_value_B: number;
  requested_value_C: number;
  requested_value_D: number;
  observation ?: string
}
export const alterRequestsOrderForID = async (id: number, data: alterRequestsOrderType) => {
  const order = await prisma.order.update({
    where: {
      id
    },
    data
  })
  if (order) {
    return order
  }
  return null
}

export const searchByOrderDate = async (data: { date_initial: Date, date_final: Date }) => {
  const order = await prisma.order.findMany({
    where: {
      date_order: {
        gte: data.date_initial,
        lte: data.date_final
      },
      status_order: {
        not: 5
      }
    }
  })
  if (order) {
    return order
  }
  return null
}

export const searchByOrderDatePagination = async (data: { date_initial: Date, date_final: Date, page: number, pageSize: number }) => {

  try {
    const [orders, totalItems] = await prisma.$transaction([
      prisma.order.findMany({
        where: {
          date_order: {
            gte: data.date_initial,
            lte: data.date_final
          },
          status_order: {
            not: 5
          }
        },
        skip: (data.page - 1) * data.pageSize,  // Cálculo da paginação
        take: data.pageSize,
        orderBy: {
          date_order: 'desc'  // Importante para consistência na paginação
        }
      }),
      prisma.order.count({  // Contagem total para cálculo de páginas
        where: {
          date_order: {
            gte: data.date_initial,
            lte: data.date_final
          },
          status_order: {
            not: 5
          }
        }
      })
    ]);

    return {
      data: orders,
      meta: {
        totalItems: totalItems,
        totalPages: Math.ceil(totalItems / data.pageSize),
        currentPage: data.page,
        pageSize: data.pageSize
      }
    };

  } catch (error) {
    console.error("Erro na busca paginada:", error);
    return null;
  }

}

export const delOrderById = async (id: number) => {
  const order = await prisma.order.update({
    where: {
      id,
      status_order: {
      }
    },
    data: {
      status_order: 5
    }
  })
  if (order) {
    return order
  }
  return null
}

export const confirmTotalByIds = async (ids: number[]) => {
  const results = []
  for (const id of ids) {
    try {
      const order = await prisma.order.findUnique({
        where: {
          id,
        },
        select: {
          requested_value_A: true,
          requested_value_B: true,
          requested_value_C: true,
          requested_value_D: true,
        },
      });

      if (order) {
        await prisma.order.update({
          where: {
            id,
          },
          data: {
            confirmed_value_A: order.requested_value_A,
            confirmed_value_B: order.requested_value_B,
            confirmed_value_C: order.requested_value_C,
            confirmed_value_D: order.requested_value_D,
            status_order: 2
          },
        });
        results.push({ id, status: "success", message: "Pedido atualizado com sucesso." })
      } else {
        results.push({ id, status: "failed", message: "Pedido não encontrado." });
      }
    } catch (error: any) {
      results.push({ id, status: "failed", message: `Erro ao atualizar: ${error.message}` });
    }

  }
  const allSuccess = results.every(result => result.status === "success");
  if (allSuccess) {
    return allSuccess
  } else {
    return results.filter(result => result.status === "failed");
  }

}

type alterConfirmPartialOrderType = {
  confirmed_value_A: number,
  confirmed_value_B: number,
  confirmed_value_C: number,
  confirmed_value_D: number,
  status_order: number;
}
export const alterConfirmPatialById = async (id: number, data: alterConfirmPartialOrderType) => {
  const order = await prisma.order.update({
    where: {
      id
    },
    data
  })
  if (order) {
    return order
  }
  return null

}

export const alterDateOrderById = async (id: number, data: { date_order: Date }) => {
  const order = await prisma.order.update({
    where: {
      id
    },
    data
  })
  if (order) {
    return order
  }
  return null

}

export const updateOrder = async (id: number, data: Prisma.OrderUpdateInput) => {
  const order = await prisma.order.update({
    where: {
      id
    },
    data
  })
  if (order) {
    return order
  }
  return null

}

export const confirmPaymantAllIds = async (ids : number[]) => {
 const order =  await prisma.order.updateMany({
    where: {
      id: { in: ids },
      id_type_operation : { not : 3 } 
    },
    data: {
      status_order: 4,
    },
  });

  if(order){
    return order
  }

  return null
}

