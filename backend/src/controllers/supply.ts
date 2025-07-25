import { RequestHandler } from "express"
import { supplyAddSchema } from "../schemas/supplyAddSchema"
import { addSupply, getAllForDate, getAllForDateAndTreasury, getAllSupply, getAtmWitSupplyForIdAndDate, getSupplyForIdTreasury, lastRegister } from "../services/supply"
import { formatedDateToPTBRforEnglish } from "../utils/formatedDateToPTBRforEnglish"
import { returnDateFormatted } from "../utils/returnDateFormatted"
import { returnDateFormattedEnd } from "../utils/returnDateFormattedEnd"
import { AddIndividualSchema } from "../schemas/schemaAddIndividual"
import { date } from "zod"
import { connect } from "http2"

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
   const statusOrder = 1 //await getAllStatusOrder()
   if(!statusOrder) {
    res.status(401).json({ error : 'Erro ao carregar!' })
    return
   }
   res.json({ statusOrder })

}

export const getAtmsWithSupply: RequestHandler = async (req, res) => {
   const { id } = req.params
   const data = req.body

   if(!id){
    res.json({ error : 'Preciso de um ID para continuar!' })
    return
   }
   if(data.date === undefined) {
     res.json({ error : 'Preciso de uma data para continuar!' })
    return
   }

   const atm = await getAtmWitSupplyForIdAndDate(parseInt(id), data)

}

export const getForIDTreasury : RequestHandler = async (req, res) => {
  const idSupply = req.params.id
  console.log("ID", idSupply)
  if(!idSupply) {
   res.status(401).json({ error : 'Erro ao carregar!' })
   return
  }
  console.log("ID depois do if", idSupply)
  const supply = await getSupplyForIdTreasury( Number(idSupply))
  res.json({ supply })

}

export const forDate : RequestHandler = async (req, res) => {
  const data = req.body  
  const supply =  await getAllForDate(returnDateFormatted(formatedDateToPTBRforEnglish(data.date)), returnDateFormattedEnd(formatedDateToPTBRforEnglish(data.date)))
  if(!supply) {
   res.status(401).json({ error : 'Erro ao carregar!' })
   return
  }
  res.json({ supply })
}

export const add: RequestHandler = async (req, res) => {
  const safeData = supplyAddSchema.safeParse(req.body)

  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors })
    return
  }

  let data = {
    atm: {
      connect: { id_system: safeData.data.id_atm }, // Conecta ao registro Atm com base em id_system
    },
    cassete_A : safeData.data.cass_A ?? 0 ,
    cassete_B : safeData.data.cass_B ?? 0 ,
    cassete_C : safeData.data.cass_C ?? 0 ,
    cassete_D : safeData.data.cass_D ?? 0 ,
    total_exchange :  safeData.data.type === 'TROCA TOTAL' || safeData.data.type === 'RECOLHIMENTO TOTAL'  ? true : false,
    treasury  : {
      connect : { id_system : safeData.data.id_treasury }
    },
    date_on_supply : returnDateFormatted('10/05/2025'),
    order : {
      connect : { id : 1 }
    }
   }
  
  const newSupply1 = await addSupply(data)
   const newSupply = data

  if (!newSupply) {
    res.status(401).json({ error: 'Erro ao salvar!' })
    return
  }

  res.json({ supply: newSupply })
}

export const addAll: RequestHandler = async (req, res) => {
  const safeData =  req.body
  if (!safeData) {
    res.status(300).json({ error: 'Erro no envio dos dados!' })
    return
  }
  console.log("DATAA", safeData)
  let data : any = []
  safeData.map((item : any)=>{
    data.push({
      atm: {
        connect: { id_system: item.id_atm }, // Conecta ao registro Atm com base em id_system
      },
      cassete_A : item.cass_A ?? 0 ,
      cassete_B : item.cass_B ?? 0 ,
      cassete_C : item.cass_C ?? 0 ,
      cassete_D : item.cass_D ?? 0 ,
      total_exchange : item.type === 'TROCA TOTAL' ? true : false,
      treasury  : {
        connect : { id_treasury : item.id_treasury }
      },
      date : returnDateFormatted(item.date_order),
      date_on_supply : new Date(),
      order : {
        connect : { id_order : item.id }
      }
    })
})
  for(const item of data){
    const save = await addSupply(item)
    console.log("save", save)
  }
  
  const newSupply = await lastRegister()
  console.log(newSupply)
  if (!newSupply) {
    res.status(401).json({ error: 'Erro ao salvar!' })
    return
  }

  res.json({ supply: newSupply })
}

export const getForDayAndTreasury: RequestHandler = async (req, res) => {
  const data =  req.body
  const {id} = req.params
  if (!data.date || !id) {
    res.status(300).json({ error: 'Erro no envio dos dados!' })
    return
  }

  const supply =  await getAllForDateAndTreasury(
    returnDateFormatted(formatedDateToPTBRforEnglish(data.date)), 
    returnDateFormattedEnd(formatedDateToPTBRforEnglish(data.date)), 
    parseInt(id)
  )

  if (!supply) {
    res.status(401).json({ error: 'Erro ao salvar!' })
    return
  }

  res.json({ supply })
}

export const addIndivudual : RequestHandler = async (req, res) => {
  const data =  AddIndividualSchema.safeParse(req.body)
  if (!data.success) {
    res.status(300).json({ error: 'Erro no envio dos dados!' })
    return
  }
const supply = 1

  if (!supply) {
    res.status(401).json({ error: 'Erro ao salvar!' })
    return
  }

  res.json({ supply })
}