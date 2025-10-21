import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";

export const getAllDownload = async () => {
  try {
    return await prisma.accountBank.findMany({
      where: { status: true }
    })
  } catch (err) {
    console.log("SERVICE => [DOWNLOAD] *** FUNCTION => [GET_ALL_DOWNLOAD] *** ERROR =>", err)
    return null
  }
}