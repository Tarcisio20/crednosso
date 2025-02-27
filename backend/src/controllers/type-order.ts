import { RequestHandler } from "express"
import { typeOrderAddSchema } from "../schemas/typeOrderAddSchema"
import { addTypeOrder } from "../services/typeOrder"

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