import { RequestHandler } from "express"
import { addRattedRefundSchema } from "../schemas/addRattedRefundSchema";
import { addRefund, getRefusedForIdOrder } from "../services/money-split-refund";

export const add : RequestHandler = async (req, res) => {

     const safeData = addRattedRefundSchema.safeParse(req.body);
    if (!safeData.success) {
        res.status(401).json({ error: 'Dados inválidos!' })
        return
    }

    const data = {
        order : {
            connect: { id: safeData.data.id_order }
        },
        treasury : {
            connect: { id: safeData.data.id_treasury_origin }
        },
        value : safeData.data.value,
    }

    const moneySplitRefund = await addRefund(data)
    if (!moneySplitRefund) {
        res.status(401).json({ error: 'Erro ao carregar!' })
        return
    }
    res.json({ moneySplitRefund })

}

export const getResultByIdOrder : RequestHandler = async (req, res) => {

    const { id } = req.params
    if (!id) {  
        res.status(401).json({ error: 'Dados inválidos!' })
        return
    }

    const moneySplitRefund = await getRefusedForIdOrder(parseInt(id))


    if (!moneySplitRefund) {
        res.status(401).json({ error: 'Erro ao carregar!' })
        return
    }
    res.json({ moneySplitRefund })

}
