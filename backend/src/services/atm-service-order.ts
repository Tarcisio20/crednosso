import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";

export const addAtmServiceOrder = async (data: Prisma.AtmServiceOrderUncheckedCreateInput) => {
    try {
        await prisma.atmServiceOrder.create({
            data,
        }); 
    }catch (error) {
        console.error("Error adding ATM service order:", error);
        return false;
    }
  return true;
};