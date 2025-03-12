import { RequestHandler } from "express"
import { statusOrderAddSchema } from "../schemas/statusOrderAddSchema"
import { addStatusOrder, getAllStatusOrder, getAllStatusOrderPagination, getStatusOrderForId, updateStatusOrder } from "../services/statusOrder"


export const getAll : RequestHandler = async (req, res) => {
   const statusOrder = await getAllStatusOrder()
   if(!statusOrder) {
    res.status(401).json({ error : 'Erro ao carregar!' })
    return
   }
   res.json({ statusOrder })

}

export const getAllPagination : RequestHandler = async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 15;
    const skip = (page - 1) * pageSize;

    const statusOrder = await getAllStatusOrderPagination(page, pageSize)
    if(!statusOrder) {
     res.status(401).json({ error : 'Erro ao carregar!' })
     return
    }
    res.json({ statusOrder })
 
 }
 

export const getById : RequestHandler = async (req, res) => {
    const statusOrderId = req.params.id
    const statusOrder = await getStatusOrderForId(statusOrderId)
    if(!statusOrder){
        res.status(401).json({ error : 'Erro ao salvar!' })
        return
    }

    res.json({ statusOrder  })
}


export const add :RequestHandler = async (req, res) => {
     const safeData = statusOrderAddSchema.safeParse(req.body)
         if(!safeData.success){
            res.json({ error : safeData.error.flatten().fieldErrors })
            return 
        }
        const newStatusOrder = await addStatusOrder({
            name : safeData.data.name
        })
        if(!newStatusOrder){
            res.status(401).json({ error : 'Erro ao salvar!' })
            return
        }
    
        res.json({ statusOrder : newStatusOrder })
}

export const update : RequestHandler = async (req, res) => {
    const typeStatusOrderId = req.params.id
    const safeData = statusOrderAddSchema.safeParse(req.body)
    if(!safeData.success){
        res.json({ error : safeData.error.flatten().fieldErrors })
        return 
    }
    const updateSOrder = await updateStatusOrder(parseInt(typeStatusOrderId), safeData.data)
    if(!updateSOrder){
        res.status(401).json({ error : 'Erro ao Editar!' })
        return
    }

    res.json({ statusOrder : updateSOrder })

}