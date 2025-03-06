import { Prisma } from "@prisma/client"
import { prisma } from "../utils/prisma"


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
                        status_order  : 2
                    },
                });
                results.push({ id, status: "success", message: "Pedido atualizado com sucesso." })
            } else {
                results.push({ id, status: "failed", message: "Pedido não encontrado." });
            }
        } catch (error : any) {
            results.push({ id, status: "failed", message: `Erro ao atualizar: ${error.message}` });
        }
       
    }
    const allSuccess = results.every(result => result.status === "success");
    if (allSuccess) {
        return allSuccess
        console.log("Todos os pedidos foram atualizados com sucesso!");
    } else {
        return results.filter(result => result.status === "failed");
    }

}

type alterConfirmPartialOrderType = {
    confirmed_value_A : number,
    confirmed_value_B : number,
    confirmed_value_C : number,
    confirmed_value_D : number,
    status_order : number;
}
export const alterConfirmPatialById = async (id : number, data: alterConfirmPartialOrderType) => {
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