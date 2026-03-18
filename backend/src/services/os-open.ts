import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { getForId } from "./atm";


export const getOsForId = async (id : number) => {
  try{
    return await prisma.osOpen.findUnique({ where : { id } })
  }catch(error){
    console.log("SERVICE => [OPEN OS] *** FUNCTION => [GET_OS_FOR_ID_SUPPLY] *** ERROR =>", error)
    return null
  }
}

export const getOsOpenInTableForDay = async (
  date: string,
  page: number = 1,
  limit: number = 10
) => {
  try {
    const start = new Date(`${date}T00:00:00.000`);
    const nextDay = new Date(`${date}T00:00:00.000`);
    nextDay.setDate(nextDay.getDate() + 1);

    const skip = (page - 1) * limit;

    const where = {
      date_os: {
        gte: start,
        lt: nextDay,
      },
    };

    const [rows, total] = await Promise.all([
      prisma.osOpen.findMany({
        where,
        orderBy: {
          date_os: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.osOpen.count({
        where,
      }),
    ]);

    const idsAtmUnique = [...new Set(rows.map((item) => Number(item.id_atm)))];

    const atms = await Promise.all(
      idsAtmUnique.map(async (idAtm) => {
        const atm = await getForId(idAtm);
        return {
          id_atm: idAtm,
          atm_name: atm?.short_name ?? "-",
        };
      })
    );

    const atmMap = new Map(
      atms.map((atm) => [String(atm.id_atm), atm.atm_name])
    );

    const rowsWithAtmName = rows.map((item) => ({
      ...item,
      terminal: item.id_atm,
      atm_name: atmMap.get(String(item.id_atm)) ?? "-",
    }));

    return {
      data: rowsWithAtmName,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.log(
      "SERVICE => [OS OPEN] *** FUNCTION => [GET_OS_OPEN_IN_TABLE_FOR_DAY] *** ERROR =>",
      error
    );
    return null;
  }
};

export const getAllOsOpenInTableForDay = async (date: string) => {
  try {
    const start = new Date(`${date}T00:00:00.000`);
    const nextDay = new Date(`${date}T00:00:00.000`);
    nextDay.setDate(nextDay.getDate() + 1);

    const where = {
      date_os: {
        gte: start,
        lt: nextDay,
      },
    };

    const [rows, total] = await Promise.all([
      prisma.osOpen.findMany({
        where,
      }),
      prisma.osOpen.count({
        where,
      }),
    ]);

    const idsAtmUnique = [...new Set(rows.map((item) => Number(item.id_atm)))];

    const atms = await Promise.all(
      idsAtmUnique.map(async (idAtm) => {
        const atm = await getForId(idAtm);
        return {
          id_atm: idAtm,
          atm_name: atm?.short_name ?? "-",
        };
      })
    );

    const atmMap = new Map(
      atms.map((atm) => [String(atm.id_atm), atm.atm_name])
    );

    const rowsWithAtmName = rows.map((item) => ({
      ...item,
      terminal: item.id_atm,
      atm_name: atmMap.get(String(item.id_atm)) ?? "-",
    }));

    return {
      data: rowsWithAtmName,
      total,
    };
  } catch (error) {
    console.log(
      "SERVICE => [OS OPEN] *** FUNCTION => [GET_OS_OPEN_IN_TABLE_FOR_DAY] *** ERROR =>",
      error
    );
    return null;
  }
};
export const addOs = async (data : Prisma.OsOpenCreateInput) => {
 try {
    return await prisma.osOpen.create({ data })
  } catch (err) {
    console.log("SERVICE => [OPEN OS] *** FUNCTION => [ADD_ADDOS] *** ERROR =>", err)
    return null
  }
}

export const updateOS = async (id : number, data : Prisma.OsOpenUpdateInput) => {
  try {
    return await prisma.osOpen.update({ where : { id }, data })
  } catch (err) {
    console.log("SERVICE => [UPDATE OS] *** FUNCTION => [UPDATE_OS] *** ERROR =>", err)
    return null
  }
}

export const delOS = async ( id_supply : number) => {
  //console.log("id_atm", id_atm, "id_supply", id_supply)
  try {
    return await prisma.osOpen.updateMany({
      where : {
        id_supply
      },
      data : { status : false }
    })
  }catch (err) {
    console.log("SERVICE => [DEL OS] *** FUNCTION => [DEL_OS] *** ERROR =>", err)
    return null
  }
}