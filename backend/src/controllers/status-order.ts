import { RequestHandler } from "express"
import { statusOrderAddSchema } from "../schemas/statusOrderAddSchema"
import { addStatusOrder, getAllStatusOrder } from "../services/statusOrder"


export const getAll : RequestHandler = async (req, res) => {
   const statusOrder = await getAllStatusOrder()
   if(!statusOrder) {
    res.status(401).json({ error : 'Erro ao carregar!' })
    return
   }
   res.json({ statusOrder })

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