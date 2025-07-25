import { RequestHandler } from "express"
import { addError, delOperationalError, getAllAtmPagination } from "../services/operational-error";
import { operationalErrorAddSchema } from "../schemas/operationalErrorAdd";

export const getAllPagination: RequestHandler = async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 15;
    const skip = (page - 1) * pageSize;

    const operationalError = await getAllAtmPagination(page, pageSize)
    if (!operationalError) {
        res.status(401).json({ error: 'Erro ao carregar!' })
        return
    }
    res.json({ operationalError })

}

export const add: RequestHandler = async (req, res) => {
    const safeData = operationalErrorAddSchema.safeParse(req.body)
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors })
        return
    }
    const newOError = await addError({
        treasury: {
            connect: { id: safeData.data.id_treasury }
        },
        num_os : safeData.data.num_os,
        description : safeData.data.description,
    })
    if (!newOError) {
        res.status(401).json({ error: 'Erro ao salvar!' })
        return
    }

    res.json({ operationalError: newOError })
}


export const del: RequestHandler = async (req, res) => {
    const operationalErrorId = req.params.id
   if(!operationalErrorId){
        res.status(401).json({ error: 'Informar ID para continuar!' })
        return
    }
    const delE = await delOperationalError(parseInt(operationalErrorId))
    if (!delE) {
        res.status(401).json({ error: 'Erro ao Editar!' })
        return
    }

    res.json({ operationalError : delE })

}

