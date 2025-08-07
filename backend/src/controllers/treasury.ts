import { RequestHandler } from "express";
import { treasuryAddSchema } from "../schemas/treasuryAdd";
import { addBalanceInTreasuryByIdSystem, addTreasury, delTreasury, getAllTreasury, getAllTreasuryPagination, getForIdSystem, getForIdSystemEdit, getTreasuriesInOrderForDate, updateTreasury } from "../services/treasury";
import { treasuryAddBalanceSchema } from "../schemas/treasuryAddBalance";
import { getIdTreasuriesOrderByDate } from "../services/order";
import { returnDate } from "../utils/returnDate";

export const getAll: RequestHandler = async (req, res) => {
  const treasury = await getAllTreasury()
  if (!treasury) {
    res.status(401).json({ error: 'Erro ao carregar!' })
    return
  }
  res.json({ treasury })

}

export const getAllPagination: RequestHandler = async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 15;
  const skip = (page - 1) * pageSize;

  const treasury = await getAllTreasuryPagination(page, pageSize)

  if (!treasury) {
    res.status(401).json({ error: 'Erro ao carregar!' })
    return
  }
  res.json({ treasury })

}

export const getByIdSystem: RequestHandler = async (req, res) => {
  const treasuryId = req.params.id
  const treasury = await getForIdSystemEdit(treasuryId)
  if (!treasury) {
    res.status(401).json({ error: 'Erro ao salvar!' })
    return
  }

  res.json({ treasury })
}

export const add: RequestHandler = async (req, res) => {

  const safeData = treasuryAddSchema.safeParse(req.body)
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors })
    return
  }
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
    res.status(401).json({ error: 'Erro ao salvar!' })
    return
  }

  res.json({ treasury: newTreasury })
}

export const update: RequestHandler = async (req, res) => {
  const treasuryId = req.params.id
  const safeData = treasuryAddSchema.safeParse(req.body)
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  const updateT = await updateTreasury(parseInt(treasuryId), safeData.data)
  if (!updateT) {
    res.status(401).json({ error: 'Erro ao Editar!' })
    return
  }

  res.json({ treasury: updateT })

}

export const del: RequestHandler = async (req, res) => {
  const treasuryId = req.params.id
  if (!treasuryId) {
    res.status(400).json({ error: 'ID da transportadora é necessário!' })
    return
  }
  const delT = await delTreasury(parseInt(treasuryId))
  if (!delT) {
    res.status(401).json({ error: 'Erro ao Editar!' })
    return
  }

  res.json({ treasury: delT })

}


export const addSaldo: RequestHandler = async (req, res) => {
  const treasuryId = req.params.id
  const safeData = treasuryAddBalanceSchema.safeParse(req.body)
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  const treasury = await getForIdSystem(treasuryId)
  if (!treasury) {
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
    res.json({ error: 'Falha ao atualizar saldo!' })
    return
  }
  res.json({ treasury: newBalance })
}

export const minusSaldo: RequestHandler = async (req, res) => {
  const treasuryId = req.params.id
  const safeData = treasuryAddBalanceSchema.safeParse(req.body)
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  const treasury = await getForIdSystem(treasuryId)
  if (!treasury) {
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
    res.json({ error: 'Falha ao atualizar saldo!' })
    return
  }
  res.json({ treasury: newBalance })
}

export const getTreasuriesForID: RequestHandler = async (req, res) => {
  const ids = req.body
  if (ids.length === 0) {
    res.status(400).json({ error: 'Precisamos de IDs para continuar' })
     return
   }

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
  console.log("treasuries", treasuries)
  if (!treasuries) {
    res.json({ error: 'Transportadora não localizada!' })
    return
  }
  res.json({ treasury: treasuries })

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
export const getTreasuriesInOrderByDate: RequestHandler = async (req, res) => {0
  const date = req.params.date
  if (!date || date === "") {
    res.status(400).json({ error: 'Data inválida!' })
    return
  }
  const orders = await getIdTreasuriesOrderByDate(date)
  if (!orders || orders.length === 0) {
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
        observation: order.observation ,
        date_order : order.date_order
      })
    }else{
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
        treasury_destin_name: t_name_d?.name_for_email ?? "" ,
        composiotion_change: order.composition_change,
        observation: order.observation,
        date_order : order.date_order
      })
    }
  }
  if (orderWithTreasury) {
    res.json({ treasury : orderWithTreasury })
    return
  } else {
    res.status(400).json({ error: 'Nenhum pedido encontrado para esta data.' })
    return
  }



}
