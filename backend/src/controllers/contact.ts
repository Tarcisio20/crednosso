import { RequestHandler } from "express"
import { contactAddSchema } from "../schemas/contactAddSchema"
import { addContact, getForIdTreasury } from "../services/contact"

export const add : RequestHandler = async (req, res) => {
     const safeData = contactAddSchema.safeParse(req.body)
     if(!safeData.success){
        res.json({ error : safeData.error.flatten().fieldErrors })
        return 
    }
    const newContact = await addContact({
        treasury : {
            connect : { id : safeData.data.id_treasury }
        },
        name : safeData.data.name,
        email : safeData.data.email,
        phone : safeData.data.phone,
    })
    if(!newContact){
        res.status(401).json({ error : 'Erro ao salvar!' })
        return
    }

    res.json({ contact : newContact })
}

export const getByIdTreasury : RequestHandler = async (req, res) => {
    const treasuryId = req.params.id
    const contact = await getForIdTreasury(parseInt(treasuryId))
    if(!contact){
        res.status(401).json({ error : 'Erro ao salvar!' })
        return
    }

    res.json({ contact  })
}
