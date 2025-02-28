import { RequestHandler } from "express"
import { atmAddSchema } from "../schemas/atmAdd"
import { addAtm, getAllAtm, getForId, updateAtm } from "../services/atm"

export const getAll : RequestHandler = async (req, res) => {
   const atm = await getAllAtm()
   if(!atm) {
    res.status(401).json({ error : 'Erro ao carregar!' })
    return
   }
   res.json({ atm })

}

export const getById : RequestHandler = async (req, res) => {
    const atmsId = req.params.id
    const atm = await getForId(parseInt(atmsId))
    if(!atm){
        res.status(401).json({ error : 'Erro ao salvar!' })
        return
    }

    res.json({ atm  })
}

export const add : RequestHandler = async (req, res) => {
     const safeData = atmAddSchema.safeParse(req.body)
     if(!safeData.success){
        res.json({ error : safeData.error.flatten().fieldErrors })
        return 
    }
    const newTAtm = await addAtm({
        id_system : safeData.data.id_system,
        name : safeData.data.name,
        short_name : safeData.data.short_name,
        treasury :  {
            connect : { id : safeData.data.id_treasury}

        },
        number_store : safeData.data.number_store,
        cassete_A : safeData.data.cassete_A,
        cassete_B : safeData.data.cassete_B,
        cassete_C : safeData.data.cassete_C,
        cassete_D : safeData.data.cassete_D,
       
    })
    if(!newTAtm){
        res.status(401).json({ error : 'Erro ao salvar!' })
        return
    }

    res.json({ atm : newTAtm })
}


export const update : RequestHandler = async (req, res) => {
     const atmId = req.params.id
        const safeData = atmAddSchema.safeParse(req.body)
        if(!safeData.success){
            res.json({ error : safeData.error.flatten().fieldErrors })
            return 
        }
        const updateA = await updateAtm(parseInt(atmId), safeData.data)
        if(!updateA){
            res.status(401).json({ error : 'Erro ao Editar!' })
            return
        }
    
        res.json({ atm : updateA })
    
    }
    
    /*export const addSaldo : RequestHandler = async (req, res) => {
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
}*/