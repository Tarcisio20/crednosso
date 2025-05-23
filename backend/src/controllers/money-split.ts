import { RequestHandler } from "express"
import { addRatteds, getMoneySplitByIdOrder, getMoneySplitByIdTreasury } from "../services/money-split"
import { addRattedSchema } from "../schemas/addRattedSchema"
import { getByIdSystem } from "./treasury"
import { getForIdSystem } from "../services/treasury"
import { returnDate } from "../utils/returnDate"
import { getById } from "./order"
import { OrderType } from "../types/OrderType"
import { returnValueInReal } from "../utils/returnValueInReal"

export const getForIdOrder: RequestHandler = async (req, res) => {

    const { id } = req.params
    if (!id) {
        res.status(401).json({ error: 'ID não informado!' })
        return
    }

    const moneySplit = await getMoneySplitByIdOrder(parseInt(id))
    if (!moneySplit) {
        res.status(401).json({ error: 'Erro ao carregar!' })
        return
    }
    res.json({ moneySplit })

}

export const addAllRatteds: RequestHandler = async (req, res) => {

    const safeData = addRattedSchema.safeParse(req.body);
    if (!safeData.success) {
        res.status(401).json({ error: 'Dados inválidos!' })
        return
    }

    const moneySplit = await addRatteds(safeData.data)
    if (!moneySplit) {
        res.status(401).json({ error: 'Erro ao carregar!' })
        return
    }
    res.json({ moneySplit })

}

export const getAllByIdTreasury: RequestHandler = async (req, res) => {
    const { id, id_order } = req.params
    
    if (!id && !id_order) {
        res.status(401).json({ error: 'ID não informado!' })
        return
    }
    const moneySplit = await getMoneySplitByIdTreasury(parseInt(id), parseInt(id_order))


    if (!moneySplit) {
        res.status(401).json({ error: 'Erro ao carregar!' })
        return
    }
    res.json({ moneySplit })
    return

}

export const getAllByIdTreasuryAjusted: RequestHandler = async (req, res) => {
    const { id, id_order } = req.params
    if (!id) {
        res.status(401).json({ error: 'ID não informado!' })
        return
    }
    const moneySplit = await getMoneySplitByIdTreasury(parseInt(id) , parseInt(id_order))
    let result;
    if (moneySplit && moneySplit.length > 0) {
        result = await Promise.all( // <- Aqui está a correção
            moneySplit.map(async (item) => {
                const t = await getForIdSystem(item.id_treasury_rating.toString());
                const t_o = await getForIdSystem(item.id_treasury_origin.toString());
                return {
                    id_order: item.id_order,
                    codigo: item.id_treasury_rating,
                    conta: t?.account_number,
                    tesouraria: t?.name,
                    gmcore: t?.gmcore_number,
                    regiao: t?.region,
                    valor: returnValueInReal(item.value),
                    id_type_store: t?.id_type_store,
                    date: returnDate(item.createdAt),
                    conta_pagamento: t?.account_number_for_transfer,
                    valorRealizado: returnValueInReal(item.value),
                    estorno: 'R$ 00,00',
                    codigo_destin: item.id_treasury_origin,
                    tesouraria_origem: t_o?.name,
                    type : 'RAT',
                };
            })
        );

    }
    if (!result) {
        res.status(401).json({ error: 'Erro ao carregar!' })
        return
    }
    res.json({ moneySplit : result })
    return

}