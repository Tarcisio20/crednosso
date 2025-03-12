import { RequestHandler } from "express"
import { typeOrderAddSchema } from "../schemas/typeOrderAddSchema"
import { addTypeOrder, getAllTypeOrder, getAllTypeOrderPagination, getTypeOrderForId, updateTypeOrder } from "../services/typeOrder"

export const getAll : RequestHandler = async (req, res) => {
   const typeOrder = await getAllTypeOrder()
   if(!typeOrder) {
    res.status(401).json({ error : 'Erro ao carregar!' })
    return
   }
   res.json({ typeOrder })

}

export const getAllPagination : RequestHandler = async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 15;
    const skip = (page - 1) * pageSize;

    const typeOrder = await getAllTypeOrderPagination(page, pageSize)
    if(!typeOrder) {
     res.status(401).json({ error : 'Erro ao carregar!' })
     return
    }
    res.json({ typeOrder })
 
 }

export const getById : RequestHandler = async (req, res) => {
    const typeOrderId = req.params.id
    const typeOrder = await getTypeOrderForId(typeOrderId)
    if(!typeOrder){
        res.status(401).json({ error : 'Erro ao salvar!' })
        return
    }

    res.json({ typeOrder  })
}

export const add :RequestHandler = async (req, res) => {
     const safeData = typeOrderAddSchema.safeParse(req.body)
         if(!safeData.success){
            res.json({ error : safeData.error.flatten().fieldErrors })
            return 
        }
        const newTOrder = await addTypeOrder({
            id_system : safeData.data.id_system,
            name : safeData.data.name
        })
        if(!newTOrder){
            res.status(401).json({ error : 'Erro ao salvar!' })
            return
        }
    
        res.json({ typeOrder : newTOrder })
}

export const update : RequestHandler = async (req, res) => {
    const typeOrderId = req.params.id
    const safeData = typeOrderAddSchema.safeParse(req.body)

    if(!safeData.success){
        res.json({ error : safeData.error.flatten().fieldErrors })
        return 
    }
    const updateType = await updateTypeOrder(parseInt(typeOrderId), safeData.data)
    if(!updateType){
        res.status(401).json({ error : 'Erro ao Editar!' })
        return
    }
    res.json({ typeOrder : updateType })

}

export const del : RequestHandler = async (req, res) => {
    const typeOrderId = req.params.id
    const safeData = typeOrderAddSchema.safeParse(req.body)

    if(!safeData.success){
        res.json({ error : safeData.error.flatten().fieldErrors })
        return 
    }
    const updateType = await updateTypeOrder(parseInt(typeOrderId), safeData.data)
    if(!updateType){
        res.status(401).json({ error : 'Erro ao Editar!' })
        return
    }
    res.json({ typeOrder : updateType })

}