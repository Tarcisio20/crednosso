import { RequestHandler } from "express"

export const getAllDay : RequestHandler = async (req, res) => {
   const day = req.params.day
   console.log(day)
   const statusOrder = 1 //await getAllStatusOrder()
   if(!statusOrder) {
    res.status(401).json({ error : 'Erro ao carregar!' })
    return
   }
   res.json({ statusOrder })

}
