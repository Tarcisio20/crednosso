import { RequestHandler } from "express"
import { atmAddSchema } from "../schemas/atmAdd"
import { addAtm, getAllAtm } from "../services/atm"

export const getAll : RequestHandler = async (req, res) => {
   const atm = await getAllAtm()
   if(!atm) {
    res.status(401).json({ error : 'Erro ao carregar!' })
    return
   }
   res.json({ atm })

}

/*export const getByIdSystem : RequestHandler = async (req, res) => {
    const treasuryId = req.params.id
    const treasury = await getForIdSystem(treasuryId)
    if(!treasury){
        res.status(401).json({ error : 'Erro ao salvar!' })
        return
    }

    res.json({ treasury  })
}*/

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