import { RequestHandler } from "express"
import { cardOperatorAddSchema } from "../schemas/cardOperatorAddSchema"
import { addCardOperator } from "../services/cardOperator"

export const add : RequestHandler = async (req, res) => {
     const safeData = cardOperatorAddSchema.safeParse(req.body)
     if(!safeData.success){
        res.json({ error : safeData.error.flatten().fieldErrors })
        return 
    }
    const newCardOperator = await addCardOperator({
        treasury : {
            connect : { id : safeData.data.id_treasury }
        },
        name : safeData.data.name,
        number_card : safeData.data.number_card,
    })
    if(!newCardOperator){
        res.status(401).json({ error : 'Erro ao salvar!' })
        return
    }

    res.json({ operatorCard : newCardOperator })
}