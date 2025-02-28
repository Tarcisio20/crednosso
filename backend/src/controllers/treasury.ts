import { RequestHandler } from "express";
import { treasuryAddSchema } from "../schemas/treasuryAdd";
import { addBalanceInTreasuryByIdSystem, addTreasury, getAllTreasury, getForIdSystem, updateTreasury } from "../services/treasury";
import { treasuryAddBalanceSchema } from "../schemas/treasuryAddBalance";

export const getAll : RequestHandler = async (req, res) => {
   const treasury = await getAllTreasury()
   if(!treasury) {
    res.status(401).json({ error : 'Erro ao carregar!' })
    return
   }
   res.json({ treasury })

}

export const getByIdSystem : RequestHandler = async (req, res) => {
    const treasuryId = req.params.id
    const treasury = await getForIdSystem(treasuryId)
    if(!treasury){
        res.status(401).json({ error : 'Erro ao salvar!' })
        return
    }

    res.json({ treasury  })
}

export const add : RequestHandler = async (req, res) => {
     const safeData = treasuryAddSchema.safeParse(req.body)
     console.log(req.body)
     if(!safeData.success){
        res.json({ error : safeData.error.flatten().fieldErrors })
        return 
    }
    const newTreasury = await addTreasury({
        id_system : safeData.data.id_system,
        typeSupply : {
            connect : { 
                id : safeData.data.id_type_supply 
            }
        },
        enabled_gmcore : safeData.data.enabled_gmcore as boolean,
        name : safeData.data.name,
        short_name : safeData.data.short_name,
        region : safeData.data.region,
        account_number : safeData.data.account_number,
        gmcore_number : safeData.data.gmcore_number,
    })
    if(!newTreasury){
        res.status(401).json({ error : 'Erro ao salvar!' })
        return
    }

    res.json({ treasury : newTreasury })
}


export const update : RequestHandler = async (req, res) => {
    const treasuryId = req.params.id
    console.log(treasuryId)
    const safeData = treasuryAddSchema.safeParse(req.body)
    if(!safeData.success){
        res.json({ error : safeData.error.flatten().fieldErrors })
        return 
    }
    const updateT = await updateTreasury(parseInt(treasuryId), safeData.data)
    if(!updateT){
        res.status(401).json({ error : 'Erro ao Editar!' })
        return
    }

    res.json({ treasury : updateT })

}

export const addSaldo : RequestHandler = async (req, res) => {
    const treasuryId = req.params.id
    const safeData = treasuryAddBalanceSchema.safeParse(req.body)
    if(!safeData.success){
        res.json({ error : safeData.error.flatten().fieldErrors })
        return 
    }
    const treasury = await getForIdSystem(treasuryId)
    if(!treasury){
        res.json({ error : 'Transportadora não localizada!'})
        return 
    }
    const data = {
        bills_10 : treasury?.bills_10 + safeData.data.bills_10,
        bills_20 : treasury?.bills_20 + safeData.data.bills_20,
        bills_50 : treasury?.bills_50 + safeData.data.bills_50,
        bills_100 : treasury?.bills_100 + safeData.data.bills_100,
    }
    console.log(data)
    const newBalance = await addBalanceInTreasuryByIdSystem(parseInt(treasuryId), data)
    if(!newBalance?.id){
        res.json({ error : 'Falha ao atualizar saldo!'})
        return 
    }
    res.json({ treasury : newBalance })
}