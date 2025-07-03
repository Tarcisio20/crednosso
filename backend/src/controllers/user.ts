import { RequestHandler } from "express"
import { getAllUserPagination } from "../services/user";
import { AddUserSchema } from "../schemas/userAddSchema";

export const getAllPagination: RequestHandler = async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 15;
    const skip = (page - 1) * pageSize;

    const users = await getAllUserPagination(page, pageSize)
    if (!users) {
        res.status(401).json({ error: 'Erro ao carregar!' })
        return
    }
    res.json({ users })

}

export const add: RequestHandler = async (req, res) => {
    const safeData = AddUserSchema.safeParse(req.body)
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors })
        return
    }
    // const newTAtm = await addAtm({
    //     id_system: safeData.data.id_system,
    //     name: safeData.data.name,
    //     short_name: safeData.data.short_name,
    //     treasury: {
    //         connect: { id: safeData.data.id_treasury }

    //     },
    //     number_store: safeData.data.number_store,
    //     cassete_A: safeData.data.cassete_A,
    //     cassete_B: safeData.data.cassete_B,
    //     cassete_C: safeData.data.cassete_C,
    //     cassete_D: safeData.data.cassete_D,

    // })
    const newTAtm = true
    if (!newTAtm) {
        res.status(401).json({ error: 'Erro ao salvar!' })
        return
    }

    res.json({ atm: newTAtm })
}
