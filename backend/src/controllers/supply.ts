import { RequestHandler } from "express"
import { supplyAddSchema } from "../schemas/supplyAddSchema"
import { addSupply, getAllForDate, getAllSupply } from "../services/supply"
import { formatedDateToPTBRforEnglish } from "../utils/formatedDateToPTBRforEnglish"
import { returnDateFormatted } from "../utils/returnDateFormatted"
import { returnDateFormattedEnd } from "../utils/returnDateFormattedEnd"

export const getAll : RequestHandler = async (req, res) => {
  const supply = await getAllSupply()
  if(!supply) {
   res.status(401).json({ error : 'Erro ao carregar!' })
   return
  }
  res.json({ supply })

}

export const getAllDay : RequestHandler = async (req, res) => {
   const day = req.params.day
   console.log("Estou chegando no lugar errad")
   const statusOrder = 1 //await getAllStatusOrder()
   if(!statusOrder) {
    res.status(401).json({ error : 'Erro ao carregar!' })
    return
   }
   res.json({ statusOrder })

}

export const forDate : RequestHandler = async (req, res) => {
  const data = req.body
  console.log(returnDateFormatted(formatedDateToPTBRforEnglish(data.date)))
  const supply =  await getAllForDate(returnDateFormatted(formatedDateToPTBRforEnglish(data.date)), returnDateFormattedEnd(formatedDateToPTBRforEnglish(data.date)))
  if(!supply) {
   res.status(401).json({ error : 'Erro ao carregar!' })
   return
  }
  res.json({ supply })

}
export const add: RequestHandler = async (req, res) => {
  const safeData = supplyAddSchema.safeParse(req.body)
  console.log("Body", req.body)
  console.log("ADD Supply7", safeData)

  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors })
    return
  }

  let data = {
    atm: {
      connect: { id_system: safeData.data.id_atm }, // Conecta ao registro Atm com base em id_system
    },
    cassete_A : safeData.data.cassete_A ?? 0 ,
    cassete_B : safeData.data.cassete_B ?? 0 ,
    cassete_C : safeData.data.cassete_C ?? 0 ,
    cassete_D : safeData.data.cassete_D ?? 0 ,
    total_exchange : safeData.data.total_exchange,
   }

  console.log("Data no Supply", data)
  
  const newSupply1 = await addSupply(data)
   const newSupply = data

  if (!newSupply) {
    res.status(401).json({ error: 'Erro ao salvar!' })
    return
  }

  res.json({ supply: newSupply })
}
