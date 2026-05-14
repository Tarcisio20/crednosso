import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";


export const addAtmMonitoring = async (data: Prisma.AtmMonitoringCreateInput) => {
  try {
    const atmMonitoring = await prisma.atmMonitoring.create({ data })
    return atmMonitoring
  } catch (err) {
    console.log("SERVICE => [ATM_MONITORING] *** FUNCTION => [ADD_ATM_MONITORING] *** ERROR =>", err)
    return null
  }

}