import { RequestHandler } from "express"
import { getAllBank } from "../services/bank"

export const getAll : RequestHandler = async (req, res) => {
    const bank = await getAllBank()
    if (!bank) {
        res.status(401).json({ error: 'Erro ao carregar!' })
        return
    }
    res.status(200).json({ bank })

}