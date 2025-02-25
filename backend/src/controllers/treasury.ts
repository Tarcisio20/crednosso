import { RequestHandler } from "express";
import { treasuryAddSchema } from "../schemas/treasuryAdd";
import { addTreasury } from "../services/treasury";

export const getAll : RequestHandler = async (req, res) => {
    
} 

export const add : RequestHandler = async (req, res) => {
     const safeData = treasuryAddSchema.safeParse(req.body)
     if(!safeData.success){
        res.json({ error : safeData.error.flatten().fieldErrors })
        return 
    }
    const newTreasury = await addTreasury({
        id_system : safeData.data.id_system,
        name : safeData.data.name,
        short_name : safeData.data.short_name,
        account_number : safeData.data.account_number,
        gmcore_number : safeData.data.gmcore_number,
    })
    if(!newTreasury){
        res.status(401).json({ error : 'Erro ao salvar!' })
        return
    }

    res.json({ treasury : newTreasury })
}