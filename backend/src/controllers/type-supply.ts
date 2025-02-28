import { RequestHandler } from "express"
import { typeSupplyAddSchema } from "../schemas/typeSupplyAddSchema"
import { addTypeSupply } from "../services/type-supply"

export const add :RequestHandler = async (req, res) => {
     const safeData = typeSupplyAddSchema.safeParse(req.body)
         if(!safeData.success){
            res.json({ error : safeData.error.flatten().fieldErrors })
            return 
        }
        const newTSupply = await addTypeSupply({
            name : safeData.data.name
        })
        if(!newTSupply){
            res.status(401).json({ error : 'Erro ao salvar!' })
            return
        }
    
        res.json({ typeSupply : newTSupply })
}
