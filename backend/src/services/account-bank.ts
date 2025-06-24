
import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";

export const getAllAccountPagination = async (page: number, pageSize: number) => {
    try {
        const skip = (page - 1) * pageSize;
        const [data, totalItems] = await prisma.$transaction([
            prisma.accountBank.findMany({
                skip: skip,
                take: pageSize,
                where: { status: true },
            }),
            prisma.accountBank.count({
                where: { status: true }
            })
        ])

        return {
            data,
            totalItems,
            totalPages: Math.ceil(totalItems / pageSize)
        };
    } catch (error) {
        console.error('Erro no service:', error);
        return null;
    }
}

export const addAccountBank = async (data : Prisma.AccountBankCreateInput) => {
    const account = await prisma.accountBank.create({ data })
    if(account){
        return account
    }
    return null
}

export const getForId = async (id : number ) => {
    const accountBank = await prisma.accountBank.findFirst({
        where : { id : id  }
    })
    if(accountBank){
        return accountBank
    }
    return null
}

export const updateAccountBank = async (id : number , data : Prisma.AccountBankUpdateInput) => {
    const editAccount = await prisma.accountBank.update({
        where : {
            id : id
        },
        data
    }) 
    if(editAccount){
        return editAccount
    }
    return null
}