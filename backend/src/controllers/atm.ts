import { RequestHandler } from "express"
import { atmAddSchema } from "../schemas/atmAdd"
import { addAtm, addBalanceAtm, delAtm, getAllAtm, getAllAtmPagination, getForId, getForIdTreasury, updateAtm } from "../services/atm"
import { atmAddBalabceSchema } from "../schemas/atmAddBalabceSchema"

export const getAll: RequestHandler = async (req, res) => {
    const atm = await getAllAtm()
    if (!atm) {
        res.status(401).json({ error: 'Erro ao carregar!' })
        return
    }
    res.json({ atm })

}

export const getAllPagination: RequestHandler = async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 15;
    const skip = (page - 1) * pageSize;

    const atm = await getAllAtmPagination(page, pageSize)
    if (!atm) {
        res.status(401).json({ error: 'Erro ao carregar!' })
        return
    }
    res.json({ atm })

}

export const getAtmsForIdsTreasury: RequestHandler = async (req, res) => {
    const data = req.body
    if (!Array.isArray(data) || data.length === 0) {
        res.status(400).json({ error: 'Erro ao carregar!' })
        return
    }
    const atms = []
    for (let x = 0; data.length > x; x++) {
        if (data[x].id_treasury_destin) {
            const a = await getForIdTreasury(data[x].id_treasury_destin);
            if (a) {
                // Se 'a' já for um array, espalhe seus elementos
                if (Array.isArray(a)) {
                    atms.push(...a);
                } else {
                    // Caso não seja array, insira diretamente
                    atms.push(a);
                }
            }
        }
    }

    if (!atms) {
        res.status(401).json({ error: 'Erro ao carregar!' })
        return
    }
    res.json({ atm: atms })
}

export const getById: RequestHandler = async (req, res) => {
    const atmsId = req.params.id
    const atm = await getForId(parseInt(atmsId))
    if (!atm) {
        res.status(401).json({ error: 'Erro ao salvar!' })
        return
    }

    res.json({ atm })
}

export const add: RequestHandler = async (req, res) => {
    const safeData = atmAddSchema.safeParse(req.body)
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors })
        return
    }
    const newTAtm = await addAtm({
        id_system: safeData.data.id_system,
        name: safeData.data.name,
        short_name: safeData.data.short_name,
        treasury: {
            connect: { id: safeData.data.id_treasury }

        },
        number_store: safeData.data.number_store,
        cassete_A: safeData.data.cassete_A,
        cassete_B: safeData.data.cassete_B,
        cassete_C: safeData.data.cassete_C,
        cassete_D: safeData.data.cassete_D,

    })
    if (!newTAtm) {
        res.status(401).json({ error: 'Erro ao salvar!' })
        return
    }

    res.json({ atm: newTAtm })
}

export const addBalance: RequestHandler = async (req, res) => {
    const atmId = req.params.id
    if (!atmId) {
        res.status(401).json({ error: 'Informar ID para continuar!' })
        return
    }
    const safeData = atmAddBalabceSchema.safeParse(req.body)
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors })
        return
    }
    const newTAtm = await addBalanceAtm(parseInt(atmId), safeData.data)
    if (!newTAtm) {
        res.status(401).json({ error: 'Erro ao salvar!' })
        return
    }

    res.json({ atm: newTAtm })
}

export const update: RequestHandler = async (req, res) => {
    const atmId = req.params.id
    const safeData = atmAddSchema.safeParse(req.body)
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors })
        return
    }
    const updateA = await updateAtm(parseInt(atmId), safeData.data)
    if (!updateA) {
        res.status(401).json({ error: 'Erro ao Editar!' })
        return
    }

    res.json({ atm: updateA })

}

export const del: RequestHandler = async (req, res) => {
    const atmId = req.params.id
   if(!atmId){
        res.status(401).json({ error: 'Informar ID para continuar!' })
        return
    }
    const delA = await delAtm(parseInt(atmId))
    if (!delA) {
        res.status(401).json({ error: 'Erro ao Editar!' })
        return
    }

    res.json({ atm: delA })

}
