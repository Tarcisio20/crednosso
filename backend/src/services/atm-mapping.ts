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
      orderBy: [
        {
          id_atm: "asc",
        },
        {
          createdAt: "desc",
        },
        {
          id: "desc",
        },
      ],
    });

    const latestByAtm = new Map<string, (typeof atmMonitoring)[number]>();

    for (const item of atmMonitoring) {
      const key = String(item.id_atm);

      if (!latestByAtm.has(key)) {
        latestByAtm.set(key, item);
      }
    }

    const latestMonitoring = Array.from(latestByAtm.values()).sort((a, b) => {
      const idA = Number(String(a.id_atm).replace(/\D/g, ""));
      const idB = Number(String(b.id_atm).replace(/\D/g, ""));

      return idA - idB;
    });

    return latestMonitoring;
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