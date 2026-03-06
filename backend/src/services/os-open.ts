import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";

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