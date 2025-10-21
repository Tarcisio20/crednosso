import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";

export const getAllBank = async () => {
  try {
    const bank = await prisma.accountBank.findMany({
      where: { status: true }
    })
    return bank
  } catch (err) {
    console.log("SERVICE => [BANK] *** FUNCTION => [GET_ALL_BANK] *** ERROR =>", err)
    return null
  }
}