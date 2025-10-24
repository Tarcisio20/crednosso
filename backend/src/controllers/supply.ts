import { RequestHandler } from "express"
import { supplyAddSchema } from "../schemas/supplyAddSchema"
import { addSupply, getAllForDate, getAllForDateAndTreasury, getAllForDatePagination, getAllSupply, getAtmWitSupplyForIdAndDate, getSupplyByOrder, getSupplyForIdTreasury, lastRegister } from "../services/supply"
import { formatedDateToPTBRforEnglish } from "../utils/formatedDateToPTBRforEnglish"
import { returnDateFormatted } from "../utils/returnDateFormatted"
import { returnDateFormattedEnd } from "../utils/returnDateFormattedEnd"
import { Prisma } from "@prisma/client"
import { createLog } from "services/logService"
import { date, z } from "zod"

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
    const supply = await getAllForDate(returnDateFormatted(formatedDateToPTBRforEnglish(data.date)), returnDateFormattedEnd(formatedDateToPTBRforEnglish(data.date)))
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