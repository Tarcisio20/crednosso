import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";

export const getAllDownload = async () => {
    const bank = await prisma.accountBank.findMany({
        where : {  status : true}
    })
    if(bank){
        return bank
    }
    return null
}