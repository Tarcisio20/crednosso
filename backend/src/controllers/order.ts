import { RequestHandler } from "express"
import { orderAddSchema } from "../schemas/orderAddSchema"
import { addOrder } from "../services/order"
import { returnDateFormatted } from "../utils/returnDateFormatted"

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
