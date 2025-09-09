import { RequestHandler } from "express"
import { addError, delOperationalError, editOperationalError, getAllOperationalErrorPagination, getOperationErroForId } from "../services/operational-error";
import { operationalErrorAddSchema } from "../schemas/operationalErrorAdd";

export const getAllPagination: RequestHandler = async (req, res) => {
   try {
    // Sanitização
    const pageRaw = Number(req.query.page);
    const sizeRaw = Number(req.query.pageSize);

    const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;
    const pageSize = Number.isFinite(sizeRaw) && sizeRaw > 0 ? Math.min(Math.floor(sizeRaw), 100) : 15;

    // Chama o service
    const result = await getAllOperationalErrorPagination(page, pageSize);

    if (!result) {
      res.status(401).json({ error: 'Erro ao carregar!' })
    return
    }

      res.json({ operationalError : result })
      return

  } catch (err: any) {
     res.status(500).json({ error: "Erro interno" });
    return
  }

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

export const getOperationalErrorById: RequestHandler = async (req, res) => {
    const operationalErrorId = req.params.id
   if(!operationalErrorId){
        res.status(401).json({ error: 'Informar ID para continuar!' })
        return
    }
    const operationalError = await getOperationErroForId(parseInt(operationalErrorId))
    if (!operationalError) {
        res.status(401).json({ error: 'Erro ao carregar!' })
        return
    }
    res.json({ operationalError })
}

export const edit: RequestHandler = async (req, res) => {
    const operationalErrorId = req.params.id
    const safeData = operationalErrorAddSchema.safeParse(req.body)

   if(!operationalErrorId){
        res.status(401).json({ error: 'Informar ID para continuar!' })
        return
    }
     if (!safeData.success) {
        res.status(300).json({ error: safeData.error.flatten().fieldErrors })
        return
    }
    const editE = await editOperationalError(parseInt(operationalErrorId),  safeData.data)
    if (!editE) {
        res.status(401).json({ error: 'Erro ao Editar!' })
        return
    }

    res.json({ operationalError : editE })

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

