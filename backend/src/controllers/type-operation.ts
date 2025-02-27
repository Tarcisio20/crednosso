import { RequestHandler } from "express"
import { typeOperationdAddSchema } from "../schemas/typeOperationAddSchema"
import { addTypeOperation, getAllTypeOperation, getTypeOperationForId, updateTypeOperation } from "../services/typeOperation"


export const getAll : RequestHandler = async (req, res) => {
   const typeOperation = await getAllTypeOperation()
   if(!typeOperation) {
    res.status(401).json({ error : 'Erro ao carregar!' })
    return
   }
   res.json({ typeOperation })

}

export const getById : RequestHandler = async (req, res) => {
    const typeOperationId = req.params.id
    const typeOperation = await getTypeOperationForId(typeOperationId)
    if(!typeOperation){
        res.status(401).json({ error : 'Erro ao salvar!' })
        return
    }

    res.json({ typeOperation  })
}

export const add :RequestHandler = async (req, res) => {
    console.log("Cheguei aqui server")
     const safeData = typeOperationdAddSchema.safeParse(req.body)
         if(!safeData.success){
            res.json({ error : safeData.error.flatten().fieldErrors })
            return 
        }
        const newTOperation = await addTypeOperation({
            id_system : safeData.data.id_system,
            name : safeData.data.name
        })
        if(!newTOperation){
            res.status(401).json({ error : 'Erro ao salvar!' })
            return
        }
    
        res.json({ typeOperation : newTOperation })
}

export const update : RequestHandler = async (req, res) => {
    const typeOperationId = req.params.id
    const safeData = typeOperationdAddSchema.safeParse(req.body)
    if(!safeData.success){
        res.json({ error : safeData.error.flatten().fieldErrors })
        return 
    }
    const updateType = await updateTypeOperation(parseInt(typeOperationId), safeData.data)
    if(!updateType){
        res.status(401).json({ error : 'Erro ao Editar!' })
        return
    }

    res.json({ typeOperation : updateType })

}
