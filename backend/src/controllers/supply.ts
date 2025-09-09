import { RequestHandler } from "express"
import { supplyAddSchema } from "../schemas/supplyAddSchema"
import { addSupply, getAllForDate, getAllForDateAndTreasury, getAllForDatePagination, getAllSupply, getAtmWitSupplyForIdAndDate, getSupplyByOrder, getSupplyForIdTreasury, lastRegister } from "../services/supply"
import { formatedDateToPTBRforEnglish } from "../utils/formatedDateToPTBRforEnglish"
import { returnDateFormatted } from "../utils/returnDateFormatted"
import { returnDateFormattedEnd } from "../utils/returnDateFormattedEnd"
import { AddIndividualSchema } from "../schemas/schemaAddIndividual"
import { date, z } from "zod"
import { connect } from "http2"
import { Prisma } from "@prisma/client"

export const getAll: RequestHandler = async (req, res) => {
  const supply = await getAllSupply()
  if (!supply) {
    res.status(401).json({ error: 'Erro ao carregar!' })
    return
  }
  res.json({ supply })

}

export const getForNumOrder: RequestHandler = async (req, res) => {
  const data = req.body
  if (!Array.isArray(data) || data.length === 0) {
    res.status(400).json({ error: 'Erro ao carregar!' })
    return
  }
  const supplies: any = []
  for (const numOrder of data) {
    const registros = await getSupplyByOrder(numOrder); // função que consulta o banco
    if (registros.length > 0) {
      supplies.push(...registros); // adiciona todos no array
    }
  }
  res.json({ supply: supplies })

}

export const getAllDay: RequestHandler = async (req, res) => {
  const day = req.params.day
  const statusOrder = 1 //await getAllStatusOrder()
  if (!statusOrder) {
    res.status(401).json({ error: 'Erro ao carregar!' })
    return
  }
  res.json({ statusOrder })

}

export const getAtmsWithSupply: RequestHandler = async (req, res) => {
  const { id } = req.params
  const data = req.body

  if (!id) {
    res.json({ error: 'Preciso de um ID para continuar!' })
    return
  }
  if (data.date === undefined) {
    res.json({ error: 'Preciso de uma data para continuar!' })
    return
  }

  const atm = await getAtmWitSupplyForIdAndDate(parseInt(id), data)

}

export const getForIDTreasury: RequestHandler = async (req, res) => {
  const idSupply = req.params.id
  console.log("ID", idSupply)
  if (!idSupply) {
    res.status(401).json({ error: 'Erro ao carregar!' })
    return
  }
  console.log("ID depois do if", idSupply)
  const supply = await getSupplyForIdTreasury(Number(idSupply))
  res.json({ supply })

}

export const forDate: RequestHandler = async (req, res) => {
  const data = req.body
  const supply = await getAllForDate(returnDateFormatted(formatedDateToPTBRforEnglish(data.date)), returnDateFormattedEnd(formatedDateToPTBRforEnglish(data.date)))
  if (!supply) {
    res.status(401).json({ error: 'Erro ao carregar!' })
    return
  }
  res.json({ supply })
}

export const forDatePagination: RequestHandler = async (req, res) => {
  const data = req.body
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 15;
  const skip = (page - 1) * pageSize;


  const supply = await getAllForDatePagination(
    returnDateFormatted(formatedDateToPTBRforEnglish(data.date)), 
    returnDateFormattedEnd(formatedDateToPTBRforEnglish(data.date)),
    page, 
    pageSize
  )
  
  
  if (!supply) {
    res.status(401).json({ error: 'Erro ao carregar!' })
    return
  }
  res.json({ supply })
}

export const add: RequestHandler = async (req, res) => {
  const safeData = supplyAddSchema.safeParse(req.body)
  console.log("Dados recebidos", safeData)
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors })
    return
  }

  let data = {
    // atm: {
    //   connect: { id_system: safeData.data.id_atm }, // Conecta ao registro Atm com base em id_system
    // },
    // cassete_A: safeData.data.cassete_A ?? 0,
    // cassete_B: safeData.data.cassete_B ?? 0,
    // cassete_C: safeData.data.cassete_C ?? 0,
    // cassete_D: safeData.data.cassete_D ?? 0,
    // total_exchange: safeData.data.total_exchange === 'TROCA TOTAL' || safeData.data.total_exchange === 'RECOLHIMENTO TOTAL' ? true : false,
    // treasury: {
    //   connect: { id_system: safeData.data.id_treasury }
    // },
    // date_on_supply: returnDateFormatted('10/05/2025'),
    // order: {
    //   connect: { id: 1 }
    // }
  }

  ///  const newSupply1 = await addSupply(data)
  const newSupply = data

  if (!newSupply) {
    res.status(401).json({ error: 'Erro ao salvar!' })
    return
  }

  res.json({ supply: newSupply })
}


type SupplyAdd = z.infer<typeof supplyAddSchema>;
export const addAll: RequestHandler = async (req, res) => {
  const safeData: SupplyAdd[] = req.body;
  if (!safeData || safeData.length === 0) {
    res.status(400).json({ error: "Erro no envio dos dados!" });
    return;
  }

  const results = {
    sucesso: [] as any[],
    erros: [] as { index: number; erro: any }[]
  };

  for (const [index, item] of safeData.entries()) {
    try {
      // Monta o objeto para o Prisma
      const data: Prisma.SupplyCreateInput = {
        atm: { connect: { id_system: item.id_atm } },
        cassete_A: item.cassete_A ?? 0,
        cassete_B: item.cassete_B ?? 0,
        cassete_C: item.cassete_C ?? 0,
        cassete_D: item.cassete_D ?? 0,
        total_exchange: item.total_exchange ?? false,
        treasury: { connect: { id_system: item.id_treasury! } },
        date_on_supply: returnDateFormatted(item.date_on_supply as string),
        date: item.date,
        order: { connect: { id: item.id_order! } }
      };
      const save = await addSupply(data);
      results.sucesso.push(save);

    } catch (error) {
      results.erros.push({ index, erro: error });
    }
  }

  res.json(results);
};

export const getForDayAndTreasury: RequestHandler = async (req, res) => {
  const data = req.body
  const { id } = req.params
  if (!data.date || !id) {
    res.status(300).json({ error: 'Erro no envio dos dados!' })
    return
  }

  const supply = await getAllForDateAndTreasury(
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

export const addIndivudual: RequestHandler = async (req, res) => {
  const safeData: SupplyAdd = req.body;

  if (!safeData) {
    res.status(300).json({ error: 'Erro no envio dos dados!' })
    return
  }
  const dataItem: Prisma.SupplyCreateInput = {
    atm: { connect: { id_system: safeData.id_atm } },
    cassete_A: safeData.cassete_A ?? 0,
    cassete_B: safeData.cassete_B ?? 0,
    cassete_C: safeData.cassete_C ?? 0,
    cassete_D: safeData.cassete_D ?? 0,
    total_exchange: safeData.total_exchange ?? false,
    treasury: { connect: { id_system:safeData.id_treasury! } },
    date_on_supply: returnDateFormatted(safeData.date_on_supply as string),
    date: safeData.date,
    order: { connect: { id: safeData.id_order! } }
  };
  console.log("Dados para salvar", dataItem)
   const supply = await addSupply(dataItem)
  if (!supply) {
    res.status(401).json({ error: 'Erro ao salvar!' })
    return
  }

  res.json({ supply })
}