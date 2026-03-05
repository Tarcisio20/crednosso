import { RequestHandler } from "express"
import { supplyAddSchema } from "../schemas/supplyAddSchema"
import { addSupply, delSupply, editSupply, getAllForDate, getAllForDateAndTreasury, getAllForDatePagination, getAllSupply, getAtmWitSupplyForIdAndDate, getSupplyByDate, getSupplyByOrder, getSupplyForIdTreasury, lastRegister } from "../services/supply"
import { getForIdTreasury as getContactsForTreasury } from "../services/contact";
import { getForIdTreasury as getOperatorCardForTreasury, normalizeOperatorCard } from "../services/cardOperator";
import { formatedDateToPTBRforEnglish } from "../utils/formatedDateToPTBRforEnglish"
import { returnDateFormatted } from "../utils/returnDateFormatted"
import { returnDateFormattedEnd } from "../utils/returnDateFormattedEnd"
import { Prisma } from "@prisma/client"
import { createLog } from "services/logService"
import { z } from "zod"
import { normalizeEmails } from "./email"
import { runOpenOsPython } from "../utils/runOpenOsPython";
import { addOs, delOS } from "services/os-open";
import { sendEmailOnOS } from "services/email";
import type { SendEmailPayload } from "services/email";

import { v4 as uuid } from "uuid";
import { getIO } from "utils/socket-event";

export const getAll: RequestHandler = async (req, res) => {
  try {
    const supply = await getAllSupply()
    if (!supply) {
      await createLog({
        level: "ERROR",
        action: "GET_ALL_SUPPLY",
        message: "Erro ao carregar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "supply",
      })
      res.status(400).json({ error: 'Erro ao carregar!' })
      return
    }
    await createLog({
      level: "INFO",
      action: "GET_ALL_SUPPLY",
      message: "Sucesso ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "supply",
      meta: { payload: supply }
    })
    res.status(200).json({ supply })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_ALL_SUPPLY",
      message: "Erro ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "supply",
    })
    res.status(400).json({ error: 'Erro ao carregar!' })
    return
  }
}

export const getForNumOrder: RequestHandler = async (req, res) => {
  const data = req.body
  if (!Array.isArray(data) || data.length === 0) {
    await createLog({
      level: 'ERROR',
      action: 'GET_FOR_NUM_ORDER',
      message: 'Erro ao carregar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'supply',
    })
    res.status(400).json({ error: 'Erro ao carregar!' })
    return
  }
  try {
    const supplies: any = []
    for (const numOrder of data) {
      const registros: any = await getSupplyByOrder(numOrder); // função que consulta o banco
      if (registros.length > 0) {
        supplies.push(...registros); // adiciona todos no array
      }
    }
    await createLog({
      level: 'INFO',
      action: 'GET_FOR_NUM_ORDER',
      message: 'Sucesso ao carregar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: 'supply',
      meta: { supplies }
    })
    res.status(200).json({ supply: supplies })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'GET_FOR_NUM_ORDER',
      message: 'Erro ao carregar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'supply',
      meta: { error }
    })
    res.status(400).json({ error: 'Erro ao carregar!' })
    return
  }
}

export const getAllDay: RequestHandler = async (req, res) => {
  const day = req.params.day
  console.log("day", day)
  if (!day) {
    await createLog({
      level: "ERROR",
      action: "GET_ALL_DAY",
      message: "Erro ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "supply",
    })
    res.status(400).json({ error: 'Erro ao carregar!' })
    return
  }
  try {
    const statusOrder = 1 //await getAllStatusOrder()
    if (!statusOrder) {
      await createLog({
        level: "ERROR",
        action: "GET_ALL_DAY",
        message: "Erro ao carregar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "supply",
        meta: { statusOrder },
      })
      res.status(400).json({ error: 'Erro ao carregar!' })
      return
    }
    res.status(200).json({ statusOrder })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_ALL_DAY",
      message: "Erro ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "supply",
      meta: { error },
    })
    res.status(400).json({ error: 'Erro ao carregar!' })
    return
  }
}

export const getAtmsWithSupply: RequestHandler = async (req, res) => {
  const { id } = req.params
  if (!id || isNaN(parseInt(id))) {
    await createLog({
      level: "ERROR",
      action: "GET_ATMS_WITH_SUPPLY",
      message: "Requisição sem ID!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "supply",
    })
    res.status(400).json({ error: 'Requisição sem ID!' })
    return
  }
  const data = req.body
  if (data.date === undefined) {
    await createLog({
      level: "ERROR",
      action: "GET_ATMS_WITH_SUPPLY",
      message: "Preciso de uma data para continuar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "supply",
      resourceId: String(id),
    })
    res.status(400).json({ error: 'Preciso de uma data para continuar!' })
    return
  }
  try {
    const atm = await getAtmWitSupplyForIdAndDate(parseInt(id), data)
    if (!atm) {
      await createLog({
        level: "ERROR",
        action: "GET_ATMS_WITH_SUPPLY",
        message: "Erro ao carregar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "supply",
        resourceId: String(id),
      })
      res.status(400).json({ error: 'Erro ao carregar!' })
      return
    }
    await createLog({
      level: "INFO",
      action: "GET_ATMS_WITH_SUPPLY",
      message: "Sucesso ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "supply",
      meta: { atm }
    })
    res.status(200).json({ atm })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_ATMS_WITH_SUPPLY",
      message: "Erro ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "supply",
      meta: { error },
    })
    res.status(400).json({ error: 'Erro ao carregar!' })
    return
  }
}

export const getForIDTreasury: RequestHandler = async (req, res) => {
  const idSupply = req.params.id
  if (!idSupply || isNaN(parseInt(idSupply))) {
    await createLog({
      level: "ERROR",
      action: "GET_SUPPLY_FOR_ID_TREASURY",
      message: "Requisição sem ID!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "supply",
    })
    res.status(400).json({ error: 'Erro ao carregar!' })
    return
  }
  try {
    const supply = await getSupplyForIdTreasury(Number(idSupply))
    if (!supply) {
      await createLog({
        level: "ERROR",
        action: "GET_SUPPLY_FOR_ID_TREASURY",
        message: "Erro ao carregar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "supply",
        resourceId: String(idSupply),
      })
      res.status(400).json({ error: 'Erro ao carregar!' })
      return
    }
    await createLog({
      level: "INFO",
      action: "GET_SUPPLY_FOR_ID_TREASURY",
      message: "Sucesso ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "supply",
      resourceId: String(idSupply),
      meta: { supply }
    })
    res.status(200).json({ supply })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_SUPPLY_FOR_ID_TREASURY",
      message: "Erro ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "supply",
      meta: { error },
    })
    res.status(400).json({ error: 'Erro ao carregar!' })
    return
  }
}

export const forDate: RequestHandler = async (req, res) => {
  const data = req.body
  if (!data) {
    await createLog({
      level: "ERROR",
      action: "GET_SUPPLY_FOR_ID_TREASURY",
      message: "Requisição sem ID!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "supply",
    })
    res.status(400).json({ error: 'Erro ao carregar!' })
    return
  }


  try {
    const supply = await getAllForDate(data.date)
    if (!supply) {
      await createLog({
        level: "ERROR",
        action: "GET_SUPPLY_FOR_ID_TREASURY",
        message: "Erro ao carregar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "supply",
      })
      res.status(400).json({ error: 'Erro ao carregar!' })
      return
    }
    await createLog({
      level: "INFO",
      action: "GET_SUPPLY_FOR_ID_TREASURY",
      message: "Sucesso ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "supply",
      meta: { supply },
    })
    res.status(200).json({ supply })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_SUPPLY_FOR_ID_TREASURY",
      message: "Erro ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "supply",
      meta: { error },
    })
    res.status(400).json({ error: 'Erro ao carregar!' })
    return
  }
}

export const forDatePagination: RequestHandler = async (req, res) => {
  const data = req.body
  if (!data) {
    await createLog({
      level: "ERROR",
      action: "GET_SUPPLY_FOR_ID_TREASURY",
      message: "Requisição sem ID!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "supply",
    })
    res.status(400).json({ error: 'Erro ao carregar!' })
    return
  }
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 15;
  const skip = (page - 1) * pageSize;
  try {
    const supply = await getAllForDatePagination(
      returnDateFormatted(formatedDateToPTBRforEnglish(data.date)),
      returnDateFormattedEnd(formatedDateToPTBRforEnglish(data.date)),
      page,
      pageSize
    )
    if (!supply) {
      await createLog({
        level: "ERROR",
        action: "GET_SUPPLY_FOR_ID_TREASURY",
        message: "Erro ao carregar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "supply",
        meta: { date: data.date },
      })
      res.status(400).json({ error: 'Erro ao carregar!' })
      return
    }
    await createLog({
      level: "INFO",
      action: "GET_SUPPLY_FOR_ID_TREASURY",
      message: "Sucesso ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "supply",
      meta: { supply },
    })
    res.status(200).json({ supply })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_SUPPLY_FOR_ID_TREASURY",
      message: "Erro ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "supply",
      meta: { error },
    })
    res.status(400).json({ error: 'Erro ao carregar!' })
    return
  }
}

export const add: RequestHandler = async (req, res) => {
  const safeData = supplyAddSchema.safeParse(req.body)
  if (!safeData.success) {
    await createLog({
      level: "ERROR",
      action: "ADD_SUPPLY",
      message: "Erro ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "supply",
      meta: { error: safeData.error.flatten().fieldErrors },
    })
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
  try {
    const newSupply = data

    if (!newSupply) {
      await createLog({
        level: "ERROR",
        action: "ADD_SUPPLY",
        message: "Erro ao salvar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "supply",
      })
      res.status(400).json({ error: 'Erro ao salvar!' })
      return
    }
    await createLog({
      level: "INFO",
      action: "ADD_SUPPLY",
      message: "Sucesso ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "supply",
      meta: { newSupply },
    })
    res.status(200).json({ supply: newSupply })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "ADD_SUPPLY",
      message: "Erro ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "supply",
      meta: { error },
    })
    res.status(400).json({ error: 'Erro ao salvar!' })
    return
  }
}


type SupplyAdd = z.infer<typeof supplyAddSchema>;
export const addAll: RequestHandler = async (req, res) => {
  const safeData: SupplyAdd[] = req.body;
  if (!safeData || safeData.length === 0) {
    await createLog({
      level: "ERROR",
      action: "ADD_ALL_SUPPLY",
      message: "Erro no envio dos dados!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "supply",
    })
    res.status(400).json({ error: "Erro no envio dos dados!" });
    return;
  }
  try {
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
        await createLog({
          level: "ERROR",
          action: "ADD_ALL_SUPPLY",
          message: "Erro ao salvar!",
          userSlug: req.userSlug ?? null,
          route: req.route?.path ?? null,
          method: req.method ?? null,
          statusCode: 400,
          resource: "supply",
          meta: { error },
        })
        results.erros.push({ index, erro: error });
      }
    }
    await createLog({
      level: "INFO",
      action: "ADD_ALL_SUPPLY",
      message: "Sucesso ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "supply",
      meta: { results },
    })
    res.status(200).json(results);
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "ADD_ALL_SUPPLY",
      message: "Erro ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "supply",
      meta: { error },
    })
    res.status(400).json({ error });
    return
  }
};

export const getForDayAndTreasury: RequestHandler = async (req, res) => {
  const { id } = req.params
  if (!id || isNaN(parseInt(id))) {
    await createLog({
      level: "ERROR",
      action: "GET_SUPPLY_FOR_DAY_AND_TREASURY",
      message: "Requisição sem ID! ",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "supply",
    })
    res.status(400).json({ error: "Requisição sem ID!" });
    return
  }
  const data = req.body
  if (!data.date) {
    await createLog({
      level: "ERROR",
      action: "GET_SUPPLY_FOR_DAY_AND_TREASURY",
      message: "Erro no envio dos dados!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "supply",
    })
    res.status(400).json({ error: 'Erro no envio dos dados!' })
    return
  }
  try {
    const supply = await getAllForDateAndTreasury(
      returnDateFormatted(formatedDateToPTBRforEnglish(data.date)),
      returnDateFormattedEnd(formatedDateToPTBRforEnglish(data.date)),
      parseInt(id)
    )

    if (!supply) {
      await createLog({
        level: "ERROR",
        action: "GET_SUPPLY_FOR_DAY_AND_TREASURY",
        message: "Erro ao salvar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "supply",
      })
      res.status(400).json({ error: 'Erro ao salvar!' })
      return
    }
    await createLog({
      level: "INFO",
      action: "GET_SUPPLY_FOR_DAY_AND_TREASURY",
      message: "Sucesso ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "supply",
      meta: { payload: supply },
    })
    res.status(200).json({ supply })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_SUPPLY_FOR_DAY_AND_TREASURY",
      message: "Erro ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "supply",
      meta: { error },
    })
    res.status(400).json({ error })
    return
  }
}

export const addIndivudual: RequestHandler = async (req, res) => {
  const safeData: SupplyAdd = req.body;
  if (!safeData) {
    await createLog({
      level: "ERROR",
      action: "ADD_SUPPLY",
      message: "Erro no envio dos dados!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "supply",
    })
    res.status(400).json({ error: 'Erro no envio dos dados!' })
    return
  }
  try {
    const dataItem: Prisma.SupplyCreateInput = {
      atm: { connect: { id_system: safeData.id_atm } },
      cassete_A: safeData.cassete_A ?? 0,
      cassete_B: safeData.cassete_B ?? 0,
      cassete_C: safeData.cassete_C ?? 0,
      cassete_D: safeData.cassete_D ?? 0,
      total_exchange: safeData.total_exchange ?? false,
      treasury: { connect: { id_system: safeData.id_treasury! } },
      date_on_supply: returnDateFormatted(safeData.date_on_supply as string),
      date: safeData.date,
      order: { connect: { id: safeData.id_order! } }
    };
    const supply = await addSupply(dataItem)
    if (!supply) {
      await createLog({
        level: "ERROR",
        action: "ADD_SUPPLY",
        message: "Erro ao salvar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "supply",
      })
      res.status(400).json({ error: 'Erro ao salvar!' })
      return
    }
    await createLog({
      level: "INFO",
      action: "ADD_SUPPLY",
      message: "Sucesso ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "supply",
      meta: { payload: supply },
    })
    res.status(200).json({ supply })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "ADD_SUPPLY",
      message: "Erro ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "supply",
      meta: { error },
    })
    res.status(400).json({ error })
    return
  }
}

type SupplyEdit = {
  cassete_A?: number;
  cassete_B?: number;
  cassete_C?: number;
  cassete_D?: number;
  total_exchange?: boolean;
}
export const editIndivudual: RequestHandler = async (req, res) => {
  const { id } = req.params
  if (!id) {
    res.status(400).json({ error: 'Preciso de um ID para continuar!' })
    return
  }
  const safeData: SupplyEdit = req.body;
  if (!safeData) {
    res.status(400).json({ error: 'Sem dados para editar!' })
    return
  }

  try {
    const supply = await editSupply(Number(id), safeData)
    res.status(200).json({ supply })
    return
  } catch (error) { }

}

export const delIndivudual: RequestHandler = async (req, res) => {
  const { id } = req.params
  if (!id) {
    res.status(400).json({ error: 'Preciso de um ID para continuar!' })
    return
  }
  try {

    await delOS(Number(id))
    
    const supply = await delSupply(Number(id))
    res.status(200).json({ supply })
    return
  } catch (error) { }

}

export const getAllSupliesByDate: RequestHandler = async (req, res) => {
  const date = req.body.date
  if (!date) {
    await createLog({
      level: "ERROR",
      action: "GET_SUPPLY_FOR_DATE",
      message: "Requisição sem DATE!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "supply",
    })
    res.status(400).json({ error: 'Erro ao receber data!' })
    return
  }
  try {
    const supply = await getSupplyByDate(date)

    await createLog({
      level: "INFO",
      action: "GET_SUPPLY_FOR_DAY_AND_TREASURY",
      message: "Sucesso ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "supply",
      meta: { payload: supply },
    })
    res.status(200).json({ supply })
    return

  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_SUPPLY_FOR_DATE",
      message: "Erro ao receber dados do banco!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "supply",
    })
    res.status(400).json({ error: 'Erro ao carregar!' })
    return
  }
}

export type openOSProps = {
  id_supply: number;
  id_atm: number;
  id_treasury: number;
  treasury_name: string;
  atm_name: string;
  total_exchange: boolean;
  date_on_supply: string;
  cassete_A: number;
  cassete_B: number;
  cassete_C: number;
  cassete_D: number;
};

type OsGerada = {
  terminal: string;
  os: string;
  situacao: string;
  valor: string;
};

type openOSResponseItem = openOSProps & {
  emails: string[];
  operator_card: string | null;
};

type OsFrontItem = {
  id_supply: number;
  id_treasury: number;
  treasury_name: string;
  date_on_supply: string;
  id_atm: number;
  atm_name: string;
  total_exchange: boolean;
  cassete_A: number;
  cassete_B: number;
  cassete_C: number;
  cassete_D: number;
  os: string | null;
  situacao: string | null;
  valor: string | null;
  status: boolean;
};

export const openOS: RequestHandler = async (req, res) => {
  const body = req.body as { socketId?: string; data?: openOSProps[] };

  const socketId = body?.socketId;
  const data = body?.data;

  if (!Array.isArray(data) || data.length === 0) {
    res.status(400).json({ ok: false, error: "Erro ao receber data!" });
    return;
  }

  const jobId = uuid();

  res.status(202).json({ ok: true, jobId });

  setImmediate(async () => {
    const io = getIO();

    const emit = (event: string, payload: any) => {
      if (socketId) io.to(socketId).emit(event, payload);
    };

    try {
      emit("openos:started", { jobId, total: data.length });

      const emailCache = new Map<number, string[]>();
      const operatorCache = new Map<number, string | null>();

      emit("openos:progress", { jobId, step: "extras", message: "Carregando contatos e cartão operador..." });

      const supplyWithExtras: openOSResponseItem[] = await Promise.all(
        data.map(async (item) => {
          const tid = Number(item.id_treasury);

          if (!tid) return { ...item, emails: [], operator_card: null };

          if (!emailCache.has(tid) || !operatorCache.has(tid)) {
            try {
              const [contacts, ops] = await Promise.all([
                getContactsForTreasury(tid),
                getOperatorCardForTreasury(tid),
              ]);

              if (!emailCache.has(tid)) emailCache.set(tid, normalizeEmails(contacts));
              if (!operatorCache.has(tid)) operatorCache.set(tid, normalizeOperatorCard(ops));
            } catch {
              if (!emailCache.has(tid)) emailCache.set(tid, []);
              if (!operatorCache.has(tid)) operatorCache.set(tid, null);
            }
          }

          return {
            ...item,
            emails: emailCache.get(tid) ?? [],
            operator_card: operatorCache.get(tid) ?? null,
          };
        })
      );

      if (supplyWithExtras.length === 0) {
        emit("openos:done", { jobId, ok: true, os: [] });
        return;
      }

      const pyPayload = supplyWithExtras.map((s) => ({
        terminal: Number(s.id_atm),
        troca_total: (s.total_exchange ? "S" : "N") as "S" | "N",
        data_atendimento: String(s.date_on_supply),
        cassete_A: Number(s.cassete_A ?? 0),
        cassete_B: Number(s.cassete_B ?? 0),
        cassete_C: Number(s.cassete_C ?? 0),
        cassete_D: Number(s.cassete_D ?? 0),
      }));

      emit("openos:progress", { jobId, step: "python", message: "Gerando OS via automação..." });

      const osGeradas = (await runOpenOsPython(pyPayload)) as OsGerada[];

      const osMap = new Map<number, OsGerada>();
      for (const item of osGeradas ?? []) {
        const term = Number(item?.terminal);
        if (Number.isFinite(term) && term > 0) osMap.set(term, item);
      }

      const os: OsFrontItem[] = supplyWithExtras.map((s) => {
        const term = Number(s.id_atm);
        const info = osMap.get(term);
        const ok = Boolean(info?.os);

        return {
          id_supply: Number(s.id_supply),
          id_treasury: Number(s.id_treasury),
          treasury_name: String(s.treasury_name ?? ""),
          date_on_supply: String(s.date_on_supply ?? ""),
          id_atm: Number(s.id_atm),
          atm_name: String(s.atm_name ?? ""),
          total_exchange: Boolean(s.total_exchange),
          cassete_A: Number(s.cassete_A ?? 0),
          cassete_B: Number(s.cassete_B ?? 0),
          cassete_C: Number(s.cassete_C ?? 0),
          cassete_D: Number(s.cassete_D ?? 0),
          os: ok ? String(info!.os) : null,
          situacao: ok ? String(info!.situacao) : null,
          valor: ok ? String(info!.valor) : null,
          status: ok,
        };
      });

      emit("openos:progress", { jobId, step: "db", message: "Salvando OS no banco..." });
      console.log("[OPENOS][PROGRESS] Salvando OS no banco...");
      await Promise.all(
        os.map((row) =>
          addOs({
            id_supply: row.id_supply,
            id_atm: String(row.id_atm),
            os: row.os ?? "",
            situacao: row.situacao ?? "",
            valor: row.valor ?? "",
            status: row.status,
          } as any)
        )
      );

      emit("openos:progress", { jobId, step: "email", message: "Montando e enviando e-mails..." });
      console.log("[OPENOS][PROGRESS] Montando e enviando e-mails...");
      const byTreasury = new Map<number, SendEmailPayload>();

      for (const s of supplyWithExtras) {
        const tid = Number(s.id_treasury);
        if (!tid) continue;

        const row = os.find((x) => Number(x.id_supply) === Number(s.id_supply));
        const ok = Boolean(row?.status);
        if (!ok) continue;

        if (!byTreasury.has(tid)) {
          byTreasury.set(tid, {
            email: Array.isArray(s.emails) ? s.emails : [],
            id_treasury: tid,
            treasury_name: String(s.treasury_name ?? ""),
            date_on_supply: String(s.date_on_supply ?? ""),
            atms: [],
          });
        }

        const bucket = byTreasury.get(tid)!;

        for (const e of (Array.isArray(s.emails) ? s.emails : [])) {
          const clean = String(e).trim();
          if (clean && !bucket.email.includes(clean)) bucket.email.push(clean);
        }

        bucket.atms.push({
          id_supply: Number(s.id_supply),
          total_exchange: Boolean(s.total_exchange),
          cassete_a: Number(s.cassete_A ?? 0),
          cassete_b: Number(s.cassete_B ?? 0),
          cassete_c: Number(s.cassete_C ?? 0),
          cassete_d: Number(s.cassete_D ?? 0),
          id_atm: Number(s.id_atm),
          atm_name: String(s.atm_name ?? ""),
          os: row?.os ?? undefined,
        });

        if (!bucket.date_on_supply) bucket.date_on_supply = String(s.date_on_supply ?? "");
      }

      const emailPayloads = Array.from(byTreasury.values());

      let idx = 0;
      for (const payload of emailPayloads) {
        idx++;

        if (!payload.email?.length || !payload.atms?.length) {
          emit("openos:progress", {
            jobId,
            step: "email-skip",
            current: idx,
            total: emailPayloads.length,
            message: `Pulando ${payload.id_treasury} (sem emails/atms)`,
          });
          continue;
        }

        emit("openos:progress", {
          jobId,
          step: "email-send",
          current: idx,
          total: emailPayloads.length,
          message: `Enviando: ${payload.id_treasury} - ${payload.treasury_name}`,
        });

        await sendEmailOnOS(payload);
      }

      const allOk = os.every((x) => x.status === true);
      console.log("[OPENOS][DONE] Finalizado com sucesso!");
      emit("openos:done", { jobId, ok: allOk, os });
    } catch (e: any) {
       console.log("[OPENOS][DONE] Erro ao finalizar!");
      emit("openos:error", {
        jobId,
        ok: false,
        error: "Falha ao gerar OS via automação",
        details: e?.message ?? String(e),
      });
    }
  });

  return;
};
