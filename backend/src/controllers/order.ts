import { RequestHandler } from "express"
import { orderAddSchema } from "../schemas/orderAddSchema"
import { addOrder, alterRequestsOrderForID, confirmTotalByIds, delOrderById, getOrderById, searchByOrderDate } from "../services/order"
import { returnDateFormatted } from "../utils/returnDateFormatted"
import { orderSearchDateSchema } from "../schemas/orderSearchDate"
import { alterRequestsOrderSchema } from "../schemas/alterRequestsOrderSchema"

export const getById: RequestHandler = async (req, res) => {
    const orderId = req.params.id
    if(!orderId){
        res.status(401).json({ error: 'Preciso de um ID para continuar!' })
        return
    }
    const order = await getOrderById(parseInt(orderId))
    if (!order) {
        res.status(401).json({ error: 'Erro ao salvar!' })
        return
    }

    res.json({ order })
}

export const add: RequestHandler = async (req, res) => {
    const safeData = orderAddSchema.safeParse(req.body)
    console.log(safeData.error)
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors })
        return
    }
    const newOrder = await addOrder({
        typeOperation : {
            connect : {
                id : safeData.data.id_type_operation
            }
        },
        treasuryOrigin : {
            connect : {
                id : safeData.data.id_treasury_origin
            }
        },
        treasuryDestin : {
            connect : {
                id : safeData.data.id_treasury_destin
            }
        },
        date_order:  returnDateFormatted(safeData.data.date_order),
        typeOrder : {
            connect : {
                id : safeData.data.id_type_order
            }
        },
        requested_value_A: safeData.data.requested_value_A,
        requested_value_B: safeData.data.requested_value_B,
        requested_value_C: safeData.data.requested_value_C,
        requested_value_D: safeData.data.requested_value_D,
        statusOrder : {
            connect : {
                id :  safeData.data.status_order
            }
        },
        observation : safeData.data.observation === undefined ? '' : safeData.data.observation
    })
    if (!newOrder) {
        res.status(401).json({ error: 'Erro ao salvar!' })
        return
    }

    res.json({ order: newOrder })
}

export const alterRequestsById: RequestHandler = async (req, res) => {
    const orderId = req.params.id
    if(!orderId){
        res.status(401).json({ error: 'Preciso de um ID para continuar!' })
        return
    }
    const safeData = alterRequestsOrderSchema.safeParse(req.body)
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors })
        return
    }
    const newOrder = await alterRequestsOrderForID(parseInt(orderId), {
        requested_value_A : safeData.data.requested_value_A,
        requested_value_B : safeData.data.requested_value_B,
        requested_value_C : safeData.data.requested_value_C,
        requested_value_D : safeData.data.requested_value_D,
    })
    if (!newOrder) {
        res.status(401).json({ error: 'Erro ao salvar!' })
        return
    }

    res.json({ order: newOrder })
}

export const searchByDate: RequestHandler = async (req, res) => {
    const safeData = orderSearchDateSchema.safeParse(req.body)
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors })
        return
    }
    const searchOrder = await searchByOrderDate({
       date_initial : returnDateFormatted(safeData.data.date_initial),
       date_final : returnDateFormatted(safeData.data.date_final),
    })
    if (!searchOrder) {
        res.status(401).json({ error: 'Erro ao salvar!' })
        return
    }

    res.json({ order: searchOrder })
}

export const delById: RequestHandler = async (req, res) => {
    const orderId = req.params.id
    if(!orderId){
        res.status(401).json({ error: 'Preciso de um ID para continuar!' })
        return
    }
    const order = await delOrderById(parseInt(orderId))
    if (!order) {
        res.status(401).json({ error: 'Erro ao salvar!' })
        return
    }

    res.json({ order })
}

export const confirmTotal: RequestHandler = async (req, res) => {
    const safeData = req.body

    if(safeData.length === 0){
        res.status(401).json({ error: 'Preciso de um ID para continuar!' })
        return
    }

    const order = await confirmTotalByIds(safeData)
    if (!order) {
        res.status(401).json({ error: 'Erro ao salvar!' })
        return
    }

    res.json({ order })
}
