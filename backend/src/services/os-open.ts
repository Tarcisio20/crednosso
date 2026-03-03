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