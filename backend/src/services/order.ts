import { Prisma } from "@prisma/client"
import { prisma } from "../utils/prisma"

export type FilterOrdersDTO = {
  transportadora?: string | null;
  statusPedido?: number[] | string | null; // aceita array OU string "1,2,3"
  datas?: {
    inicial?: string | null;
    final?: string | null;
  };
};

function normalizeStatusPedido(input: unknown): number[] {
  // Caso já venha array: [1, 2, 3] ou ['1', '2', '3']
  if (Array.isArray(input)) {
    return input
      .map((v) => Number(v))
      .filter((n) => Number.isFinite(n));
  }

  // Caso venha string: "1,2,3"
  if (typeof input === "string") {
    const trimmed = input.trim();
    if (!trimmed) return [];

    return trimmed
      .split(",")
      .map((p) => Number(p.trim()))
      .filter((n) => Number.isFinite(n));
  }

  // Qualquer outra coisa → ignora
  return [];
}

export const getAllOrder = async () => {
  try {
    return await prisma.order.findMany()
  } catch (err) {
    console.log("SERVICE => [ORDER] *** FUNCTION => [GET_ALL_ORDER] *** ERROR =>", err)
    return null;
  }
}

export const getOrderById = async (id: number) => {
  try {
    return await prisma.order.findMany({
      where: {
        id,
        status_order: {
          not: 5
        }
      }
    })

  } catch (err) {
    console.log("SERVICE => [ORDER] *** FUNCTION => [GET_ORDER_BY_ID] *** ERROR =>", err)
    return null
  }

}

export const getOrderByIds = async (ids: number[]) => {
  try {
    return await prisma.order.findMany({
      where: {
        id: {
          in: ids,
        },
      }
    })
  } catch (err) {
    console.log("SERVICE => [ORDER] *** FUNCTION => [GET_ORDER_BY_IDS] *** ERROR =>", err)
    return null
  }
}

export const getOrderByIdsForPaymment = async (ids: number[]) => {
  try {
    return await prisma.order.findMany({
      where: {
        id: {
          in: ids,
        },
        id_type_operation: {
          notIn: [5],
        },
        status_order: {
          notIn: [5]
        }
      }
    })
  } catch (err) {
    console.log("SERVICE => [ORDER] *** FUNCTION => [GET_ORDER_BY_IDS_FOR_PAYMMENT] *** ERROR =>", err)
    return null
  }
}

export const getIdTreasuriesOrderByDate = async (date: string) => {
  try {
    return await prisma.order.findMany({
      where: {
        date_order: new Date(date),
        status_order: { not: 5 }
      },
      select: {
        id: true,
        id_type_operation: true,
        id_treasury_origin: true,
        id_treasury_destin: true,
        requested_value_A: true,
        requested_value_B: true,
        requested_value_C: true,
        requested_value_D: true,
        confirmed_value_A: true,
        confirmed_value_B: true,
        confirmed_value_C: true,
        confirmed_value_D: true,
        observation: true,
        status_order: true,
        composition_change: true,
        date_order: true,
      }
    })
  } catch (err) {
    console.log("SERVICE => [ORDER] *** FUNCTION => [GET_ID_TREASURIES_ORDER_BY_DATE] *** ERROR =>", err)
    return null

  }
}

export const addOrder = async (data: Prisma.OrderCreateInput) => {
  try {
    return await prisma.order.create({ data })
  } catch (err) {
    console.log("SERVICE => [ORDER] *** FUNCTION => [ADD_ORDER] *** ERROR =>", err)
    return null
  }
}

type alterRequestsOrderType = {
  requested_value_A: number;
  requested_value_B: number;
  requested_value_C: number;
  requested_value_D: number;
  observation?: string
}
export const alterRequestsOrderForID = async (id: number, data: alterRequestsOrderType) => {
  try {
    return await prisma.order.update({
      where: {
        id
      },
      data
    })
  } catch (err) {
    console.log("SERVICE => [ORDER] *** FUNCTION => [ALTER_REQUESTS_ORDER_FOR_ID] *** ERROR =>", err)
    return null
  }
}

export const searchByOrderDate = async (data: { date_initial: Date, date_final: Date }) => {
  try {
    return await prisma.order.findMany({
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
  } catch (err) {
    console.log("SERVICE => [ORDER] *** FUNCTION => [SEARCH_BY_ORDER_DATE] *** ERROR =>", err)
    return null
  }
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
    console.log("SERVICE => [ORDER] *** FUNCTION => [SEARCH_BY_ORDER_DATE_PAGINATION] *** ERROR =>", error);
    return null;
  }

}

export const delOrderById = async (id: number) => {
  try {
    return await prisma.order.update({
      where: {
        id,
        status_order: {
        }
      },
      data: {
        status_order: 5
      }
    })
  } catch (err) {
    console.log("SERVICE => [ORDER] *** FUNCTION => [DEL_ORDER_BY_ID] *** ERROR =>", err)
    return null
  }
}

export const confirmTotalByIds = async (ids: number[]) => {
  try {
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
              status_order: 2,
              for_release: true,
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
  } catch (err) {
    console.log("SERVICE => [ORDER] *** FUNCTION => [CONFIRM_TOTAL_BY_IDS] *** ERROR =>", err)
    return null
  }
}

export const getInfosOrders = async (id: number) => {
  try {
    return await prisma.order.findUnique({
      where: {
        id,
      }
    });
  } catch (err) {
    console.log("SERVICE => [ORDER] *** FUNCTION => [GET_INFOS_ORDERS] *** ERROR =>", err)
    return null
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
  try {
    return await prisma.order.update({
      where: {
        id
      },
      data
    })
  } catch (err) {
    console.log("SERVICE => [ORDER] *** FUNCTION => [ALTER_CONFIRM_PATIAL_BY_ID] *** ERROR =>", err)
    return null
  }
}

export const alterDateOrderById = async (id: number, data: { date_order: Date }) => {
  try {
    return await prisma.order.update({
      where: {
        id
      },
      data
    })
  } catch (err) {
    console.log("SERVICE => [ORDER] *** FUNCTION => [ALTER_DATE_ORDER_BY_ID] *** ERROR =>", err)
    return null
  }
}

export const updateOrder = async (id: number, data: Prisma.OrderUpdateInput) => {
  try {
    return await prisma.order.update({
      where: {
        id
      },
      data
    })
  } catch (err) {
    console.log("SERVICE => [ORDER] *** FUNCTION => [UPDATE_ORDER] *** ERROR =>", err)
    return null
  }
}

export const confirmPaymantAllIds = async (ids: number[]) => {
  try {
    return await prisma.order.updateMany({
      where: {
        id: { in: ids },
        id_type_operation: {
          notIn: [3, 4, 5, 6]
        }
      },
      data: {
        status_order: 4,
      },
    });
  } catch (err) {
    console.log("SERVICE => [ORDER] *** FUNCTION => [CONFIRM_PAYMANT_ALL_IDS] *** ERROR =>", err)
    return null
  }
}

export const getMediasYears = async () => {
  try {
    const medias = await prisma.$queryRaw<
      {
        ano: number
        mes: number
        media_solicitada: number
        media_confirmada: number
      }[]
    >`
      SELECT
        YEAR(date_order) AS ano,
        MONTH(date_order) AS mes,
        AVG(
          (requested_value_A * 10) +
          (requested_value_B * 20) +
          (requested_value_C * 50) +
          (requested_value_D * 100)
        ) AS media_solicitada,
        AVG(
          (confirmed_value_A * 10) +
          (confirmed_value_B * 20) +
          (confirmed_value_C * 50) +
          (confirmed_value_D * 100)
        ) AS media_confirmada
      FROM \`order\`
      GROUP BY ano, mes
      ORDER BY ano, mes;
    `

    if (!medias) return null

    const agrupadoPorAno = medias.reduce((acc, item) => {
      const { ano, mes, media_solicitada, media_confirmada } = item
      let anoExistente = acc.find((entry) => entry.ano === ano)

      if (!anoExistente) {
        anoExistente = {
          ano,
          total_solicitado: 0,
          total_confirmado: 0,
          meses: [],
        }
        acc.push(anoExistente)
      }

      anoExistente.total_solicitado += media_solicitada
      anoExistente.total_confirmado += media_confirmada
      anoExistente.meses.push({ mes, media_solicitada, media_confirmada })

      return acc
    }, [] as {
      ano: number
      total_solicitado: number
      total_confirmado: number
      meses: {
        mes: number
        media_solicitada: number
        media_confirmada: number
      }[]
    }[])

    return agrupadoPorAno
  } catch (error) {
    console.log("SERVICE => [ORDER] *** FUNCTION => [GET_MEDIAS_YEARS] *** ERROR =>", error)
    return null
  }
}

export const getOrdersFiltereds = async (data: FilterOrdersDTO) => {
  try {
    const where: Prisma.OrderWhereInput = {};

    // -------- 1) Transportadora -> id_treasury_origin --------
    const transportadora = (data.transportadora ?? "").trim();
    if (transportadora !== "") {
      const idTreasury = Number(transportadora);
      if (!Number.isNaN(idTreasury)) {
        where.id_treasury_origin = idTreasury;
      }
    }

    // -------- 2) Status do pedido -> status_order IN [] --------
    const statusArray = normalizeStatusPedido(data.statusPedido);

    if (statusArray.length > 0) {
      where.status_order = {
        in: statusArray,
      };
    }

    // -------- 3) Datas -> date_order entre inicial e final --------
    const inicial = (data.datas?.inicial ?? "").trim();
    const final = (data.datas?.final ?? "").trim();

    if (inicial !== "" || final !== "") {
      where.date_order = {};

      if (inicial !== "") {
        (where.date_order as Prisma.DateTimeFilter).gte = new Date(
          `${inicial}T00:00:00`,
        );
      }

      if (final !== "") {
        (where.date_order as Prisma.DateTimeFilter).lte = new Date(
          `${final}T23:59:59`,
        );
      }
    }

    // 🔍 DEBUG – ver exatamente o que está indo para o Prisma
    console.log(
      "WHERE PRISMA (getOrdersFiltereds):",
      JSON.stringify(where, null, 2),
    );

    const result = await prisma.order.findMany({
      where,
      orderBy: { date_order: "desc" },
    });

    // 🔍 DEBUG – ver distribuição de status
    const contagemPorStatus = result.reduce<Record<number, number>>(
      (acc, cur) => {
        acc[cur.status_order] = (acc[cur.status_order] || 0) + 1;
        return acc;
      },
      {},
    );
    console.log("RESUMO STATUS ENCONTRADOS:", contagemPorStatus);

    return result;
  } catch (err) {
    console.log(
      "SERVICE => [ORDER] *** FUNCTION => [GET_ORDERS_FILTEREDS] *** ERROR =>",
      err,
    );
    return null;
  }
};
