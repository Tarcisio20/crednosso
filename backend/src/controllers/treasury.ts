import { RequestHandler } from "express";
import { treasuryAddSchema } from "../schemas/treasuryAdd";
import { addBalanceInTreasuryByIdSystem, addTreasury, delTreasury, getAllTreasury, getAllTreasuryPagination, getForIdSystem, getForIdSystemEdit, getTreasuriesInOrderForDate, updateTreasury } from "../services/treasury";
import { treasuryAddBalanceSchema } from "../schemas/treasuryAddBalance";
import { getIdTreasuriesOrderByDate } from "../services/order";
import { createLog } from "services/logService";

export const getAll: RequestHandler = async (req, res) => {
  try {
    const treasury = await getAllTreasury()
    if (!treasury) {
      await createLog({
        level: "ERROR",
        action: "GET_ALL_TREASURY",
        message: "Erro ao carregar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 401,
        resource: "treasury",
        meta: { error: "Erro ao carregar!" },
      })
      res.status(401).json({ error: 'Erro ao carregar!' })
      return
    }
    await createLog({
      level: "INFO",
      action: "GET_ALL_TREASURY",
      message: "Sucesso ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "treasury",
      meta: { message: "Sucesso ao carregar!" },
    })
    res.status(200).json({ treasury })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_ALL_TREASURY",
      message: "Erro ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "treasury",
      meta: { error: "Erro ao carregar!" },
    })
    res.status(401).json({ error: 'Erro ao carregar!' })
    return
  }
}

export const getAllPagination: RequestHandler = async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 15;
  const skip = (page - 1) * pageSize;
  try {
    const treasury = await getAllTreasuryPagination(page, pageSize)

    if (!treasury) {
      await createLog({
        level: "ERROR",
        action: "GET_ALL_TREASURY_PAGINATION",
        message: "Erro ao carregar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 401,
        resource: "treasury",
        meta: { error: "Erro ao carregar!" },
      })
      res.status(401).json({ error: 'Erro ao carregar!' })
      return
    }
    await createLog({
      level: "INFO",
      action: "GET_ALL_TREASURY_PAGINATION",
      message: "Sucesso ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "treasury",
      meta: { message: "Sucesso ao carregar!" },
    })
    res.status(200).json({ treasury })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_ALL_TREASURY_PAGINATION",
      message: "Erro ao carregar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "treasury",
      meta: { error: "Erro ao carregar!" },
    })
    res.status(401).json({ error: 'Erro ao carregar!' })
    return
  }
}

export const getByIdSystem: RequestHandler = async (req, res) => {
  const treasuryId = req.params.id
  if (!treasuryId || isNaN(parseInt(treasuryId))) {
    await createLog({
      level: "ERROR",
      action: "GET_TREASURY_BY_ID_SYSTEM",
      message: "Requisição sem ID!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "treasury",
      meta: { error: "Requisição sem ID!" },
    })
    res.status(401).json({ error: "Requisição sem ID!" })
    return
  }
  try {
    const treasury = await getForIdSystemEdit(treasuryId)
    if (!treasury) {
      await createLog({
        level: "ERROR",
        action: "GET_TREASURY_BY_ID_SYSTEM",
        message: "Erro ao salvar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 401,
        resource: "treasury",
        meta: { error: "Erro ao salvar!" },
      })
      res.status(401).json({ error: 'Erro ao salvar!' })
      return
    }
    await createLog({
      level: "INFO",
      action: "GET_TREASURY_BY_ID_SYSTEM",
      message: "Sucesso ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "treasury",
      meta: { message: "Sucesso ao salvar!" },
    })
    res.status(200).json({ treasury })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_TREASURY_BY_ID_SYSTEM",
      message: "Erro ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "treasury",
      meta: { error: "Erro ao salvar!" },
    })
    res.status(401).json({ error: 'Erro ao salvar!' })
    return
  }
}

export const add: RequestHandler = async (req, res) => {

  const safeData = treasuryAddSchema.safeParse(req.body)
  if (!safeData.success) {
    await createLog({
      level: "ERROR",
      action: "ADD_TREASURY",
      message: "Erro ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "treasury",
      meta: { error: safeData.error.flatten().fieldErrors },
    })
    res.json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  try {
    const data = {
      id_system: safeData.data.id_system,
      typeSupply: {
        connect: {
          id: safeData.data.id_type_supply
        }
      },
      typeStore: {
        connect: {
          id: safeData.data.id_type_store
        }
      },
      enabled_gmcore: safeData.data.enabled_gmcore as boolean,
      name: safeData.data.name,
      short_name: safeData.data.short_name,
      region: safeData.data.region,
      account_number: safeData.data.account_number,
      gmcore_number: safeData.data.gmcore_number,
      name_for_email: safeData.data.name_for_email ?? "",
      account_number_for_transfer: safeData.data.account_number_for_transfer
    }
    const newTreasury = await addTreasury({
      id_system: safeData.data.id_system,
      typeSupply: {
        connect: {
          id: safeData.data.id_type_supply
        }
      },
      typeStore: {
        connect: {
          id: safeData.data.id_type_store
        }
      },
      enabled_gmcore: safeData.data.enabled_gmcore as boolean,
      name: safeData.data.name,
      short_name: safeData.data.short_name,
      region: safeData.data.region,
      account_number: safeData.data.account_number,
      gmcore_number: safeData.data.gmcore_number,
      name_for_email: safeData.data.name_for_email ?? "",
      account_number_for_transfer: safeData.data.account_number_for_transfer
    })
    if (!newTreasury) {
      await createLog({
        level: "ERROR",
        action: "ADD_TREASURY",
        message: "Erro ao salvar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 401,
        resource: "treasury",
        meta: { error: "Erro ao salvar!" },
      })
      res.status(401).json({ error: 'Erro ao salvar!' })
      return
    }
    await createLog({
      level: "INFO",
      action: "ADD_TREASURY",
      message: "Sucesso ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "treasury",
      meta: { message: "Sucesso ao salvar!" },
    })
    res.status(200).json({ treasury: newTreasury })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "ADD_TREASURY",
      message: "Erro ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "treasury",
      meta: { error: "Erro ao salvar!" },
    })
    res.status(401).json({ error: 'Erro ao salvar!' })
    return
  }

}

export const update: RequestHandler = async (req, res) => {
  const treasuryId = req.params.id
  if (!treasuryId || isNaN(parseInt(treasuryId))) {
    await createLog({
      level: "ERROR",
      action: "UPDATE_TREASURY",
      message: "Requisição sem ID!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "treasury",
      meta: { error: "Requisição sem ID!" },
    })
    res.status(401).json({ error: 'Requisição sem ID!' })
    return
  }
  const safeData = treasuryAddSchema.safeParse(req.body)
  if (!safeData.success) {
    await createLog({
      level: "ERROR",
      action: "UPDATE_TREASURY",
      message: "Erro ao Editar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "treasury",
      meta: { error: safeData.error.flatten().fieldErrors },
    })
    res.json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  try {
    const updateT = await updateTreasury(parseInt(treasuryId), safeData.data)
    if (!updateT) {
      await createLog({
        level: "ERROR",
        action: "UPDATE_TREASURY",
        message: "Erro ao Editar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 401,
        resource: "treasury",
        meta: { error: "Erro ao Editar!" },
      })
      res.status(401).json({ error: 'Erro ao Editar!' })
      return
    }
    await createLog({
      level: "INFO",
      action: "UPDATE_TREASURY",
      message: "Sucesso ao Editar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "treasury",
      meta: { message: "Sucesso ao Editar!" },
    })
    res.status(200).json({ treasury: updateT })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "UPDATE_TREASURY",
      message: "Erro ao Editar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "treasury",
      meta: { error: "Erro ao Editar!" },
    })
    res.status(401).json({ error: 'Erro ao Editar!' })
    return
  }

}

export const del: RequestHandler = async (req, res) => {
  const treasuryId = req.params.id
  if (!treasuryId || isNaN(parseInt(treasuryId))) {
    await createLog({
      level: "ERROR",
      action: "DEL_TREASURY",
      message: "ID da transportadora é necessário!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "treasury",
      meta: { error: "ID da transportadora é necessário!" },
    })
    res.status(400).json({ error: 'ID da transportadora é necessário!' })
    return
  }
  try {
    const delT = await delTreasury(parseInt(treasuryId))
    if (!delT) {
      await createLog({
        level: "ERROR",
        action: "DEL_TREASURY",
        message: "Erro ao Editar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 401,
        resource: "treasury",
        meta: { error: "Erro ao Editar!" },
      })
      res.status(401).json({ error: 'Erro ao Editar!' })
      return
    }
    await createLog({
      level: "INFO",
      action: "DEL_TREASURY",
      message: "Sucesso ao Editar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "treasury",
      meta: { message: "Sucesso ao Editar!" },
    })
    res.status(200).json({ treasury: delT })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "DEL_TREASURY",
      message: "Erro ao Editar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: "treasury",
      meta: { error: "Erro ao Editar!" },
    })
    res.status(401).json({ error: 'Erro ao Editar!' })
    return
  }
}

export const addSaldo: RequestHandler = async (req, res) => {
  const treasuryId = req.params.id
  if (!treasuryId || isNaN(parseInt(treasuryId))) {
    await createLog({
      level: "ERROR",
      action: "ADD_SALDO_TREASURY",
      message: "ID da transportadora é indispensável!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "treasury",
      meta: { error: "ID da transportadora é indispensável!" },
    })
    res.status(400).json({
      error: 'ID da transportadora é indispensável!'
    })
  }
  const safeData = treasuryAddBalanceSchema.safeParse(req.body)
  if (!safeData.success) {
    await createLog({
      level: "ERROR",
      action: "ADD_SALDO_TREASURY",
      message: "Erro ao adicionar saldo!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "treasury",
      meta: { error: safeData.error.flatten().fieldErrors },
    })
    res.json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  try {
    const treasury = await getForIdSystem(treasuryId)
    if (!treasury) {
      await createLog({
        level: "ERROR",
        action: "ADD_SALDO_TREASURY",
        message: "Transportadora não localizada!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "treasury",
        meta: { error: "Transportadora não localizada!" },
      })
      res.json({ error: 'Transportadora não localizada!' })
      return
    }
    const data = {
      bills_10: treasury?.bills_10 + (safeData.data.bills_10 ?? 0),
      bills_20: treasury?.bills_20 + (safeData.data.bills_20 ?? 0),
      bills_50: treasury?.bills_50 + (safeData.data.bills_50 ?? 0),
      bills_100: treasury?.bills_100 + (safeData.data.bills_100 ?? 0),
    }
    const newBalance = await addBalanceInTreasuryByIdSystem(parseInt(treasuryId), data)
    if (!newBalance?.id) {
      await createLog({
        level: "ERROR",
        action: "ADD_SALDO_TREASURY",
        message: "Falha ao atualizar saldo!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "treasury",
        meta: { error: "Falha ao atualizar saldo!" },
      })
      res.json({ error: 'Falha ao atualizar saldo!' })
      return
    }
    await createLog({
      level: "INFO",
      action: "ADD_SALDO_TREASURY",
      message: "Sucesso ao adicionar saldo!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "treasury",
      meta: { message: "Sucesso ao adicionar saldo!" },
    })
    res.status(200).json({ treasury: newBalance })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "ADD_SALDO_TREASURY",
      message: "Erro ao adicionar saldo!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "treasury",
      meta: { error: "Erro ao adicionar saldo!" },
    })
    res.json({ error: 'Erro ao adicionar saldo!' })
    return
  }
}

export const minusSaldo: RequestHandler = async (req, res) => {
  const treasuryId = req.params.id
  if (!treasuryId || isNaN(parseInt(treasuryId))) {
    await createLog({
      level: "ERROR",
      action: "MINUS_SALDO_TREASURY",
      message: "ID da transportadora é indispensável!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "treasury",
      meta: { error: "ID da transportadora é indispensável!" },
    })
    res.status(400).json({
      error: 'ID da transportadora é indispensável!'
    })
    return
  }
  const safeData = treasuryAddBalanceSchema.safeParse(req.body)
  if (!safeData.success) {
    await createLog({
      level: "ERROR",
      action: "MINUS_SALDO_TREASURY",
      message: "Erro ao adicionar saldo!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "treasury",
      meta: { error: safeData.error.flatten().fieldErrors },
    })
    res.json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  try {
    const treasury = await getForIdSystem(treasuryId)
    if (!treasury) {
      await createLog({
        level: "ERROR",
        action: "MINUS_SALDO_TREASURY",
        message: "Transportadora não localizada!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "treasury",
        meta: { error: "Transportadora não localizada!" },
      })
      res.json({ error: 'Transportadora não localizada!' })
      return
    }
    const data = {
      bills_10: treasury?.bills_10 - (safeData.data.bills_10 ?? 0),
      bills_20: treasury?.bills_20 - (safeData.data.bills_20 ?? 0),
      bills_50: treasury?.bills_50 - (safeData.data.bills_50 ?? 0),
      bills_100: treasury?.bills_100 - (safeData.data.bills_100 ?? 0),
    }
    const newBalance = await addBalanceInTreasuryByIdSystem(parseInt(treasuryId), data)
    if (!newBalance?.id) {
      await createLog({
        level: "ERROR",
        action: "MINUS_SALDO_TREASURY",
        message: "Falha ao atualizar saldo!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "treasury",
        meta: { error: "Falha ao atualizar saldo!" },
      })
      res.json({ error: 'Falha ao atualizar saldo!' })
      return
    }
    res.status(200).json({ treasury: newBalance })
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "MINUS_SALDO_TREASURY",
      message: "Erro ao adicionar saldo!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "treasury",
      meta: { error: "Erro ao adicionar saldo!" },
    })
    res.json({ error: 'Erro ao adicionar saldo!' })
    return
  }
}

export const getTreasuriesForID: RequestHandler = async (req, res) => {
  const ids = req.body
  if (ids.length === 0) {
    await createLog({
      level: "ERROR",
      action: "GET_TREASURIES_FOR_ID",
      message: "Precisamos de IDs para continuar",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "treasury",
      meta: { error: "Precisamos de IDs para continuar" },
    })
    res.status(400).json({ error: 'Precisamos de IDs para continuar' })
    return
  }
  try {
    const treasuries = []
    for (let x = 0; ids.length > x; x++) {
      const t = await getForIdSystem(ids[x])
      if (t && t.id > 0) {
        treasuries.push({
          id: t?.id,
          id_system: t?.id_system,
          name: t?.name,
          bills_10: t?.bills_10,
          bills_20: t?.bills_20,
          bills_50: t?.bills_50,
          bills_100: t?.bills_100,
        })
      }
    }

    if (!treasuries) {
      await createLog({
        level: "ERROR",
        action: "GET_TREASURIES_FOR_ID",
        message: "Transportadora não localizada!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "treasury",
        meta: { error: "Transportadora não localizada!" },
      })
      res.json({ error: 'Transportadora não localizada!' })
      return
    }
    await createLog({
      level: "INFO",
      action: "GET_TREASURIES_FOR_ID",
      message: "Transportadoras localizadas com sucesso!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "treasury",
      meta: { error: "Transportadoras localizadas com sucesso!" },
    })
    res.status(200).json({ treasury: treasuries })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_TREASURIES_FOR_ID",
      message: "Erro ao adicionar saldo!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "treasury",
      meta: { error: "Erro ao adicionar saldo!" },
    })
    res.json({ error: 'Erro ao adicionar saldo!' })
    return
  }


}
type OrderWithTreasuryProps = {
  id_order: number,
  id_type_operation: number,
  id_treasury_origin: number,
  id_treasury_destin: number,
  requested_value_A: number,
  requested_value_B: number,
  requested_value_C: number,
  requested_value_D: number,
  confirmed_value_A: number,
  confirmed_value_B: number,
  confirmed_value_C: number,
  confirmed_value_D: number,
  status_order: number;
  treasury_origin_name: string;
  treasury_destin_name: string;
  composiotion_change: boolean;
  observation: string;
  date_order: Date;
}
export const getTreasuriesInOrderByDate: RequestHandler = async (req, res) => {
  const date = req.params.date
  if (!date || date === "") {
    await createLog({
      level: "ERROR",
      action: "GET_TREASURIES_IN_ORDER_BY_DATE",
      message: "Data inválida!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "order",
      meta: { error: "Data inválida!" },
    })
    res.status(400).json({ error: 'Data inválida!' })
    return
  }
  try {
    const orders = await getIdTreasuriesOrderByDate(date)
    if (!orders || orders.length === 0) {
      await createLog({
        level: "ERROR",
        action: "GET_TREASURIES_IN_ORDER_BY_DATE",
        message: "Nenhum pedido encontrado para esta data.",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "order",
        meta: { error: "Nenhum pedido encontrado para esta data." },
      })
      res.status(400).json({ error: 'Nenhum pedido encontrado para esta data.' })
      return
    }
    const orderWithTreasury: OrderWithTreasuryProps[] = []

    for (const order of orders) {
      if (order.id_treasury_origin === order.id_treasury_destin) {
        const t_name = await getForIdSystem(order.id_treasury_origin.toString());
        orderWithTreasury.push({
          id_order: order.id,
          id_type_operation: order.id_type_operation,
          id_treasury_origin: order.id_treasury_origin,
          id_treasury_destin: order.id_treasury_destin,
          requested_value_A: order.requested_value_A,
          requested_value_B: order.requested_value_B,
          requested_value_C: order.requested_value_C,
          requested_value_D: order.requested_value_D,
          confirmed_value_A: order.confirmed_value_A,
          confirmed_value_B: order.confirmed_value_B,
          confirmed_value_C: order.confirmed_value_C,
          confirmed_value_D: order.confirmed_value_D,
          status_order: order.status_order,
          treasury_origin_name: t_name?.name_for_email ?? "",
          treasury_destin_name: t_name?.name_for_email ?? "",
          composiotion_change: order.composition_change,
          observation: order.observation,
          date_order: order.date_order
        })
      } else {
        const t_name_o = await getForIdSystem(order.id_treasury_origin.toString());
        const t_name_d = await getForIdSystem(order.id_treasury_destin.toString());
        orderWithTreasury.push({
          id_order: order.id,
          id_type_operation: order.id_type_operation,
          id_treasury_origin: order.id_treasury_origin,
          id_treasury_destin: order.id_treasury_destin,
          requested_value_A: order.requested_value_A,
          requested_value_B: order.requested_value_B,
          requested_value_C: order.requested_value_C,
          requested_value_D: order.requested_value_D,
          confirmed_value_A: order.confirmed_value_A,
          confirmed_value_B: order.confirmed_value_B,
          confirmed_value_C: order.confirmed_value_C,
          confirmed_value_D: order.confirmed_value_D,
          status_order: order.status_order,
          treasury_origin_name: t_name_o?.name_for_email ?? "",
          treasury_destin_name: t_name_d?.name_for_email ?? "",
          composiotion_change: order.composition_change,
          observation: order.observation,
          date_order: order.date_order
        })
      }
    }
    if (orderWithTreasury) {
      await createLog({
        level: "INFO",
        action: "GET_TREASURIES_IN_ORDER_BY_DATE",
        message: "Pedidos encontrados com sucesso!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 200,
        resource: "order",
        meta: { message: "Pedidos encontrados com sucesso!" },
      })
      res.status(200).json({ treasury: orderWithTreasury })
      return
    } else {
      await createLog({
        level: "ERROR",
        action: "GET_TREASURIES_IN_ORDER_BY_DATE",
        message: "Nenhum pedido encontrado para esta data.",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "order",
        meta: { error: "Nenhum pedido encontrado para esta data." },
      })
      res.status(400).json({ error: 'Nenhum pedido encontrado para esta data.' })
      return
    }
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_TREASURIES_IN_ORDER_BY_DATE",
      message: "Erro ao buscar pedidos! " + error,
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "order",
      meta: { error: "Erro ao buscar pedidos! " + error },
    })
  }

}
