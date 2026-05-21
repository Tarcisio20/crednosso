import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";


export const getAllAtmMonitoring = async (date: string) => {
  try {
    const [year, month, day] = date.split("-").map(Number);

    const startDate = new Date(year, month - 1, day, 0, 0, 0, 0);
    const endDate = new Date(year, month - 1, day + 1, 0, 0, 0, 0);

    const atmMonitoring = await prisma.atmMonitoring.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: {
        id_atm: "asc",
      },
    });

    return atmMonitoring;
  } catch (err) {
    console.log(
      "SERVICE => [ATM_MONITORING] *** FUNCTION => [GET_ALL_ATM_MONITORING] *** ERROR =>",
      err
    );
    return null;
  }
};

export const addAtmMonitoring = async (data: Prisma.AtmMonitoringCreateInput) => {
  try {
    const newAtmMonitoring = await prisma.atmMonitoring.create({
      data,
    });    
    return newAtmMonitoring;
  } catch (err) {
    console.log(
      "SERVICE => [ATM_MONITORING] *** FUNCTION => [ADD_ATM_MONITORING] *** ERROR =>",
      err
    );
    return null;
  }
};